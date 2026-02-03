module.exports = (sequelize, DataTypes) => {
    return sequelize.define("District", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
