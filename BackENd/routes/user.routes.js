// routes/userRoutes.js
const express = require("express"); // Import express module
const router = express.Router(); // Create a new instance of express Router
const userController = require("../controllers/user.controller"); // Import the user controller
const upload = require("../config/multer"); // Import the file upload configuration (Multer)
const { protect, admin } = require("../middleware/auth.middleware"); // Import the middleware for authentication and admin verification

// Route for user registration
// This route allows users to register by sending data and an optional profile picture
router.post("/register", upload.single('profile_picture'), userController.registerUser);

// Route for user login
// This route allows users to login by sending email and password
router.post("/login", userController.loginUser);

// Route to get user profile data
// This route is protected (only accessible to logged-in users)
// It fetches the profile data of the currently logged-in user
router.get("/profile/:id", protect, userController.getUserProfile);

// Route to update user profile
// This route is protected and allows users to update their profile information, including an optional profile picture
router.put("/profile/:id", protect, upload.single('profile_picture'), userController.updateUserProfile);

// Route to change user password
// This route is protected and allows users to change their password
router.put("/change-password/:id", protect, userController.changePassword);

// Route to register an admin user (accessible only by an admin)
// This route allows an admin to register new admin users, including uploading a profile picture
router.post("/register-admin", protect, admin, upload.single('profile_picture'), userController.registerAdmin);

// Route to delete a user (accessible only by an admin)
// This route allows an admin to delete a user by their ID
router.delete("/:id", protect, admin, userController.deleteUser);

// Export the router so it can be used in the main application
module.exports = router;
