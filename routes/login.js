var express = require('express');
var router = express.Router();
const User = require('../models/user'); 
const ordersSchema = require('../models/orders');
const userSchema = require('../models/user');
var bcrypt = require('bcrypt');

/* POST login route. */
router.post('/api/v1/login', async function(req, res, next) {
    try {
        let { username, password } = req.body;
        const user = await userSchema.findOne({ username });
        const userOrders = await ordersSchema.find({ username: username });
        const checkPass = await bcrypt.compare(password, user.password);
        if (!user) {
            return res.status(404).send({
                message: '⛔ User not found',
                success: false
            });
        }
        if (!checkPass) {
            return res.status(401).send({
                message: 'Invalid password',
                success: false
            });
        }

        if (user.status == 0) {
            return res.status(404).send({
                message: '⛔ User not Active',
                success: false
            });
        }

        return res.status(200).send({
            data: user,
            order_data: userOrders,
            message: '✅ Login success',
            success: true
        });
    } catch (error) {
        return res.status(500).send({
            message: '⛔ Login fail',
            success: false
        });
    }
});

module.exports = router;
