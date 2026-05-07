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

//Ruta para eliminar datos
router.get('/eliminar/:id', productosControl.eliminar);

module.exports = router;