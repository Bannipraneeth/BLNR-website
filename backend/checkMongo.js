const mongoose = require('mongoose');
require('dotenv').config();

const checkMongoConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

checkMongoConnection(); 