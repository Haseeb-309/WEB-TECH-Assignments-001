const mongoose = require("mongoose");
const connect=mongoose.connect("mongodb://localhost:27017/Login");

connect.then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});


const orderSchema = new mongoose.Schema({
  email: String,
  address: String, 
  items: [
    {
      title: String,
      quantity: Number,
      price: Number
    }
  ],
  totalCost: Number, 
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model("Order", orderSchema);

