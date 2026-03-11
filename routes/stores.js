const express = require('express');
const router = express.Router();
const { getStores } = require('../controllers/dataController');

// Página de tiendas
router.get('/', (req, res) => {
  try {
    const stores = getStores();
    
    res.render('stores', {
      title: 'Nuestras Tiendas - Pintumex',
      stores: stores,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'
    });
  } catch (error) {
    console.error('Error in stores route:', error);
    res.status(500).render('error', { title: 'Error', message: 'Error cargando las tiendas' });
  }
});

// API para obtener tiendas
router.get('/api/all', (req, res) => {
  try {
    const stores = getStores();
    res.json({ success: true, data: stores });
  } catch (error) {
    console.error('Error in stores API:', error);
    res.status(500).json({ success: false, message: 'Error cargando tiendas' });
  }
});

module.exports = router;
