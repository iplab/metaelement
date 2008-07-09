/*
 * features.js
 */
function initiate_cuRelProducts(dObj) {
	var itemId = demandletManager.setup($(dObj));
	dObj.today = new Date(getServerTime());
	var closeup_id = getMetaValue('closeup_id');
	if (closeup_id == false) {
		dObj.remove();
	} else {
		dataManager.register(['/ajax/data/'+closeup_id+'_curelproducts.xml'], 
			function (xhr) {
				if (!xhr || !xhr.responseXML) {
					dObj.remove();
				} else {
					var xml = xhr.responseXML.documentElement;
					displayCloseProducts(xml, dObj);
				}
			});
	}
};
function displayCloseProducts(xml, dObj) {
	var country = hasSiteName('canada')?'canada':'us';
	dObj.qiThree = getQuickInfo(dObj, country, 3);
	dObj.qiFour = getQuickInfo(dObj, country, 4);
	var features = xml.getElementsByTagName('object');
	if (features.length) {
		for (var i = 0; i < features.length; i++) {
			var numCols = features[i].getAttribute('count');
			if (!numCols || isNaN(numCols)) {
				numCols = 3;
			}
			var container = Builder.node('div', {className: 'feature-products'});
			var itemsAdded = 0;
			//var cuList = Builder.node('ul', {className: 'cols-'+numCols+' clearfix'});
			var rows = features[i].getElementsByTagName('row');
			//var itemsAdded = 0;
			for (var j = 0; j < rows.length; j++) {
				if (country == 'canada' && getNodeValueByChildName(rows[i], 'product_canada') == 0) {
					continue;
				}
				if (itemsAdded % numCols == 0) {
					var cuList = Builder.node('ul', {className: 'cols-'+numCols+' clearfix'});
					container.appendChild(cuList);
				}
				var productData = rows[j].getElementsByTagName('*');
				var cufeatures = new CloseupFeatures(productData, dObj.today, country);
				var elems = cufeatures.buildHtml(country, numCols, dObj);
				var liItem = document.createElement('li');
				for (var k = 0; k < elems.length; k++) {
					liItem.appendChild(elems[k]);
				}
				/*
				if (itemsAdded < numCols) {
					liItem.className += ' no-top-margin';
				}
				if (itemsAdded % numCols == 0) {
					liItem.className += ' new-row';
				}
				*/
				cuList.appendChild(liItem);
				++itemsAdded;
			}
			if (container.getElementsByTagName('li').length) {
				var headerTxt = document.title.split('- ')[1];
				if (!headerTxt) headerTxt = document.title;
				if (numCols == 4) {
					var header = Builder.node('h3', ['All Videos and Books Related to ' + headerTxt]);
				} else {
					var header = Builder.node('h3', ['Other Products Related to ' + headerTxt]);
				}  
				dObj.appendChild(header);
				//container.appendChild(cuList);
				dObj.appendChild(container);
			}
		}
	} else {
		dObj.remove();
	}
};
function CloseupFeatures(fields, today, country) {
	this.curSymbol = '$';
	for (var i = 0; i < fields.length; i++) {
		this[fields[i].nodeName] = (fields[i].firstChild)?fields[i].firstChild.nodeValue:null;
	}
	this['availability_date_'+country] = new Date(this['availability_date_'+country]);
	if (this['back_order_date_'+country]) {
		this['back_order_date_'+country] = new Date(this['back_order_date_'+country]);
	}
	if (dateDiff('n', today, this['availability_date_'+country]) > 0) {
		this.availTxt = 'ON PRE-ORDER';
	} else if (this['back_order_date_'+country] && dateDiff('n', today, this['back_order_date_'+country]) > 0) {
		this.availTxt = 'ON BACKORDER';
	} else {
		this.availTxt = 'IN STOCK';
	}
};
CloseupFeatures.prototype.getData = function (fieldName) {
	return ((this[fieldName])?this[fieldName]:'');
};
CloseupFeatures.prototype.isOnSale = function (country) {
	return ((this.getData('sale_price_'+country) && this.getData('sale_price_'+country) > 0)?true:false);
}
CloseupFeatures.prototype.buildHtml = function (country, cols, dObj) {
	var imageElem = (cols == 4)?Builder.node('img', { src: changeFileName(this.getData('image'), 'browse') }):Builder.node('img', { src: this.getData('feature_image') });
	if (this.getData('page_name')) {
		var frameElem = Builder.node('a', { href: this.getData('page_name'), className:'frame' });
		frameElem.prodInfo = this;
		frameElem.onmouseover = function () {
			if (cols == 4) {
				dObj.qiFour.prodInfo = frameElem.prodInfo;
				frameElem.parentNode.insertBefore(dObj.qiFour, frameElem);
			} else {
				dObj.qiThree.prodInfo = frameElem.prodInfo;
				frameElem.parentNode.insertBefore(dObj.qiThree, frameElem);
			}
		};
		frameElem.onmousemove = function (e) {
			if (Event && Event.stop) {
				Event.stop(e || window.event);
			}
		};
	} else {
		var frameElem = Builder.node('div', {className:'frame'});
	}
	frameElem.appendChild(imageElem);
	var spanName = document.createElement('span');
	spanName.innerHTML = this.getData('name');
	var pageLink = Builder.node('a', { href: this.getData('page_name') }, [spanName]);
	var title = Builder.node('dt', {className: 'name'}, [pageLink]);
	var mediaType = Builder.node('dd', {className: 'format'}, [this.getData('format')]);
	var priceData = Builder.node('dd', {className: 'price'});
	var ourPrice = Builder.node('span', { className: 'our-price' }, [this.curSymbol + this.getData('our_price_'+country)]);
	priceData.appendChild(ourPrice);
	if (this.isOnSale(country)) {
		$(ourPrice).addClassName('line-through');
		priceData.appendChild(document.createElement('br'));
		var salePrice = Builder.node('span', { className: 'current-price' }, [this.curSymbol + this.getData('sale_price_'+country)]);
		priceData.appendChild(salePrice);
	}
	
	
	var buyData = Builder.node('div', { className: 'buy' });
	if (this.personalized == 1) {
		var phone = Builder.node('p', {className: 'phone-order'}, ['Phone Orders Only']);
		buyData.appendChild(phone);
	} else {
		var buylink = Builder.node('a', {href:'#'});
		setCuBuyLink(buylink, this, country, dObj.today)
		buyData.appendChild(buylink);
	}
	var detailsElem = Builder.node('dl', {className:'details'}, [title, mediaType, priceData, buyData]);
	return [Builder.node('div', {className: 'item'}, [frameElem, detailsElem]), Builder.node('div', {className: 'spcr'}) ,buyData];
};
function getQuickInfo(dObj, country, cols) {
	var img = Builder.node('img', {alt: 'Quick Info'});
	img.src = (cols == 4)?'/media/global/quickview.png':'/media/global/quickview-wide.png';
	var lnk = Builder.node('a', {id:dObj.id+'quickInfo', href:'/ajax/layouts/productQuickInfo.html', className:'quick-info'}, [img]);
	var lb = new lightbox(lnk, { oncomplete: function () { pushProdInfo.apply(lnk, [country, lb, dObj.today]) }, nodisplay: true } );
	lnk.onmouseout = function (e) {
		if (this.parentNode) {
			if (this.parentNode.firstChild.id == dObj.id+'quickInfo') {
				this.parentNode.removeChild(this);
			}
		}
		Event.stop(e || window.event);
	};
	lnk.onmousemove = function (e) {
		Event.stop(e || window.event);
	};
	Event.observe(document, 'mousemove', function () {
		if (document.getElementById(dObj.id+'quickInfo')) {
			$(dObj.id+'quickInfo').remove();
		}
	});
	return lnk;
};
function pushProdInfo(country, lb, today) {
	new Draggable('lightbox', { handle: 'lb-close' } );
	var nameLnk = Builder.node('a', {href:this.prodInfo.getData('page_name')});
	nameLnk.innerHTML = this.prodInfo.getData('name');
	$('qi-name').appendChild(Builder.node('h2', [nameLnk]));
	$('qi-desc').innerHTML = this.prodInfo.getData('short_description');
	$('qi-format').innerHTML = this.prodInfo.getData('format');
	$('qi-availability').innerHTML = 'Availability: '+ this.prodInfo.availTxt;
	$('qi-price').innerHTML = this.prodInfo.curSymbol + this.prodInfo.getData('our_price_'+country);
	if (this.prodInfo.isOnSale(country)) {
		$('qi-price').className = 'line-through';
		$('qi-saleprice').addClassName('current-price');
		$('qi-saleprice').innerHTML = [' Only ', this.prodInfo.curSymbol, this.prodInfo.getData('sale_price_'+country), '!'].join('');
	} else {
		$('qi-price').addClassName('current-price');
		$('qi-saleprice').remove();
	}
	if (this.prodInfo.personalized == 1) {
		$('qi-buylink').remove();
		$('qi-buy').innerHTML = '<p class="phone-order">Phone Orders Only</p>';
	} else {
		var buylnk = $('qi-buylink');
		buylnk.lb = lb;
		setCuBuyLink($('qi-buylink'), this.prodInfo, country, today);
	}
	var mainImage = Builder.node('img', {src:changeFileName(this.prodInfo.getData('image'), 'main'), alt:changeFileName(this.prodInfo.getData('image'), 'main')});
	$('qi-image').appendChild(Builder.node('a', {href:this.prodInfo.getData('page_name')},[mainImage]));
	centerElem($('lightbox'));
	$('lightbox').style.display = 'block';
};
function setCuBuyLink(buylink, product, country, today) {
	var product_id = product.product_id;
	var cartProduct = { 
		product_number: product.item_number,
		product_name: product.name,
		product_price: (product['sale_price_'+country] && product['sale_price_'+country] > 0)?
						product['sale_price_'+country]:product['our_price_'+country],
		product_availability: product.availTxt,
		product_giftwrap: product.gift_wrap
	}
	if (product['drop_ship_'+country] && product['drop_shop_'+country] > 0) {
		cartProduct.product_ship_cost = product['drop_ship_'+country];
		cartProduct.product_shipping = 'dropship';
	}
	if (/magazine/i.test(product.type)) {
		cartProduct.product_shipping = 'subscription';
	}
	if (product.image) {
		cartProduct.product_image = changeFileName(product.image, 'thumbnail');
	}
	if (product.format) {
		cartProduct.product_format = product.format;
	}
	if (/back/i.test(product.availTxt)) {
		cartProduct.product_availability_date = product['back_order_date_'+country]; 
	} else {	
		cartProduct.product_availability_date = product['availability_date_'+country];
	}
	Event.observe(buylink, 'click', function (e) { 
		var evtTarget = e.target || e.srcElement;
		if (evtTarget.id == 'qi-buylink') {
			evtTarget.lb.deactivate(e);
		}
		cart.add(product_id, cartProduct); 
		Event.stop(e); 
	});
	if (/pre/i.test(product.availTxt)) {
		buylink.className += ' btn-preordernow';
		buylink.innerHTML = 'Pre Order Now';
	} else {
		buylink.className += ' btn-addtocart';
		buylink.innerHTML = 'Add to Cart';
	}
};