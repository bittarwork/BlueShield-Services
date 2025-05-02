
const mongoose = require("mongoose");

const WaterAlternativeRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["cash_on_delivery", "electronic"],
        default: "cash_on_delivery",
    },
    status: {
        type: String,
        enum: ["pending", "assigned", "in_progress", "delivered", "completed", "cancelled"],
        default: "pending",
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    adminNotes: [
        {
            note: String,
            addedBy: { type: String },
            date: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("WaterAlternativeRequest", WaterAlternativeRequestSchema);
