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

// API REST para obtener productos (para llamadas AJAX) — debe ir ANTES de /:id
router.get('/api/all', (req, res) => {
  try {
    const products = getProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ success: false, message: 'Error cargando productos' });
  }
});

// Detalles del producto
router.get('/:id', (req, res) => {
  try {
    const product = getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).render('404', { title: 'Producto no encontrado' });
    }

    // Si el producto no tiene colores, buscar uno de la misma familia de nombre
    let sharedColors = null;
    let colorSourceName = null;
    if (!product.colors || product.colors.length === 0) {
      const allProducts = getProducts();
      const firstWord = product.name.split(' ')[0].toUpperCase();
      const sibling = allProducts.find(p =>
        p.id !== product.id &&
        p.name.toUpperCase().startsWith(firstWord) &&
        p.colors && p.colors.length > 0
      );
      if (sibling) {
        sharedColors = sibling.colors;
        colorSourceName = sibling.name;
      }
    }
    
    res.render('product-detail', {
      title: `${product.name} - Pintumex`,
      product: product,
      sharedColors: sharedColors,
      colorSourceName: colorSourceName
    });
  } catch (error) {
    console.error('Error in product detail route:', error);
    res.status(500).render('error', { title: 'Error', message: 'Error cargando el producto' });
  }
});

module.exports = router;
