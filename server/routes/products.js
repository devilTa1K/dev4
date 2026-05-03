const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
