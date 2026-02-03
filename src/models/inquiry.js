module.exports = (sequelize, DataTypes) => {
    const Inquiry = sequelize.define(
        "Inquiry",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
            },
            subject: {
                type: DataTypes.STRING,
            },
            service_interest: {
                type: DataTypes.STRING,
            },
            message: {
                type: DataTypes.TEXT,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "new",
            },
        },
        {
            tableName: "inquiries",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: false,
        }
    );

    return Inquiry;
};
