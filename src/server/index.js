const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const nocache = require('nocache');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const promoCodeRoutes = require('./routes/promoCodeRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(nocache());

// Static Files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promo-codes', promoCodeRoutes);

// Frontend Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/catalog.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/cart.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/account.html'));
});

app.get('/legal', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/legal.html'));
});

app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/product.html'));
});

app.get('/api/health', async (req, res) => {
    const mongoose = require('mongoose');
    res.json({
        status: 'ok',
        message: 'Fashion Hub API is running',
        env: {
            MONGO_URI_SET: !!process.env.MONGO_URI,
            JWT_SECRET_SET: !!process.env.JWT_SECRET,
            NODE_ENV: process.env.NODE_ENV || 'not set'
        },
        db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
