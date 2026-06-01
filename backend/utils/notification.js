const nodemailer = require('nodemailer');

// Set up dynamic SMTP transporter
const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      auth: { user, pass }
    });
  }

  // Fallback / Mock transporter
  return {
    sendMail: async (mailOptions) => {
      console.log('--- [MOCK EMAIL SENT] ---');
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Body:\n${mailOptions.text}`);
      console.log('-------------------------');
      return { mock: true, messageId: 'mock-id-' + Date.now() };
    }
  };
};

const sendNotificationEmail = async (donorUser, request) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: '"BloodDrop Emergency" <no-reply@blooddrop.org>',
    to: donorUser.email,
    subject: `EMERGENCY: Blood Donation Required in ${request.city}`,
    text: `Hello ${donorUser.name},\n\n` +
      `An emergency request (${request.requestId}) for blood group ${request.bloodGroup} has been created in your city (${request.city}).\n` +
      `Urgency Level: ${request.urgencyLevel}\n` +
      `Required Units: ${request.unitsRequired}\n\n` +
      `Please log into your dashboard to accept or decline this request.\n\n` +
      `Thank you,\nBloodDrop Support`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
};

const sendAcceptanceEmail = async (requesterUser, donorUser, request) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: '"BloodDrop Emergency" <no-reply@blooddrop.org>',
    to: requesterUser.email,
    subject: `DONOR FOUND: Request ${request.requestId} Accepted`,
    text: `Hello ${requesterUser.name},\n\n` +
      `Good news! A donor (${donorUser.name}) has accepted your emergency blood request (${request.requestId}) for blood group ${request.bloodGroup} in ${request.city}.\n\n` +
      `Donor Details:\n` +
      `- Name: ${donorUser.name}\n` +
      `- Contact: ${donorUser.contactNumber}\n` +
      `- Email: ${donorUser.email}\n\n` +
      `Please log into your dashboard to coordinate the donation.\n\n` +
      `Thank you,\nBloodDrop Support`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Failed to send acceptance email:', error);
  }
};

module.exports = { sendNotificationEmail, sendAcceptanceEmail };
