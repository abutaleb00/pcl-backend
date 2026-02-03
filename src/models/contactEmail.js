module.exports = (sequelize, DataTypes) => {
    const ContactEmail = sequelize.define(
        "ContactEmail",
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "contact_emails",
            timestamps: false
        }
    );

    return ContactEmail;
};
