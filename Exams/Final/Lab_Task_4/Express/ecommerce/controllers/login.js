const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/signup_models'); 
const { add } = require('lodash');

router.get("/login", (req, res) => {
  if (req.session.admin) {
    return res.redirect('/');
  }
  res.render("login", { layout: false, error: null });
});



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (req.session.user) {
      return res.render("login", {
        layout: false,
        error: "User already logged in, please logout first"
      });
    }


    if (!email || !password) {
      return res.render("login", {
        layout: false,
        error: "Please enter both email and password"
      });
    }


    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        layout: false,
        error: "User not found"
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", {
        layout: false,
        error: "Invalid password"
      });
    }

    
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      address: user.address
    };

    return res.redirect('/');
  } catch (error) {
    console.error('Error:', error);
    return res.render("login", {
      layout: false,
      error: "Internal server error"
    });
  }
});

module.exports = router;
