var express = require('express');
var router = express.Router();

var recipe_controller = require('../controllers/recipeController');

router.get('/', recipe_controller.index);

router.get('/recipe/create', recipe_controller.recipe_create_get);

router.post('/recipe/create', recipe_controller.recipe_create_post);

router.get('/recipe/:id/delete', recipe_controller.recipe_delete_get);

router.post('/recipe/:id/delete', recipe_controller.recipe_delete_post);

router.get('/recipe/:id/update', recipe_controller.recipe_update_get);

router.post('/recipe/:id/update', recipe_controller.recipe_update_post);

router.get('/recipe/:id', recipe_controller.recipe_detail);

router.get('/recipes', recipe_controller.recipe_list);

module.exports = router;