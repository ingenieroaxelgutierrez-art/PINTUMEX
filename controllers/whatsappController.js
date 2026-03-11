// Función para crear enlace de WhatsApp con wa.me
function createWhatsAppLink(phoneNumber, message) {
  try {
    // Limpiar el número de teléfono (quitar espacios, guiones, paréntesis, etc.)
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    
    // Crear URL de WhatsApp con mensaje pre-llenado
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    return {
      success: true,
      url: whatsappUrl,
      message: 'Haz clic para abrir WhatsApp y enviar tu consulta'
    };
  } catch (error) {
    console.error('Error creating WhatsApp link:', error);
    return {
      success: false,
      message: 'Error al crear enlace de WhatsApp'
    };
  }
}

// Función para enviar mensaje a WhatsApp (retrocompatibilidad)
async function sendWhatsAppMessage(phoneNumber, message) {
  return createWhatsAppLink(phoneNumber, message);
}

// Función para obtener número de WhatsApp según sucursal
function getWhatsAppNumber(sucursalId = 1) {
  const numbers = {
    1: process.env.WHATSAPP_SUCURSAL_1 || '522222941010',
    2: process.env.WHATSAPP_SUCURSAL_2 || '522226907000'
  };
  return numbers[sucursalId] || process.env.WHATSAPP_PHONE_NUMBER || '522222941010';
}

// Función para generar mensaje de pedido
function generateOrderMessage(order) {
  let message = `🛒 *NUEVO PEDIDO PINTUMEX* 🛒\n\n`;
  message += `📋 *Número de Pedido:* ${order.id}\n`;
  message += `👤 *Cliente:* ${order.customerName}\n`;
  message += `📱 *Teléfono:* ${order.customerPhone}\n`;
  message += `📧 *Email:* ${order.customerEmail}\n`;
  message += `📍 *Dirección:* ${order.address}\n\n`;
  message += `*Productos:*\n`;
  
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    if (item.size) {
      message += `   Presentacion: ${item.size}\n`;
    }
    message += `   Cantidad: ${item.quantity}\n`;
    message += `   Precio: $${item.price.toFixed(2)}\n`;
    message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  message += `\n💰 *TOTAL: $${order.total.toFixed(2)}*\n`;
  message += `\n📝 *Notas:* ${order.notes || 'Sin notas adicionales'}\n`;
  message += `\n_Gracias por tu preferencia. Te enviaremos los datos para realizar el pago._`;
  
  return message;
}

// Función para generar mensaje de consulta de producto
function generateProductInquiry(product, customerName) {
  let message = `Hola, me interesa el siguiente producto:\n\n`;
  message += `🎨 *Producto:* ${product.name}\n`;
  message += `💰 *Precio:* $${product.price.toFixed(2)}\n`;
  if (product.code) {
    message += `🔢 *Código:* ${product.code}\n`;
  }
  message += `\n👤 *Mi nombre:* ${customerName}\n`;
  message += `\n¿Me pueden dar más información?`;
  
  return message;
}

module.exports = {
  sendWhatsAppMessage,
  createWhatsAppLink,
  getWhatsAppNumber,
  generateOrderMessage,
  generateProductInquiry
};
