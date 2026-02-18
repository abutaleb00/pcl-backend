'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('contact_phones', 'contact_name', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'contact_id'
    });
    await queryInterface.addColumn('contact_emails', 'contact_name', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'contact_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('contact_phones', 'contact_name');
    await queryInterface.removeColumn('contact_emails', 'contact_name');
  }
};
