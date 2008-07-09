/*
 * relatedProducts.js
 */
function initiate_relProducts(dObj) {
    var itemId = demandletManager.setup(dObj);
	var pId = getMetaValue('product_id');
	if (pId == false) { 
		removeDemandlet(dObj);
		return;
	}
	var rp = new DataStore('/ajax/data/'+pId+'_relproducts.xml');
	rp.retrieve();
	var _timer = setInterval(function() {
								if (rp.data) {
									clearInterval(_timer);
									getRelatedProducts(dObj, rp);				
								}
							}, 10);
};
function getRelatedProducts(dObj, datastore) {
	if (typeof datastore.data == 'string') {
		removeDemandlet(dObj);
	} else {
		var country = (hasSiteName('canada'))?'canada':'us';
		var hlnk = Builder.node('a', {href: '#', className:'down'}, ['Related Products']);
		dObj.appendChild(Builder.node('h3', [hlnk]));
		dObj.appendChild(Builder.node('span'));
		var div = document.createElement('div');
		var rplist = document.createElement('ul');
		div.appendChild(rplist);
		hlnk.onclick = function () {
			Effect.toggle(div, 'blind', {duration:0.3, afterFinish: function () { hlnk.className = (hlnk.className == 'up')?'down':'up'; }});
			return false;
		};
		dObj.appendChild(div);
		for (var i = 0; i < datastore.data.length; i++) {
			if (hasChildElements(datastore.data[i])) {
				if (country == 'canada' && getNodeValueByChildName(datastore.data[i], 'product_canada') == 0) {
					continue;
				}
				var name = getNodeValueByChildName(datastore.data[i], 'name');
				var pageName = getNodeValueByChildName(datastore.data[i], 'page_name');
				var lnk = Builder.node('a', {href:pageName});
				lnk.innerHTML = name;
				rplist.appendChild(Builder.node('li', [lnk]));
			}
		}
		if (!rplist.hasChildNodes()) {
			removeDemandlet(dObj);
		}
	}
};