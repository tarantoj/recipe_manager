const {
  body,
  validationResult,
  sanitizeBody,
} = require('express-validator');

const async = require('async');

const Recipe = require('../models/recipe');
const User = require('../models/user');
const List = require('../models/list');
const woolworths = require('../lib/woolworths');
const oauth2 = require('../lib/oauth2');

exports.index = (req, res, next) => {
  Recipe.countDocuments({}, (err, count) => {
    if (err) next(err);
    else {
      res.render('index', { title: 'Home', count });
    }
  });
};

exports.recipe_list = (req, res, next) => {
  Recipe
    .find({}, 'title author')
    .exec((err, recipes) => {
      if (err) next(err);
      else {
        res.render('recipe_list', { title: 'Recipe List', recipes });
      }
    });
};

exports.recipe_detail = (req, res, next) => {
  async.parallel({
    recipe: function recipe(done) {
      Recipe
        .findById(req.params.id)
        .populate('ingredients')
        .exec(done);
    },
    user: function user(done) {
      if (res.locals.profile) {
        User
          .findById(res.locals.profile.id)
          .populate('lists')
          .exec(done);
      } else done(null, null);
    },
  }, (err, results) => {
    if (err) next(err);
    else {
      res.render('recipe_detail', {
        title: results.recipe.title,
        recipe: results.recipe,
        user: results.user,
      });
    }
  });
};

// Display Author create form on GET.
exports.recipe_create_get = [
  oauth2.required,
  (req, res) => {
    res.render('recipe_form', { title: 'Create Recipe' });
  },
];

function convertToArray(input) {
  let output = [];
  if (!(input instanceof Array)) {
    if (typeof input === 'undefined') {
      output = [];
    } else {
      output = input.split('\r\n');
      output = output.filter((el) => el.trim().length !== 0);
    }
  }
  return output;
}

exports.recipe_create_post = [
  oauth2.required,

  sanitizeBody('*').escape(),
  sanitizeBody('method').escape(),
  sanitizeBody('ingredients').escape(),

  (req, res, next) => {
    req.body.ingredients = convertToArray(req.body.ingredients);
    next();
  },
  (req, res, next) => {
    req.body.method = convertToArray(req.body.method);
    next();
  },

  body('title', 'Recipe title required').isLength({ min: 1 }).trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    const ingredientList = new List({
      name: 'ingredients',
      items: req.body.ingredients.map((i) => ({ originalText: i })),
    });
    ingredientList.save();
    const recipe = new Recipe(
      {
        title: req.body.title,
        author: req.body.author,
        method: req.body.method,
        ingredients: ingredientList,
        serves: req.body.serves,
        description: req.body.description,
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
      },
    );
    if (!errors.isEmpty()) {
      next(errors);
    } else {
      recipe.save((err) => {
        if (err) next(err);
        else res.redirect(recipe.url);
      });
    }
  },
];

// Handle Recipe delete on POST.
exports.recipe_delete_post = [
  oauth2.required,
  (req, res, next) => {
    Recipe.deleteOne({ _id: req.body.id }, (err) => {
      if (err) next(err);
      else {
        res.redirect('/recipe');
      }
    });
  },
];

// Display Author update form on GET.
exports.recipe_update_get = [
  oauth2.required,
  (req, res, next) => {
    Recipe.findById(req.params.id)
      .populate('ingredients')
      .exec((err, recipe) => {
        if (err) next(err);
        else if (recipe == null) {
          const error = new Error('Recipe not found');
          error.status = 404;
          next(error);
        } else {
          res.render('recipe_form', { title: `Edit ${recipe.title}`, recipe });
        }
      });
  },
];

// Handle Author update on POST.
exports.recipe_update_post = [
  oauth2.required,
  (req, res, next) => {
    req.body.ingredients = convertToArray(req.body.ingredients);
    next();
  },
  (req, res, next) => {
    req.body.method = convertToArray(req.body.method);
    next();
  },

  body('title', 'Recipe title required').isLength({ min: 1 }).trim(),


  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) next(errors);

    Recipe
      .findById(req.params.id)
      .populate('ingredients')
      .exec((err, recipe) => {
        if (err) next(err);
        else {
          recipe.title = req.body.title;
          recipe.author = req.body.author;
          recipe.method = req.body.method;
          recipe.ingredients.items = req.body.ingredients.map((i) => ({ originalText: i }));
          recipe.serves = req.body.serves;
          recipe.description = req.body.description;
          recipe.prepTime = req.body.prepTime;
          recipe.cookTime = req.body.cookTime;

          recipe.save((_saveErr, result) => res.redirect(result.url));
        }
      });
  },
];

exports.recipe_import_get = [
  oauth2.required,
  (req, res) => {
    res.render('recipe_import', { title: 'Recipe Import' });
  },
];

exports.recipe_import_post = [
  oauth2.required,
  woolworths.importRecipe,
  (req, res, next) => {
    const ingredientList = new List({
      name: 'ingredients',
      items: req.recipe.ingredients.map((i) => ({ originalText: i })),
    });
    ingredientList.save();
    req.recipe.ingredients = ingredientList;
    Recipe.create(req.recipe, (err, recipe) => {
      if (err) next(err);
      else {
        res.redirect(recipe.url);
      }
    });
  },
];
