const nodemailer = require('nodemailer');

module.exports = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {

    const { email, link } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Cart Link',
      html: `
        <h2>Your Cart</h2>

        <p>
          Click below to open your cart:
        </p>

        <a href="${link}">
          Open Cart
        </a>
      `
    });

    return res.status(200).json({
      success: true
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

};