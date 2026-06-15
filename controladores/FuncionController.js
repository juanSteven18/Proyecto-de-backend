const { Funcion, Pelicula, Sala } = require('../models');

class FuncionController {

    // 1. VISTA PRINCIPAL: LISTAR FUNCIONES Y CARGAR FORMULARIO (Todo en uno)
    async listar(req, res) {
        try {
            // 1. Buscamos todas las funciones con sus relaciones (JOIN)
            const funciones = await Funcion.findAll({
                include: [
                    { model: Pelicula, as: 'pelicula' },
                    { model: Sala, as: 'sala' }
                ]
            });

            // 2. Buscamos las peliculas y salas para alimentar el formulario de arriba
            const peliculas = await Pelicula.findAll();
            const salas = await Sala.findAll();

            if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api')) {
                return res.json({ status: "success", data: funciones });
            }

            // Enviamos todo a la misma vista de funciones
            res.render('funciones', {
                title: 'Gestion de Funciones (Base de Datos)',
                listaFunciones: funciones,
                peliculas, // Lista para el select del formulario
                salas      // Lista para el select del formulario
            });
        } catch (error) {
            console.error("Error al listar funciones:", error);
            res.status(500).json({ status: "error", message: "Error interno en el servidor" });
        }
    }

    async listarPorPelicula(req, res) {
        try {
            const { id } = req.params; // Captura el ID de la película desde la URL

            // 1. Buscamos los datos de la película para usar su título en la cabecera de la vista
            const pelicula = await Pelicula.findByPk(id);
            
            if (!pelicula) {
                return res.status(404).send("La película especificada no existe");
            }

            // 2. Filtramos en la base de datos las funciones que le correspondan a esa película
            const listaFunciones = await Funcion.findAll({
                where: { peliculaId: id },
                include: [
                    { model: Pelicula, as: 'pelicula' },
                    { model: Sala, as: 'sala' }
                ]
            });

            // 3. Renderizamos la vista 'funciones' inyectando las variables requeridas
            res.render('funciones', {
                title: `Funciones para la Película: ${pelicula.titulo}`,
                funciones: listaFunciones, // Enviamos el arreglo filtrado
                pelicula: pelicula
            });

        } catch (error) {
            console.error("Error en listarPorPelicula:", error);
            res.status(500).send("Error interno al recuperar las funciones de la cartelera");
        }
    }

    // 2. REDIRECCION SEGURA EN CASO DE ENTRAR A /CREAR
    async vistaCrear(req, res) {
        // Como ahora todo esta en la misma pagina, si alguien entra aqui, lo mandamos al index de funciones
        res.redirect('/funciones');
    }

    // 3. GUARDAR FUNCION (POST)
    async almacenar(req, res) {
        try {
            const { peliculaId, salaId, fecha, hora, precio } = req.body;

            if (!peliculaId || !salaId || !fecha || !hora || !precio) {
                return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
            }

            const sala = await Sala.findByPk(salaId);
            if (!sala) {
                return res.status(404).json({ status: "error", message: "La sala seleccionada no existe" });
            }

            await Funcion.create({
                peliculaId,
                salaId,
                fecha,
                hora,
                precio: parseFloat(precio),
                disponibilidad: sala.capacidad 
            });

            res.redirect('/funciones');
        } catch (error) {
            console.error("Error al guardar funcion:", error);
            res.status(500).json({ status: "error", message: "No se pudo guardar la funcion" });
        }
    }

    // 4. ELIMINAR FUNCION (GET)
    async eliminar(req, res) {
        try {
            const { id } = req.params;

            await Funcion.destroy({
                where: { id }
            });

            res.redirect('/funciones');
        } catch (error) {
            console.error("Error al eliminar funcion:", error);
            res.status(500).json({ status: "error", message: "No se pudo eliminar la funcion" });
        }
    }

    // 5. LISTAR FUNCIONES FILTRADAS POR PELICULA
    async listarPorPelicula(req, res) {
        try {
            const { id } = req.params;
            const pelicula = await Pelicula.findByPk(id);
            if (!pelicula) return res.status(404).send("Pelicula no encontrada");

            const funciones = await Funcion.findAll({
                where: { peliculaId: id },
                include: [
                    { model: Pelicula, as: 'pelicula' },
                    { model: Sala, as: 'sala' }
                ]
            });

            const peliculas = await Pelicula.findAll();
            const salas = await Sala.findAll();

            res.render('funciones', {
                title: `Funciones para la pelicula: ${pelicula.titulo}`,
                listaFunciones: funciones,
                peliculas, 
                salas      
            });
        } catch (error) {
            console.error("Error al filtrar funciones:", error);
            res.status(500).send("Error interno al filtrar funciones");
        }
    }
}

module.exports = new FuncionController();