const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'milkharbor78@gmail.com',
    pass: 'cfwb xeuo ncwv suar'
  }
});