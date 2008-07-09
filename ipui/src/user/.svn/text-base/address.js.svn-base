/**
 * The common Utils Class.
 * @constructor
 */	
function address() {
	this.version 	= '0.1';
	this.url 		= '/ajax/addressBook.jsp';	
};
address.prototype = {
	
	initialize: function(){
		IPUI.requires('utils.general');
	},
	/**
	 * 
	 * @param {Object} jsonObj
	 * @param {Object} optionalParams
	 */
	create: function(jsonObj,optionalParams) {
		IPUI.common.ajax_request(jsonObj,'&mode=create',optionalParams);
	},

	/**
	 * 
	 * @param {Object} jsonObj
	 * @param {Object} optionalParams
	 */
	update: function(jsonObj,optionalParams) {
		IPUI.common.ajax_request(jsonObj,'',optionalParams);
	},
	
	/**
	 * 
	 * @param {Object} jsonObj
	 * @param {Object} optionalParams
	 */	
	remove: function(jsonObj, optionalParams) {
		IPUI.common.ajax_request(jsonObj,'&removeAddress=1',optionalParams);
	},

	/**
	 * 
	 * @param {Object} jsonObj
	 * @param {Object} optionalParams
	 */
	get: function(jsonObj, optionalParams) {
		IPUI.common.ajax_request(jsonObj,'&getAccount=1',optionalParams);
	}
};
