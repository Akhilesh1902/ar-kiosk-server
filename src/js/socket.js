import { sendMailToUser } from './sendMailToUser.js';
import fs from 'fs';

export const onConnection = (socket, mongoClient) => {
  const imgFolder = '/static/images/';

  socket.on('disconnect', () => {
    console.log('user disconnected');
    mongoClient.disconnect();
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

  socket.on('_new_image_upload', ({ imageName, image }) => {
    console.log(localFiles);
    console.log(imageName);
    const folder = './public/images/';
    const addr = `${folder}${imageName}`;
    console.log(image);
    const buff = image;

    switch (type) {
      case 'addition': {
        handleImageAddition(imageName, addr, buff);
        break;
      }
      case 'deletion': {
        handleImageDeletion(imageName);
        break;
      }
      default:
        console.log('wrong type');
    }
  });

  socket.on('__delete_image', ({ img }) => {
    console.log(img);
  });
  const writeImageFile = (buff, addr) => {
    console.log(`writing new image file in ${addr}`);
    fs.writeFile(`.${addr}`, buff, (img, err) => {
      console.log(err);
    });
  };
};
