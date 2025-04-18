const MaintenanceRequest = require('../models/MaintenanceRequest');
const mongoose = require('mongoose');
const ExcelJS = require("exceljs");


// 🔹 إنشاء طلب صيانة جديد
exports.createMaintenanceRequest = async (req, res) => {
    try {
        const { description, category, location } = req.body;

        if (!description || !category || !location) {
            return res.status(400).json({ error: 'الوصف، الفئة، والموقع مطلوبة' });
        }

        const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
        if (!parsedLocation.lat || !parsedLocation.lng) {
            return res.status(400).json({ error: 'إحداثيات الموقع غير صالحة' });
        }

        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.filename);
        }

        const newRequest = new MaintenanceRequest({
            user_id: req.user._id,
            description,
            category,
            location: {
                lat: parsedLocation.lat,
                lng: parsedLocation.lng,
            },
            images,
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'فشل في إنشاء الطلب' });
    }
};

// 🔹 جلب جميع الطلبات (للأدمن)
exports.getAllMaintenanceRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find().populate('user_id category technician_id');
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: 'فشل في جلب الطلبات' });
    }
};

// 🔹 جلب طلب واحد
exports.getMaintenanceRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await MaintenanceRequest.findById(id).populate('user_id category technician_id');

        if (!request) return res.status(404).json({ error: 'الطلب غير موجود' });

        res.status(200).json(request);
    } catch (err) {
        res.status(500).json({ error: 'فشل في جلب الطلب' });
    }
};

// 🔹 حذف الطلب (مشرف فقط)
exports.deleteMaintenanceRequest = async (req, res) => {
    try {
        const deleted = await MaintenanceRequest.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'الطلب غير موجود' });

        res.status(200).json({ message: 'تم حذف الطلب بنجاح' });
    } catch (err) {
        res.status(500).json({ error: 'فشل في حذف الطلب' });
    }
};

// 🔹 تحديث بيانات الطلب (مشرف فقط)
exports.updateMaintenanceRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await MaintenanceRequest.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) return res.status(404).json({ error: 'الطلب غير موجود' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'فشل في التحديث' });
    }
};

// 🔹 جلب الطلبات حسب مستخدم
exports.getRequestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await MaintenanceRequest.find({ user_id: userId });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: 'فشل في جلب الطلبات' });
    }
};

// 🔹 تغيير الحالة (مشرف فقط)
exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'assigned', 'in-progress', 'resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'حالة غير صالحة' });
        }

        const updated = await MaintenanceRequest.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) return res.status(404).json({ error: 'الطلب غير موجود' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'فشل في تغيير الحالة' });
    }
};

// 🔹 تعيين فني (مشرف فقط)
exports.assignTechnician = async (req, res) => {
    try {
        const { id } = req.params;
        const { technician_id } = req.body;

        const updated = await MaintenanceRequest.findByIdAndUpdate(
            id,
            { technician_id },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'الطلب غير موجود' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'فشل في تعيين الفني' });
    }
};

// 🔹 تسجيل وقت الحل (مشرف فقط)
exports.setResolvedAt = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await MaintenanceRequest.findByIdAndUpdate(
            id,
            { resolved_at: new Date(), status: 'resolved' },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'الطلب غير موجود' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'فشل في تسجيل وقت الحل' });
    }
};

// 🔹 إضافة ملاحظة (user/admin/technician)
exports.addNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) return res.status(400).json({ error: 'النص مطلوب' });

        const note = {
            text,
            added_by: {
                user_id: req.user._id,
                role: req.user.role,
            },
        };

        const updated = await MaintenanceRequest.findByIdAndUpdate(
            id,
            { $push: { notes: note } },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'الطلب غير موجود' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'فشل في إضافة الملاحظة' });
    }
};
exports.exportRequestsReport = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find()
            .populate("user_id", "name email") // تعديل حسب بيانات المستخدم
            .populate("technician_id", "name email") // تعديل حسب بيانات الفني
            .lean();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Maintenance Requests");

        // إضافة رؤوس الأعمدة
        worksheet.columns = [
            { header: "Request ID", key: "id", width: 25 },
            { header: "User Name", key: "user_name", width: 20 },
            { header: "User Email", key: "user_email", width: 25 },
            { header: "Description", key: "description", width: 30 },
            { header: "Category", key: "category", width: 20 },
            { header: "Status", key: "status", width: 15 },
            { header: "Technician Name", key: "technician_name", width: 20 },
            { header: "Technician Email", key: "technician_email", width: 25 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Resolved At", key: "resolvedAt", width: 25 },
            { header: "Notes Count", key: "notes_count", width: 15 },
        ];

        // تعبئة البيانات
        requests.forEach(req => {
            worksheet.addRow({
                id: req._id.toString(),
                user_name: req.user_id?.name || "N/A",
                user_email: req.user_id?.email || "N/A",
                description: req.description,
                category: req.category,
                status: req.status,
                technician_name: req.technician_id?.name || "Not Assigned",
                technician_email: req.technician_id?.email || "N/A",
                createdAt: req.createdAt?.toISOString().split("T")[0] || "",
                resolvedAt: req.resolved_at?.toISOString().split("T")[0] || "",
                notes_count: req.notes?.length || 0,
            });
        });

        // تعيين نوع الملف للرسبونس
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=requests_report.xlsx"
        );

        // إرسال الملف
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Error exporting report:", err);
        res.status(500).json({ message: "Error generating Excel report" });
    }
};