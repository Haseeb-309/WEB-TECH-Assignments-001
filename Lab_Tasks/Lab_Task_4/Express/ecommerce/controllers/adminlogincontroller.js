const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const admins = require('../models/adminmodel'); 


router.get("/adminlogin", (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render("adminlogin", { layout: false, error: null }); 
});


router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.render("adminlogin", {
        layout: false,
        error: "Please enter both email and password"
      });
    }

    
    const Admin = await admins.findOne({ email });

    if (!Admin) {
      return res.render("adminlogin", {
        layout: false,
        error: "User not found"
      });
    }

    
    const isMatch = await bcrypt.compare(password, Admin.password);

    if (!isMatch) {
      return res.render("adminlogin", {
        layout: false,
        error: "Invalid password"
      });
    }

    
    req.session.admin = {
      id: Admin._id,
      username: Admin.username,
      email: Admin.email,
      role: 'admin'
    };

    
    res.redirect('/admindashboard');

  } catch (error) {
    console.error('Error:', error);
    res.render("login", {
      layout: false,
      error: "Internal server error"
    });
  }
});


module.exports = router;
