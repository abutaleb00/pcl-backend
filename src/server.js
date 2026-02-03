require("dotenv").config();
const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // ✅ Only check DB connection
    await db.sequelize.authenticate();
    console.log("✅ MySQL connected");

    app.listen(PORT, () => {
      console.log(`🚀 PCL Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed:", error);
    process.exit(1);
  }
})();
