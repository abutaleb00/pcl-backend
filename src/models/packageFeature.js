module.exports = (sequelize, DataTypes) => {
    return sequelize.define("PackageFeature", {
        feature: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
