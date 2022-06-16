import nodemailer from 'nodemailer';

export const sendMailToUser = async (userEmail, socket) => {
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
          filename: 'image.png',
          path: './image.png',
        },
      ],
    },
    (error, response) => {
      if (error) {
        console.log('email -error');
        console.log(error);
        socket.emit('_emailError', error);
      } else {
        socket.emit('_emailSuccess', response);
      }

      // console.log(error);
      console.log(response);
    }
  );
};
