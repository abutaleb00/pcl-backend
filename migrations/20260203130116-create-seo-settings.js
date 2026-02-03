'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('seo_settings', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            page: {
                type: Sequelize.ENUM('home', 'about', 'contact', 'blog'),
                allowNull: false,
            },

            blog_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'blogs',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },

            meta_title: {
                type: Sequelize.STRING,
            },

            meta_description: {
                type: Sequelize.TEXT,
            },

            meta_keywords: {
                type: Sequelize.TEXT,
            },

            og_title: {
                type: Sequelize.STRING,
            },

            og_description: {
                type: Sequelize.TEXT,
            },

            og_image: {
                type: Sequelize.STRING,
            },

            canonical_url: {
                type: Sequelize.STRING,
            },

            robots: {
                type: Sequelize.STRING,
                defaultValue: 'index, follow',
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
                ),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('seo_settings');
    },
};
