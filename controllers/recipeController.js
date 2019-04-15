var Recipe = require('../models/recipe');

exports.recipe_list = function(req, res) {
    console.log("list")
    res.send('NOT IMPLEMENTED: Recipe list');
};

exports.recipe_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe detail:' + req.params.id);
};

// Display Author create form on GET.
exports.recipe_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: recipe create GET');
};

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