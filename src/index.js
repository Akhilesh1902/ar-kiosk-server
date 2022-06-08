console.log('hello there');
import Express from 'express';
import http from 'http';

const app = Express();

// adding /static as the prefix for the image url
// path to user : http://localhost:2020/static/images/darshan.jpeg
app.use('/static', Express.static('public'));

const PORT = 2020;

const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('hello three');
});

server.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
