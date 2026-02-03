module.exports = (sequelize, DataTypes) => {
    const Slider = sequelize.define(
        "Slider",
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            subtitle: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            badge: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            imagePosition: {
                type: DataTypes.ENUM("Left", "Right"),
                defaultValue: "Left",
            },
        },
        {
            tableName: "sliders",
            timestamps: true,
        }
    );

    return Slider;
};
