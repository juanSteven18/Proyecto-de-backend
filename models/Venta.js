'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Venta extends Model {
    static associate(models) {
      // Una venta de dulceria pertenece a un Producto especifico
      Venta.belongsTo(models.Producto, {
        foreignKey: 'productoId',
        as: 'producto'
      });
    }
  }
  
  Venta.init({
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos', // Apunta a la tabla Productos
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cliente: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Consumidor Final'
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Venta',
    tableName: 'VentasDulceria' 
  });

  return Venta;
};