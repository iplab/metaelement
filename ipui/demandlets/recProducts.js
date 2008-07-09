/*
 * recProducts.js
 */
function initiate_recProducts(dObj) {
	var itemId = demandletManager.setup(dObj);
	var pId = getMetaValue('product_id');
	if (pId == false) { 
		removeDemandlet(dObj);
		return;
	}
	dataManager.register(['/ajax/data/'+pId+'_alsolike.xml'], createRecProducts.bindAsEventListener(this, dObj)); 
};
function createRecProducts(xhr, dObj) {
	var country = hasSiteName('canada')?'canada':'us';
	if (xhr && xhr.responseXML) {
		var xml = xhr.responseXML.documentElement;
		var itemId = dObj.itemId;
		var rows = xml.getElementsByTagName('row');
		for (var i = 0; i < rows.length; i++) {
			if (hasChildElements(rows[i])) {
				if (country == 'canada' && getNodeValueByChildName(rows[i], 'product_canada') == 0) {
					continue;
				}
				var name = getNodeValueByChildName(rows[i], 'name');
				var pageName = getNodeValueByChildName(rows[i], 'page_name');
				var imagePath = getNodeValueByChildName(rows[i], 'image');
				var imgElem = Builder.node('img', {src:changeFileName(imagePath, 'browse')});
				var price = getNodeValueByChildName(rows[i], 'our_price_'+country);
				var salePrice = getNodeValueByChildName(rows[i], 'sale_price_'+country);
				var dl = document.createElement('dl');
				dl.appendChild(Builder.node('dt', {className: 'thumbnail'}, [Builder.node('a', {href:pageName}, [imgElem])]));
				var nameLnk = Builder.node('a', {href:pageName});
				nameLnk.innerHTML = name;
				dl.appendChild(Builder.node('dt', {className: 'name'}, [nameLnk]));
				if (salePrice && salePrice > 0) {
					dl.appendChild(Builder.node('dd', {className: 'line-through'}, ['$'+price]));
					dl.appendChild(Builder.node('dd', {className: 'current-price'}, ['$'+salePrice]));
				} else {
					if (price && price > 0) {
						dl.appendChild(Builder.node('dd', {className: 'current-price'}, ['$'+price]));
					}
				}
				dObj.appendChild(dl);
			}
		}
	}
	if (dObj.childNodes.length < 3) {
		dObj.remains = 3 - dObj.childNodes.length;
		dObj.country = country;
		var more_genre_id = getMetaValue('more_genre_id');
		if (more_genre_id != false) {
			dataManager.register(['/ajax/data/'+more_genre_id+'_genre.xml'], function (resp) { getMoreRecs(resp, dObj); });
		} else {
			if (dObj.childNodes.length == 0) {
				dObj.remove();
			} else {
				dObj.insertBefore(Builder.node('h3', ['You might also like:']), dObj.firstChild);
			}
		}
	} else {
		dObj.insertBefore(Builder.node('h3', ['You might also like:']), dObj.firstChild);
	}
};
function getMoreRecs(resp, dObj) {
	if (resp && resp.responseXML) {
		var xml = resp.responseXML.documentElement;
		var genre = xml.getElementsByTagName('genres')[0];
		var rows = genre.getElementsByTagName('products')[0].getElementsByTagName('row');
		var itemsLeft = (rows.length < dObj.remains)? rows.length: dObj.remains;
		var lastRow = rows.length-1;
		var item_number = getMetaValue('item_number');
		for (var i = lastRow; i >= 0; i--) {
			if (getNodeValueByChildName(rows[i], 'number') === item_number) {
				continue;
			}
			var name = getNodeValueByChildName(rows[i], 'name');
			var pageName = getNodeValueByChildName(rows[i], 'page_name');
			var imagePath = getNodeValueByChildName(rows[i], 'image');
			var imgElem = Builder.node('img', {src:changeFileName(imagePath, 'browse')});
			var price = getNodeValueByChildName(rows[i], 'our_price_'+dObj.country);
			var salePrice = getNodeValueByChildName(rows[i], 'sale_price_'+dObj.country);
			var dl = document.createElement('dl');
			dl.appendChild(Builder.node('dt', {className: 'thumbnail'}, [Builder.node('a', {href:pageName}, [imgElem])]));
			var nameLnk = Builder.node('a', {href:pageName});
			nameLnk.innerHTML = name;
			dl.appendChild(Builder.node('dt', {className: 'name'}, [nameLnk]));
			if (salePrice && salePrice > 0) {
				dl.appendChild(Builder.node('dd', {className: 'line-through'}, ['$'+price]));
				dl.appendChild(Builder.node('dd', {className: 'current-price'}, ['$'+salePrice]));
			} else {
				if (price && price > 0) {
					dl.appendChild(Builder.node('dd', {className: 'current-price'}, ['$'+price]));
				}
			}
			dObj.appendChild(dl);
			if (--itemsLeft == 0) {
				break;
			}
		}
		if (dObj.childNodes.length > 0) {
			dObj.insertBefore(Builder.node('h3', ['You might also like:']), dObj.firstChild);
		}
	}
};