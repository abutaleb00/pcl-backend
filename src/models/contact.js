const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
    sequelize.define(
        "Contact",
        {
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            map_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: "contacts",
            timestamps: true,
        }
    );
