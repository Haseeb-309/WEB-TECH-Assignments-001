const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/signup_models'); 


router.get("/login", (req, res) => {
    res.render("login", { layout: false });
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('User not found');
    }

   
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    res.redirect('/');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
