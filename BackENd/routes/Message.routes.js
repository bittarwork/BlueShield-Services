const express = require('express');
const router = express.Router();

const {
    createMessage,
    getAllMessages,
    getMessageById,
    markAsRead,
    replyToMessage,
    updateAdminNote,
    deleteMessage,
} = require('../controllers/message.controller');

const { protect, admin } = require('../middleware/auth.middleware');

// 🔹 إرسال رسالة (مفتوحة للزوار)
router.post('/', createMessage);

// 🔹 جلب كل الرسائل (أدمن فقط)
router.get('/', protect, admin, getAllMessages);

// 🔹 جلب رسالة واحدة (أدمن فقط)
router.get('/:id', protect, admin, getMessageById);

// 🔹 تعيين الحالة "مقروءة" (أدمن فقط)
router.patch('/:id/mark-read', protect, admin, markAsRead);

// 🔹 الرد على رسالة (أدمن فقط)
router.patch('/:id/reply', protect, admin, replyToMessage);

// 🔹 تحديث ملاحظة المسؤول (أدمن فقط)
router.patch('/:id/admin-note', protect, admin, updateAdminNote);

// 🔹 حذف رسالة (أدمن فقط)
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
