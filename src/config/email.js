const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPlainEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to} with subject: ${subject}`);
};

const sendTemplateEmail = async (to, subject, templateName, templateData = {}) => {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.ejs`);
  const html = await ejs.renderFile(templatePath, templateData);
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Template email (${templateName}) sent to ${to} with subject: ${subject}`);
};

module.exports = { sendTemplateEmail, sendPlainEmail };