const { Funcion, Pelicula, Sala, Boleto } = require('../models');
const { Op } = require('sequelize');

class FuncionController {

//VISTA PRINCIPAL
async listar(req, res) {
        try {
            //Buscamos todas las funciones con sus relaciones
            const funciones = await Funcion.findAll({
                include: [
                    { model: Pelicula, as: 'pelicula' },
                    { model: Sala, as: 'sala' }
                ]
            });

            //Buscamos las peliculas y salas para alimentar el formulario de arriba
            const peliculas = await Pelicula.findAll();
            const salas = await Sala.findAll();

            if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api')) {
                return res.json({ status: "success", data: funciones });
            }

            // Enviamos todo a la misma vista de funciones
            res.render('funciones', {
                title: 'Gestion de Funciones (Base de Datos)',
                listaFunciones: funciones,
                peliculas, 
                salas      
            });
        } catch (error) {
            console.error("Error al listar funciones:", error);
            res.status(500).json({ status: "error", message: "Error interno en el servidor" });
        }
}

//LISTAR PELICULAS
async listarPorPelicula(req, res) {
        try {
            const { id } = req.params; 

            //Buscamos los datos de la pelicula para usar su titulo en la cabecera de la vista
            const pelicula = await Pelicula.findByPk(id);
            
            if (!pelicula) {
                return res.status(404).send("La pelicula especificada no existe");
            }

            //Filtramos en la base de datos las funciones que le correspondan a esa pelicula
            const listaFunciones = await Funcion.findAll({
                where: { peliculaId: id },
                include: [
                    { model: Pelicula, as: 'pelicula' },
                    { model: Sala, as: 'sala' }
                ]
            });

            //Renderizamos la vista 'funciones'
            res.render('funciones', {
                title: `Funciones para la Película: ${pelicula.titulo}`,
                funciones: listaFunciones, 
                pelicula: pelicula
            });

        } catch (error) {
            console.error("Error en listarPorPelicula:", error);
            res.status(500).send("Error interno al recuperar las funciones de la cartelera");
        }
}

//RENDER PARA CREAR
async vistaCrear(req, res) {
        res.redirect('/funciones');
}

//GUARDAR FUNCION 
async almacenar(req, res) {
        try {
            const { peliculaId, salaId, fecha, hora, precio } = req.body;

            if (!peliculaId || !salaId || !fecha || !hora || !precio) {
                return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
            }

            const sala = await Sala.findByPk(salaId);
            if (!sala) {
                return res.status(404).json({ status: "error", message: "La sala seleccionada no existe" });
            }

            await Funcion.create({
                peliculaId,
                salaId,
                fecha,
                hora,
                precio: parseFloat(precio),
                disponibilidad: sala.capacidad 
            });

            res.redirect('/funciones');
        } catch (error) {
            console.error("Error al guardar funcion:", error);
            res.status(500).json({ status: "error", message: "No se pudo guardar la funcion" });
        }
}

//ELIMINAR FUNCION 
async eliminar(req, res) {
        try {
            const { id } = req.params;

            await Funcion.destroy({
                where: { id }
            });

            res.redirect('/funciones');
        } catch (error) {
            console.error("Error al eliminar funcion:", error);
            res.status(500).json({ status: "error", message: "No se pudo eliminar la funcion" });
        }
}

//LISTAR FUNCIONES FILTRADAS POR PELICULA
async listarPorPelicula(req, res) {
        try {
            const { id } = req.params;
            const pelicula = await Pelicula.findByPk(id);
            if (!pelicula) return res.status(404).send("Pelicula no encontrada");

            const funciones = await Funcion.findAll({
                where: { peliculaId: id },
                include: [
                    { model: Pelicula, as: 'pelicula' },
                    { model: Sala, as: 'sala' }
                ]
            });

            const peliculas = await Pelicula.findAll();
            const salas = await Sala.findAll();

            res.render('funciones', {
                title: `Funciones para la pelicula: ${pelicula.titulo}`,
                listaFunciones: funciones,
                peliculas, 
                salas      
            });
        } catch (error) {
            console.error("Error al filtrar funciones:", error);
            res.status(500).send("Error interno al filtrar funciones");
        }
}
//FILTRO POR FECHAS
 async filtrarPorFecha(req, res) {
    try {
        //Capturamos los nombres exactos de tus inputs en filtros.ejs
        const { fechaInicio, fin } = req.query;

       
        // CASO 1:No ha filtrado nada
       
        if (!fechaInicio || !fin) {
            return res.render('filtros', {
                title: 'Filtrar Ventas',
                busqueda: false,  
                rango: { inicio: '', fin: '' },
                lista: []
            });
        }

       
        // CASO 2: Filtrado 
        const inicioDate = new Date(`${fechaInicio}T00:00:00`);
        const finDate = new Date(`${fin}T23:59:59`);

        // Buscamos los boletos creados en ese rango
        const boletosDB = await Boleto.findAll({
            where: {
                createdAt: {
                    [Op.between]: [inicioDate, finDate]
                }
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

        const listaMapeada = boletosDB.map(b => {
            return {
                tituloPelicula: b.funcion && b.funcion.pelicula ? b.funcion.pelicula.titulo : 'Película Desconocida',
                nombreSala: b.funcion && b.funcion.sala ? b.funcion.sala.nombre : 'Sin Sala',
                asiento: b.cantidadAsientos, 
                fecha: b.funcion ? b.funcion.fecha : 'Sin fecha' 
            };
        });

     
        res.render('filtros', {
            title: 'Ventas Filtradas',
            busqueda: true, 
            rango: { 
                inicio: fechaInicio, 
                fin: fin 
            },
            lista: listaMapeada
        });

    } catch (error) {
        console.error("ERROR EN EL FILTRO DE FECHAS:", error);
        res.status(500).send("Error interno al filtrar: " + error.message);
    }
}
}

module.exports = new FuncionController();