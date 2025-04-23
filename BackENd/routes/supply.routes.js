const express = require("express");
const {
    createRequest,
    getAllRequests,
    getUserRequests,
    getRequestById,
    updateStatus,
    assignTechnician,
    addAdminNote,
    deleteRequest
} = require("../controllers/supply.controller");

const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

// ✅ إرسال طلب - مستخدم عادي
router.post("/", protect, createRequest);

// ✅ جلب جميع الطلبات - أدمن فقط
router.get("/", protect, admin, getAllRequests);

// ✅ جلب طلبات مستخدم معين - مستخدم عادي فقط
router.get("/my", protect, getUserRequests);

// ✅ جلب تفاصيل طلب - صاحب الطلب أو أدمن
router.get("/:id", protect, getRequestById);

// ✅ تحديث حالة الطلب - أدمن أو تقني
router.patch("/:id/status", protect, updateStatus);

// ✅ تعيين تقني - أدمن فقط
router.patch("/:id/assign", protect, admin, assignTechnician);

// ✅ إضافة ملاحظة من الأدمن
router.post("/:id/note", protect, addAdminNote);

// ✅ حذف طلب - أدمن فقط
router.delete("/:id", protect, admin, deleteRequest);

module.exports = router;
