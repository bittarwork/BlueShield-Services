const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
// Import user routes from userRoutes.js file
const userRoutes = require("./routes/user.routes");

// Import custom request logger middleware
const loggerMiddleware = require("./middleware/requestLogger.middleware");

// Initialize Express application
const app = express();

// Set up dotenv to load environment variables from the .env file
dotenv.config();

// Use middleware for handling different types of requests
app.use(express.json()); // Middleware to parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS setup: Allow only requests from React app (usually running on localhost:3000)
const corsOptions = {
    origin: "http://localhost:5173", // Allow requests from React app
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allow specific headers
};

app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing (CORS) with custom options

app.use(morgan("dev")); // Middleware to log HTTP requests in a development-friendly format (for debugging)

// Use custom logger middleware to print request details
app.use(loggerMiddleware);

// Use the userRoutes for handling routes related to user-related actions
app.use("/api/users", userRoutes);

// Basic test route to check if the server is running
app.get("/", (req, res) => {
    res.send("BlueShield API is running..."); // Simple message to confirm the server is running
});

// Export the app to be used in another file (server.js)
module.exports = app;
