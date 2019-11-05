const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');

const importRecipe = (req, _res, next) => {
  const recipe = {};
  request(req.body.url, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return next('Invalid url');
    }
    const $ = cheerio.load(body);
    // eslint-disable-next-line func-names
    $('[itemprop]').each(function () {
      const el = $(this);
      const prop = el.attr('itemprop');
      const content = el.attr('content') || el.text().trim();
      recipe[prop] = content;
    });
    recipe.notes = $('.field-cook-notes').text().trim();
    recipe.ingredients = $('.field-name-field-ingredients').text().trim().split('\n');
    recipe.image = recipe.image.replace('thumb_small', 'full');
    recipe.recipeInstructions = recipe.recipeInstructions.split('\n').map((i) => i.trim()).filter((i) => i);

    req.recipe = {
      title: recipe.name,
      author: recipe.author,
      method: recipe.recipeInstructions,
      ingredients: recipe.ingredients,
      serves: recipe.recipeYield,
      prepTime: moment.duration(recipe.prepTime).asMinutes(),
      cookTime: moment.duration(recipe.cookTime).asMinutes(),
      description: recipe.description,
      image: recipe.image,
      notes: recipe.notes,
    };
    return next();
  });
};

module.exports = { importRecipe };
