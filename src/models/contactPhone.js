module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ContactPhone', {
        contact_name: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: false },
    }, {
        tableName: 'contact_phones',
        timestamps: false,
        underscored: true,
    });
};