const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const path = require('path');

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Get all products
router.get('/', async (req, res) => {
  try {
    console.time('fetchProducts');
    const products = await Product.find().sort({ createdAt: -1 });
    console.timeEnd('fetchProducts');
    
    res.json({
      products,
      currentPage: 1,
      totalPages: 1,
      totalProducts: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching single product:', error);
    res.status(500).json({ 
      message: 'Error fetching product',
      error: error.message 
    });
  }
});

// Create a product (admin only)
router.post('/', auth, admin, upload.array('images', 5), async (req, res) => {
  try {
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    const productData = {
      ...req.body,
      images: imagePaths
    };
    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product (admin only)
router.put('/:id', auth, admin, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = newImagePaths;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 