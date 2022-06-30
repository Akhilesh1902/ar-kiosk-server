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
  // res.sendFile(img);
  res.send('connecting to aws');
  const aws = new AwsInstance(img);
  // aws.uploadData(img);

  setTimeout(() => {
    aws.readData();
  }, 1000);

  // console.log(aws);
});

app.get('/images', async (req, res) => {
  const imgData = await mongoClient.getAllImages();
  res.send(imgData);
});

io.on('connection', (socket) => {
  onConnection(socket, mongoClient);
});

server.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
