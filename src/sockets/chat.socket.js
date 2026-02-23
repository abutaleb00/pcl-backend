const db = require("../models"); // Import the full db object
const botService = require("../services/bot.service");

// Destructure models for easier local use where db prefix isn't used
const { ChatMessage, ChatRoom } = db;

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("🔌 New Connection established:", socket.id);

        /**
         * 1. JOIN ROOM
         */
        socket.on("join_room", (room_id) => {
            if (!room_id) return;
            socket.join(room_id.toString());
            console.log(`👤 User joined room: ${room_id}`);
        });

        /**
         * 2. STAFF JOIN
         */
        socket.on("staff_join", () => {
            socket.join("staff_room");
            console.log("🛠 Staff member monitoring global alerts");
        });

        /**
         * 3. MAIN MESSAGE HANDLER
         */
        socket.on("send_message", async (data) => {
            try {
                const { room_id, message, sender_type, visitor_name, sender_id } = data;
                const cleanRoomId = parseInt(room_id);

                if (!message || isNaN(cleanRoomId)) return;

                // A. Save the incoming message
                const savedMessage = await db.ChatMessage.create({
                    room_id: cleanRoomId,
                    message: message.trim(),
                    sender_type: sender_type,
                    sender_id: sender_id || null,
                    is_read: false
                });

                // B. Broadcast immediately to the room
                io.to(cleanRoomId.toString()).emit("receive_message", savedMessage);

                // C. Update Room Status
                await db.ChatRoom.update(
                    { updatedAt: new Date(), status: 'active' },
                    { where: { id: cleanRoomId } }
                );

                // D. Visitor-specific Logic (Staff alerts + Bot)
                if (sender_type === "visitor") {
                    io.to("staff_room").emit("new_chat_alert", {
                        room_id: cleanRoomId,
                        message: message,
                        visitor_name: visitor_name,
                        updatedAt: new Date(),
                        messages: [savedMessage]
                    });

                    // E. 🤖 ENHANCED BOT LOGIC
                    // Check if any staff member has ever replied in this room
                    const staffReplyCount = await db.ChatMessage.count({
                        where: {
                            room_id: cleanRoomId,
                            sender_type: 'staff'
                        }
                    });

                    // If staff has already replied (count > 0), the bot stays silent
                    if (staffReplyCount === 0) {
                        setTimeout(async () => {
                            const botResponse = getSmartResponse(message);

                            const savedBotMsg = await db.ChatMessage.create({
                                room_id: cleanRoomId,
                                message: botResponse,
                                sender_type: 'staff', // Marking as staff so it appears on the left
                                sender_id: null,      // System/Bot ID
                                is_read: true
                            });

                            io.to(cleanRoomId.toString()).emit("receive_message", savedBotMsg);
                        }, 1500);
                    }
                }

            } catch (err) {
                console.error("❌ Socket Error:", err);
            }
        });
        // Helper for Bot Intelligence
        function getSmartResponse(userText) {
            const input = userText.toLowerCase();

            if (input.includes("price") || input.includes("cost") || input.includes("package")) {
                return "Our service packages vary based on your needs. You can view our full pricing list here: [Link] or I can have an agent send you a quote!";
            }
            if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
                return "Hello! Thanks for reaching out. How can we help you today?";
            }
            if (input.includes("location") || input.includes("office") || input.includes("address")) {
                return "Our main office is located in Dhaka. We operate from 9 AM to 6 PM.";
            }

            // Default fallback
            return "Thanks for your message! I've alerted our team, and a human agent will be with you shortly. In the meantime, feel free to browse our services.";
        }
        /**
         * 4. TYPING INDICATORS
         */
        socket.on("typing", (data) => {
            if (data.room_id) {
                socket.to(data.room_id.toString()).emit("display_typing", data);
            }
        });

        /**
         * 5. READ RECEIPTS
         */
        socket.on("message_read", async ({ room_id, reader_type }) => {
            try {
                const cleanRoomId = parseInt(room_id);
                const targetSender = reader_type === 'staff' ? 'visitor' : 'staff';

                // Use db.ChatMessage to ensure reference is defined
                await db.ChatMessage.update({ is_read: true }, {
                    where: {
                        room_id: cleanRoomId,
                        sender_type: targetSender,
                        is_read: false
                    }
                });

                io.to(cleanRoomId.toString()).emit("messages_seen", { room_id: cleanRoomId });
            } catch (err) {
                console.error("❌ Read Receipt Error:", err);
            }
        });

        /**
         * 6. SESSION COMPLETION
         */
        socket.on("complete_chat", async ({ room_id }) => {
            try {
                const cleanRoomId = parseInt(room_id);
                await db.ChatRoom.update(
                    { status: 'completed' },
                    { where: { id: cleanRoomId } }
                );

                io.to(cleanRoomId.toString()).emit("room_status_updated", {
                    room_id: cleanRoomId,
                    status: 'completed'
                });

                console.log(`✅ Session ${cleanRoomId} marked as completed.`);
            } catch (err) {
                console.error("❌ Completion Error:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("🔌 Disconnected:", socket.id);
        });
    });
};