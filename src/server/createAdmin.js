const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await User.findOne({ email: 'admin@fashionhub.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const admin = await User.create({
            name: 'Atelier Director',
            email: 'admin@fashionhub.com',
            password: 'admin123admin', // Hardcoded for initial setup, should be changed
            role: 'admin'
        });

        if (admin) {
            console.log('Admin user created successfully');
            console.log('Email: admin@fashionhub.com');
            console.log('Password: admin123admin');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
