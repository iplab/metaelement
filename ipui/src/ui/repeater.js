/**
 * @description The Repeater Class.
 * @constructor
 */	
function repeater(){
	this.version 		= '0.1b';
};
repeater.prototype = {
	/**
	 * @description repeat will place data passed as an object and display based upon initial layout of target div element
	 * @param {Object} targetElement The DOM element that will serve as the template/location for repeat
	 * @param {Object} dataObj Data to be used for the repeat template can be a simple key/value pair associative array or hash table
	 * @param {Object} optionalParams
	 * @returns Boolean Will return a true/false Boolean value based upon success
	 */
	repeat: function(targetElement, dataObj, optionalParams) {
		try {
			var options = {};Object.extend(options, optionalParams || {});
			IPUI.requires('utils.general');
			IPUI.requires('common.base.query');
			var itemId;
			(targetElement.getAttribute('id')) ? itemId=targetElement.attributes['id'].value : itemId = '_' + uniqueId();
			if(targetElement.getAttribute('where')) options.where=targetElement.attributes['where'].value;
			targetElement.setAttribute('id',itemId);
			Element.hide(targetElement);	
			if(!document.getElementById(targetElement.id + '_content'))
				new Insertion.After(targetElement,'<div id="' + targetElement.id + '_content"></div>');
			if(!options.clear)
		  		$(targetElement.id + '_content').innerHTML='';
			var LayoutTemplate 	= IPUI.general.SearchAndReplace(IPUI.general.SearchAndReplace(IPUI.general.SearchAndReplace(IPUI.general.SearchAndReplace($(targetElement.id).innerHTML,'&gt;','>'),'&lt;','<'),'%3E','>'),'%3C','<');
			var LayoutRslt		= '';
			for (var member in dataObj) {
				if(options.where) {
					(evalWhere(options.where,dataObj[member]).result==true) ? show=true: show=false;
				}
				else {
					show=true;
				}
				if(show==true) {
					if(typeof(dataObj[member])=='string' || typeof(dataObj[member])=='number') {
						if(LayoutRslt.length<1) LayoutRslt = LayoutTemplate;
						var dataNode 		= '<data:' + member + '></data:' + member + '>';
						var propertyVlue 	= dataObj[member];
						if(LayoutTemplate.indexOf(dataNode)>0)
							LayoutRslt = IPUI.general.SearchAndReplace(LayoutRslt, dataNode, propertyVlue);
					}
					else if(typeof(dataObj[member])=='object') {
						LayoutRslt = LayoutTemplate;
						for(var property in dataObj[member]) {
								var dataNode 		= '<data:' + property + '></data:' + property + '>';
								var propertyVlue 	= dataObj[member][property];
								if(LayoutTemplate.indexOf(dataNode)>0)
									LayoutRslt = IPUI.general.SearchAndReplace(LayoutRslt, dataNode, propertyVlue);
						}
						this.renderRepeat($(targetElement.id+'_content'),LayoutRslt,options.insert);
						LayoutRslt = '';
					}
				}
			}
			if(LayoutRslt!='') this.renderRepeat($(targetElement.id+'_content'),LayoutRslt,options.insert);
			this.fixImgOnIE($(targetElement.id + '_content'));
			this.textarea_setMaxLength($(targetElement.id + '_content'));
			if(options.onComplete) eval(options.onComplete); 
			return true;
		}
		catch(err) {
			if(console.info) console.info(err);
			return false;	
		}
	},
	
	

	/**
	 * @description Used to render data into template content for repeat method
	 * @private
	 * @param {Object} templateObj
	 * @param {Object} newContent
	 * @param {Object} insert
	 */
	renderRepeat: function(templateObj, newContent, insert) {
		if(insert) {
			var origHTML = templateObj.innerHTML;
			switch(insert) {
			  	case 'before': 
			  		templateObj.innerHTML = newContent + origHTML;
					break;
			  	case 'after': 
			  		templateObj.innerHTML += newContent;
					break;
			  	default: 
					templateObj.innerHTML += newContent;
			}
		}
		else
			templateObj.innerHTML += newContent;
	},

	/**
	 * @description loadLayout can be used to load external layout files
	 * @param {Object} targetElement The DOM element that will serve as the template/location for repeat
	 * @param {Object} dataObj Data to be used for the repeat template can be a simple key/value pair associative array or hash object
	 * @param {Object} optionalParams
	 * @returns Boolean Will return a true/false Boolean value based upon success
	 */	
	loadLayout: function(url,optionalParams) {
		var options = {};Object.extend(options, optionalParams || {});
		if (!this.options.target) 
			this.options.target = 'return';
		new Ajax.Request(
		  	url, 
			{
  				method: 'post', 
				parameters: this.options.params, 
				onComplete: this.loadLayout_complete.bindAsEventListener(this,{target:this.options.target,callback:this.options.onComplete})
			}
   		);	
	},
	
	/**
	 * @description finish loadlayout method
	 * @param {Object} response
	 * @param {Object} [optionalParams]
	 */			
	loadLayout_complete: function(response,optionalParams) {
		var options = {};Object.extend(options, optionalParams || {});
		if(options.target!='return') {
			$(options.target).innerHTML = response.responseText;
			if(options.callback) eval(options.callback);
		} 
		else {
			if(options.callback) eval(options.callback); 
		}		
	},

	/**
	 * @private
	 * @param {Object} elem
	 */
	fixImgOnIE: function(elem) {
		$A($(elem).getElementsByTagName('img')).each(function(image) {
			if (image.src) {
				var pieces = image.src.split('://');
				if (pieces.length > 1) {
					var subpieces = pieces[1].split('//');
					if (subpieces.length > 1) {
						var newSrc = '';
						for (var i = 1; i < subpieces.length; i++) {
							newSrc += '/' + subpieces[i];
						}
						image.src = newSrc;
					}
				}
			}
		});
	},
	
	/**
	 * @private
	 * @param {Object} elem
	 */
	textarea_setMaxLength: function(elem) {
		var counter 		= document.createElement('div');
		counter.className 	= 'counter';
		$A($(elem).getElementsByTagName('textarea')).each(function(item) {textarea_maxlength(item,counter);});
	}	
};
