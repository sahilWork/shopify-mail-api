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

    const { email, link, customerName, products } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const productsHTML = products.map(product => `
      <div class="product-item" style="gap: 20px;">

        <div class="product-img">
          <img src="${product.image}" alt="${product.title}" />
        </div>

        <div class="product-info">

          <div class="product-title">
            ${product.title}
          </div>

          <div class="doctor-badge">
            <span>${product.doctor}</span>
          </div>

          <div class="pricing">

            <span class="price-current">
              ₹${product.price}
            </span>

            ${
              product.originalPrice
                ? `
                  <span class="price-original">
                    ₹${product.originalPrice}
                  </span>
                `
                : ''
            }

            ${
              product.discount
                ? `
                  <span class="discount-pill">
                    ${product.discount}
                  </span>
                `
                : ''
            }

          </div>

        </div>

      </div>
    `).join('');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Doctor Recommended Products',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<style>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  background:#f0ede8;
  font-family:Arial,sans-serif;
  color:#1a1a1a;
}

.email-wrapper{
  max-width:620px;
  margin:40px auto;
  background:#faf9f7;
  border:1px solid #e2ddd8;
}

.header{
  background:#1c2b2b;
  padding:40px 48px 36px;
}

.logo{
  font-size:13px;
  letter-spacing:3px;
  text-transform:uppercase;
  color:#a8c5a0;
  margin-bottom:28px;
}

.header h1{
  font-size:32px;
  line-height:1.2;
  color:#fff;
  font-weight:400;
}

.header h1 em{
  color:#a8c5a0;
}

.header-sub{
  margin-top:14px;
  font-size:13px;
  color:rgba(255,255,255,0.6);
  line-height:1.6;
}

.intro{
  padding:36px 48px 32px;
  border-bottom:1px solid #e2ddd8;
}

.intro p{
  font-size:14px;
  line-height:1.8;
  color:#555;
}

.products{
  padding:32px 48px;
}

.section-label{
  font-size:11px;
  letter-spacing:2px;
  text-transform:uppercase;
  color:#a8c5a0;
  margin-bottom:24px;
}

.product-item{
  display:flex;
  gap:20px;
  padding:24px 0;
  border-bottom:1px solid #e8e4df;
}

.product-item:last-child{
  border-bottom:none;
}

.product-img{
  width:88px;
  height:88px;
  overflow:hidden;
  border-radius:4px;
  flex-shrink:0;
}

.product-img img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.product-info{
  flex:1;
}

.product-title{
  font-size:16px;
  font-weight:600;
  margin-bottom:8px;
}

.doctor-badge{
  display:inline-block;
  background:#f0f7ee;
  border:1px solid #c8dfc4;
  padding:4px 8px;
  margin-bottom:10px;
  font-size:11px;
  color:#3a6b34;
}

.pricing{
  display:flex;
  gap:10px;
  align-items:center;
}

.price-current{
  font-size:18px;
  font-weight:600;
}

.price-original{
  font-size:13px;
  color:#999;
  text-decoration:line-through;
}

.discount-pill{
  background:#2e7d32;
  color:#fff;
  padding:3px 6px;
  font-size:10px;
  border-radius:3px;
}

.cta-section{
  padding:0 48px 40px;
}

.cta-divider{
  height:1px;
  background:#e2ddd8;
  margin-bottom:32px;
}

.cta-copy{
  font-size:13px;
  color:#777;
  line-height:1.7;
  margin-bottom:24px;
}

.cta-btn{
  display:inline-block;
  background:#1c2b2b;
  color:#fff !important;
  text-decoration:none;
  padding:15px 36px;
  font-size:12px;
  letter-spacing:2px;
  text-transform:uppercase;
}

.footer{
  background:#f0ede8;
  padding:24px 48px;
  border-top:1px solid #e2ddd8;
}

.footer-legal{
  font-size:11px;
  color:#999;
  line-height:1.6;
}

</style>
</head>

<body>

<div class="email-wrapper">

  <div class="header">
    <div class="logo">Advanced Dermatology</div>

    <h1>
      Your doctor's<br>
      <em>curated picks</em><br>
      are here.
    </h1>

    <p class="header-sub">
      Personalised recommendations, just for you.
    </p>
  </div>

  <div class="intro">
    <p>
      Hi <strong>${customerName || 'Customer'}</strong>,
      your care team has handpicked a few products tailored
      to your health plan.
    </p>
  </div>

  <div class="products">

    <div class="section-label">
      Recommended Products
    </div>

    ${productsHTML}

  </div>

  <div class="cta-section">

    <div class="cta-divider"></div>

    <p class="cta-copy">
      Your cart has already been prepared with these products.
      Review your cart and complete checkout.
    </p>

    <a href="${link}" class="cta-btn">
      Open My Cart
    </a>

  </div>

  <div class="footer">
    <p class="footer-legal">
      You received this email because you are a registered customer.
      Please consult your healthcare provider before consuming supplements.
    </p>
  </div>

</div>

</body>
</html>
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