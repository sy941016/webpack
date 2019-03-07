var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/a', function(req, res, next) {
  res.render('a', { title: 'Express' });
});

router.get('/b', function(req, res, next) {
  res.render('b', { title: 'Express' });
});

router.get('/c', function(req, res, next) {
  res.render('c', { title: 'Express' });
});

module.exports = router;
