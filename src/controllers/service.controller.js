const { Service, ServiceFeature } = require("../models");

const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  if (typeof features === "string") {
    try {
      return JSON.parse(features);
    } catch (e) {
      return [];
    }
  }
  return [];
};

/**
 * CREATE SERVICE
 */
exports.create = async (req, res) => {
  try {
    // 1. Destructure all fields including 'icon'
    const { code, icon, name, description, features } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        error: "code and name are required"
      });
    }

    // 2. Create the Service
    const service = await Service.create({
      code,
      icon, // ✅ icon is now defined
      name,
      description,
      status: 1
    });

    // 3. Parse and Save Features
    const parsedFeatures = parseFeatures(features);

    if (parsedFeatures.length > 0) {
      // Map the array of strings to objects matching your ServiceFeature model
      const featureRecords = parsedFeatures.map(f => ({
        feature: f,
        service_id: service.id // ✅ Ensure this matches your FK in the model
      }));

      await ServiceFeature.bulkCreate(featureRecords);
    }

    res.status(201).json({
      message: "Service created successfully",
      id: service.id
    });
  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * GET ALL ACTIVE SERVICES
 */
exports.getAll = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { status: 1 },
      include: { model: ServiceFeature },
      order: [["id", "DESC"]]
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET SERVICE BY ID
 */
exports.getById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: { model: ServiceFeature }
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE SERVICE (REPLACE FEATURES)
 */
exports.update = async (req, res) => {
  const transaction = await Service.sequelize.transaction();

  try {
    const { code, icon, name, description, status, features } = req.body;

    // 1. Find the existing service
    const service = await Service.findByPk(req.params.id, { transaction });
    if (!service) {
      await transaction.rollback();
      return res.status(404).json({ message: "Service not found" });
    }

    // 2. Update the main service record
    await service.update(
      { code, icon, name, description, status },
      { transaction }
    );

    // 3. Update features (Delete existing and Bulk Create new ones)
    if (features !== undefined) {
      const featureList = parseFeatures(features);

      // Delete old features associated with this service
      await ServiceFeature.destroy({
        where: { service_id: service.id }, // 🔥 Check if your DB column is ServiceId or service_id
        transaction
      });

      // Insert new features if the list isn't empty
      if (featureList.length > 0) {
        const featureRecords = featureList.map(f => ({
          feature: typeof f === 'object' ? f.feature : f, // Handles both string array and object array
          service_id: service.id
        }));

        await ServiceFeature.bulkCreate(featureRecords, { transaction });
      }
    }

    // 4. Commit everything
    await transaction.commit();
    res.json({ message: "Service updated successfully" });

  } catch (error) {
    // 5. Rollback on any failure
    if (transaction) await transaction.rollback();
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * SOFT DELETE (STATUS = 0)
 */
exports.remove = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.update({ status: 0 });
    res.json({ message: "Service disabled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};