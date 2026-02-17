const { Package, PackageFeature, Service } = require("../models");

exports.create = async (req, res) => {
  try {
    const {
      service_id,
      name,
      speed,
      price,
      installation,
      status,
      order,
      isPopular,
      features
    } = req.body;

    if (!service_id || !name) {
      return res.status(400).json({
        message: "service and name required"
      });
    }

    const pkg = await Package.create({
      service_id,
      name,
      speed,
      price,
      installation,
      status,
      order: order || 0,
      isPopular: !!isPopular
    });

    if (features?.length) {
      await PackageFeature.bulkCreate(
        features.map(f => ({
          feature: f,
          package_id: pkg.id
        }))
      );
    }

    res.json({ message: "Package created", id: pkg.id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: { status: 1 },
      include: [{ model: PackageFeature }],
      order: [["order", "ASC"], ["price", "ASC"]]
    });

    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id, {
      include: [{ model: PackageFeature }]
    });

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const transaction = await Package.sequelize.transaction();

  try {
    const pkg = await Package.findByPk(req.params.id, { transaction });

    if (!pkg) {
      await transaction.rollback();
      return res.status(404).json({ message: "Package not found" });
    }

    const {
      service_id,
      name,
      speed,
      price,
      installation,
      status,
      order,
      isPopular,
      features
    } = req.body;

    await pkg.update({
      service_id,
      name,
      speed,
      price,
      installation,
      status,
      order,
      isPopular
    }, { transaction });

    await PackageFeature.destroy({
      where: { package_id: pkg.id },
      transaction
    });

    if (features?.length) {
      await PackageFeature.bulkCreate(
        features.map(f => ({
          feature: f,
          package_id: pkg.id
        })),
        { transaction }
      );
    }

    await transaction.commit();
    res.json({ message: "Package updated" });

  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    await pkg.destroy();
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};