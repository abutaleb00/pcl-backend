'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatRooms', {
      id: { type: Sequelize.INTEGER, primaryKey: true, auto_increment: true },
      visitor_name: Sequelize.STRING,
      visitor_email: Sequelize.STRING,
      status: { type: Sequelize.ENUM('active', 'closed'), defaultValue: 'active' },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('ChatMessages', {
      id: { type: Sequelize.INTEGER, primaryKey: true, auto_increment: true },
      room_id: {
        type: Sequelize.INTEGER,
        references: { model: 'ChatRooms', key: 'id' },
        onDelete: 'CASCADE'
      },
      sender_type: Sequelize.ENUM('visitor', 'staff'),
      sender_id: Sequelize.INTEGER,
      message: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('ChatMessages');
    await queryInterface.dropTable('ChatRooms');
  }
};
