var	mongoose = require("mongoose"),
  	mongooseSchema = mongoose.Schema;

var feeSchema = new mongoose.Schema({
	'in_BRL': [Number],
	'in_BTC': [Number],
	'out_BRL': [Number],
	'out_BTC': [Number],
	'trade_book': [Number],
	'trade_market': [Number],
	_creator : { type: Number, ref: 'Exchange' },
});

var Fee = function(pFee){
	this._constructor = pFee ? {} : null;

	if(this._constructor){
		this._constructor.in_BRL = pFee.in_BRL;
		this._constructor.in_BTC = pFee.in_BTC;
		this._constructor.out_BRL = pFee.out_BRL;
		this._constructor.out_BTC = pFee.out_BTC;
		this._constructor.trade_book = pFee.trade_book;
		this._constructor.trade_market = pFee.trade_market;
	} 

	return new FeeEntity(this._constructor);
}

var FeeEntity = mongoose.model("Fee", feeSchema);

module.exports = Fee;