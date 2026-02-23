const db = require("../models");
const { Op } = require("sequelize");

/**
 * 1. Start or Resume a chat (Visitor Side)
 * Resumes 'active' rooms. If a room was 'completed', it will start a fresh one.
 */
exports.startChat = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        console.log(`📡 Chat Request from: ${email}`);

        let room = await db.ChatRoom.findOne({
            where: {
                visitor_email: email,
                status: 'active' // Only resume if currently active
            }
        });

        if (!room) {
            console.log("🆕 Creating new chat room for visitor...");
            room = await db.ChatRoom.create({
                visitor_name: name || 'Guest',
                visitor_email: email,
                status: 'active'
            });
        }

        const history = await db.ChatMessage.findAll({
            where: { room_id: room.id },
            order: [['createdAt', 'ASC']]
        });

        res.json({ room, history });
    } catch (err) {
        console.error("❌ startChat Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * 2. Get Room Status by ID
 */
exports.getRoomStatus = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await db.ChatRoom.findByPk(roomId);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        const messages = await db.ChatMessage.findAll({
            where: { room_id: roomId },
            order: [['createdAt', 'ASC']]
        });

        res.json({ room, messages });
    } catch (err) {
        console.error("❌ getRoomStatus Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * 3. Get all chat rooms (Admin Sidebar)
 * UPDATED: Fetches all statuses so the Frontend can filter between Active and History tabs.
 */
exports.getAdminRooms = async (req, res) => {
    try {
        const rooms = await db.ChatRoom.findAll({
            // REMOVED status: 'active' filter to allow "History" view
            attributes: {
                include: [
                    [
                        db.sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM ChatMessages
                            WHERE ChatMessages.room_id = ChatRoom.id
                            AND ChatMessages.is_read = false
                            AND ChatMessages.sender_type = 'visitor'
                        )`),
                        'unreadCount'
                    ]
                ]
            },
            include: [{
                model: db.ChatMessage,
                as: 'messages',
                limit: 1,
                order: [['createdAt', 'DESC']]
            }],
            order: [['updatedAt', 'DESC']]
        });
        res.json(rooms);
    } catch (err) {
        console.error("❌ getAdminRooms Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * 4. Mark Chat as Completed (NEW ACTION)
 */
exports.completeChat = async (req, res) => {
    try {
        const { roomId } = req.params;

        const [updatedRows] = await db.ChatRoom.update(
            { status: 'completed' },
            { where: { id: roomId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json({ success: true, message: "Chat marked as completed" });
    } catch (err) {
        console.error("❌ completeChat Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * 5. Get full history and Mark as Read
 */
exports.getChatHistory = async (req, res) => {
    try {
        const { roomId } = req.params;

        await db.ChatMessage.update(
            { is_read: true },
            {
                where: {
                    room_id: roomId,
                    sender_type: 'visitor',
                    is_read: false
                }
            }
        );

        const messages = await db.ChatMessage.findAll({
            where: { room_id: roomId },
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (err) {
        console.error("❌ getChatHistory Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * 6. Close/Archive a chat
 */
exports.closeChat = async (req, res) => {
    try {
        const { roomId } = req.params;
        await db.ChatRoom.update(
            { status: 'closed' },
            { where: { id: roomId } }
        );
        res.json({ message: "Chat closed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * 7. Mark as Read (Socket Fallback)
 */
exports.markAsRead = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { role } = req.body;
        const targetSender = role === 'staff' ? 'visitor' : 'staff';

        await db.ChatMessage.update(
            { is_read: true },
            {
                where: {
                    room_id: roomId,
                    sender_type: targetSender,
                    is_read: false
                }
            }
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};