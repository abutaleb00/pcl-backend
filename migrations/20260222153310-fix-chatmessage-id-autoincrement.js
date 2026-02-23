'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint('ChatMessages', 'PRIMARY');
    } catch (e) {
      console.log("Primary key constraint not found or already removed, proceeding...");
    }

    // 2. Re-apply the column definition with autoIncrement
    await queryInterface.changeColumn('ChatMessages', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ChatMessages', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    });
  }
};
