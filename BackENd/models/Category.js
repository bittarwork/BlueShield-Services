const mongoose = require("mongoose");

// Define the schema for Category 
const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the schema for Category 
module.exports = mongoose.model("Category", CategorySchema);
