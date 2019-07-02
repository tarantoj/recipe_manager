var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RecipeSchema = new Schema({
    title: {type: String, required: true, max: 100},
    author: String,
    method: {type: [String], required: true},
    ingredients: {type: [String], require: true},
    serves: Number

});

RecipeSchema
.virtual('url')
.get(function () {
  return `/cookbook/recipe/${this._id}`;
});

module.exports = mongoose.model('Recipe', RecipeSchema);