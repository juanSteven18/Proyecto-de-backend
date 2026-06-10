var { salas } = require('../base');
const crypto = require('crypto');

class SalaController {

    // 1. VER LISTA DE SALAS
    async listarSalas(req, res) {
        try {
            if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api')) {
                return res.json({ status: "success", data: salas });
            }
            res.render('salas', { 
                title: 'Gestión de Salas de Cine',
                listaSalas: salas
            });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Error interno" });
        }
    }

    // 2. FORMULARIO CREAR
    async vistaCrearSala(req, res) {
        res.render('crearSala', { title: 'Añadir Nueva Sala' });
    }

    // 3. GUARDAR SALA (POST)
    async guardarSala(req, res) {
        try {
            const { nombre, capacidad } = req.body;
            if (!nombre || !capacidad) {
                return res.status(400).send("Faltan datos");
            }

            const nuevaSala = {
                id: crypto.randomUUID(),
                nombre,
                capacidad: parseInt(capacidad)
            };
            salas.push(nuevaSala);
            res.redirect('/salas');
        } catch (error) {
            res.status(500).send("Error al guardar");
        }
    }

    // 4. FORMULARIO EDITAR SALA
    async vistaEditarSala(req, res) {
        const { id } = req.params;
        const sala = salas.find(s => s.id == id);
        if (!sala) return res.status(404).send("Sala no encontrada");
        res.render('editarSala', { title: 'Editar Sala', sala });
    }

    // 5. ACTUALIZAR SALA (PUT)
    async actualizarSala(req, res) {
        try {
            const { id } = req.params;
            const { nombre, capacidad } = req.body;
            const idx = salas.findIndex(s => s.id == id);
            if (idx !== -1) {
                salas[idx] = { id, nombre, capacidad: parseInt(capacidad) };
            }
            res.redirect('/salas');
        } catch (error) {
            res.status(500).send("Error al actualizar");
        }
    }

    // 6. ELIMINAR SALA (DELETE)
    async eliminarSala(req, res) {
        try {
            const { id } = req.params;
            const idx = salas.findIndex(s => s.id == id);
            if (idx !== -1) salas.splice(idx, 1);
            res.redirect('/salas');
        } catch (error) {
            res.status(500).send("Error al eliminar");
        }
    }
}

module.exports = new SalaController();