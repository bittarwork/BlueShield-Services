const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { protect, admin } = require("../middleware/auth.middleware");

// 📩 رسالة من زائر (خارجي) - متاحة للجميع
router.post("/external", messageController.createExternalMessage);

// 📩 رسالة داخلية بين مستخدمين - فقط للمستخدمين المسجلين
router.post("/internal", protect, messageController.sendInternalMessage);

// 🔍 جلب كل الرسائل (إداري فقط)
router.get("/", protect, admin, messageController.getAllMessages);

// 🔍 جلب رسالة محددة حسب ID (إداري فقط)
router.get("/:id", protect, admin, messageController.getMessageById);

// 📥 جلب رسائل مستخدم معيّن (للاستخدام الداخلي)
router.get("/user/:userId", protect, messageController.getMessagesForUser);

// 📥 جلب رسائل الزوار (إداري فقط)
router.get("/external/all", protect, admin, messageController.getMessagesFromExternal);

// 🔄 تحديث حالة الرسالة (إداري فقط)
router.patch("/status/:id", protect, admin, messageController.updateMessageStatus);

// ✏️ الرد على رسالة (إداري فقط)
router.patch("/response/:id", protect, admin, messageController.respondToMessage);

// 🗑 حذف رسالة (إداري فقط)
router.delete("/:id", protect, admin, messageController.deleteMessage);

// 🌟 تفعيل أو إلغاء تمييز الرسالة (إداري فقط)
router.patch("/featured/:id", protect, admin, messageController.toggleFeaturedMessage);

module.exports = router;
