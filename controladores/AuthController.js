const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    //formulario de resgistro
    mostrarRegistro: (req, res) => {
        res.render('registro', { title: 'Registrar Usuario' });
    },

    //proceso de datos de resgistro
    registrar: async (req, res) => {
        try {
            const { nombre, email, password, rol } = req.body;

            //validacion de campos obligatorias
            if (!email || !password || !nombre) {
                return res.status(400).send("Faltan campos obligatorios: email y password.");
            }

            // Creamos el usuario
            await Usuario.create({
                nombre,
                email,
                password,
                membresiaId: 1,
                rol: rol || 'cliente'
            });

            //redirecciona luego de crear
            res.redirect('/login');
            
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).send("El correo ya se encuentra registrado.");
            }
            res.status(500).send("Error al registrar usuario: " + error.message);
        }
    },

    //formulario para login
    mostrarLogin: (req, res) => {
        res.render('login', { title: 'Iniciar Sesión' });
    },

    //inicio de seccion
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).send("Por favor, introduce tu correo y contraseña.");
            }

            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) {
                return res.status(401).send("El correo electronico no esta registrado.");
            }

            const contraseñaCorrecta = await bcrypt.compare(password, usuario.password);

            if (!contraseñaCorrecta) {
                return res.status(401).send("Contraseña incorrecta.");
            }

            
            
            const token = jwt.sign(
                { 
                    id: usuario.id, 
                    email: usuario.email, 
                    rol: usuario.rol 
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: '2h' } // El token vencera en 2 horas
            );

            
            res.cookie('token', token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 2 * 60 * 60 * 1000 
            });

            
            res.redirect('/'); 

        } catch (error) {
            res.status(500).send("Error en el servidor durante el login: " + error.message);
        }
    }

    
};