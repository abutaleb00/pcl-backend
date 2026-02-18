const { Inquiry } = require("../models");

/**
 * CREATE (Public)
 */
exports.create = async (req, res) => {
    try {
        const inquiry = await Inquiry.create(req.body);
        res.status(201).json({ message: "Inquiry submitted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET ALL (Admin)
 */
exports.getAll = async (req, res) => {
    const inquiries = await Inquiry.findAll({
        order: [["created_at", "DESC"]]
    });
    res.json(inquiries);
};

/**
 * UPDATE STATUS ONLY
 * PATCH /api/inquiries/:id/status
 */
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const inquiry = await Inquiry.findByPk(id);
        if (!inquiry) {
            return res.status(404).json({ error: "Inquiry not found" });
        }

        // Must match the ENUM values in your Model exactly
        const allowedStatuses = ["new", "processing", "contacted", "resolved", "cancelled"];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Choose from: ${allowedStatuses.join(", ")}`
            });
        }

        // Update the instance
        inquiry.status = status;
        await inquiry.save(); // save() is often more reliable for ENUM instances

        res.json({
            message: "Status updated successfully",
            id: inquiry.id,
            status: inquiry.status
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * UPDATE STATUS / SERVICE INTEREST (Admin)
 */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const inquiry = await Inquiry.findByPk(id);

        if (!inquiry) {
            return res.status(404).json({ error: "Inquiry not found" });
        }

        // 1. Extract service_interest along with other fields
        const { status, message, subject, service_interest } = req.body;

        // 2. Data Validation for Status
        const allowedStatuses = ['new', 'processing', 'contacted', 'resolved', 'cancelled'];

        // Only validate if status is actually provided and not empty
        if (status && status.trim() !== "" && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
            });
        }

        // 3. Update the database
        // We include service_interest in the update object
        await inquiry.update({
            status: status || inquiry.status, // Keep old status if new one is empty
            message,
            subject,
            service_interest
        });

        res.json({
            message: "Inquiry updated successfully",
            data: inquiry
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * DELETE (Admin)
 */
exports.remove = async (req, res) => {
    await Inquiry.destroy({ where: { id: req.params.id } });
    res.json({ message: "Inquiry deleted" });
};
