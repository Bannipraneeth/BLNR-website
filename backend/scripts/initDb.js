const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const initializeDb = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Created admin user');

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });
    console.log('Created regular user');

    // Create sample products
    const products = await Product.create([
      {
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced features',
        price: 699.99,
        image: 'https://example.com/smartphone.jpg',
        category: 'Electronics',
        stock: 50
      },
      {
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        image: 'https://example.com/laptop.jpg',
        category: 'Electronics',
        stock: 30
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling headphones',
        price: 199.99,
        image: 'https://example.com/headphones.jpg',
        category: 'Electronics',
        stock: 100
      }
    ]);
    console.log('Created sample products');

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDb(); 