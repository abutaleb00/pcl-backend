const db = require("../models");
const Slider = db.Slider;
const SliderImage = db.SliderImage;
const SliderButton = db.SliderButton;

/**
 * GET all sliders
 */
exports.getAll = async (req, res) => {
  const sliders = await Slider.findAll({
    include: ["images", "buttons"],
    order: [["id", "DESC"]],
  });
  res.json(sliders);
};

/**
 * GET single slider
 */
exports.getById = async (req, res) => {
  const slider = await Slider.findByPk(req.params.id, {
    include: ["images", "buttons"],
  });
  res.json(slider);
};

/**
 * CREATE slider
 */
exports.create = async (req, res) => {
  try {
    const { title, subtitle, badge, imagePosition, buttons } = req.body;

    const slider = await Slider.create({
      title,
      subtitle,
      badge,
      imagePosition
    });

    if (req.files && req.files.length > 0) {
      const imagesData = req.files.map(file => ({
        imageUrl: `/uploads/sliders/${file.filename}`,
        SliderId: slider.id
      }));

      await SliderImage.bulkCreate(imagesData);
    }
    if (buttons) {
      const parsedButtons = JSON.parse(buttons);
      const buttonData = parsedButtons.map(btn => ({
        ...btn,
        SliderId: slider.id
      }));
      await SliderButton.bulkCreate(buttonData);
    }

    res.status(201).json({ message: "Slider created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create slider" });
  }
};

/**
 * UPDATE slider
 */
exports.update = async (req, res) => {
  try {
    const { title, subtitle, badge, imagePosition, buttons } = req.body;

    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }
    await slider.update({
      title,
      subtitle,
      badge,
      imagePosition
    });

    if (req.files && req.files.length > 0) {
      await SliderImage.destroy({
        where: { SliderId: slider.id }
      });

      const imagesData = req.files.map(file => ({
        imageUrl: `/uploads/sliders/${file.filename}`,
        SliderId: slider.id
      }));

      await SliderImage.bulkCreate(imagesData);
    }

    if (buttons) {
      await SliderButton.destroy({
        where: { SliderId: slider.id }
      });

      const parsedButtons = JSON.parse(buttons);
      const buttonData = parsedButtons.map(btn => ({
        ...btn,
        SliderId: slider.id
      }));

      await SliderButton.bulkCreate(buttonData);
    }

    res.json({ message: "Slider updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update slider" });
  }
};

/**
 * DELETE slider
 */
exports.remove = async (req, res) => {
  await Slider.destroy({ where: { id: req.params.id } });
  res.json({ message: "Slider deleted" });
};
