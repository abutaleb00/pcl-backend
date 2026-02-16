'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("coverages", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      UpazilaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "upazilas", key: "id" },
        onDelete: "CASCADE"
      },

      available: {
        type: Sequelize.TINYINT,
        defaultValue: 1
      },

      notes: Sequelize.STRING,

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("coverages");
  }
};
