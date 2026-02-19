'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sub_companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      link: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: { // Matches underscored: true
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: { // Matches underscored: true
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sub_companies');
  }
};
