var	mongoose = require("mongoose"),
	request = require('request');

const orderIndex = {
	'exchangeCode' : 0,
	'price': 1,
	'volume': 2
};

var Bid = require("../entity/bid");
var Ask = require("../entity/ask");

var BidEntity = mongoose.model("Bid");
var AskEntity = mongoose.model("Ask");


module.exports.index = function(req, res, next){
	var exchangeCode = req.query.code,
		search = exchangeCode ? { info: { "$in" : [exchangeCode]} } : null,
		askList = [],
		bidList = [],
		timeout = 0;

	AskEntity.find(search, function(err, asks) {
		if (err) {
			console.log(err);
			return;
		}

		askList = convertList(asks);
		console.log(asks.length);
    });

    BidEntity.find(search, function(err, bids) {
		if (err) {
			console.log(err);
			return;
		}

		bidList = convertList(bids);
		console.log(bids.length);
    });

    var convertList = function(list){
    	var _list = [];

    	if(typeof list == 'object' && list.length >= 0){
			for(var i = 0; i < list.length; i++){
				_list.push(
					convertToOrderAttr(list[i].info)
				);
			}

			return _list;
    	} else {
    		console.log('Invalid format to: ', list);

    	}
    }

    var convertToOrderAttr = function(item){
    	if(typeof item == 'object' && item.length > 0){
    		return [item[orderIndex.price], item[orderIndex.volume]];

    	} else {
    		console.log('Invalid format to: ', item);

    	}
    }

    var _countListener = setInterval(function(){
		if(askList.length > 0 && bidList.length > 0){
			clearInterval(_countListener);

			res.send({
				'exchange': exchangeCode,
				'vendas': askList,
				'compras': bidList
			}); 

		} else if (askList.length == 0 && bidList.length == 0 && timeout > 5) {
			clearInterval(_countListener);

			res.send({
				'exchange': exchangeCode,
				'vendas': askList,
				'compras': bidList
			}); 
		}

		timeout++;
	}, 200);
}

module.exports.importOrderBook = function(req, res, next){
	var options = {
	    uri: 'http://api.bitvalor.com/v1/order_book.json',
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

		var orderBooksObject = JSON.parse(body),
			orderBookList = Object.keys(orderBooksObject),
			AskModel = new Ask(),
			BidModel = new Bid(),
			entityModel = null,
			errors = 0,
			importedAsk = 0;
			importedBid = 0;
			orderBookTotal = 0,
			timeout = 0;


		if(orderBookList.length > 0){
			for(var i = 0; i < orderBookList.length; i++){
				var orderBookType = orderBookList[i],
					entity = orderBooksObject[orderBookType];

					orderBookTotal += entity.length;

				for(var j = 0; j < entity.length; j++){
					entityModel = orderBookType === 'asks' ? new Ask(entity[j]) : new Bid(entity[j]);

					entityModel.save(function (err, saved) {
						if (err) {
							console.warn('Unable to save ', entityModel.exchangeCode , ' in the database');
							errors++;
							return console.log(err);
						}

						orderBookType == 'asks' ? importedAsk++ : importedBids++;
					});
				}
			}
		}

		var _countListener = setInterval(function(){
			var importedSum = importedAsk + importedBid,
				totalSum = importedSum + errors;

			if(totalSum == orderBookTotal && totalSum > 0){
				clearInterval(_countListener);

				console.log('// Order Book Total', orderBookTotal);
				console.log('// Errors', errors);
				console.log('// Finished Import');

				res.send(
					'Number of Asks Imported: ' + importedAsk + '\n' + 
					'Number of Bids Imported: ' + importedBid + '\n' + 
					'Errors: ' + errors
				); 
			}

			timeout++;
		}, 200);
	});
}