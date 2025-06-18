const express = require('express');
const router = express.Router();
const Product = require('../models/productmodel');
const Order = require('../models/order'); 


const Complaint = require('../models/complaint');
router.get('/admindashboard', (req, res) => {

  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }
  
  if (req.session.user) {
    return res.redirect('/');
  }


  res.render('admindashboard');
});

router.get('/add-product', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }
  res.render('add-product', {error: null });
});

router.post('/add-product', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }

  try {
    const { imageUrl, title, price } = req.body;

    if (!imageUrl || !title || !price) {
      return res.render('add-product', {error: 'All fields are required' });
    }

    const product = new Product({ imageUrl, title, price });
    await product.save();
    res.redirect('/add-product');
  } catch (error) {
    console.error("Error adding product:", error);
  }
});

router.get('/manage-products', async (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }

  try {
    const products = await Product.find({});
    res.render('manage-products', {products});
  } catch (error) {
    console.error("Error loading products:", error);
  }
});

router.post('/delete-product/:id', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/manage-products');
  } catch (error) {
    console.error("Error deleting product:", error);
  }
});




router.get('/see-orders', async (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }

  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.render('see-orders', { layout: false, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
});


router.get('/edit-product/:id', async (req, res) => {

  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('edit-product', { layout: false, product, error: null });
  } catch (error) {
    console.error('Error loading product for edit:', error);
  }
});


router.post('/edit-product/:id', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }

  const { title, price } = req.body;

  if (!title || !price) {
    return res.render('edit-product', {
      layout: false,
      error: 'All fields are required',
      product: { _id: req.params.id, title, price }
    });
  }

  try {
    await Product.findByIdAndUpdate(req.params.id, { title, price });
    res.redirect('/manage-products');
  } catch (error) {
    console.error('Error updating product:', error);
  }
});


router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('products', { products });
  } catch (err) {
    console.error(err);
    res.render('products', { products: [] });
  }
});


router.get('/see-complaints', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/adminlogin');
  }

  try {
    const complaints = await Complaint.find({}).sort({ timestamp: -1 });

    res.render('see-complaints', {
      complaints,
      layout: false
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.send('Error loading complaints');
  }
});






module.exports = router;
