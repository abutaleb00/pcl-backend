const router = require("express").Router();
const chatController = require("../controllers/chat.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

/**
 * 🌐 Public Routes
 * These are accessed by website visitors.
 */

// Start a new session or resume an existing one
router.post("/start", chatController.startChat);

// Get specific room status/messages for the visitor widget
router.get("/room/:roomId", chatController.getRoomStatus);


/**
 * 🔐 Admin / Staff Routes
 * These require a valid token and admin/staff privileges.
 */

// Fetch all chat rooms (Active & Completed) for the admin dashboard
router.get(
    "/admin/rooms",
    verifyToken,
    isAdmin, // Ensuring only staff/admins can see the list
    chatController.getAdminRooms
);

// Fetch full message history and mark visitor messages as read
router.get(
    "/admin/history/:roomId",
    verifyToken,
    isAdmin,
    chatController.getChatHistory
);

// Mark a chat as COMPLETED (Moves it to the History tab)
router.put(
    "/admin/complete/:roomId",
    verifyToken,
    isAdmin,
    chatController.completeChat
);

// Close/Archive a chat session (Traditional close)
router.put(
    "/admin/close/:roomId",
    verifyToken,
    isAdmin,
    chatController.closeChat
);

// Manually mark messages as read (Socket fallback)
router.post(
    "/read/:roomId",
    verifyToken,
    chatController.markAsRead
);

module.exports = router;