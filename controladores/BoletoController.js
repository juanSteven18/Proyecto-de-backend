const { Boleto, Funcion, Pelicula, Sala } = require('../models'); 
const { Op } = require('sequelize');
const { actualizarNivelUsuario } = require('../help/membresiaHelp');
const { Usuario } = require('../models');

class BoletoController {

//listar boletos
   async listarBoletos(req, res) {
    try {
        
        const boletosDB = await Boleto.findAll({
            include: [
                { model: Usuario, as: 'usuario' },
                {
                    model: Funcion,
                    as: 'funcion', 
                    include: [
                        { model: Pelicula, as: 'pelicula' }, 
                        { model: Sala, as: 'sala' }          
                    ]
                }
            ]
        });

        const peliculasDB = await Pelicula.findAll();
        const salasDB = await Sala.findAll();

        const usuariosDB = await Usuario.findAll({
            where: { rol: 'cliente' }
        });

        res.render('boletos', {
            title: 'Historial de Boletos Vendidos',
            listaBoletos: boletosDB,
            peliculas: peliculasDB,
            salas: salasDB,
            usuarios: usuariosDB
        });

    } catch (error) {
        console.error("ERROR DETALLADO EN LISTAR BOLETOS:", error);
        res.status(500).send("Error al cargar el historial de boletos: " + error.message);
    }
}

//vista reservaciones
   async listarReservaciones(req, res) {
    try {
        const boletosDB = await Boleto.findAll({
            where: {
                estado: 'reservado' 
            },
            include: [
                {
                    model: Funcion,
                    as: 'funcion',
                    include: [
                        { model: Pelicula, as: 'pelicula' },
                        { model: Sala, as: 'sala' }
                    ]
                }
            ]
        });

        res.render('reservaciones', {
            title: 'Lista de Apartados Pendientes',
            listaReservaciones: boletosDB
        });
    } catch (error) {
        console.error("ERROR DETALLADO EN RESERVACIONES:", error);
        res.status(500).send("Error al cargar reservaciones: " + error.message);
    }
}

//vista editar
async pantallaEditar(req, res) {
    try {
        const { id } = req.params;
        
        //Buscamos el boleto que queremos editar
        const boleto = await Boleto.findByPk(id);
        if (!boleto) {
            return res.status(404).send("Boleto no encontrado");
        }

        //Traemos todas las funciones 
        const funciones = await Funcion.findAll({
            include: ['pelicula', 'sala'] 
        });

        //Traemos la lista real de peliculas para el menú desplegable del EJS
        const peliculas = await Pelicula.findAll();

        const salas = await Sala.findAll();

        //Renderizamos pasando las variables
        res.render('editarBoleto', { 
            boleto, 
            funciones, 
            peliculas,
            salas,          
            title: "Editar Boleto" 
        });

    } catch (error) {
        console.error("Error al cargar pantalla de edición:", error);
        res.status(500).send("Error del servidor");
    }
}

//Actualizar
async actualizar(req, res) {
    try {
        const { id } = req.params;
        const { nombreCliente, cantidadAsientos, funcionId } = req.body;

        //Buscamos el boleto original antes de cambiarlo
        const boleto = await Boleto.findByPk(id);
        if (!boleto) {
            return res.status(404).send("Boleto no encontrado");
        }

        const funcion = await Funcion.findByPk(funcionId);
        if (!funcion) {
            return res.status(404).send("La funcion seleccionada no existe");
        }

        const aforoDevuelto = funcion.disponibilidad + boleto.cantidadAsientos;


        if (aforoDevuelto < parseInt(cantidadAsientos)) {
            return res.status(400).send("No hay suficientes asientos disponibles para esta modificacion.");
        }

        // Si hay espacio, calculamos la nueva disponibilidad real
        funcion.disponibilidad = aforoDevuelto - parseInt(cantidadAsientos);
        await funcion.save();

        //actualizamos los datos del boleto
        boleto.nombreCliente = nombreCliente;
        boleto.cantidadAsientos = parseInt(cantidadAsientos);
        boleto.funcionId = funcionId;
        await boleto.save();

        res.redirect('/boletos');

    } catch (error) {
        console.error("Error al actualizar el boleto:", error);
        res.status(500).send("Error al guardar los cambios del boleto");
    }
}

//registrar / almacenar boletos
async almacenarBoleto(req, res) {
        try {
            console.log("CONTENIDO DE REQ.USER:", req.user);
            const { peliculaId, salaId, nombreCliente,usuarioId, cantidadAsientos, fecha } = req.body;

            const funcionExistente = await Funcion.findOne({
                where: { peliculaId, salaId, fecha }
            });

            if (!funcionExistente) {
                return res.status(404).send("No hay ninguna funcion programada para esa combinacion.");
            }

            if (funcionExistente.disponibilidad < parseInt(cantidadAsientos)) {
                return res.status(400).send("No hay suficientes asientos disponibles.");
            }

            const clienteSeleccionado = await Usuario.findByPk(usuarioId);

            // Creamos el boleto en la base de datos
            await Boleto.create({
                nombreCliente: clienteSeleccionado.nombre,
                usuarioId: usuarioId,
                cantidadAsientos: parseInt(cantidadAsientos),
                funcionId: funcionExistente.id
            });

            if (clienteSeleccionado) {
            await clienteSeleccionado.increment('sellos', { by: 1 });
            await clienteSeleccionado.update({ ultimaCompraAt: new Date() });
            await actualizarNivelUsuario(clienteSeleccionado.id);
        }

            // Descontamos disponibilidad
            await funcionExistente.decrement('disponibilidad', { by: parseInt(cantidadAsientos) });

            res.redirect('/boletos');

        } catch (error) {
            console.error("Error en almacenarBoleto:", error);
            res.status(500).send("Error interno al procesar la venta");
        }
}

//eliminar /cancelar reserva
async eliminar(req, res) {
        try {
            const { id } = req.params;

            const boleto = await Boleto.findByPk(id);
            if (!boleto) {
                return res.status(404).send("El boleto no existe.");
            }

            const funcion = await Funcion.findByPk(boleto.funcionId);
            if (funcion) {
                await funcion.increment('disponibilidad', { by: boleto.cantidadAsientos });
            }

            await boleto.destroy();
            res.redirect('/boletos');

        } catch (error) {
            console.error("Error al eliminar boleto:", error);
            res.status(500).send("Error al cancelar la reservación");
        }
}

//confirmar reservas
async confirmarReservacion(req, res) {
    try {
        const { id } = req.params;
        const boleto = await Boleto.findByPk(id);
        
        if (!boleto) {
            return res.status(404).send("La reservacion no existe.");
        }
        boleto.estado = 'confirmado'; 
        await boleto.save();

        res.redirect('/reservaciones');

    } catch (error) {
        console.error("Error al confirmar la reservacion:", error);
        res.status(500).send("Error del servidor al procesar el cobro");
    }
}


}

module.exports = new BoletoController();