module.exports = (sequelize, DataTypes) => {
    const Slider = sequelize.define(
        "Slider",
        {
            title: {
                type: DataTypes.STRING,
                allowNull: true, // Allow null for image-only mode
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
            onlyImage: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            order: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: "sliders",
            timestamps: true,
        }
    );

    return Slider;
};