const mongoose = require('mongoose');
const connect=mongoose.connect("mongodb://localhost:27017/Login");

connect.then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },    

    cardNumber: {
        type: String,
        required: true
    },

});

const collection = mongoose.model('Users', signupSchema);
module.exports = collection;