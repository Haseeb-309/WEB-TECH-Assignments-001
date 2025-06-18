const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/signup_models'); 

router.get("/signup", (req, res) =>{
    res.render("signup",{layout:false , error: null}); 
});


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post('/form', async (req, res) => {
  try {
    const { username, email, password, address, cardNumber } = req.body;


    if (!username || !email || !password || !address || !cardNumber) {
      return res.render('signup', {
        layout: false,
        error: 'Please enter all fields'
      });
    }

  
    if (!isValidEmail(email)) {
      return res.render('signup', {
        layout: false,
        error: 'Please enter a valid email address'
      });
    }

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('signup', {
        layout: false,
        error: 'User already exists with this email'
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
      cardNumber
    });

    await newUser.save();

    return res.redirect('/login');
  } catch (error) {
    console.error('Error during signup:', error);
    return res.render('signup', {
      layout: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});


module.exports = router;
