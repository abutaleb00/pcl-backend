'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Disable foreign key checks to allow modifying the referenced column
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });

      // 2. Modify the column to add AUTO_INCREMENT
      // We use MODIFY instead of changeColumn to avoid Sequelize's PK duplication error
      await queryInterface.sequelize.query(
        'ALTER TABLE ChatRooms MODIFY COLUMN id INT AUTO_INCREMENT', 
        { transaction }
      );

      // 3. Re-enable foreign key checks
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    // 4. Ensure other columns exist (Sequelize handles these fine)
    const tableInfo = await queryInterface.describeTable('ChatRooms');
    if (!tableInfo.visitor_name) {
      await queryInterface.addColumn('ChatRooms', 'visitor_name', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Guest'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Usually, we don't want to remove auto-increment in a rollback 
    // as it can break existing data relationships.
  }
};
