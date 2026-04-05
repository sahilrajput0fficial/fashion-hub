const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Product = require('./src/server/models/Product');
const connectDB = require('./src/server/config/db');

const debugData = async () => {
    try {
        await connectDB();
        const products = await Product.find({});
        
        const brands = [...new Set(products.map(p => p.brand))];
        const categories = [...new Set(products.map(p => p.category))];
        const materials = [...new Set(products.map(p => p.material))];
        const seasons = [...new Set(products.map(p => p.season))];
        const genders = [...new Set(products.map(p => p.gender))];

        console.log('--- DB DATA SCAN (EXACT VALUES) ---');
        console.log('BRANDS:', brands.join('|'));
        console.log('CATEGORIES:', categories.join('|'));
        console.log('MATERIALS:', materials.join('|'));
        console.log('SEASONS:', seasons.join('|'));
        console.log('GENDERS:', genders.join('|'));
        console.log('-----------------------------------');
        
        process.exit(0);
    } catch (err) {
        console.error('Debug Error:', err);
        process.exit(1);
    }
};

debugData();
