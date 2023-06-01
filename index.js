const express = require('express');
const {connection,User,Order,Restaurant} = require('./model/model')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json())


app.get('/',(req,res)=>{
    res.send({"msg":"Api is Active"})
})



// Route for user registration
app.post('/api/register', (req, res) => {
let {name,email,password,address}=req.body;
  bcrypt.hash(password, 5, function(err, hash) {
 User.insertMany([{name,email,'password':hash,address}])

});

  res.status(201).send('User registered successfully.');
});

// Route for user login
app.post('/api/login',async (req, res) => {

let {email,password} = req.body;
let d= await User.find({email});
let hash =d[0].password;

bcrypt.compare(password, hash, function(err, result) {
 
if(result==true){
  var token = jwt.sign({}, 'shhhhh');
  res.status(201).send({"msg":"login succes","token":token});
}

});

 
});

// Route for resetting user password
app.put('/api/user/:id/reset',async (req, res) => {
  const userId = req.params.id;
let {curr_password,new_password} = req.body;

let d= await User.findById(userId)

bcrypt.compare(curr_password, d.password, function(err, result) {
 
  if(result==true){
 
    bcrypt.hash(new_password, 5, async function(err, hash) {
     
      let D = await User.findByIdAndUpdate(userId,{'password':hash})
      console.log(D)
    
     
     });

     res.status(204).send({"msg":"Updated"})

  }else{
    res.send({"msg":"wrong pasword"})
  }
  
 
  });







});








// Route for retrieving all restaurants
app.get('/api/restaurants', async (req, res) => {
  
  let restaurants = await Restaurant.find()

  res.status(200).json(restaurants);
});

// Route for retrieving a specific restaurant
app.get('/api/restaurants/:id',async (req, res) => {
  const restaurantId = req.params.id;

let restorent = await Restaurant.findById(restaurantId)

  res.status(200).json(restaurant);
});

// Route for retrieving the menu of a specific restaurant
app.get('/api/restaurants/:id/menu', async (req, res) => {
  const restaurantId = req.params.id;
  
  let restorent = await Restaurant.findById(restaurantId)
  
  let menu = restorent.menu;

  res.status(200).json(menu);
});




app.post('/api/restaurants', async (req, res) => {
  let data = req.body;

  let restaurants = await Restaurant.insertMany([data])

  res.status(200).json(restaurants);
});




// Route for adding a new item to a restaurant's menu
app.post('/api/restaurants/:id/menu', async (req, res) => {
  const restaurantId = req.params.id;
 let data=req.body;
let R= await Restaurant.findById(restaurantId)
console.log(R)
// let item = await Menu.insertMany([data])

R.menu.push(data)

let l= await Restaurant.findByIdAndUpdate(restaurantId,R)


  res.status(201).send('Menu item added successfully.');
});

// Route for deleting a menu item from a restaurant
app.delete('/api/restaurants/:id/menu/:itemId', async (req, res) => {
  const restaurantId = req.params.id;
  const itemId = req.params.itemId;
  
let R = await Restaurant.findById(restaurantId)

console.log(R.menu[1]._id)

for(let i=0;i<(R.menu).length;i++){
if(itemId==(R.menu)[i]._id){
  (R.menu).splice(i,1)
  break;
}

}

let l= await Restaurant.findByIdAndUpdate(restaurantId,R)

  res.status(202).send('Menu item deleted successfully.');
});

// Route for placing an order
app.post('/api/orders', async (req, res) => {
  let data= req.body;

 let d = await Order.insertMany([data])
console.log(d)
  res.status(201).send('Order placed successfully.');
});

// Route for retrieving a specific order
app.get('/api/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  
  let order= await Order.findById(orderId) ;

  res.status(200).json(order);
});

// Route for updating the status of an order
app.put('/api/orders/:id', async (req, res) => {
  const orderId = req.params.id;
let data = req.body ;

let D= await Order.findByIdAndUpdate(orderId,data)
console.log(D)
  res.status(204).send();
});



app.listen(8000,()=>{
try {
    connection;
    console.log("DB ,connection pass")

} catch (error) {
    console.log("db connection fail ", error)
}

    console.log("Running on port 8000")
})
