const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'gopikonangi0001@gmail.com', 
    pass: 'mfvyomszeijsanai'      // App Password applied
  }
});

app.get('/', (req, res) => {
  res.send('Andhra Blood Connect API is running securely.');
});

app.post('/api/send-email', async (req, res) => {
  const { to, hospitalName, bloodGroup, units, status } = req.body;

  let subject = '';
  let htmlContent = '';

  if (status === 'Approved') {
    subject = 'Blood Request Approved - Andhra Blood Connect';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #c62828;">Andhra Blood Connect</h2>
        <h3>Hello ${hospitalName},</h3>
        <p>Your request for <strong>${units} units of ${bloodGroup}</strong> blood has been <strong>approved</strong> and is ready for collection.</p>
        <p>Please arrange for your hospital staff to travel and collect the blood units from our central facility located at <strong>Vaddeswaram, Vijayawada</strong>.</p>
        <br />
        <p style="color: #666;">Thank you,<br/><strong>Andhra Blood Connect Admin Team</strong></p>
      </div>
    `;
  } else if (status === 'Received') {
    subject = 'Blood Transfer Complete - Andhra Blood Connect';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #2e7d32;">Andhra Blood Connect</h2>
        <h3>Hello ${hospitalName},</h3>
        <p>This email is to confirm that the transfer of <strong>${units} units of ${bloodGroup}</strong> blood has been officially marked as <strong>received</strong> by our network.</p>
        <p>Thank you for partnering with Andhra Blood Connect to save lives.</p>
        <br />
        <p style="color: #666;">Thank you,<br/><strong>Andhra Blood Connect Admin Team</strong></p>
      </div>
    `;
  } else if (status === 'ResetPassword') {
    subject = 'Password Reset - Andhra Blood Connect';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #c62828;">Andhra Blood Connect</h2>
        <h3>Hello ${hospitalName || 'User'},</h3>
        <p>We received a request to reset the password for your account associated with this email address.</p>
        <p>Please click the link below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/reset-password?email=${encodeURIComponent(to)}" style="background-color: #c62828; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <br />
        <p style="color: #666;">Thank you,<br/><strong>Andhra Blood Connect Support Team</strong></p>
      </div>
    `;
  }

  const mailOptions = {
    from: '"Andhra Blood Connect" <gopikonangi0001@gmail.com>',
    to: to || 'hospital@example.com',
    subject,
    html: htmlContent
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app;
