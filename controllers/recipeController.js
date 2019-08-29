const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Recipe = require('../models/recipe');
const woolworths = require('../lib/woolworths');

exports.index = (req, res, next) => {
  Recipe.countDocuments({}, (err, count) => {
    if (!err) res.render('index', { title: 'Home', count });
    else next(err);
  });
};

exports.recipe_list = (req, res, next) => {
  Recipe.find({}, 'title author')
    .exec((err, recipes) => {
      if (err) return next(err);
      res.render('recipe_list', { title: 'Recipe List', recipes });
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
    res.render('recipe_detail', { title: `${recipe.title}`, recipe });
  });
};

// Display Author create form on GET.
exports.recipe_create_get = (req, res) => {
  res.render('recipe_form', { title: 'Create Recipe' });
};

function convertToArray(input) {
  let output = [];
  if (!(input instanceof Array)) {
    if (typeof input === 'undefined') {
      output = [];
    } else {
      output = input.split('\r\n');
      output = output.filter(el => el.trim().length !== 0);
    }
  }
  return output;
}

exports.recipe_create_post = [
  (req, res, next) => {
    req.body.ingredients = convertToArray(req.body.ingredients);
    next();
  },
  (req, res, next) => {
    req.body.method = convertToArray(req.body.method);
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
    if (!errors.isEmpty()) {
      next(errors);
    } else {
      recipe.save((err) => {
        if (err) { return next(err); }
        res.redirect(recipe.url);
      });
    }
  },
];

// Handle Recipe delete on POST.
exports.recipe_delete_post = (req, res, next) => {
  Recipe.deleteOne({ _id: req.body.id }, (err) => {
    if (err) next(err);
    res.redirect('/cookbook');
  });
};

// Display Author update form on GET.
exports.recipe_update_get = (req, res, next) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) { return next(err); }
    if (recipe == null) {
      const error = new Error('Recipe not found');
      error.status = 404;
      return next(error);
    }
    res.render('recipe_form', { title: `Edit ${recipe.title}`, recipe });
  });
};

// Handle Author update on POST.
exports.recipe_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Recipe update POST');
};

exports.recipe_import_get = (req, res) => {
  res.render('recipe_import', { title: 'Recipe Import' });
};

exports.recipe_import_post = [
  woolworths.importRecipe,
  (req, res, next) => {
    Recipe.create(req.recipe, (err, recipe) => {
      if (err) next(err);
      else {
        res.redirect(recipe.url);
      }
    });
  },
];
