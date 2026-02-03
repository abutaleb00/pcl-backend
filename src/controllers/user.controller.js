const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.User;

/**
 * GET all users (exclude soft deleted)
 */
exports.getAll = async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ["password"] },
        order: [["id", "DESC"]],
    });
    res.json(users);
};

/**
 * ACTIVATE / DEACTIVATE user
 */
exports.toggleActive = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.is_active = !user.is_active;
        await user.save();

        res.json({
            message: `User ${user.is_active ? "activated" : "deactivated"} successfully`,
            is_active: user.is_active,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update user status" });
    }
};

/**
 * SOFT DELETE user
 */
exports.softDelete = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy(); // ✅ soft delete
        res.json({ message: "User deleted successfully (soft delete)" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};

/**
 * RESTORE soft deleted user (optional but recommended)
 */
exports.restore = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            paranoid: false,
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.restore();
        res.json({ message: "User restored successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to restore user" });
    }
};

/**
 * =========================
 * ADMIN UPDATE USER
 * =========================
 * PUT /api/admin/users/:id
 */
exports.adminUpdateUser = async (req, res) => {
    try {
        const { name, email, role, status } = req.body;

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.update({
            name: name ?? user.name,
            email: email ?? user.email,
            role: role ?? user.role,
            status: status ?? user.status,
        });

        res.json({
            message: "User updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        console.error("Admin update user error:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

/**
 * =========================
 * USER UPDATE OWN PROFILE
 * =========================
 * PUT /api/profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // from JWT middleware
        const { name, email } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.update({
            name: name ?? user.name,
            email: email ?? user.email,
        });

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

/**
 * =========================
 * USER CHANGE PASSWORD
 * =========================
 * PUT /api/profile/password
 */
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both passwords are required" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashed });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
};