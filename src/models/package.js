module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Package", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        speed: DataTypes.STRING,
        installation: DataTypes.STRING,
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        isPopular: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1
        }
    });
};
