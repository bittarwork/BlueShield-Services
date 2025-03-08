const mongoose = require("mongoose"); // Import Mongoose to interact with MongoDB
require("dotenv").config(); // Load environment variables from .env file

// Define the MongoDB connection URI, using the environment variable if available, otherwise falling back to a local database
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blueshield";

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI); // Attempt to establish a database connection
        console.log("✅ Connected to MongoDB"); // Log success message if connected
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error); // Log an error message if the connection fails
        throw error; // Throw the error to prevent the app from running without a database
    }
};

module.exports = connectDB; // Export the function for use in other parts of the application
