const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Funcion = sequelize.define('Funcion', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        fecha: {
            type: DataTypes.STRING, // Almacena la fecha 
            allowNull: false
        },
        hora: {
            type: DataTypes.STRING,  // Almacena la hora 
            allowNull: false
        },
        precio: {
            type: DataTypes.FLOAT,   // Precio del boleto para esta funcion
            allowNull: false,
            defaultValue: 0.0
        },
        disponibilidad: {
            type: DataTypes.INTEGER, // Asientos libres restantes
            allowNull: false
        }
    }, {
        tableName: 'funciones',
        timestamps: true
    });

    return Funcion;
};