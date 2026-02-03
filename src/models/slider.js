module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Slider", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subtitle: {
            type: DataTypes.TEXT,
        },
        badge: {
            type: DataTypes.STRING,
        },
        imagePosition: {
            type: DataTypes.ENUM("Left", "Right"),
            defaultValue: "Left",
        },
    });
};
