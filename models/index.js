const { Sequelize } = require('sequelize');
const path = require('path');

//configurar la conexion a SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../cine.sqlite'),
    logging: false 
});

//importar e inicializar los modelos
const Pelicula = require('./Pelicula')(sequelize);
const Sala = require('./Sala')(sequelize);
const Funcion = require('./Funcion')(sequelize);
const Boleto = require('./Boleto')(sequelize); 
const Usuario = require('./Usuario')(sequelize);

//Declarar las Relaciones 
// Relaciones: Funcion <-> Pelicula / Sala
Funcion.belongsTo(Pelicula, { foreignKey: 'peliculaId', as: 'pelicula' });
Pelicula.hasMany(Funcion, { foreignKey: 'peliculaId', as: 'funciones' });

Funcion.belongsTo(Sala, { foreignKey: 'salaId', as: 'sala' });
Sala.hasMany(Funcion, { foreignKey: 'salaId', as: 'funciones' });

// Nueva Relacion: Boleto <-> Funcion
Boleto.belongsTo(Funcion, { foreignKey: 'funcionId', as: 'funcion' });
Funcion.hasMany(Boleto, { foreignKey: 'funcionId', as: 'boletos' });


//probar conexion y Sincronizar Base de Datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('============= BASE DE DATOS =============');
        console.log('[BD] Conexion establecida con exito con SQLite.');
        
        // Sincroniza e inyecta la nueva tabla de boletos en el archivo fisico
        await sequelize.sync({ alter: true });
        console.log('[BD] Modulo de Boletos sincronizado correctamente.');
        console.log('=========================================');
    } catch (error) {
        console.error('[BD] Error en el ciclo de la Base de Datos:', error);
    }
})();

module.exports = {
    sequelize,
    Pelicula,
    Sala,
    Funcion,
    Boleto,
    Usuario,
};