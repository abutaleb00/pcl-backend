'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("service_features", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      feature: { type: Sequelize.STRING, allowNull: false },
      ServiceId: {
        type: Sequelize.INTEGER,
        references: { model: "services", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("service_features");
  },
};
