const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Sender's name
        email: { type: String, required: true }, // Sender's email address
        phone: { type: String }, // Phone number (optional)
        message: { type: String, required: true }, // Message content
        category: {
            type: String,
            enum: ["feedback", "complaint", "suggestion", "support"], // Message category
            required: true,
        },
        status: {
            type: String,
            enum: ["unread", "in-progress", "resolved"],
            default: "unread", // Default status
        },
        response: { type: String, default: "" }, // Response to the message
        isFeatured: { type: Boolean, default: false }, // ✅ Whether it can be featured on the website?
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Message", messageSchema);
