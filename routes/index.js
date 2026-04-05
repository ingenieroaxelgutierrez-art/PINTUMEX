const express = require('express');
const router = express.Router();
const { getProducts, getStores } = require('../controllers/dataController');

// Página de inicio
router.get('/', (req, res) => {
  try {
    const products = getProducts();
    const stores = getStores();
    const featuredProducts = products.filter(p => p.featured === true).slice(0, 6);
    
    res.render('index', {
      title: 'Pintumex - Materiales de Pintura Profesionales',
      description: 'Venta de pinturas, accesorios y herramientas para profesionales',
      products: featuredProducts,
      stores: stores,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'
    });
  } catch (error) {
    console.error('Error in index route:', error);
    res.status(500).render('error', { title: 'Error', message: 'Error cargando la página' });
  }
});

// Página de contacto
router.get('/contacto', (req, res) => {
  res.render('contact', { title: 'Contacto - Pintumex' });
});

router.post('/contacto', (req, res) => {
  const { name, email, message } = req.body;

  // Validación server-side
  const nameClean    = (name    || '').toString().trim();
  const emailClean   = (email   || '').toString().trim().toLowerCase();
  const messageClean = (message || '').toString().trim();

  if (!nameClean || nameClean.length < 2 || nameClean.length > 100) {
    return res.status(400).render('contact', {
      title: 'Contacto - Pintumex',
      error: 'El nombre debe tener entre 2 y 100 caracteres.'
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailClean)) {
    return res.status(400).render('contact', {
      title: 'Contacto - Pintumex',
      error: 'Por favor ingresa un correo electrónico válido.'
    });
  }
  if (!messageClean || messageClean.length < 10 || messageClean.length > 2000) {
    return res.status(400).render('contact', {
      title: 'Contacto - Pintumex',
      error: 'El mensaje debe tener entre 10 y 2000 caracteres.'
    });
  }

  const fs   = require('fs');
  const path = require('path');
  const messagesPath = path.join(__dirname, '../data/messages.json');

  try {
    let messages = [];
    if (fs.existsSync(messagesPath)) {
      const data = fs.readFileSync(messagesPath, 'utf-8');
      messages = JSON.parse(data);
    }
    messages.push({
      id:      Date.now(),
      name:    nameClean,
      email:   emailClean,
      message: messageClean,
      date:    new Date().toISOString()
    });
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
    res.redirect('/?message=Gracias%20por%20tu%20mensaje.%20Te%20contactaremos%20pronto');
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).render('error', { title: 'Error', message: 'Error guardando el mensaje' });
  }
});

// Página de about
router.get('/acerca-de', (req, res) => {
  res.render('about', { title: 'Acerca de Pintumex' });
});

// Términos y Condiciones
router.get('/terminos', (req, res) => {
  res.render('terminos', { title: 'Términos y Condiciones - Pintumex' });
});

// Política de Privacidad
router.get('/privacidad', (req, res) => {
  res.render('privacidad', { title: 'Política de Privacidad - Pintumex' });
});

module.exports = router;
