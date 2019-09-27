const mongoose = require('mongoose');

const ingredientParser = require('recipe-ingredient-parser-v2');

const ingredientSchema = mongoose.Schema({
  ingredient: String,
  unit: String,
  quantity: String,
  originalText: String,
});

ingredientSchema.post('validate', function parse() {
  if (this.originalText) {
    const parsed = ingredientParser.parse(this.originalText);
    this.ingredient = parsed.ingredient;
    this.unit = parsed.unit;
    this.quantity = parsed.quantity;
  }
});

ingredientSchema.virtual('text')
  .get(function get() {
    return ingredientParser.prettyPrintingPress(this);
  });

const listSchema = mongoose.Schema({
  name: String,
  items: [ingredientSchema],
});

listSchema.virtual('url').get(function url() {
  return `/list/${this.id}`;
})

listSchema.methods.addItems = function addItems(toAdd, done) {
  let combined = this.items.concat(toAdd);
  combined = combined.map((i) => ({
    ingredient: i.ingredient,
    unit: i.unit,
    quantity: i.quantity,
  }));
  this.items = ingredientParser.combine(combined);
  this.save(done);
};

listSchema.methods.removeItems = function removeItems(toRemove, done) {
  toRemove.forEach((element) => {
    this.items.pull(element);
  });
  this.save(done);
};

module.exports = mongoose.model('List', listSchema);
