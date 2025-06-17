const Order = require('../models/order');
const express = require('express');
const router = express.Router();

router.post("/add-to-cart", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { title, price, quantity } = req.body;

  const order = new Order({
    userEmail: req.session.user.email,
    items: [{
      title,
      quantity: parseInt(quantity),
      price: parseFloat(price)
    }]
  });

  try {
    await order.save();
    res.redirect("/my-orders");
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).send("Could not save order.");
  }
});

module.exports = router;
