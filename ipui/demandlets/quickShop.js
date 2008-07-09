/* 
 * quickShop.js
 */
function initiate_quickShop(dObj) {
	if (dObj) {
		var lb = new lightbox(dObj, {oncomplete: function () { setQuickShopForm($('quickshopForm'), lb); }});
	}
}
function setQuickShopForm(formObj, popup) {
	if ($(formObj)) {
		var itemNumbers = [];
		var submits = formObj.getElementsByClassName('btn-addtocart');
		for (var i = 0; i < submits.length; i++) {
			Event.observe(submits[i], 'click', handleQuickSubmit.bindAsEventListener(submits[i], formObj, popup));
		}
	}
};
function handleQuickSubmit(e, formObj, popup) {
	var ERROR_MSG = 'Sorry, but we do not recognize this product number. Please try again.';
	var inputs = {};
	var invalidNumbers = {};
	formObj.getInputs('text').each(function (inputElem) {
		if (inputElem.value) {
			inputs[inputElem.value.strip()] = '';
		}
	});
	if ($H(inputs).keys().length == 0) {
		popup.deactivate(e);
	} else {
		var itemNumbers = $H(inputs).keys().join(',');
		new Ajax.Request('/ajax/quickShop.jsp',
		{
			parameters: 'nC='+noCache()+'&item_numbers='+itemNumbers,
			onComplete: function (xhr) {
				if (xhr && xhr.responseXML) {
					var xml = xhr.responseXML.documentElement;
					var country = (hasSiteName('canada'))?'canada':'us';
					$A(xml.getElementsByTagName('row')).each(function (row) {
						if (hasChildElements(row)) {
							var isPhone = getNodeValueByChildName(row, 'personalized');
							var isCanada = getNodeValueByChildName(row, 'product_canada');
							if (country == 'canada' && isCanada == 0) {
								invalidNumbers[row.getAttribute('item_number')] = ERROR_MSG;
							} else if (isPhone && isPhone == 1) { 
								invalidNumbers[row.getAttribute('item_number')] = ERROR_MSG;
							} else {
								var qp = new QuickProduct(row, country);
								inputs[qp.item_number] = qp;
							}
						} else {
							invalidNumbers[row.getAttribute('item_number')] = ERROR_MSG;
						}
					});
					if ($H(invalidNumbers).keys().length) {
						showQuickError(invalidNumbers, formObj);
					} else {
						addQuickToCart(inputs);
					}
				}
			}
		});
	}
	Event.stop(e);
};
function addQuickToCart(quickProducts) {
	var country = (hasSiteName('canada'))?'canada':'us';
	if ($('lbContent')) {
		$('lbContent').remove();
	}
	var keys = $H(quickProducts).keys();
	for (var i = 0; i < keys.length; i++) {
		var cartOptions = quickProducts[keys[i]].getCartOptions(country);
		if (i != keys.length-1) {
			cartOptions.hideCart = true;
		}
		cart.add(quickProducts[keys[i]].product_id, cartOptions);
	}
};
function showQuickError(errorMsg, formObj) {
	var textInputs = formObj.getInputs('text');
	textInputs.each(function(input) {
		var index = input.value.strip();
		if (errorMsg[index]) {
			if (input.nextSibling && input.nextSibling.nodeName == 'UL') {
				input.nextSibling.innerHTML = '<li class="error-message">'+errorMsg[index]+'</li>';
				fadeUp(input.nextSibling.firstChild, 255, 255, 0);
			} else {
				var errorList = document.createElement('ul');
				errorList.innerHTML = '<li class="error-message">'+errorMsg[index]+'</li>';
				if (input.nextSibling) {
					input.parentNode.insertBefore(errorList, input.nextSibling);
				} else {
					input.parentNode.appendChild(errorList);
				}
				fadeUp(errorList.firstChild, 255, 255, 0);
			}
		} else if (input.nextSibling && input.nextSibling.nodeName == 'UL') {
			input.parentNode.removeChild(input.nextSibling);
		}
	});
};
function QuickProduct(row, country) {
	this.item_number = row.getAttribute('item_number');
	var fields = row.getElementsByTagName('*');
	for (var i = 0; i < fields.length; i++) {
		this[fields[i].nodeName] = (fields[i].firstChild)?fields[i].firstChild.nodeValue:null;
	}
	this.availability = this.setAvailTxt(country);
	this.currentPrice = this.getCurrentPrice(country);
};
QuickProduct.prototype.setAvailTxt = function (suffix) {
	var today = new Date(getServerTime());
	var availTxt = '';
	if (dateDiff('n', today, this['availability_date_'+suffix]) > 0) {
		availTxt = 'ON PRE-ORDER';
	} else if (this['back_order_date_'+suffix] && dateDiff('n', today, this['back_order_date_'+suffix]) > 0) {
		availTxt = 'ON BACKORDER';
	} else {
		availTxt = 'IN STOCK';
	}
	return availTxt;
};
QuickProduct.prototype.getCurrentPrice = function (country) {
	var currentPrice = null;
	if (this['sale_price_'+country] && this['sale_price_'+country] > 0) {
		currentPrice = this['sale_price_'+country];
	} else {
		currentPrice = this['our_price_'+country];
	}
	return currentPrice;
};
QuickProduct.prototype.getCartOptions = function (country) {
	var cartOptions = {
		product_number: this.item_number,
		product_name: this.title,
		product_price: this.currentPrice,
		product_availability: this.availability,
		product_giftwrap: this.gift_wrap
	};
	if (this['drop_ship_'+country] && this['drop_shop_'+country] > 0) {
		cartOptions.product_ship_cost = this['drop_ship_'+country];
		cartOptions.product_shipping = 'dropship';
	}
	if (/magazine/i.test(this.type)) {
		cartOptions.product_shipping = 'subscription';
	}
	if (this.src_image) {
		cartOptions.product_image = changeFileName(this.src_image, 'thumbnail');
	}
	if (this.format) {
		cartOptions.product_format = this.format;
	}
	if (/back/i.test(this.availTxt)) {
		cartOptions.product_availability_date = this['back_order_date_'+country]; 
	} else {	
		cartOptions.product_availability_date = this['availability_date_'+country];
	}
	return cartOptions;
};