'use strict';

/** @type {import('sequelize-cli').Migration} */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("inquiries", "subject", {
      type: Sequelize.STRING,
      allowNull: true, // or false if you want mandatory
      after: "service_interest", // MySQL only (optional, but nice)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("inquiries", "subject");
  },
};
