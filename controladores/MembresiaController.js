const { Usuario, Membresia, Boleto, Funcion } = require('../models');

module.exports = {
verPerfil: async (req, res) => {
        try {
         
            const idConsulta = req.params.id || req.user.id;
            const usuario = await Usuario.findByPk(idConsulta, {
                include: [{ model: Membresia, as: 'membresia' }]
            });
            console.log("Usuario encontrado:", usuario ? "Sí" : "No");

            if (!usuario) return res.status(404).send("Usuario no encontrado");


            const ultimoBoleto = await Boleto.findOne({
    where: { usuarioId: usuario.id },
    order: [['createdAt', 'DESC']], // Trae el mas nuevo primero
    include: [{ model: Funcion, as: 'funcion' }] // Incluimos la función para la fecha
});

            // Renderizamos vista pasando si es el dueño o un visor
            res.render('perfil', { 
                usuario, 
                ultimoBoleto,
                esPropio: idConsulta == req.user.id,
                titulo: idConsulta == req.user.id ? "Mi Perfil" : `Perfil de ${usuario.nombre}`
            });
        } catch (error) {
            res.status(500).send("Error al cargar perfil");
        }
    },

    eliminarMembresia: async (req, res) => {
        // Solo para ADMINS
        if (req.user.rol !== 'admin') return res.status(403).send("Acceso denegado");
        
        try {
            const usuario = await Usuario.findByPk(req.params.id);
            await usuario.update({ sellos: 0, membresiaId: 1 }); // resta
            res.redirect('/perfil/' + req.params.id);
        } catch (error) {
            res.status(500).send("Error al resetear puntos");
        }
    }
};