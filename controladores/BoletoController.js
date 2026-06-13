const { Boleto, Funcion, Pelicula, Sala } = require('../models'); 

class BoletoController {

    // =========================================================
    // LISTAR BOLETOS
    // =========================================================
   async listarBoletos(req, res) {
    try {
        // Colocamos el alias 'Funcion' con F mayúscula tal como exige tu modelo y tu vista EJS
        const boletosDB = await Boleto.findAll({
            include: [
                {
                    model: Funcion,
                    as: 'funcion', // <-- El alias mágico que resuelve el error de la pantalla
                    include: [
                        { model: Pelicula, as: 'pelicula' }, // Si da error de alias aquí, quita el as: 'pelicula'
                        { model: Sala, as: 'sala' }          // Si da error de alias aquí, quita el as: 'sala'
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
        console.error("👉 ERROR DETALLADO EN LISTAR BOLETOS:", error);
        res.status(500).send("Error al cargar el historial de boletos: " + error.message);
    }
}
    // =========================================================
    // VISTA DE RESERVACIONES (Si usas una plantilla separada)
    // =========================================================
   async listarReservaciones(req, res) {
    try {
        const boletosDB = await Boleto.findAll({
            include: [
                {
                    model: Funcion,
                    as: 'funcion', // <-- Sincronizado idénticamente
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
        console.error("👉 ERROR DETALLADO EN RESERVACIONES:", error);
        res.status(500).send("Error al cargar reservaciones: " + error.message);
    }
}

    // =========================================================
    // REGISTRAR / ALMACENAR BOLETO
    // =========================================================
    async almacenarBoleto(req, res) {
        try {
            const { peliculaId, salaId, nombreCliente, cantidadAsientos, fecha } = req.body;

            // Buscamos la función programada
            const funcionExistente = await Funcion.findOne({
                where: { peliculaId, salaId, fecha }
            });

            if (!funcionExistente) {
                return res.status(404).send("No hay ninguna función programada para esa combinación.");
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
}

module.exports = new BoletoController();