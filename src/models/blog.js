module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define(
        "Blog",
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },

            short_description: {
                type: DataTypes.TEXT,
            },

            content: {
                type: DataTypes.TEXT("long"),
                allowNull: false,
            },

            meta_title: DataTypes.STRING,
            meta_description: DataTypes.STRING(300),
            meta_keywords: DataTypes.STRING,

            og_title: DataTypes.STRING,
            og_description: DataTypes.STRING(300),
            og_image: DataTypes.STRING,

            featured_image: DataTypes.STRING,

            status: {
                type: DataTypes.ENUM("draft", "published"),
                defaultValue: "draft",
            },

            publishedAt: DataTypes.DATE,
        },
        {
            tableName: "blogs",
            timestamps: true,
        }
    );

    return Blog;
};
