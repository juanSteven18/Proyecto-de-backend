var { peliculas, salas, boletos, funciones, reservaciones } = require('../base');
const crypto = require('crypto');

class BoletoController {

    // LISTAR TODOS LOS BOLETOS (Historial de ventas)
    async listarBoletos(req, res) {
        const listaEnriquecida = boletos.map(b => {
            const peli = peliculas.find(p => p.id == b.peliculaId);
            const sala = salas.find(s => s.id == b.salaId);
            return {
                id: b.id,
                fecha: b.fecha,
                tituloPelicula: peli ? peli.titulo : "Película Eliminada",
                nombreSala: sala ? sala.nombre : "Sala Eliminada"
            };
        });
        res.render('boletos', { 
            title: 'Historial de Boletos Vendidos',
            listaBoletos: listaEnriquecida,
            peliculas, 
            salas          
        });
    }

    // LISTAR RESERVACIONES PENDIENTES
    async listarReservaciones(req, res) {
        res.render('reservaciones', {
            title: 'Reservaciones Pendientes',
            listaReservaciones: reservaciones
        });
    }

    // FORMULARIO FILTRO DE FECHAS
    async vistaFiltros(req, res) {
        res.render('filtros', { 
            title: 'Filtro de Ventas por Fecha', 
            lista: [], 
            busqueda: false 
        });
    }

    // PROCESAR FILTRADO DE FECHAS (POST)
    async procesarFiltro(req, res) {
        const { inicio, fin } = req.body;
        const boletosFiltrados = boletos.filter(b => b.fecha >= inicio && b.fecha <= fin);
        
        const resultados = boletosFiltrados.map(bto => {
            const peli = peliculas.find(p => p.id == bto.peliculaId);
            const sala = salas.find(s => s.id == bto.salaId);
            return {
                ...bto,
                tituloPelicula: peli ? peli.titulo : 'Película Eliminada',
                nombreSala: sala ? sala.nombre : 'Sala Eliminada'
            };
        });

        res.render('filtros', { 
            title: 'Resultados del Filtro', 
            lista: resultados,
            busqueda: true,
            rango: { inicio, fin }
        });
    }
}

module.exports = new BoletoController();