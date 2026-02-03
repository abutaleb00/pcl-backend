module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Coverage", {
        available: {
            type: DataTypes.TINYINT,
            defaultValue: 1
        },
        notes: DataTypes.STRING
    });
};
