/**
 * The common Utils Class.
 * @constructor
 */	
function common() {
	this.version = '0.1';
};
common.prototype = {
	/**
	 * 
	 * @param {Object} wURL
	 * @param {Object} wName
	 * @param {Object} wWidth
	 * @param {Object} wHeight
	 * @param {Object} wScroll
	 * @param {Object} wResizable
	 * @param {Object} wCentered
	 */
	newWindow: function(wURL,wName,wWidth,wHeight,wScroll,wResizable,wCentered) {
		var settings = 'height='+wHeight+',width='+wWidth+'scrollbars='+wScroll+',resizable='+wResizable;
		if(wCentered==true) {
			lPosition	= (screen.width) ? (screen.width-wWidth)/2 : 0;
			tPosition	= (screen.height) ? (screen.height-wHeight)/2 : 0;	
			settings	+= ',left=' + lPosition + ',top=' + tPosition;
		}
		var nWindow	= window.open(wURL,wName,settings);
		nWindow.focus();
	},

	trim: function(value){
		return value.replace(/^\s+|\s+$/, '');
	},
	
	/**
	 * 
	 * @param {Object} url
	 */
	getFile: function(url) {
		return url.substring(url.lastIndexOf('/') + 1);
	},

	/**
	 * 
	 * @param {Object} fileName
	 */
	getFileExtension: function(fileName) {
		if( fileName.length == 0 ) return ''; 
		var dot = fileName.lastIndexOf('.'); 
		if( dot == -1 ) return ''; 
		return fileName.substr(dot,fileName.length); 
	},
		
	/**
	 * 
	 */
	noCache: function (){
		return Math.random(0, 1000) + '=' + Math.random(0, 1000);
	},

	uniqueId: function(){
		return Math.random(0, 1000);
	},

	/**
	 * 
	 * @param {Object} metaName
	 */
	getMetaValue: function(metaName){
		var metaArray = document.getElementsByTagName('meta');
		for(var m=0;m<metaArray.length;m++){
			if(metaArray[m].name==metaName) {
				return metaArray[m].content;
				break;
			}	
		}
		return false;
	},

	/**
	 * 
	 * @param {Object} Content
	 * @param {Object} SearchFor
	 * @param {Object} ReplaceWith
	 */
	SearchAndReplace: function(Content, SearchFor, ReplaceWith) {
	   var tmpContent = Content;
	   var tmpBefore = new String();   
	   var tmpAfter = new String();
	   var tmpOutput = new String();
	   var intBefore = 0;
	   var intAfter = 0;
	   if (SearchFor.length == 0) return;
	   while (tmpContent.toUpperCase().indexOf(SearchFor.toUpperCase()) > -1) {
	      intBefore = tmpContent.toUpperCase().indexOf(SearchFor.toUpperCase());
	      tmpBefore = tmpContent.substring(0, intBefore);
	      tmpOutput = tmpOutput + tmpBefore;
	      tmpOutput = tmpOutput + ReplaceWith;
	      intAfter = tmpContent.length - SearchFor.length + 1;
	      tmpContent = tmpContent.substring(intBefore + SearchFor.length);
	   }
	   return tmpOutput + tmpContent;
	},
	
	/**
	 * 
	 * @param {Object} obj
	 */
	isArray: function(obj) {
	   if (obj.constructor.toString().indexOf("Array") == -1)
	      return false;
	   else
	      return true;
	},

	/**
	 * 
	 * @param {Object} strValue
	 */
	isString: function(strValue) {
	  return (typeof strValue == 'string' && strValue != '' && isNaN(strValue));
	},
	
	/**
	 * 
	 * @param {Object} strValue
	 */
	isNumber: function(strValue) {
	  return (!isNaN(strValue) && strValue !='' && strValue!=null);
	},

	/**
	 * @private
	 * @param {Object} xhr
	 * @param {Object} optionalParams
	 * @return void
	 */
	ajax_request: function(jsonObj,action,optionalParams) {
		IPUI.requires('ipui.src.utils.common');
		IPUI.requires('ipui.src.utils.serializer');					
		var params = IPUI.serializer.serialise(jsonObject) + action + '&nc='+IPUI.common.noCache();
		new Ajax.Request(this.url,{parameters: params,onComplete: this.ajax_request_completed.bindAsEventListener(this, optionalParams)});
	},
		
	/**
	 * @private
	 * @param {Object} xhr
	 * @param {Object} optionalParams
	 * @return void
	 */
	ajax_request_completed: function(xhr,optionalParams) {
		var options = {};Object.extend(options, optionalParams || {});
		IPUI.requires('ipui.src.utils.xml');
		var response = IPUI.xml.xml2json(xhr);
		if(options.onComplete) options.onComplete
	},
	
	getWinSizeAndScroll: function (){
	var intWidth   = document.body.offsetWidth;
	var intHeight  = (typeof window.innerHeight != "undefined")? window.innerHeight : (document.documentElement && document.documentElement.clientHeight > 0)? document.documentElement.clientHeight : document.body.clientHeight;		
	var intXScroll = (typeof window.pageXOffset != "undefined")? window.pageXOffset : document.body.scrollLeft;		
	var intYScroll = (typeof window.window.pageYOffset != "undefined")? window.window.pageYOffset : (document.documentElement && document.documentElement.scrollTop > 0)? document.documentElement.scrollTop : document.body.scrollTop;
	var offsetLeft = intWidth/2 - this.grid_settings.total_width/2;
	return [offsetLeft, intHeight, intXScroll, intYScroll];
	}
};