'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('contact_info', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            company_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            address: {
                type: Sequelize.TEXT,
            },

            phone: {
                type: Sequelize.STRING(50),
            },

            email: {
                type: Sequelize.STRING,
            },

            map_embed: {
                type: Sequelize.TEXT,
            },

            map_url: {
                type: Sequelize.STRING,
            },

            facebook: {
                type: Sequelize.STRING,
            },

            whatsapp: {
                type: Sequelize.STRING,
            },

            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('contact_info');
    },
};
