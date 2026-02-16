const { Coverage, Upazila, District, Division } = require("../models");

exports.create = async (req, res) => {
  try {
    const { UpazilaId, available, notes } = req.body;

    // Check if Upazila exists
    const upazila = await Upazila.findByPk(UpazilaId);
    if (!upazila) {
      return res.status(404).json({ error: "Upazila not found" });
    }

    // Prevent duplicate coverage
    const existing = await Coverage.findOne({ where: { UpazilaId } });
    if (existing) {
      return res.status(400).json({
        error: "Coverage already exists for this Upazila. Please update instead."
      });
    }

    const coverage = await Coverage.create({
      UpazilaId,
      available,
      notes
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
        model: Upazila // No alias needed
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const coverage = await Coverage.findByPk(req.params.id, {
      include: {
        model: Upazila // No alias needed
      }
    });

    if (!coverage) {
      return res.status(404).json({ error: "Coverage not found" });
    }

    res.json(coverage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUpazila = async (req, res) => {
  try {
    const coverage = await Coverage.findOne({
      where: { UpazilaId: req.params.upazilaId },
      include: {
        model: Upazila // No alias needed
      }
    });

    // If no coverage row found
    if (!coverage) {
      return res.json({
        available: 0,
        message: "Service is not available in this area yet"
      });
    }

    res.json({
      available: coverage.available,
      notes: coverage.notes,
      upazila: coverage.Upazila.name // Access via capitalized model name
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFullTree = async (req, res) => {
  try {
    const data = await Division.findAll({
      include: {
        model: District, // No alias needed
        include: {
          model: Upazila, // No alias needed
          include: {
            model: Coverage // No alias needed
          }
        }
      },
      order: [["id", "ASC"]]
    });

    res.json(data);
  } catch (err) {
    console.error(err);
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
      available: req.body.available,
      notes: req.body.notes
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