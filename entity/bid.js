var mongoose = require("mongoose"),
	mongooseSchema = mongoose.Schema;


var bidSchema = new mongoose.Schema({
	info: Array,
	exchangeCode: String
});

var Bid = function(pBid){
	this._constructor = pBid ? {} : null;

	if(pBid){
		this._constructor.info = pBid;
		this._constructor.exchangeCode = pBid[0];
	}

	this._constructor = new BidEntity(this._constructor);

	return this._constructor;
}

var BidEntity = mongoose.model("Bid", bidSchema);
module.exports = Bid;