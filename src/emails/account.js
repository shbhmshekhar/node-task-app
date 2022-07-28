const { sendgridAPIKey } = require('../APISecretKeys');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'shbhmshekhar@gmail.com',
    subject: 'Welcome to App',
    text: `Hi ${name}, Welcome to app.`,
  });
};

const sendCancellationMail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'shbhmshekhar@gmail.com',
    subject: `Sad to see you go ${name.split(' ')[0]}`,
    text: `Hi ${name}, \n Your cancellation is processed successfully.`,
  });
};

module.exports = { sendWelcomeEmail, sendCancellationMail };
