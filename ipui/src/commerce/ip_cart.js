/**
 * The common Utils Class.
 * @constructor
 */	
function cart() {
};	
cart.prototype = {
	initialize: function(options) {
		IPUI.requires('ipui.base.cookie');
		
		this.trolley = new CookieJar('_basket_',{  
		    expires:'3600',     
		    path:'/'
		}); 
		this.truck = new CookieJar('shipping',{  
		    expires:'3600',     
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
			if(this.check(id))
				this.object.quantity = parseInt(this.getItemByID(id).quantity)+1;
			else 
				this.object.quantity = 1;			
			this.object.product_id	= id;
			if(this.set(id,this.object)) {
				if(document.getElementById('ccMain')) $('ccMain').innerHTML	= this.count();
				this.setShippingRate(this.shippingMethod,this.getSubTotal());
				if(!this.object.hideCart)
					cartLightBox.displayLightbox('block',this.show.bindAsEventListener(this));
			}
		}
		catch(err) {
		}
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
				this.setShippingRate(this.shippingMethod,this.getSubTotal());
				return true;
			}	
		}
		catch(err) {
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
				this.setShippingRate(this.shippingMethod,this.getSubTotal());
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
		options = {};Object.extend(options, optionalParams || {});
		var price = 0; var cart = this;
		this.getItems().each(function(re) {
				item = cart.getItemByID(re);
				if(options.where)
					if(evalWhere(options.where,item).result==true) price = price + (item.quantity * item.product_price)-0;
				else					
					price = price + (item.quantity * item.product_price)-0;
			});
		return (Math.round(price*100)/100);
	},
		
	setState: function(state) {
		this.ready 	= state;
		var mode	= '';
		if(document.getElementById('checkout')) {
			item 	= $('checkout');
			mode	= 'checkout';
		}
		if(document.getElementById('continue')) {
			item 	= $('continue');
			mode	= 'continue';
		}
		if(document.getElementById('review')) {
			item 	= $('review');
			mode	= 'review';
		}

		if(this.ready==false) {
			if(mode=='continue') {
				item.addClassName('btn-update-large');
				item.removeClassName('btn-continue-large');
			}
			else if(mode=='checkout') {
				item.addClassName('btn-update-large');
				item.removeClassName('btn-checkout-large');
			}
			else if(mode=='review') {
				item.addClassName('btn-update-large');
				item.removeClassName('btn-review-large');
			}
		}
		else {
			if(mode=='continue') {
				item.addClassName('btn-continue-large');
				item.removeClassName('btn-update-large');
			}
			else if(mode=='checkout') {
				item.addClassName('btn-checkout-large');
				item.removeClassName('btn-update-large');
			}
			else if(mode=='review') {
				item.addClassName('large-btn-review');
				item.removeClassName('btn-update-large');
			}
		}
	},
	
	calculateGiftWrapping: function() {
		try {
			var itemsInCart = this.getContentObj();
			var giftTotal	= 0;
			var giftRate	= parseFloat('5.95');
			if(orderObject) {
				for(item in itemsInCart) {
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
		catch(err) {
		}			
		finally {
			return giftTotal;
		}
	},
	
	calculateDetails: function() {
		var cartTotal 			= parseFloat(this.getSubTotal());
		var shippingTotal		= parseFloat(this.getShippingRate(this.shippingMethod.code,parseFloat(this.getSubTotal({where:'shipping=null'}))));
		var gift 				= new giftManager();
		var giftTotal			= parseFloat(gift.getTotal());	
		var grandTotal			= 0;
		var promo 				= this.calculatePromotion(cartTotal,shippingTotal);
		var giftWrappingTotal 	= this.calculateGiftWrapping();
		if(promo.amount=='freestandardshipping') 
			grandTotal = cartTotal;
		else if(promo.amount>0)
			grandTotal = promo.result + shippingTotal;																																																																																																				
		else
			grandTotal = cartTotal + shippingTotal;
		
		if(giftWrappingTotal>0)
			grandTotal = grandTotal + giftWrappingTotal;
		
		if(giftTotal>=grandTotal) {
			giftTotal = grandTotal;
			grandTotal=0;
		}
		else 
			grandTotal = (Math.round(parseFloat(grandTotal - giftTotal)*100)/100);		
			
		var ccTotal = parseFloat(cartTotal + shippingTotal - giftTotal - promo.amount);	
		return  {
			cartTotal: cartTotal,
			shippingTotal: shippingTotal,
			giftTotal: giftTotal,
			promoTotal: promo.amount,
			grandTotal: grandTotal,
			promoTitle: promo.title,
			giftWrappingTotal: giftWrappingTotal,
			ccTotal: ccTotal
		};		
	}, 

	show: function(targetObj) {
		if(!targetObj) targetObj=$(this.targetRepeater);
		try {
			var display	= new painter();
			display.repeat(targetObj, this.getContentObj(), {insert:'after'});
			if(this.getSubTotal()>0) {
				if(this.shippingLoaded!=true) 
					this.loadShipping();
				else
					this.show_complete();
			}
			else
				if(document.getElementById('continue')) Element.hide('continue');
		}
		catch(err) {
			return err;
		}
	},
					
	show_complete: function() {
		try {
			var details = this.calculateDetails();
			if(document.getElementById('cartTotal')) $('cartTotal').innerHTML 			= '$' + details.cartTotal;
			(details.shippingTotal==0) ? shippingText = 'Free' : shippingText 			= '$' + details.shippingTotal;
			if(document.getElementById('shippingTotal')) $('shippingTotal').innerHTML 	= shippingText;
			if(document.getElementById('totalPrice')) $('totalPrice').innerHTML			= '$' + details.grandTotal;
			
			if(details.giftTotal>0) {
				if(document.getElementById('giftCertificate')) {
					Element.show('giftCertificate');
					$('giftcertificateTotal').innerHTML = '$-' + details.giftTotal;
				}
			}
			else if(document.getElementById('giftCertificate'))
				Element.hide('giftCertificate');

			if(details.promoTotal!=0) {
				if(document.getElementById('promotion')){
					Element.show('promotion');
					if(document.getElementById('promotionDescription')) $('promotionDescription').innerHTML = details.promoTitle;
					if(document.getElementById('promotionTotal') && details.promoTotal != 'freestandardshipping') $('promotionTotal').innerHTML = '-$' + details.promoTotal;
				}
				else if(document.getElementById('promotion')){
					Element.hide('promotion');
				}
			}
			
			if(document.getElementById('giftwrapTotal')) {
				if(details.giftWrappingTotal=='') 
					$('giftwrapTotal').innerHTML = '$0'
				else
					$('giftwrapTotal').innerHTML = '$' + details.giftWrappingTotal;
			}
			
			if(document.getElementById('cartitems')) {
				$('cartitems').innerHTML = this.count() + ' Item(s)';
			}
		}
		catch(err) {
		}
	},
	
	calculatePromotion: function(cartTotal,shippingTotal) {
		var promo 		= new promoManager();
		var promoCodes	= promo.getContentObj();
		var promoAmount	= 0;
		var newTotal	= 0;
		var promoTitle 	= '';

		for(member in promoCodes) {
			var promoObj = promoCodes[member];
			promoTitle	 = promoObj.description;
            if(isDate(promoObj.valid_from) && (dateDiff('n',promoObj.valid_from,getServerTime())>0)  ) { //started?                                   
            	if((isDate(promoObj.valid_until) && (dateDiff('n',promoObj.valid_until,getServerTime())<1) || (isDate(promoObj.valid_until)==false)) ) {//expired?                                                                   
					if(promoObj.country==getCountry()) {//valid country                                        
                        if((promoObj.min_purchase<cartTotal || promoObj.min_purchase=='' )) {
								if(promoObj.type=='discount'){                    
                                    if(promoObj.unit=='percent') {
                                        newTotal 	= cartTotal - parseFloat((cartTotal/100)*promoObj.amount);
										promoTitle 	= promoObj.description;
										promoAmount	= (Math.round(parseFloat((cartTotal/100)*promoObj.amount)*100)/100); //parseFloat((cartTotal/100)*promoObj.amount);
                                    }//its a percentage discount
                                    else {
                                    	newTotal 	= (cartTotal - parseFloat(promoObj.amount));
										promoTitle 	= promoObj.description;
										promoAmount	= parseFloat(promoObj.amount);
                                    }//its a dollar discount
                             	}
                                else if(promoObj.type=='free'){
                                	newTotal 	= cartTotal;
									promoTitle 	= promoObj.description;
									promoAmount	= 'freestandardshipping';
                                }//its a free shipping discount
                     	}//end min purchase
					}//end country
				}//until date
			}//start date
		}//end loop
		return {result:newTotal,title:promoTitle,amount:promoAmount};
	},

	edit: function(element) {
		this.elementArray[element.id]='clicked'
		this.setState(false);
	},
	
	update: function() {
		var errFlag	= false;
		for (var member in this.elementArray) {
			if(this.elementArray[member]!=null) {
			 	if(checkFormElement($(member))==true) {
					var elValue  = $(member).value;
					if(member.indexOf('quantity_')>-1) {
						var product_id = member.replace('quantity_','');
						this.updateQuantity(product_id,elValue);
						this.elementArray[member] = elValue;
						//TO DO : NEED TO ADD VALIDATION FOR LOWER THAN ZERO
					}
					else if(member=='giftcert'){
						if(elValue!='') {
							var gift = new giftManager();
							(getCountry()=='US') ? storeID='US' : storeID='CA';
							gift.balance($F(member),storeID,
														{
															onSuccess:'cart.addGC(amount,code);',
															onFailure:'cart.failGC();'
														});
						}
						$(member).value	= '';
						this.elementArray[member] = null;
					}
					else if(member=='promocode'){
						if(elValue!='') {
							var promo= new promoManager();
							promo.check($F(member),
											{
												onSuccess:'cart.addPromo(\'' + $F(member) + '\');',
												onFailure:'cart.failPromo();'
											});
						}
						$(member).value	= '';
						this.elementArray[member] = null;
					}
				}
				else {
					this.elementArray[member]=null;
					$(member).value = '';
					errFlag = true;
					Event.stop(member);
					break;
				}
			}
		}
		this.setState(true);
		if(errFlag==false) {
			this.show();
		}
	},

	addPromo: function(code) {
		var promo = new promoManager();
		promo.add(code,{onComplete:'cart.show()'});
		this.setState(true);
	},
	
	failPromo: function() {
		alert('There\'s a slight problem with your entry. The promotion code is not recognised. Please try again.');
		this.setState(true);
	},

	addGC: function(amount,code){
		var gift = new giftManager();
		gift.add(amount,code);
		this.setState(true);
		this.show();
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
		document.location.href = '/checkout.html';
	},
	
	updateCartIcon: function(dObj) {
		if(document.getElementById(dObj.id))
			$(dObj).innerHTML = this.count();
	},
	
	loadShipping: function() {
		new Ajax.Request(
		  '/ajax/data/shipping.xml', {method: 'post', onComplete: this.setShippingXML.bindAsEventListener(this)}
   		);	
	},
	
	setShippingXML: function(xml){
		this.shippingXML 	= xml;
		this.shippingLoaded	= true;
		this.show_complete();
	},
	
	getShippingRate: function(code,price) {
		try {
			if(orderObject) {
				if('shippingAddress' in orderObject)
					code = orderObject['shippingAddress'].shippingMethod;
			}
		}
		catch(err) {}
		var firstNode 		= get_firstchild(this.shippingXML.responseXML.documentElement);
		var x 				= this.shippingXML.responseXML.getElementsByTagName(firstNode.nodeName);
		for(var i=0;i<x.length;i++) {
			if(getNodeValueByChildName(x[i],'nfs_code')==code) {
				for(var j=0;j<x[i].childNodes.length;j++) {
					var currentNode = x[i].childNodes[j];
					var name		= getNodeValueByChildName(x[i],'name')
					if(x[i].childNodes[j].nodeName=='ship_option') {
						var priceRange 		= getNodeValueByChildName(currentNode,'price_range').split('-');
						if(price>=parseFloat(priceRange[0])&&price<=parseFloat(priceRange[1])) {
							this.truck.put('shippingMethod', {name:name,rate:getNodeValueByChildName(currentNode,'rate')});
							break;
						}
					}
				}	
			}
		}
		return this.truck.get('shippingMethod').rate;
	}
};	