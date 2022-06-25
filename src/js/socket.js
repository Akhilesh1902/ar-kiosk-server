import { sendMailToUser } from './sendMailToUser.js';
import fs from 'fs';

export const onConnection = (socket, mongoClient) => {
  const imgFolder = '/static/images/';
  const videoFolder = '/static/videos/';
  const thumbFolder = '/static/thumbnail/';
  socket = socket;
  // console.log('connected');
  // console.log('socket ID : ', socket.id);

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

  socket.on('_image_update', async ({ imgData, updateType }) => {
    // console.log(imgData);

    // const { name, thumbName } = imgData;
    // const addr = `${imgFolder}${name}`;
    // const thumbnailUrl = `${thumbFolder}${thumbName}`;

    switch (updateType) {
      case 'addition': {
        handleImageAddition(imgData);
        break;
      }
      case 'deletion': {
        handleImageDeletion(name);
        break;
      }
      case 'video': {
        handleVideoAddition(imgData);
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
  const handleVideoAddition = async (videoData) => {
    console.log('handeling video');
    console.log(videoData);
    const { name, thumbName } = videoData;
    const addr = `${videoFolder}${name}`;
    const thumbnailUrl = `${thumbFolder}${thumbName}`;

    const result = await mongoClient.updateImages({
      ...videoData,
      addr,
      thumbnailUrl,
    });
    if (result.matchedCount) {
      return;
    }
    writeImageFile(videoData.file, addr);
    writeImageFile(videoData.thumbnail, thumbnailUrl);
  };

  const handleImageAddition = async (imageData) => {
    console.log(imageData);
    const { name, thumbName } = imageData;

    const addr = `${imgFolder}${name}`;
    const thumbnailUrl = `${thumbFolder}${thumbName}`;

    console.log(imageData);
    // return;
    const result = await mongoClient.updateImages({
      ...imageData,
      thumbnailUrl,
      addr,
    });
    if (result.matchedCount) {
      return;
    }
    writeImageFile(imageData.file, addr);
    writeImageFile(imageData.thumbnail, thumbnailUrl);
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
