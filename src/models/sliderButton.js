module.exports = (sequelize, DataTypes) => {
    const SliderButton = sequelize.define(
        "SliderButton",
        {
            label: {
                type: DataTypes.STRING,
                allowNull: false
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "slider_buttons",
            timestamps: false
        }
    );

    return SliderButton;
};
