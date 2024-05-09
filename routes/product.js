var express = require('express');
var router = express.Router();
var multer = require('multer');
const productSchema = require('../models/products');
const ordersSchema = require('../models/orders');
const userSchema = require('../models/user');
/* ------- Config Upload file ------- */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '_' + file.originalname)
    }
  })
  const upload = multer({ storage: storage })


/* GET ALL Product */
router.get('/api/v1/products', async function(req, res, next) {
    try {
        let products = await productSchema.find();
        return res.status(200).send({
            data: products,
            message: '✅ Search All Product Success',
            success: true
        });
    } catch { 
        return res.status(500).send({
            message: "⛔ Search All Product Fail",
            success: false
        });
    }
  });
/* GET Product */
router.get('/api/v1/products/:id', async function(req, res, next) {
    try {
        const productId = req.params.id;
        const product = await productSchema.findById(productId);

        if (!product) {
            return res.status(404).send({
                message: '⛔ Product not found',
                success: false
            });
        }

        return res.status(200).send({
            data: product,
            message: '✅ Search Success',
            success: true
        });
    } catch { 
        return res.status(500).send({
            message: "⛔ Search Fail",
            success: false
        });
    }
});
/* Create order */
router.post('/api/v1/products/:id/orders', async function(req, res, next) {
  try {
      const productId = req.params.id;
      let {username ,order_name, quantity} = req.body;

      let product = await productSchema.findById(productId);
      let user = await userSchema.findOne({ username: username });


      if (!product) {
          return res.status(404).send({
              message: '⛔ Product not found',
              success: false
          });
      }
      if (!user){
        return res.status(404).send({
            message:'⛔ User Not Found',
            success: false
        })
      }
      if (product.amount <= 0) {
          return res.status(400).send({
              message: '⛔ Product out of stock',
              success: false
          });
      }if (quantity > product.amount) {
        return res.status(400).send({
            message: '⛔ Stock is not enough for Order',
            success: false
        });
    }
      let total = product.price * quantity;
      let order = new ordersSchema({
          product_id: productId,
          product_name: product.product_name,
          username: user.username,
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


/* แสดง order ทั้งหมดใน products */
router.get('/api/v1/products/:id/orders', async function(req, res, next) {
    try {
        const productId = req.params.id;
        const orders = await ordersSchema.find({ product_id: productId });

        if (!orders || orders.length === 0) {
            return res.status(404).send({
                message: '⛔ No orders found for this product',
                success: false
            });
        }

        return res.status(200).send({
            data: orders,
            message: '✅ Serach Success',
            success: true
        });
    } catch (error) {
        return res.status(500).send({
            message: '⛔ Serach Fail',
            success: false
        });
    }
});

/* Create Product */
router.post('/api/v1/products',upload.single('profile'), async function(req, res, next) {
    try {
        let {product_id,product_name, price, amount } = req.body
    
        let product = new productSchema({
          product_id,
          product_name,
          price,
          amount,
          file: req.file.filename
        })
    
        let create = await product.save()
        return res.status(201).send({
            data: create,
            message: '✅ Create Products Success',
            success: true,
        });
      } catch (error) {
        return res.status(500).send({
            message: '⛔ Create Products Fail',
            success: false,
        });
    }
});

/* Update Product */
router.put('/api/v1/products/:id',upload.single('profile'), async function(req, res, next) {
    try {
      let {product_id, product_name, price, amount } = req.body;
      
      let update = await productSchema.findByIdAndUpdate(
        req.params.id,{product_id, product_name, price, amount,file: req.file.filename },
      );
  
      return res.status(200).send({
        data: update,
        message: '✅ Update Product Success',
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        message: '⛔ Update Product Fail',
        success: false,
      });
    }
  });

/* Delete Product */
router.delete('/api/v1/products/:id', async function(req, res, next) {
    try {
      const productId = req.params.id;
      const deletedProduct = await productSchema.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).send({
          message: '⛔ Product not found',
          success: false,
        });
      }
  
      return res.status(200).send({
        data: deletedProduct,
        message: '✅ Deleted Product success',
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        message: '⛔ Deleted Product Fail',
        success: false,
      });
    }
});


module.exports = router;
