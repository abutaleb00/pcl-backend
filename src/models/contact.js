
const { DataTypes } = require("sequelize");
module.exports = (sequelize) => sequelize.define("Contact", {
address: DataTypes.TEXT,
map_url: DataTypes.STRING
});
