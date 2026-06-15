const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Pelicula = sequelize.define('Pelicula', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        duracion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1
            }
        },
        genero: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        // Opciones adicionales
        tableName: 'peliculas', 
        timestamps: true        
    });

    return Pelicula;
};