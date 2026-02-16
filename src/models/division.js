module.exports = (sequelize, DataTypes) => {
    const Division = sequelize.define("Division", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return Division;
};
