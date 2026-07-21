module.exports = (sequelize, DataTypes) => {
    const Membresia = sequelize.define('Membresia', {
        nombre: DataTypes.STRING, // "Sin Membresía", "Básica" etc etc
        descuentoSnacks: { type: DataTypes.INTEGER, defaultValue: 0 }, // % de descuento
        descuentoBoletos: { type: DataTypes.INTEGER, defaultValue: 0 }, // % de descuento
        minSellos: { type: DataTypes.INTEGER, defaultValue: 0 } // Requisito para alcanzar
    });

    Membresia.associate = (models) => {
        Membresia.hasMany(models.Usuario, { foreignKey: 'membresiaId', as: 'usuarios' });
    };

    return Membresia;
};  