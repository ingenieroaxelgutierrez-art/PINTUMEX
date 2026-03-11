const express = require('express');
const router = express.Router();

// Página de servicios
router.get('/', (req, res) => {
  res.render('services', { title: 'Servicios - Pintumex' });
});

module.exports = router;
