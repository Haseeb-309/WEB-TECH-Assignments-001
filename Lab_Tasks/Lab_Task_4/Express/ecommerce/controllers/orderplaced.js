const express = require('express');
const router = express.Router();
const Order = require('../models/order'); 
const Complaint = require('../models/complaint');
const mongoose = require('mongoose');
const User = require('../models/signup_models'); 



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

  const generateOrderId = () => {
  return 'ORD-' + Math.floor(100000 + Math.random() * 900000); 
};

  try {
  
    const newOrder = new Order({
      orderId: generateOrderId(),
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

router.get('/contact-us', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('contact-us', { layout: false, error: null, success: null }); 
});


router.post('/submit-complaint', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { orderId, message } = req.body;

  if (!orderId || !message) {
    return res.render('contact-us', { error: 'Please fill all fields.', success: null });
  }

  try {
    
    const user = await User.findOne({ email: req.session.user.email });

    if (!user) {
      return res.render('contact-us', { error: 'User not found.', success: null });
    }

    const newComplaint = new Complaint({
      userId: user._id,
      orderId,
      message
    });

    await newComplaint.save();

    res.render('contact-us', { success: 'Complaint submitted successfully!', error: null });

  } catch (error) {
    console.error('Error submitting complaint:', error.message, error);
    res.render('contact-us', { error: 'Error submitting complaint.', success: null });
  }
});




router.get('/my-complaints', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const complaints = await Complaint.find({ userId: req.session.user.id }).sort({ timestamp: -1 });
    res.render('my-complaints', { complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.send('Error loading complaints');
  }
});






module.exports = router;