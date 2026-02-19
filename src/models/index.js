const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

/* ===============================
    Models Initialization
================================ */

/* Auth */
db.User = require("./user")(sequelize, DataTypes);

/* SEO */
db.SeoSetting = require("./seoSetting")(sequelize, DataTypes);

/* Blog */
db.Blog = require("./blog")(sequelize, DataTypes);

/* Inquiry */
db.Inquiry = require("./inquiry")(sequelize, DataTypes);

/* Slider */
db.Slider = require("./slider")(sequelize, DataTypes);
db.SliderImage = require("./sliderImage")(sequelize, DataTypes);
db.SliderButton = require("./sliderButton")(sequelize, DataTypes);

/* Services & Packages */
db.Service = require("./service")(sequelize, DataTypes);
db.ServiceFeature = require("./serviceFeature")(sequelize, DataTypes);

db.Package = require("./package")(sequelize, DataTypes);
db.PackageFeature = require("./packageFeature")(sequelize, DataTypes);

/* Coverage */
db.Division = require("./division")(sequelize, DataTypes);
db.District = require("./district")(sequelize, DataTypes);
db.Upazila = require("./upazila")(sequelize, DataTypes);
db.Coverage = require("./coverage")(sequelize, DataTypes);

/* Contact */
db.Contact = require("./contact")(sequelize, DataTypes);
db.ContactPhone = require("./contactPhone")(sequelize, DataTypes);
db.ContactEmail = require("./contactEmail")(sequelize, DataTypes);
db.ContactInfo = require("./contactInfo")(sequelize, DataTypes);

/* Clients */
db.Client = require("./client")(sequelize, DataTypes);

/* Sister Concerns (Sub Companies) - NEWLY ADDED */
db.SubCompany = require("./subCompany")(sequelize, DataTypes);

/* ===============================
    Associations
================================ */

/* User <-> Blog */
db.User.hasMany(db.Blog, { foreignKey: "UserId", onDelete: "CASCADE" });
db.Blog.belongsTo(db.User, { foreignKey: "UserId" });

/* Blog <-> SEO */
db.Blog.hasOne(db.SeoSetting, { foreignKey: 'blog_id', onDelete: 'CASCADE' });
db.SeoSetting.belongsTo(db.Blog, { foreignKey: 'blog_id' });

/* Slider <-> Images/Buttons */
db.Slider.hasMany(db.SliderImage, { foreignKey: "slider_id", onDelete: "CASCADE" });
db.SliderImage.belongsTo(db.Slider, { foreignKey: "slider_id" });

db.Slider.hasMany(db.SliderButton, { foreignKey: "slider_id", onDelete: "CASCADE" });
db.SliderButton.belongsTo(db.Slider, { foreignKey: "slider_id" });

/* Service <-> ServiceFeature */
db.Service.hasMany(db.ServiceFeature, { foreignKey: "service_id", onDelete: "CASCADE" });
db.ServiceFeature.belongsTo(db.Service, { foreignKey: "service_id" });

/* Service <-> Package */
db.Service.hasMany(db.Package, { foreignKey: "service_id", onDelete: "CASCADE" });
db.Package.belongsTo(db.Service, { foreignKey: "service_id" });

/* Package <-> PackageFeature */
db.Package.hasMany(db.PackageFeature, { foreignKey: "package_id", onDelete: "CASCADE" });
db.PackageFeature.belongsTo(db.Package, { foreignKey: "package_id" });

/* Coverage Relations */
db.Division.hasMany(db.District, { foreignKey: "DivisionId", onDelete: "CASCADE" });
db.District.belongsTo(db.Division, { foreignKey: "DivisionId" });

db.District.hasMany(db.Upazila, { foreignKey: "DistrictId", onDelete: "CASCADE" });
db.Upazila.belongsTo(db.District, { foreignKey: "DistrictId" });

db.Upazila.hasOne(db.Coverage, { foreignKey: "UpazilaId", onDelete: "CASCADE" });
db.Coverage.belongsTo(db.Upazila, { foreignKey: "UpazilaId" });

/* Contact Relations */
db.Contact.hasMany(db.ContactEmail, {
   foreignKey: "contact_id",
   as: "emails",
   onDelete: "CASCADE"
});
db.ContactEmail.belongsTo(db.Contact, {
   foreignKey: "contact_id",
   as: "contact"
});

db.Contact.hasMany(db.ContactPhone, {
   foreignKey: 'contact_id',
   as: "phones",
   onDelete: 'CASCADE'
});
db.ContactPhone.belongsTo(db.Contact, {
   foreignKey: 'contact_id',
   as: "contact"
});

module.exports = db;