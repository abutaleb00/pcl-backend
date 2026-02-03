'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('slider_buttons', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            slider_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'sliders',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },

            label: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            url: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            type: {
                type: Sequelize.ENUM('primary', 'secondary'),
                defaultValue: 'primary',
            },

            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },

            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },

            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.addIndex('slider_buttons', ['slider_id']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('slider_buttons');
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_slider_buttons_type";'
        );
    },
};
