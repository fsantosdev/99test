var express = require('express'),
	router = express.Router();

// Import Controller
const orderBookController = require('../controllers/orderBookController');


/* GET Orders From Exchange */
router.get('/', function(req, res, next) {
	var exchangeCode = req.query.code;

	if (!exchangeCode){
		res.send({
			'message': 'Favor informar o código da exchange'
		}); 
		return;
	}

	orderBookController.index(req, res, next);
});

/* GET Import Order Book listing. */
router.get('/import-orderbook', function(req, res, next) {
	orderBookController.importOrderBook(req, res, next)	;
});

module.exports = router;
