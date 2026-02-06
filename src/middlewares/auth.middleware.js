const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = async (req, res, next) => {
    try {
        // 🔥 1. Read token from cookie
        const token = req.cookies?.admin_token;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // 🔥 2. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 🔥 3. Load user
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // 🔥 4. Attach user to request
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
