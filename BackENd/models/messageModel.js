const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },

        // إدارة حالة الرسالة
        isRead: {
            type: Boolean,
            default: false,
        },
        isReplied: {
            type: Boolean,
            default: false,
        },
        replyMessage: {
            type: String,
            trim: true,
            default: '',
        },
        adminNote: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
