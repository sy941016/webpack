var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/paging/index_a', function(req, res, next) {
  res.render('paging/index_a', { title: 'Express' });
});

router.get('/paging/index_b', function(req, res, next) {
  res.render('paging/index_b', { title: 'Express' });
});

router.get('/paging/index_c', function(req, res, next) {
  res.render('paging/index_c', { title: 'Express' });
});

module.exports = router;
