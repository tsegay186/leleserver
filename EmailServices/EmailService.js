const nodemailer = require('nodemailer');

require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  logger: true,
  debug: true,
  auth: {
    user: process.env.username,
    pass: process.env.password
  }
});
module.exports = transporter;
