var express = require('express');
var router = express.Router();
var userSchema = require('../models/user')
var bcrypt = require('bcrypt');
/* register home page. */
router.post('/api/v1/register', async function(req, res, next) {
    try {
        let { username, password } = req.body
        let hashPass = await bcrypt.hash(password,4);
        let user = new userSchema({
          username,
          password: hashPass,
          status: 0 
        })
    
        let register = await user.save()
        return res.status(201).send({
            data: register,
            message: '✅ Register Success',
            success: true,
        });
      } catch (error) {
        return res.status(500).send({
            message: '⛔ Register Fail',
            success: false,
        });
    }
});


module.exports = router;
