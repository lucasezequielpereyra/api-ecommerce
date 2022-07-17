import nodemailer from 'nodemailer';
import logger from './logger';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PW,
  },
});

transporter.verify().then(() => {
  logger.info.info('Server is ready to send our emails');
});
