'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'sellos', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
    await queryInterface.addColumn('Usuarios', 'membresiaId', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: true
    });
    await queryInterface.addColumn('Usuarios', 'ultimaCompraAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'sellos');
    await queryInterface.removeColumn('Usuarios', 'membresiaId');
    await queryInterface.removeColumn('Usuarios', 'ultimaCompraAt');
  }
};