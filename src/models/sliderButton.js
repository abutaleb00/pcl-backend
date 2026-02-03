module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "SliderButton",
        {
            slider_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            label: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            link: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM("primary", "secondary"),
                defaultValue: "primary",
            },
        },
        {
            tableName: "slider_buttons",
            timestamps: false,
        }
    );
};
