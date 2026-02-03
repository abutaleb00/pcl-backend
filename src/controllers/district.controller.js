const { District } = require("../models");

exports.create = async (req, res) => {
    try {
        const { name, DivisionId } = req.body;

        const district = await District.create({ name, DivisionId });
        res.json(district);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const districts = await District.findAll({
            order: [["id", "ASC"]]
        });
        res.json(districts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const district = await District.findByPk(req.params.id);
        if (!district) {
            return res.status(404).json({ error: "District not found" });
        }

        const { name, DivisionId } = req.body;
        await district.update({ name, DivisionId });

        res.json({ message: "District updated successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const district = await District.findByPk(req.params.id);
        if (!district) {
            return res.status(404).json({ error: "District not found" });
        }

        await district.destroy();
        res.json({ message: "District deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
