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
 * UPDATE STATUS (Admin)
 */
exports.update = async (req, res) => {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ error: "Not found" });

    await inquiry.update(req.body);
    res.json({ message: "Inquiry updated" });
};

/**
 * DELETE (Admin)
 */
exports.remove = async (req, res) => {
    await Inquiry.destroy({ where: { id: req.params.id } });
    res.json({ message: "Inquiry deleted" });
};
