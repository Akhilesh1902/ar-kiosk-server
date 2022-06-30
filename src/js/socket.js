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
      fileAddr,
    });

    if (result.matchedCount) {
      socket.emit('_exist_in_dataBase', { result });
      return;
    }
    AWS_S3.uploadObject(data.file, fileAddr);
    AWS_S3.uploadObject(data.thumbnail, thumbAddr);
    // return result;
  };

  const handleUpload = (data) => {
    const { name, thumbName } = data;
    pushToDataBase(name, thumbName, data);
  };

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
