const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Sala = sequelize.define('Sala', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        capacidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1
            }
        }
    }, {
        tableName: 'salas',
        timestamps: true
    });

    return Sala;
};