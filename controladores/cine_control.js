var { peliculas, salas, boletos, peliculas } = require('../base');
const crypto = require('crypto');

class cineController {
///////Metodo para listar
    listar(req, res) {
        res.render('index', { 
            title: 'Panel de Control del Proyecto',
            lista: peliculas
        });
    }
///////Metodo para buscar obj especifico
//////Capturamos lo que el usuario escribio en el buscador
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
///////Metodo para editar
///////Mostrar el formulario con los datos actuales
    vistaEditar(req, res) {
    const id = req.params.id; // Capturamos el ID de la URL
    const pelicula = peliculas.find(p => p.id == id); // Buscamos el producto

    if (!pelicula) {
        return res.send("Pelicula no encontrada");
    }

    res.render('editar', { 
        title: 'Editar Pelicula', 
        pelicula: pelicula 
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
///////Metodo para eliminar
eliminar(req, res) {
    const id = req.params.id;
        const indice = peliculas.findIndex(p => p.id == id);

        if (indice !== -1) {
            peliculas.splice(indice, 1); // Remueve el elemento en esa posición
        }

        res.redirect('/');

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
    // Clonamos el array, lo invertimos y tomamos los primeros 5
    const ultimosCinco = [...peliculas].reverse().slice(0, 3);

    res.render('top5', { 
        title: 'Últimas 3 peliculas Agregadas', 
        lista: ultimosCinco 
    });
}
//////filtrodo de fechas de productos
filtrarPorRango(req, res) {
    {
        const { inicio, fin } = req.query;

        if (!inicio || !fin) {
            return res.render('filtros', { 
                title: 'Búsqueda por Rango de Fechas', 
                lista: [],
                busqueda: false
            });
        }

    
        const resultados = peliculas.filter(p => {
            return p.fecha >= inicio && p.fecha <= fin;
        });

        res.render('filtros', { 
            title: 'Resultados del Filtro', 
            lista: resultados,
            busqueda: true,
            rango: { inicio, fin }
        });
    }
}


}


module.exports = new cineController();