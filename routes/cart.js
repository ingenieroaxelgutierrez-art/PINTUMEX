const express = require('express');
const router = express.Router();
const { getProductById, saveOrder } = require('../controllers/dataController');
const { sendWhatsAppMessage, generateOrderMessage } = require('../controllers/whatsappController');

// Ver carrito
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  let total = 0;
  
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  
  res.render('cart', {
    title: 'Carrito de Compras - Pintumex',
    cartItems: cart,
    total: total.toFixed(2)
  });
});

// Agregar producto al carrito
router.post('/add', (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;
    const product = getProductById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    const cart = req.session.cart || [];
    const normalizedSize  = size  ? String(size)  : null;
    const normalizedColor = color ? String(color) : null;
    let finalPrice = product.price;

    if (normalizedSize && Array.isArray(product.sizes)) {
      const sizeMatch = product.sizes.find(item => item.size === normalizedSize);
      if (sizeMatch && typeof sizeMatch.price === 'number') {
        finalPrice = sizeMatch.price;
      }
    }

    const existingItem = cart.find(
      item => item.id === parseInt(productId) &&
               item.size  === normalizedSize  &&
               item.color === normalizedColor
    );
    
    if (existingItem) {
      existingItem.quantity += parseInt(quantity) || 1;
    } else {
      cart.push({
        id:       product.id,
        name:     product.name,
        code:     product.code,
        price:    finalPrice,
        image:    product.image,
        size:     normalizedSize,
        color:    normalizedColor,
        quantity: parseInt(quantity) || 1
      });
    }
    
    req.session.cart = cart;
    res.json({ 
      success: true, 
      message: 'Producto agregado al carrito',
      cartCount: cart.length
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Error agregando el producto' });
  }
});

// Eliminar producto del carrito
router.post('/remove/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const cart = req.session.cart || [];
    
    req.session.cart = cart.filter(item => item.id !== productId);
    
    res.json({ 
      success: true, 
      message: 'Producto eliminado',
      cartCount: req.session.cart.length
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Error eliminando el producto' });
  }
});

// Actualizar cantidad
router.post('/update/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const quantity = parseInt(req.body.quantity);
    const cart = req.session.cart || [];
    
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity > 0 ? quantity : 1;
    }
    
    req.session.cart = cart;
    
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
    });
    
    res.json({ 
      success: true, 
      message: 'Cantidad actualizada',
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Error actualizando cantidad' });
  }
});

// Procesar checkout
router.post('/checkout', (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, address, notes } = req.body;
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
      return res.status(400).json({ success: false, message: 'El carrito está vacío' });
    }
    
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
    });
    
    const order = {
      customerName,
      customerEmail,
      customerPhone,
      address,
      notes,
      items: cart,
      total: total
    };
    
    // Guardar la orden
    const savedOrder = saveOrder(order);
    
    // Generar mensaje para WhatsApp
    const whatsappMessage = generateOrderMessage({
      ...savedOrder,
      id: savedOrder.id
    });

    // Crear enlace de WhatsApp usando el número configurado
    const whatsappNumber = (process.env.WHATSAPP_SUCURSAL_1 || '522212131403').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Limpiar carrito
    req.session.cart = [];
    
    res.json({
      success: true,
      message: 'Pedido creado exitosamente',
      orderId: savedOrder.id,
      whatsappUrl: whatsappUrl,
      whatsappMessage: 'Presiona aquí para confirmar tu pedido en WhatsApp'
    });
  } catch (error) {
    console.error('Error in checkout:', error);
    res.status(500).json({ success: false, message: 'Error procesando el pedido' });
  }
});

// Vaciar carrito
router.post('/clear', (req, res) => {
  req.session.cart = [];
  res.json({ success: true, message: 'Carrito vaciado' });
});

module.exports = router;
