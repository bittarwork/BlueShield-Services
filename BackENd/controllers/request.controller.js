const MaintenanceRequest = require('../models/MaintenanceRequest');
const mongoose = require('mongoose');
const ExcelJS = require("exceljs");

// ✅ Create a new maintenance request
exports.createMaintenanceRequest = async (req, res) => {
    try {
        const { description, category, location } = req.body;

        // Validate required fields
        if (!description || !category || !location) {
            return res.status(400).json({ error: 'Description, category, and location are required' });
        }

        // Parse location if needed
        const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
        if (!parsedLocation.lat || !parsedLocation.lng) {
            return res.status(400).json({ error: 'Invalid location coordinates' });
        }

        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.filename);
        }

        // Create and save new request
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
        res.status(500).json({ error: 'Failed to create maintenance request' });
    }
};

// ✅ Get all maintenance requests (admin only)
exports.getAllMaintenanceRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find()
            .populate('user_id category technician_id');
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch maintenance requests' });
    }
};

// ✅ Get a single maintenance request by ID
exports.getMaintenanceRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await MaintenanceRequest.findById(id)
            .populate('user_id category technician_id');

        if (!request) return res.status(404).json({ error: 'Request not found' });

        res.status(200).json(request);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch maintenance request' });
    }
};

// ✅ Delete a maintenance request (admin only)
exports.deleteMaintenanceRequest = async (req, res) => {
    try {
        const deleted = await MaintenanceRequest.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ error: 'Request not found' });

        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete maintenance request' });
    }
};

// ✅ Update maintenance request (admin only)
exports.updateMaintenanceRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await MaintenanceRequest.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) return res.status(404).json({ error: 'Request not found' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update maintenance request' });
    }
};

// ✅ Get maintenance requests by user
exports.getRequestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await MaintenanceRequest.find({ user_id: userId });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user maintenance requests' });
    }
};

// ✅ Change maintenance request status (admin only)
exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'assigned', 'in-progress', 'resolved'];

        // Validate status value
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const updated = await MaintenanceRequest.findByIdAndUpdate(id, { status }, { new: true });

        if (!updated) return res.status(404).json({ error: 'Request not found' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to change status' });
    }
};

// ✅ Assign a technician to a request (admin only)
exports.assignTechnician = async (req, res) => {
    try {
        const { id } = req.params;
        const { technician_id } = req.body;

        const request = await MaintenanceRequest.findById(id);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Assign technician and update status if pending
        request.technician_id = technician_id;

        if (request.status === "pending") {
            request.status = "assigned";
        }

        await request.save();
        res.status(200).json(request);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to assign technician' });
    }
};

// ✅ Set resolved time (admin only)
exports.setResolvedAt = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await MaintenanceRequest.findByIdAndUpdate(
            id,
            { resolved_at: new Date(), status: 'resolved' },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Request not found' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to set resolved time' });
    }
};

// ✅ Add a note (user/admin/technician)
exports.addNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Note text is required' });
        }

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

        if (!updated) return res.status(404).json({ error: 'Request not found' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add note' });
    }
};

// ✅ Export maintenance requests to Excel
exports.exportRequestsReport = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find()
            .populate("user_id", "name email")
            .populate("technician_id", "name email")
            .lean();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Maintenance Requests");

        // Set worksheet columns
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

        // Populate worksheet with request data
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

        // Set response headers
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=requests_report.xlsx"
        );

        // Send the Excel file
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Error exporting report:", err);
        res.status(500).json({ message: "Error generating Excel report" });
    }
};
