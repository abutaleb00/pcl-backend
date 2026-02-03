const { Service, ServiceFeature } = require("../models");

const parseFeatures = (features) => {
  if (!features) return [];

  if (Array.isArray(features)) {
    return features;
  }

  if (typeof features === "string") {
    return JSON.parse(features);
  }

  return [];
};
/**
 * CREATE SERVICE
 */
exports.create = async (req, res) => {
  try {
    const { code, name, description, features } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        error: "code and name are required"
      });
    }

    const service = await Service.create({
      code,
      name,
      description,
      status: 1
    });

    const parsedFeatures = parseFeatures(features);

    if (parsedFeatures.length) {
      await ServiceFeature.bulkCreate(
        parsedFeatures.map(f => ({
          feature: f,
          ServiceId: service.id
        }))
      );
    }

    res.status(201).json({ message: "Service created successfully" });
  } catch (error) {
    console.error("FULL ERROR 👉", error);
    console.error("ERROR DETAILS 👉", error.errors);
    console.error("SQL MESSAGE 👉", error.parent?.sqlMessage);

    res.status(500).json({
      error: error.parent?.sqlMessage || error.message
    });
  }
};

/**
 * GET ALL ACTIVE SERVICES
 */
exports.getAll = async (req, res) => {
  const services = await Service.findAll({
    where: { status: 1 },
    include: { model: ServiceFeature, as: "features" },
    order: [["id", "DESC"]]
  });

  res.json(services);
};

/**
 * GET SERVICE BY ID
 */
exports.getById = async (req, res) => {
  const service = await Service.findByPk(req.params.id, {
    include: { model: ServiceFeature, as: "features" }
  });

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.json(service);
};

/**
 * UPDATE SERVICE (REPLACE FEATURES)
 */
exports.update = async (req, res) => {
  const transaction = await Service.sequelize.transaction();

  try {
    const { code, name, description, status, features } = req.body;

    const service = await Service.findByPk(req.params.id, { transaction });
    if (!service) {
      await transaction.rollback();
      return res.status(404).json({ message: "Service not found" });
    }

    // 🔒 Prevent duplicate service code
    if (code && code !== service.code) {
      const existing = await Service.findOne({
        where: { code },
        transaction
      });

      if (existing) {
        await transaction.rollback();
        return res.status(409).json({
          error: "Service code already exists"
        });
      }
    }

    // ✅ Update service main fields
    await service.update(
      { code, name, description, status },
      { transaction }
    );

    // ✅ Update features (replace all)
    if (features !== undefined) {
      let featureList = features;

      // Allow both JSON string & array
      if (typeof features === "string") {
        featureList = JSON.parse(features);
      }

      if (!Array.isArray(featureList)) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Features must be an array"
        });
      }

      await ServiceFeature.destroy({
        where: { ServiceId: service.id },
        transaction
      });

      if (featureList.length > 0) {
        await ServiceFeature.bulkCreate(
          featureList.map(f => ({
            feature: f,
            ServiceId: service.id
          })),
          { transaction }
        );
      }
    }

    await transaction.commit();
    res.json({ message: "Service updated successfully" });

  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      error: error.message
    });
  }
};


/**
 * SOFT DELETE (STATUS = 0)
 */
exports.remove = async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  await service.update({ status: 0 });
  res.json({ message: "Service disabled successfully" });
};
