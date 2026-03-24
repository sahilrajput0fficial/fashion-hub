const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return; // Reuse existing connection (serverless-safe)

    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_hub',
            { serverSelectionTimeoutMS: 10000 }
        );
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Do NOT process.exit(1) on serverless — just let the request fail gracefully
        throw new Error(`Database connection failed: ${error.message}`);
    }
};

module.exports = connectDB;
