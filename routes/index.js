const express = require('express');
const router = express.Router();

//se importan los controladores
const authController = require('../controladores/AuthController');
const peliculaController = require('../controladores/PeliculaController');
const salaController = require('../controladores/SalaController');
const boletoController = require('../controladores/BoletoController');
const funcionController = require('../controladores/FuncionController');

//importacion de middelware
const { verificarToken, restringirA, cargarUsuarioOpcional } = require('../middlewares/authMiddleware');


//Autenticacion
// Vistas de los formularios
router.get('/registro', (req, res) => res.render('registro', { title: 'Registrar Usuario' }));
router.get('/login', (req, res) => res.render('login', { title: 'Iniciar Sesión' }));

// Procesamiento de datos de los formularios
router.post('/registro', authController.registrar);
router.post('/login', authController.login);

// Cierre de sesion seguro 
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});


//Peliculas
// Vistas publicas: Cualquiera puede entrar a ver la cartelera o el top 5
router.get('/', cargarUsuarioOpcional, peliculaController.listar); 
router.get('/top5', cargarUsuarioOpcional, peliculaController.top5); 

// Gestion de películas: Solo admins y cajeros
router.get('/crear', verificarToken, restringirA('admin', 'cajero'), peliculaController.vistaCrear);
router.get('/editar/:id', verificarToken, restringirA('admin', 'cajero'), peliculaController.vistaEditar);
router.post('/peliculas/guardar', verificarToken, restringirA('admin', 'cajero'), peliculaController.almacenar);
router.put('/actualizar/:id', verificarToken, restringirA('admin', 'cajero'), peliculaController.actualizar);

// Destruccion de datos:solo admins
router.get('/eliminar/:id', verificarToken, restringirA('admin'), peliculaController.eliminar); 


//Salas
//solo admins
router.get('/salas', verificarToken, restringirA('admin'), salaController.listarSalas);
router.get('/salas/crear', verificarToken, restringirA('admin'), salaController.vistaCrearSala);
router.get('/salas/editar/:id', verificarToken, restringirA('admin'), salaController.vistaEditarSala);
router.post('/salas/guardar', verificarToken, restringirA('admin'), salaController.guardarSala);
router.put('/salas/actualizar/:id', verificarToken, restringirA('admin'), salaController.actualizarSala);
router.get('/salas/eliminar/:id', verificarToken, restringirA('admin'), salaController.eliminarSala);


//Funciones
//solo admins y cajeros
router.get('/funciones', verificarToken, restringirA('admin', 'cajero'), funcionController.listar);
router.get('/funciones/crear', verificarToken, restringirA('admin', 'cajero'), funcionController.vistaCrear);
router.post('/funciones/guardar', verificarToken, restringirA('admin', 'cajero'), funcionController.almacenar);
router.get('/funciones/eliminar/:id', verificarToken, restringirA('admin'), funcionController.eliminar);

// Consultas publicas:
router.get('/pelicula/:id', cargarUsuarioOpcional, funcionController.listarPorPelicula);
router.get('/pelicula/:id/funciones', cargarUsuarioOpcional, funcionController.listarPorPelicula);



//Boletos, reservaciones y filtros
//solo visibles para admins y cajeros
router.get('/boletos', verificarToken, restringirA('admin', 'cajero'), boletoController.listarBoletos);
router.get('/reservaciones', verificarToken, restringirA('admin', 'cajero'), boletoController.listarReservaciones);

// Modificacion y validacion
router.get('/boletos/editar/:id', verificarToken, restringirA('admin', 'cajero'), boletoController.pantallaEditar); 
router.post('/boletos/actualizar/:id', verificarToken, restringirA('admin', 'cajero'), boletoController.actualizar);
router.get('/boletos/confirmar/:id', verificarToken, restringirA('admin', 'cajero'), boletoController.confirmarReservacion);
router.get('/boletos/eliminar/:id', verificarToken, restringirA('admin'), boletoController.eliminar);

// Compra/Reserva activa
router.post('/boletos/guardar', verificarToken, boletoController.almacenarBoleto);


//Filtros
router.get('/filtros/fechas', cargarUsuarioOpcional, funcionController.filtrarPorFecha);


module.exports = router;