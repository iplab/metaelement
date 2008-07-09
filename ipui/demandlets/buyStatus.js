/*
 * buyStatus.js
 */
function initiate_buyStatus(dObj) {
	var itemId = demandletManager.setup($(dObj));
	var pId = getMetaValue('product_id');
	if (pId == false) { 
		dObj.remove();
	} else {
		dataManager.register(['/ajax/data/'+pId+'_product.xml'], 
			function (xhr) { 
				createBuyStatus(xhr, dObj); 
			});
	}
};
function createBuyStatus(xhr, dObj) {
	if (xhr && xhr.responseXML) {
		var xml = xhr.responseXML.documentElement;
		var pData = xml.getElementsByTagName('row');
		if (pData.length) {
			pData = pData[0];
		} else {
			dObj.remove();
			return;
		}
	} else {
		dObj.remove();
		return;
	}
	var site = (hasSiteName('canada'))?'canada':'us';
	if (getNodeValueByChildName(pData, 'product_canada') == 0 && site == 'canada') {
		dObj.remove();
		return;
	}
	var prod = new BuyStatus(pData, site);
	if (!prod.ourPrice || prod.ourPrice <= 0) {
		dObj.remove();
		return;
	} 
	var spanTxt = Builder.node('span', {className:'avail'}, ['Availability: ', Builder.node('em', [prod.availTxt])]);
	if (prod.active == 0) {
		dObj.appendChild(spanTxt);
	} else {
		var imgClassName = 'btn-addtocart-large';
		if (prod.prodType.toLowerCase().indexOf('magazine') > -1) {
			if (prod.issues) {
				dObj.appendChild(Builder.node('span', [prod.issues+' issues']));
			}
			dObj.appendChild(document.createElement('br'));
			if (prod.msrp > 0) {
				dObj.appendChild(Builder.node('span', {className:'line-through'}, ['Newstand Price: $'+ prod.msrp]));
				dObj.appendChild(document.createElement('br'));
			}
			dObj.appendChild(Builder.node('span', {className:'current-price'}, ['Your Price: $' + prod.ourPrice]));
			imgClassName = 'btn-subscribenow-large';
		} else {
			dObj.appendChild(spanTxt);
			dObj.appendChild(document.createElement('br'));
			if (prod.availTxt.toLowerCase().indexOf('backorder') > 1) {
				var d = (prod.back_order_date.getMonth()+1) + '/' + prod.back_order_date.getDate() + '/' + prod.back_order_date.getFullYear() + '.';
				dObj.appendChild(Builder.node('span', ['This item will be available again after ' + d]));
				dObj.appendChild(document.createElement('br'));
			} else if (prod.availTxt.toLowerCase().indexOf('pre') > -1) {
				var d = (prod.availDate.getMonth()+1) + '/' + prod.availDate.getDate() + '/' + prod.availDate.getFullYear() + '.';
				dObj.appendChild(Builder.node('span', ['This item will be available after ' + d]));
				dObj.appendChild(document.createElement('br'));
				imgClassName = 'btn-preordernow-large';
			}
			if (prod.msrp && prod.msrp > 0) {
				var msrpPrice = Builder.node('span', ['$'+prod.msrp]);
				dObj.appendChild(Builder.node('span', {className:'line-through'}, ['Reg. Price: ', msrpPrice]));
				dObj.appendChild(document.createElement('br'));
			}
			var lineThrough = ((prod.salePrice && prod.salePrice>0)?'line-through':'');
			var ourPrice = Builder.node('span', {className:lineThrough}, ['Your Price: $' + prod.ourPrice]);
			dObj.appendChild(ourPrice);
			dObj.appendChild(document.createElement('br'));
			if (prod.salePrice && prod.salePrice > 0) {
				dObj.appendChild(Builder.node('span', {className:'current-price'}, ['Sale Price: $' + prod.salePrice]));
				dObj.appendChild(document.createElement('br'));
			} else {
				$(ourPrice).addClassName('current-price');
			}
		}
		if (prod.personalized == 1) {
			var buy = Builder.node('p', {className:'phone-order'}, ['Phone orders only, please call 1-800-898-4921']);
		} else {	
			var buy = Builder.node('a', {href:'#', className:imgClassName});
			var cartProduct = { 
				product_number: prod.product_number,
				product_name: prod.product_name,
				product_price: (prod.salePrice && prod.salePrice > 0)?prod.salePrice:prod.ourPrice,
				product_image: prod.product_image,
				product_availability: prod.availTxt,
				product_giftwrap: prod.gift_wrap
			};
			if (prod.dropShipCost && prod.dropShipCost > 0) {
				cartProduct.product_ship_cost = prod.dropShipCost;
				cartProduct.product_shipping = 'dropship';
			}
			if (/magazine/i.test(prod.type)) {
				cartProduct.product_shipping = 'subscription';
			}
			if (prod.product_format) {
				cartProduct.product_format = prod.product_format;
			}
			if (/back/i.test(prod.availTxt)) {
				cartProduct.product_availability_date = prod.back_order_date; 
			} else {	
				cartProduct.product_availability_date = prod.availDate;
			}
			buy.onclick = function () {
				cart.add(prod.product_id, cartProduct);
				return false;
			};
		}
		dObj.appendChild(buy);
	}
};
function BuyStatus(product, country) {
	this.country = country;
	this.availDate = new Date(getNodeValueByChildName(product, 'availability_date_'+this.country));
	this.back_order_date = getNodeValueByChildName(product, 'back_order_date_'+this.country);
	if (this.back_order_date) {
		this.back_order_date = new Date(getNodeValueByChildName(product, 'back_order_date_'+this.country));
	}
	this.msrp = getNodeValueByChildName(product, 'msrp_'+this.country);
	this.ourPrice = getNodeValueByChildName(product, 'our_price_'+this.country);
	this.prodType = getNodeValueByChildName(product, 'type');
	this.salePrice = getNodeValueByChildName(product, 'sale_price_'+this.country);
	this.issues = getNodeValueByChildName(product, 'number_of_issues');
	this.product_id = getNodeValueByChildName(product, 'id');
	this.product_number = getNodeValueByChildName(product, 'item_number');
	this.product_image = changeFileName(getNodeValueByChildName(product, 'src_image'), 'thumbnail');
	this.product_format = getNodeValueByChildName(product, 'format');
	this.product_name = getNodeValueByChildName(product, 'title');
	this.personalized = getNodeValueByChildName(product, 'personalized');
	this.active = getNodeValueByChildName(product, 'active');
	this.availTxt = this.getAvailTxt();
	this.dropShipCost = getNodeValueByChildName(product, 'drop_ship_'+this.country);
	this.type = getNodeValueByChildName(product, 'type');
	this.gift_wrap = getNodeValueByChildName(product, 'gift_wrap');
};
BuyStatus.prototype.getAvailTxt = function () {
	var availTxt = '';
	if (this.active == 0) {
		availTxt = 'Not available for purchase';
	} else {
		var today = new Date(getServerTime());
		if (dateDiff('n', today, this.availDate) > 0) {
			availTxt = 'ON PRE-ORDER';
		} else {
			if (this.back_order_date) {
				if (dateDiff('n', today, this.back_order_date) > 0) {
					availTxt = 'ON BACKORDER';
				} else {
					availTxt = 'IN STOCK';
				}
			} else {
				availTxt = 'IN STOCK';
			}
		}
	}
	return availTxt;
}