const express = require('express');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// GET user cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart) return res.json({ products: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST add/update cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      // Update existing cart
      const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      cart = await cart.save();
      return res.json(cart);
    } else {
      // Create new cart
      const newCart = await Cart.create({
        user: req.user.id,
        products: [{ product: productId, quantity }]
      });
      return res.json(newCart);
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
