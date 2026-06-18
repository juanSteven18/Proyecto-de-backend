const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Boleto = sequelize.define('Boleto', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nombreCliente: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        cantidadAsientos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1
            }
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'reservado' 
        }
    }, {
        tableName: 'boletos',
        timestamps: true
    });

    return Boleto;
};