var { peliculas, salas, boletos, peliculas } = require('../base');
const crypto = require('crypto');

class cineController {



///////Metodo para listar
listar(req, res) {
        res.render('index', { 
            lista: peliculas
        });
}
//Listar todas las salas
listarSalas(req, res) {
    res.render('salas', { 
        title: 'Gestion de Salas de Cine',
        listaSalas: salas // Enviamos el array de salas
    });
}
//Listar boletos cruzando informacion de Peliculas y Salas
listarBoletos(req, res) {
    const listaEnriquecida = boletos.map(b => {
        const peli = peliculas.find(p => p.id == b.peliculaId);
        const sala = salas.find(s => s.id == b.salaId);
        
        return {
            id: b.id,
            fecha: b.fecha,
            tituloPelicula: peli ? peli.titulo : "Pelicula Eliminada",
            nombreSala: sala ? sala.nombre : "Sala Eliminada"
        };
    });

    res.render('boletos', { 
        title: 'Historial de Boletos Vendidos',
        listaBoletos: listaEnriquecida,
        peliculas: peliculas, 
        salas: salas          
    });
}
///////Metodo para buscar obj especifico
buscarPorNombre(req, res) {
    const nombreBusqueda = req.query.nombre; 

///////Filtramos el array buscando coincidencias parciales
    const resultados = peliculas.filter(p => 
        p.titulo.toLowerCase().includes(nombreBusqueda.toLowerCase())
    );

///////Reutilizamos la vista 'index' pero le pasamos solo los resultados
    res.render('index', { 
        title: `Resultados para: ${nombreBusqueda}`,
        lista: resultados 
    });
}

///////Metodo para añadir

///////Mostrar el formulario
vistaCrear(req, res) {
        res.render('crear', { title: 'Añadir Nueva Pelicula' });
}
///////Procesar los datos y guardar 
almacenar(req, res) {
        const { titulo, duracion, genero } = req.body;

        const nuevaPeli = {
            id: crypto.randomUUID(),
            titulo: titulo,
            duracion: parseInt(duracion),
            genero: genero
        };

       peliculas.push(nuevaPeli);
        res.redirect('/');
}
    //Crear/Guardar una nueva sala
guardarSala(req, res) {
    const { nombre, capacidad } = req.body;

    const nuevaSala = {
        id: crypto.randomUUID(),
        nombre: nombre,
        capacidad: parseInt(capacidad)
    };

    salas.push(nuevaSala);
    res.redirect('/salas'); // Redirecciona al listado de salas para ver el cambio
}
//Procesar la venta de un nuevo boleto
guardarBoleto(req, res) {
    const { peliculaId, salaId, asiento, fecha } = req.body;

    const nuevoBoleto = {
        id: crypto.randomUUID(),
        peliculaId: peliculaId, 
        salaId: salaId,         
        asiento: asiento,
        fecha: fecha 
    };

    boletos.push(nuevoBoleto);
    res.redirect('/boletos');
}



///////Metodo para editar

///////Mostrar el formulario con los datos actuales
vistaEditar(req, res) {
    const id = req.params.id; 
    const pelicula = peliculas.find(p => p.id == id); // Buscamos el producto

    if (!pelicula) {
        return res.send("Pelicula no encontrada");
    }

    res.render('editar', { 
        title: 'Editar Pelicula', 
        pelicula: pelicula 
    });
}
//Mostrar el formulario con los datos cargados
vistaEditarSala(req, res) {
    const id = req.params.id;
    const sala = salas.find(s => s.id == id);

    if (!sala) return res.status(404).send("Sala no encontrada");

    res.render('editarSala', { 
        title: 'Modificar Datos de la Sala', 
        sala: sala 
    });
}
//Mostrar el formulario con los datos del boleto, películas y salas disponibles
vistaEditarBoleto(req, res) {
    const id = req.params.id;
    const boleto = boletos.find(b => b.id == id);

    if (!boleto) return res.status(404).send("Boleto no encontrado");

    res.render('editarBoleto', { 
        title: 'Reasignar / Editar Boleto', 
        boleto: boleto,
        peliculas: peliculas, 
        salas: salas          
    });
}
///////Procesar el cambio
actualizar(req, res) {
    const id = req.params.id;
    const { titulo, duracion, genero} = req.body;

///////Buscamos el indice del producto en el array
    const indice = peliculas.findIndex(p => p.id == id);

    if (indice !== -1) {
///////Actualizamos los datos en esa posicion
        peliculas[indice].titulo = titulo;
        peliculas[indice].duracion = duracion;
        peliculas[indice].genero = genero;
    }

    res.redirect('/');
}
//Procesar la actualización de una sala
actualizarSala(req, res) {
    const id = req.params.id;
    const { nombre, capacidad } = req.body;

    const indice = salas.findIndex(s => s.id == id);

    if (indice !== -1) {
        salas[indice].nombre = nombre;
        salas[indice].capacidad = parseInt(capacidad);
    }

    res.redirect('/salas');
}
//Modificar un boleto existente (cambio de asiento, sala o película)
actualizarBoleto(req, res) {
    const id = req.params.id;
    const { peliculaId, salaId, asiento, fecha } = req.body;

    const indice = boletos.findIndex(b => b.id == id);

    if (indice !== -1) {
        boletos[indice].peliculaId = peliculaId;
        boletos[indice].salaId = salaId;
        boletos[indice].asiento = asiento;
        boletos[indice].fecha = fecha;
    }

    res.redirect('/boletos');
}



///////Metodo para eliminar
eliminar(req, res) {
    const id = req.params.id;
        const indice = peliculas.findIndex(p => p.id == id);

        if (indice !== -1) {
            peliculas.splice(indice, 1); // Remueve el elemento en esa posicion
        }

        res.redirect('/');

}
//Eliminar una sala por ID
eliminarSala(req, res) {
    const id = req.params.id;
    const indice = salas.findIndex(s => s.id == id);

    if (indice !== -1) {
        salas.splice(indice, 1);
    }

    res.redirect('/salas');
}
//Cancelar un boleto por su ID
eliminarBoleto(req, res) {
    const id = req.params.id;
    const indice = boletos.findIndex(b => b.id == id);

    if (indice !== -1) {
        boletos.splice(indice, 1);
    }

    res.redirect('/boletos');
}



//////Detalle Individual
verDetalle(req, res) {
    const id = req.params.id;
    const pelicula = peliculas.find(p => p.id == id);

    if (!pelicula) return res.status(404).send("Pelicula no encontrada");

    res.render('detalle', { 
        title: 'Detalle de la pelicula', 
        pelicula: pelicula
    });
}
////////Top 5 
verTop5(req, res) {
    
        const ultimasPeliculas = [...peliculas].reverse().slice(0, 3);

        res.render('top5', { 
            title: 'Últimas 3 Peliculas en Cartelera', 
            lista: ultimasPeliculas 
        });
}
//////filtrado de fechas de boletos/ventas
filtrarPorRango(req, res) {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
        return res.render('filtros', { 
            title: 'Búsqueda por Rango de Fechas', 
            lista: [],
            busqueda: false
        });
    }

    //Filtramos los boletos que estén dentro del rango de fechas
    const boletosFiltrados = boletos.filter(b => {
        return b.fecha >= inicio && b.fecha <= fin;
    });


    const resultados = boletosFiltrados.map(bto => {
        const peli = peliculas.find(p => p.id == bto.peliculaId);
        const sala = salas.find(s => s.id == bto.salaId);
        return {
            ...bto,
            tituloPelicula: peli ? peli.titulo : 'Pelicula Eliminada',
            nombreSala: sala ? sala.nombre : 'Sala Eliminada'
        };
    });

    // Enviamos los resultados procesados a la vista
    res.render('filtros', { 
        title: 'Resultados del Filtro', 
        lista: resultados,
        busqueda: true,
        rango: { inicio, fin }
    });
}
}


module.exports = new cineController();