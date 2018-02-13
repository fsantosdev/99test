var express = require('express');
var router = express.Router();

const http = require('http');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var options = {
	    host: 'http://api.bitvalor.com',
	    port: 443,
	    path: '/v1/exchanges.json',
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    }
	};

	rest.getJSON(options, function(statusCode, result) {
	    // I could work with the result html/json here.  I could also just return it
	    console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
	    res.statusCode = statusCode;
	    res.send(result);
	});
});

module.exports = router;
