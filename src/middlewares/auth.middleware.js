const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = async (req, res, next) => {
    try {
        let token;

        // 🔥 OPTION 1: Check Authorization Header (Priority for Vercel/VPS)
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        
        // 🔥 OPTION 2: Check Cookie (Fallback for Localhost)
        else if (req.cookies?.admin_token) {
            token = req.cookies.admin_token;
        }

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify Token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Load User
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};