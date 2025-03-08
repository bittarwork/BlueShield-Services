// config/multer.js
const multer = require("multer"); // Import multer for handling file uploads
const path = require("path"); // Import path module for handling file paths

// Define where the uploaded files will be stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination folder for uploaded files
        cb(null, "uploads/"); // The path where the images will be stored (uploads folder)
    },
    filename: (req, file, cb) => {
        // Create a unique filename for each uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique string based on current time and random number
        // Set the filename with a unique suffix and the original file extension
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Define the allowed file types (only images)
const fileFilter = (req, file, cb) => {
    // Regular expression to check if the file is an image (jpeg, jpg, png, gif)
    const fileTypes = /jpeg|jpg|png|gif/;
    // Check if the file extension and mimetype match the allowed file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    // If the file is an image, allow it; otherwise, reject with an error
    if (mimetype && extname) {
        return cb(null, true); // Allow the file to be uploaded
    } else {
        cb(new Error("Only image files are allowed")); // Reject non-image files with an error message
    }
};

// Configure Multer with storage settings, file filter, and file size limit
const upload = multer({
    storage: storage, // Use the defined storage settings
    fileFilter: fileFilter, // Apply the file filter to check file types
    limits: { fileSize: 5 * 1024 * 1024 } // Set the maximum file size to 5MB
});

// Export the configured upload instance for use in other parts of the application
module.exports = upload;
