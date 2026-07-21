'use strict';
const models = require('../models');
const Pelicula = models.Pelicula;
const Resena = models.Resena;

class resenaController {
    //ver reseñas
    async listar(req, res) {
        try {
            const { id } = req.params;
            const pelicula = await Pelicula.findByPk(id);
            const resenas = await Resena.findAll({ 
                where: { peliculaId: id },
                order: [['createdAt', 'DESC']]
            });

            res.render('detallePelicula', { pelicula, resenas });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error");
        }
    }

    // Crear una nueva reseña (Usuario)
    async crear(req, res) {
    try {
        const { comentario, puntuacion, peliculaId } = req.body;
        const nombreUsuario = req.user ? req.user.email : 'Anónimo'; 

        await Resena.create({ 
            comentario, 
            puntuacion, 
            peliculaId, 
            nombreUsuario 
        });
        
        res.redirect(`/peliculas/detalle/${peliculaId}`);
        } catch (error) {
            res.status(500).send("Error al guardar reseña");
        }
    }

    // Eliminar reseña (Admin o Usuario dueño de la reseña)
    async eliminar(req, res) {
        try {
            const { id } = req.params;
            await Resena.destroy({ where: { id } });
            res.redirect('back');
        } catch (error) {
            res.status(500).send("Error al eliminar");
        }
    }

    // Editar una reseña
    async editar(req, res) {
    try {
        const { id } = req.params;
        const { comentario, puntuacion } = req.body;

        // Buscamos la reseña
        const resena = await Resena.findByPk(id);
        
      
        if (!resena) return res.status(404).send("Reseña no encontrada");

        await resena.update({ comentario, puntuacion });
        
        res.redirect('back'); // Regresa a la pagina de la pelicula
    } catch (error) {
        res.status(500).send("Error al editar reseña");
    }
}
}

module.exports = new resenaController();