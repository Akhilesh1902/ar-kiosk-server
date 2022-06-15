import { sendMailToUser } from './sendMailToUser.js';
import fs from 'fs';

export const onConnection = (socket, localFiles) => {
  socket = socket;
  console.log('connected');
  console.log('socket ID : ', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('send_image', ({ screenShot, userEmail }) => {
    console.log('sending image to user');
    // console.log(screenShot);
    let imgData = screenShot.replace(/^data:image\/\w+;base64,/, '');
    let buff = Buffer.from(imgData, 'base64');
    // console.log(buff);
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
    writeImageFile(imageName, buff, addr);
  });

  const writeImageFile = (imageName, buff, addr) => {
    fs.writeFile(addr, buff, (img, err) => {
      console.log(err);
    });
  };
};
