const express = require('express');

const router = express.Router();

const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.index);

router.get('/recipe/create', recipeController.recipe_create_get);

router.post('/recipe/create', recipeController.recipe_create_post);

router.get('/recipe/import', recipeController.recipe_import_get);

router.post('/recipe/import', recipeController.recipe_import_post);

router.post('/recipe/:id/delete', recipeController.recipe_delete_post);

router.get('/recipe/:id/update', recipeController.recipe_update_get);

router.post('/recipe/:id/update', recipeController.recipe_update_post);

router.get('/recipe/:id', recipeController.recipe_detail);

router.get('/recipe/:id/add', recipeController.recipe_add_to_list);

router.get('/recipes', recipeController.recipe_list);
module.exports = router;
