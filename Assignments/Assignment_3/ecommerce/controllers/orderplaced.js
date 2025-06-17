const express = require('express');
const router = express.Router();
const Order = require('../models/order'); 

router.post("/add-to-cart", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { title, price, quantity } = req.body;

  console.log("Add to cart data:", req.body); 

  try {
    const order = new Order({
      email: req.session.user.email,
      items: [{
        title,
        quantity: parseInt(quantity),
        price: parseFloat(price)
      }]
    });

    await order.save();
    console.log("Order saved successfully");
    console.log("Session in /add-to-cart:", req.session);


  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send("Error saving order");
  }
});

module.exports = router;
