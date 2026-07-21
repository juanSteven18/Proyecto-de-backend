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
const Producto = require('./Producto')(sequelize);
const Venta = require('./Venta')(sequelize);
const Resena = require('./Resena')(sequelize);
const Membresia = require('./Membresia')(sequelize, Sequelize.DataTypes);

//Declarar las Relaciones 
// Relaciones: Funcion <-> Pelicula / Sala
Funcion.belongsTo(Pelicula, { foreignKey: 'peliculaId', as: 'pelicula' });
Pelicula.hasMany(Funcion, { foreignKey: 'peliculaId', as: 'funciones' });

Funcion.belongsTo(Sala, { foreignKey: 'salaId', as: 'sala' });
Sala.hasMany(Funcion, { foreignKey: 'salaId', as: 'funciones' });

// Nueva Relacion: Boleto <-> Funcion
Boleto.belongsTo(Funcion, { foreignKey: 'funcionId', as: 'funcion' });
Funcion.hasMany(Boleto, { foreignKey: 'funcionId', as: 'boletos' });

Venta.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
Producto.hasMany(Venta, { foreignKey: 'productoId', as: 'ventas' });

Resena.belongsTo(Pelicula, { foreignKey: 'peliculaId', as: 'pelicula' });
Pelicula.hasMany(Resena, { foreignKey: 'peliculaId', as: 'reseñas' });

Usuario.belongsTo(Membresia, { foreignKey: 'membresiaId', as: 'membresia' });
Membresia.hasMany(Usuario, { foreignKey: 'membresiaId', as: 'usuarios' });

Boleto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });


//probar conexion y Sincronizar Base de Datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('============= BASE DE DATOS =============');
        console.log('[BD] Conexion establecida con exito con SQLite.');
        console.log('[BD] Tablas sincronizadas con éxito (alter: true).');
        
        // Sincroniza e inyecta la nueva tabla de boletos en el archivo fisico
        await sequelize.sync();
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
    Producto,
    Venta,
    Resena,
    Membresia
};