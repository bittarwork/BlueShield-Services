// routes/userRoutes.js
const express = require("express"); // Import express module
const router = express.Router(); // Create a new instance of express Router
const userController = require("../controllers/user.controller"); // Import the user controller
const upload = require("../config/multer"); // Import the file upload configuration (Multer)
const { protect, admin } = require("../middleware/auth.middleware"); // Import the middleware for authentication and admin verification


router.post("/register", upload.single('profile_picture'), userController.registerUser);


router.post("/login", userController.loginUser);


router.get("/profile/:id", protect, userController.getUserProfile);

router.put("/profile/:id", protect, upload.single('profile_picture'), userController.updateUserProfile);

router.put("/change-password/:id", protect, userController.changePassword);


router.post("/register-admin", protect, admin, upload.single('profile_picture'), userController.registerAdmin);


router.delete("/:id", protect, admin, userController.deleteUser);

// Export the router so it can be used in the main application
module.exports = router;
