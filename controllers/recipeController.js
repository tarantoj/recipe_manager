const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async');
const ingredientParser = require('recipe-ingredient-parser-v2');

const Recipe = require('../models/recipe');
const User = require('../models/user');
const woolworths = require('../lib/woolworths');
const oauth2 = require('../lib/oauth2');

exports.index = (req, res, next) => {
  Recipe.countDocuments({}, (err, count) => {
    if (!err) res.render('index', { title: 'Home', count });
    else next(err);
  });
};

exports.recipe_list = (req, res, next) => {
  Recipe.find({}, 'title author')
    .exec((err, recipes) => {
      if (err) next(err);
      res.render('recipe_list', { title: 'Recipe List', recipes });
    });
};

exports.recipe_detail = (req, res, next) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) next(err);
    if (recipe == null) {
      const error = new Error('Recipe not found');
      error.status = 404;
      next(error);
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
        ingredients: req.body.ingredients.map(i => ({ originalText: i })),
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
exports.recipe_delete_post = (req, res, next) => {
  Recipe.deleteOne({ _id: req.body.id }, (err) => {
    if (err) next(err);
    res.redirect('/cookbook');
  });
};

// Display Author update form on GET.
exports.recipe_update_get = (req, res, next) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) next(err);
    if (recipe == null) {
      const error = new Error('Recipe not found');
      error.status = 404;
      next(error);
    }
    res.render('recipe_form', { title: `Edit ${recipe.title}`, recipe });
  });
};

// Handle Author update on POST.
exports.recipe_update_post = [
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
        _id: req.body.id,
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
        res.redirect(recipe.url);
      });
    }
  },
];

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


exports.recipe_add_to_list = [
  oauth2.required,
  (req, res, next) => {
    async.parallel({
      recipe: (cb) => {
        Recipe.findById(req.params.id).exec(cb);
      },
      user: (cb) => {
        User.findById(res.locals.profile.id).exec(cb);
      },
    }, (err, results) => {
      if (err) next(err);
      const { recipe, user } = results;
      let combined = user.shopping_list.concat(recipe.ingredients);
      combined = combined.map((i) => {
        return {
          ingredient: i.ingredient,
          unit: i.unit,
          quantity: i.quantity,
        };
      });
      user.shopping_list = ingredientParser.combine(combined);
      user.save((saveErr) => {
        if (saveErr) next(saveErr);
        res.redirect('/');
      });
    });
  },
];
