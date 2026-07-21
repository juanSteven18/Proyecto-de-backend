'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Relación con Membresia: Un usuario pertenece a una membresia
      Usuario.belongsTo(models.Membresia, { 
        foreignKey: 'membresiaId', 
        as: 'membresia' 
      });

      // Relacion con Auditoria: Un usuario tiene muchas entradas de historial
      Usuario.hasMany(models.Auditoria, { 
        foreignKey: 'usuarioId', 
        as: 'historial' 
      });
    }
  }

  Usuario.init({
    nombre: {
    type: DataTypes.STRING,
    allowNull: false 
},
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'cliente'
    },
    
    sellos: {
      type: DataTypes.INTEGER,
      defaultValue: 0 
    },
    membresiaId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: true
    },
    ultimaCompraAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios',
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  return Usuario;
};