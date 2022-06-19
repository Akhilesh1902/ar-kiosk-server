console.log('hello there');
import Express from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

import { onConnection } from './js/socket.js';
import { MongoClientConnection } from './js/mongo.js';

const mongoClient = new MongoClientConnection();
// const __dirname = path.resolve();
const __dirname = process.cwd();
const app = Express();
app.use(cors());
// adding /static as the prefix for the image url
// path to user : http://localhost:2020/static/images/darshan.jpeg
app.use('/static', Express.static('static'));

const PORT = process.env.PORT || 3030;
const CLIENT_ORIGIN = 'https://ar-kiosk.netlify.app';
const DEV_CLIENT_ORIGIN = 'http://localhost:3000';

const CORS = {
  origin: [CLIENT_ORIGIN, DEV_CLIENT_ORIGIN],
  methods: ['GET', 'POST'],
};
const server = http.createServer(app, {
  cors: CORS,
});
const io = new Server(server, {
  cors: CORS,
});

let ImagesJson = [];
let localFiles;
const folder = './static/images/';

let fsTimeout;
fs.watch(folder, { persistent: true }, (e, fileName) => {
  if (!fsTimeout) {
    console.log('file.js %s event', e);
    makeArr();
    fsTimeout = setTimeout(function () {
      fsTimeout = null;
    }, 100); // give 5 seconds for multiple events
  }
});

const makeArr = () => {
  fs.readdir(folder, (err, files) => {
    localFiles = files;
    const newArr = [];
    files.forEach((file) => {
      newArr.push({ name: file, url: `/static/images/${file}` });
    });
    ImagesJson = newArr;
    // console.log(ImagesJson);
    io.emit('images_updated');
  });
};
makeArr();

app.get('/', (req, res) => {
  res.send('hello three');
});

app.get('/images', async (req, res) => {
  mongoClient.getAllImages();
  res.send(ImagesJson);
});

// app.get('/newimage', async (req, res) => {
//   mongoClient.updateImages('allu', 'newimageUrl');
//   res.send('hello add');
// });

io.on('connection', (socket) => {
  onConnection(socket);
});

server.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
