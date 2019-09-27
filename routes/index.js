const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (_req, res) => {
  if (res.locals.profile) res.redirect('/user');
  else res.redirect('/recipe');
});

module.exports = router;
