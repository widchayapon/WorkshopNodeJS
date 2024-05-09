const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id:{ type: Number , unique: true, required: true },
    product_name: { type: String },
    price: { type: Number },
    amount: { type: Number }
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
