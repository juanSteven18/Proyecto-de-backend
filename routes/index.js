const express = require('express');
const router = express.Router();
const cineController = require('../controladores/cine_control');

//Ruta para ver los productos
router.get('/', cineController.listar);

// Ruta de búsqueda
router.get('/buscar', cineController.buscarPorNombre);

// Ruta para ver el formulario
router.get('/crear', cineController.vistaCrear);

// Ruta para recibir los datos del formulario
router.post('/guardar', cineController.almacenar);

// Ruta para ver el formulario de edicion 
router.get('/editar/:id', cineController.vistaEditar);

// Ruta para recibir los datos editados
router.post('/actualizar/:id', cineController.actualizar);

// Endpoint para la lógica de filtros
router.get('/filtros/fechas', cineController.filtrarPorRango);

//Ruta para eliminar datos
router.get('/eliminar/:id', cineController.eliminar);

//Ver detalle
router.get('/pelicula/:id', cineController.verDetalle);

//Ver Top 5
router.get('/top5', cineController.verTop5);

module.exports = router;