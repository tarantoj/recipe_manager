const mongoose = require('mongoose');

const ingredientSchema = require('./ingredient');

const userSchema = mongoose.Schema({
  google_id: String,
  display_name: String,
  display_picture: String,
  email: String,
  pantry: [ingredientSchema],
  shopping_list: [ingredientSchema],
});

module.exports = mongoose.model('User', userSchema);
