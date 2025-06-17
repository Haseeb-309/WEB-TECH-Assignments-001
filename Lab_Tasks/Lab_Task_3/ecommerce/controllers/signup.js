const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/signup_models'); 

router.get("/signup", (req, res) =>{
    res.render("signup",{layout:false});
});


router.post('/form', async (req, res) => {
  try {
    console.log("Password before hashing:", req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("Hashed password:", hashedPassword);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address,
      cardNumber: req.body.cardNumber,
    });

    await user.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
