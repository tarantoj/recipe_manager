var Recipe = require('../models/recipe');
var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {
    async.parallel({
        recipe_count: function(callback) {
            Recipe.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', {title: 'Cookbook Home', error: err, data: results});
    });
};

exports.recipe_list = function(req, res) {
    Recipe.find({}, 'title author')
        .exec(function (err, list_recipes) {
            if (err) { return next(err); }
            res.render('recipe_list', {title: 'Recipe List', recipe_list: list_recipes});
        });

};

exports.recipe_detail = function(req, res, next) {

    Recipe.findById(req.params.id, function(err, recipe) {
        console.log(recipe);
        if (err) { return next(err); }
        if (recipe==null) {
            var err = new Error('Recipe not found');
            err.status = 404;
            return next(err);
        }
        res.render('recipe_detail', {title: 'Title', recipe: recipe});
    });
};

// Display Author create form on GET.
exports.recipe_create_get = function(req, res, next) {
    res.render('recipe_form', { title: 'Create Recipe'});
};


exports.recipe_create_post = [

    (req, res, next) => {
        if(!(req.body.ingredients instanceof Array)){
            if(typeof req.body.ingredeients==='undefined')
            req.body.ingredients=[];
            else
            req.body.ingredients=new Array(req.body.ingredients.split('\n'));
        }
        next();
    },
    
    body('title', 'Recipe title required').isLength({ min: 1 }).trim(),

    sanitizeBody('title').escape(),

    (req, res, next) => {
        const errors =  validationResult(req);
        var recipe = new Recipe(
            {
                title: req.body.title,
                author: req.body.author,
                method: req.body.method,
                ingredients: req.body.ingredients,
                serves: req.body.serves
            });
        recipe.save(function (err) {
            if (err) { return next(err); }
            res.redirect(recipe.url);
        })
    }
]
// Handle Author create on POST.
exports.recipe_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe create POST');
};

// Display Author delete form on GET.
exports.recipe_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe delete GET');
};

// Handle Recipe delete on POST.
exports.recipe_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe delete POST');
};

// Display Author update form on GET.
exports.recipe_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe update GET');
};

// Handle Author update on POST.
exports.recipe_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe update POST');
};