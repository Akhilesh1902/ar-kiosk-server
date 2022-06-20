import { sendMailToUser } from './sendMailToUser.js';
import fs from 'fs';

export const onConnection = (socket, mongoClient) => {
  const imgFolder = '/static/images/';
  socket = socket;
  console.log('connected');
  console.log('socket ID : ', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    // mongoClient.disconnect();
  });

  socket.on('send_image', ({ screenShot, userEmail }) => {
    console.log('sending image to user');
    // console.log(screenShot);
    let imgData = screenShot.replace(/^data:image\/\w+;base64,/, '');
    let buff = Buffer.from(imgData, 'base64');

    fs.writeFile('image.png', buff, (img, err) => {
      console.log(err);
      console.log(img);
    });
    sendMailToUser(userEmail);
  });

  socket.on('_image_update', async ({ imgData }) => {
    // console.log(imgData);
    const { name, type } = imgData;
    const addr = `${imgFolder}${name}`;

    switch (type) {
      case 'addition': {
        handleImageAddition({ ...imgData, addr });
        break;
      }
      case 'deletion': {
        handleImageDeletion(name);
        break;
      }
      default:
        console.log('wrong type');
    }
  });

  const writeImageFile = (buff, addr) => {
    console.log(`writing new image file in ${addr}`);
    fs.writeFile(`.${addr}`, buff, (img, err) => {
      console.log(err);
    });
  };

  const handleImageAddition = async (imageData) => {
    console.log(imageData.addr);
    const result = await mongoClient.updateImages(imageData);
    if (result.matchedCount) {
      return;
    }
    writeImageFile(imageData.file, imageData.addr);
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
