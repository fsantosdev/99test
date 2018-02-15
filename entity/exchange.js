var	mongoose = require("mongoose"),
  	mongooseSchema = mongoose.Schema,
  	Fee = require('./fee.js');


var exchangeSchema = new mongoose.Schema({
	code: String,
	name: String,
	url: String,
	book: String,
	fees: { type: mongooseSchema.Types.ObjectId, ref: 'Fee' }
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

module.exports = Exchange;