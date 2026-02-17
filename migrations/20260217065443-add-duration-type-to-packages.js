'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('packages', 'durationType', {
      type: Sequelize.ENUM('month', 'year', 'minute'),
      defaultValue: 'month',
      allowNull: false, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('packages', 'durationType');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_packages_durationType";');
    }
  }
};