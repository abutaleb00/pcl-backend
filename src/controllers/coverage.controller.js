const { Coverage, Upazila } = require("../models");

exports.create = async (req, res) => {
  try {
    const { UpazilaId, available } = req.body;

    const upazila = await Upazila.findByPk(UpazilaId);
    if (!upazila) {
      return res.status(404).json({ error: "Upazila not found" });
    }

    const coverage = await Coverage.create({
      UpazilaId,
      available
    });

    res.json(coverage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Coverage.findAll({
      include: {
        model: Upazila
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const coverage = await Coverage.findByPk(req.params.id);
    if (!coverage) {
      return res.status(404).json({ error: "Coverage not found" });
    }

    await coverage.update({
      available: req.body.available
    });

    res.json({ message: "Coverage updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const coverage = await Coverage.findByPk(req.params.id);
    if (!coverage) {
      return res.status(404).json({ error: "Coverage not found" });
    }

    await coverage.destroy();
    res.json({ message: "Coverage deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
