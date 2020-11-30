const express = require('express');
const app = express();
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const flash = require('connect-flash');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const multer = require('multer');
const PORT = process.env.PORT;

//conect Data base
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_LINK);
const bodyParser = require('body-parser');
// setup body-parser
app.use(bodyParser.urlencoded({ extended: true }));
//model import
const Product = require('./model/product');
// connect DB
mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('DB connected') })
    .catch(err => console.log('DB not connected :' + err))

//setup a template engines
app.set('view engine', 'hbs');
//setup a static Folder
app.use(express.static(path.join(__dirname, 'public')));
//setup a session
app.use(session({
    secret: process.env.SESSION,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true
}));
//flash
app.use(flash());
//multer
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOADS)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
var upload = multer({ storage: storage })
//partials
hbs.registerPartials(__dirname + '/views/partials/');
app.get('/',(req,res)=>{
    res.render('index')
});
//GET
app.get('/created',(req,res)=>{
    res.render('index',{msg: req.flash('success')});
})
// POST
app.post("/createProduct",(req,res)=>{
console.log(req.body);
const newProduct= new Product(req.body);
newProduct.save(function(err,Product){
    if(err) return console.log('error');
    req.flash('success','your product is succesfully saved in DB!')
    res.redirect('/created')
})
})
app.post("/searchProducts",(req,res)=>{
  Product.find((err,data)=>{
      console.log(data)
  if(data){
      res.render('index',{product:data})
  }
  })
})
// app.post('/searchOrder',(req,res)=>{
//     Product.aggregate([],(err,data)=>{})
// })
app.post("/edit",(req,res)=>{
    console.log(req.body)
    Product.findByIdAndUpdate(req.body._id,req.body, (err, data) => {
        if (err) { console.log(err) }
        res.redirect('/')
        })
})




//listen
app.listen(PORT, () => {
    console.log(`********************* Server is Running at http://localhost:${PORT} *********************`);
});