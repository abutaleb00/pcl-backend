'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('clients', 'order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'logo'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('clients', 'order');
  }
};
