/**
 * @description Cookie Jar Class
 * @constructor
 */	
function human() {
	this.url			= '/jsp/account.jsp';
};
human.prototype = {
	
	initialize: function() {
		IPUI.requires('utils.general');
	},
	
	/**
	 * @description
	 * @param {Object} uObject
	 * @param {Object} optionalParams
	 * @return void
	 */
	create: function(jsonObj,optionalParams) {
		IPUI.common.ajax_request(jsonObj,'&newAccount=1',optionalParams);
	},

	/**
	 * @description
	 * @param {Object} jsonObject
	 * @param {Object} optionalParams
	 * @return void
	 */
	update: function(jsonObj,optionalParams) {
		IPUI.common.ajax_request(jsonObj,'&modifyAccount=1',optionalParams);
	},
	
	/**
	 * @description
	 * @param {Object} jsonObject
	 * @param {Object} optionalParams
	 * @return void
	 */
	authenticate: function(jsonObj,optionalParams) {
		IPUI.common.ajax_request(jsonObj,'&loginValidate=1',optionalParams);
	},

	/**
	 * @description
	 * @param {Object} jsonObject
	 * @param {Object} optionalParams
	 * @return void
	 */
	resetPassword: function(jsonObj,optionalParams) {
		IPUI.common.ajax_request(jsonObj,'&resetPaswd=1',optionalParams);
	}
};
