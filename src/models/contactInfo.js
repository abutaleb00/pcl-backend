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
            socials: {
                type: DataTypes.TEXT,
                get() {
                    const value = this.getDataValue('socials');
                    return value ? JSON.parse(value) : [];
                },
                set(value) {
                    this.setDataValue('socials', JSON.stringify(value));
                }
            },
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
