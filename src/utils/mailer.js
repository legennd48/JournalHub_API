import nodemailer from 'nodemailer';
import { text } from 'stream/consumers';

if (!process.env.EMAIL || !process.env.PASSWORD) {
    throw new Error('Email and password environment variables are not set');
  }
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  
  async function sendWelcomeMail(email) {
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Welcome to JournalHub',
        html: `
          <h1>Hello! Welcome to JournalHub.</h1>
          <p>Thank you for registering</p>
          <p>We hope you enjoy our service.</p>
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  
  export { sendWelcomeMail };
