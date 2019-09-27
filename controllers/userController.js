const createError = require('http-errors');
const { body, validationResult } = require('express-validator');

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
  body('toRemove')
    .isArray()
    .not().isEmpty(),
  body('listId')
    .not().isEmpty()
    .trim()
    .escape(),
  (req, res, next) => {
    const { toRemove, listId } = req.body;
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) next(errors);
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
    next();
  },
  body('toAdd')
    .isArray()
    .not().isEmpty(),
  body('listId')
    .not().isEmpty()
    .trim()
    .escape(),
  (req, res, next) => {
    const { toAdd, listId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) next(errors);
    List.findById(listId).exec(toAdd, (err, list) => {
      if (err) next(err);
      list.addItems(toAdd, (addErr) => {
        if (addErr) next(addErr);
        res.sendStatus(200);
      });
    });
  },
];

exports.createList = [
  oauth2.required,
  body('name')
    .not().isEmpty()
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) next(errors);
    const list = new List({ name: req.body.name });
    list.save();
    User.findById(res.locals.profile.id, (err, user) => {
      if (err) next(err);
      user.lists.push(list);
      user.save();
      res.redirect('/user');
    });
  },
];

exports.shareList = [
  oauth2.required,
  body('userId')
    .not().isEmpty(),
  body('listId')
    .not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) next(errors);
    User.findById(req.body.userId)
      .exec((err, user) => {
        if (err) next(err);
        user.lists.push(req.body.listId);
        user.save();
        res.redirect('/user');
      });
  },
];

exports.removeList = [
  oauth2.required,
  body('listId')
    .not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) next(errors);
    User.find({ lists: { $in: req.body.listId } })
      .exec((err, users) => {
        if (err) next(err);
        users.forEach((u) => {
          u.lists.pull(req.body.listId);
          u.save();
        });
        res.redirect('/user');
      });
  },
];
