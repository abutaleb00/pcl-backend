module.exports = (sequelize, DataTypes) => {
    const PackageFeature = sequelize.define(
        "PackageFeature",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            feature: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            package_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "package_features",
            timestamps: false,
        }
    );

    return PackageFeature;
};
