const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
    // For development, we'll log the email and return success
    // This allows testing without real SMTP credentials
    console.log('--- EMAIL DISPATCHED ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log('------------------------');

    // To use real emails, uncomment and configure below:
    /*
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g. 'SendGrid'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Fashion Hub Atelier" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        text,
        html
    });
    */

    return true;
};

const sendOrderConfirmation = async (order) => {
    const to = order.guestInfo ? order.guestInfo.email : (order.user ? order.user.email : null);
    if (!to) return;

    await sendEmail({
        to,
        subject: `Order Confirmed - #${order._id.toString().slice(-6).toUpperCase()}`,
        text: `Thank you for your order. Total: ₹${order.totalPrice.toLocaleString('en-IN')}. Your collection is being prepared at our digital atelier.`,
        html: `<h1>Order Confirmed</h1><p>Thank you for choosing Fashion Hub. Your order for <strong>₹${order.totalPrice.toLocaleString('en-IN')}</strong> is now processing.</p>`
    });
};

const sendBackInStockAlert = async (product, email) => {
    await sendEmail({
        to: email,
        subject: `Back in Atelier: ${product.name}`,
        text: `Good news! The ${product.name} is back in stock. Revisit the collection to secure yours.`,
        html: `<h1>Restock Alert</h1><p>The <strong>${product.name}</strong> is back in our collection. <a href="http://localhost:8000/product?id=${product._id}">Secure yours now.</a></p>`
    });
};

module.exports = {
    sendOrderConfirmation,
    sendBackInStockAlert
};
