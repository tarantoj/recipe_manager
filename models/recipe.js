const mongoose = require('mongoose');

const { Schema } = mongoose;

const RecipeSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  author: String,
  method: { type: [String], required: true },
  ingredients: { type: [String], require: true },
  serves: Number,
});

RecipeSchema
  .virtual('url')
  // eslint-disable-next-line no-underscore-dangle
  .get(function url() {
    return `/cookbook/recipe/${this.id}`;
  });

module.exports = mongoose.model('Recipe', RecipeSchema);
