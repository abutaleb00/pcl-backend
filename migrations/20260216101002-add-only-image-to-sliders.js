'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add the 'onlyImage' column
    await queryInterface.addColumn('sliders', 'onlyImage', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    // 2. Change 'title' column to allow NULL values
    await queryInterface.changeColumn('sliders', 'title', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Revert 'title' to NOT NULL (Warning: Only do this if all rows have titles)
    await queryInterface.changeColumn('sliders', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // 2. Remove the 'onlyImage' column
    await queryInterface.removeColumn('sliders', 'onlyImage');
  }
};