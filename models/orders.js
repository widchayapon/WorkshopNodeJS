const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username:{ type: String },
    order_name: { type: String },
    product_id:{type: String},
    product_name: { type: String }, 
    price: { type: Number }, 
    quantity: { type: Number },
    total: { type: Number },
    
});

const ordersModel = mongoose.model('orders', orderSchema);

module.exports = ordersModel;