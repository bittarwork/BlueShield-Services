// controllers/userController.js
const User = require("../models/User"); // Import the User model
const bcrypt = require("bcryptjs"); // Import bcrypt for hashing passwords
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for creating JWT tokens
const path = require("path"); // Import path for handling file paths
const fs = require("fs"); // Import fs for interacting with the file system
const { validationResult } = require('express-validator');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { first_name, last_name, email, phone, password } = req.body; // Extract user data from the request body

        // Check if the email is already in use
        const existingUser = await User.findOne({ email }); // Search for a user with the same email
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" }); // If email exists, return error
        }

        // Prepare user data for saving
        const userData = {
            first_name,
            last_name,
            email,
            phone,
            password: password.trim(),
            role: "user" // Default role is "user"
        };

        // If a profile picture is uploaded, save its path in the database
        if (req.file) {
            userData.profile_picture = req.file.path; // Assign the file path to the profile_picture field
        }

        // Create a new user and save to the database
        const newUser = new User(userData); // Create a new user object
        await newUser.save(); // Save the user to the database

        // Return the new user without password field
        const userResponse = {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            phone: newUser.phone,
            profile_picture: newUser.profile_picture || null,
            role: newUser.role
        };

        return res.status(201).json({ message: "User registered successfully", user: userResponse }); // Respond with success message and user data
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error: error.message }); // Handle errors
    }
};
// Login the user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Extract email and password from the request body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user by email
        const user = await User.findOne({ email }); // Search for a user with the provided email
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" }); // If no user found, return error
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const payload = { userId: user._id, role: user.role }; // Prepare payload with user ID and role
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }); // Sign the token

        // Respond with the token and user data (excluding password)
        return res.status(200).json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profile_picture: user.profile_picture || null // Include profile picture URL if exists
            }
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        return res.status(500).json({ message: "Error logging in", error: error.message }); // Handle errors
    }
};

// Get user profile data
exports.getUserProfile = async (req, res) => {
    try {
        // Find the user by user ID, exclude the password field
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" }); // If user not found, return error
        }
        return res.status(200).json(user); // Respond with the user data
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user profile", error: error.message }); // Handle errors
    }
};

// Update user profile data (with image upload support)
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from the request (auth middleware should populate this)
        const updateData = req.body; // Extract data to update from the request body

        // If a new profile picture is uploaded, handle it
        if (req.file) {
            // If there was an old profile picture, delete it from the server
            const user = await User.findById(userId); // Find the user by ID
            if (user.profile_picture) {
                const oldProfilePicPath = path.join(__dirname, '..', user.profile_picture); // Get the old profile picture path
                if (fs.existsSync(oldProfilePicPath)) { // Check if the file exists
                    fs.unlinkSync(oldProfilePicPath); // Delete the old profile picture
                }
            }
            updateData.profile_picture = req.file.path; // Set the new profile picture path
        }

        // Update the user data in the database
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" }); // If user not found, return error
        }

        return res.status(200).json({ message: "User profile updated", user: updatedUser }); // Respond with the updated user
    } catch (error) {
        return res.status(500).json({ message: "Error updating profile", error: error.message }); // Handle errors
    }
};

// Change user password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body; // Extract old and new passwords from the request body

        const user = await User.findById(userId); // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: "User not found" }); // If user not found, return error
        }

        // Verify the old password
        const isMatch = await bcrypt.compare(oldPassword, user.password); // Compare old password with stored password
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" }); // If passwords don't match, return error
        }

        // Hash the new password and update it
        const salt = await bcrypt.genSalt(12); // Generate salt for hashing new password
        const hashedPassword = await bcrypt.hash(newPassword, salt); // Hash the new password
        user.password = hashedPassword; // Set the new hashed password
        await user.save(); // Save the user with the new password

        return res.status(200).json({ message: "Password changed successfully" }); // Respond with success message
    } catch (error) {
        return res.status(500).json({ message: "Error changing password", error: error.message }); // Handle errors
    }
};

// Register an admin account (only accessible by admins)
exports.registerAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password } = req.body; // Extract admin data from the request body

        // Check if the email is already in use
        const existingUser = await User.findOne({ email }); // Search for a user with the same email
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" }); // If email exists, return error
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(12); // Generate salt for hashing the password
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using the salt

        // Prepare user data for saving
        const userData = {
            first_name,
            last_name,
            email,
            phone,
            password: hashedPassword, // Save hashed password instead of plain text
            role: "admin" // Assign "admin" role to the new user
        };

        // If a profile picture is uploaded, save its path in the database
        if (req.file) {
            userData.profile_picture = req.file.path; // Assign the file path to the profile_picture field
        }

        // Create a new admin and save to the database
        const newAdmin = new User(userData); // Create a new user object
        await newAdmin.save(); // Save the new admin to the database

        return res.status(201).json({ message: "Admin registered successfully" }); // Respond with success message
    } catch (error) {
        return res.status(500).json({ message: "Error registering admin", error: error.message }); // Handle errors
    }
};

// Delete a user account (only accessible by admins)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request parameters

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userId); // Find and delete the user by ID
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" }); // If user not found, return error
        }

        // If the deleted user had a profile picture, delete it from the server
        if (deletedUser.profile_picture) {
            const profilePicPath = path.join(__dirname, '..', deletedUser.profile_picture); // Get the profile picture path
            if (fs.existsSync(profilePicPath)) { // Check if the file exists
                fs.unlinkSync(profilePicPath); // Delete the profile picture from the server
            }
        }

        return res.status(200).json({ message: "User deleted successfully" }); // Respond with success message
    } catch (error) {
        return res.status(500).json({ message: "Error deleting user", error: error.message }); // Handle errors
    }
};
