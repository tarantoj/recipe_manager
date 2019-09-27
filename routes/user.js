const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.userHome);

router.post('/list/create', userController.createList);
router.post('/list/delete', userController.removeList);
router.post('/list/add', userController.addToList);
router.post('/list/remove', userController.removeFromList);

module.exports = router;
