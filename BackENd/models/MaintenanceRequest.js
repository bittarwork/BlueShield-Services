const mongoose = require("mongoose");

// Define the schema for maintenance requests
const MaintenanceRequestSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who made the request
        description: { type: String, required: true }, // Description of the maintenance issue
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to the category of the maintenance request
        status: { type: String, enum: ["pending", "assigned", "in-progress", "resolved"], default: "pending" }, // Status of the request (default is pending)
        technician_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the technician assigned (optional)
        images: [{ type: String }], // Array to store image URLs related to the request
        resolved_at: { type: Date }, // Date when the request was resolved
        notes: { type: String }, // Additional notes related to the maintenance request
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the MaintenanceRequest model
module.exports = mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);
