// Importamos los arreglos de datos en memoria desde tu base.js
var { peliculas, funciones, boletos } = require('../base');
const crypto = require('crypto');

class PeliculaController {

    // 1. VER CARTELERA (Híbrido)
    async listar(req, res) {
        try {
            if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api')) {
                return res.json({ status: "success", data: peliculas });
            }
            res.render('index', { 
                title: 'Cartelera de Cine',
                lista: peliculas
            });
        } catch (error) {
            console.error("Error en listar películas:", error);
            res.status(500).json({ status: "error", message: "Error interno" });
        }
    }

    // 2. FORMULARIO CREAR
    async vistaCrear(req, res) {
        res.render('crear', { title: 'Añadir Nueva Película' });
    }

    // 3. GUARDAR PELÍCULA (POST)
    async almacenar(req, res) {
        try {
            const { titulo, duracion, genero } = req.body;
            if (!titulo || !duracion || !genero) {
                return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
            }

            const nuevaPelicula = {
                id: crypto.randomUUID(),
                titulo,
                duracion: parseInt(duracion),
                genero
            };
            peliculas.push(nuevaPelicula);

            res.redirect('/');
        } catch (error) {
            res.status(500).json({ status: "error", message: "No se pudo guardar" });
        }
    }

    // 4. FORMULARIO EDITAR
    async vistaEditar(req, res) {
        const { id } = req.params;
        const pelicula = peliculas.find(p => p.id == id);
        if (!pelicula) return res.status(404).send("Película no encontrada");
        res.render('editar', { title: 'Editar Película', pelicula });
    }

    // 5. ACTUALIZAR (PUT)
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { titulo, duracion, genero } = req.body;
            const idx = peliculas.findIndex(p => p.id == id);
            
            if (idx !== -1) {
                peliculas[idx] = { id, titulo, duracion: parseInt(duracion), genero };
            }
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ status: "error", message: "No se pudo actualizar" });
        }
    }

    // 6. ELIMINAR (DELETE)
    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const idx = peliculas.findIndex(p => p.id == id);
            if (idx !== -1) peliculas.splice(idx, 1);
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ status: "error", message: "No se pudo eliminar" });
        }
    }

    // 7. TOP 5 RECIENTES
    async top5(req, res) {
        // Clonamos y tomamos las últimas 5 películas agregadas
        const masRecientes = [...peliculas].reverse().slice(0, 5);
        res.render('top5', { 
            title: 'Top 5 Películas Recientes', 
            lista: masRecientes 
        });
    }
}

module.exports = new PeliculaController();