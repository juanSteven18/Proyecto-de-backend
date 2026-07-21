const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); 
module.exports = {
    verificarToken: async (req, res, next) => { 
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        }

        try {
            const deconstruido = jwt.verify(token, process.env.JWT_SECRET);
            
            
            const usuarioCompleto = await Usuario.findByPk(deconstruido.id);
            
            if (!usuarioCompleto) {
                res.clearCookie('token');
                return res.redirect('/login');
            }

            req.user = usuarioCompleto;
            res.locals.user = usuarioCompleto; 
            next(); 
        } catch (error) {
            res.clearCookie('token');
            return res.redirect('/login');
        }
    },

    cargarUsuarioOpcional: async (req, res, next) => { 
        const token = req.cookies.token;
        if (token) {
            try {
                const deconstruido = jwt.verify(token, process.env.JWT_SECRET);
                const usuarioCompleto = await Usuario.findByPk(deconstruido.id);
                
                if (usuarioCompleto) {
                    req.user = usuarioCompleto;
                    res.locals.user = usuarioCompleto;
                }
            } catch (error) {
                res.clearCookie('token');
            }
        }
        next(); 
    },

    restringirA: (...rolesPermitidos) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.redirect('/login');
            }
            if (!rolesPermitidos.includes(req.user.rol)) {
                return res.status(403).send("Acceso denegado: No tienes los permisos de rol requeridos");
            }

            next(); 
        };
    }
};