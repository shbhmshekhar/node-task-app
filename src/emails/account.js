const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_Key);

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
