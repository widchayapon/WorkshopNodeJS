const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String}, 
  status: { type: Number, default: 0 } 
},{
    timestamps:true
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;