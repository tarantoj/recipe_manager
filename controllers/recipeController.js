const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const url = require('url');
const request = require('request');
const Recipe = require('../models/recipe');

exports.index = (req, res) => {
  async.parallel({
    recipe_count(callback) {
      Recipe.countDocuments({}, callback);
    },
  }, (err, results) => {
    res.render('index', { title: 'Cookbook: Home', error: err, data: results });
  });
};

exports.recipe_list = (req, res, next) => {
  Recipe.find({}, 'title author')
    .exec((err, ListRecipes) => {
      if (err) { return next(err); }
      res.render('recipe_list', { title: 'Cookbook: Recipe List', recipe_list: ListRecipes });
    });
};

exports.recipe_detail = (req, res, next) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) { return next(err); }
    if (recipe == null) {
      const error = new Error('Recipe not found');
      error.status = 404;
      return next(error);
    }
    res.render('recipe_detail', { title: `Cookbook: ${recipe.title}`, recipe });
  });
};

// Display Author create form on GET.
exports.recipe_create_get = (req, res) => {
  res.render('recipe_form', { title: 'Cookbook: Create Recipe' });
};


exports.recipe_create_post = [

  (req, res, next) => {
    if (!(req.body.ingredients instanceof Array)) {
      if (typeof req.body.ingredients === 'undefined') {
        req.body.ingredients = [];
      } else {
        req.body.ingredients = req.body.ingredients.split('\r\n');
        req.body.ingredients = req.body.ingredients.filter(el => el.trim().length !== 0);
      }
    }
    next();
  },
  (req, res, next) => {
    if (!(req.body.method instanceof Array)) {
      if (typeof req.body.method === 'undefined') {
        req.body.method = [];
      } else {
        req.body.method = req.body.method.split('\r\n');
        req.body.method = req.body.method.filter(el => el.trim().length !== 0);
      }
    }
    next();
  },

  body('title', 'Recipe title required').isLength({ min: 1 }).trim(),

  sanitizeBody('*').escape(),
  sanitizeBody('method').escape(),
  sanitizeBody('ingredients').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const recipe = new Recipe(
      {
        title: req.body.title,
        author: req.body.author,
        method: req.body.method,
        ingredients: req.body.ingredients,
        serves: req.body.serves,
      },
    );
    recipe.save((err) => {
      if (err) { return next(err); }
      res.redirect(recipe.url);
    });
  },
];


// Display Author delete form on GET.
exports.recipe_delete_get = (req, res) => {
  Recipe.findByIdAndRemove(req.body.id).then(res.redirect('/cookbook'));
};

// Handle Recipe delete on POST.
exports.recipe_delete_post = (req, res, next) => {
  Recipe.findByIdAndDelete(req.body.id, (err, result) => {
    // eslint-disable-next-line no-console
    console.log(`deleted: ${result}`);
    res.redirect('/cookbook');
    if (err) { return next(err); }
  });
};

// Display Author update form on GET.
exports.recipe_update_get = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) { return next(err); }
    if (recipe == null) {
      const error = new Error('Recipe not found');
      error.status = 404;
      return next(error);
    }
    res.render('recipe_form', { title: `Cookbook: Edit ${recipe.title}`, recipe });
  });
};

// Handle Author update on POST.
exports.recipe_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Recipe update POST');
};

exports.recipe_import_get = (req, res) => {
  res.render('recipe_import', { title: 'Cookbook: Recipe Import' });
};

exports.recipe_import_post = (req, res) => {
  const myUrl = url.parse(req.body.url);
  const id = myUrl.path.match(/\/(\d+)\//)[1];
  const jsonUrl = `https://www.woolworths.com.au/apis/ui/recipes/${id}`
  request({
    url: jsonUrl,
    json: true,
  }, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const importedRecipe = new Recipe({
        title: body.Title,
        author: 'Woolworths',
        description: body.TextTip,
        method: body.Instructions.split('\r\n').map(i => i.match(/(?:^\d. )(.*)/)[1]),
        ingredients: body.Ingredients.map(i => i.Description),
        serves: body.Servings,
      });
      importedRecipe.save().then(res.redirect(importedRecipe.url));
    }
  });
};
