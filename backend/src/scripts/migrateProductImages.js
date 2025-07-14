const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  images: [String],
  stock: Number,
  createdAt: Date
});

const Product = mongoose.model('Product', productSchema);

async function migrateProductImages() {
  try {
    // Find all products that have 'image' but no 'images' array
    const products = await Product.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } }
      ],
      image: { $exists: true, $ne: null }
    });

    console.log(`Found ${products.length} products to migrate`);

    // Update each product
    for (const product of products) {
      const update = {
        $set: {
          images: [product.image]
        }
      };

      await Product.updateOne({ _id: product._id }, update);
      console.log(`Migrated product: ${product.name}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.disconnect();
  }
}

migrateProductImages(); 