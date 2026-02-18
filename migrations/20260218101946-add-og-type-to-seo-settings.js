'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('seo_settings', 'og_type', {
      type: Sequelize.STRING,
      defaultValue: 'website',
      after: 'og_image' // Optional: places it after og_image in MySQL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('seo_settings', 'og_type');
  }
};
