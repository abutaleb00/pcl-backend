'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("sliders", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            subtitle: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            badge: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            imagePosition: {
                type: Sequelize.ENUM("Left", "Right"),
                defaultValue: "Left",
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("sliders");
    },
};
