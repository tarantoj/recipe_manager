const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  google_id: String,
  display_name: String,
  display_picture: String,
  email: String,
  shopping_list: [String],
});

module.exports = mongoose.model('User', userSchema);