module.exports = (sequelize, DataTypes) => {
    const SliderImage = sequelize.define(
        "SliderImage",
        {
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "slider_images",
            timestamps: false
        }
    );

    return SliderImage;
};
