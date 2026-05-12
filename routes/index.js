const express = require('express');
const router = express.Router();

const productosControl = require('../controladores/product_control');

//Ruta para ver los productos
router.get('/', productosControl.listar);

// Ruta de búsqueda
router.get('/buscar', productosControl.buscarPorNombre);

// Ruta para ver el formulario
router.get('/crear', productosControl.vistaCrear);

// Ruta para recibir los datos del formulario
router.post('/guardar', productosControl.almacenar);

// Ruta para ver el formulario de edicion 
router.get('/editar/:id', productosControl.vistaEditar);

// Ruta para recibir los datos editados
router.post('/actualizar/:id', productosControl.actualizar);

// Endpoint para la lógica de filtros
router.get('/filtros/fechas', productosControl.filtrarPorRango);

//Ruta para eliminar datos
router.get('/eliminar/:id', productosControl.eliminar);

//Ver detalle
router.get('/producto/:id', productosControl.verDetalle);

//Ver Top 5
router.get('/top5', productosControl.verTop5);

module.exports = router;