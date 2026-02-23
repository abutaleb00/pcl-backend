'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ChatMessages', 'is_read', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      after: 'message' // Places the column after the message column in MySQL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ChatMessages', 'is_read');
  }
};
