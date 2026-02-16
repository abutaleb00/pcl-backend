'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sliders', 'order', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('sliders', 'order');
  }
};