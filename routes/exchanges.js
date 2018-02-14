var express = require('express'),
	router = express.Router(),
	request = require('request');

var mongoose = require("mongoose"),
	mongooseSchema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/99test');
var db = mongoose.connection;
db.on('error', function(){ console.log('Error to connect to database'); });
db.once('open', function(){ console.log("Connected to database") });

var exchangeSchema = new mongoose.Schema({
	code: String,
	name: String,
	url: String,
	book: String,
	fees: { type: mongooseSchema.Types.ObjectId, ref: 'Fee' }
});

var feeSchema = new mongoose.Schema({
	'in_BRL': [Number],
	'in_BTC': [Number],
	'out_BRL': [Number],
	'out_BTC': [Number],
	'trade_book': [Number],
	'trade_market': [Number],
	_creator : { type: Number, ref: 'Exchange' },
});

var ExchangeEntity = mongoose.model("Exchange", exchangeSchema);
var Exchange = function(pExchange){
	var _constructor = pExchange ? {} : null;

	if(pExchange){
		_constructor.code = pExchange.code;
		_constructor.name = pExchange.name;
		_constructor.url = pExchange.url;
		_constructor.book = pExchange.book || pExchange.url_book;

		if(pExchange.fees){
			_constructor.fees = new Fee(pExchange.fees);
		}
	}

	_constructor = new ExchangeEntity(_constructor);

	return _constructor;
}

var FeeEntity = mongoose.model("Fee", feeSchema);
var Fee = function(pFee){
	var _constructor = pFee ? {} : null;

	if(_constructor){
		_constructor.in_BRL = pFee.in_BRL;
		_constructor.in_BTC = pFee.in_BTC;
		_constructor.out_BRL = pFee.out_BRL;
		_constructor.out_BTC = pFee.out_BTC;
		_constructor.trade_book = pFee.trade_book;
		_constructor.trade_market = pFee.trade_market;
	} 

	return new FeeEntity(_constructor);
}

/* GET exchanges listing. */
router.get('/get-exchanges', function(req, res, next) {
	var options = {
	    uri: 'http://api.bitvalor.com/v1/exchanges.json',
	    port: 80,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    }
	};


	request(options, function(err, response, body) { 
		if(err) {  
			console.log('--> Throw error = ', err);
			return;
		} 

		var exchangesObject = JSON.parse(body),
			exchangeList = Object.keys(exchangesObject),
			exchangeModel = new Exchange(),
			errors = [],
			imported = [];


		if(exchangeList.length > 0){
			for(var i = 0; i < exchangeList.length; i++){
				var exchangeCode = exchangeList[i],
					exchange = exchangesObject[exchangeCode];

				exchange['code'] = exchangeCode;
				exchangeModel = new Exchange(exchange);

				exchangeModel.save(function (err, saved) {
					if (err) {
						console.warn('Unable to save ', exchangeModel.name , ' in the database');
						errors.push(saved.name)
						return console.log(err);
					}

					console.log(saved.name, ' saved to database');
					imported.push(saved.name)
					saved.fees.save(function (errFee, savedFee) {
						if (errFee) {
							console.warn('Unable to save ', exchangeModel.name , ' Fee in the database');
							return console.log(errFee);
						}

						console.log(saved.name, ' fee saved to database');
					});

				});
			}


		}

		var _countListener = setInterval(function(){
			if((imported.length + errors.length) <= exchangeList.length){
				clearInterval(_countListener);
				res.send('Number of Exchanges Imported: ' + imported.length + '\nErrors: ' + errors.length); 
			}
		}, 200);
	});
});

router.get('/', function(req, res, next) {
	var search = req.query.code ? { code: req.query.code } : null;

	ExchangeEntity.find(search, function(err, exchanges) {
		if (err) 
			console.log(err);

    })
    .populate('fees')
    .exec(function (err, exchanges) {
		if (err) 
			console.log(err);

		
		res.send(exchanges);
	});
});


module.exports = router;
