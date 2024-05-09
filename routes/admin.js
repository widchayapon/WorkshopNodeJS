const express = require('express');
const router = express.Router();
const User = require('../models/user');
var bcrypt = require('bcrypt');

const authenticateAdminToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token === "admin") {
    return next();
  } else {

    return res.status(401).send({
      message: '⛔ Unauthorized',
      success: false
    });
  }
};

router.put('/api/v1/approve/:id', authenticateAdminToken, async function(req, res, next) {
  try {
    const userId = req.params.id;
    const { username, password, status } = req.body;
    let hashPass = await bcrypt.hash(password, 4);
    const updatedUser = await User.findByIdAndUpdate(userId, { username, password: hashPass, status }, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ 
        message: '⛔ User not found', 
        success: false });
    }

    return res.status(200).send({
      data: updatedUser,
      message: '✅ User updated successfully',
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: '⛔ Failed to update user',
      success: false,
    });
  }
});



module.exports = router;
