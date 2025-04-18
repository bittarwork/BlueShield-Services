const mongoose = require("mongoose");

// ملاحظات الطلب
const NoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    added_by: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "technician", "user"],
            required: true,
        },
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// الطلب الرئيسي
const MaintenanceRequestSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        }
        ,


        location: {
            type: {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
            required: true,
        },

        images: [
            {
                type: String, // اسم الملف
            },
        ],

        status: {
            type: String,
            enum: ["pending", "assigned", "in-progress", "resolved"],
            default: "pending",
        },

        technician_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        resolved_at: {
            type: Date,
        },

        notes: [NoteSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);
