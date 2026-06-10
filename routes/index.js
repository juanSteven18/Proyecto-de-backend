const express = require('express');
const router = express.Router();

// Importamos todos los controladores de la nueva arquitectura
const peliculaController = require('../controladores/PeliculaController');
const salaController = require('../controladores/SalaController');
const boletoController = require('../controladores/BoletoController');

// ====== ENTIDAD: PELÍCULAS ======
router.get('/', peliculaController.listar);
router.get('/crear', peliculaController.vistaCrear);
router.get('/editar/:id', peliculaController.vistaEditar);
router.post('/peliculas/guardar', peliculaController.almacenar);
router.put('/actualizar/:id', peliculaController.actualizar);
router.delete('/eliminar/:id', peliculaController.eliminar);
router.get('/top5', peliculaController.top5); // <-- Vincula el Top 5

// ====== ENTIDAD: SALAS ======
router.get('/salas', salaController.listarSalas);
router.get('/salas/crear', salaController.vistaCrearSala);
router.get('/salas/editar/:id', salaController.vistaEditarSala);
router.post('/salas/guardar', salaController.guardarSala);
router.put('/salas/actualizar/:id', salaController.actualizarSala);
router.delete('/salas/eliminar/:id', salaController.eliminarSala);

// ====== ENTIDAD: BOLETOS, RESERVACIONES Y FILTROS ======
router.get('/boletos', boletoController.listarBoletos);
router.get('/reservaciones', boletoController.listarReservaciones);
router.get('/filtros/fechas', boletoController.vistaFiltros);
router.post('/filtros/buscar', boletoController.procesarFiltro);

module.exports = router;