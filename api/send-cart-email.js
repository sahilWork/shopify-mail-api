const nodemailer = require('nodemailer');

module.exports = async (req, res) => {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS request handle
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allow
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {

    const { cart } = req.body;

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Cart items HTML
    const itemsHtml = cart.items.map(item => `
      <div style="margin-bottom:20px;">
        <strong>${item.product_title}</strong>
        <br>
        Quantity: ${item.quantity}
        <br>
        Price: ${item.final_price / 100}
      </div>
    `).join('');

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'YOUR_EMAIL@gmail.com',
      subject: 'New Cart Request',
      html: `
        <h2>Cart Details</h2>
        ${itemsHtml}
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