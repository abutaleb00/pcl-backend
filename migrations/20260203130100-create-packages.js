'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("packages", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: Sequelize.STRING,
      price: Sequelize.DECIMAL(10, 2),
      speed: Sequelize.STRING,
      installation: Sequelize.STRING,
      status: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("packages");
  },
};
