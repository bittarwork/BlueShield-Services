const express = require("express");
const router = express.Router();

const {
    createMaintenanceRequest,
    getAllMaintenanceRequests,
    getMaintenanceRequestById,
    updateMaintenanceRequest,
    deleteMaintenanceRequest,
    getRequestsByUser,
    changeStatus,
    setResolvedAt,
    addNote,
    exportRequestsReport,
    assignTechnician,
} = require("../controllers/request.controller");

const upload = require("../config/multer"); // أو "../config/multer" حسب مكان الملف
const { protect, admin } = require("../middleware/auth.middleware");


// 🔹 إنشاء طلب صيانة (مستخدم مسجل فقط) + صور
router.post("/", protect, upload.array("images", 5), createMaintenanceRequest);

// 🔹 جلب كل الطلبات (أدمن فقط)
router.get("/", protect, admin, getAllMaintenanceRequests);

// 🔹 جلب طلب محدد
router.get("/:id", protect, getMaintenanceRequestById);

// 🔹 حذف طلب (أدمن فقط)
router.delete("/:id", protect, admin, deleteMaintenanceRequest);

// 🔹 تحديث الطلب (أدمن فقط)
router.put("/:id", protect, admin, updateMaintenanceRequest);

// 🔹 جلب طلبات مستخدم معين
router.get("/user/:userId", protect, getRequestsByUser);

// 🔹 تغيير الحالة (أدمن فقط)
router.patch("/:id/status", protect, admin, changeStatus);

// 🔹 تعيين فني (أدمن فقط)
router.patch("/:id/assign", protect, admin, assignTechnician);

// 🔹 تسجيل وقت الحل (أدمن فقط)
router.patch("/:id/resolve", protect, admin, setResolvedAt);

// 🔹 إضافة ملاحظة (جميع الأدوار المسجلة)
router.post("/:id/note", protect, addNote);

// 🔹 تصدير تقرير الطلبات (أدمن فقط)
router.get("/export-report", protect, admin, exportRequestsReport);


module.exports = router;
