'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("coverages", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      available: { type: Sequelize.BOOLEAN, defaultValue: false },
      UpazilaId: {
        type: Sequelize.INTEGER,
        references: { model: "upazilas", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("coverages");
  },
};

