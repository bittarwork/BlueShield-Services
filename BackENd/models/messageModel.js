const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        // الحالة 1: مرسل مسجل بالنظام
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // الحالة 2: مرسل غير مسجل (زائر خارجي)
        senderInfo: {
            name: String,
            email: String,
            phone: String,
        },

        // لتحديد نوع المرسل
        senderType: {
            type: String,
            enum: ["user", "external"],
            required: true,
        },

        // مستقبل الرسالة (مطلوبة للحالة الداخلية فقط)
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // محتوى الرسالة
        content: { type: String, required: true },

        // نوع الرسالة إن كانت من زائر
        category: {
            type: String,
            enum: ["feedback", "complaint", "suggestion", "support"],
        },

        // مرفقات اختيارية
        attachments: [
            {
                fileUrl: String,
                fileType: {
                    type: String,
                    enum: ["image", "video", "document", "audio"],
                },
            },
        ],

        // حالة الرسالة
        status: {
            type: String,
            enum: ["unread", "in-progress", "resolved"],
            default: "unread",
        },

        // رد الإدارة
        response: { type: String, default: "" },

        // هل الرسالة مميزة؟ (لعرضها مثلاً على صفحة خارجية)
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
