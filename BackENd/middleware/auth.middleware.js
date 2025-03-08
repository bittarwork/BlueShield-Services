const jwt = require("jsonwebtoken"); // Import JSON Web Token library for handling tokens
const User = require("../models/User"); // Import User model from the database
const asyncHandler = require("express-async-handler"); // Import asyncHandler to handle errors in async functions
const { use } = require("../routes/user.routes"); // (Not used in the code, can be removed)

// Middleware to protect routes from unauthorized access
const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization; // Get the token from the Authorization header

    // Check if the token exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" }); // Deny access if no token is provided
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Verify the token and decode it using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the extracted userId, excluding the password field
    req.user = await User.findById(decoded.userId).select("-password");

    // Check if the user exists
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next(); // Allow the request to proceed to the next middleware or route handler
});

// Middleware to check if the user has "admin" privileges
const admin = (req, res, next) => {
    // Check if the current user exists and has the role of "admin"
    if (req.user && req.user.role === "admin") {
        next(); // Allow the request to proceed
    } else {
        return res.status(403).json({ message: "Not authorized as an admin" }); // Deny access if the user is not an admin
    }
};

// Export the middleware functions for use in other files
module.exports = { protect, admin };
