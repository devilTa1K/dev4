const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const products = [
  {
    name: 'Neon Cyber Jacket',
    description: 'High-tech smart jacket with LED trimmings and active camouflage.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 50
  },
  {
    name: 'Quantum Sneakers',
    description: 'Anti-gravity sneakers that adapt to your running style.',
    price: 189.50,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 120
  },
  {
    name: 'Neural Link Headset',
    description: 'Direct brain-to-computer interface for ultimate gaming immersion.',
    price: 499.00,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 25
  },
  {
    name: 'Holo Watch Series X',
    description: 'Holographic display smartwatch with real-time health monitoring.',
    price: 349.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 200
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Database seeded!');
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
