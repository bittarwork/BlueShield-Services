const express = require("express"); // Import express module
const router = express.Router(); // Create a new instance of express Router
const userController = require("../controllers/user.controller"); // Import the user controller
const upload = require("../config/multer"); // Import the file upload configuration (Multer)
const { protect, admin } = require("../middleware/auth.middleware"); // Import the middleware for authentication and admin verification

// Register a new user
router.post("/register", upload.single('profile_picture'), userController.registerUser);

// Login a user
router.post("/login", userController.loginUser);

// Get user profile (protected route)
router.get("/profile/:id", protect, userController.getUserProfile);

// Update user profile (protected route)
router.put("/profile/:id", protect, upload.single('profile_picture'), userController.updateUserProfile);

// Change user password (protected route)
router.put("/change-password/:id", protect, userController.changePassword);

// Register an admin (protected and admin-only route)
router.post("/register-admin", protect, admin, upload.single('profile_picture'), userController.registerAdmin);

// Delete a user (protected and admin-only route)
router.delete("/:id", protect, admin, userController.deleteUser);

// Get all users or filter by roles (protected and admin-only route)
router.get("/", protect, admin, userController.getUsers);

// Get user statistics (protected and admin-only route)
router.get("/statistics", protect, admin, userController.getUserStatistics);

// Export the router so it can be used in the main application
module.exports = router;