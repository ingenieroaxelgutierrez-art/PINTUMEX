const express = require('express');
const router = express.Router();
const { getProducts, getStores } = require('../controllers/dataController');

// Página de inicio
router.get('/', (req, res) => {
  try {
    const products = getProducts();
    const stores = getStores();
    const featuredProducts = products.slice(0, 6);
    
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
  
  // Guardar mensaje en un archivo JSON simple
  const fs = require('fs');
  const path = require('path');
  const messagesPath = path.join(__dirname, '../data/messages.json');
  
  try {
    let messages = [];
    if (fs.existsSync(messagesPath)) {
      const data = fs.readFileSync(messagesPath, 'utf-8');
      messages = JSON.parse(data);
    }
    
    messages.push({
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString()
    });
    
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
    
    res.redirect('/?message=Gracias%20por%20tu%20mensaje');
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
