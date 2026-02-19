const db = require("../models");
const Client = db.Client;
const fs = require("fs");
const path = require("path");

// Get all clients (Public)
// Optimized to sort by custom 'order' first, then newest ID
exports.findAllPublic = async (req, res) => {
    try {
        const clients = await Client.findAll({
            where: { is_active: true },
            order: [
                ['order', 'ASC'],
                ['id', 'DESC'] 
            ]
        });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single client for editing (Admin)
exports.findOne = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: "Client not found" });
        res.json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create Client
exports.create = async (req, res) => {
    try {
        const { name, order } = req.body;

        // Handle Logo Path
        const logoPath = req.file ? `/uploads/clients/${req.file.filename}` : null;
        if (!logoPath) return res.status(400).json({ error: "Client logo is required" });

        const client = await Client.create({
            name,
            logo: logoPath,
            order: order || 0,
            is_active: true
        });

        res.status(201).json({ message: "Client created successfully", client });
    } catch (err) {
        // Cleanup: delete uploaded file if DB save fails
        if (req.file) {
            const uploadedPath = path.join(process.cwd(), `/uploads/clients/${req.file.filename}`);
            if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
        }
        res.status(500).json({ error: err.message });
    }
};

// Update Client
exports.update = async (req, res) => {
    try {
        const { name, is_active, order } = req.body;
        const client = await Client.findByPk(req.params.id);

        if (!client) return res.status(404).json({ message: "Client not found" });

        let logoPath = client.logo;

        // If a new logo is uploaded
        if (req.file) {
            // Delete old file from server
            const oldPath = path.join(process.cwd(), client.logo);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

            logoPath = `/uploads/clients/${req.file.filename}`;
        }

        await client.update({
            name: name || client.name,
            is_active: is_active !== undefined ? is_active : client.is_active,
            order: order !== undefined ? order : client.order,
            logo: logoPath
        });

        res.json({ message: "Client updated successfully", client });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Client
exports.delete = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        // Remove image file from physical storage
        const imagePath = path.join(process.cwd(), client.logo);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await client.destroy();
        res.json({ message: "Client deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};