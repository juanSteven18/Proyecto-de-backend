const express = require('express');
const router = express.Router();

// Importamos todos los controladores de la nueva arquitectura
const peliculaController = require('../controladores/PeliculaController');
const salaController = require('../controladores/SalaController');
const boletoController = require('../controladores/BoletoController');
const funcionController = require('../controladores/FuncionController');

// ====== ENTIDAD: PELÍCULAS ======
router.get('/', peliculaController.listar);
router.get('/crear', peliculaController.vistaCrear);
router.get('/editar/:id', peliculaController.vistaEditar);
router.post('/peliculas/guardar', peliculaController.almacenar);
router.put('/actualizar/:id', peliculaController.actualizar);
router.get('/eliminar/:id', peliculaController.eliminar);
router.get('/top5', peliculaController.top5); // <-- Vincula el Top 5

// ====== ENTIDAD: SALAS ======
router.get('/salas', salaController.listarSalas);
router.get('/salas/crear', salaController.vistaCrearSala);
router.get('/salas/editar/:id', salaController.vistaEditarSala);
router.post('/salas/guardar', salaController.guardarSala);
router.put('/salas/actualizar/:id', salaController.actualizarSala);
router.get('/salas/eliminar/:id', salaController.eliminarSala);

// ====== ENTIDAD: FUNCIONES ======
router.get('/funciones', funcionController.listar);
router.get('/funciones/crear', funcionController.vistaCrear);
router.post('/funciones/guardar', funcionController.almacenar);
router.get('/funciones/eliminar/:id', funcionController.eliminar)
router.get('/pelicula/:id', funcionController.listarPorPelicula);
router.get('/pelicula/:id/funciones', funcionController.listarPorPelicula);


// ====== ENTIDAD: BOLETOS, RESERVACIONES Y FILTROS ======
router.get('/boletos', boletoController.listarBoletos);
router.get('/reservaciones', boletoController.listarReservaciones); // ¡Reactivado con éxito!
router.post('/boletos/guardar', boletoController.almacenarBoleto);
router.get('/boletos/eliminar/:id', boletoController.eliminar);

// ====== FILTROS ======
//router.get('/filtros/fechas', boletoController.vistaFiltros);
//router.post('/filtros/buscar', boletoController.procesarFiltro);

module.exports = router;