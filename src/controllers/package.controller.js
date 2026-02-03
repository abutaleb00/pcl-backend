const { Package, PackageFeature, Service } = require("../models");

exports.create = async (req, res) => {
  const transaction = await Package.sequelize.transaction();

  try {
    const { ServiceId, name, speed, price, duration, status, features } = req.body;

    const service = await Service.findByPk(ServiceId);
    if (!service) {
      await transaction.rollback();
      return res.status(404).json({ message: "Service not found" });
    }

    const pkg = await Package.create(
      { ServiceId, name, speed, price, duration, status },
      { transaction }
    );

    if (features && Array.isArray(features)) {
      await PackageFeature.bulkCreate(
        features.map(f => ({
          feature: f,
          PackageId: pkg.id
        })),
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).json({ message: "Package created successfully" });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: [
        {
          model: PackageFeature,
          as: "features"
        }
      ],
      order: [["id", "DESC"]]
    });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  const pkg = await Package.findByPk(req.params.id, {
    include: [{ model: PackageFeature }]
  });

  if (!pkg) {
    return res.status(404).json({ message: "Package not found" });
  }

  res.json(pkg);
};
exports.update = async (req, res) => {
  const transaction = await Package.sequelize.transaction();

  try {
    const { name, speed, price, duration, status, features } = req.body;

    const pkg = await Package.findByPk(req.params.id, { transaction });
    if (!pkg) {
      await transaction.rollback();
      return res.status(404).json({ message: "Package not found" });
    }

    await pkg.update(
      { name, speed, price, duration, status },
      { transaction }
    );

    if (features !== undefined) {
      if (!Array.isArray(features)) {
        await transaction.rollback();
        return res.status(400).json({ error: "Features must be array" });
      }

      await PackageFeature.destroy({
        where: { PackageId: pkg.id },
        transaction
      });

      await PackageFeature.bulkCreate(
        features.map(f => ({
          feature: f,
          PackageId: pkg.id
        })),
        { transaction }
      );
    }

    await transaction.commit();
    res.json({ message: "Package updated successfully" });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
exports.remove = async (req, res) => {
  const pkg = await Package.findByPk(req.params.id);
  if (!pkg) {
    return res.status(404).json({ message: "Package not found" });
  }

  await pkg.destroy();
  res.json({ message: "Package deleted successfully" });
};
