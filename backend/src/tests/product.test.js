const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/blnr-test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('Product API', () => {
  const testProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'Test Category',
    images: ['test-image.jpg'],
    stock: 10
  };

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(testProduct)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(testProduct.name);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create(testProduct);
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBe(1);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Test Category')
        .expect(200);

      expect(response.body.products.length).toBe(1);
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create(testProduct);
      productId = product._id;
    });

    it('should get a product by id', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.name).toBe(testProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);
    });
  });
}); 