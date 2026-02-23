'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('ChatRooms');

    // Only add the column if it doesn't exist
    if (!tableInfo.status) {
      await queryInterface.addColumn('ChatRooms', 'status', {
        type: Sequelize.ENUM('active', 'completed', 'closed'),
        defaultValue: 'active',
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ChatRooms', 'status');
  }
};
