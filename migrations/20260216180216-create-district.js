'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("districts", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      DivisionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "divisions", key: "id" },
        onDelete: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("districts");
  }
};
