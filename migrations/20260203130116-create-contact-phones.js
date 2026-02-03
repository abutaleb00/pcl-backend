'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('contact_phones', {
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

            phone: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
        });

        await queryInterface.addIndex('contact_phones', ['contact_id']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('contact_phones');
    },
};
