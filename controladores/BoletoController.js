const { Boleto, Funcion, Pelicula, Sala } = require('../models'); 
const { Op } = require('sequelize');

class BoletoController {

// =========================================================
// LISTAR BOLETOS
// =========================================================
   async listarBoletos(req, res) {
    try {
        
        const boletosDB = await Boleto.findAll({
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

        const peliculasDB = await Pelicula.findAll();
        const salasDB = await Sala.findAll();

        res.render('boletos', {
            title: 'Historial de Boletos Vendidos',
            listaBoletos: boletosDB,
            peliculas: peliculasDB,
            salas: salasDB
        });

    } catch (error) {
        console.error("ERROR DETALLADO EN LISTAR BOLETOS:", error);
        res.status(500).send("Error al cargar el historial de boletos: " + error.message);
    }
}

// =========================================================
// VISTA DE RESERVACIONES
// =========================================================
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

//==========================================================
// VISTA EDITAR
//==========================================================
async pantallaEditar(req, res) {
    try {
        const { id } = req.params;
        
        // 1. Buscamos el boleto que queremos editar
        const boleto = await Boleto.findByPk(id);
        if (!boleto) {
            return res.status(404).send("Boleto no encontrado");
        }

        // 2. Traemos todas las funciones por si el usuario quiere cambiar de horario/sala
        const funciones = await Funcion.findAll({
            include: ['pelicula', 'sala'] 
        });

        // 3. ¡AQUÍ ESTÁ EL TRUCO! Traemos la lista real de películas para el menú desplegable del EJS
        const peliculas = await Pelicula.findAll();

        const salas = await Sala.findAll();

        // 4. Renderizamos pasando las variables EXACTAS que pide el EJS
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
//==========================================================
// ACTUALIZAR
//==========================================================
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

// =========================================================
// REGISTRAR / ALMACENAR BOLETO
// =========================================================
async almacenarBoleto(req, res) {
        try {
            const { peliculaId, salaId, nombreCliente, cantidadAsientos, fecha } = req.body;

            const funcionExistente = await Funcion.findOne({
                where: { peliculaId, salaId, fecha }
            });

            if (!funcionExistente) {
                return res.status(404).send("No hay ninguna funcion programada para esa combinacion.");
            }

            if (funcionExistente.disponibilidad < parseInt(cantidadAsientos)) {
                return res.status(400).send("No hay suficientes asientos disponibles.");
            }

            // Creamos el boleto en la base de datos
            await Boleto.create({
                nombreCliente,
                cantidadAsientos: parseInt(cantidadAsientos),
                funcionId: funcionExistente.id
            });

            // Descontamos disponibilidad
            await funcionExistente.decrement('disponibilidad', { by: parseInt(cantidadAsientos) });

            res.redirect('/boletos');

        } catch (error) {
            console.error("Error en almacenarBoleto:", error);
            res.status(500).send("Error interno al procesar la venta");
        }
}

// =========================================================
// ELIMINAR / CANCELAR RESERVACIÓN
// =========================================================
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

//==========================================================
// CONFIRMAR RESERVAS
//==========================================================
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