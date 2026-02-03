const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "Service",
        {
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: DataTypes.TINYINT,
                defaultValue: 1 // 1 = active, 0 = inactive
            }
        },
        {
            tableName: "services"
        }
    );
};
