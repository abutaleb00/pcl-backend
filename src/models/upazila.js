module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Upazila", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
