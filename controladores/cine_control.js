var { peliculas, salas, boletos, funciones, reservaciones } = require('../base');
const crypto = require('crypto');

class cineController {

// VER
listar(req, res) {
    res.render('index', { 
        title: 'Cartelera de Cine',
        lista: peliculas
    });
}

listarSalas(req, res) {
    res.render('salas', { 
        title: 'Gestion de Salas de Cine',
        listaSalas: salas
    });
}

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

listarFuncionesPorPelicula(req, res) {
    const peliculaId = req.params.id;
    const pelicula = peliculas.find(p => p.id == peliculaId);
    
    if (!pelicula) {
        return res.send("Pelicula no encontrada");
    }

    const funcionesFiltradas = funciones.filter(f => f.peliculaId == peliculaId);

    const listaEnriquecida = funcionesFiltradas.map(f => {
        const sala = salas.find(s => s.id == f.salaId);
        return {
            ...f,
            nombreSala: sala ? sala.nombre : "Sala No Asignada"
        };
    });

    res.render('funciones', {
        title: `Funciones disponibles para: ${pelicula.titulo}`,
        pelicula,
        listaFunciones: listaEnriquecida,
        salas: salas
    });
}

listarReservaciones(req, res) {
    const listaEnriquecida = reservaciones.map(reserva => {
        const funcion = funciones.find(f => f.id == reserva.funcionId);
        
        let tituloPelicula = "Pelicula No Asignada";
        let nombreSala = "Sala No Asignada";
        let fecha = "N/A";
        let hora = "N/A";

        if (funcion) {
            const peli = peliculas.find(p => p.id == funcion.peliculaId);
            const sala = salas.find(s => s.id == funcion.salaId);
            
            tituloPelicula = peli ? peli.titulo : "Pelicula Eliminada";
            nombreSala = sala ? sala.nombre : "Sala Eliminada";
            fecha = funcion.fecha;
            hora = funcion.hora;
        }

        return {
            ...reserva,
            tituloPelicula,
            nombreSala,
            fecha,
            hora
        };
    });

    res.render('reservaciones', {
        title: 'Listado de Reservaciones Pendientes',
        listaReservaciones: listaEnriquecida
    });
}

verDetalle(req, res) {
    const id = req.params.id;
    const pelicula = peliculas.find(p => p.id == id);

    if (!pelicula) return res.status(404).send("Pelicula no encontrada");

    res.render('detalle', { 
        title: 'Detalle de la pelicula', 
        pelicula: pelicula
    });
}

// EDITAR
editarFuncionForm(req, res) {
    const funcionId = req.params.id;
    const funcionEncontrada = funciones.find(f => f.id == funcionId);

    if (!funcionEncontrada) {
        return res.send("Funcion no encontrada");
    }

    const pelicula = peliculas.find(p => p.id == funcionEncontrada.peliculaId);

    res.render('editar_funcion', {
        title: 'Modificar Horario de funcion',
        funcion: funcionEncontrada,
        pelicula: pelicula,
        salas: salas
    });
}

editarReservacionForm(req, res) {
    const reservaId = req.params.id;
    const reservaEncontrada = reservaciones.find(r => r.id == reservaId);

    if (!reservaEncontrada) {
        return res.send("Reservacion no encontrada");
    }

    res.render('editar_reservacion', {
        title: 'Modificar Datos de la Reservacion',
        reservacion: reservaEncontrada
    });
}

// VISTASEDITAR
vistaCrear(req, res) {
    res.render('crear', { title: 'Anadir Nueva Pelicula' });
}

vistaEditar(req, res) {
    const id = req.params.id; 
    const pelicula = peliculas.find(p => p.id == id);

    if (!pelicula) {
        return res.send("Pelicula no encontrada");
    }

    res.render('editar', { 
        title: 'Editar Pelicula', 
        pelicula: pelicula 
    });
}

vistaEditarSala(req, res) {
    const id = req.params.id;
    const sala = salas.find(s => s.id == id);

    if (!sala) return res.status(404).send("Sala no encontrada");

    res.render('editarSala', { 
        title: 'Modificar Datos de la Sala', 
        sala: sala 
    });
}

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

// GUARDAR
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

guardarSala(req, res) {
    const { nombre, capacidad } = req.body;

    const nuevaSala = {
        id: crypto.randomUUID(),
        nombre: nombre,
        capacidad: parseInt(capacidad)
    };

    salas.push(nuevaSala);
    res.redirect('/salas');
}

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

guardarFuncion(req, res) {
    const { peliculaId, salaId, fecha, hora } = req.body;

    const salaElegida = salas.find(s => s.id == salaId);
    const capacidadInicial = salaElegida ? parseInt(salaElegida.capacidad) : 0;

    const nuevaFuncion = {
        id: crypto.randomUUID(),
        peliculaId: peliculaId,
        salaId: salaId,
        fecha: fecha,
        hora: hora,
        disponibilidad: capacidadInicial
    };
    

    funciones.push(nuevaFuncion);
    res.redirect('/pelicula/' + peliculaId + '/funciones');
}

guardarReservacion(req, res) {
    const { funcionId, nombreCliente, asiento } = req.body;

    const funcionAsociada = funciones.find(f => f.id == funcionId);

    if (!funcionAsociada || funcionAsociada.disponibilidad <= 0) {
        return res.send("Lo sentimos, ya no hay disponibilidad para esta funcion.");
    }

    const nuevaReserva = {
        id: crypto.randomUUID(),
        funcionId: funcionId,
        nombreCliente: nombreCliente,
        asiento: asiento,
        estado: "RESERVADO"
    };

    reservaciones.push(nuevaReserva);
    funcionAsociada.disponibilidad -= 1;
    res.redirect('/reservaciones');
}

// ACTUALIZAR
actualizar(req, res) {
    const id = req.params.id;
    const { titulo, duracion, genero} = req.body;

    const indice = peliculas.findIndex(p => p.id == id);

    if (indice !== -1) {
        peliculas[indice].titulo = titulo;
        peliculas[indice].duracion = duracion;
        peliculas[indice].genero = genero;
    }

    res.redirect('/');
}

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

actualizarFuncion(req, res) {
    const funcionId = req.params.id;
    const { salaId, fecha, hora } = req.body;

    const index = funciones.findIndex(f => f.id == funcionId);

    if (index !== -1) {
        if (funciones[index].salaId !== salaId) {
            const nuevaSala = salas.find(s => s.id == salaId);
            funciones[index].disponibilidad = nuevaSala ? parseInt(nuevaSala.capacidad) : funciones[index].disponibilidad;
        }

        funciones[index].salaId = salaId;
        funciones[index].fecha = fecha;
        funciones[index].hora = hora;

        res.redirect('/pelicula/' + funciones[index].peliculaId + '/funciones');
    } else {
        res.send("Error al actualizar la funcion");
    }
}

actualizarReservacion(req, res) {
    const reservaId = req.params.id;
    const { nombreCliente, asiento } = req.body;

    const index = reservaciones.findIndex(r => r.id == reservaId);

    if (index !== -1) {
        reservaciones[index].nombreCliente = nombreCliente;
        reservaciones[index].asiento = asiento;

        res.redirect('/reservaciones');
    } else {
        res.send("Error al actualizar la reservacion");
    }
}

// ELIMINAR
eliminar(req, res) {
    const id = req.params.id;
    const indice = peliculas.findIndex(p => p.id == id);

    if (indice !== -1) {
        peliculas.splice(indice, 1);
    }

    res.redirect('/');
}

eliminarSala(req, res) {
    const id = req.params.id;
    const indice = salas.findIndex(s => s.id == id);

    if (indice !== -1) {
        salas.splice(indice, 1);
    }

    res.redirect('/salas');
}

eliminarBoleto(req, res) {
    const id = req.params.id;
    const indice = boletos.findIndex(b => b.id == id);

    if (indice !== -1) {
        boletos.splice(indice, 1);
    }

    res.redirect('/boletos');
}

eliminarFuncion(req, res) {
    const funcionId = req.params.id;
    const funcionEncontrada = funciones.find(f => f.id == funcionId);

    if (!funcionEncontrada) {
        return res.send("Funcion no encontrada");
    }

    const peliculaId = funcionEncontrada.peliculaId;
    
    const index = funciones.findIndex(f => f.id == funcionId);
    if (index !== -1) {
        funciones.splice(index, 1);
    }

    res.redirect('/pelicula/' + peliculaId + '/funciones');
}

eliminarReservacion(req, res) {
    const reservaId = req.params.id;
    const index = reservaciones.findIndex(r => r.id == reservaId);

    if (index !== -1) {
        const funcionAsociada = funciones.find(f => f.id == reservaciones[index].funcionId);
        if (funcionAsociada) {
            funcionAsociada.disponibilidad += 1;
        }

        reservaciones.splice(index, 1);
        res.redirect('/reservaciones');
    } else {
        res.send("Reservacion no encontrada");
    }
}

// FUNCIONES ADICIONALES
buscarPorNombre(req, res) {
    const nombreBusqueda = req.query.nombre; 

    const resultados = peliculas.filter(p => 
        p.titulo.toLowerCase().includes(nombreBusqueda.toLowerCase())
    );

    res.render('index', { 
        title: `Resultados para: ${nombreBusqueda}`,
        lista: resultados 
    });
}

verTop5(req, res) {
    const ultimasPeliculas = [...peliculas].reverse().slice(0, 3);

    res.render('top5', { 
        title: 'Ultimas 3 Peliculas en Cartelera', 
        lista: ultimasPeliculas 
    });
}

filtrarPorRango(req, res) {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
        return res.render('filtros', { 
            title: 'Busqueda por Rango de Fechas', 
            lista: [],
            busqueda: false
        });
    }

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

    res.render('filtros', { 
        title: 'Resultados del Filtro', 
        lista: resultados,
        busqueda: true,
        rango: { inicio, fin }
    });
}

concretarReservacion(req, res) {
    const reservaId = req.params.id;
    const index = reservaciones.findIndex(r => r.id == reservaId);

    if (index !== -1) {
        const reserva = reservaciones[index];
        const funcion = funciones.find(f => f.id == reserva.funcionId);

        if (!funcion) {
            return res.send("La funcion asociada a esta reserva ya no existe.");
        }

        const nuevoBoleto = {
            id: crypto.randomUUID(),
            peliculaId: funcion.peliculaId,
            salaId: funcion.salaId,
            asiento: reserva.asiento,
            fecha: funcion.fecha
        };

        boletos.push(nuevoBoleto);
        reservaciones.splice(index, 1);
        res.redirect('/boletos');
    } else {
        res.send("No se pudo procesar la reservacion");
    }
}


}

module.exports = new cineController();