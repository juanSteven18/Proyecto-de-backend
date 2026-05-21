const express = require('express');
const router = express.Router();
const cineController = require('../controladores/cine_control');

// VER
router.get('/', cineController.listar);
router.get('/salas', cineController.listarSalas);
router.get('/boletos', cineController.listarBoletos);
router.get('/pelicula/:id/funciones', cineController.listarFuncionesPorPelicula);
router.get('/reservaciones', cineController.listarReservaciones);
router.get('/pelicula/:id', cineController.verDetalle);

// EDITAR
router.get('/funciones/editar/:id', cineController.editarFuncionForm);
router.get('/reservaciones/editar/:id', cineController.editarReservacionForm);

// VISTASEDITAR
router.get('/crear', cineController.vistaCrear);
router.get('/editar/:id', cineController.vistaEditar);
router.get('/salas/editar/:id', cineController.vistaEditarSala);   
router.get('/boletos/editar/:id', cineController.vistaEditarBoleto);

// GUARDAR
router.post('/peliculas/guardar', cineController.almacenar);
router.post('/salas/guardar', cineController.guardarSala);
router.post('/boletos/guardar', cineController.guardarBoleto);
router.post('/funciones/guardar', cineController.guardarFuncion);
router.post('/reservaciones/guardar', cineController.guardarReservacion);

// ACTUALIZAR
router.post('/actualizar/:id', cineController.actualizar);
router.post('/salas/actualizar/:id', cineController.actualizarSala);
router.post('/boletos/actualizar/:id', cineController.actualizarBoleto);
router.post('/funciones/actualizar/:id', cineController.actualizarFuncion);
router.post('/reservaciones/actualizar/:id', cineController.actualizarReservacion);

// ELIMINAR
router.get('/eliminar/:id', cineController.eliminar);
router.get('/salas/eliminar/:id', cineController.eliminarSala);
router.get('/boletos/eliminar/:id', cineController.eliminarBoleto);
router.get('/funciones/eliminar/:id', cineController.eliminarFuncion);
router.get('/reservaciones/eliminar/:id', cineController.eliminarReservacion);

// FUNCIONES ADICIONALES
router.get('/buscar', cineController.buscarPorNombre);
router.get('/top5', cineController.verTop5);                  
router.get('/filtros/fechas', cineController.filtrarPorRango); 
router.get('/reservaciones/concretar/:id', cineController.concretarReservacion);

// SUGERENCIA: Para cumplir estrictamente con los estandares REST, las rutas de Actualizar deberian usar router.put() y las de Eliminar router.delete(). Como los formularios HTML puros solo soportan GET y POST, mantuvimos POST/GET, pero mencionarselo al profesor sumara puntos en tu defensa.

module.exports = router;