import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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
        from: `JournalHub <process.env.EMAIL>`,
        to: email,
        subject: 'Welcome to JournalHub',
        html: `
          <h1>Hello! Welcome to JournalHub.</h1>
          <p>Thank you for registering</p>
          <p>We hope you enjoy our service.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      // console.error('Error sending email:', error);
    }
  }

  async function sendPasswordResetMail(email, resetUrl) {
    try {
      const mailOptions = {
        from: `JournalHub <process.env.EMAIL>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset Request</h1>
          <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following link, or paste this into your browser to complete the process:</p>
          <a href=${resetUrl}>Reset Password</a>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      // console.error('Error sending email:', error);
    }
  }

  async function sendPasswordChangedMail(email) {
    try {
      const mailOptions = {
        from: `JournalHub <process.env.EMAIL>`,
        to: email,
        subject: 'Password Changed',
        html: `
          <h1>Password Changed</h1>
          <p>This is a confirmation that the password for your account has been changed.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      // console.error('Error sending email:', error);
    }
  }

  async function sendAccountDeletedMail(email) {
    try {
      const mailOptions = {
        from: `JournalHub <process.env.EMAIL>`,
        to: email,
        subject: 'Account Deleted',
        html: `
          <h1>Account Deleted</h1>
          <p>This is a confirmation that your JournalHub account has been deleted.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      // console.error('Error sending email:', error);
    }
  }

  async function sendProfileUpdatedMail(email) {
    try {
      const mailOptions = {
        from: `JournalHub <process.env.EMAIL>`,
        to: email,
        subject: 'Profile Updated',
        html: `
          <h1>Profile Updated</h1>
          <p>This is a confirmation that your JournalHub profile has been updated.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      // console.error('Error sending email:', error);
    }
  }

  export {
    sendWelcomeMail,
    sendPasswordResetMail,
    sendPasswordChangedMail,
    sendAccountDeletedMail,
    sendProfileUpdatedMail,
  };
