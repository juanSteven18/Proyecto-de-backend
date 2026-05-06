var productos1 = require('../base')

class ProductController {
    // Metodo para listar
    listar(req, res) {
        res.render('index', { 
            title: 'Panel de Control del Proyecto',
            lista: productos1
        });
    }
}


module.exports = new ProductController();