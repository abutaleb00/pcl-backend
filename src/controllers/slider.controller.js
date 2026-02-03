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
      order: [["id", "DESC"]],
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
    const { title, subtitle, badge, imagePosition, buttons } = req.body;

    // 1️⃣ Create slider
    const slider = await Slider.create(
      {
        title,
        subtitle,
        badge,
        imagePosition,
      },
      { transaction }
    );

    // 2️⃣ Images
    if (req.files && req.files.length > 0) {
      const imagesData = req.files.map((file) => ({
        slider_id: slider.id,
        image_url: `/uploads/sliders/${file.filename}`,
      }));

      await SliderImage.bulkCreate(imagesData, { transaction });
    }

    // 3️⃣ Buttons
    if (buttons) {
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
    res.status(201).json({ message: "Slider created successfully" });
  } catch (error) {
    await transaction.rollback();
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
    const { title, subtitle, badge, imagePosition, buttons } = req.body;

    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      await transaction.rollback();
      return res.status(404).json({ message: "Slider not found" });
    }

    // 1️⃣ Update slider
    await slider.update(
      {
        title,
        subtitle,
        badge,
        imagePosition,
      },
      { transaction }
    );

    // 2️⃣ Replace images
    if (req.files && req.files.length > 0) {
      await SliderImage.destroy({
        where: { slider_id: slider.id },
        transaction,
      });

      const imagesData = req.files.map((file) => ({
        slider_id: slider.id,
        image_url: `/uploads/sliders/${file.filename}`,
      }));

      await SliderImage.bulkCreate(imagesData, { transaction });
    }

    // 3️⃣ Replace buttons
    if (buttons) {
      await SliderButton.destroy({
        where: { slider_id: slider.id },
        transaction,
      });

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
    await transaction.rollback();
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
