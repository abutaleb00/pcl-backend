module.exports = (sequelize, DataTypes) => {
    const ContactInfo = sequelize.define(
        'ContactInfo',
        {
            company_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: DataTypes.TEXT,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
            map_embed: DataTypes.TEXT,
            map_url: DataTypes.STRING,
            facebook: DataTypes.STRING,
            whatsapp: DataTypes.STRING,
            created_at: DataTypes.DATE,
        },
        {
            tableName: 'contact_info',
            timestamps: false,
            underscored: true,
        }
    );

    return ContactInfo;
};
