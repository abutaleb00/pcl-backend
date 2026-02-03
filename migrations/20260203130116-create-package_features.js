'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("package_features", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      feature: Sequelize.STRING,
      package_id: {
        type: Sequelize.INTEGER,
        references: { model: "packages", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("package_features");
  },
};
