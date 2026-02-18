'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seo_settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      page: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      blog_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'blogs', key: 'id' },
        onDelete: 'CASCADE'
      },
      meta_title: { type: Sequelize.STRING },
      meta_description: { type: Sequelize.TEXT },
      meta_keywords: { type: Sequelize.TEXT },
      og_title: { type: Sequelize.STRING },
      og_description: { type: Sequelize.TEXT },
      og_image: { type: Sequelize.STRING },
      og_type: { type: Sequelize.STRING, defaultValue: 'website' },
      canonical_url: { type: Sequelize.STRING },
      robots: { type: Sequelize.STRING, defaultValue: 'index, follow' },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seo_settings');
  }
};
