const express = require('express');
const router = express.Router();
const Order = require('../models/order'); 


router.get("/my-orders", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const userEmail = req.session.user.email;

    const order = await Order.findOne({ email: userEmail });

    res.render("order", {
      layout: false, 
      user: req.session.user,
      orderItems: order ? order.items : []
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Failed to fetch orders");
  }
});
