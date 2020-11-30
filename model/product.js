const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_name:String,
    origin: String,
    price:String,
    kilograms: String,
    
});

const Product = mongoose.model('Product', productSchema)

module.exports = Product;