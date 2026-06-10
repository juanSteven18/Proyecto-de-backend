// Importamos el modelo real de la Base de Datos
const { Pelicula } = require('../models');

class PeliculaController {

    // 1. VER CARTELERA 
    async listar(req, res) {
        try {
            // Buscamos todas las peliculas almacenadas en la tabla de SQLite
            const peliculas = await Pelicula.findAll();

            if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api')) {
                return res.json({ status: "success", data: peliculas });
            }
            res.render('index', { 
                title: 'Cartelera de Cine (Base de Datos)',
                lista: peliculas
            });
        } catch (error) {
            console.error("Error en listar peliculas:", error);
            res.status(500).json({ status: "error", message: "Error al consultar la base de datos" });
        }
    }

    // 2. FORMULARIO CREAR
    async vistaCrear(req, res) {
        res.render('crear', { title: 'Anadir Nueva Pelicula' });
    }

    // 3. GUARDAR PELICULA 
    async almacenar(req, res) {
        try {
            const { titulo, duracion, genero } = req.body;
            if (!titulo || !duracion || !genero) {
                return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
            }

            // Usamos .create() de Sequelize. El ID se autogenera como UUID gracias al modelo
            await Pelicula.create({
                titulo,
                duracion: parseInt(duracion),
                genero
            });

            res.redirect('/');
        } catch (error) {
            console.error("Error al guardar pelicula:", error);
            res.status(500).json({ status: "error", message: "No se pudo guardar en la base de datos" });
        }
    }

    // 4. FORMULARIO EDITAR
    async vistaEditar(req, res) {
        try {
            const { id } = req.params;
            // Buscamos la pelicula por su Clave Primaria
            const pelicula = await Pelicula.findByPk(id);
            
            if (!pelicula) return res.status(404).send("Pelicula no encontrada en la base de datos");
            res.render('editar', { title: 'Editar Pelicula', pelicula });
        } catch (error) {
            res.status(500).send("Error interno al buscar la pelicula");
        }
    }

    // 5. ACTUALIZAR 
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { titulo, duracion, genero } = req.body;

            // Buscamos el registro
            const pelicula = await Pelicula.findByPk(id);
            if (pelicula) {
                // Actualizamos sus valores y guardamos los cambios en la BD
                await pelicula.update({
                    titulo,
                    duracion: parseInt(duracion),
                    genero
                });
            }

            res.redirect('/');
        } catch (error) {
            console.error("Error al actualizar pelicula:", error);
            res.status(500).json({ status: "error", message: "No se pudo actualizar en la base de datos" });
        }
    }

    // 6. ELIMINAR
    async eliminar(req, res) {
        try {
            const { id } = req.params;

            // Ejecutamos el borrado condicionado por el ID
            await Pelicula.destroy({
                where: { id: id }
            });

            res.redirect('/');
        } catch (error) {
            console.error("Error al eliminar pelicula:", error);
            res.status(500).json({ status: "error", message: "No se pudo eliminar de la base de datos" });
        }
    }

    // 7. TOP 5 RECIENTES 
    async top5(req, res) {
        try {
            // Sequelize nos permite ordenar por fecha de creacion (descendiente) y limitar a 5 registros directos desde SQL
            const masRecientes = await Pelicula.findAll({
                order: [['createdAt', 'DESC']],
                limit: 5
            });

            res.render('top5', { 
                title: 'Top 5 Peliculas Recientes (Base de Datos)', 
                lista: masRecientes 
            });
        } catch (error) {
            console.error("Error al obtener top 5:", error);
            res.status(500).send("Error al procesar el top 5");
        }
    }
}

module.exports = new PeliculaController();