const Message = require('../models/messageModel');

/**
 * @desc   Send a message (public use)
 * @route  POST /api/messages
 * @access Public
 */
const createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newMessage = new Message({
            name,
            email,
            subject,
            message,
        });

        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully.' });
    } catch (err) {
        console.error('Error in createMessage:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @desc   Get all messages (admin only)
 * @route  GET /api/messages
 * @access Admin
 */
const getAllMessages = async (req, res) => {
    try {
        const { isRead, isReplied, search } = req.query;

        let filter = {};
        if (isRead !== undefined) filter.isRead = isRead === 'true';
        if (isReplied !== undefined) filter.isReplied = isReplied === 'true';

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
            ];
        }

        const messages = await Message.find(filter).sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error in getAllMessages:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @desc   Get single message (admin only)
 * @route  GET /api/messages/:id
 * @access Admin
 */
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ error: 'Message not found.' });

        res.status(200).json(message);
    } catch (err) {
        console.error('Error in getMessageById:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @desc   Mark message as read (admin only)
 * @route  PATCH /api/messages/:id/mark-read
 * @access Admin
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );
        if (!message) return res.status(404).json({ error: 'Message not found.' });

        res.status(200).json({ message: 'Marked as read.', data: message });
    } catch (err) {
        console.error('Error in markAsRead:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @desc   Reply to message (admin only)
 * @route  PATCH /api/messages/:id/reply
 * @access Admin
 */
const replyToMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { replyMessage } = req.body;

        if (!replyMessage)
            return res.status(400).json({ error: 'Reply message is required.' });

        const message = await Message.findByIdAndUpdate(
            id,
            {
                isReplied: true,
                replyMessage,
            },
            { new: true }
        );

        if (!message) return res.status(404).json({ error: 'Message not found.' });

        res.status(200).json({ message: 'Reply saved.', data: message });
    } catch (err) {
        console.error('Error in replyToMessage:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @desc   Add or update admin note (admin only)
 * @route  PATCH /api/messages/:id/admin-note
 * @access Admin
 */
const updateAdminNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;

        const message = await Message.findByIdAndUpdate(
            id,
            { adminNote },
            { new: true }
        );

        if (!message) return res.status(404).json({ error: 'Message not found.' });

        res.status(200).json({ message: 'Note updated.', data: message });
    } catch (err) {
        console.error('Error in updateAdminNote:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @desc   Delete message (admin only)
 * @route  DELETE /api/messages/:id
 * @access Admin
 */
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndDelete(id);

        if (!message) return res.status(404).json({ error: 'Message not found.' });

        res.status(200).json({ message: 'Message deleted.' });
    } catch (err) {
        console.error('Error in deleteMessage:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// تصدير كل الدوال بصيغة CommonJS
module.exports = {
    createMessage,
    getAllMessages,
    getMessageById,
    markAsRead,
    replyToMessage,
    updateAdminNote,
    deleteMessage,
};
