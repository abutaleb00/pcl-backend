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

        // validation
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required",
            });
        }

        // find user (exclude soft deleted users)
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password",
            });
        }

        // check active / deactive
        if (!user.status) {
            return res.status(403).json({
                error: "Your account is deactivated. Contact admin.",
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid email or password",
            });
        }

        // create JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
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
 * JWT logout handled by frontend
 */
exports.logout = async (req, res) => {
    res.json({ message: "Logged out successfully" });
};
