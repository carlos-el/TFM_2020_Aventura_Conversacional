var express = require('express');
var router = express.Router();

/* GET commands page. */
router.get('/', function(req, res, next) {
  res.render('commands', { title: 'Express' });
});

module.exports = router;