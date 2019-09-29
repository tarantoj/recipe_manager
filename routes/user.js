const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.userHome);

router.get('/search', userController.searchUsers);

router.post('/list/create', userController.createList);
router.post('/list/delete', userController.removeList);
router.post('/list/add/single', userController.addSingleToList);
router.post('/list/add', userController.addToList);
router.post('/list/remove', userController.removeFromList);
router.post('/list/share', userController.shareList);

module.exports = router;
