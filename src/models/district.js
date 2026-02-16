module.exports = (sequelize, DataTypes) => {
    const District = sequelize.define("District", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        DivisionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    return District;
};
