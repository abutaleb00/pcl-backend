module.exports = (sequelize, DataTypes) => {
    const ContactPhone = sequelize.define(
        "ContactPhone",
        {
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "contact_phones",
            timestamps: false
        }
    );

    return ContactPhone;
};
