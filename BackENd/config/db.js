const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blueshield";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        throw error;
    }
};

module.exports = connectDB;
