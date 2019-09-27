const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  google_id: String,
  display_name: String,
  display_picture: String,
  email: String,
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
  }],
});

module.exports = mongoose.model('User', userSchema);
