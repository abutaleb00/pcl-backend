module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'ContactEmail',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'contact_emails',
            timestamps: true,
            underscored: true,
            paranoid: true,
        }
    );
};
