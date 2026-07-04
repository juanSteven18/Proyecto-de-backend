const jwt = require('jsonwebtoken');

module.exports = {
    //bloqueo de ruta si el users no ha iniciado sesion
    verificarToken: (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            // Si no hay token lo redirigimos directo al login
            return res.redirect('/login');
        }

        try {
            const deconstruido = jwt.verify(token, process.env.JWT_SECRET);
            
            
            req.user = deconstruido;
            
            
            res.locals.user = deconstruido;

            next(); 
        } catch (error) {
            
            res.clearCookie('token');
            return res.redirect('/login');
        }
    },

    //no bloquea la ruta pero si el usuario esta logueado carga su perfil
    cargarUsuarioOpcional: (req, res, next) => {
        const token = req.cookies.token;
        if (token) {
            try {
                const deconstruido = jwt.verify(token, process.env.JWT_SECRET);
                req.user = deconstruido;
                res.locals.user = deconstruido;
            } catch (error) {
                res.clearCookie('token');
            }
        }
        next(); 
    },

    //comprueba si el rol del usuario coincide con los permitidos
    restringirA: (...rolesPermitidos) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.redirect('/login');
            }

            
            if (!rolesPermitidos.includes(req.user.rol)) {
                return res.status(403).send("Acceso denegado: No tienes los permisos de rol requeridos para esta seccion");           }

            next(); 
        };
    }
};