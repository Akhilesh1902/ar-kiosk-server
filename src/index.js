console.log('hello there');
import Express from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import { Server } from 'socket.io';
import nodemailer from 'nodemailer';

const app = Express();
app.use(cors());
// adding /static as the prefix for the image url
// path to user : http://localhost:2020/static/images/darshan.jpeg
app.use('/static', Express.static('public'));

const PORT = process.env.PORT;

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

let ImagesJson = [];
const folder = './public/images/';

fs.watch(folder, (event, filename) => {
  console.log('wathcing');
  makeArr();
});

const makeArr = () => {
  fs.readdir(folder, (err, files) => {
    const newArr = [];
    files.forEach((file) => {
      newArr.push(`static/images/${file}`);
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

  socket.on('send_image', ({ screenShot, userEmail }) => {
    console.log('sending image to user');
    let imgData = screenShot.replace(/^data:image\/\w+;base64,/, '');
    let buff = Buffer.from(imgData, 'base64');
    fs.writeFile('image.png', buff, (img, err) => {
      console.log(err);
      console.log(img);
    });
    sendMailToUser(userEmail);
  });
});

const sendMailToUser = async (userEmail) => {
  console.log('sending mails');
  const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true,
    // port: 587,
    auth: {
      type: 'OAuth2',
      // user: 'darrick.mohr9@ethereal.email',
      // pass: 'wvvDzJSYafDszccCy7',
      user: 'spareakhil@gmail.com',
      pass: 'AkhilSpare@19',
      clientId:
        '920334345234-dve11c41os2bc26hvp01o3eg4dp9lt69.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken:
        '1//04wvik12DmiM2CgYIARAAGAQSNwF-L9Ir91zEib-oiyDoStlXgxLv9EKaRgvAPATEBTFKCldPJP0AKM0CDyqo362Is8ZcN0TE1YY',
      accessToken:
        'ya29.a0ARrdaM9JifVyv6wNrJQ8ANfUxp4zyIBvEmumRaH7AgmdG8LRPQJS5vtCyGu8GMNHk6Gr8tXOzV7FrYracYD8R0spfYzfNBXBr8lSjtq9zi2LkEdRUgr1WBcuK2vjOPM77Ronk1IjLnBcyZbO3eSFVptvs6n9',
    },
  });

  let info = transporter.sendMail(
    {
      from: 'spareakhil@gmail.com', // sender address
      to: userEmail, // list of receivers
      subject: 'Your Image', // Subject line
      text: 'Is this your Image?', // plain text body
      // html: '<b>Hello world?</b>', // html body
      attachments: [
        {
          filename: 'image',
          path: './image.png',
        },
      ],
    },
    (err) => {
      console.log(err);
    }
  );
};

server.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
