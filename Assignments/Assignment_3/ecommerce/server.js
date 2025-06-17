let express = require('express');
let mongoose = require("mongoose");
let expressLayouts = require('express-ejs-layouts');
let server = express();
let session = require('express-session');

server.use(session({
  secret: 'SecretKey123', // Change to env var in production
  resave: false,
  saveUninitialized: false
}));


server.use((req, res, next) => {
  res.locals.user = req.session.user || null;
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
const Order = require('./models/order'); 




server.get("/my-orders", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const orders = await Order.find({ email: req.session.user.email });
    res.render("my-orders", { orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Internal Server Error");
  }
});


server.get("/", (req, res) =>{
    res.render("index");
});

server.get("/products", (req, res) => {
  res.render("products", { user: req.session.user , layout: false });
});


server.get("/cv", (req, res) =>{
    res.render("index1",{layout:false});
});

server.get('/login', (req, res) => {
  res.render('login');
});

server.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/');
  });
});


server.listen(5000, () => {
    console.log('Server is running on port 5000');
});