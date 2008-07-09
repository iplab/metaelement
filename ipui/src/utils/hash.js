/**
 * The hash Utils Class.
 * @constructor
 */	
function hash() {
	this.version = '0.1';
};
hash.prototype = {
	getKeyValue: function(dataObj, key) {
		var rtVlue;
		(key in dataObj) ? rtVlue = dataObj[key] : rtVlue = '';
		return rtVlue;
	}
};