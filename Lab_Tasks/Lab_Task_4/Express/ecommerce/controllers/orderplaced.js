const express = require('express');
const router = express.Router();
const Order = require('../models/order'); 


router.post("/add-to-cart", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
    
  }

  const { title, price, quantity } = req.body;


  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  
  const existingItem = req.session.cart.find(item => item.title === title);

  if (existingItem) {
    
    existingItem.quantity += parseInt(quantity);
  } else {
    req.session.cart.push({
      title,
      quantity: parseInt(quantity),
      price: parseFloat(price)
    });
  }

  res.redirect("/products"); 
});




router.get("/my-orders", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const sessionCart = req.session.cart || [];
  const totalCost = sessionCart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);+

  res.render("my-orders", { sessionCart, totalCost}); 
});


router.post("/update-quantity", (req, res) => {
  const { title, quantity } = req.body;
  if (req.session.cart) {
    const item = req.session.cart.find(i => i.title === title);
    if (item) {
      item.quantity = parseInt(quantity);
    }
  }
  res.redirect("/my-orders");
});


router.post("/remove-item", (req, res) => {
  const { title } = req.body;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.title !== title);
  }
  res.redirect("/my-orders");
});


router.post("/place-order", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const cartItems = req.session.cart || [];

  if (cartItems.length === 0) {
    return res.redirect("/my-orders");
  }

  const totalCost = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  try {
  
    const newOrder = new Order({
      email: req.session.user.email,
      address: req.session.user.address, 
      items: cartItems,
      totalCost,
      createdAt: new Date()
    });

    await newOrder.save();


    req.session.cart = [];

    res.redirect("/orderconfirmed");
  } catch (error) {
    console.error("Error placing order:", error);

  }
});


router.get('/orderconfirmed', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const userOrders = await Order.find({ email: req.session.user.email }).sort({ createdAt: -1 });

    res.render('orderconfirmed', { orders: userOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
});

module.exports = router;