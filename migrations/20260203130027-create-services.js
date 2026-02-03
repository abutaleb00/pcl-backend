'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("services", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: Sequelize.STRING, unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: Sequelize.TEXT,
      status: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("services");
  },
};

