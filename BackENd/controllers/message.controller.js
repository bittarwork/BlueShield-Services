const Message = require("../models/messageModel");
const User = require("../models/User"); // للتأكد من المستخدمين في الرسائل الداخلية

// إنشاء رسالة من زائر خارجي
exports.createExternalMessage = async (req, res) => {
    try {
        const { name, email, phone, content, category } = req.body;

        const newMessage = new Message({
            senderType: "external",
            senderInfo: { name, email, phone },
            content,
            category,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: "Failed to create external message", details: err.message });
    }
};

// إرسال رسالة داخلية بين مستخدمين
exports.sendInternalMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content, attachments } = req.body;

        // تأكد من وجود المستخدمين
        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId),
        ]);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        const newMessage = new Message({
            senderType: "user",
            sender: senderId,
            receiver: receiverId,
            content,
            attachments,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: "Failed to send internal message", details: err.message });
    }
};

// جلب جميع الرسائل (بفلترة اختيارية)
exports.getAllMessages = async (req, res) => {
    try {
        const filters = req.query; // مثل ?status=unread&senderType=external
        const messages = await Message.find(filters)
            .populate("sender", "name email role")
            .populate("receiver", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages", details: err.message });
    }
};

// جلب رسالة واحدة حسب ID
exports.getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id)
            .populate("sender", "name email role")
            .populate("receiver", "name email role");

        if (!message) return res.status(404).json({ error: "Message not found" });

        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch message", details: err.message });
    }
};

// جلب رسائل مستخدم (المرسلة والمستقبلة)
exports.getMessagesForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user messages", details: err.message });
    }
};

// جلب كل رسائل الزوار (external)
exports.getMessagesFromExternal = async (req, res) => {
    try {
        const messages = await Message.find({ senderType: "external" }).sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch external messages", details: err.message });
    }
};

// تحديث حالة الرسالة
exports.updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["unread", "in-progress", "resolved"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updated = await Message.findByIdAndUpdate(id, { status }, { new: true });

        if (!updated) return res.status(404).json({ error: "Message not found" });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update status", details: err.message });
    }
};

// الرد على رسالة
exports.respondToMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        const updated = await Message.findByIdAndUpdate(
            id,
            { response, status: "resolved" },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "Message not found" });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to respond to message", details: err.message });
    }
};

// حذف رسالة
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Message.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ error: "Message not found" });

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete message", details: err.message });
    }
};

// تفعيل/إلغاء تمييز رسالة
exports.toggleFeaturedMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ error: "Message not found" });

        message.isFeatured = !message.isFeatured;
        await message.save();

        res.status(200).json({ message: "Featured status toggled", newStatus: message.isFeatured });
    } catch (err) {
        res.status(500).json({ error: "Failed to toggle featured status", details: err.message });
    }
};
