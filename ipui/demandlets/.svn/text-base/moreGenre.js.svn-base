/*
 * moreGenre.js
 */
function initiate_moreGenre(dObj) {
	var itemId = demandletManager.setup(dObj);
	var genreId = getMetaValue('more_genre_id');
	var count = getMetaValue('more_genre_count');
	if (count == false) {
		count = 5;
	}
	var genreType = getMetaValue('genre_type');
	if (genreType == false) genreType = '';
	if (genreId == false) { 
		removeDemandlet(dObj);
	} else {
		dataManager.register(['/ajax/data/'+genreId+'_genre.xml'], 
							function (xhr) {
								getMoreGenre(xhr, dObj, count, genreType)
							});
	}
};
function getMoreGenre(genreData, dObj, count, genreType) {
	if (genreData.responseXML) {
		var xml = genreData.responseXML.documentElement;
		genreData = xml.getElementsByTagName('genres');
		var genreType = getMetaValue('genre_type');
		var item_number = getMetaValue('item_number');
		var div = document.createElement('div');
		var glist = document.createElement('ul');
		var country = (hasSiteName('canada'))?'canada':'us';
		div.appendChild(glist);
		if (genreData.length) {
			dObj.appendChild(div);
			var rows = genreData[0].getElementsByTagName('products')[0].getElementsByTagName('row');
			if (rows.length) {
				for (var i = 0; i < rows.length; i++) {
					if (hasChildElements(rows[i])) {
						if (item_number != getNodeValueByChildName(rows[i], 'number')) {
							if (country == 'canada' && getNodeValueByChildName(rows[i], 'product_canada') == 0) {
								continue;
							}
							var name = getNodeValueByChildName(rows[i], 'name');
							var pageName = getNodeValueByChildName(rows[i], 'page_name');
							var lnk = Builder.node('a', {href: pageName});
							lnk.innerHTML = name;
							glist.appendChild(Builder.node('li', [lnk]));
							--count;
						}
					}
					if (count == 0) break;
				}
			}
		}
		if (count > 0) {
			var pgId = getNodeValueByChildName(genreData[0], 'parent_id');
			if (pgId) {
				dataManager.register(['/ajax/data/'+pgId+'_genre.xml'], 
									getParentGenre.bindAsEventListener(this, dObj, glist, count, genreType)
									);
			}
		} else {
			dObj.insertBefore(Builder.node('span'), dObj.firstChild);
			dObj.insertBefore(getHeader(div, genreType), dObj.firstChild);
		}
	} else {
		dObj.remove();
	}
};
function getParentGenre(resp, dObj, list, count, genreType) {
	if (resp.responseXML) {
		var country = (hasSiteName('canada'))?'canada':'us';
		var item_number = getMetaValue('item_number');
		var xml = resp.responseXML.documentElement;
		dataStore = xml.getElementsByTagName('genres');
		if (dataStore.length) {
			var rows = dataStore[0].getElementsByTagName('products')[0].getElementsByTagName('row');
			if (rows.length) {
				for (var i = 0; i < rows.length; i++) {
					if (hasChildElements(rows[i])) {
						if (item_number != getNodeValueByChildName(rows[i], 'number')) {
							if (country == 'canada' && getNodeValueByChildName(rows[i], 'product_canada') == 0) {
								continue;
							}
							var name = getNodeValueByChildName(rows[i], 'name');
							var pageName = getNodeValueByChildName(rows[i], 'page_name');
							var lnk = Builder.node('a', {href: pageName});
							lnk.innerHTML = name;
							list.appendChild(Builder.node('li', [lnk]));
							--count;
						}
					}
					if (count == 0) break;
				}
			}
		}
	}
	if (list.childNodes.length == 0) {
		dObj.remove()
	} else {
		dObj.insertBefore(Builder.node('span'), dObj.firstChild);
		dObj.insertBefore(getHeader(list.parentNode, genreType), dObj.firstChild);
	}
};
function getHeader(elem, genreType) {
	var lnk = Builder.node('a', {href:'#', className: 'down'}, ['More ' + genreType]);
	lnk.onclick = function () {
		Effect.toggle(elem, 'blind', {duration: 0.3, afterFinish: function () { lnk.className = (lnk.className == 'up')?'down':'up'; }});
		return false;
	}
	return Builder.node('h3', [lnk]);
}