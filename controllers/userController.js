const ingredientParser = require('recipe-ingredient-parser-v2');
const createError = require('http-errors');

const User = require('../models/user');
const List = require('../models/list');
const oauth2 = require('../lib/oauth2');

exports.userHome = [
  oauth2.required,
  (req, res, next) => {
    User
      .findById(res.locals.profile.id)
      .populate('lists')
      .exec((err, user) => {
        if (err) next(err);
        res.render('user_home', user);
      });
  },
];

exports.removeFromList = [
  oauth2.required,
  (req, res, next) => {
    const { toRemove, listId } = req.body;
    if (!(toRemove || listId)) next(createError(400, "Need item's to remove and list id"));
    List.findById(listId).exec((err, list) => {
      if (err) next(err);
      list.removeItems(toRemove, (removeErr) => {
        if (removeErr) next(removeErr);
        res.sendStatus(200);
      });
    });
  },
];

exports.addToList = [
  oauth2.required,
  (req, res, next) => {
    const { toAdd, listId } = req.body;
    if (!(toAdd || listId)) next(createError(400, "Need item's to add and list id"));
    List.findById(listId).exec(toAdd, (err, list) => {
      if (err) next(err);
      list.addItems(toAdd, (addErr) => {
        if (addErr) next(addErr);
        res.sendStatus(200);
      });
    });
  },
];
