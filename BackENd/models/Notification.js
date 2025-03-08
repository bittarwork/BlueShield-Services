const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["email", "sms"], required: true },
        content: { type: String, required: true },
        status: { type: String, enum: ["sent", "failed"], default: "sent" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
