var	mongoose = require("mongoose")
	request = require('request');

// Import Model dependencies
const Exchange = require('../entity/exchange');
const Fee = require('../entity/fee');
const ExchangeEntity = mongoose.model("Exchange");
const FeeEntity = mongoose.model("Fee");

module.exports.index = function(req, res, next){
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
}

module.exports.importExchanges = function(req, res, next){
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
			imported = [],
			timeout = 0;


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

			if((imported.length + errors.length) == exchangeList.length){
				clearInterval(_countListener);
				res.send('Number of Exchanges Imported: ' + imported.length + '\nErrors: ' + errors.length); 
			} else if (timeout < 5){
				clearInterval(_countListener);
				res.send('Error on importing: Connection timeout'); 
			}

			timeout++;
		}, 1000);
	});
}