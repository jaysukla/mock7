const mongoose = require('mongoose')
const connection = mongoose.connect('mongodb+srv://JayShukla:jayshukla@cluster0.9zippbx.mongodb.net/Mock7')


const User= mongoose.model('User',mongoose.Schema({
    name: String,
  email: String,
  password: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String
  }
}));


const Restaurant = mongoose.model('Restaurant',mongoose.Schema({
    
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String
  },
  menu: []
}));


const Order= mongoose.model('Order',mongoose.Schema({

   
    user : Object,
    restaurant :Object,
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  totalPrice: Number,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String
  },
  status: String 

}))






module.exports={connection,User,Order,Restaurant}