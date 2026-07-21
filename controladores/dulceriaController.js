const models = require('../models');
const { Producto, Venta } = require('../models');
const VentaDulceria = models.VentaDulceria || models.VentasDulceria;

class dulceriaController { 

    //listar snacks
    async listar(req, res) {
        try {
            const { edit } = req.query; 

            const productos = await Producto.findAll();
            let productoAEditar = null;

            
            if (edit) {
                productoAEditar = await Producto.findByPk(edit);
            }

            res.render('dulceria', { 
                title: '🍿 Dulcería e Inventario', 
                productos,
                productoAEditar // Lo enviamos a la vista
            });
        } catch (error) {
            console.error("Error al cargar la dulcería:", error);
            res.status(500).send("Error interno en el servidor");
        }
    }

    //guardar nuevas 
    async guardar(req, res) {
        try {
            const { nombre, precio, stock, categoria } = req.body;
            await Producto.create({ nombre, precio, stock, categoria });
            res.redirect('/dulceria');
        } catch (error) {
            console.error("Error al crear producto:", error);
            res.status(500).send("Error al registrar el producto");
        }
    }

    //metodo de actualizacion
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, precio, stock, categoria } = req.body;
            await Producto.update({ nombre, precio, stock, categoria }, { where: { id } });
            res.redirect('/dulceria');
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).send("Error al actualizar el producto");
        }
    }

   //vender snacks
    async vender(req, res) {
        try {
            const { id } = req.params;
            const { cantidad, cliente } = req.body;
            
            const producto = await Producto.findByPk(id);

            if (!producto) {
                return res.status(404).send("Producto no encontrado");
            }

            const cantALevantar = parseInt(cantidad, 10);

            if (producto.stock < cantALevantar) {
                return res.status(400).send("No hay suficiente stock para realizar la venta");
            }

            //estar el stock
            producto.stock -= cantALevantar;
            await producto.save();

            //Calcular los montos
            const totalVenta = parseFloat(producto.precio) * cantALevantar;
            const nombreCliente = cliente && cliente.trim() !== '' ? cliente.trim() : 'Consumidor Final';

        

            await Venta.create({
                productoId: producto.id,
                cantidad: cantALevantar,
                cliente: nombreCliente,
                precioUnitario: producto.precio,
                total: totalVenta
            });

            res.redirect('/dulceria');
        } catch (error) {
            console.error("Error en la venta:", error);
            res.status(500).send("Error al procesar la venta");
        }
    }

    //eliminar
    async eliminar(req, res) {
        try {
            const { id } = req.params;
            await Producto.destroy({ where: { id } });
            res.redirect('/dulceria');
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).send("Error al borrar el producto");
        }
    }

    //historial de ventas
    async historial(req, res) {
        try {
            const ventas = await Venta.findAll({
                include: [
                    { model: Producto, as: 'producto' } 
                ],
                order: [['createdAt', 'DESC']] // Ventas más recientes primero
            });

            res.render('historialDulceria', {
                title: '📋 Historial de Ventas - Dulcería',
                ventas
            });
        } catch (error) {
            console.error("Error al obtener el historial de ventas:", error);
            res.status(500).send("Error interno al cargar el historial de ventas");
        }
    }

    //edicion de snacks
    async editarForm(req, res) {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);

            if (!producto) {
                return res.status(404).send("Producto no encontrado");
            }
          
            const productos = await Producto.findAll();
            res.render('dulceria', {
                title: '🍿 Editar Producto - Dulcería',
                productos,
                productoAEditar: producto
            });
            
        } catch (error) {
            console.error("Error al cargar el formulario de edición:", error);
            res.status(500).send("Error al cargar la información del producto");
        }
    }
}

module.exports = new dulceriaController();