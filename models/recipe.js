const mongoose = require('mongoose');

const ingredientSchema = require('./ingredient');

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true, max: 100 },
  author: String,
  description: String,
  method: { type: [String], required: true },
  ingredients: [{ type: ingredientSchema, required: true }],
  serves: Number,
  prepTime: Number,
  cookTime: Number,
});

recipeSchema
  .virtual('url')
  .get(function url() {
    return `/cookbook/recipe/${this.id}`;
  });

recipeSchema
  .virtual('totalTime')
  .get(function totalTime() {
    return (this.prepTime + this.cookTime);
  });

module.exports = mongoose.model('Recipe', recipeSchema);
