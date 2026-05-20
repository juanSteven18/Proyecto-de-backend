const express = require('express');
const router = express.Router();
const cineController = require('../controladores/cine_control');


// 1. GET 
router.get('/', cineController.listar);                 // 1. Listar Peliculas 
router.get('/salas', cineController.listarSalas);       // 2. Listar Salas
router.get('/boletos', cineController.listarBoletos);   // 3. Listar Boletos



// 2. POST

router.post('/peliculas/guardar', cineController.almacenar);    // 1. Guardar Pelicula
router.post('/salas/guardar', cineController.guardarSala);      // 2. Guardar Sala
router.post('/boletos/guardar', cineController.guardarBoleto);  // 3. Guardar/Vender Boleto


// 3.  PUT 

router.post('/actualizar/:id', cineController.actualizar);               // 1. Editar Pelicula
router.post('/salas/actualizar/:id', cineController.actualizarSala);     // 2. Editar Sala
router.post('/boletos/actualizar/:id', cineController.actualizarBoleto); // 3. Editar Boleto


// 4.   DELETE 

router.get('/eliminar/:id', cineController.eliminar);               // 1. Eliminar Pelicula
router.get('/salas/eliminar/:id', cineController.eliminarSala);     // 2. Eliminar Sala
router.get('/boletos/eliminar/:id', cineController.eliminarBoleto); // 3. Cancelar Boleto


// RUTAS AUXILIARES 

router.get('/crear', cineController.vistaCrear);
router.get('/editar/:id', cineController.vistaEditar);
router.get('/salas/editar/:id', cineController.vistaEditarSala);   
router.get('/boletos/editar/:id', cineController.vistaEditarBoleto);
router.get('/pelicula/:id', cineController.verDetalle);
router.get('/buscar', cineController.buscarPorNombre);
router.get('/top5', cineController.verTop5);                  
router.get('/filtros/fechas', cineController.filtrarPorRango); 


module.exports = router;