const { Sequelize } = require('sequelize');
const path = require('path');

// 1. Configurar la conexion a SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../cine.sqlite'),
    logging: false 
});

// 2. Importar e inicializar los modelos
const Pelicula = require('./Pelicula')(sequelize);
const Sala = require('./Sala')(sequelize);
const Funcion = require('./Funcion')(sequelize); // <--- Importamos Funcion

// 3. Declarar las Relaciones (Asociaciones)
// Una Funcion pertenece a una Pelicula (Crea PeliculaId en la tabla funciones)
Funcion.belongsTo(Pelicula, { foreignKey: 'peliculaId', as: 'pelicula' });
Pelicula.hasMany(Funcion, { foreignKey: 'peliculaId', as: 'funciones' });

// Una Funcion pertenece a una Sala (Crea SalaId en la tabla funciones)
Funcion.belongsTo(Sala, { foreignKey: 'salaId', as: 'sala' });
Sala.hasMany(Funcion, { foreignKey: 'salaId', as: 'funciones' });


// 4. Probar conexion y Sincronizar Base de Datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('============= BASE DE DATOS =============');
        console.log('[BD] Conexion establecida con exito con SQLite.');
        
        // Sincroniza y altera las tablas existentes para inyectar las llaves foraneas
        await sequelize.sync({ alter: true });
        console.log('[BD] Tablas e indices (incluyendo Relaciones) sincronizados.');
        console.log('=========================================');
    } catch (error) {
        console.error('[BD] Error en el ciclo de la Base de Datos:', error);
    }
})();

// Exportamos todo el ecosistema de modelos
module.exports = {
    sequelize,
    Pelicula,
    Sala,
    Funcion
};