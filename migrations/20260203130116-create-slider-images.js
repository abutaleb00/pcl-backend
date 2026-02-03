'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("slider_images", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            slider_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "sliders",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },

            image_url: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            sort_order: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("slider_images");
    },
};
