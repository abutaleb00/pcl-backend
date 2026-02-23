const { Product } = require("../models");

// Create Product
exports.create = async (req, res) => {
    try {
        const { name, link, description, status, order } = req.body;
        const logoPath = req.file ? `/uploads/products/${req.file.filename}` : null;

        const newProduct = await Product.create({
            name,
            link,
            description,
            logo: logoPath,
            status: status ?? 1,
            order: order ?? 0
        });

        res.status(201).json({ success: true, data: newProduct });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Find All Public (Sorted by Order)
exports.findAllPublic = async (req, res) => {
    try {
        const data = await Product.findAll({
            where: { status: 1 },
            order: [['order', 'ASC'], ['name', 'ASC']]
        });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Find One
exports.findOne = async (req, res) => {
    try {
        const data = await Product.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: "Not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (req.file) {
            updateData.logo = `/uploads/products/${req.file.filename}`;
        }

        const [updated] = await Product.update(updateData, { where: { id } });
        if (updated) {
            const result = await Product.findByPk(id);
            return res.status(200).json({ success: true, data: result });
        }
        res.status(404).json({ message: "Product not found" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const deleted = await Product.destroy({ where: { id: req.params.id } });
        if (deleted) return res.status(200).json({ success: true, message: "Deleted" });
        res.status(404).json({ message: "Not found" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};