const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PromoCode = require('./src/server/models/PromoCode');

dotenv.config();

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const promos = await PromoCode.find({});
    console.log('Promos in DB:', JSON.stringify(promos, null, 2));
    process.exit();
};

check();
