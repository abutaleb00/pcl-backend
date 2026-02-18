"use strict";

module.exports = (sequelize, DataTypes) => {
    const SeoSetting = sequelize.define(
        "SeoSetting",
        {
            // The unique identifier for the page (e.g., 'home', 'about', 'services')
            page: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                comment: "Slug or identifier for static pages",
            },

            // Optional: Link to a specific blog post if this SEO is for a dynamic article
            blog_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "blogs",
                    key: "id",
                },
            },

            // Primary SEO Tags
            meta_title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            meta_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            meta_keywords: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "Comma separated keywords",
            },

            // Open Graph / Social Media Tags
            og_title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            og_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            og_image: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: "URL for the social sharing image",
            },
            og_type: {
                type: DataTypes.STRING,
                defaultValue: "website",
            },
            canonical_url: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isUrlIfNotEmpty(value) {
                        if (value && value.trim() !== "") {
                            const urlRegex = /^(https?:\/\/)?(localhost|[\w-]+(\.[\w-]+)+)(:\d+)?(\/\S*)?$/;
                            if (!urlRegex.test(value)) {
                                throw new Error('Must be a valid URL (e.g., https://example.com)');
                            }
                        }
                    }
                },
            },
            robots: {
                type: DataTypes.STRING,
                defaultValue: "index, follow",
                comment: "Search engine crawler instructions (e.g., noindex, nofollow)",
            },
        },
        {
            tableName: "seo_settings",
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            underscored: false,
        }
    );

    // If you have a Blog model, you can define the association here
    SeoSetting.associate = (models) => {
        if (models.Blog) {
            SeoSetting.belongsTo(models.Blog, {
                foreignKey: "blog_id",
                as: "blog",
            });
        }
    };

    return SeoSetting;
};