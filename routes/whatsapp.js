const express = require('express');
const router = express.Router();
const { sendWhatsAppMessage } = require('../controllers/whatsappController');

// Ruta para enviar un mensaje directo a WhatsApp
router.post('/send', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ success: false, message: 'Teléfono y mensaje requeridos' });
    }
    
    const result = await sendWhatsAppMessage(phone, message);
    res.json(result);
  } catch (error) {
    console.error('Error in WhatsApp route:', error);
    res.status(500).json({ success: false, message: 'Error enviando mensaje a WhatsApp' });
  }
});

module.exports = router;
