const { Division, District, Upazila, Coverage } = require("../models");

exports.create = async (req, res) => {
    try {
        const division = await Division.create({ name: req.body.name });
        res.json(division);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const divisions = await Division.findAll({
            include: {
                model: District,
                include: {
                    model: Upazila,
                    include: Coverage
                }
            },
            order: [["id", "ASC"]]
        });
        res.json(divisions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getById = async (req, res) => {
    try {
        const division = await Division.findByPk(req.params.id, {
            include: {
                model: District,
                include: {
                    model: Upazila,
                    include: Coverage
                }
            },
            order: [
                [District, "id", "ASC"],
                [District, Upazila, "id", "ASC"]
            ]
        });

        if (!division) {
            return res.status(404).json({ error: "Division not found" });
        }

        res.json(division);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const division = await Division.findByPk(req.params.id);
        if (!division) {
            return res.status(404).json({ error: "Division not found" });
        }

        await division.update({ name: req.body.name });
        res.json({ message: "Division updated successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const division = await Division.findByPk(req.params.id);
        if (!division) {
            return res.status(404).json({ error: "Division not found" });
        }

        await division.destroy();
        res.json({ message: "Division deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
