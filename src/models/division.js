module.exports = (sequelize, DataTypes) => {
    const Division = sequelize.define("Division", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
        {
            tableName: 'divisions',
            timestamps: true
        });

    return Division;
};
