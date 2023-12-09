const mailer = require("nodemailer");
const { verifyEmailHtml } = require("~/utils/generateHtml");
const bcrypt = require("bcrypt");

const BCRYPT_HASH = Number(process.env.BCRYPT_HASH);

const config = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  sendAddress: process.env.MAIL_SENDADDRESS,
};

const sendMail = (to, subject, htmlContent) => {
  const transport = mailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false,
    auth: {
      user: config.username,
      pass: config.password,
    },
  });
  const options = {
    from: `Lialili Studio <${config.sendAddress}>`,
    to,
    subject,
    html: htmlContent,
  };
  return transport.sendMail(options);
};

const sendMailVerifyEmail = async ({ name, email }) => {
  const emailToken = await bcrypt.hash(email, BCRYPT_HASH);
  await sendMail(
    email,
    "Verify Account",
    verifyEmailHtml({
      name,
      email,
      emailToken,
    })
  );
};

module.exports = { sendMail, sendMailVerifyEmail };
