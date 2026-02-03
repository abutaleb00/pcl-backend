module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "SliderImage",
        {
            slider_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            image_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            sort_order: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: "slider_images",
            timestamps: false,
        }
    );
};
