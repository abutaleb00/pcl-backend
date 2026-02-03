module.exports = (sequelize, DataTypes) => {
    const SeoSetting = sequelize.define(
        'SeoSetting',
        {
            page: {
                type: DataTypes.ENUM('home', 'about', 'contact', 'blog'),
                allowNull: false,
            },

            blog_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            meta_title: DataTypes.STRING,
            meta_description: DataTypes.TEXT,
            meta_keywords: DataTypes.TEXT,

            og_title: DataTypes.STRING,
            og_description: DataTypes.TEXT,
            og_image: DataTypes.STRING,

            canonical_url: DataTypes.STRING,

            robots: {
                type: DataTypes.STRING,
                defaultValue: 'index, follow',
            },
        },
        {
            tableName: 'seo_settings',
            timestamps: true,
        }
    );

    return SeoSetting;
};
