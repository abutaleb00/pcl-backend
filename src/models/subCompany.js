module.exports = (sequelize, DataTypes) => {
    const SubCompany = sequelize.define('SubCompany', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'sub_companies',
        underscored: true,
    });

    return SubCompany;
};