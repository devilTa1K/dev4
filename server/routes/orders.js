const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// GET user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST create order from cart
router.post('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    let totalAmount = 0;
    cart.products.forEach(p => {
      if (p.product) {
        totalAmount += p.product.price * p.quantity;
      }
    });

    const newOrder = new Order({
      user: req.user.id,
      products: cart.products,
      totalAmount
    });

    const order = await newOrder.save();

    // Clear cart after order
    cart.products = [];
    await cart.save();

    res.json(order);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
