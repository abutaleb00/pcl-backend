const { ChatMessage } = require("../models");

/**
 * 🤖 Bot Response Logic
 * Maps keywords to specific helpful answers.
 */
const getBotReply = (text) => {
    const input = text.toLowerCase();

    if (input.includes("pricing") || input.includes("cost") || input.includes("price"))
        return "Our service packages start at $500. You can view full details on our 'Packages' page! 💰";

    if (input.includes("human") || input.includes("agent") || input.includes("talk to someone"))
        return "I've alerted our support team. A human agent will jump in here as soon as they are available! 🧑‍💻";

    if (input.includes("hours") || input.includes("time") || input.includes("open"))
        return "Our office hours are Monday to Friday, 9:00 AM - 6:00 PM (GMT). ⏰";

    return "Thanks for reaching out! I've notified our team. In the meantime, you can type 'pricing' for costs or 'hours' for our schedule. 😊";
};

/**
 * 🧠 Handle Bot Logic
 * Orchestrates the "thinking" process, typing indicators, and database storage.
 */
exports.handleBotLogic = async (io, roomId, messageText) => {
    try {
        const cleanRoomId = roomId.toString();

        // 1. Show "Agent is typing..." to the visitor to make it feel natural
        io.to(cleanRoomId).emit("display_typing", {
            room_id: roomId,
            isTyping: true,
            sender_type: 'staff'
        });

        // 2. Simulate "thinking" time (e.g., 2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Get the response text
        const reply = getBotReply(messageText);

        // 4. Save Bot Message to Database
        const botMsg = await ChatMessage.create({
            room_id: parseInt(roomId),
            message: reply,
            sender_type: "staff", // Bot acts as staff
            is_read: false
        });

        // 5. Stop typing indicator
        io.to(cleanRoomId).emit("display_typing", {
            room_id: roomId,
            isTyping: false,
            sender_type: 'staff'
        });

        // 6. Send the final message
        io.to(cleanRoomId).emit("receive_message", botMsg);

    } catch (err) {
        console.error("❌ Bot Service Error:", err);
    }
};