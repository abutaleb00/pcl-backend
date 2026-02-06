const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "ServiceFeature",
        {
            feature: {
                type: DataTypes.STRING,
                allowNull: false
            },
            service_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "service_features",
            timestamps: false
        }
    );
};
