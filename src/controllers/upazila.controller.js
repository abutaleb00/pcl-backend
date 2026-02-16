const { Upazila, District, Division, Coverage } = require("../models");

exports.create = async (req, res) => {
    try {
        const { name, DistrictId } = req.body;

        if (!name || !DistrictId) {
            return res.status(400).json({
                error: "name and DistrictId are required"
            });
        }

        const upazila = await Upazila.create({ name, DistrictId });
        res.json(upazila);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const upazilas = await Upazila.findAll({
            order: [["id", "ASC"]]
        });
        res.json(upazilas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByDistrict = async (req, res) => {
    try {
        const upazilas = await Upazila.findAll({
            where: { DistrictId: req.params.districtId }
        });
        res.json(upazilas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const upazila = await Upazila.findByPk(req.params.id, {
            include: [
                {
                    model: District,
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Division,
                            attributes: ["id", "name"]
                        }
                    ]
                },
                {
                    model: Coverage
                }
            ]
        });

        if (!upazila) {
            return res.status(404).json({ error: "Upazila not found" });
        }

        res.json(upazila);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.update = async (req, res) => {
    try {
        const upazila = await Upazila.findByPk(req.params.id);
        if (!upazila) {
            return res.status(404).json({ error: "Upazila not found" });
        }

        const { name, DistrictId } = req.body;
        await upazila.update({ name, DistrictId });

        res.json({ message: "Upazila updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const upazila = await Upazila.findByPk(req.params.id);
        if (!upazila) {
            return res.status(404).json({ error: "Upazila not found" });
        }

        await upazila.destroy();
        res.json({ message: "Upazila deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
