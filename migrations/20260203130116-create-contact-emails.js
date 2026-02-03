'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('contact_emails', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            contact_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'contacts',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },

            email: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },

            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.addIndex('contact_emails', ['contact_id']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('contact_emails');
    },
};
