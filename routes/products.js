const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/dataController');

// Obtener todos los productos
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let products = getProducts();
    
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    res.render('products', {
      title: 'Nuestros Productos - Pintumex',
      products: products,
      selectedCategory: category || 'todos'
    });
  } catch (error) {
    console.error('Error in products route:', error);
    res.status(500).render('error', { title: 'Error', message: 'Error cargando productos' });
  }
});

// Detalles del producto
router.get('/:id', (req, res) => {
  try {
    const product = getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).render('404', { title: 'Producto no encontrado' });
    }
    
    res.render('product-detail', {
      title: `${product.name} - Pintumex`,
      product: product
    });
  } catch (error) {
    console.error('Error in product detail route:', error);
    res.status(500).render('error', { title: 'Error', message: 'Error cargando el producto' });
  }
});

// API REST para obtener productos (para llamadas AJAX)
router.get('/api/all', (req, res) => {
  try {
    const products = getProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ success: false, message: 'Error cargando productos' });
  }
});

module.exports = router;
