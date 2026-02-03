module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Division", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
};
