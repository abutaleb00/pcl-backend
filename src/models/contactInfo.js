module.exports = (sequelize, DataTypes) => {
    return sequelize.define("ContactInfo", {
        company_name: DataTypes.STRING,
        address: DataTypes.TEXT,
        map_embed: DataTypes.TEXT,
        map_url: DataTypes.STRING,
        facebook: DataTypes.STRING,
        whatsapp: DataTypes.STRING
    }, {
        tableName: "contact_info",
        timestamps: false
    });
};
