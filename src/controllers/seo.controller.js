const { SeoSetting } = require("../models");

exports.getPublic = async (req, res) => {
    const seo = await SeoSetting.findOne();
    res.json(seo);
};

exports.save = async (req, res) => {
    let seo = await SeoSetting.findOne();

    if (!seo) {
        seo = await SeoSetting.create(req.body);
    } else {
        await seo.update(req.body);
    }

    res.json({ message: "SEO settings saved" });
};
