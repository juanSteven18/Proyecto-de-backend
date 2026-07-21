'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Resenas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      comentario: { type: Sequelize.TEXT, allowNull: false },
      puntuacion: { type: Sequelize.INTEGER, allowNull: false },
      nombreUsuario: { type: Sequelize.STRING, allowNull: false },
      peliculaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Peliculas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Resenas');
  }
};