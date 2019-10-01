var express = require('express');
var router = express.Router();

var allQueries = require('../queries/all');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/candidates', allQueries.getCandidates);
router.get('/totals', allQueries.getTotals);

module.exports = router;
