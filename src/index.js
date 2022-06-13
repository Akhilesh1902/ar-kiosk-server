console.log('hello there');
import Express from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import { Server } from 'socket.io';

const app = Express();
app.use(cors());
// adding /static as the prefix for the image url
// path to user : http://localhost:2020/static/images/darshan.jpeg
app.use('/static', Express.static('public'));

const PORT = process.env.PORT || 3030;

const CORS = {
  origin: 'http://localhost:3000',
  methods: ['GET'],
};

const server = http.createServer(app, {
  cors: CORS,
});
const io = new Server(server, {
  cors: CORS,
});

const ImagesJson = [];
const folder = './public/images/';
fs.readdir(folder, (err, files) => {
  console.log(files);
  console.log(err);
  files.forEach((file) => {
    ImagesJson.push(`static/images/${file}`);
  });
  console.log('image Json : ', ImagesJson);
});

app.get('/', (req, res) => {
  res.send('hello three');
});

app.get('/images', (req, res) => {
  res.send(ImagesJson);
});

io.on('connection', (socket) => {
  socket = socket;
  console.log('connected');
  console.log('socket ID : ', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
