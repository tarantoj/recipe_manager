const mongoose = require('mongoose');

const { Schema } = mongoose;

const RecipeSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  author: String,
  description: String,
  method: { type: [String], required: true },
  ingredients: { type: [String], require: true },
  serves: Number,
  prepTime: Number,
  cookTime: Number,
});

RecipeSchema
  .virtual('url')
  .get(function url() {
    return `/cookbook/recipe/${this.id}`;
  });

RecipeSchema
  .virtual('totalTime')
  .get(function totalTime() {
    return (this.prepTime + this.cookTime);
  });

module.exports = mongoose.model('Recipe', RecipeSchema);
