import nodemailer from 'nodemailer';

export const sendMailToUser = async (userEmail) => {
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
      user: process.env.GMAIL_LOGIN_ID,
      pass: process.env.GMAIL_LOGIN_PASS,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_ACCESS_TOKEN,
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
    (err) => {
      console.log(err);
    }
  );
};
