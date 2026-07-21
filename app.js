//npx nodemon ./bin/www
require('dotenv').config();
const db = require('./models');
var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const authMiddleware = require('./middlewares/authMiddleware'); 


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authMiddleware.cargarUsuarioOpcional);

db.Membresia.findOrCreate({
  where: { id: 1 },
  defaults: { nombre: 'Sin Membresía' }
}).then(() => {
  console.log("Membresía inicial verificada correctamente.");
}).catch(err => {
  console.error("Error al crear la membresía inicial:", err);
});

app.use((req, res, next) => {
 
    if (req.user) {
        res.locals.user = req.user;
    } else {
        res.locals.user = null;
    }
    next();
})


app.use('/', indexRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
