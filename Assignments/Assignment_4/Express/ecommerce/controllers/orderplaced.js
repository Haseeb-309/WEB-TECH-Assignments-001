const express = require('express');
const router = express.Router();
const Order = require('../models/order'); 

// router.post("/add-to-cart", (req, res) => {
//   if (!req.session.user) {
//     return res.redirect("/login");
//   }

//   const { title, price, quantity } = req.body;

//   // Create cart array if not present
//   if (!req.session.cart) {
//     req.session.cart = [];
//   }

  
//   req.session.cart.push({
//     title,
//     quantity: parseInt(quantity),
//     price: parseFloat(price)
//   });

//   res.redirect("/my-orders");
// });

router.post("/add-to-cart", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { title, price, quantity } = req.body;

  // Create cart array if not present
  if (!req.session.cart) {
    req.session.cart = [];
  }

  // Check if the item already exists in the cart
  const existingItem = req.session.cart.find(item => item.title === title);

  if (existingItem) {
    // If item exists, increase its quantity
    existingItem.quantity += parseInt(quantity);
  } else {
    // If item doesn't exist, add it to cart
    req.session.cart.push({
      title,
      quantity: parseInt(quantity),
      price: parseFloat(price)
    });
  }

  res.redirect("/products"); 
});


// Update item quantity
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

// Remove item from cart
router.post("/remove-item", (req, res) => {
  const { title } = req.body;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.title !== title);
  }
  res.redirect("/my-orders");
});



// router.post("/place-order", async (req, res) => {
//   if (!req.session.user) {
//     return res.redirect("/login");
//   }

//   const cartItems = req.session.cart || [];

//   if (cartItems.length === 0) {
//     return res.redirect("/my-orders"); // Nothing to place
//   }

//   try {
//     const order = new Order({
//       email: req.session.user.email,
//       items: cartItems
//     });

//     await order.save();

//     // Clear cart
//     req.session.cart = [];

//     res.redirect("/my-orders");
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).send("Failed to place order");
//   }
// });

router.post("/place-order", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const cartItems = req.session.cart || [];

  if (cartItems.length === 0) {
    return res.redirect("/my-orders");
  }

  try {
    await Order.findOneAndUpdate(
      { email: req.session.user.email }, 
      {
        $push: { items: { $each: cartItems } }, 
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true, new: true }
    );

    req.session.cart = []; // Clear cart
    res.redirect("/my-orders");
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send("Failed to place order");
  }
});


module.exports = router;


