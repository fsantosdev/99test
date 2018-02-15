var mongoose = require("mongoose"),
	mongooseSchema = mongoose.Schema;


var askSchema = new mongoose.Schema({
	info: Array,
	exchangeCode: String
});

var Ask = function(pAsk){
	this._constructor = pAsk ? {} : null;

	if(pAsk){
		this._constructor.info = pAsk;
		this._constructor.exchangeCode = pAsk[0];
	}

	this._constructor = new AskEntity(this._constructor);

	return this._constructor;
}


var AskEntity = mongoose.model("Ask", askSchema);
module.exports = Ask;