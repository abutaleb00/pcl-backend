const db = require("../models");
const { Sequelize } = db;

const Slider = db.Slider;
const SliderImage = db.SliderImage;
const SliderButton = db.SliderButton;

/**
 * GET all sliders
 */
exports.getAll = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      include: ["images", "buttons"],
      // ✅ Sort by Order ASC first, then by newest created
      order: [
        ["order", "ASC"],
        ["id", "DESC"]
      ],
    });
    res.json(sliders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sliders" });
  }
};

/**
 * GET single slider
 */
exports.getById = async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id, {
      include: ["images", "buttons"],
    });

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    res.json(slider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch slider" });
  }
};

/**
 * CREATE slider
 */
exports.create = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { title, subtitle, badge, imagePosition, buttons, onlyImage, order } = req.body;
    const files = req.files || [];
    const isOnlyImage = onlyImage === "true" || onlyImage === true;

    // --- 🟢 VALIDATION LOGIC ---
    if (isOnlyImage) {
      // Image Only Mode: Must have exactly 1 image
      if (files.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: "Image is required for 'Only Image' mode." });
      }
      if (files.length > 1) {
        await transaction.rollback();
        return res.status(400).json({ error: "You can only upload 1 image in 'Only Image' mode." });
      }
    } else {
      // Standard Mode: Title is required
      if (!title) {
        await transaction.rollback();
        return res.status(400).json({ error: "Title is required for standard sliders." });
      }
    }
    // --- 🔴 LOGIC END ---

    // 1️⃣ Create slider
    const slider = await Slider.create(
      {
        onlyImage: isOnlyImage,
        // If onlyImage is true, force these to null, otherwise use payload
        title: isOnlyImage ? null : title,
        subtitle: isOnlyImage ? null : subtitle,
        badge: isOnlyImage ? null : badge,
        imagePosition: isOnlyImage ? "Left" : (imagePosition || "Left"),
        order: order ? parseInt(order) : 0,
      },
      { transaction }
    );

    // 2️⃣ Images
    if (files.length > 0) {
      const imagesData = files.map((file) => ({
        slider_id: slider.id,
        image_url: `/uploads/sliders/${file.filename}`,
      }));

      await SliderImage.bulkCreate(imagesData, { transaction });
    }

    // 3️⃣ Buttons (Only if NOT image only)
    if (!isOnlyImage && buttons) {
      const parsedButtons =
        typeof buttons === "string" ? JSON.parse(buttons) : buttons;

      const buttonData = parsedButtons.map((btn) => ({
        slider_id: slider.id,
        label: btn.label,
        link: btn.link,
        type: btn.type || "primary",
      }));

      await SliderButton.bulkCreate(buttonData, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ message: "Slider created successfully", data: slider });

  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: "Failed to create slider" });
  }
};

/**
 * UPDATE slider
 */
exports.update = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { title, subtitle, badge, imagePosition, buttons, onlyImage, order } = req.body;
    const files = req.files || [];

    const slider = await Slider.findByPk(req.params.id, { include: ["images"] });
    if (!slider) {
      await transaction.rollback();
      return res.status(404).json({ message: "Slider not found" });
    }

    // Parse boolean
    const isOnlyImage = onlyImage === "true" || onlyImage === true;

    // --- 🟢 UPDATE VALIDATION ---
    if (isOnlyImage) {
      if (files.length > 1) {
        await transaction.rollback();
        return res.status(400).json({ error: "You can only upload 1 image in 'Only Image' mode." });
      }
    } else {
      if (!title) {
        await transaction.rollback();
        return res.status(400).json({ error: "Title is required for standard sliders." });
      }
    }
    // --- 🔴 END VALIDATION ---

    // 1️⃣ Update slider fields
    await slider.update(
      {
        onlyImage: isOnlyImage,
        title: isOnlyImage ? null : title,
        subtitle: isOnlyImage ? null : subtitle,
        badge: isOnlyImage ? null : badge,
        imagePosition: isOnlyImage ? "Left" : (imagePosition || "Left"),
        order: order ? parseInt(order) : 0,
      },
      { transaction }
    );

    // 2️⃣ Handle Images
    if (files.length > 0) {
      // If new files are uploaded, delete old ones
      await SliderImage.destroy({
        where: { slider_id: slider.id },
        transaction,
      });

      const imagesData = files.map((file) => ({
        slider_id: slider.id,
        image_url: `/uploads/sliders/${file.filename}`,
      }));

      await SliderImage.bulkCreate(imagesData, { transaction });
    }

    // 3️⃣ Handle Buttons
    // Always clear old buttons first
    await SliderButton.destroy({
      where: { slider_id: slider.id },
      transaction,
    });

    // If NOT onlyImage, add buttons back
    if (!isOnlyImage && buttons) {
      const parsedButtons =
        typeof buttons === "string" ? JSON.parse(buttons) : buttons;

      const buttonData = parsedButtons.map((btn) => ({
        slider_id: slider.id,
        label: btn.label,
        link: btn.link,
        type: btn.type || "primary",
      }));

      await SliderButton.bulkCreate(buttonData, { transaction });
    }

    await transaction.commit();
    res.json({ message: "Slider updated successfully" });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: "Failed to update slider" });
  }
};

/**
 * DELETE slider
 */
exports.remove = async (req, res) => {
  try {
    await Slider.destroy({
      where: { id: req.params.id },
    });

    res.json({ message: "Slider deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete slider" });
  }
};