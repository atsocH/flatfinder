const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        auth: {
            user: config.email.username,
            pass: config.email.password
        },
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: 'flat_finder@noreply.com',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;