require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const db = require("./models");
const chatSocket = require("./sockets/chat.socket");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket.io/",
  cors: {
    origin: [
      "http://localhost:3000",
      "https://pcl-website.vercel.app",
      "https://pcl.maanrishfaxyz.xyz",
      "https://pmcon.net",
      "https://www.pmcon.net"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

(async () => {
  try {
    // 1. Authenticate connection
    await db.sequelize.authenticate();
    console.log("✅ MySQL connection authenticated.");

    /**
     * 2. Database Sync Strategy
     * CHANGE: Removed { alter: true } to prevent "Too many keys" error.
     * Use migrations for production schema changes.
     * If you are in local development and MUST sync, use { force: false }
     */
    await db.sequelize.sync();
    console.log("✅ Database models synced (Safe mode).");

    /**
     * 3. Initialize Socket Logic
     * We pass 'io' here so your chat.socket.js can use io.to().emit()
     */
    chatSocket(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server & Sockets running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
})();