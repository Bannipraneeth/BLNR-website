const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const stream = require('stream');

// Cloudinary configuration via env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Local uploads serving removed: images stored in Cloudinary

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

// Helper to upload a buffer to Cloudinary
async function uploadBufferToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const readableStream = new stream.PassThrough();
    readableStream.end(fileBuffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder || 'blnr-ecommerce/products' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    readableStream.pipe(uploadStream);
  });
}

// Create a product (admin only)
router.post('/', auth, admin, upload.array('images', 5), async (req, res) => {
  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(f => uploadBufferToCloudinary(f.buffer, 'blnr-ecommerce/products'))
      );
      imageUrls = uploads.map(u => u.secure_url);
    }

    const productData = { ...req.body };
    if (imageUrls.length > 0) productData.images = imageUrls;

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Create product error:', error);
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
      const uploads = await Promise.all(
        req.files.map(f => uploadBufferToCloudinary(f.buffer, 'blnr-ecommerce/products'))
      );
      updateData.images = uploads.map(u => u.secure_url);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
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