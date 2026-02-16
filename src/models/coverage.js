module.exports = (sequelize, DataTypes) => {
    const Coverage = sequelize.define("Coverage", {
        UpazilaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        available: {
            type: DataTypes.TINYINT,
            defaultValue: 1
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Coverage;
};
