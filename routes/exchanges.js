var express = require('express'),
	router = express.Router(),
	request = require('request');

// Import Controller
const exchangeController = require('../controllers/exchangeController');

/* GET Exchanges Listing. */
router.get('/', function(req, res, next) {
	exchangeController.index(req, res, next);
});

/* GET Import Exchanges. */
router.get('/import-exchanges', function(req, res, next) {
	exchangeController.importExchanges(req, res, next);
});

module.exports = router;