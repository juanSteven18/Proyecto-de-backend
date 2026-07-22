'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Crear la tabla Membresias
    await queryInterface.createTable('Membresias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descuentoSnacks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      descuentoBoletos: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      minSellos: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 2. Insertar los registros iniciales obligatorios para que coincidan con los IDs que busca el sistema
    await queryInterface.bulkInsert('Membresias', [
      {
        id: 1,
        nombre: 'Sin Membresía',
        descuentoSnacks: 0,
        descuentoBoletos: 0,
        minSellos: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nombre: 'Básica',
        descuentoSnacks: 5,
        descuentoBoletos: 5,
        minSellos: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nombre: 'Premium',
        descuentoSnacks: 10,
        descuentoBoletos: 10,
        minSellos: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nombre: 'VIP',
        descuentoSnacks: 15,
        descuentoBoletos: 15,
        minSellos: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Membresias');
  }
};