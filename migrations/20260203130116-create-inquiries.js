'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("inquiries", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            phone: {
                type: Sequelize.STRING,
            },

            subject: {
                type: Sequelize.STRING,
            },

            service_interest: {
                type: Sequelize.STRING,
            },

            message: {
                type: Sequelize.TEXT,
            },

            status: {
                type: Sequelize.STRING,
                defaultValue: "new",
            },

            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("inquiries");
    },
};
