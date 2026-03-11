const fs = require('fs');
const path = require('path');

// Rutas de datos
const productsPath = path.join(__dirname, '../data/products.json');
const storesPath = path.join(__dirname, '../data/stores.json');

// Función para leer productos
function getProducts() {
  try {
    const data = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

// Función para obtener un producto por ID
function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === parseInt(id));
}

// Función para obtener tiendas
function getStores() {
  try {
    const data = fs.readFileSync(storesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stores:', error);
    return [];
  }
}

// Función para guardar una orden (simulado con JSON)
function saveOrder(order) {
  const ordersPath = path.join(__dirname, '../data/orders.json');
  try {
    let orders = [];
    if (fs.existsSync(ordersPath)) {
      const data = fs.readFileSync(ordersPath, 'utf-8');
      orders = JSON.parse(data);
    }
    orders.push({
      ...order,
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'pending'
    });
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
    return order;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

module.exports = {
  getProducts,
  getProductById,
  getStores,
  saveOrder
};
