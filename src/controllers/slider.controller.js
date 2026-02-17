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
      // ✅ Updated to match default Sequelize pluralized names
      include: [SliderImage, SliderButton],
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
      // ✅ Updated to match default Sequelize pluralized names
      include: [SliderImage, SliderButton],
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

    if (isOnlyImage) {
      if (files.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: "Image is required for 'Only Image' mode." });
      }
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

    const slider = await Slider.create(
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

    if (files.length > 0) {
      const imagesData = files.map((file) => ({
        slider_id: slider.id,
        image_url: `/uploads/sliders/${file.filename}`,
      }));

      await SliderImage.bulkCreate(imagesData, { transaction });
    }

    if (!isOnlyImage && buttons) {
      const parsedButtons = typeof buttons === "string" ? JSON.parse(buttons) : buttons;

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

    // ✅ Include SliderImage (No alias)
    const slider = await Slider.findByPk(req.params.id, { include: [SliderImage] });
    if (!slider) {
      await transaction.rollback();
      return res.status(404).json({ message: "Slider not found" });
    }

    const isOnlyImage = onlyImage === "true" || onlyImage === true;

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

    if (files.length > 0) {
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

    await SliderButton.destroy({
      where: { slider_id: slider.id },
      transaction,
    });

    if (!isOnlyImage && buttons) {
      const parsedButtons = typeof buttons === "string" ? JSON.parse(buttons) : buttons;

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