const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * =========================
 * REGISTER
 * =========================
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validation
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required",
            });
        }

        // check existing user (including soft-deleted)
        const existing = await User.findOne({
            where: { email },
            paranoid: false,
        });

        if (existing) {
            return res.status(409).json({
                error: "Email already registered",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            status: true, // active by default
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};

/**
 * =========================
 * LOGIN
 * =========================
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // 2. Find User
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3. Check Status
        if (!user.status) {
            return res.status(403).json({ error: "Account deactivated. Contact admin." });
        }

        // 4. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 5. Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 6. Set Cookie (Best effort for browsers)
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: true,        // Required for HTTPS
            sameSite: "none",    // Required for Cross-Site
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 7. Send Response (Token in Body is crucial for Vercel/VPS fix)
        res.json({
            message: "Login successful",
            token, // <--- Frontend needs this to save to localStorage
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
};

/**
 * =========================
 * LOGOUT
 * =========================
 */
exports.logout = async (req, res) => {
    // ✅ Clear the cookie properly with the same options
    res.clearCookie("admin_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.json({ message: "Logged out successfully" });
};