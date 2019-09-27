const express = require('express');

const router = express.Router();

const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.index);

router.get('/create', recipeController.recipe_create_get);
router.post('/create', recipeController.recipe_create_post);

router.get('/import', recipeController.recipe_import_get);
router.post('/import', recipeController.recipe_import_post);

router.post('/delete/:id', recipeController.recipe_delete_post);

router.get('/update/:id', recipeController.recipe_update_get);
router.post('/update/:id', recipeController.recipe_update_post);

router.get('/all', recipeController.recipe_list);

router.get('/:id', recipeController.recipe_detail);

module.exports = router;
