console.log('hello there');
import Express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

import { onConnection } from './js/socket.js';
import { MongoClientConnection } from './js/mongo.js';

import { AwsInstance } from './js/aws-integration.js';

const mongoClient = new MongoClientConnection();
const AWS_S3 = new AwsInstance();

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
  maxHttpBufferSize: 10e6,
});

app.get('/', (req, res) => {
  res.send('hello three');
});

const img = 'static/images/t.png';

app.get('/testAws', (req, res) => {
  res.send('deleting');
  AWS_S3.deleteObject('file/video.mp4');
});

app.get('/model/:modelName', async (req, res) => {
  console.log(req.params.modelName);
  const { modelName } = req.params;
  // return;
  // const data = await AWS_S3.readObject(`models/${modelName}`);
  console.log({ modelName });
  const data = await AWS_S3.getFile(`models/${modelName}`);
  console.log({ data });
  res.send(data);
});

app.get('/file/:image', async (req, res) => {
  // const {image} = req.params
  console.log(req.params.image);
  // return;
  const data = await AWS_S3.getFile(`file/${req.params.image}`);

  console.log(data);
  res.send(data);
});

app.get('/images', async (req, res) => {
  const imgData = await mongoClient.getAllImages();
  res.send(imgData);
});

io.on('connection', (socket) => {
  onConnection(socket, mongoClient, AWS_S3);
});

server.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
