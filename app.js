require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { getStores } = require('./controllers/dataController');

const app = express();

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(session({
  secret: 'pintumex-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Inicializar carrito en sesión
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.locals.cart = req.session.cart;
  res.locals.cartCount = req.session.cart.length;
  next();
});

// Datos de tiendas disponibles en todas las vistas
app.use((req, res, next) => {
  const stores = getStores();
  res.locals.stores = stores;
  res.locals.primaryStore = stores[0];
  res.locals.secondaryStore = stores[1];
  next();
});

// Rutas
app.use('/', require('./routes/index'));
app.use('/productos', require('./routes/products'));
app.use('/carrito', require('./routes/cart'));

app.use('/servicios', require('./routes/services'));
app.use('/tiendas', require('./routes/stores'));
app.use('/whatsapp', require('./routes/whatsapp'));

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error del servidor',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Pintumex corriendo en http://localhost:${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
