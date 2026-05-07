var productos = require('../base')

class ProductController {
///////Metodo para listar
    listar(req, res) {
        res.render('index', { 
            title: 'Panel de Control del Proyecto',
            lista: productos
        });
    }

///////Metodo para buscar obj especifico
//////Capturamos lo que el usuario escribio en el buscador
    buscarPorNombre(req, res) {
    const nombreBusqueda = req.query.nombre; 

///////Filtramos el array buscando coincidencias parciales
    const resultados = productos.filter(p => 
        p.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
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
        res.render('crear', { title: 'Añadir Nuevo Producto' });
    }

///////Procesar los datos y guardar 
    almacenar(req, res) {
        const { nombre, categoria } = req.body;
        const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

        const nuevoProducto = {
            id: nuevoId,
            nombre: nombre,
            categoria: categoria
        };

        productos.push(nuevoProducto);
        res.redirect('/');
    }

///////Metodo para editar
///////Mostrar el formulario con los datos actuales
    vistaEditar(req, res) {
    const id = req.params.id; // Capturamos el ID de la URL
    const producto = productos.find(p => p.id == id); // Buscamos el producto

    if (!producto) {
        return res.send("Producto no encontrado");
    }

    res.render('editar', { 
        title: 'Editar Producto', 
        producto: producto 
    });
}

///////Procesar el cambio
    actualizar(req, res) {
    const id = req.params.id;
    const { nombre, categoria } = req.body;

///////Buscamos el indice del producto en el array
    const indice = productos.findIndex(p => p.id == id);

    if (indice !== -1) {
///////Actualizamos los datos en esa posicion
        productos[indice].nombre = nombre;
        productos[indice].categoria = categoria;
    }

    res.redirect('/');
}

///////Metodo para eliminar
eliminar(req, res) {
    const id = req.params.id;
    productos = productos.filter(p => p.id != id);



    res.redirect('/');
}
}


module.exports = new ProductController();