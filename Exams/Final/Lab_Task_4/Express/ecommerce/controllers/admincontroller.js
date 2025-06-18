const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/adminmodel'); 

router.get("/adminregister", (req, res) =>{
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render("adminregister",{layout:false , error: null}); 
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post('/register-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check for missing fields
    if (!username || !email || !password) {
      return res.render('adminregister', {
        layout: false,
        error: 'Please enter all fields'
      });
    }

     if (!isValidEmail(email)) {
      return res.render('adminregister', {
        layout: false,
        error: 'Please enter a valid email address'
      });
    }

    // 2. Check for existing admin with same email
    const existingadmin = await Admin.findOne({ email });

    if (existingadmin) {
      return res.render('adminregister', {
        layout: false,
        error: 'Admin already exists with this email'
      });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create and save the new admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword
    });

    await admin.save();

    // 5. Redirect to admin login page
    res.redirect('/adminlogin');
  } catch (error) {
    console.error('Error:', error);
    res.render('adminregister', {
      layout: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;




