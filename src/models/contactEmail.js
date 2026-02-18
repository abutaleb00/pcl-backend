module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ContactEmail', {
        contact_name: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false },
    }, {
        tableName: 'contact_emails',
        timestamps: false,
        underscored: true,
    });
};