const mongoose = require('mongoose');

const List = require('./list');

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true, max: 100 },
  author: String,
  description: String,
  method: { type: [String], required: true },
  ingredients: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
  serves: Number,
  prepTime: Number,
  cookTime: Number,
  image: String,
  notes: String,
});

recipeSchema
  .virtual('url')
  .get(function url() {
    return `/recipe/${this.id}`;
  });

recipeSchema
  .virtual('totalTime')
  .get(function totalTime() {
    return (this.prepTime + this.cookTime);
  });

recipeSchema.pre('remove', function deleteIngredients(done) {
  List.findOneAndDelete(this.ingredients).then(done);
});

module.exports = mongoose.model('Recipe', recipeSchema);
