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




// server.get("/my-orders", (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/login');
//   }

//   const sessionCart = req.session.cart || [];
//   res.render("my-orders", { sessionCart , layout: false }); 
// });

server.get("/my-orders", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const sessionCart = req.session.cart || [];

  
  const totalCost = sessionCart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  res.render("my-orders", { sessionCart, totalCost}); 
});



server.get("/", (req, res) =>{
    res.render("index");
});

// server.get("/products", (req, res) => {
//   res.render("products", { user: req.session.user , layout: true });
// });

server.get("/products", (req, res) => {
  res.render("products");
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