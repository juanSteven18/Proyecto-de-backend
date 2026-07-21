const { Usuario } = require('../models');

async function actualizarNivelUsuario(usuarioId) {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return;

    let nuevoNivel = 1; // Por defecto: Sin membresia
    
    if (usuario.sellos >= 15) {
        nuevoNivel = 4; // VIP
    } else if (usuario.sellos >= 11) {
        nuevoNivel = 3; // Premium
    } else if (usuario.sellos >= 7) {
        nuevoNivel = 2; // Básica
    }

    await usuario.update({ membresiaId: nuevoNivel });
}

module.exports = { actualizarNivelUsuario };