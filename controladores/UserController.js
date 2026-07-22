const { Usuario, Membresia } = require('../models');
const { actualizarNivelUsuario } = require('../help/membresiaHelp');

module.exports = {
    listarUsuarios: async (req, res) => {
        try {
         
            // Buscamos a todos los usuarios e incluimos su membresia
            const usuarios = await Usuario.findAll({
                include: [{ model: Membresia, as: 'membresia' }]
            });
            res.render('listadoUsuarios', { usuarios });
        } catch (error) {
            res.status(500).send("Error al cargar listado de usuarios");
        }
    },

    resetPuntos: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).send("Usuario no encontrado.");
            }

            // Restamos los sellos
            if (usuario.sellos!=0){
                if (usuario.sellos>=2){
                 usuario.sellos = usuario.sellos-2;
            } 

            if (usuario.sellos==1){
                usuario.sellos = usuario.sellos-1;
            }
            await usuario.save();
            await actualizarNivelUsuario(usuario.id);
            }
            // Redirigimos de vuelta a la lista
            res.redirect('/usuarios'); 
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al reiniciar puntos.");
        }
    }
};