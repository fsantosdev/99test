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
	this._constructor = pExchange ? {} : null;

	if(pExchange){
		this._constructor.code = pExchange.code;
		this._constructor.name = pExchange.name;
		this._constructor.url = pExchange.url;
		this._constructor.book = pExchange.book || pExchange.url_book;

		if(pExchange.fees){
			this._constructor.fees = new Fee(pExchange.fees);
		}
	}

	this._constructor = new ExchangeEntity(this._constructor);

	return this._constructor;
}

module.exports = Exchange;