console.log('hello there');
import Express from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';

const app = Express();
app.use(cors());
// adding /static as the prefix for the image url
// path to user : http://localhost:2020/static/images/darshan.jpeg
app.use('/static', Express.static('public'));

const PORT = 2020;

const server = http.createServer(app, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET'],
  },
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

server.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
