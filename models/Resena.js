'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Resena extends Model {
    static associate(models) {
      // La reseña pertenece a una película
      Resena.belongsTo(models.Pelicula, {
        foreignKey: 'peliculaId',
        as: 'pelicula'
      });
    }
  }

  Resena.init({
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 } // Validamos estrellas
    },
    nombreUsuario: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Anónimo'
    },
    peliculaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Peliculas',
        key: 'id'
      }
    },
    usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true // True porque permitimos anonimos
}
  }, {
    sequelize,
    modelName: 'Resena',
    tableName: 'Resenas'
  });

  return Resena;
};