var express = require('express');
var router = express.Router();
const ordersSchema = require('../models/orders');
const productSchema = require('../models/products');

/* GET order */
router.get('/api/v1/orders', async function(req, res, next) {
    try {
        let orders = await ordersSchema.find();
        return res.status(200).send({
            data: orders,
            message: '✅ Search Orders Success',
            success: true
        });
    } catch { 
        return res.status(500).send({
            message: "⛔ Server Error",
            success: false
        });
    }
  });
/* Create order */
router.post('/api/v1/orders', async function(req, res, next) {
    try {
        let {order_name, product_id, quantity} = req.body;

        let product = await productSchema.findOne({ product_id: product_id });
        if (!product) {
            return res.status(404).send({
                message: '⛔ Product not found',
                success: false
            });
        }
        if (product.amount <= 0) {
            return res.status(400).send({
                message: '⛔ Product out of stock',
                success: false
            });
        }
        let total = product.price * quantity;

        let order = new ordersSchema({
            product_name:product.product_name,
            product_id: product.product_id,
            order_name,
            price: product.price,
            quantity,
            total
        });
        let createOrder = await order.save();
        product.amount -= quantity;
        await product.save();

        return res.status(201).send({
            data: createOrder,
            message: '✅ Create Order Success',
            success: true,
        });
    } catch (error) {
        return res.status(500).send({
            message: '⛔ Create Order Fail',
            success: false,
        });
    }
});


/* Update orders */
router.put('/api/v1/orders/:id', async function(req, res, next) {
    try {
      let { order_name, price, amount ,total} = req.body;
      
      let update = await ordersSchema.findByIdAndUpdate(
        req.params.id,
        { order_name, price, amount ,total},
        { new: true }
      );
  
      return res.status(200).send({
        data: update,
        message: '✅ Update Orders Success',
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        message: '⛔ Update Orders Fail',
        success: false,
      });
    }
  });
/* Delete orders */
router.delete('/api/v1/orders/:id', async function(req, res, next) {
    try {
      const ordersid = req.params.id;
      const deletedOrders = await ordersSchema.findByIdAndDelete(ordersid);
  
      if (!deletedOrders) {
        return res.status(404).send({
          message: '⛔ Product not found',
          success: false,
        });
      }
  
      return res.status(200).send({
        data: deletedOrders,
        message: '✅ Delete orders success',
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        message: '⛔ Delete orders Fail',
        success: false,
      });
    }
  });

module.exports = router;
