	var cc = {US:'UA-2242866-1', CA:'UA-2242866-2'};
	var getServerTime = function () {
		new Ajax.Request( 
			'/ajax/date.jsp',
			{
				asynchronous:false,
				parameters:'nC='+noCache(),
				onComplete: function(xhr){
					var firstNode = get_firstchild(xhr.responseXML.documentElement);
					var dt = getNodeValue(firstNode);
					getServerTime = function () { return dt };
				}
			}
		);
	};
	getServerTime();
	/*-------------------------------GLOBAL VARIABLES------------------------------------*/
	var cart;
	var cartLightBox;
	/* start lightbox global variables */
	var detect = navigator.userAgent.toLowerCase();
	var OS,browser,version,total,thestring;
	/* end lightbox global variables */
	/*-----------------------------------------------------------------------------------*/
 	Event.observe(window,'load', 
		function() {
			(window.attachEvent && navigator.appVersion.substr(22,3)=="6.0") ? sfIeHover() : sfHover();
			demandletManager.load();
			cart = new cartManager; 
   			$$('.viewcart').each(function(item){cartLightBox = new lightbox(item,{oncomplete:function(){cart.show();}});});
			if(document.getElementById('ccMain')){$('ccMain').innerHTML=cart.count();};
			if ($('suggest_title')) {
				$('suggest_title').style.backgroundImage="url('/media/global/suggest-a-title-"+(Math.floor(Math.random()*3)+1)+".jpg')";
			}
			changeCountryLinks(document.getElementsByClassName('helpusca'));
			if ($('footer')) { changeCountryLinks([$('footer')]); }
			if ($('myaccount')) myAccountLink();
		}
	);
	/*-----------------------------------------------------------------------------------*
	 *	 CookieJar Manager - ip_cookiejar.js 											 *
	 *-----------------------------------------------------------------------------------*/
	var CookieJar = Class.create();
	
	CookieJar.prototype = {
		initialize: function(name,options) {
			this.appendString=name+'_';
			this.options = {
				expires: dateAdd('d', 90, new Date() ),		// seconds (1 hr)
				path: '',			// cookie path
				domain: '',			// cookie domain
				secure: ''			// secure ?
			};
			Object.extend(this.options, options || {});
			if (this.options.expires != '') {
				var date = new Date();
				date = new Date(date.getTime() + (this.options.expires * 1000));
				this.options.expires = '; expires=' + date.toGMTString();
			}
			if (this.options.path != '')
				this.options.path = '; path=' + escape(this.options.path);
			if (this.options.domain != '')
				this.options.domain = '; domain=' + escape(this.options.domain);
			if (this.options.secure == 'secure')
				this.options.secure = '; secure';
			else
				this.options.secure = '';
		},
	
		put: function(name, value) {
			name 		= this.appendString + name;
			cookie 		= this.options;
			var type 	= typeof value;
			switch(type) {
			  case 'undefined':
			  case 'function' :
			  case 'unknown'  : return false;
			  case 'boolean'  : 
			  case 'string'   : 
			  case 'number'   : value = String(value.toString());
			}
			var cookie_str = name + "=" + escape(Object.toJSON(value));
			try {
				document.cookie = cookie_str + cookie.expires + cookie.path + cookie.domain + cookie.secure;
			} 
			catch (e) {
				return false;
			}
			return true;
		},
	
		remove: function(name) {
			name = this.appendString + name;
			cookie = this.options;
			try {
				var date = new Date();
				date.setTime(date.getTime() - (3600 * 1000));
				var expires = '; expires=' + date.toGMTString();
				document.cookie = name + "=" + expires + cookie.path + cookie.domain + cookie.secure;
			} 
			catch (e) {
				return false;
			}
			return true;
		},
	
		get: function(name) {
			name = this.appendString + name;
			var cookies = document.cookie.match(name + '=(.*?)(;|$)');
			if (cookies)
				return (unescape(cookies[1])).evalJSON();
			else
				return null;
		},
	
		empty: function() {
			keys = this.getKeys();
			size = keys.size();
			for(i=0; i<size; i++)
				this.remove(keys[i]);
		},
	
		getPack: function() {
			pack = {};
			keys = this.getKeys();
			size = keys.size();
			for(i=0; i<size; i++)
				pack[keys[i]] = this.get(keys[i]);
			return pack;
		},
	
		getKeys: function() {
			keys = $A();
			keyRe= /[^=; ]+(?=\=)/g;
			str  = document.cookie;
			CJRe = new RegExp("^" + this.appendString);
			while((match = keyRe.exec(str)) != undefined) {
				if (CJRe.test(match[0].strip()))
					keys.push(match[0].strip().gsub("^" + this.appendString,""));
			}
			return keys;
		}
	};

	function evalWhere(query,dataObj) {
		try {
			var response=false;var reason='No Error';var error=false;
			if(query.indexOf('!=')>-1)
				whereArray=query.split('!='),operator='!=';
			else if(query.indexOf('=')>-1)
				whereArray=query.split('='),operator='==';
			else if(query.indexOf('>')>-1)
				whereArray=query.split('>'),operator='>';
			else if(query.indexOf('<')>-1)
				whereArray=query.split('<'),operator='<';
			else if(query.indexOf(' is ')>-1)
				whereArray=query.split(' is '),operator='is';
			if(isArray(whereArray)) {
				(isString(whereArray[1].replace(/\'/g,''))) ? than=whereArray[1] : than=parseFloat(whereArray[1].replace(/\'/g,''));
				var condition = {member:whereArray[0], is:operator, than:than};
				if(condition.is=='is' && condition.than=='null') {
					((condition.member in dataObj)==false) ? response=true : response=false;
				}
				else if(condition.member in dataObj) {
               		(eval('dataObj[\'' + condition.member + '\']' + condition.is + condition.than)==true) ? response=true : response=false;
				}
				else {
					(condition.is == '!=') ? response=true : response=false;
					error=true;reason='No data member (' + condition.member + ') found. Query (' + query + ')';
				}
			}
			else {
				error=true;reason='Incorrect query (' + query + ')';
			}
			return {result:response,reason:reason,error:error};		
		}
		catch(err) {
			return {result:false,reason:err,error:true};			
		}	
	};	

	/*-----------------------------------------------------------------------------------*/
	/* Painter() Class  - ip_painter.js													 */
	/*-----------------------------------------------------------------------------------*/
	var painter = Class.create();
	
	painter.prototype = {
		initialize: function(params) {
			this.keeper = new CookieJar('keeper',{  
			    expires:dateAdd('d', 90, new Date() ),     
			    path:'/'
			}); 
			this.params = {};
			Object.extend(this.params, params || {});
		},
	
		repeat: function(targetElement, dataObj, optionalParams) {
			try {
				options = {};Object.extend(options, optionalParams || {});
				
				var itemId;
				
				(targetElement.getAttribute('id')) ? itemId=targetElement.attributes['id'].value : itemId = '_' + uniqueId();
				
				if(targetElement.getAttribute('where')) options.where=targetElement.attributes['where'].value;
				
				targetElement.setAttribute('id',itemId);
				
				Element.hide(targetElement);	
				
				if(!document.getElementById(targetElement.id + '_content'))
					new Insertion.After(targetElement,'<div id="' + targetElement.id + '_content"></div>');
				
				if(!options.clear)
			  		$(targetElement.id + '_content').innerHTML='';
				
				var LayoutTemplate 	= SearchAndReplace(SearchAndReplace(SearchAndReplace(SearchAndReplace($(targetElement.id).innerHTML,'&gt;','>'),'&lt;','<'),'%3E','>'),'%3C','<');
				
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
								LayoutRslt = SearchAndReplace(LayoutRslt, dataNode, propertyVlue);
						}
						else if(typeof(dataObj[member])=='object') {
							LayoutRslt = LayoutTemplate;
							for(var property in dataObj[member]) {
									var dataNode 		= '<data:' + property + '></data:' + property + '>';
									var propertyVlue 	= dataObj[member][property];
									if(LayoutTemplate.indexOf(dataNode)>0)
										LayoutRslt = SearchAndReplace(LayoutRslt, dataNode, propertyVlue);
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
				return false;	
			}
		},
		
		loadLayout: function(url,options) {
			this.options = {};
			Object.extend(this.options, options || {});
			if (!this.options.target) 
				this.options.target = 'return';
			new Ajax.Request(
			  	url, 
				{
	  				method: 'post', 
					parameters: this.options.params, 
					onComplete: this.loadLayout_complete.bindAsEventListener(this,
																				{
																				target:this.options.target,
																				callback:this.options.onComplete
																				})
				}
	   		);	
		},

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
		
		xml2json: function(xml,options) {
			var x 	= xml.responseXML.getElementsByTagName(get_firstchild(xml.responseXML.documentElement).nodeName);
			this.options = {};
			Object.extend(this.options, options || {});
			if(!this.options.start) 
				this.options.start = 0;
			if(!this.options.end)
				this.options.end
			var jsonEntry = new Object();
			for (var i=this.options.start; i<x.length; i++) {  
				
				for(var j=0;j<x[i].childNodes.length;j++) {
					jsonEntry[getNodeAttribute(x[i].childNodes[j],'name')] =  getPropertyNodeByName(x[i],getNodeAttribute(x[i].childNodes[j],'name'));
				}	
				this.keeper.put(getPropertyNodeByName(x[i],getNodeAttribute(x[i],'pk')),jsonEntry);
			}
			return this.keeper.getPack();
		},
		
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
		
		textarea_setMaxLength: function(elem) {
			var counter 		= document.createElement('div');
			counter.className 	= 'counter';
			$A($(elem).getElementsByTagName('textarea')).each(function(item) {textarea_maxlength(item,counter);});
		}	
	};
	
	/*-----------------------------------------------------------------------------------*
	 * cartManager() Class - ip_cart.js													 *
	 *-----------------------------------------------------------------------------------*/
	var cartManager = Class.create();
	
	cartManager.prototype = {
		initialize: function(options) {
			this.trolley = new CookieJar('_basket_',{  
			    expires:dateAdd('d', 90, new Date() ),     
			    path:'/'
			}); 
			this.truck = new CookieJar('shipping',{  
			    expires:dateAdd('d', 90, new Date() ),     
			    path:'/'
			}); 
			this.elementArray 	= {};				//dyanmic form elements hashtable 
			this.ready			= true;				//class state - used to decide action for checkout/update
			this.targetRepeater = 'repeater';		//specified repeater object to render - TO DO - pass in as option or use selector...			
			this.shippingLoaded	= false;
			this.shippingXML	= '';
			this.loadShipping();
			if(getCountry()=='US')
				this.shippingMethod	= {name:'U.S Mail',code:'1'}; //default US
			else if(getCountry()=='CA')
				this.shippingMethod = {name:'Standard Mail',code:'4'}; //default CA
			else
				this.shippingMethod	= {name:'U.S Mail',code:'1'}; //default US if no country returned
		},
	
		check: function(id) {
			if(this.trolley.get(id))
				return true;
			else	
				return false;
		},
	
		add: function(id,object) {
			try {	
				this.object = {};
				Object.extend(this.object, object || {});
				if(this.check(id)) {
					var item = this.getItemByID(id);
					this.object.quantity 	= parseInt(item.quantity)+1;
				}
				else {
					this.object.quantity	= 1;
				}				
				this.object.product_id	= id;
				if(this.set(id,this.object)) {
					if(document.getElementById('ccMain')) $('ccMain').innerHTML	= this.count();
					if(!this.object.hideCart)
						cartLightBox.activate(); // proper way to show lightbox on IE6. -clam
				}
			}
			catch(err){}
		},
	
		remove: function(id,all) {
			if(!all) all=false;
			if(all==true)
				this.trolley.remove(id);
			else {
				if(this.check(id)==true) {
					var item = this.getItemByID(id);
					item.quantity = parseInt(item.quantity)-1;
					if(item.quantity<1)
						this.trolley.remove(id);
					else 
						this.set(id,item);
					
				}
			}
		},
	
		updateQuantity: function(id,quantity) {
			try	{
				if(this.check(id)==true) {
					var object = this.getItemByID(id);
					object.quantity = quantity;
					this.set(id,object);
					return true;
				}	
			}
			catch(err){		
				return false;
			}
		},
	
		set: function(id,object) {
			try {
				this.object = {};
				Object.extend(this.object, object || {});
				if(this.object.quantity<1) {
					this.remove(id,true);
					return true;
				}
				else {
					this.trolley.put(id, this.object);
					return true;
				}
			}
			catch(err) {
				return false;
			}
		},
	
		empty: function() {
			try {
				this.trolley.empty();
				return true;
			}
			catch(err) {
				return false;
			}
		},
		
		count: function(id) {
			if(id) {
				if(this.check(id)==true) 
					return this.trolley.get(id).quantity;
				else
					return 0;
			}
			else {
				var itemCount	= 0;
				var dataObject 	= this.getContentObj();
				for (var member in dataObject)
					itemCount += parseInt(dataObject[member].quantity);
				return itemCount;
			}
		},
		
		getItems: function() {
			return this.trolley.getKeys();
		},
		getContentObj: function() {
			return this.trolley.getPack()
		},
		
		getItemByID: function(id) {
			return this.trolley.get(id);
		},
		
		getSubTotal: function(optionalParams) {
			var options = {};Object.extend(options, optionalParams || {});
			var price = 0; var cart = this;
			$A(this.getItems()).each(function(re) {
					var item = cart.getItemByID(re);
					if(options.where) {
						if(evalWhere(options.where,item).result==true) {
							price = price + (item.quantity * item.product_price)-0;
						}
					}
					else {				
						price = price + (item.quantity * item.product_price)-0;
					}
				});
			return (Math.round(price*100)/100);
		},

		getDropshipTotal: function(optionalParams){
			var options = {};Object.extend(options, optionalParams || {});
			var total = 0; var cart = this;
			$A(this.getItems()).each(function(re) {
					var item = cart.getItemByID(re);
					if(options.where) {
						if(evalWhere(options.where,item).result==true) {
							total = total + (item.quantity * item.product_ship_cost)-0;
						}
					}
					else {				
						total = total + (item.quantity * item.product_ship_cost)-0;
					}
				});
			return (Math.round(total*100)/100);
		},
							
		setState: function(state) {
			this.ready 	= state;
			var mode	= '';
			var itemObj	= '';
			if(document.getElementById('checkout')) {
				itemObj 	= $('checkout');
				mode	= 'checkout';
			}
			if(document.getElementById('continue')) {
				itemObj 	= $('continue');
				mode	= 'continue';
			}
			if(document.getElementById('review')) {
				itemObj 	= $('review');
				mode	= 'review';
			}

			if(this.ready==false) {
				if(mode=='continue') {
					itemObj.addClassName('btn-update-large');
					itemObj.removeClassName('btn-continue-large');
				}
				else if(mode=='checkout') {
					itemObj.addClassName('btn-update-large');
					itemObj.removeClassName('btn-checkout-large');
				}
				else if(mode=='review') {
					itemObj.addClassName('btn-update-large');
					itemObj.removeClassName('btn-review-large');
				}
			}
			else {
				if(mode=='continue') {
					itemObj.addClassName('btn-continue-large');
					itemObj.removeClassName('btn-update-large');
				}
				else if(mode=='checkout') {
					itemObj.addClassName('btn-checkout-large');
					itemObj.removeClassName('btn-update-large');
				}
				else if(mode=='review') {
					itemObj.addClassName('large-btn-review');
					itemObj.removeClassName('btn-update-large');
				}
			}
		},
		
		calculateGiftWrapping: function() {
			try {
				var itemsInCart = this.getContentObj();
				var giftTotal	= 0;
				var giftRate	= 4;
				if(orderObject) {
					for(var item in itemsInCart) {
						if('product_id' in itemsInCart[item]) {
							var product_id = itemsInCart[item].product_id;
							if('giftwrap-'+product_id in orderObject) {
								if(orderObject['giftwrap-'+product_id]) {
									giftTotal += parseFloat(itemsInCart[item].quantity*giftRate);
								}
							}
						}
					}
				}
			}
			catch(err){}			
			finally {
				return giftTotal;
			}
		},
		
		calculateDetails: function(optionalParams) {
			try {
				var options = {};Object.extend(options, optionalParams || {});
				var gift 					= new giftManager();
				var giftTotal				= parseFloat(gift.getTotal());
				var cartTotal 				= parseFloat(this.getSubTotal()); 
				var cartTotal_standard  	= parseFloat(this.getSubTotal({where:'product_shipping is null'})); 
				var cartTotal_dropship		= parseFloat(this.getDropshipTotal({where:'product_shipping=\'dropship\''}));
				var cartTotal_digital		= parseFloat(this.getSubTotal({where:'product_shipping=\'digital\''}));
				var cartTotal_subscription 	= parseFloat(this.getSubTotal({where:'product_shipping=\'subscription\''}));
				var cartTotal_promoApplcble	= cartTotal-cartTotal_digital-0;
				(options.shippingMethod) ? shippingMethod = options.shippingMethod : shippingMethod = '';
				var shippingCost	= 0;
				var shippingName	= '';
				var shippingDesc	= '';
				var shippingObj		= '';
				var promoRslt 		= this.calculatePromotion(cartTotal_promoApplcble);
				var freeShipping;
				(promoRslt.amount=='freestandardshipping') ? freeShipping=true : freeShipping=false;	
				try { //see if the user has selected a shipping method
					if(orderObject) {
						if('shippingAddress' in orderObject)
							shippingMethod = orderObject['shippingAddress'].shippingMethod;
					}
				}
				catch(err){}
				if(cartTotal>=100) { //Cart total is 100 or over
					shippingObj	 	= this.getShippingRate({price:cartTotal,code:shippingMethod,freestandard:freeShipping});
					shippingCost 	= shippingObj.price;
					shippingName	= shippingObj.name;
					shippingDesc	= shippingObj.description;
				}
				else {
					if(cartTotal_standard==0) {
						shippingObj 	= this.getShippingRate({price:cartTotal_standard,code:shippingMethod,freestandard:true});
						shippingCost 	= shippingObj.price;
						shippingName	= shippingObj.name;
						shippingDesc	= shippingObj.description;
					}
					else {
						shippingObj 	= this.getShippingRate({price:cartTotal_standard,code:shippingMethod,freestandard:freeShipping});
						shippingCost 	= shippingObj.price;
						shippingName	= shippingObj.name;
						shippingDesc	= shippingObj.description;
					}
				} 
				
				var grandTotal			= 0;
				var giftWrappingTotal 	= this.calculateGiftWrapping();
				
				if(promoRslt.amount=='freestandardshipping') {
					grandTotal 			= cartTotal;
					promoRslt.amount	= 0;
				}
				else if(promoRslt.amount>0) {
					grandTotal = (Math.round(parseFloat(cartTotal-promoRslt.amount)*100)/100);
				}
				else {
					grandTotal = cartTotal;
				}
				
				grandTotal = grandTotal + shippingCost;
				
				if(giftWrappingTotal>0) grandTotal = grandTotal + giftWrappingTotal;
				if(cartTotal_dropship>0) grandTotal = grandTotal + cartTotal_dropship;
				var grandTotal_all = (Math.round(parseFloat(grandTotal)*100)/100);
				if(giftTotal>=grandTotal) {
					giftTotal = grandTotal;
					grandTotal=0;
				}
				else 
					grandTotal = (Math.round(parseFloat(grandTotal - giftTotal)*100)/100);		
					
				var ccTotal = parseFloat(cartTotal + shippingCost - giftTotal - promoRslt.amount);	
				
				if(options.padding) {
					if(options.padding=='false') {
						return  {
							cartTotal: cartTotal,
							cartTotal_standard: cartTotal_standard,
							cartTotal_dropship: cartTotal_dropship,
							cartTotal_promoApplcble: cartTotal_promoApplcble,
							shippingCost: shippingCost,
							shippingName: shippingName,
							shippingDesc: shippingDesc,
							giftTotal: giftTotal,
							promoTotal: promoRslt.amount,
							grandTotal: grandTotal,
							promoTitle: promoRslt.title,
							giftWrappingTotal: giftWrappingTotal,
							ccTotal: ccTotal,
							freestandard: freeShipping,
							grandTotal_all: grandTotal_all
						};	
					}
				}
				else {
					return  {
						cartTotal: cartTotal.toFixed(2),
						cartTotal_standard: cartTotal_standard.toFixed(2),
						cartTotal_dropship: cartTotal_dropship.toFixed(2),
						cartTotal_promoApplcble: cartTotal_promoApplcble.toFixed(2),
						shippingCost: shippingCost.toFixed(2),
						shippingName: shippingName,
						shippingDesc: shippingDesc,
						giftTotal: giftTotal.toFixed(2),
						promoTotal: promoRslt.amount.toFixed(2),
						grandTotal: grandTotal.toFixed(2),
						promoTitle: promoRslt.title,
						giftWrappingTotal: giftWrappingTotal.toFixed(2),
						ccTotal: ccTotal.toFixed(2),
						freestandard: freeShipping,
						grandTotal_all: grandTotal_all.toFixed(2)
					};	
				}
			}
			catch(err){}
		}, 

		show: function(targetObj) {
			if(!targetObj) targetObj=$(this.targetRepeater);
			try {
				var display	= new painter();
				display.repeat(targetObj, this.getContentObj(), {insert:'after'});
				if(this.getSubTotal()>0) {
					if(this.shippingLoaded!=true) 
						this.loadShipping({onComplete:'cart.show_complete()'});
					else
						this.show_complete();
				}
				else {
					if(document.getElementById('continue'))  {
						Element.hide('continue');
					}
					this.show_complete();
				}
			}
			catch(err) {
				return err;
			}
		},
							
		show_complete: function() {
			try {
				var display 	= new painter();
				var details 	= this.calculateDetails();
				var detailsInt 	= this.calculateDetails({padding:'false'});
				if(document.getElementById('cartTotal')) $('cartTotal').innerHTML 			= '$' + details.cartTotal;
				(detailsInt.shippingCost==0 || details.freeShipping==true) ? shippingText 	= 'Free' : shippingText = '$' + details.shippingCost;
				if(document.getElementById('shippingTotal')) $('shippingTotal').innerHTML 	= shippingText;
				if(document.getElementById('totalPrice')) $('totalPrice').innerHTML			= '$' + details.grandTotal;
				if(document.getElementById('cartitems')) $('cartitems').innerHTML 			= this.count() + ' Item(s)';
				
				if(detailsInt.giftTotal>0) {
					if(document.getElementById('giftCertificate')) {
						Element.show('giftCertificate');
						$('giftcertificateTotal').innerHTML = '$-' + details.giftTotal;
					}
				}
				else if(document.getElementById('giftCertificate'))
					Element.hide('giftCertificate');

				if(detailsInt.promoTitle!='') {
					if(document.getElementById('promotion')){
						Element.show('promotion');
						if(document.getElementById('promotionDescription')) {
							$('promotionDescription').innerHTML = details.promoTitle;
						}
						if(document.getElementById('promotionTotal')) {
							if(details.promoTotal != 0)  {
								Element.show('promotionTotal');
								$('promotionTotal').innerHTML = '-$' + details.promoTotal;	
							}
							else
								Element.hide('promotionTotal');
						}
					}
					else if(document.getElementById('promotion')){
						Element.hide('promotion');
					}
				}
				else {
					if(document.getElementById('promotion')) Element.hide('promotion');
				}
				if(document.getElementById('giftwrapTotal')) {
					if(details.giftWrappingTotal=='') 
						$('giftwrapTotal').innerHTML = '$0'
					else
						$('giftwrapTotal').innerHTML = '$' + details.giftWrappingTotal;
				}
				if(document.getElementById('dropshipInfo')) {
					var dropShipObject 	= {};
					var cartContents   	= cart.getContentObj();
					var dsCount			= 0;	
					for(var member in cartContents) {
						var cartItem = cart.getItemByID(member);
						if('product_shipping' in cartItem) {
							if(cartItem.product_shipping=='dropship') {
								dsCount++;
								dropShipObject[member] = cartItem;
								dropShipObject[member].dropShipTotal = (Math.round(parseFloat(cartItem.quantity*cartItem.product_ship_cost)*100)/100).toFixed(2);
							}
						}
					}
					if(dsCount>0) {
						display.repeat($('dropshipInfo'), dropShipObject, {insert:'after'});
					}
					else
						Element.hide('dropshipInfo');
				}
			}
			catch(err){}
		},
		
		calculatePromotion: function(cartTotal,shippingTotal) {
			try {
				var promo 		= new promoManager();
				var promoCodes	= promo.getContentObj();
				var promoAmount	= 0;
				var newTotal	= 0;
				var promoTitle 	= '';
				var response	= '';
				var errFlag		= false;
				for(var member in promoCodes) {
					var promoObj 	= promoCodes[member];
					promoTitle	 	= promoObj.description;
	                if((isDate(promoObj.valid_from) && (dateDiff('n',promoObj.valid_from,getServerTime())>0)) || (isDate(promoObj.valid_from)==false)   ) { //started?                                   
	                	if((isDate(promoObj.valid_until) && (dateDiff('n',promoObj.valid_until,getServerTime())<1) || (isDate(promoObj.valid_until)==false)) ) {//expired?                                                                   
							if(promoObj.country==getCountry()) {//valid country                                        
	                            if((promoObj.min_purchase<cartTotal || promoObj.min_purchase=='' )) {
										if(promoObj.type=='discount'){                    
	                                        if(promoObj.unit=='percent') {
	                                            newTotal 	= cartTotal - parseFloat((cartTotal/100)*promoObj.amount);
												promoTitle 	= promoObj.description;
												promoAmount	= (Math.round(parseFloat((cartTotal/100)*promoObj.amount)*100)/100); //parseFloat((cartTotal/100)*promoObj.amount);
	                                      		break;
										    }
	                                        else {
	                                        	newTotal 	= (cartTotal - parseFloat(promoObj.amount));
												promoTitle 	= promoObj.description;
												promoAmount	= parseFloat(promoObj.amount);
												break;
		                                    }
	                                 	}
	                                    else if(promoObj.type=='free'){
	                                    	newTotal 	= cartTotal;
											promoTitle 	= promoObj.description;
											promoAmount	= 'freestandardshipping';
											break;
	                                    }
	                         	}
								else {
									errFlag = true;
									promo.empty();
									response = {error:'true',message:'The promotion code you entered only applies to orders over '+promoObj.min_purchase,amount:0};
									break;
								}//end min purchase
							}
							else {
								errFlag = true;
								promo.empty();
								response = {error:'true',message:'The promotion code you entered only applies in ' + getCountry() + '.',amount:0};
								break;
							}//end country
						}
						else {
							errFlag = true;
							promo.empty();
							response = {error:'true',message:'The promotion code you entered is only valid after ' + promoObj.valid_from + '.',amount:0};
							break;
						}//until date
					}
					else {
						errFlag = true;
						promo.empty();
						response = {error:'true',message:'The promotion code you entered is no longer valid.',amount:0};
						break;
					}//start date
				}//end loop
				if(errFlag==false)
					return {result:newTotal,title:promoTitle,amount:promoAmount};
				else 
					return response;
			}
			catch(err){}
		},

		edit: function(element) {
			this.elementArray[element.id]='clicked';
			this.setState(false);
		},
		
		update: function() {
			for (var member in this.elementArray) {
				if(this.elementArray[member]!=null) {
				 	if(checkFormElement($(member))) {
						var elValue  = $F(member);
						if(member.indexOf('quantity_')>-1) {
							var product_id = member.replace('quantity_','');
							this.updateQuantity(product_id,elValue);
							this.elementArray[member] = null;
							this.setState(true);
							this.show();
						}
						else if(member=='giftcert'){
							if(elValue!='') {
								this.showNotifier('Checking Gift Certificate, please wait...');
								var gift = new giftManager();
								(getCountry()=='US') ? storeID='US' : storeID='CA';
								gift.balance($F(member),storeID,{onSuccess:'cart.addGC(amount,code);',onFailure:'cart.hideNotifier();cart.failGC();'});
		
							}
							else{
								this.setState(true);
							}
							$(member).value	= '';
							this.elementArray[member] = null;
						}
						else if(member=='promocode'){
							if(elValue!='') {
								this.showNotifier('Checking Promotion Code, please wait...');
								var promo = new promoManager();
								promo.add($F(member),{onSuccess:'cart.hideNotifier();',onFailure:'cart.hideNotifier();cart.failPromo();'});
							}
							else{
								this.setState(true);
							}
							$(member).value	= '';
							this.elementArray[member] = null;
						}
					}
					else {
						this.setState(true);
						this.elementArray[member]=null;
						$(member).value = '';
					}
				}
			}
		},
		
		showNotifier: function(text) {
			if(document.getElementById('notifier')) {
				$('notifier').innerHTML = '<img src="/media/global/loading.gif" border=0 />&nbsp;' + text;
				Element.show('notifier');
				if(document.getElementById('continue'))
					Element.hide('continue');	
				if(document.getElementById('review'))
					Element.hide('review');	
			} 	
		},
		
		hideNotifier: function() {
			if(document.getElementById('notifier')) {
				Element.hide('notifier');
				if(document.getElementById('continue'))
					Element.show('continue');	
				if(document.getElementById('review'))
					Element.show('review');	
			} 
			this.setState(true);
			this.show();
		},
		
		failPromo: function() {
			alert('There\'s a slight problem with your entry. The promotion code is not recognised. Please try again.');
			this.setState(true);
		},
	
		addGC: function(amount,code){
			if(amount==0) {
				alert('Sorry, there is no balance on this gift certificate.');
			}
			else {
				var gift = new giftManager();
				gift.add(amount,code);
			}
			this.hideNotifier();
		},
		
		failGC: function() {
			alert('The gift certificate number is not recognized. Please try again.');
			this.setState(true);
		},
		
		checkout: function(callback) {
			if(this.ready==false)
				this.update();
			else
				if(callback) eval(callback);
		},
		
		loadCheckout:function() {
			if(this.count()>0) document.location.href = 'https://' + document.domain + '/checkout.html';
		},
		
		updateCartIcon: function(dObj) {
			if(document.getElementById(dObj.id))
				$(dObj).innerHTML = this.count();
		},
		
		loadShipping: function(paramObj) {
			var options = {};Object.extend(options, paramObj || {});
			new Ajax.Request(
				'/ajax/data/shipping.xml',{method:'post',onSuccess:this.setShippingXML.bindAsEventListener(this,{onComplete:options.onComplete})});
		},
		
		setShippingXML: function(xml,paramObj){
			var options = {};Object.extend(options, paramObj || {});
			this.shippingXML 	= xml;
			this.shippingLoaded	= true;
			if(options.onComplete) eval(options.onComplete);
		},
		
		getShippingRate: function(paramObj) {
			try {
				var options = {};Object.extend(options, paramObj || {});
				if(!options.code || options.code=='') { //If no NFS shipping code specified, use default for country
					(getCountry()=='US') ? options.code='1' : options.code='4'
				}
				if(options.price>=100) { //Current rules dictate that any amount in the cart $100 or over qualifies for free standard shipping
					options.freestandard=true;
				}
				var firstNode 		= get_firstchild(this.shippingXML.responseXML.documentElement);
				var x 				= this.shippingXML.responseXML.getElementsByTagName(firstNode.nodeName);
				for(var i=0;i<x.length;i++) {
					if(getNodeValueByChildName(x[i],'nfs_code')==options.code) {
						for(var j=0;j<x[i].childNodes.length;j++) {
							var currentNode = x[i].childNodes[j];
							var name		= getNodeValueByChildName(x[i],'name')
							if(x[i].childNodes[j].nodeName=='ship_option') {
								var priceRange 		= getNodeValueByChildName(currentNode,'price_range').split('-');
								var rate			= 0;
								if(options.price>=parseFloat(priceRange[0])&&options.price<=parseFloat(priceRange[1])) {
									if(options.freestandard && (options.freestandard==true && (getNodeValueByChildName(x[i],'nfs_code')=='1' || getNodeValueByChildName(x[i],'nfs_code')=='4'))) 
										rate=0;
									else
										rate = getNodeValueByChildName(currentNode,'rate')-0;
									return {price:rate, name:getNodeValueByChildName(x[i],'name'), description:getNodeValueByChildName(x[i],'description')};
									break;
								}
							}
						}	
					}
				}
			}
			catch(err){}
		}
	};

	function isArray(obj) {
	   if (obj.constructor.toString().indexOf("Array") == -1)
	      return false;
	   else
	      return true;
	}

	function isString(strValue) {
	  return (typeof strValue == 'string' && strValue != '' && isNaN(strValue));
	}
	
	function isNumber(strValue) {
	  return (!isNaN(strValue) && strValue != '');
	}

	var giftManager = Class.create();
	
	giftManager.prototype = {
		initialize: function(options) {
			this.basket = new CookieJar('gift',{  
			    expires:dateAdd('d', 90, new Date() ),     
			    path:'/'
			}); 
			this.url = '/ajax/order.jsp';
		},
	
		add: function(amount,code) {
			this.basket.put(code, {code:code,amount:amount});
		},
		
		create: function(formObj) {
		
		},
		
		getType: function(item_number) {
			var giftDetails = {};
			switch(item_number) {
			  case '70002':
				giftDetails = {amount:'20',name:'Gift Certificate $20'};
				break;
			  case '70003':
				giftDetails = {amount:'30',name:'Gift Certificate $30'};
				break;
			  case '70004':
				giftDetails = {amount:'40',name:'Gift Certificate $40'};
				break;
			  case '70005':
				giftDetails = {amount:'50',name:'Gift Certificate $80'};
				break;				
			  case '70006':
				giftDetails = {amount:'60',name:'Gift Certificate $60'};
				break;				
			  case '70007':
				giftDetails = {amount:'70',name:'Gift Certificate $70'};
				break;				
			  case '70008':
				giftDetails = {amount:'80',name:'Gift Certificate $80'};
				break;
			  case '70009':
				giftDetails = {amount:'90',name:'Gift Certificate $90'};
				break;				
			  case '70010':
				giftDetails = {amount:'100',name:'Gift Certificate $100'};
				break;				
			  case '70011':
				giftDetails = {amount:'110',name:'Gift Certificate $110'};
				break;
			  case '70012':
				giftDetails = {amount:'120',name:'Gift Certificate $120'};
				break;				
			  case '70013':
				giftDetails = {amount:'130',name:'Gift Certificate $130'};
				break;				
			  case '70014':
				giftDetails = {amount:'140',name:'Gift Certificate $140'};
				break;				
			  case '70015':
				giftDetails = {amount:'150',name:'Gift Certificate $150'};
				break;				
			  case '70016':
				giftDetails = {amount:'160',name:'Gift Certificate $160'};
				break;				
			  case '70017':
				giftDetails = {amount:'170',name:'Gift Certificate $170'};
				break;				
			  case '70018':
				giftDetails = {amount:'180',name:'Gift Certificate $180'};
				break;				
			  case '70019':
				giftDetails = {amount:'190',name:'Gift Certificate $190'};
				break;				
			  case '70020':
				giftDetails = {amount:'200',name:'Gift Certificate $200'};
				break;					
			  case '70021':
				giftDetails = {amount:'210',name:'Gift Certificate $210'};
				break;					
			  case '70022':
				giftDetails = {amount:'220',name:'Gift Certificate $220'};
				break;					
			  case '70023':
				giftDetails = {amount:'230',name:'Gift Certificate $230'};
				break;					
			  case '70024':
				giftDetails = {amount:'240',name:'Gift Certificate $240'};
				break;					
			  case '70025':
				giftDetails = {amount:'250',name:'Gift Certificate $250'};
				break;					
			  case '70026':
				giftDetails = {amount:'300',name:'Gift Certificate $300'};
				break;								
			}
			return giftDetails;
		},
		
		balance: function(gift_code,storeID,options) {
			this.options = {};
			Object.extend(this.options, options || {});
			(storeID=='US') ? StoreID = 'USA' : StoreID='CAN';
			var formParams = 'gCCheck=1&Code='+gift_code+'&StoreID='+storeID;
			new Ajax.Request(
			  this.url, 
			  	{
					method: 'post', 
					parameters: formParams + '&nc='+noCache(), 
					onComplete: this.balance_complete.bindAsEventListener(this,{onSuccess:this.options.onSuccess,onFailure:this.options.onFailure,code:gift_code})
				});	
		},
		
		balance_complete: function(response,parameterOptions) {
			var options = {};Object.extend(options, parameterOptions || {});
			try {
	            var amount 	= 0;
				var code	= options.code;
				var x 		= response.responseXML.getElementsByTagName('Amount');
				if(x.length>0) {
					amount = getNodeValue(x[0]);
					if(options.onSuccess) eval(options.onSuccess);
				}
				else {
					if(options.onFailure) eval(options.onFailure);
				}
			}
			catch(err) {
				if(options.onFailure) eval(options.onFailure);
			}
		},
	
		empty: function() {
			try {
				this.basket.empty();
				return true;
			}
			catch(err) {
				return false;
			}
		},	
	
		getItems: function() {
			return this.basket.getKeys();
		},
		
		getContentObj: function() {
			return this.basket.getPack()
		},
		
		getItemByCode: function(code) {
			return this.basket.get(code);
		},
				
		getTotal: function() {
			var gcList 	= this.getItems();
			var total	= 0;
			for(var i=0;i<gcList.length;i++) {
				obj	= this.getItemByCode(gcList[i]);
				total = total + parseFloat(obj.amount);
			}
			return total;
		}
	};

	var promoManager = Class.create();
		promoManager.prototype = {
		initialize: function(options) {
			this.basket = new CookieJar('promotion',{  
			    expires:dateAdd('d', 90, new Date() ),     
			    path:'/'
			}); 
			this.url = '/ajax/data/';	
		},
	
	    add: function(code,optionalParams) {
			var options = {};Object.extend(options, optionalParams || {});
			new Ajax.Request(
			this.url+'promo_'+code+'.xml', 
				{
				method: 'post',  
				onSuccess: this.process_success.bindAsEventListener(this,options),
				onFailure: this.process_fail.bindAsEventListener(this,options)
				}
	   		);
	    },
	
		getItemByCode: function(code) {
			return this.basket.get(code);
		},
	
		getContentObj: function() {
			return this.basket.getPack()
		},
			
	    process_success: function(xml,optionalParams) {
			try {
				var options = {};Object.extend(options, optionalParams || {});
		        var rules       = xml.responseXML.getElementsByTagName('rules');
		        var identity    = xml.responseXML.getElementsByTagName('identity');
		        if(rules.length>0 && identity.length>0) {
					this.empty();//no promo combinations so clear out previously entered promo codes
		            if(getNodeValueByChildName(rules[0],'country')==getCountry()) {
		                this.basket.put(getNodeValueByChildName(identity[0],'code'),{
		                    min_purchase: getNodeValueByChildName(rules[0],'min-purchase') ,
		                    country: getNodeValueByChildName(rules[0],'country'),
		                    uses: getNodeValueByChildName(rules[0],'uses'),            
		                    type: getNodeValueByChildName(rules[0],'type'),
		                    unit: getNodeValueByChildName(rules[0],'unit'),
		                    amount: getNodeValueByChildName(rules[0],'amount'),
		                    apply_to: getNodeValueByChildName(rules[0],'apply-to'),
		                    valid_from: getNodeValueByChildName(rules[0],'valid-from'),
							valid_until: getNodeValueByChildName(rules[0],'valid-until'),
							description: getNodeValueByChildName(identity[0],'description')
		                 });
						var display 		= new painter();
						var promoValid 		= cart.calculatePromotion(cart.getSubTotal({where:'product_shipping!=\'digital\''}));
						if('error' in promoValid) {
							this.empty();
							alert(promoValid.message);
						}
		            }
		        }
				if(options.onSuccess) eval(options.onSuccess);
			}
			catch(err) {}

	    },
		
		process_fail: function(xml,optionalParams) {
			var options = {};Object.extend(options, optionalParams || {});
			if(options.onFailure) eval(options.onFailure);
		},
		
		empty: function() {
			try {
				this.basket.empty();
				return true;
			}
			catch(err) {
				return false;
			}
		}  
	};

	/*
	Created By: Chris Campbell
	Website: http://particletree.com
	Date: 2/1/2006
	Inspired by the lightbox implementation found at http://www.huddletogether.com/projects/lightbox/
	*/	
	//Browser detect script origionally created by Peter Paul Koch at http://www.quirksmode.org/
	function getBrowserInfo() {
		if (checkIt('konqueror')) {
			browser = "Konqueror";
			OS = "Linux";
		}
		else if (checkIt('safari')) browser 	= "Safari";
		else if (checkIt('omniweb')) browser 	= "OmniWeb";
		else if (checkIt('opera')) browser 		= "Opera";
		else if (checkIt('webtv')) browser 		= "WebTV";
		else if (checkIt('icab')) browser 		= "iCab";
		else if (checkIt('msie')) browser 		= "Internet Explorer";
		else if (!checkIt('compatible')) {
			browser = "Netscape Navigator";
			version = detect.charAt(8);
		}
		else browser = "An unknown browser";
	
		if (!version) version = detect.charAt(place + thestring.length);
	
		if (!OS) {
			if (checkIt('linux')) OS 		= "Linux";
			else if (checkIt('x11')) OS 	= "Unix";
			else if (checkIt('mac')) OS 	= "Mac";
			else if (checkIt('win')) OS 	= "Windows";
			else OS 								= "an unknown operating system";
		}
	};
	
	function checkIt(string) {
		place = detect.indexOf(string) + 1;
		thestring = string;
		return place;
	};
	
	/*-----------------------------------------------------------------------------------------------*/
	
	Event.observe(window, 'load', initialize, false);
	Event.observe(window, 'load', getBrowserInfo, false);
	Event.observe(window, 'unload', Event.unloadCache, false);
	
	var lightbox = Class.create();
	
	lightbox.prototype = {
		yPos : 0,
		xPos : 0,
		
		initialize: function(ctrl, params) {
			this.content = ctrl.href;
			this.params = {};
			this.elem = ctrl;
			this.activateRef = this.activate.bindAsEventListener(this);
			if (ctrl.onclick) {
				this.oldonclick = ctrl.onclick;
			}
			Object.extend(this.params, params || {});
			Event.observe(ctrl, 'click', this.activateRef, false);
			ctrl.onclick = function(){return false;};
		},
		
		// Turn everything on - mainly the IE fixes
		activate: function(event) {
			if (browser == 'Internet Explorer' && navigator.appVersion.substr(22,3) == "6.0") {
				this.getScroll();
				this.prepareIE('100%', 'hidden');
				this.setScroll(0,0);
				this.hideSelects('hidden');
			}
			this.displayLightbox("block");
		},
		
		// Ie requires height to 100% and overflow hidden or else you can scroll down past the lightbox
		prepareIE: function(height, overflow) {
			bod = document.getElementsByTagName('body')[0];
			bod.style.height = height;
			bod.style.overflow = overflow;
			htm = document.getElementsByTagName('html')[0];
			htm.style.height = height;
			htm.style.overflow = overflow; 
		},
		
		// In IE, select elements hover on top of the lightbox
		hideSelects: function(visibility) {
			selects = document.getElementsByTagName('select');
			for(i = 0; i < selects.length; i++) {
				selects[i].style.visibility = visibility;
			}
		},
		
		// Taken from lightbox implementation found at http://www.huddletogether.com/projects/lightbox/
		getScroll: function() {
			if (self.pageYOffset) {
				this.yPos = self.pageYOffset;
			} else if (document.documentElement && document.documentElement.scrollTop){
				this.yPos = document.documentElement.scrollTop; 
			} else if (document.body) {
				this.yPos = document.body.scrollTop;
			}
		},
		
		setScroll: function(x, y) {
			window.scrollTo(x, y); 
		},
		
		displayLightbox: function(display) {
			$('overlay').style.display = display;
			if (!this.params.nodisplay || display == 'none') {
				if (display == 'none') {
					$('lightbox').style.top = null;
					$('lightbox').style.left = null;
					$('lightbox').style.width = null;
					$('lightbox').style.height = null;
				}
				$('lightbox').style.display = display;
			}
			if (this.params.nodisplay && display == 'block') {
				centerElem($('lightbox'));
				$('lightbox').style.display = 'block'; 
			}
			if (!this.params.noOverlayClick && display != 'none') {
				$('overlay').className = 'lbAction';
				$('overlay').rel = 'deactivate';
			}
			if (display != 'none' && !this.params.noAjax) {
				this.loadInfo();
			}		
		},
		
		// Begin Ajax request based off of the href of the clicked linked
		loadInfo: function() {
			var myAjax = new Ajax.Request( this.content,
	        	{method: 'post', parameters: "", onComplete: this.processInfo.bindAsEventListener(this)});
		},
		
		// Display Ajax response and Close Button
		processInfo: function(response) {
			if (this.params.nodisplay) $('lightbox').style.display = 'none';
			if ($('lbContent')) Element.remove($('lbContent'));
			info = "<div id='lbContent'>"+response.responseText+"</div>";
			new Insertion.Before($('lbLoadMessage'), info);
			$('lightbox').className = "done";
			if (this.params.oncomplete) { this.params.oncomplete(); }
			this.actions();			
		},
		
		// Search through new links within the lightbox, and attach click event
		actions: function() {
			lbActions = document.getElementsByClassName('lbAction');
			for(i = 0; i < lbActions.length; i++) {
				if (lbActions[i].id == 'overlay') {
					lbActions[i].onclick = this[lbActions[i].rel].bindAsEventListener(this);
				} else {
					Event.observe(lbActions[i], 'mousedown', this[lbActions[i].rel].bindAsEventListener(this), false);
					lbActions[i].onclick = function(){return false;};
				}
			}
	
		},
		
		// Example of creating your own functionality once lightbox is initiated
		insert: function(e) {
		   var link = Event.element(e).parentNode;
		   Element.remove($('lbContent'));
		 
		   var myAjax = new Ajax.Request(
				  link.href,
				  {method: 'post', parameters: "", onComplete: this.processInfo.bindAsEventListener(this)}
		   );
		 
		},
		
		// Example of creating your own functionality once lightbox is initiated
		deactivate: function(e) {
			if ($('lbContent')) Element.remove($('lbContent'));
			if (browser == "Internet Explorer" && navigator.appVersion.substr(22,3) == "6.0"){
				this.setScroll(0,this.yPos);
				this.prepareIE("auto", "auto");
				this.hideSelects("visible");
			}
			this.displayLightbox("none");
			$('lightbox').className = 'loading';
		},
		
		removeListener: function (restoreOld) {
			Event.stopObserving(this.elem, 'click', this.activateRef, false);
			if (restoreOld && this.oldonclick) {
				this.elem.onclick = this.oldonclick;
			}
		}
	};
	/*-----------------------------------------------------------------------------------------------*/
	
	// Onload, make all links that need to trigger a lightbox active
	function initialize(){
		addLightboxMarkup();
		lbox = document.getElementsByClassName('lbOn');
		for(i = 0; i < lbox.length; i++) {
			valid = new lightbox(lbox[i]);
		}
	};
	
	// Add in markup necessary to make this work. Basically two divs:
	// Overlay holds the shadow
	// Lightbox is the centered square that the content is put into.
	function addLightboxMarkup() {
		bod 				= document.getElementsByTagName('body')[0];
		overlay 			= document.createElement('div');
		overlay.id		= 'overlay';	
		lb					= document.createElement('div');
		lb.id				= 'lightbox';
		lb.className 	= 'loading';
		lb.innerHTML	= '<div id="lbLoadMessage">' +
							  '<p>Loading</p>' +
							  '</div>';
		bod.appendChild(overlay);
		bod.appendChild(lb);
	};
	// ************** end of lightbox ************** //
	
	//cdaCommon.js
	function addMetaNode(name, content) {
		if (!name || !content) return;
		var head = document.getElementsByTagName('head');
		if (head.length) {
			var metaTag = document.createElement('meta');
			metaTag.setAttribute('name', name);
			metaTag.setAttribute('content', content);
			head[0].appendChild(metaTag);
		}
	};
	function sfHover(){
		if(document.getElementById('main_navigation')){
			new Ajax.Request
			(
			'/global/subnav.xml',
			{
				method: 'get',
				parameters:'nC='+noCache(),
				onSuccess:function(t){
					var mainNav = $('main_navigation');
					mainNav.innerHTML=renderMainNavigation(t,0);
					mainNav.firstChild.lastChild.firstChild.className += ' last';
				}
			});	
		}
	};
	function sfIeHover(){
		if(document.getElementById('main_navigation')){
			new Ajax.Request
			(
			'/global/subnav.xml',
			{
				method: 'get',
				parameters:'nC='+noCache(),
				onSuccess:function(t){
					$('main_navigation').innerHTML=renderMainNavigation(t,0);
					$('main_navigation').firstChild.lastChild.firstChild.className += ' last';
					// Support the standard nav without a class of nav.
					var el = document.getElementById("nav");
					if(!/\bnav\b/.test(el.className) && el.tagName == "UL")
						setIeHover(el);
				
					// Find all unordered lists.
					var ieNavs = document.getElementsByTagName('ul');
					for(i=0; i<ieNavs.length; i++) {
						var ul = ieNavs[i];
						// If they have a class of nav add the menu hover.
						if(/\bnav\b/.test(ul.className))
							setIeHover(ul);
					}
				}
			});	
		}
	};
	function setIeHover(nav) {
		var ieULs = nav.getElementsByTagName('ul');
		if (navigator.appVersion.substr(22,3)!="5.0") {
			// IE script to cover <select> elements with <iframe>s
			for (j=0; j<ieULs.length; j++) {
				/*
				var ieMat=document.createElement('iframe');
				if(document.location.protocol == "https:")
					ieMat.src="//0";
				else if(window.opera != "undefined")
					ieMat.src="";
				else
					ieMat.src="javascript:false";
				ieMat.scrolling="no";
				ieMat.frameBorder="0";
				ieMat.style.width=ieULs[j].offsetWidth+"px";
				ieMat.style.height=ieULs[j].offsetHeight+"px";
				ieMat.style.zIndex="-1";
				ieULs[j].insertBefore(ieMat, ieULs[j].childNodes[0]);
				ieULs[j].style.zIndex="101";
				*/
			}
			// IE script to change class on mouseover
			var ieLIs = nav.getElementsByTagName('li');
			for (var i=0; i<ieLIs.length; i++) {
				if (ieLIs[i]) { 
					// Add a sfhover class to the li
					ieLIs[i].onmouseover=function() { 
						if(!/\bsfhover\b/.test(this.className)) {
							this.className+=" sfhover";
						}
					};
					ieLIs[i].onmouseout=function() {
						if(!this.contains(event.toElement)) {
							this.className=this.className.replace(' sfhover', '');
						}
					};
				}
			}
		}
	};

	function sendmailSubmit(fObj) {
		if (checkForm(fObj)) {
			fObj.submit();
		}
	};
		   	
	function ajaxRequest_Error(){alert("An error occurred during the process");};
	function search_Submit(sObj){
		if($F(sObj)!=''){
			if(document.getElementById('page_id')) 
				document.location.href='/search.jsp?kword='+$F(sObj)+'&page_id='+$F('page_id');
			else 
				document.location.href='/search.jsp?kword='+$F(sObj);
		}
		else{
			alert('Please enter a keyword');
		}
	};
	
	function search_Page(pNum,sObj){$('page_id').value=pNum;search_Submit(sObj);};							
	function renderMainNavigation(req,parent_id){
		var tmp			= '';
		var subTmp		= '';
		var subNodes	= '';
		var k			= req.responseXML.getElementsByTagName('nav');
		var navLen		= k.length;
		var topLevelCnt	= 0;
		for(var j=0;j<k.length;j++){
			tmp					= '';
			subNodes			= '';
			var nLabel			= getNodeAttribute(k[j],'label');
			var nUrl			= getNodeAttribute(k[j],'url');
			var popup			= getNodeAttribute(k[j],'popup');
			var popupWidth		= getNodeAttribute(k[j],'width');
			var popupHeight		= getNodeAttribute(k[j],'height');
			var popupScroll		= getNodeAttribute(k[j],'scroll');
			var popupToolbar	= getNodeAttribute(k[j],'toolbar');
			var popupResize		= getNodeAttribute(k[j],'resize');
			var nParent			= getNodeAttribute(k[j],'parent_id');
			var nOrder			= getNodeAttribute(k[j],'order');
			var nId				= getNodeAttribute(k[j],'nav_id');
			var topImg			= 'top_'+nId;
			if(nParent==parent_id){
				if(parent_id==0){
					topLevelCnt++;
					if(popup=='1') {
						tmp+='<a class="item'+ topLevelCnt + '" href="#" onclick="open_win('
							+ '\'' + nUrl + '\','+'\''+nLabel+'\','
							+ '\'toolbar=' + popupToolbar
							+ ',scrollbars='+popupScroll+','
							+ 'location=0,resizable='+popupResize+','
							+ 'width='+popupWidth
							+ ',height='+popupHeight
							+ '\');this.blur();return false;">';
					} else {
						if (/seating/i.test(nLabel)) {
							tmp += '<a id="seating-menu" class="item'+ topLevelCnt + '" href="'+nUrl+'">';
						} else { 
							tmp += '<a class="item'+ topLevelCnt + '" href="'+nUrl+'">';
						}
					}
					tmp += '<span>' + nLabel + '</span></a>';
					subNodes = renderMainNavigation_sub1(req,nId,topImg);
					if(subNodes!='')
						tmp+='<ul>'+subNodes+'</ul>';
				}
			}
			if(tmp!='')
				subTmp += '<li class="item'+ topLevelCnt + '">'+tmp+'</li>';
		}
		return '<ul id="nav" class="nav">'+subTmp+'</ul>';
	};
	
	function renderMainNavigation_sub1(req,parent_id,mainImage){
		var tmp			= '';
		var subTmp		= '';
		var subNodes	= '';
		var k			= req.responseXML.getElementsByTagName('nav');
		for(var j=0;j<k.length;j++){
			tmp	='';
			subNodes='';
			var nLabel			= getNodeAttribute(k[j],'label');
			var nUrl			= getNodeAttribute(k[j],'url');
			var popup			= getNodeAttribute(k[j],'popup');
			var popupWidth		= getNodeAttribute(k[j],'width');
			var popupHeight		= getNodeAttribute(k[j],'height');
			var popupScroll		= getNodeAttribute(k[j],'scroll');
			var popupToolbar	= getNodeAttribute(k[j],'toolbar');
			var popupResize		= getNodeAttribute(k[j],'resize');
			var nParent			= getNodeAttribute(k[j],'parent_id');
			var nOrder			= getNodeAttribute(k[j],'order');
			var nId				= getNodeAttribute(k[j],'nav_id');
			if(nParent==parent_id){
				tmp+='<li>';
				if(popup=='1')
					tmp+='<a href="#" '
					 + 'onclick="open_win(\'' + nUrl + '\',\''+nLabel+'\',\'toolbar='
					 + popupToolbar+',scrollbars='+popupScroll+',location=0,resizable='
					 + popupResize+',width='+popupWidth+ ',height='+popupHeight
					 + '\');this.blur();return false;">' + nLabel + '</a>';
				else
					tmp+='<a href="'+nUrl+'">' + nLabel + '</a>';
					
				subNodes=renderMainNavigation_sub2(req,nId);
				if(subNodes!='')
					tmp+='<ul>'+subNodes+'</ul>\n';
			}
			if(tmp!='')
				subTmp+=tmp+'</li>\n';
		}
		return subTmp;
	};
	
	function renderMainNavigation_sub2(req,parent_id){
		var tmp='';
		var subTmp='';
		var k=req.responseXML.getElementsByTagName('nav');
		for (var j=0;j<k.length;j++){
			tmp='';
			var nLabel=getNodeAttribute(k[j],'label');
			var nUrl=getNodeAttribute(k[j],'url');
			var popup=getNodeAttribute(k[j],'popup');
			var popupWidth=getNodeAttribute(k[j],'width');
			var popupHeight=getNodeAttribute(k[j],'height');
			var popupScroll=getNodeAttribute(k[j],'scroll');
			var popupToolbar=getNodeAttribute(k[j],'toolbar');
			var popupResize=getNodeAttribute(k[j],'resize');
			var nParent=getNodeAttribute(k[j],'parent_id');
			var nOrder=getNodeAttribute(k[j],'order');
			var nId=getNodeAttribute(k[j],'nav_id');
			if(nParent==parent_id){
				tmp+='<li>';
				if(popup=='1'){
					tmp += '<a href="#" onclick="open_win('+'\''+nUrl+'\','+'\''+nLabel+'\','
					+ '\'toolbar='+popupToolbar+','+'scrollbars='+popupScroll+','+'location=0,'
					+ 'resizable='+popupResize+','+'width='+popupWidth+','+'height='+popupHeight
					+ '\');this.blur();return false;">' + nLabel + '</a>';
				}
				else{
					tmp+='<a href="'+nUrl+'">' + nLabel + '</a>';
				}
				if(tmp!=''){
					tmp+='</li>\n';
				}
			}
			if(tmp!=''){
				subTmp+=tmp;
			}
		}
		return subTmp;
	};
		
	//ip_common.js
	function newWindow(wURL,wName,wWidth,wHeight,wScroll,wResizable,wCentered){
		var settings = 'height='+wHeight+',width='+wWidth+'scrollbars='+wScroll+',resizable='+wResizable;
		if(wCentered==true){
			lPosition	= (screen.width) ? (screen.width-wWidth)/2 : 0;
			tPosition	= (screen.height) ? (screen.height-wHeight)/2 : 0;	
			settings	+= ',left=' + lPosition + ',top=' + tPosition;
		}
		var nWindow	= window.open(wURL,wName,settings);
		nWindow.focus();
	};
	
	function disableContextMenu(event) {
		Event.stop(event); 
    	event.oncontextmenu = function(){return false;}
	};
		
	function truncateText_Append(txtString,len,append){
		  var trunc = txtString;
		  if (trunc.length > len){
		    trunc = trunc.substring(0, len);
		    trunc = trunc.replace(/\w+$/, '');
		    trunc += append;
		  }
		  return trunc;
	};

	function getPage(url){return url.substring(url.lastIndexOf('/') + 1);};
	
	function hasZero(value){
		if(value+0<10)
			return '0' + value;
		else
			return '' + value;
	};
	
	function noCache(){return Math.random(0, 1000)+'='+Math.random(0,1000);};
	function uniqueId(){return Math.random(0, 1000);};
	function addDays(myDate,days){return new Date(myDate.getTime() + days*24*60*60*1000);};	

	function getMetaValue(metaName){
		var metaArray = document.getElementsByTagName('meta');
		for(m=0;m<metaArray.length;m++){
			if(metaArray[m].name==metaName) {
				return metaArray[m].content;
				break;
			}	
		}
		return false;
	};
					
	function getFileExtension(fileName){
		if( fileName.length == 0 ) return ''; 
		var dot = fileName.lastIndexOf('.'); 
		if( dot == -1 ) return ''; 
		return fileName.substr(dot,fileName.length); 
	};

	function SearchAndReplace(Content, SearchFor, ReplaceWith){
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
	};
	
	function createCookie(name,value,days){
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = '; expires='+date.toGMTString();
		}
		else var expires = '';
		document.cookie = name+'='+value+expires+'; path=/';
	};
	
	function readCookie(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for(var i=0;i<ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	};
	
	function eraseCookie(name){createCookie(name,'',-1);};
	
	function parseCookie() {
		var x = new Object();
		var y = readCookie('olio');
		if (y) {
			var tmp = y.split("|");
			if (tmp.length == 5) {
				x['userid'] = tmp[0]; 
				x['username'] = tmp[1];
				x['email'] = tmp[2];
				x['fname'] = tmp[3];
				x['lname'] = tmp[4];
			}
		}
		return x;
	};
	
	function loadScript(url, callback) {
		var f = arguments.callee;
		if (!("queue" in f))
			f.queue = {};
		var queue =  f.queue;
		if (url in queue) {
			if (callback) {
				if (queue[url])
					queue[url].push(callback);
				else
					callback();
			}
			return;
		}
		queue[url] = callback ? [callback] : [];
		var script = document.createElement("script");
		script.type = "text/javascript";
		if (/WebKit/i.test(navigator.userAgent)) {
			var _timer = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(_timer);
					while (queue[url].length) {
						queue[url].shift()();
					}
					queue[url] = null;
				}
			}, 1000);
		} else {
			script.onload = script.onreadystatechange = function() {
				if (script.readyState && script.readyState != "loaded" && script.readyState != "complete")
					return;
				script.onreadystatechange = script.onload = null;
				while (queue[url].length) {
					queue[url].shift()();
				}
				queue[url] = null;
			};
		}
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	};

	// ip_xml.js
	function getPropertyNodeByName(object,name){try{var propertyNode=object.getElementsByTagName(get_firstchild(object).nodeName);var propertyLen=propertyNode.length;for(var j=0;j<propertyLen;j++){switch(getNodeAttribute(propertyNode[j],'name')){case name:return getNodeValue(propertyNode[j]);break;}}}catch(err){return '';}};
	function getNodeValueByChildName(node,childname){var tmpString='';try{if(node.getElementsByTagName(childname)[0].firstChild.nodeValue=='null'){return '';}else{for(var i=0;i<node.getElementsByTagName(childname)[0].childNodes.length;i++){tmpString+=node.getElementsByTagName(childname)[0].childNodes[i].nodeValue;}return tmpString;}}catch(err){return '';}};
	function getNodeValue(node){var tmpString='';try{for(var i=0;i<node.childNodes.length;i++){tmpString+=node.childNodes[i].nodeValue;}return tmpString;}catch(err){return '';}};
	function getNodeChildObj(obj,tag){var tmpString='';try{if(obj.getElementsByTagName(tag)[0].firstChild.nodeValue=='null')return '';else{return obj.getElementsByTagName(tag);}}catch(err){return '';}};
	function getNodeName(obj){return obj.firstChild.nodeName;};
	function getNodeAttribute(obj,attr){try{return obj.getAttribute(attr);}catch(err){return '';}};
	function get_firstchild(n){try{var x=n.firstChild;while(x.nodeType!=1){x=x.nextSibling;}return x;}catch(err){return '';}};
	function hasChildElements(rootNode){try{for(var i=0;i<rootNode.childNodes.length;i++){if(rootNode.childNodes[i].nodeType == 1){return true;}}return false;}catch(err){return '';}};

	//ip_select.js
	function hasOptions(obj){if(obj!=null&&obj.options!=null){return true;}else{return false};};
	function selectMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,'select',false);};
	function selectOnlyMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,'select',true);};
	function unSelectMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,'unselect',false);};
	function selectUnselectMatchingOptions(obj,regex,which,only){if(window.RegExp){if(which=='select'){var selected1=true;var selected2=false;}else if(which=='unselect'){var selected1=false;var selected2=true;}else{return;}var re=new RegExp(regex);if(!hasOptions(obj))return;for(var i=0;i<obj.options.length;i++){if(re.test(obj.options[i].value))obj.options[i].selected=selected1;else {if(only==true) obj.options[i].selected=selected2;}}}};
	function removeSelectedOptions(from){if(!hasOptions(from)){return;}if(from.type=="select-one"){from.options[from.selectedIndex]=null;}else{for(var i=(from.options.length-1);i>=0;i--){var o=from.options[i];if(o.selected)from.options[i]=null;}}from.selectedIndex=-1;};
	function removeAllOptions(from){if(!hasOptions(from))return;for(var i=(from.options.length-1);i>=0;i--){from.options[i]=null;}from.selectedIndex=-1;};
	function addOption(obj,text,value,selected){if(obj!=null&&obj.options!=null)obj.options[obj.options.length]=new Option(text,value,selected);};
	function removeOption(fOBJ,value){for(i=0;i<fOBJ.options.length;i++){if(fOBJ.options[i].value==value)fOBJ.options[i]=null;}};
	function getSelectList(fOBJ){var pars='';for(i=0;i<fOBJ.length;i++){if(i>0)pars=pars+',';pars=pars+fOBJ.options[i].value;}return pars;};
	function getSelectListSelected(fOBJ){var pars='';var count=0;for(i=0;i<fOBJ.length;i++){if(fOBJ.options[i].selected==true){if(count>0)pars=pars+',';count++;pars=pars+fOBJ.options[i].value;}}return pars;};
	function display_Select(sOptions,sSelected){var tmpData='';var x=sOptions.split(',');for(var i=0;i<x.length;i++){var sltcd='';var items=x[i].split('|');if(items[0]==sSelected)sltcd='selected="selected"';tmpData+='<option value="'+items[0]+'" '+sltcd+'>'+items[1]+'</option>';}return tmpData;};
		
	// ip_form.xml
	var dfltValue   = '**NO VALUE**';
	var dfltChars   = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.?-()[]+=_-;:/#@$%&!,*<>\"\'\n\r ';
	var dfltMethod  = 'POST';
	function checkForm(object){var response=true;for(var i=0;i<object.elements.length;i++){if(checkFormElement(object.elements[i])==false){response=false;break;}}return response;};
	
	function checkFormElement(elementObj,options) {
		this.options = {};
		Object.extend(this.options, options || {});
		var response = true;
		if(elementObj.attributes['id']) {
			theO		= $(elementObj);
			oType		= theO.type;
	        oName  		= theO.attributes['id'].value;
			theO.name 	= oName;
	        oValue 		= $F(theO);
			if(this.options.required=='true') {
				oReqd=true;
			}
			else {
				(theO.attributes["required"]) ? oReqd=true : oReqd=false;
			}
		   	(theO.attributes["alert"]) ? oAlert=theO.attributes['alert'].value : oAlert ='';
			(theO.attributes["highlight"]) ? oHighlight=theO.attributes['highlight'].value : oHighlight='';
	       	(theO.attributes["chars"]) ? oChars=theO.attributes['chars'].value : oChars=dfltChars;
	        (theO.attributes["editor"]) ? oEditor=true : oEditor=false;
	        (theO.attributes["parent"]) ? oParent=theO.attributes['parent'].value : oParent='';
			(theO.attributes["minLen"]) ? oMin=theO.attributes['minLen'].value : oMin=1;
	        (theO.attributes["maxLen"]) ? oMax=theO.attributes['maxLen'].value : oMax=100;
			if(oReqd==true||(document.getElementById(oParent)&&oParent!=''&&$(oParent).checked==true)||oAlert!='') {
	        	if(oEditor==true) {
					var tmpValue = getEditor(oName);
					if(tmpValue.length<oMin || tmpValue.length>oMax) {
						response=false;
						if(oHighlight!='') theO.className = oHighlight;
						if(oAlert!='') alert(oAlert);
					}
	        	}
				else if(oType.indexOf('select-single')>-1 && oValue=="") {
					response=false;
					if(oHighlight!='') {
						theO.addClassName(oHighlight);
					}
					if(oAlert!='') alert(oAlert);
				}
				else if(oType.indexOf('select-multiple')>-1) {
					if(oValue=='') {
						response=false;
						if(oHighlight!='') {
							theO.addClassName(oHighlight);
						}
						if(oAlert!='') alert(oAlert);
					}
					else {
						if(oValue.indexOf(',')>-1 && oMin>1) {}
					}
				}
	        	else {
		            if(oName.toLowerCase().indexOf('email')>-1) { 
		                if(isValidEmail(oValue)==false) {
		                	response=false;
							if(oHighlight!='') theO.addClassName(oHighlight);
							if(oAlert!='') alert(oAlert);
		                }
		             } 
		             else if(validate(oValue,oChars)==false||oValue.length<oMin||oValue.length>oMax) {
		             	response=false;
						if(oHighlight!='') {
							theO.addClassName(oHighlight);
						}
						if(oAlert!='') alert(oAlert);
		             }
		     	}
	        }
		}	
		return response;
	};

	function isValidEmail(string){if(string.length<1)return false;if(string.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)!=-1){return true;}else{return false;}};
	function validate(strVl,strChrs){if(!strVl) return false;if(strVl==dfltValue)return false;if(strVl.length<1)return false;if(!strChrs) strChrs=dfltChars;for(i=0;i<strVl.length;i++){if(strChrs.indexOf(strVl.charAt(i))==-1)return false;}return true;};	

	// ip_demandletpnc
	var demandletManager = {
		loadJS: function(demandlet){
			var path = '/ipui/demandlets/';
			loadScript(path+demandlet+'.js',function(){demandletManager.start(demandlet);});		
		},
		loadDemandlet: function(demandlet){
			$$('.'+demandletManager.phrase+demandlet).each(function (item) { eval('initiate_' + demandlet + '(item);') });
		}, 
		load: function(){
			var demandletList = [];
			var demandlets  = $$('[class*='+demandletManager.phrase+']');
			var re = new RegExp("\\b"+demandletManager.phrase+"\\w*\\b");
			for (var i = 0; i < demandlets.length; i++) {
				var demandletName = demandlets[i].className.match(re)[0].split('-')[1];
				if (demandletList.join().indexOf(demandletName) == -1) {
					demandletList.push(demandletName);
				}
			}
			if (demandletList.length) {
		  		demandletList.join().split(',').each(function(demandlet){demandletManager.loadJS(demandlet);});
			}
		},
		phrase: 'demandlet-',
		start: function(demandlet){
			demandletManager.loadDemandlet(demandlet); 
		},
		setup: function(demandletObject){
			demandletObject.innerHTML 	= '';
			(demandletObject.getAttribute('id')) ? itemId=demandletObject.attributes['id'].value : itemId ='_'+uniqueId();
			demandletObject.setAttribute('id',itemId);
			return itemId;
		}
	};
	//ip_date.js
	function isDate(p_Expression){return !isNaN(new Date(p_Expression));};

	function dateAdd(p_Interval, p_Number, p_Date){
		if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		if(isNaN(p_Number)){return "invalid number: '" + p_Number + "'";}	
		p_Number = new Number(p_Number);
		var dt = new Date(p_Date);
		switch(p_Interval.toLowerCase()){
			case "yyyy": 
				dt.setFullYear(dt.getFullYear() + p_Number);
				break;
			case "q": 
				dt.setMonth(dt.getMonth() + (p_Number*3));
				break;
			case "m": 
				dt.setMonth(dt.getMonth() + p_Number);
				break;
			case "y":
			case "d":
			case "w": 
				dt.setDate(dt.getDate() + p_Number);
				break;
			case "ww": 
				dt.setDate(dt.getDate() + (p_Number*7));
				break;
			case "h": 
				dt.setHours(dt.getHours() + p_Number);
				break;
			case "n": 
				dt.setMinutes(dt.getMinutes() + p_Number);
				break;
			case "s": 
				dt.setSeconds(dt.getSeconds() + p_Number);
				break;
			case "ms": 
				dt.setMilliseconds(dt.getMilliseconds() + p_Number);
				break;
			default: 
				return "invalid interval: '" + p_Interval + "'";
		}
		return dt;
	};
	
	function dateDiff(p_Interval, p_Date1, p_Date2, p_firstdayofweek, p_firstweekofyear){
		if(!isDate(p_Date1)){return "invalid date: '" + p_Date1 + "'";}
		if(!isDate(p_Date2)){return "invalid date: '" + p_Date2 + "'";}
		var dt1 = new Date(p_Date1);
		var dt2 = new Date(p_Date2);
		var iDiffMS = dt2.valueOf() - dt1.valueOf();
		var dtDiff = new Date(iDiffMS);
		var nYears  = dt2.getUTCFullYear() - dt1.getUTCFullYear();
		var nMonths = dt2.getUTCMonth() - dt1.getUTCMonth() + (nYears!=0 ? nYears*12 : 0);
		var nQuarters = parseInt(nMonths/3);	
		var nMilliseconds = iDiffMS;
		var nSeconds = parseInt(iDiffMS/1000);
		var nMinutes = parseInt(nSeconds/60);
		var nHours = parseInt(nMinutes/60);
		var nDays  = parseInt(nHours/24);
		var nWeeks = parseInt(nDays/7);
		var iDiff = 0;		
		switch(p_Interval.toLowerCase()){
			case "yyyy": return nYears;
			case "q": return nQuarters;
			case "m": return nMonths;
			case "y": 
			case "d": return nDays;
			case "w": return nDays;
			case "ww":return nWeeks;	
			case "h": return nHours;
			case "n": return nMinutes;
			case "s": return nSeconds;
			case "ms":return nMilliseconds;
			default: return "invalid interval: '" + p_Interval + "'";
		}
	};

	function datePart(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear){
		if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		var dtPart = new Date(p_Date);
		switch(p_Interval.toLowerCase()){
			case "yyyy": return dtPart.getFullYear();
			case "q": return parseInt(dtPart.getMonth()/3)+1;
			case "m": return dtPart.getMonth()+1;
			case "y": return dateDiff("y", "1/1/" + dtPart.getFullYear(), dtPart);			// day of year
			case "d": return dtPart.getDate();
			case "w": return dtPart.getDay();	// weekday
			case "ww":return dateDiff("ww", "1/1/" + dtPart.getFullYear(), dtPart);		// week of year
			case "h": return dtPart.getHours();
			case "n": return dtPart.getMinutes();
			case "s": return dtPart.getSeconds();
			case "ms":return dtPart.getMilliseconds();	// millisecond	// <-- extension for JS, NOT available in VBScript
			default: return "invalid interval: '" + p_Interval + "'";
		}
	};
	// REQUIRES: isDate()
	// NOT SUPPORTED: firstdayofweek (does system default)
	function weekdayName(p_Date, p_abbreviate){
		if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		var dt = new Date(p_Date);
		var retVal = dt.toString().split(' ')[0];
		var retVal = Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')[dt.getDay()];
		if(p_abbreviate==true){retVal = retVal.substring(0, 3)}	// abbr to 1st 3 chars
		return retVal;
	};
	// REQUIRES: isDate()
	function monthName(p_Date, p_abbreviate){
		if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		var dt = new Date(p_Date);	
		var retVal = Array('January','February','March','April','May','June','July','August','September','October','November','December')[dt.getMonth()];
		if(p_abbreviate==true){retVal = retVal.substring(0, 3)}	// abbr to 1st 3 chars
		return retVal;
	};
	
	function DateAdd(p_Interval, p_Number, p_Date){return dateAdd(p_Interval, p_Number, p_Date);};
	function DateDiff(p_interval, p_date1, p_date2, p_firstdayofweek, p_firstweekofyear){return dateDiff(p_interval, p_date1, p_date2, p_firstdayofweek, p_firstweekofyear);};
	function DatePart(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear){return datePart(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear);};
	function getTimeFromDate(date_time){return hasZero(datePart('h', date_time)) + ":" + hasZero(datePart('n', date_time));};
	
	function parseDateObj(dateobj){
		var x = new Object();
		x['month'] = hasZero(dateobj.getMonth()-1);
		x['day'] = hasZero(dateobj.getDate());
		x['year'] = dateobj.getYear();
		x['hour'] = hasZero(dateobj.getHours());
		x['minute'] = hasZero(dateobj.getMinutes());
		x['second'] = hasZero(dateobj.getSeconds());
		return x;
	};
	
	function createDateObj(date_time){return new Date(Date.parse(date_time));};
	
	function convertTimeZone(dateObj, diff){
		var tmp = "";
		var plusminus = 1;
		if (diff.split("-").length > 1){
			tmp = diff.split("-")[1];
			plusminus = -1;
		} else if (diff.split("+").length > 1){
			tmp = diff.split("+")[1];
			plusminus = 1;
		}
		if (tmp.length){
			dateObj = dateAdd('n', plusminus * tmp.split(":")[1], dateObj);
			dateObj = dateAdd('h', plusminus * tmp.split(":")[0], dateObj);
		}
		return dateObj;
	};
	
	function convertToGMT(dateObj, diff){
		var tmp = "";
		var plusminus = 1;
		if (diff.split("-").length > 1){
			tmp = diff.split("-")[1];
			plusminus = 1;
		} else if (diff.split("+").length > 1){
			tmp = diff.split("+")[1];
			plusminus = -1;
		}
		if (tmp.length){
			dateObj = dateAdd('n', plusminus * tmp.split(":")[1], dateObj);
			dateObj = dateAdd('h', plusminus * tmp.split(":")[0], dateObj);
		}
		return dateObj;
	};
	function convertHours(p_Date) {
	    if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
	    var regHr = p_Date.getHours();
	    if (regHr == 0) regHr = 12;
	    else if (regHr > 12) regHr -= 12;
	    return regHr;
	};
	function showAMPM(p_Date) {
		if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
	    var amPM;
	    if (p_Date.getHours() < 12) amPM = 'AM';
	    else amPM = 'PM';
	    return amPM;
	};
	function dateInRange(dx, begin, end) {
	    if (!isDate(dx) || !isDate(begin) || !isDate(end)) { return false; }
	    return (dateDiff('n', begin, dx) >= 0 && dateDiff('n', dx, end) >= 0)?true:false;
	};
	/**
	 * SWFObject v1.4.4: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
	 *
	 * SWFObject is (c) 2006 Geoff Stearns and is released under the MIT License:
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * **SWFObject is the SWF embed script formerly known as FlashObject. The name was changed for
	 *   legal reasons.
	 */
	if(typeof deconcept=="undefined"){var deconcept=new Object();}
	if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}
	if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}
	deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a,_b){if(!document.getElementById){return;};
	this.DETECT_KEY=_b?_b:"detectflash";
	this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);
	this.params=new Object();
	this.variables=new Object();
	this.attributes=new Array();
	if(_1){this.setAttribute("swf",_1);}
	if(id){this.setAttribute("id",id);}
	if(w){this.setAttribute("width",w);}
	if(h){this.setAttribute("height",h);}
	if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}
	this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();
	if(c){this.addParam("bgcolor",c);}
	var q=_8?_8:"high";
	this.addParam("quality",q);
	this.setAttribute("useExpressInstall",_7);
	this.setAttribute("doExpressInstall",false);
	var _d=(_9)?_9:window.location;
	this.setAttribute("xiRedirectUrl",_d);
	this.setAttribute("redirectUrl","");
	if(_a){this.setAttribute("redirectUrl",_a);}};
	deconcept.SWFObject.prototype={setAttribute:function(_e,_f){
	this.attributes[_e]=_f;
	},getAttribute:function(_10){
	return this.attributes[_10];
	},addParam:function(_11,_12){
	this.params[_11]=_12;
	},getParams:function(){
	return this.params;
	},addVariable:function(_13,_14){
	this.variables[_13]=_14;
	},getVariable:function(_15){
	return this.variables[_15];
	},getVariables:function(){
	return this.variables;
	},getVariablePairs:function(){
	var _16=new Array();
	var key;
	var _18=this.getVariables();
	for(key in _18){_16.push(key+"="+_18[key]);}
	return _16;},getSWFHTML:function(){var _19="";
	if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
	if(this.getAttribute("doExpressInstall")){
	this.addVariable("MMplayerType","PlugIn");}
	_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\"";
	_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";
	var _1a=this.getParams();
	for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}
	var _1c=this.getVariablePairs().join("&");
	if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";
	}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");}
	_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\">";
	_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";
	var _1d=this.getParams();
	for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}
	var _1f=this.getVariablePairs().join("&");
	if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}
	return _19;
	},write:function(_20){
	if(this.getAttribute("useExpressInstall")){
	var _21=new deconcept.PlayerVersion([6,0,65]);
	if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){
	this.setAttribute("doExpressInstall",true);
	this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));
	document.title=document.title.slice(0,47)+" - Flash Player Installation";
	this.addVariable("MMdoctitle",document.title);}}
	if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){
	var n=(typeof _20=="string")?document.getElementById(_20):_20;
	n.innerHTML=this.getSWFHTML();return true;
	}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}
	return false;}};
	deconcept.SWFObjectUtil.getPlayerVersion=function(){
	var _23=new deconcept.PlayerVersion([0,0,0]);
	if(navigator.plugins&&navigator.mimeTypes.length){
	var x=navigator.plugins["Shockwave Flash"];
	if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}
	}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}
	catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
	_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}
	catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}
	catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}
	return _23;};
	deconcept.PlayerVersion=function(_27){
	this.major=_27[0]!=null?parseInt(_27[0]):0;
	this.minor=_27[1]!=null?parseInt(_27[1]):0;
	this.rev=_27[2]!=null?parseInt(_27[2]):0;
	};
	deconcept.PlayerVersion.prototype.versionIsValid=function(fv){
	if(this.major<fv.major){return false;}
	if(this.major>fv.major){return true;}
	if(this.minor<fv.minor){return false;}
	if(this.minor>fv.minor){return true;}
	if(this.rev<fv.rev){
	return false;
	}return true;};
	deconcept.util={getRequestParameter:function(_29){
	var q=document.location.search||document.location.hash;
	if(q){var _2b=q.substring(1).split("&");
	for(var i=0;i<_2b.length;i++){
	if(_2b[i].substring(0,_2b[i].indexOf("="))==_29){
	return _2b[i].substring((_2b[i].indexOf("=")+1));}}}
	return "";}};
	deconcept.SWFObjectUtil.cleanupSWFs=function(){if(window.opera||!document.all){return;}
	var _2d=document.getElementsByTagName("OBJECT");
	for(var i=0;i<_2d.length;i++){_2d[i].style.display="none";for(var x in _2d[i]){
	if(typeof _2d[i][x]=="function"){_2d[i][x]=function(){};}}}};
	deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};
	__flash_savedUnloadHandler=function(){};
	if(typeof window.onunload=="function"){
	var _30=window.onunload;
	window.onunload=function(){
	deconcept.SWFObjectUtil.cleanupSWFs();_30();};
	}else{window.onunload=deconcept.SWFObjectUtil.cleanupSWFs;}};
	if(typeof window.onbeforeunload=="function"){
	var oldBeforeUnload=window.onbeforeunload;
	window.onbeforeunload=function(){
	deconcept.SWFObjectUtil.prepUnload();
	oldBeforeUnload();};
	}else{window.onbeforeunload=deconcept.SWFObjectUtil.prepUnload;}
	if(Array.prototype.push==null){
	Array.prototype.push=function(_31){
	this[this.length]=_31;
	return this.length;};}
	var getQueryParamValue=deconcept.util.getRequestParameter;
	var FlashObject=deconcept.SWFObject;
	var SWFObject=deconcept.SWFObject;
	/**
	 * @author Ryan Johnson <ryan@livepipe.net>
	 * @copyright 2007 LivePipe LLC
	 * @package Control.Tabs
	 * @license MIT
	 * @url http://livepipe.net/projects/control_tabs/
	 * @version 2.1.0
	 */
	if(typeof(Control) == 'undefined')
		var Control = {};
	Control.Tabs = Class.create();
	Object.extend(Control.Tabs,{
		instances: [],
		findByTabId: function(id){
			return Control.Tabs.instances.find(function(tab){
				return tab.links.find(function(link){
					return link.key == id;
				});
			});
		}
	});
	Object.extend(Control.Tabs.prototype,{
		initialize: function(tab_list_container,options){
			this.activeContainer = false;
			this.activeLink = false;
			this.containers = $H({});
			this.links = [];
			Control.Tabs.instances.push(this);
			this.options = {
				beforeChange: Prototype.emptyFunction,
				afterChange: Prototype.emptyFunction,
				hover: false,
				linkSelector: 'li a',
				setClassOnContainer: false,
				activeClassName: 'active',
				defaultTab: 'first',
				autoLinkExternal: true,
				targetRegExp: /#(.+)$/,
				showFunction: Element.show,
				hideFunction: Element.hide
			};
			Object.extend(this.options,options || {});
			(typeof(this.options.linkSelector == 'string')
				? $(tab_list_container).getElementsBySelector(this.options.linkSelector)
				: this.options.linkSelector($(tab_list_container))
			).findAll(function(link){
				return (/^#/).exec(link.href.replace(window.location.href.split('#')[0],''));
			}).each(function(link){
				this.addTab(link);
			}.bind(this));
			this.containers.values().each(Element.hide);
			if(this.options.defaultTab == 'first')
				this.setActiveTab(this.links.first());
			else if(this.options.defaultTab == 'last')
				this.setActiveTab(this.links.last());
			else
				this.setActiveTab(this.options.defaultTab);
			var targets = this.options.targetRegExp.exec(window.location);
			if(targets && targets[1]){
				targets[1].split(',').each(function(target){
					this.links.each(function(target,link){
						if(link.key == target){
							this.setActiveTab(link);
							throw $break;
						}
					}.bind(this,target));
				}.bind(this));
			}
			if(this.options.autoLinkExternal){
				$A(document.getElementsByTagName('a')).each(function(a){
					if(!this.links.include(a)){
						var clean_href = a.href.replace(window.location.href.split('#')[0],'');
						if(clean_href.substring(0,1) == '#'){
							if(this.containers.keys().include(clean_href.substring(1))){
								$(a).observe('click',function(event,clean_href){
									this.setActiveTab(clean_href.substring(1));
								}.bindAsEventListener(this,clesetMinutesan_href));
							}
						}
					}
				}.bind(this));
			}
		},
		addTab: function(link){
			this.links.push(link);
			link.key = link.getAttribute('href').replace(window.location.href.split('#')[0],'').split('/').last().replace(/#/,'');
			this.containers[link.key] = $(link.key);
			link[this.options.hover ? 'onmouseover' : 'onclick'] = function(link){
				if(window.event)
					Event.stop(window.event);
				this.setActiveTab(link);
				return false;
			}.bind(this,link);
		},
		setActiveTab: function(link){
			if(!link)
				return;
			if(typeof(link) == 'string'){
				this.links.each(function(_link){
					if(_link.key == link){
						this.setActiveTab(_link);
						throw $break;
					}
				}.bind(this));
			}else{
				this.notify('beforeChange',this.activeContainer);
				if(this.activeContainer)
					this.options.hideFunction(this.activeContainer);
				this.links.each(function(item){
					(this.options.setClassOnContainer ? $(item.parentNode) : item).removeClassName(this.options.activeClassName);
				}.bind(this));
				(this.options.setClassOnContainer ? $(link.parentNode) : link).addClassName(this.options.activeClassName);
				this.activeContainer = this.containers[link.key];
				this.activeLink = link;
				this.options.showFunction(this.containers[link.key]);
				this.notify('afterChange',this.containers[link.key]);
			}
		},
		next: function(){
			this.links.each(function(link,i){
				if(this.activeLink == link && this.links[i + 1]){
					this.setActiveTab(this.links[i + 1]);
					throw $break;
				}
			}.bind(this));
			return false;
		},
		previous: function(){
			this.links.each(function(link,i){
				if(this.activeLink == link && this.links[i - 1]){
					this.setActiveTab(this.links[i - 1]);
					throw $break;
				}
			}.bind(this));
			return false;
		},
		first: function(){
			this.setActiveTab(this.links.first());
			return false;
		},
		last: function(){
			this.setActiveTab(this.links.last());
			return false;
		},
		notify: function(event_name){
			try{
				if(this.options[event_name])
					return [this.options[event_name].apply(this.options[event_name],$A(arguments).slice(1))];
			}catch(e){
				if(e != $break)
					throw e;
				else
					return false;
			}
		}
	});
	if (typeof(Object.Event) != 'undefined') {
		Object.Event.extend(Control.Tabs);
	}
	function centerElem(elem) {
		if (!elem) return false;
		var w = getWidth(elem);
		var h = getHeight(elem);
		var position = getStyle(elem, 'position');
		if (position && position == 'fixed') {
			var t = (windowHeight() /2) - (h/2);
			var l = (windowWidth() / 2) - (w/2);
		} else {
			var t = scrollY() +(windowHeight() /2) - (h/2);
			var l = scrollX() + (windowWidth() / 2) - (w/2);
		}
		if (t < 0) t = 0;
		if (l < 0) l = 0;
		elem.style.top = t + "px";
		elem.style.left = l + "px";
	};
	function getStyle(elem, name) {
	        if (elem.style[name]) return elem.style[name];
	        else if (elem.currentStyle) return elem.currentStyle[name];
	        else if (document.defaultView && document.defaultView.getComputedStyle) {
	                name = name.replace(/([A-Z])/g,"-1$");
	                name = name.toLowerCase();
	                var s = document.defaultView.getComputedStyle(elem,"");
	                return s && s.getPropertyValue(name);
	        } else return null;
	};

	function pageHeight() {
		return document.body.scrollHeight;
	};
	function pageWidth() {
		return document.body.scrollWidth;
	};
	function scrollX() {
        var de = document.documentElement;
        return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
	};
	function scrollY() {
	        var de = document.documentElement;
	        return self.pageYOffset || ( de && de.scrollTop) || document.body.scrollTop;
	};
	function getHeight(elem) {
	        if (getStyle(elem, 'display') != 'none')
	                return elem.offsetHeight || parseInt(getStyle(elem, 'height'));
	        var old = resetCSS(elem, {display:'block', visibility:'hidden', position:'absolute'});
	        var h = elem.clientHeight || parseInt(getStyle(elem, 'height'));
	        restoreCSS(elem, old);
	        return h;
	};
	function getWidth(elem) {
	        if (getStyle(elem, 'display') != 'none')
	                return elem.offsetWidth || parseInt(getStyle(elem, 'width'));
	        var old = resetCSS(elem, {display:'block', visibility:'hidden', position:'absolute'});
	        var w = elem.clientWidth || parseInt(getStyle(elem, 'width'));
	        restoreCSS(elem, old);
	        return w;
	};
	function resetCSS(elem, prop) {
	        var old = {};
	        for (var i in prop) {
	                old[i] = elem.style[i];
	                elem.style[i] = prop[i];
	        }
	        return old;
	};
	function restoreCSS(elem, prop) {
	        for (var i in prop)
	                elem.style[i] = prop[i];
	};
	function windowHeight() {
	        var de = document.documentElement;
	        return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
	};
	function windowWidth() {
	        var de = document.documentElement;
	        return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
	};
	function fadeUp(element,red,green,blue) {
		if (element.fade) {
			clearTimeout(element.fade);
		}
		element.style.backgroundColor = "rgb("+red+","+green+","+blue+")";
		if (red == 255 && green == 255 && blue == 255) {
			return;
		}
		var newred = red + Math.ceil((255 - red)/10);
		var newgreen = green + Math.ceil((255 - green)/10);
		var newblue = blue + Math.ceil((255 - blue)/10);
		var repeat = function() {
			fadeUp(element,newred,newgreen,newblue)
		};
		element.fade = setTimeout(repeat,50);
	};
	function prepareSearch() {
		dataManager.register(['/ajax/data/department.xml'], 
			function (xhr) {
		        var searchselect = $('searchselect');
		        if (xhr && xhr.responseXML) {
	                var rows = xhr.responseXML.documentElement.getElementsByTagName('row');
	                for (var i = 0; i < rows.length; i++) {
	                    var name = getNodeValueByChildName(rows[i], 'name');
	                    var category_id = getNodeValueByChildName(rows[i], 'cat_id');
	                    addOption(searchselect, name, category_id, false);
	                }
		        }
				var searchfor = $('searchfor');
				searchfor.onkeydown = function (e) {
					if (e && e.keyCode == 13) {
						var cleaned = this.value.strip();
						if (cleaned.length > 2) {
							var cat_id = (searchselect.value)?searchselect.value:'';
					    	document.location.href='/search-results.html?kword='+cleaned+'&cat_id='+cat_id;
						} else {
							 alert('Please specify at least three characters');
						}
					}
				};
		        $('search-submit').onclick = function () {
					var cleaned = searchfor.value.strip();
					if (cleaned.length > 2) {
					    var cat_id = (searchselect.value)?searchselect.value:'';
					    document.location.href='/search-results.html?kword='+cleaned+'&cat_id='+cat_id;
					} else {
					    alert('Please specify at least three characters');
					}
		        };
			});
	};
	function DataStore(path) {
		this.path = path;
		this.data = null;
		this.complete = 0;
	};
	DataStore.prototype.store = function (resp) {
		var firstNode = get_firstchild(resp.responseXML.documentElement);
		if (firstNode && firstNode.nodeName.toLowerCase() != 'xml') {
			this.data = resp.responseXML.getElementsByTagName(firstNode.nodeName);
		} else {
			this.data = 'empty';
		}
	};
	DataStore.prototype.handleComplete = function () {
		this.complete = 1;
	};
	DataStore.prototype.handleError = function () {
		this.data = 'empty';
	};
	DataStore.prototype.retrieve = function () {
		new Ajax.Request(this.path, {
				postBody:'nC='+noCache(),
				onFailure:this.handleError.bind(this),
				onSuccess:this.store.bind(this),
				onComplete:this.handleComplete.bind(this)
			}		
		);
	};
	function retrieveData(path, elem, func) {
		var dataStore = new DataStore(path);
		dataStore.retrieve();
		var _timer = setInterval(function () {
									if (dataStore.complete) {
										clearInterval(_timer);
										elem.dataStore = dataStore;
										func(elem);
									}
								}, 10);
	};
	function removeDemandlet() {
		for (var i = 0; i < arguments.length; i++) {
			arguments[i].remove();
		}
	};
	var getSiteName = function () {
		var siteName = window.location.href.split('://')[1].split('/')[0];
		getSiteName = function () {
			return siteName;
		};
		return getSiteName();
	};
	function hasSiteName(kw) {
		var siteName = getSiteName();
		return ((siteName.toLowerCase().indexOf(kw.toLowerCase()) > -1)?true:false);
	};
	var getCountry = function () {
		var list = {
			CA: /(canada)/i,
			US: /(america)/i
 		};
		var cc = null;
		var siteName = getSiteName();
		for (var country in list) {
			if (siteName.match(list[country])) {
				cc = country;
				break;
			}
		}
		if(cc==null) cc='US';
		getCountry = function () { return cc; };
		return cc;
	};
	function changeFileName(pathname, prefix) {
		var arr = '';
		if (typeof pathname != 'undefined') {
			arr = pathname.split('/');
			if (arr.length) {
				arr[arr.length-1] = [prefix, arr[arr.length-1]].join('_');
				arr = arr.join('/');
			} else {
				arr = '';
			}
		}
		return arr;
	};

	function textarea_maxlength(txtObj,counter) {
		if(txtObj.getAttribute('maxlength')) {
			var counterClone = counter.cloneNode(true);
			counterClone.relatedElement = txtObj;
			txtObj.setAttribute('maxLen',txtObj.getAttribute('maxlength'));
			counterClone.innerHTML = '<span>0</span>/'+txtObj.getAttribute('maxlength') + ' Character Limit';
			txtObj.parentNode.insertBefore(counterClone,txtObj.nextSibling);
			txtObj.relatedElement = counterClone.getElementsByTagName('span')[0];
			txtObj.onkeypress = txtObj.onchange = check_maxlength;
			txtObj.onkeypress();
		}
	};
		
	function check_maxlength() {
		var maxLength = this.getAttribute('maxlength');
		var currentLength = this.value.length;
		if (currentLength > maxLength) {
			this.setAttribute('alert','Exceeded allowed character limit.');
			this.relatedElement.className = 'toomuch';
		}
		else {
			this.removeAttribute('alert');
			this.relatedElement.className = '';
		}
		this.relatedElement.firstChild.nodeValue = currentLength;
	};
	
	/*
	 * dataManager.js
	 */
	var dataManager = new function () {
		var cbMap = {};
		var dataMap = {};
		
		function callback(url) {
			while (cbMap[url].length > 0) {
				cbMap[url].shift()(dataMap[url]);
			}
		};
		function retrieve(url, options) {
			if (options) {
				options.onComplete = update.bindAsEventListener(this, url);
				new Ajax.Request(url.split('?')[0], options);
			} else {
				new Ajax.Request(url, { onComplete: update.bindAsEventListener(this, url) });
			}
		};
		function update(resp, url) {
			dataMap[url] = resp;
			callback(url);
		};
		this.register = function (urls, cb, options) {
			if (urls.constructor == String) {
				urls = [urls];
			}
			if (urls.constructor == Array && urls.length && typeof cb == 'function') {
				var url = '';
				for (var i = 0; i < urls.length; i++) {
					url = urls[i];
					if (options) {
						var params = '';
						if (options.method) {
							params += 'method='+options.method+'&';
						}
						if (options.parameters) {
							params += 'parameters='+options.parameters+'&';
						}
						if (params != '') {
							url += '?'+params;
						}
					}
					if (!dataMap[url]) {
						dataMap[url] = 'retrieving';
						retrieve(url, options);
					}
					if (!cbMap[url]) {
						cbMap[url] = new Array;
					}
					if(dataMap[url] == 'retrieving') { //THROWS IE ERROR
						cbMap[url].push(cb);
					} else {
						cb(dataMap[url]);
					}
				}
			}
		};
	};
	function dataCheck(resp, cbFn) {
		if (!resp || !resp.responseXML) {
			this.remove();
		} else {
			cbFn(this, resp.responseXML.documentElement);
		}
	};
	(function () {
		var site = {};
		site['US'] = {
	        title: 'America'
		};
		site['CA'] = {
	        title: 'Canada',
	        stylesheet: '/media/global/global-canada.css'
		}
		document.title = ['BBC ', site[getCountry()].title, ' Shop - ', document.title].join('');
		if (getCountry().toLowerCase() == 'ca') {
			var lnk = document.createElement('link');
			lnk.rel='stylesheet';
			lnk.type='text/css';
			lnk.href=site.CA.stylesheet;
			var headTag = document.getElementsByTagName('head')[0];
			headTag.appendChild(lnk);
		}
	})();
	//News Letter Sign-up
    function newsletter_signup(f_panel,f_field,s_resp){
		if(!f_panel) return false;
		if(f_field.style.display=="none") f_field.style.display="block";
		else submit_newLetter(f_panel,s_resp);
	};
	function submit_newLetter(formObj,responseElem){
		if (!formObj) return false;
		var params = formObj.serialize(true);
		if (params.optin_id=='1') {
			if (isValidEmail(params.fromEmail) && isValidEmail(params.fromEmail2)) {
				if(params.fromEmail != params.fromEmail2) {
					alert('E-mail addresses must be identical.');
				} else {
					params.nC=noCache();
					params.email=params.fromEmail;
					new Ajax.Request(
						'/ajax/newsLetterSignup.jsp',
						{
							parameters: params,
							onComplete: function(xml){
								Element.hide(formObj);
								if (responseElem){
									if(!xml.responseXML) {
										responseElem.innerHTML = responseElem.innerHTML.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
									} else {
										var xmlNode = xml.responseXML.documentElement;
										var responseContent = responseElem.innerHTML;
										if (xmlNode.firstChild.nodeValue.toLowerCase().indexOf('success') > -1)
											responseElem.innerHTML = responseContent.replace('<!--response-->','Thank you for signing up for the newsletter!');
										else 
											responseElem.innerHTML = responseContent.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
									}
									Element.show(responseElem);
								}
							}
						}
					);
				}
			} else {
				alert('Email is not a valid email address.');
			}
		} else if (params.optin_id == '0'){
				var lk = $('signup-create-account');
				var lb = new lightbox(lk, {oncomplete: function () {
					$('new_email').value = params.fromEmail;
					$('new_email_confirm').value = params.fromEmail2;
					var createBtn = $('create-btn');
					if (createBtn) {
						createBtn.onclick = function () { 
							createAccount(this.form);
						}
					}
				}});
				lb.activate();
				lb.removeListener(true);
		} else {
			alert('Please select a sign-up method.');
		}
	};
	// end of News Letter Sign-up
	// Suggest a title
	function submit_SuggestTitle(formObj,responseElem){
		if (!formObj) return false;
		var params = formObj.serialize(true);
		params.nC=noCache();
		params.site_id = (getCountry()=='US')? 1 : 2;
		params.type='suggestTitle';
		if (checkForm(formObj)){
			new Ajax.Request(
				'/ajax/sendEmail.jsp',
				{
				parameters: params,
				onComplete: function(xml){
					Element.hide(formObj);
					if (responseElem) {
						if(!xml.responseXML) responseElem.innerHTML = responseElem.innerHTML.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
						else {
							var response = xml.responseXML.getElementsByTagName(get_firstchild(xml.responseXML.documentElement).nodeName);
							var responseContent = responseElem.innerHTML;
							if (getNodeValue(response[0]) == 'success') responseElem.innerHTML = responseContent.replace('<!--response-->','Thank you, your suggestion has been sent.');
							else responseElem.innerHTML = responseContent.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
							}
						Element.show(responseElem);
						}
					}
				}
			);
		}
	};
	//Submit Send To Friend
   function submit_FriendPopup(formObj,responseElem){
		if (!formObj) return false;
		if (checkForm(formObj)) {
			var params = formObj.serialize(true);
			params.nC = noCache();
			var loc = window.opener.location.href;
	        params.link = loc;
	        params.site_id = (getCountry()=='US')? 1 : 2;
			new Ajax.Request(
				'/ajax/sendFriend.jsp', 
				{
					parameters: params,
					onComplete: function(xml){
						Element.hide(formObj);
						if (responseElem) {
							if(!xml.responseXML){
								responseElem.innerHTML = responseElem.innerHTML.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
								}
								else {
									var response = xml.responseXML.getElementsByTagName(get_firstchild(xml.responseXML.documentElement).nodeName);
									var responseContent = responseElem.innerHTML;
									if (getNodeValue(response[0]) == 'success') 
										responseElem.innerHTML = responseContent.replace('<!--response-->','Thank you, your message has been sent.');
									else
										responseElem.innerHTML = responseContent.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
									}
								Element.show(responseElem);
						}
					}
				});
		}
	};
	//Contact Us
	function submit_ContactUs(formObj,responseElem){
		if(!formObj) return false;
		var params = formObj.serialize(true);
		params.nc=noCache();
		params.site_id = (getCountry()=='US')? 1 : 2;
		params.type='contactUs';
		if(checkForm(formObj)){
			new Ajax.Request(
				'/ajax/sendEmail.jsp',{
				parameters: params,
				onComplete: function(xml){
					Element.hide(formObj);
					if(!xml.responseXML){
							responseElem.innerHTML = responseElem.innerHTML.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
						} else responseElem.innerHTML = responseElem.innerHTML.replace('<!--response-->','Thank you for contacting us.<br />Your message has been successfully received and you will receive a response shortly.');
					Element.show(responseElem);
					}
				}
			);
		}
	}
	//end of Contact Us

	function changeControlScans(elem, type) {
		if ($(elem)) {
			var o = {};
			o.US = {};
			o.CA = {}
			o.US.checkout = {
				anchor: 'https://www.controlscan.com/seal/verify5.php?id=149&dom=32A6091C',
				img: 'https://www.controlscan.com/seal/sealx5.php?id=149&dom=32A6091C'
			};
			o.CA.checkout = {
				anchor: 'https://www.controlscan.com/seal/verify5.php?id=149&dom=AA27AAFE',
				img: 'https://www.controlscan.com/seal/sealx5.php?id=149&dom=AA27AAFE'
			};
			o.US.noncheckout = {
				anchor: 'http://www.controlscan.com/seal/verify5.php?id=149&dom=32A6091C',
				img: 'http://www.controlscan.com/seal/sealx5.php?id=149&dom=32A6091C'
			};
			o.CA.noncheckout = {
				anchor: 'http://www.controlscan.com/seal/verify5.php?id=149&dom=AA27AAFE',
				img: 'http://www.controlscan.com/seal/sealx5.php?id=149&dom=AA27AAFE'
			};
			//if(document.getElementById('cscan-seal')) $('cscan-seal').style.visibility='hidden';
			$(elem).href = o[getCountry()][type]['anchor'];
			if ($(elem).firstChild) {
				$(elem).firstChild.src = o[getCountry()][type]['img'];
			}
		}
	};
	function changeCountryLinks(elems) {
		if (elems && elems.length) {
			elems.each(function(elem) {
				if (elem.href) {
					var pieces = elem.href.split('.');
					pieces[pieces.length-2] = pieces[pieces.length-2]+'_'+getCountry().toLowerCase();
					elem.href = pieces.join('.');	
				} else {
					var lnks = elem.getElementsByTagName('a');
					$A(lnks).each(function(lnk) {
						if (lnk.id != 'cscan_country') {
							var pieces = lnk.href.split('.');
							pieces[pieces.length-2] = pieces[pieces.length-2]+'_'+getCountry().toLowerCase();
							lnk.href = pieces.join('.');
						}	
					});
				}
			});
		}
	};
	function createOrder(orderNode) {
		var order = {};
		order['OrderNumb'] = getNodeValueByChildName(orderNode, 'OrderNumb');
		order['AddressInfo'] = {};
		order['OrderStatus'] = {};
		order['OrderStatus']['Item'] = {};
		var orderStatus = orderNode.getElementsByTagName('OrderStatus');
		orderStatus = orderStatus.length && orderStatus[0];
		if (orderStatus) {
			order['OrderStatus']['Response'] = getNodeValueByChildName(orderStatus, 'Response');
			if (order['OrderStatus']['Response'] && /failure/i.test(order['OrderStatus']['Response'])) {
				order['OrderStatus']['Reason'] = getNodeValueByChildName(orderStatus, 'Reason');
				return order;
			}
			for (var i = 0; i < orderStatus.childNodes.length; i++) {
				if (orderStatus.childNodes[i].nodeType == 1) {
					var child = orderStatus.childNodes[i];
					if (child.nodeName == 'Tracking') {
						order['OrderStatus']['Tracking'] = new XmlToObj(child);
					} else if (child.nodeName == 'Item') {
						var itemNum = child.getAttribute('num');
						if (itemNum) {
							order['OrderStatus']['Item'][itemNum] = new Item(child);
						}
					} else {
						order['OrderStatus'][child.nodeName] = getNodeValueByChildName(orderStatus, child.nodeName);
					}
				}
			}
		}
		$A(orderNode.getElementsByTagName('AddressInfo')).each(function (addr) {
			var addrType = addr.getAttribute('type');
			if (addrType) {
				order['AddressInfo'][addrType] = new XmlToObj(addr);
			}
		});
		return order;
	};
	function XmlToObj(rootNode) {
		var x = rootNode.getElementsByTagName('*');
		for (var i = 0; i < x.length; i++) {
			if (x[i].nodeType == 1) {
				this[x[i].nodeName] = x[i].firstChild && x[i].firstChild.nodeValue;
			}
		}
	};
	function Item(rootNode) {
		var x = rootNode.getElementsByTagName('*');
		for (var i = 0; i < x.length; i++) {
			if (x[i].nodeType == 1) {
				this[x[i].nodeName] = x[i].firstChild && x[i].firstChild.nodeValue;
			}
		}
	};
	Item.prototype.getStatusMsg = function () {
		var statusMsg = '';
		switch (this.Status) {
			case '01':
			case '02':
			case '03':
			case '04':
			case '05':
			case '06':
			case '07':
				statusMsg = "Your order is being processed.";
				break;
			case '08':
				statusMsg = "There's a slight problem with your order. Your billing address does not match the credit card information provided. Please check your e-mail for a message from us with instructions for correcting this problem.";
				break;
			case '09':
				statusMsg = "There's a slight problem with your order. We were unable to process your payment due to an insufficient balance on your credit card. Please check your e-mail for a message from us with instructions for correcting this problem.";
				break;
			case '12':
			case '13':
				statusMsg = "Your order is being processed.";
				break;
			case '20':
			case '22':
			case '23':
			case '24':
			case '25':
				var d = new Date(this.BKODate.split('T').join(' ').split('-').join('/'));
				statusMsg = "This item will be available after "+ monthName(d) + ' ' + d.getDate() + ', ' + d.getFullYear()
				break;
			case '21':
				statusMsg = "Shipment delayed. One or more items on backorder will be available soon, so we will ship the order once all items are in stock.";
				break;
			case '28':
			case '29':
				statusMsg = "This order has been successfully cancelled.";
				break;
			case '30':
			case '31':
			case '32':
			case '33':
				statusMsg = "This order is being processed.";
				break;
			case '40':
			case '42':
			case '43':
				statusMsg = "Your order has been shipped.";
				break;
			case '50':
				statusMsg = "Your exchange item has been received. ";
				break;
			case '60':
				statusMsg = "Your return item has been received and your account has been credited.";
				break;
			case '61':
				statusMsg = "Your exchange item has been received."
				break;
		}
		return statusMsg;
	};
	function renderOptins(dObj) {
		dataManager.register('/ajax/data/optin.xml', function (xhr) { 
			if (xhr && xhr.responseXML) {
				var rows =  xhr.responseXML.documentElement.getElementsByTagName('row');
				for (var i = 0; i < rows.length; i++) {
					var optin = (function (row) {
									var optinObj = {};
									var fields = row.getElementsByTagName('*');
									for (var i = 0; i < fields.length; i++) {
										optinObj[fields[i].nodeName] = getNodeValueByChildName(row, fields[i].nodeName);
									}
									return optinObj;
								})(rows[i]);
					dObj.appendChild(Builder.node('input', { type: 'checkbox', id:'optin_'+optin.optin_id }));
					dObj.appendChild(Builder.node('span', {className:'optin-text'}, [optin.display_text]));
					if (optin.is_required == 1) {
						var req = Builder.node('span', {className:'required'}, ["(required)"]);
						dObj.insertBefore(req, $('optin_'+optin.optin_id));
						$('optin_'+optin.optin_id).setAttribute('required', 'required');
						$('optin_'+optin.optin_id).setAttribute('alert', 'You must check the '+optin.name+' checkbox');
					}
				}
			}
		});
	};
	
	//ip_human.js
	var userManager = Class.create();
	
	userManager.prototype = {
		initialize: function(options) {
			this.person = new CookieJar('life',{  
			    expires:dateAdd('d', 90, new Date() ),     
			    path:'/'
			}); 
			this.url 		= '/ajax/account.jsp';
			this.cookieName = 'credentials'; 
		},
	
		create: function(formObj,options) {
			this.options = {};
			Object.extend(this.options, options || {});
			var formParams = Form.serialize(formObj, true);
			if(checkForm(formObj)) {
				var errFlag = false;
				if($F('new_email')!=$F('new_email_confirm')) {
					alert('The email addresses do not match. Please try again.');
					errFlag = true;
				}
				else if($F('new_password')!=$F('new_password_confirm')) {
					alert('The passwords do not match. Please try again.');
					errFlag = true;
				}
				if(errFlag==false) {
					var optinIds = [];
					$H(formParams).keys().each( function (key) {
						if (key.indexOf('optin_') > -1) {
							optinIds.push(key.split('_')[1]);
						}
					});
					if (optinIds.length) {
						formParams.optin_ids = optinIds.join(',');
					}
					formParams.newAccount = 1;
					formParams.nc = noCache();
					new Ajax.Request(
					  this.url, 
					  	{
							method: 'post', 
							parameters: formParams,
							onComplete: this.create_complete.bindAsEventListener(this,
																					{
																					onComplete:this.options.onComplete,
																					onFailure:this.options.onFailure
																					})
						});
				}
			}
		},

		create_complete: function(response,options) {
			this.options = {};
			Object.extend(this.options, options || {});
			var x = response.responseXML.getElementsByTagName('user_id');
			if(x.length>0) {
				var firstnameVl = $F('FirstName');
				var lastnameVl	= $F('LastName');
				var emailVl		= $F('new_email');
				this.set(this.cookieName,
					{
						id:getNodeValue(x[0]),
						firstname: firstnameVl,
						lastname: lastnameVl,
						email: emailVl
					});
				if(this.options.onComplete) eval(this.options.onComplete);
			}
			else {
				if(this.options.onFailure) 
					eval(this.options.onFailure);
				else {
					var x = response.responseXML.getElementsByTagName('response');
					alert(getNodeValue(x[0]));
				}	
			}
		},	

		createGuest: function(formObj) {
			if(checkForm(formObj)) {
				var errFlag = false;
				if($F('new_email')!=$F('new_email_confirm')) {
					alert('The email addresses do not match. Please try again.');
					errFlag = true;
				}
				else if($F('new_password')!=$F('new_password_confirm')) {
					alert('The passwords do not match. Please try again.');
					errFlag = true;
				}
				if(errFlag==false) {
					var formParams = Form.serialize(formObj) + '&email='+$F('new_email')+'&password='+$F('new_password');
					new Ajax.Request(
					  this.url, {method: 'post', parameters: formParams + 'newAccount=1&nc='+noCache(), onComplete: this.create_complete.bindAsEventListener(this)}
			   		);
				}
			}
		},
						
		update: function(formObj,options) {
			this.options = {};
			Object.extend(this.options, options || {});
			
			if (checkForm(formObj)) {
				var param_str = '';
				var emailStr = $('new_email').value.strip();
				if (emailStr.length > 0) {
					if (isValidEmail(emailStr)) {
						param_str += ('&newEmail='+emailStr);
					} else {
						alert('Email is not a valid email address.');
						return;
					}
				}
				var newPasswd = $('new_password').value.strip();
				if (newPasswd.length > 5 && newPasswd.length < 16) {
					var confirmPasswd = $('new_password_confirm').value;
					if (newPasswd == confirmPasswd) {
						param_str += ('&newPassword='+newPasswd);
					} else {
						alert('Make sure Confirm Password matches Password.');
						return;
					}
				} else if (newPasswd.length > 0) {
					alert('Password must be between 6 to 15 characters.');
					return;
				}
				var optinIds = [];
				var optinCount = 0;
				formObj.getInputs('checkbox').each( function(chkbox) {
					if (chkbox.id.indexOf('optin_') > -1) {
						++optinCount;
					 	if (chkbox.checked) {
							optinIds.push(chkbox.id.split('_')[1]);
						}
					}
				});
				if (optinCount > 0 && optinIds.length == 0) {
					param_str += '&optin_ids=';
				} else if (optinIds.length) {
					param_str += ('&optin_ids='+optinIds.join(','));
				}
				if (param_str) {
					var updateParams = param_str +'&email=' + this.getEmail();
					new Ajax.Request(
					  this.url, 
					  	{
							method: 'post', 
							parameters: updateParams + '&modifyAccount=1&nc='+noCache(), 
							onComplete: this.update_complete.bindAsEventListener(this,
																					{
																					onComplete:this.options.onComplete,
																					onFailure:this.options.onFailure
																					})
						});
				}
			}
		},
		
		update_complete: function(response,options) {
			this.options = {};
			Object.extend(this.options, options || {});
			var x = response.responseXML.getElementsByTagName('user_id');
			if(x.length>0) {
				var emailVl		= $F('new_email');
				this.set(this.cookieName,
					{
						id:getNodeValue(x[0]),
						email: emailVl
					});
				if(this.options.onComplete) eval(this.options.onComplete);
			}
			else {
				if(this.options.onFailure) 
					eval(this.options.onFailure);
				else {
					var x = response.responseXML.getElementsByTagName('response');
					alert(getNodeValue(x[0]));
				}	
			}
		},	

		display: function(id) {
		},

		login: function(formObj,optionalParams) {
			if(checkForm(formObj)) {
				var options = {};Object.extend(options, optionalParams || {});
				new Ajax.Request(
				  this.url, {
				  	method: 'post', 
					parameters: Form.serialize(formObj) + '&loginValidate=1&nc='+noCache(), 
					onComplete: this.login_complete.bindAsEventListener(this,
																		{
																			onComplete: options.onComplete,
																			onFailure: options.onFailure
																		})}
		   		);
			}
		},
		
		login_complete: function(response,optionalParams) {
			var options = {};Object.extend(options, optionalParams || {});
			var userId 		= getNodeValue(response.responseXML.getElementsByTagName('user_id')[0]);
			var firstName	= getNodeValue(response.responseXML.getElementsByTagName('FirstName')[0]);
			var lastName	= getNodeValue(response.responseXML.getElementsByTagName('LastName')[0]);
			if(userId.length>0) {
				this.set(this.cookieName,
					{
						id:userId,
						firstname: firstName,
						lastname: lastName,
						email: $F('email')
					});
				if(options.onComplete) eval(options.onComplete);
			}
			else {
				if(options.onFailure) 
					eval(options.onFailure);
				else {
					var x = response.responseXML.getElementsByTagName('response');
					alert(getNodeValue(x[0]));
				}	
			}
		},
					
		logout: function(optionalParams) {
			var options = {};Object.extend(options, optionalParams || {});
			this.person.remove(this.cookieName);
			if(options.onComplete) eval(options.onComplete);
		},

		check: function() {
			if(this.person.get(this.cookieName))
				return true;
			else	
				return false;
		},
			
		getUserId: function() {
			return this.person.get(this.cookieName).id;
		},
		
		getFirstName: function() {
			return this.person.get(this.cookieName).firstname;
		},
		
		getLastName: function() {
			return this.person.get(this.cookieName).lastname;
		},
		
		getName: function() {
			return this.person.get(this.cookieName).firstname + ' ' + this.person.get(this.cookieName).lastname;
		},
		
		getEmail: function() {
			return this.person.get(this.cookieName).email;
		},
		
		resetPassword: function(formObj,optionalParams) {
			var storeIds = { US: 'USA', CA: 'CAN' };
			if(checkForm(formObj)) {
				var options = {};Object.extend(options, optionalParams || {});
				new Ajax.Request(
				  'ajax/account.jsp',  {
				  	method: 'post', 
					parameters: Form.serialize(formObj)+'&resetPaswd=1&StoreID' + storeIds + '&nc='+noCache(), 
					onComplete: this.resetPass_complete.bindAsEventListener(this,
																		{
																			onComplete: options.onComplete,
																			onFailure: options.onFailure
																		})}
		   		);
			}
		},

		resetPass_complete: function(response,options) {
			this.options = {};
			Object.extend(this.options, options || {});
			var x = response.responseXML.getElementsByTagName('user_id');
			if(x.length>0) {
				if(this.options.onComplete) eval(this.options.onComplete);
			}
			else {
				if(this.options.onFailure) 
					eval(this.options.onFailure);
				else {
					var x = response.responseXML.getElementsByTagName('response');
					alert(getNodeValue(x[0]));
				}	
			}
		},
		
		getCountry: function() {
			return this.person.get(this.cookieName).country;
		},
				
		set: function(id,object) {
			try {	
				this.object = {};
				Object.extend(this.object, object || {});
				if(this.person.put(id,this.object))
					return true;
				else
					return false;
			}
			catch(err) {
				return false;
				
			}
		}	
	};

	//sign.js
	function myAccountLink() {
		var user= new userManager();
	
		if (user.check()){
			$("myaccount").innerHTML = '<a href="/my-account/">My Account</a>|';
		
			if (window.location.href.indexOf('my-account') > -1) {
				if ($("left_myaccount")) {
					$("left_myaccount").innerHTML = '<h3><a href="/my-account/">MY ACCOUNT</a></h3>'
				}
			}
		}
		else {
			$("myaccount").innerHTML = '<a id="accountSignIn" href="/ajax/layouts/signinGeneralLayout.html">My Account</a>|';
			
			var lnk = $('accountSignIn');	 	
			new lightbox(lnk, {oncomplete: function () {	
				$('email').focus();			
				var loginBtn = $('login-btn');
				if (loginBtn) {
					loginBtn.onclick = function () {	
						var flag = true;					
						signInSubmit(this.form, flag);
					}
					var lk = $('createaccount');		
					new lightbox(lk, {oncomplete: function () {
						$('FirstName').focus();
						var createBtn = $('create-btn');
						if (createBtn) {
							createBtn.onclick = function () { 
								var flag = true;	
								createAccount(this.form, flag);
							}
						}
					}});
					var hrf = $('forgotpass');		
					new lightbox(hrf, {oncomplete: function () {
						$('email').focus();
						var resetBtn = $('resetpw-btn');
						if (resetBtn) {
							resetBtn.onclick = function () {								
								submitPasswordReset(this.form);
							}
						}
								
					}});
				}
			}});
			
			
		}
		signInTxt();
	};
	
	function signInTxt(){
		var user= new userManager();
		if (user.check()==true){
			$("signin").innerHTML = '<span style="color:#fff">Hello ' + user.getFirstName() + '!</span>' +
				'<strong style="color:#3a5e72"> | </strong><a href="#" id="log-out" onclick="signOut()"  style="text-decoration:underline">Not ' + user.getFirstName() + '?</a>';		
		}
		else {
			if (getCountry() == "US") {
				var shop = "America";
			}
			else{
				var shop = "Canada";
			};
			$("signin").innerHTML = '<a id="sign-in" href="/ajax/layouts/signinGeneralLayout.html" class="btn-hdrsignin">Sign In</a>' +
				'<a id="create-account" href="/ajax/layouts/createAccount.html" >Create a BBC '+shop+' Shop Account</a>';
			
			var lk = $('create-account');		
			new lightbox(lk, {oncomplete: function () {
				$('FirstName').focus();
				var createBtn = $('create-btn');
				if (createBtn) {
					createBtn.onclick = function () { 
						createAccount(this.form);
					}
				}
			}});	
			
			var lnk = $('sign-in');		
			new lightbox(lnk, {oncomplete: function () {
				$('email').focus();
				var loginBtn = $('login-btn');
				if (loginBtn) {
					loginBtn.onclick = function () { 
						signInSubmit(this.form);
					}
				
					var lk = $('createaccount');		
					new lightbox(lk, {oncomplete: function () {
					$('FirstName').focus();
						var createBtn = $('create-btn');
						if (createBtn) {
							createBtn.onclick = function () { 
								createAccount(this.form);
							}
						}
					}});
						
					var hrf = $('forgotpass');		
					new lightbox(hrf, {oncomplete: function () {
						$('email').focus();
						var resetBtn = $('resetpw-btn');
						if (resetBtn) {
							resetBtn.onclick = function () { 								
								submitPasswordReset(this.form);
							}
						}
								
					}});			
				}
			}});		
		}	
	};
	
	function signinComplete(){		
		signInTxt();
		myAccountLink();
		deactivateLBinstance();	
	};
	
	function signInSubmit(fObj, flag) {
		var user= new userManager();
		user.login($('loginForm'),{onComplete:'signinComplete(); if ('+flag+') window.location.href="/my-account/"'});
		return true;
	};
	
	function signOut() {
		var user= new userManager();
		user.logout();
		signInTxt();
		myAccountLink();
		
		if (window.location.href.indexOf('my-account') > -1) {		
			signOutRedir();
		}
	};
	
	function signOutRedir() {
		window.location.href='/'
	};
		
	function signCreate() {
		var lk = $('createaccount');	
		new lightbox(lk, {oncomplete: function () {
			var createBtn = $('create-btn');
			if (createBtn) {
				createBtn.onclick = function () { 
					createAccount(this.form);
				}
			}
		}});
		if(cartLightBox) cartLightBox.deactivate();
		return false;
			
	};
	
	function createAccount(fObj, flag) {
		var user = new userManager();
		user.create($('cform'),{onComplete:'createComplete(); if ('+flag+') window.location.href="/my-account/"'});
		return false;
	};
	
	function createComplete(){		
		signInTxt();
		myAccountLink();
		deactivateLBinstance() 
	};
	
	function deactivateLBinstance() {
		if(cartLightBox) cartLightBox.deactivate(this);		
	};
	
	function submitPasswordReset(fObj) {
		var user = new userManager();
		user.resetPassword($('fpForm'),{onComplete:'submitPasswordResetComplete()'});
		return false;
	};
	
	function submitPasswordResetComplete(){
		if(cartLightBox) cartLightBox.deactivate(this);
		alert('Success');
	};

// track Shipping Order
function checkGuestOrders(container) {
	if ($(container)) {
		var formObj = $('non-registered');
		if (formObj) {
			var errorMsg = [];
			formObj.getInputs('text').each(function(input) {
				if (/email/i.test(input.name)) {
					if (!isValidEmail(input.value)) {
						errorMsg.push(input.name + ' is not valid.');
					}
				}
				if (input.value.length == 0) {
					errorMsg.push(input.name + ' is blank.');
				}
			});
			if (errorMsg.length) {
				alert('Please correct the following:\n' + (function() {
					var txt = '';
					for (var i = 0; i < errorMsg.length; i++) {
						txt += (i+1)+') The '+ errorMsg[i] + '\n';
					}
					return txt;
				})());
			} else {
				var params = formObj.serialize(true);
				params = { email: params['email address'].strip(), order_number: params['order number'].strip() }
				checkOrderStatus(params, $(container));
				
			}
		}
	} else {
		alert("Sorry we're unable to process your request at this time."); 
	}
};
function checkOrderStatus(params, container) {
	var storeIds = { US: 'USA', CA: 'CAN' };
	var orderParams = {
		orderStatus: 1,
		StoreID: storeIds[getCountry()]
	};
	orderParams.email = params['email'];
	orderParams.OrderNumb = params['order_number'];
	orderParams.is_guest = 1;
	new Ajax.Request(
		'/ajax/order.jsp',
		{
			parameters: orderParams,
			onLoading: function () {
				showLbLoading();
			},
			onComplete: function (xhr) {
				if (xhr && xhr.responseXML) {
					var rootNode = xhr.responseXML.documentElement;
					if (/order/i.test(rootNode.nodeName)) {
						var order = createOrder(xhr.responseXML.documentElement);
						if (order.OrderStatus.Response && /failure/i.test(order.OrderStatus.Response)) {
							removeLbLoading();
							alert('Order number not found.');
						}
						else {
							renderMarkup(container, function(){
								displayContents(order);
							});
						}
					}
					else {
						removeLbLoading();
						alert('Account information not found.');
					}
				}
			}
		}
	);
};
function renderMarkup(container, cb) {
	new Ajax.Request(
		'/ajax/layouts/trackOrderLayout.html',
		{
			onSuccess: function (xhr) {
				if (xhr && xhr.responseText) {
					container.innerHTML = xhr.responseText;
					if (cb) cb();
				} 
			},
			onComplete: function () {
				removeLbLoading();
			}
		}
	);	
};
function displayContents(order) {
	displayOrderInfo(order);
	displayAddress(order.AddressInfo.ship, 'shipping_address');
	displayAddress(order.AddressInfo.bill, 'billing_address');
	displayCreditCard(order, 'paymentDetails');
	displayShippingMethod(order);
 	setTrackingLink(order.OrderStatus.Tracking);
	setPrintInvoice();
	displayItems(order);
	displayTotals(order);
};
function setTrackingLink(tracking) {
    var lnk = $$('a[class*="trackshipment"]');
	if (tracking.CarrierLink) {
    	lnk[0].href = tracking.CarrierLink;
    	lnk[0].onclick = function() { window.open(this.href); return false; }
	} else {
		lnk[0].remove();
	}
};
function setPrintInvoice() {
	$$('a[class*="printinvoice"]').each(function (lnk) {
		lnk.onclick = function () {
			window.print();
			return false;
		}
	});
};
function displayCreditCard(order, container) {
	var cc = { 'V':'Visa', 'M':'Mastercard', 'A':'American Express', 'D': 'Discover' };
	var ccList = document.createElement('ul');
	if (order.OrderStatus.CCType) {
		var li = document.createElement('li');
                li.innerHTML = '<strong>'+cc[order.OrderStatus.CCType]+': </strong> ************'+order.OrderStatus.CCNum;
		ccList.appendChild(li);
		ccList.appendChild(Builder.node('li', ['Exp: ' +order.OrderStatus.CCExp]));
	}
	if ($(container) && ccList.childNodes.length) {
		$(container).innerHTML ='';
		$(container).appendChild(ccList);
	}
};
function displayOrderInfo(order) {
	if ($('order_number')) $('order_number').innerHTML = order.OrderNumb;
	var d = new Date(order.OrderStatus.OrderDate.split('T').join(' ').split('-').join('/'));
	if ($('order_date')) $('order_date').innerHTML = monthName(d) + ' ' + d.getDate() + ', ' + d.getFullYear(); 
};
function displayAddress(address, container) {
	var addr = document.createElement('ul');
	var name = '';
	if (address.FirstName) {
		name += address.FirstName + ' ';
	}
	if (address.LastName) {
		name += address.LastName;
	}
	addr.appendChild(Builder.node('li', [name]));
	if (address.Address1) {
		addr.appendChild(Builder.node('li', [address.Address1]));
	}
	addr.appendChild(Builder.node('li', [
		(address.City || '') + ' ' + (address.State || '') + ' ' + (address.Zip || '')]));
	if ($(container) && addr.childNodes.length) {
		$(container).innerHTML = '';
		$(container).appendChild(addr);
	}
};
function displayShippingMethod(order) {
	var method = document.createElement('ul');
	if (order.OrderStatus.Tracking.ShipDate) {
		var d = new Date(order.OrderStatus.Tracking.ShipDate.split('T').join(' ').split('-').join('/'));
		var shipdate = Builder.node('li', ['Shipped ' + 
											monthName(d) + ' ' + d.getDate() + ', ' + d.getFullYear() +
											' via ' + order.OrderStatus.Tracking.Carrier]);
		if (order.OrderStatus.Tracking.TrackingNum) {
			shipdate.appendChild(document.createTextNode(' with tracking number ' + order.OrderStatus.Tracking.TrackingNum));
		} else {
			shipdate.appendChild(document.createTextNode('. Tracking number is not available.'));
		}
		method.appendChild(shipdate);
	}
	if ($('shipping_method') && method.childNodes.length) {
		$('shipping_method').innerHTML = '';
		$('shipping_method').appendChild(method);
	}
};
function getTotals(order, field) {
	var items = $H(order.OrderStatus.Item);
	var total = 0.0;
	items.keys().each(function (key) {
		total += parseFloat(items[key][field] || 0);
	});
	return total.toFixed(2);
};
function displayItems(order) {
	var table = document.createElement('table');
	table.className = 'chkout-table';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	var items = $H(order.OrderStatus.Item);
	items.keys().each(function (key) {
		var item  = order.OrderStatus.Item[key];
		var itemno = Builder.node('td', {className:'itemno'}, [item.Id]);
		var desc = Builder.node('td', {className:'desc'}, [Builder.node('h4', item.Description)]);
		var options = Builder.node('td', {clasName: 'options'}, [Builder.node('span', [item.getStatusMsg()] )]);
		var qty = Builder.node('td', {className: 'qty'}, [item.Quantity]);
		item.totalPrice =  item.UnitPrice * item.Quantity;
		var price = Builder.node('td', {className:'price'}, ['$'+item.totalPrice]);
		var row = Builder.node('tr', [itemno, desc, options, qty, price]);
		tbody.appendChild(row);
	});
	if ($('order-header')) {
		var tableHeader = $('order-header');
		if (tableHeader.nextSibling) {
			tableHeader.parentNode.insertBefore(table, tableHeader.nextSibling);
		} else {
			tableHeader.parentNode.appendChild(table);
		}
	}
};
function displayTotals(order){
	var costs = {};
	var total = 0.0;
	costs.subtotal = getTotals(order, 'totalPrice');
	costs.shipping = getTotals(order, 'ShipHandAmt');
	costs.taxes = getTotals(order, 'TaxAmt');
	costs.promotional = order.OrderStatus.DiscountAmt;
	costs.wrapcost = getTotals(order, 'WrapCost');
	$('sub_total').innerHTML = '$' + costs.subtotal;
	$('shipping_handling').innerHTML = '$' + costs.shipping;
	if (order.OrderStatus.DiscountAmt > 0) {
		$('promotional_discount').innerHTML = '-$' + costs.promotional;
	} else {
		$('promotional_discount').up('tr').remove();
	}
	if (costs.wrapcost > 0) {
		$('giftwrap').innerHTML = '$' + costs.wrapcost;
	} else {
		$('giftwrap').up('tr').remove();
    }
	if (costs.taxes > 0) {
		$('taxes').innerHTML = '$' + costs.taxes;
	} else {
		$('taxes').up('tr').remove();
	}
	for (var item in costs) {
		if (costs[item] > 0) {
			if (item == 'promotional') {
				total -= parseFloat(costs[item]);
			} else {
				total += parseFloat(costs[item]);
			}
		}
	}
	$A($('centercolumn').getElementsByClassName('total_cost')).each(function (elem) {
		elem.innerHTML = '$' + total.toFixed(2);
	});
};
function showLbLoading() {
	centerElem($('lightbox'));
	cartLightBox.params.noAjax = true;
	cartLightBox.params.noOverlayClick = true;
	cartLightBox.activate();
};
function removeLbLoading(){
	cartLightBox.deactivate();
	cartLightBox.params.noAjax = null;
	cartLightBox.params.noOverlayClick = null;
};
// optins.js
function getOptins(elem) { 	
	var myUser = new userManager(); 	
	if (myUser.check()) {                 
		var optinIds = {}; 		
		var url = '/ajax/account.jsp' 		
	    	new Ajax.Request(url,{ 			
			parameters:  'getAccount=1&email='+myUser.getEmail(), 			
			onComplete: function (xhr) { 				
				if (xhr.responseXML) { 					
					var xml = xhr.responseXML.documentElement; 					
					var objs = xml.getElementsByTagName('object'); 					
					if (objs.length) { 						
					    for (var i = 0; i < objs.length; i ++) { 							
						if (objs[i].getAttribute('name') == 'user_optin') { 								
						    var props = objs[i].getElementsByTagName('property'); 								
						    for (var j = 0; j < props.length; j++) { 									
							if (props[j].getAttribute('name') == 'optin_id') {                                                                                         
							    var txt = props[j].firstChild.nodeValue; 										                                    
							    optinIds[txt] = true; 									
							} 							
						    } 								 							
						} 						
					    }                                                  					
					}
				}
				dataManager.register('/ajax/data/optin.xml', function (xhr) { 
				    renderOptins(xhr, elem, optinIds); 
				});
			}
		}); 	
	} else {
		dataManager.register('/ajax/data/optin.xml', function (xhr) { renderOptins(xhr, elem); } );         
	} 
}; 

function renderOptins(xhr, dObj, opts) { 	
	if (xhr && xhr.responseXML) { 		
		var rows =  xhr.responseXML.documentElement.getElementsByTagName('row'); 		
		for (var i = 0; i < rows.length; i++) { 			
			var optin = (function (row) { 							
				var optinObj = {}; 							
				var fields = row.getElementsByTagName('*'); 							
				for (var i = 0; i < fields.length; i++) { 								
					optinObj[fields[i].nodeName] = getNodeValueByChildName(row, fields[i].nodeName); 							
				} 							
				return optinObj; 						
			})(rows[i]); 			
			var optinCheckbox = Builder.node('input', { type: 'checkbox', id:'optin_'+optin.optin_id });                         
			if (opts) {                             
				if (opts[''+optin.optin_id]) {                                 
					optinCheckbox.checked = true;                             
				}                         
			} else if (optin.default_selected == 1) { 				
				optinCheckbox.checked = true; 			
			} 			
			dObj.appendChild(optinCheckbox); 			
			var optinLabel = Builder.node('label', {className:'nobold small-text'}, [optin.display_text]); 			
			optinLabel.setAttribute('for', 'optin_'+optin.optin_id); 			
			dObj.appendChild(optinLabel); 			
			dObj.appendChild(document.createElement('br')); 			
			if (optin.is_required == 1) { 				
				//var req = Builder.node('span', {className:'required'}, ["(required)"]); 				
				//dObj.insertBefore(req, $('optin_'+optin.optin_id)); 				
				$('optin_'+optin.optin_id).setAttribute('required', 'required'); 				
				$('optin_'+optin.optin_id).setAttribute('alert', 'You must check the '+optin.name+' checkbox'); 			
			}
		}
	}
};