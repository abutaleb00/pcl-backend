'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('blogs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            slug: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            short_description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            content: {
                type: Sequelize.TEXT('long'),
                allowNull: false,
            },

            meta_title: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            meta_description: {
                type: Sequelize.STRING(300),
                allowNull: true,
            },

            meta_keywords: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            og_title: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            og_description: {
                type: Sequelize.STRING(300),
                allowNull: true,
            },

            og_image: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            featured_image: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            status: {
                type: Sequelize.ENUM('draft', 'published'),
                defaultValue: 'draft',
            },

            publishedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            UserId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
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
        await queryInterface.dropTable('blogs');
    },
};
