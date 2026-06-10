// Importamos el modelo real de Sala desde la carpeta de modelos
const { Sala } = require('../models');

class SalaController {

    // 1. VER LISTA DE SALAS 
    async listarSalas(req, res) {
        try {
            // Consultamos todas las salas de la base de datos
            const salas = await Sala.findAll();

            if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api')) {
                return res.json({ status: "success", data: salas });
            }

            res.render('salas', { 
                title: 'Gestion de Salas de Cine (Base de Datos)',
                listaSalas: salas
            });
        } catch (error) {
            console.error("Error al listar salas:", error);
            res.status(500).json({ status: "error", message: "Error interno al consultar salas" });
        }
    }

    // 2. VISTA FORMULARIO CREAR SALA
    async vistaCrearSala(req, res) {
        res.render('crearSala', { title: 'Anadir Nueva Sala' });
    }

    // 3. GUARDAR SALA 
    async guardarSala(req, res) {
        try {
            const { nombre, capacidad } = req.body;
            if (!nombre || !capacidad) {
                return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
            }

            await Sala.create({
                nombre,
                capacidad: parseInt(capacidad)
            });

            res.redirect('/salas');
        } catch (error) {
            console.error("Error al guardar sala:", error);
            res.status(500).json({ status: "error", message: "No se pudo guardar la sala en la base de datos" });
        }
    }

    // 4. VISTA FORMULARIO EDITAR SALA
    async vistaEditarSala(req, res) {
        try {
            const { id } = req.params;
            const sala = await Sala.findByPk(id);
            
            if (!sala) return res.status(404).send("Sala no encontrada en la base de datos");
            res.render('editarSala', { title: 'Editar Sala', sala });
        } catch (error) {
            res.status(500).send("Error interno al buscar la sala");
        }
    }

    // 5. ACTUALIZAR SALA 
    async actualizarSala(req, res) {
        try {
            const { id } = req.params;
            const { nombre, capacidad } = req.body;

            const sala = await Sala.findByPk(id);
            if (sala) {
                await sala.update({
                    nombre,
                    capacidad: parseInt(capacidad)
                });
            }

            res.redirect('/salas');
        } catch (error) {
            console.error("Error al actualizar sala:", error);
            res.status(500).json({ status: "error", message: "No se pudo actualizar la sala" });
        }
    }

    // 6. ELIMINAR SALA 
    async eliminarSala(req, res) {
        try {
            const { id } = req.params;

            await Sala.destroy({
                where: { id: id }
            });

            res.redirect('/salas');
        } catch (error) {
            console.error("Error al eliminar sala:", error);
            res.status(500).json({ status: "error", message: "No se pudo eliminar la sala" });
        }
    }
}

module.exports = new SalaController();