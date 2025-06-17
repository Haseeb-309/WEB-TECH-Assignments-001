let express = require('express');
let mongoose = require("mongoose");
let expressLayouts = require('express-ejs-layouts');
let server = express();
let session = require('express-session');

server.use(session({
  secret: 'SecretKey123', 
  resave: false,
  saveUninitialized: false
}));


server.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.admin = req.session.admin || null;
  next();
});

server.use(expressLayouts);
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(express.static("public"));
server.use(expressLayouts);
server.use("/", require("./controllers/signup"));
server.use("/", require("./controllers/login"));
server.use("/", require("./controllers/orderplaced"));
server.use("/", require("./controllers/admincontroller"));
server.use("/", require("./controllers/adminlogincontroller"));
server.use("/", require("./controllers/adminproductcontroller"));
const Product = require('./models/productmodel');


server.get("/", async (req, res) => {
    console.log("Session user:", req.session.user);
    console.log("Session admin:", req.session.admin);

    try {
        const products = await Product.find({});
        res.render("index", { products });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.render("index", { products: [] });
    }
});



server.get("/cv", (req, res) =>{
    res.render("index1",{layout:false});
});


server.get('/logout', (req, res) => {

  if (req.session.user) {
    delete req.session.user;
  }
  res.redirect('/');
});
server.get('/admin-logout', (req, res) => {
  if (req.session.admin) {
    delete req.session.admin;
  }
  res.redirect('/');
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});

