module.exports = (sequelize, DataTypes) => {
    const Upazila = sequelize.define("Upazila", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        DistrictId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
            tableName: 'upazilas',
            timestamps: true
        });

    return Upazila;
};
