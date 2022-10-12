import { sendMailToUser } from './sendMailToUser.js';
import fs from 'fs';

export const onConnection = (socket, mongoClient, AWS_S3) => {
  const imgFolder = '/static/images/';
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('send_image', ({ screenShot, userEmail }) => {
    console.log('sending image to user');
    let imgData = screenShot.replace(/^data:image\/\w+;base64,/, '');
    let buff = Buffer.from(imgData, 'base64');

    fs.writeFile('image.png', buff, (img, err) => {
      console.log(err);
      console.log(img);
    });
    sendMailToUser(socket, userEmail);
  });
  socket.on('_add_model', ({ modelData }) => {
    const { thumbName, thumb, file, name, Class, Subject, material, scale } =
      modelData;
    console.log('getting new Modal');
    console.log(modelData);

    mongoClient.updateData({
      ...modelData,
      fileAddr: `models/${modelData.name}`,
    });
    AWS_S3.uploadObject(file, `models/${name}`);
    socket.emit('model_received', { msg: 'model_received' });
  });

  socket.on('_image_update', async ({ imgData, updateType }) => {
    switch (updateType) {
      case 'addition': {
        handleUpload(imgData);
        break;
      }
      case 'deletion': {
        handleImageDeletion(name);
        break;
      }
      case 'video': {
        handleUpload(imgData);
        break;
      }
      default:
        console.log('wrong type');
    }
  });

  const pushToDataBase = async (name, thumbName, data) => {
    const fileAddr = `file/${name}`;
    const thumbAddr = `thumbnail/${thumbName}`;

    const result = await mongoClient.updateImages({
      ...data,
      thumbAddr,
      thumb: data.thumbnail,
      fileAddr,
    });

    if (result.matchedCount) {
      socket.emit('_exist_in_dataBase', { result });
      return;
    }
    AWS_S3.uploadObject(data.file, fileAddr);
    // AWS_S3.uploadObject(data.thumbnail, thumbAddr);
    // return result;
  };

  const handleUpload = (data) => {
    const { name, thumbName } = data;
    pushToDataBase(name, thumbName, data);
  };

  socket.on('get_file', async ({ Key }) => {
    // console.log(Key);

    const getData = async () => {
      const res = await AWS_S3.readObject(Key, socket);
      // console.log(res);
    };

    getData();
  });

  const handleImageDeletion = async (imagename) => {
    const res = await mongoClient.deleteImage(imagename);
    if (res.deletedCount === 1) {
      fs.unlink(`.${imgFolder}${imagename}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    socket.emit('_image_update');
  };
};
