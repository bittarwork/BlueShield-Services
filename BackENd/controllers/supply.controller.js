const WaterAlternativeRequest = require("../models/AlternativeWaterSupply");
const User = require("../models/User");

// ✅ إنشاء طلب جديد - من قبل المستخدم
exports.createRequest = async (req, res) => {
    try {
        const { description, location, paymentMethod } = req.body;

        if (!description || !location?.lat || !location?.lng) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newRequest = await WaterAlternativeRequest.create({
            user: req.user._id,
            description,
            location,
            paymentMethod,
        });

        res.status(201).json(newRequest);
    } catch (err) {
        console.error("Error creating request:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ جلب جميع الطلبات - للأدمن فقط
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await WaterAlternativeRequest.find()
            .populate("user", "first_name last_name email")
            .populate("technician", "first_name last_name email");

        res.status(200).json(requests);
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ جلب الطلبات الخاصة بالمستخدم
exports.getUserRequests = async (req, res) => {
    try {
        const requests = await WaterAlternativeRequest.find({ user: req.user._id });
        res.status(200).json(requests);
    } catch (err) {
        console.error("Error fetching user requests:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ جلب طلب واحد بالتفصيل
exports.getRequestById = async (req, res) => {
    try {
        const request = await WaterAlternativeRequest.findById(req.params.id)
            .populate("user", "first_name last_name email")
            .populate("technician", "first_name last_name email");

        if (!request) return res.status(404).json({ error: "Request not found" });

        // يمكن التحقق هنا من أن المستخدم يملك الطلب في حال لم يكن أدمن
        if (req.user.role === "user" && request.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized" });
        }

        res.status(200).json(request);
    } catch (err) {
        console.error("Error fetching request by ID:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ تحديث الحالة
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "assigned", "in_progress", "delivered", "completed", "cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const request = await WaterAlternativeRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) return res.status(404).json({ error: "Request not found" });

        res.status(200).json(request);
    } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ تعيين تقني للطلب
exports.assignTechnician = async (req, res) => {
    try {
        const { technicianId } = req.body;

        const technician = await User.findById(technicianId);
        if (!technician || technician.role !== "technician") {
            return res.status(400).json({ error: "Invalid technician" });
        }

        const request = await WaterAlternativeRequest.findByIdAndUpdate(
            req.params.id,
            { technician: technicianId, status: "assigned" },
            { new: true }
        );

        if (!request) return res.status(404).json({ error: "Request not found" });

        res.status(200).json(request);
    } catch (err) {
        console.error("Error assigning technician:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ إضافة ملاحظة إدارية
exports.addAdminNote = async (req, res) => {
    try {
        const { note } = req.body;

        if (!note) return res.status(400).json({ error: "Note is required" });

        const request = await WaterAlternativeRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Request not found" });

        request.adminNotes.push({
            note,
            addedBy: req.user.email || "admin",
        });

        await request.save();
        res.status(200).json(request);
    } catch (err) {
        console.error("Error adding note:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ حذف الطلب (لأغراض إدارية فقط)
exports.deleteRequest = async (req, res) => {
    try {
        const deleted = await WaterAlternativeRequest.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Request not found" });

        res.status(200).json({ message: "Request deleted successfully" });
    } catch (err) {
        console.error("Error deleting request:", err);
        res.status(500).json({ error: "Server error" });
    }
};
