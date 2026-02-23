'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ChatRooms', 'status', {
      type: Sequelize.ENUM('active', 'closed', 'completed'),
      defaultValue: 'active'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ChatRooms', 'status', {
      type: Sequelize.ENUM('active', 'closed'),
      defaultValue: 'active'
    });
  }
};
