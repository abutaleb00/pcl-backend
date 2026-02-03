module.exports = (sequelize, DataTypes) => {
    return sequelize.define("SeoSetting", {
        site_name: DataTypes.STRING,
        site_url: DataTypes.STRING,
        meta_title: DataTypes.STRING,
        meta_description: DataTypes.TEXT,
        meta_keywords: DataTypes.TEXT,
        og_image: DataTypes.STRING,
        twitter_card: DataTypes.STRING,
        favicon: DataTypes.STRING
    });
};
