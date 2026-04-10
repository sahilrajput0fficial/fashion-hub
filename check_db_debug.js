const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/server/models/Product');
const connectDB = require('./src/server/config/db');

dotenv.config();

const checkDuplicates = async () => {
    try {
        await connectDB();
        const products = await Product.find({});
        console.log('Total Products in DB:', products.length);

        const ids = products.map(p => p._id.toString());
        const uniqueIds = new Set(ids);
        console.log('Unique IDs count:', uniqueIds.size);

        if (ids.length !== uniqueIds.size) {
            console.log('DUPLICATE IDS FOUND!');
        }

        const names = products.map(p => p.name);
        const nameCounts = {};
        names.forEach(name => {
            nameCounts[name] = (nameCounts[name] || 0) + 1;
        });

        const duplicates = Object.keys(nameCounts).filter(name => nameCounts[name] > 1);
        if (duplicates.length > 0) {
            console.log('Duplicate names found:');
            duplicates.forEach(name => {
                console.log(`- ${name} (${nameCounts[name]} times)`);
            });
        } else {
            console.log('No duplicate names found.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDuplicates();
