	var uniqueBasketID = 'BASKET_' + uniqueId().toString().replace('.','');

	function showPreview() {
		var display = new painter();
		$('orderSummary').innerHTML = '';
		display.loadLayout('/ajax/layouts/previewLayout.html',{target:'chkout-left',onComplete:'cart.show($(\'preview-repeater\'));trackStart();'});
		getServerTime();
	};
	
	function trackStart() {
		var orderDetails 	= cart.calculateDetails();
		trackAction($('img1'),'confirmation',{count:cart.count(),total:orderDetails.grandTotal,basketId:uniqueBasketID});
	};
	
	function showLogin() {
		if(user.check()){
			showShipping();
		}
		else {
			var display = new painter();
			display.loadLayout('/ajax/layouts/signinLayout.html',{target:'chkout-left', onComplete:'getOptins($("signin-optins"));'});
		}
	};
	
	function showShipping() {
		if(user.check())
			address.count({onComplete:'showShipping_addressBook(addressCount);'});
		else 
			showShipping_form();
	};
	
	function showShipping_addressBook(count) {
		if(count>0) {
			var display = new painter();
			display.loadLayout('/ajax/layouts/shippingreturningLayout.html',{target:'chkout-left',onComplete:'showShippingOptions();address.display({onComplete:\'selectShippingAddress();\'})'});
		}
		else
			showShipping_form();
	};
	
	function selectShippingAddress() {
		if('shippingAddress' in orderObject) { 
			if('address_id' in orderObject['shippingAddress']) {
				var address = new addressManager();
				address.selectAddress($('addressBookForm'),orderObject['shippingAddress'].address_id);
			}
		}
	};
	
	function showShipping_form() {
		var display = new painter();
		display.loadLayout('/ajax/layouts/shippingnewLayout_' + getCountry() + '.html',{target:'chkout-left',onComplete:'showShippingOptions();'});
	};

	function showBilling() {
		if(user.check())
			address.count({onComplete:'showBilling_addressBook(addressCount);'});
		else 
			showBilling_form();
	};
	
	function showBilling_addressBook(count) {
		if(count>0) {
			var display = new painter();
			display.loadLayout('/ajax/layouts/paymentreturningLayout.html',{target:'chkout-left',onComplete:'address.display({onComplete:\'selectBillingAddress();\'})'});
			showSummary();
		}
		else {
			showBilling_form();
		}
	};
	
	function showBilling_form() {
		var display = new painter();
		display.loadLayout('/ajax/layouts/paymentnewLayout_' + getCountry() + '.html',{target:'chkout-left',onComplete:'showBilling_complete();'});
	};
	
	function showSummary() {
		var display = new painter();
		display.loadLayout('/ajax/layouts/ordersummaryLayout.html',{target:'orderSummary',onComplete:'cart.show($(\'order-repeater\'));'});
	};

	function selectBillingAddress() {
		showBilling_complete();
		if('billingAddress' in orderObject) { 
			if('address_id' in orderObject['billingAddress']) {
				var address = new addressManager();
				address.selectAddress($('addressBookForm'),orderObject['billingAddress'].address_id);
			}
		}
	};
	
	function populateFormByObject(formObj,dataObj) {
	    for(var i=0;i<formObj.elements.length;i++) {
	    	var item = formObj.elements[i];
			if(item.id in dataObj) {
				if(item.type=='select-one')
					selectMatchingOptions($(item),dataObj[item.id]);
				else if (item.type=='text')
					$(item).value = dataObj[item.id];
			}
	    }
	};

	function showShipping_complete() {
		if('shippingAddress' in orderObject) { 
			populateFormByObject($('shippingAddress'),orderObject['shippingAddress']);
			if(document.getElementById('same-as-billing') && ('same' in orderObject['billingAddress']))
				$('same-as-billing').checked=true;
			if(document.getElementById('show-wrap-options') && ('giftwrap' in orderObject))
				$('show-wrap-options').checked=true;
		}
		showSummary();
	};
	
	function showBilling_complete() {
		try {
			try{
				if('billingAddress' in orderObject && document.getElementById('billingAddress')) {
					populateFormByObject($('billingAddress'),orderObject['billingAddress']);
				}
			}
			catch(err){}
			var details = cart.calculateDetails({padding:'false'});
			if(document.getElementById('payment_cc')) {
				if('billingDetails' in orderObject && document.getElementById('payment_cc')) {
					populateFormByObject($('ccDetails'),orderObject['billingDetails']);
				}
				if(details.grandTotal==0 && details.giftTotal>0) {
					Element.show('payment_gc');
					Element.hide('payment_cc');
					$('paygc').checked = true;
					$('paycc').checked = false;
				}	
				else {
					Element.show('payment_cc');
					Element.hide('payment_gc');
					$('paygc').checked = false;
					$('paycc').checked = true;
					if(getCountry()=='CA') {
						removeOption($('CardType'),'D'); //if current country is CA, remove the Discovery Card Option
					}
				}
			}
			showSummary();
		}
		catch(err){}
	};
	
	//Gift Wrapping
	function showGiftwrap() {
		var display = new painter();
		display.loadLayout('/ajax/layouts/giftwrapLayout.html',{target:'chkout-left', onComplete:'showGiftwrap_complete();'});
	};
	
	function showGiftwrap_complete() {
		var display = new painter();
		display.repeat($('gift-repeater'), cart.getContentObj(), {insert:'after',onComplete:'populateGiftwrap();'});
	};
	
	function populateGiftwrap() {
		Form.getInputs($('giftwrap'),'checkbox').find(
			function(item){
				var product_id = item.value;
				if('giftwrap-'+product_id in orderObject) {
					if(orderObject['giftwrap-'+product_id]!=null) {
						item.checked=true;
						$(product_id+'_note').value = orderObject['giftwrap-'+product_id].note;
					}
				}
			}
		);
	};

	function saveGiftwrapping() {
		if(checkForm($('giftwrap'))) {
			Form.getInputs($('giftwrap'),'checkbox').each(
				function(item) {
					var product_id = item.value;
					if(item.checked) {
						orderObject['giftwrap']=true;
						orderObject['giftwrap-'+product_id] = {product_id:product_id, note:$F(product_id+'_note')};
					}
					else {
						orderObject['giftwrap-'+product_id]=null;
					}
				}
			);
			if(user.check())
				address.count({onComplete:'showBilling(addressCount);'});
			else
				showBilling();
		}
	};
		
	function saveShipping_returning() {
		var address = new addressManager();
		if(address.returnSelectedAddress()!=null) {
			var sMethod=Form.getInputs($('shippingMethod'),'radio').find(function(re){return re.checked;});
			if(!sMethod)
					alert('Please choose a Shipping Method');
			else {
				var sAddressObject = address.returnSelectedAddress();
				orderObject['shippingAddress'] = {
					FirstName:sAddressObject.FirstName,
					LastName:sAddressObject.LastName,
					Address1:sAddressObject.Address1,
					Address2:sAddressObject.Address2,
					City:sAddressObject.City,
					State:sAddressObject.State,
					Zip:sAddressObject.Zip,
					Phone1:sAddressObject.Phone.substring(0,2),
					Phone2:sAddressObject.Phone.substring(3,5),
					Phone3:sAddressObject.Phone.substring(6,10),
					shippingMethod:sMethod.value,
					address_id:sAddressObject.address_id
				};	
			if($('show-wrap-options').checked==true)
				showGiftwrap();
			else
				address.count({onComplete:'showBilling(addressCount);'});		
			}
		}
		else {
			alert('Please select a shipping address.');
		}
	};
	
	function editBilling(state) {
		if(document.getElementById('review')) {
			item 	= $('review');
			mode	= 'review';
		}
		if(state==false) {
			if(mode=='review') {
				item.addClassName('btn-update-large');
				item.removeClassName('btn-review-large');
			}
		}
		else {
			if(mode=='review') {
				item.addClassName('btn-review-large');
				item.removeClassName('btn-update-large');
			}
		}
	};
	
	function updateBilling() {
		if($('review').hasClassName('btn-update-large')==true) {
			if($F('promocode')!='') {
				if(checkFormElement($('promocode'))==true) {
					cart.showNotifier('Checking Promotion Code, please wait...');
					var promo = new promoManager();
					promo.add($F('promocode'),{onSuccess:'cart.hideNotifier();',onFailure:'cart.hideNotifier();cart.failPromo();'});
				}
				$('promocode').value='';
			}
			if($F('giftcert')!='') {
				if(checkFormElement($('giftcert'))==true) {
					(getCountry()=='US') ? storeID='US' : storeID='CA';
					cart.showNotifier('Checking Gift Certificate, please wait...');
					var gift = new giftManager();
					gift.balance($F('giftcert'),storeID,{onSuccess:'cart.addGC(amount,code);',onFailure:'cart.hideNotifier();cart.failGC();'});					
				}
				$('giftcert').value='';
			}
			editBilling(true);
			return false;
		}
		else {
			return true;
		}
	};
	
	function addPromo(code) {
		var promo = new promoManager();
		promo.add(code,{onComplete:'showBilling_complete();showSummary();'});
		editBilling(true);
	};
	
	function failPromo() {
		alert('There\'s a slight problem with your entry. The promotion code is not recognised. Please try again.');
		editBilling(true);
	};

	function addGC(amount,code){
		var gift = new giftManager();
		gift.add(amount,code);
		alert('Gift Certificate Applied');
		editBilling(true);
		showBilling_complete();
		showSummary();
	};
	
	function failGC() {
		alert('The gift certificate number is not recognized. Please try again.');
		editBilling(true);
	};
	
	function getPaymentInfo() {
		if($('paycc').checked==true) {
			prNum = $F('CardNumber');
			var tmpString = '';
			for(var i=1;i<prNum.length-4;i++) {
				tmpString = tmpString + '*';
			}	
			prNum = prNum.substring(prNum.length-4,prNum.length);
			return {
						method:'cc',
						CardHolderName:$F('CardHolderName'),
						CardType:$F('CardType'),
						CardType_name:$('CardType').options[$('CardType').selectedIndex].text,
						ExpirationDate:$F('expmonth')+$F('expyear'),
						expyear:$F('expyear'),
						expmonth:$F('expmonth'),
						CardNumber:$F('CardNumber'),
						protectedNumber: tmpString+prNum,
						CardSecurityCode:$F('CardSecurityCode')
					};
		}
		else if ($('paygc').checked==true) {
			return {
				method:'gc'	
			};
		}
	};
	
	function saveBilling_returning() {
		var errFlag=false;
		if(updateBilling()==true) {
			if(address.returnSelectedAddress()!=null) {
				var paymentDetails = getPaymentInfo();
				if(paymentDetails.method=='cc') {
					if(checkForm($('ccDetails'))) {
						if(checkCreditCard($F('CardNumber'),$F('CardType'))) {
							orderObject['billingDetails'] = paymentDetails;
						}
						else {
							alert('The credit card number does not match the selected cart type. Please re-enter your credit card information or select a new form of payment.');
							errFlag=true;
						}
					}
					else {
						errFlag=true;
					}
				}
				else if(paymentDetails.method=='gc') {
					orderObject['billingDetails'] = paymentDetails;
				}
				if(errFlag==false) {
					var sAddressObject = address.returnSelectedAddress();
					orderObject['billingAddress'] = {
						FirstName:sAddressObject.FirstName,
						LastName:sAddressObject.LastName,
						Address1:sAddressObject.Address1,
						Address2:sAddressObject.Address2,
						City:sAddressObject.City,
						State:sAddressObject.State,
						Zip:sAddressObject.Zip,
						Phone1:sAddressObject.Phone.substring(0,2),
						Phone2:sAddressObject.Phone.substring(3,5),
						Phone3:sAddressObject.Phone.substring(6,10),
						Email:user.getEmail(),
						address_id:sAddressObject.address_id
					};
					var display = new painter();
					display.loadLayout('/ajax/layouts/confirmLayout.html',{target:'chkout-left',onComplete:'reviewAndOrder();'});
				}
			}//no billing address selected
			else {
				alert('Please select a Billing Address');
			}
		}
	};

	function saveBilling() {
		try {
			var errFlag=false;
			if(checkForm($('billingAddress'))) {
				if(updateBilling()==true) {
					var paymentDetails = getPaymentInfo();
					if(paymentDetails.method=='cc') {
						if(checkForm($('ccDetails'))) {
							if(checkCreditCard($F('CardNumber'),$F('CardType'))) {
								orderObject['billingDetails'] = paymentDetails;
							}
							else {
								alert('The credit card number does not match the selected cart type. Please re-enter your credit card information or select a new form of payment.');
								errFlag=true;
							}
						}
						else {
							errFlag=true;
						}
					}
					else if(paymentDetails.method=='gc') {
						orderObject['billingDetails'] = paymentDetails;
					}
					if(errFlag==false) {
						orderObject['billingAddress'] = {
							FirstName:$F('FirstName'),
							LastName:$F('LastName'),
							Address1:$F('Address1'),
							Address2:$F('Address2'),
							City:$F('City'),
							State:$F('State'),
							Zip:$F('Zip'),
							Phone1:$F('Phone1'),
							Phone2:$F('Phone2'),
							Phone3:$F('Phone3'),
							Email:$F('email')
						};
						var display = new painter();
						display.loadLayout('/ajax/layouts/confirmLayout.html',{target:'chkout-left',onComplete:'reviewAndOrder()'});
					}
				}
			}
		}
		catch(err) {
		}
	};
				
	function saveShipping() {	
		if(checkForm($('shippingAddress'))) {
			var sMethod=Form.getInputs($('shippingMethod'),'radio').find(function(re){return re.checked;});
			var province 	= '';
			var state		= '';
			if(document.getElementById('province')) state = $F('province');
			if(document.getElementById('state')) state = $F('state');
			if(!sMethod)
				alert('Please choose a Shipping Method');
			else {
				orderObject['shippingAddress'] = {
					FirstName:$F('FirstName'),
					LastName:$F('LastName'),
					Address1:$F('Address1'),
					Address2:$F('Address2'),
					City:$F('City'),
					State:$F('State'),
					Zip:$F('Zip'),
					Phone1:$F('Phone1'),
					Phone2:$F('Phone2'),
					Phone3:$F('Phone3'),
					shippingMethod:sMethod.value
				};
				if($('same-as-billing').checked==true) {
					orderObject['billingAddress'] = {
						FirstName:$F('FirstName'),
						LastName:$F('LastName'),
						Address1:$F('Address1'),
						Address2:$F('Address2'),
						City:$F('City'),
						State:$F('State'),
						Zip:$F('Zip'),
						Phone1:$F('Phone1'),
						Phone2:$F('Phone2'),
						Phone3:$F('Phone3'),
						same:'true'
					};
				}
				else {
					orderObject['billingAddress']=null;
				}
				if(user.check()) {
					address.create($('shippingAddress'),{onComplete:'showBilling();'});
					if($('show-wrap-options').checked==true)
						showGiftwrap();
					else
						address.count({onComplete:'showBilling(addressCount);'});		
				}
				else {
					if($('show-wrap-options').checked==true)
						showGiftwrap();
					else
						showBilling();	
				}
			}
		}
	};
	
	function reviewAndOrder() {
		$('orderSummary').innerHTML = '';
		var orderDetails 	= cart.calculateDetails();
		var display 		= new painter();
		var shippingRate	= '';
		if(orderDetails.shippingCost=='0.00') {
			shippingRate='Free';
		}
		else {
			shippingRate='$'+orderDetails.shippingCost;
		}
		display.repeat($('shippingAddress'), orderObject['shippingAddress'], {insert:'after'});
		display.repeat($('itemSummary'), cart.getContentObj(), {insert:'after'});
		display.repeat($('billingAddress'), orderObject['billingAddress'], {insert:'after'});
		display.repeat($('shippingDetails'), {name:orderDetails.shippingName,price:shippingRate,description:orderDetails.shippingDesc}, {insert:'after'});
		populatePaymentDetails();
		display.repeat($('paymentDetails'), orderObject['billingDetails'], {insert:'after'});
		if(document.getElementById('dropshipInfo')) {
			display.repeat($('dropshipInfo'), cart.getContentObj(), {insert:'after'});
		} 
		cart.show();
	};
	
	function populatePaymentDetails() {
		if(orderObject['billingDetails'].method=='cc') {
			$('paymentDetails').innerHTML = '<strong><data:CardType_name></data:CardType_name>: <data:protectedNumber></data:protectedNumber><br />'
						 + 'Exp. <data:ExpirationDate></data:ExpirationDate></strong></div></p>';
		}
		else if(orderObject['billingDetails'].method=='gc') {
			$('paymentDetails').innerHTML = '<strong>Gift Certificate<br />';
		}
	};
	
	function processOrder() {
		try{
			this.url 		= '/ajax/order.jsp';
			var storeID		= '';
			(getCountry()=='US') ? storeID	= 'USA' : storeID = 'CAN';
			(user.check()) ? userInfo = '&user_id='+user.getUserId()+'&firstname='+user.getFirstName()+'&lastname='+user.getLastName() : userInfo='&is_guest=1';
			var orderDetails 	= cart.calculateDetails({padding:'false'});
			var cartContents 	= cart.getContentObj();
			var gift 			= new giftManager();
			var orderDetailsInt	= cart.calculateDetails({padding:'false'});
			var dropshipCosts	= '';
			(orderDetails.cartTotal_dropship>0) ? dropshipCosts = tempItemListTwo('product_ship_cost',cartContents) : dropshipCosts ='';
			var giftPurchase = returnCartGifts(cartContents,'gift_to','ItemGiftTo_') 
	                            + returnCartGifts(cartContents,'gift_from','ItemGiftFrom_') 
	                            + returnCartGifts(cartContents,'gift_message','ItemGiftMessage1_') 
	                            + returnCartGifts(cartContents,'gift_email','GiftCertEmail_');
			var formParams = '&newOrder=1'
				+ jsonSerialise(orderObject['billingAddress'],'bill_')
				+ jsonSerialise(orderObject['shippingAddress'],'ship_')
				+ jsonSerialise(orderObject['billingDetails'])
				+ '&bill_Country=' +storeID
				+ '&ship_Country=' + storeID
				+ userInfo
				+ getGiftwrapOrderDetails()
				+ '&email=' 		+ escape(orderObject['billingAddress'].Email)
				+ '&item_codes=' 	+ escape(tempItemList('product_number',cartContents)) 
				+ '&item_quantity=' + escape(tempItemList('quantity',cartContents)) 
				+ '&item_prices=' 	+ escape(tempItemList('product_price',cartContents)) 
				+ '&item_titles=' 	+ escape(tempItemList('product_name',cartContents)) 
				+ '&item_formats=' 	+ escape(tempItemList('product_format',cartContents))
				+ dropshipCosts
				+ '&OrdSource=WEB'
				+ '&StoreID='		+ storeID	
				+ '&SubTotal='		+ orderDetails.cartTotal
				+ '&OrdShipping='	+ orderDetails.shippingCost
				+ '&ShippingMethod='+ escape(orderObject['shippingAddress'].shippingMethod)
				+ '&Total='			+ orderDetails.grandTotal_all
				+ '&TotAdditionalShippingCost=' + (Math.round((orderDetails.cartTotal_dropship)*100)/100)
				+ '&GiftFrom=' + escape(orderObject['billingAddress'].FirstName + ' ' + orderObject['billingAddress'].LastName) 
				+ '&PromotionDiscount='	+ orderDetails.promoTotal;
			if(giftPurchase!='')
				formParams += giftPurchase;				
			if(orderDetails.giftTotal>0)
				formParams += '&gc_codes='+tempItemList('code',gift.getContentObj())
						+ '&gc_amounts='+orderDetails.giftTotal;
			new Ajax.Request(
				this.url,{method:'post',parameters:formParams+'&nc='+noCache(),onComplete:this.processOrder_complete.bindAsEventListener(this)});
		}
		catch(err) {}
	};

	function returnCartGifts(dataObj,property,paramName) {
		var tmpString = '';
		for(member in dataObj) {
		    if(property in dataObj[member]) {
		        tmpString += '&' + paramName + dataObj[member].product_id + '='+ escape(dataObj[member][property]);
		    }
		}
		return tmpString;
	};
			
	function getGiftwrapOrderDetails() {
		var itemsInCart 		= cart.getContentObj();
		var orderDetails 		= cart.calculateDetails({padding:'false'});
		var itemsGiftwrapped	= 0;
		var serialiseString	= '';
		var giftRate	= '4';
		for(var item in itemsInCart) {
			if('product_id' in itemsInCart[item]) {
				var product_id 			= itemsInCart[item].product_id;
				var product_quantity	= itemsInCart[item].quantity;
				var product_number		= itemsInCart[item].product_number;
				if('giftwrap-'+product_id in orderObject) {
					if(orderObject['giftwrap-'+product_id]) {
						var gMsg	= orderObject['giftwrap-'+product_id].note;
						var gMsgLen = gMsg.length;
						var gMsg1Len=0;var gMsg1='';var gMsg2='';
						if(gMsgLen>33){
							gMsg1Len=32;
							gMsg1=gMsg.substring(0,gMsg1Len);
							gMsg2=gMsg.substring(33,gMsgLen);
						}
						else {
							gMsg1=gMsg.substring(0,gMsgLen);
						}
						var gMsg1 	= orderObject['giftwrap-'+product_id].note.substring(0,32);
						serialiseString += '&ItemWrap_'+product_number+'=Y'
									+ '&ItemGiftMessage1_'+product_number+'='+escape(gMsg1)
									+ '&ItemGiftMessage2_'+product_number+'='+escape(gMsg2)
									+ '&Gift-Wrap-Unit-Price_'+product_number+'='+giftRate;
						itemsGiftwrapped += parseInt(product_quantity);
					}
					else
						serialiseString += '&ItemWrap_' + product_number + '=N';
				}
				else 
					serialiseString += '&ItemWrap_' + product_number + '=N';
			}
		}	
		if(itemsGiftwrapped>0) {
			serialiseString = serialiseString + '&SendGiftMessage=Y';
		}
		else {
			serialiseString = serialiseString + '&SendGiftMessage=N';
		}
		return serialiseString + '&GiftWrapping='+ orderDetails.giftWrappingTotal;
	};
	
	function processOrder_complete(response) {
		var x 		= response.responseXML.getElementsByTagName('OrderNumber');
		if(x.length>0)
			oNmbr = getNodeValue(x[0]);
		else
			oNmbr = 'N/A';
		orderObject['transaction-result'] = {ordernum: oNmbr};
		var display = new painter();
		display.loadLayout('/ajax/layouts/completeLayout.html',{target:'chkout-left',onComplete:'orderCompleted();'});
	};
	
	function orderCompleted() {
		var orderDetails 	= cart.calculateDetails();
		var display 		= new painter();
		var shippingRate	= '';
		if(orderDetails.shippingCost=='0.00') {
			shippingRate='Free';
		}
		else {
			shippingRate='$'+orderDetails.shippingCost;
		}
		display.repeat($('shippingAddress'), orderObject['shippingAddress'], {insert:'after'});
		display.repeat($('itemSummary'), cart.getContentObj(), {insert:'after'});
		display.repeat($('billingAddress'), orderObject['billingAddress'], {insert:'after'});
		display.repeat($('shippingDetails'), {name:orderDetails.shippingName,price:shippingRate,description:orderDetails.shippingDesc}, {insert:'after'});
		populatePaymentDetails();
		display.repeat($('paymentDetails'), orderObject['billingDetails'], {insert:'after'});
		cart.show();
		if(orderObject['transaction-result'].ordernum=='N/A/') {
			Element.show('failureResponse');
		}
		else {
			Element.show('successResponse');
		}
		$('orderNumber').innerHTML 		= orderObject['transaction-result'].ordernum;
		$('orderDate').innerHTML		= getServerTime();
		$('orderTotal').innerHTML		= '$' + orderDetails.grandTotal;
		$('emailConfirm').innerHTML		= orderObject['billingAddress'].Email;
		$('ccMain').innerHTML			= '0';
		trackAction($('img1'),'order',{count:cart.count(),total:orderDetails.grandTotal,basketId:uniqueBasketID});
		trackAction($('img2'),'junction',{count:cart.count(),total:orderDetails.grandTotal,oid:orderObject['transaction-result'].ordernum});
		cart.empty();
		var gift = new giftManager();
		gift.empty();
		var promo = new promoManager();
		promo.empty();
		orderObject = null;
	};

	function trackAction(elem, type,optionalParams) {
		var options = {};Object.extend(options, optionalParams || {});
		var c = {};c.US = {};c.CA = {};
		c.US.order = 'https://secure.zt03.net/rspoc/r1.php?C=PAY&A1=' + options.count + '&A2=' + options.total + '&A3=' + getCountry() + 'D&A4=' + options.basketId;
		c.CA.order = 'https://secure.zt03.net/rspoc/r1.php?C=PAY&A1=' + options.count + '&A2=' + options.total + '&A3=' + getCountry() + 'D&A4=' + options.basketId;
		c.US.confirmation = 'https://secure.zt03.net/rspoc/r1.php?C=CNP&A1=' + options.count + '&A2=' + options.total + '&A3=' + getCountry() + 'D&A4=' + options.basketId;
		c.CA.confirmation = 'https://secure.zt03.net/rspoc/r1.php?C=CNDCNP&A1=' + options.count + '&A2=' + options.total + '&A3=' + getCountry() + 'D&A4=' + options.basketId;
		c.US.junction = 'https://www.emjcd.com/u?AMOUNT=' + options.total + '&CID=824094&OID=' + options.oid + '&TYPE=4474&CURRENCY=' + getCountry() + 'D&METHOD=IMG';
		c.CA.junction = 'https://www.emjcd.com/u?AMOUNT=' + options.total + '&CID=1502118&OID=' + options.oid + '&TYPE=308472&CURRENCY=' + getCountry() + 'D&METHOD=IMG';
		elem.src = c[getCountry()][type];	
	};
		
	function jsonSerialise(dataObj,prepend) {	
		var tmpString 			= '';
		var h 					= $H(dataObj);
		if(!prepend) prepend	= '';
		h.each(function(pair){tmpString+='&'+prepend+pair.key+'='+escape(pair.value);});
		return tmpString;
	};
	
	function showShippingOptions() {
		try {
			var freeShipping 	= false;
            var orderDetails	= cart.calculateDetails({padding:'false'});
			var price			= 0;
			var restrict		='';
            freeShipping 		= orderDetails.freestandard;
			if(orderDetails.cartTotal>=100) {
				freeShipping=true;
				if(orderDetails.cartTotal_standard==0)
					restrict='2,3'; //the cart only contains either digital, dropship or subscription items, they do not have nfs 2 or 3 shipping options
			}
			else {
				if(orderDetails.cartTotal_standard==0) {
					freeShipping=true;
					restrict='2,3'; //the cart only contains either digital, dropship or subscription items, they do not have nfs 2 or 3 shipping options
				}
			} 
			(orderDetails.cartTotal>=100) ? price=orderDetails.cartTotal : price=orderDetails.cartTotal_standard;
			var firstNode 		= get_firstchild(cart.shippingXML.responseXML.documentElement);
			var x 				= cart.shippingXML.responseXML.getElementsByTagName(firstNode.nodeName);
			var shippingOptions	= new Object();
			for(var i=0;i<x.length;i++) {
				var nfsCode = getNodeValueByChildName(x[i],'nfs_code');
				if(getNodeValueByChildName(x[i],'country')==getCountry() && (restrict!='' && (restrict.indexOf(nfsCode)<0) || restrict=='')) {
					for(var j=0;j<x[i].childNodes.length;j++) {
						var currentNode = x[i].childNodes[j];
						if(x[i].childNodes[j].nodeName=='ship_option') {
							var priceRange 	= getNodeValueByChildName(currentNode,'price_range').split('-');
							if(price>=parseFloat(priceRange[0])&&price<=parseFloat(priceRange[1])) {
								var rate;
								if(freeShipping==true && (nfsCode=='1' || nfsCode=='4')) {
									rate=0;
								}
								else {
									rate = getNodeValueByChildName(currentNode,'rate')-0;
								}
								(rate==0) ? rate='Free' : rate='$'+rate;
								shippingOptions[i] = {rate:rate, name:getNodeValueByChildName(x[i],'name'), code:nfsCode};
							}
						}
					}	
				}
			}
			var display = new painter();
			display.repeat($('shipping-repeater'), shippingOptions, {insert:'after',onComplete:'selectShipping()'});
			showShipping_complete();
		}
		catch(err) {}
	};


	function selectShipping() {
		try {
			//a hack - we cannot by default select the first radio item because repeater repeated the form the radio elements are in...
			if(document.getElementById('shipping_1')) $('shipping_1').checked=true;
			if(document.getElementById('shipping_4')) $('shipping_4').checked=true;
			
			if('shippingMethod' in orderObject['shippingAddress']) {
				Form.getInputs($('shippingMethod'),'radio').each(
					function(item){
						if(orderObject['shippingAddress'].shippingMethod==item.value)
							item.checked=true;
					}
				);
			}		
		}
		catch(err){	
		}
	};

	function showOrderProcessing(text) {
		if(document.getElementById('notifier')) {
			$('notifier').innerHTML = '<img src="/media/global/loading.gif" border=0 />&nbsp;' + text;
			Element.show('notifier');
			if(document.getElementById('orderbutton'))
				Element.hide('orderbutton');	
		} 	
	};
		
	function tempItemList(keyItem,dataObj) {
		var tmpString	= '';
		for (var member in dataObj) {
			for(var property in dataObj[member]) {
				if(tmpString!='') tmpString += ',';
				if(property==keyItem) {
                    var tmpValue = dataObj[member][property];
					if(tmpValue.toString().indexOf('Email')>-1) {
						tmpString += 'email';
					}
					else {
						tmpString += tmpValue;
					}
					break;
				}
			}
		}
		return tmpString;
	};

	function tempItemListTwo(keyItem,dataObj) {
		var tmpString	= '';
		for (var member in dataObj) {
			for(var property in dataObj[member]) {
				if(property==keyItem) {
					tmpString += '&AdditionalShippingCost_' 
						+ dataObj[member].product_number + '=' 
						+ (Math.round(parseFloat(dataObj[member].quantity*dataObj[member][property])*100)/100).toFixed(2);
				}
			}
		}
		return tmpString;
	};
			
	function checkCreditCard (cardnumber,cardname) {
		var cards = new Array();
	  	cards[0] = {name: 'V', 
	               length: '13,16', 
	               prefixes: '4',
	               checkdigit: true}; //Visa
	  	cards[1] = {name: 'M', 
	               length: '16', 
	               prefixes: '51,52,53,54,55',
	               checkdigit: true}; //Mastercard
	  	cards[2] = {name: 'A', 
	               length: '15', 
	               prefixes: '34,37',
	               checkdigit: true}; //American Express
	  	cards[3] = {name: 'D', 
	               length: '16', 
	               prefixes: '6011,650',
	               checkdigit: true}; //Discover
	  	var cardType=-1;
	  	for (var i=0;i<cards.length;i++) {
	    	if(cardname.toLowerCase()==cards[i].name.toLowerCase()) {
	      		cardType = i;
	     	 	break;
	    	}
	 	}
	  	if(cardType==-1||cardnumber.length==0) return false; 
	  	cardnumber 	= cardnumber.replace (/\s/g,'');
	 	var cardNo 	= cardnumber;
	  	var cardexp = /^[0-9]{13,19}$/;
	 	if(!cardexp.exec(cardNo)) return false;
	  	if(cards[cardType].checkdigit){
	    	var checksum=0;                                  // running checksum total
	    	var mychar='';                                   // next char to process
	    	var j=1;                                         // takes value of 1 or 2
	    	var calc;
	    	for(i=cardNo.length-1;i>=0;i--) {
	      		calc=Number(cardNo.charAt(i)) * j;
	      		if (calc>9) {
	        		checksum=checksum+1;
	        		calc=calc-10;
	      		}
	      		checksum=checksum+calc;
	      		if(j==1) {j=2} else {j=1};
	    	} 
	    	if(checksum%10!=0)  return false;
	  	}  
	 	var LengthValid 	= false;
	  	var PrefixValid 	= false; 
	  	var undefined; 
	  	var prefix 			= new Array();
	  	var lengths 		= new Array();
	  	prefix=cards[cardType].prefixes.split(',');
	  	for(var i=0;i<prefix.length;i++) {
	    	var exp=new RegExp ('^'+prefix[i]);
	    	if(exp.test(cardNo)) PrefixValid=true;
	  	} 
	  	if (!PrefixValid) return false;
	  	lengths = cards[cardType].length.split(',');
	  	for (var j=0; j<lengths.length; j++) {
	  		if(cardNo.length==lengths[j]) LengthValid = true;
	  	}
	  	if(!LengthValid) return false;   
	  return true;
	};