/*
 * relTags.js
 */
function initiate_relTags(dObj) {
	var itemId = demandletManager.setup(dObj);
	var pTags = getMetaValue('product_tags');
	if (pTags == false) { 
		removeDemandlet(dObj);
		return;
	}
	var t = pTags.split(',');
	var tObj = new Object;
	for (var i = 0; i < t.length; i++) {
		tObj[t[i]] = new DataStore('/ajax/data/'+t[i]+'_tag.xml');
		tObj[t[i]].retrieve();
	}
	var _timer = setInterval(function() {
								var n = 0;
								for (prop in tObj) {
									n += tObj[prop].complete;
								}
								if (n == t.length) {
									clearInterval(_timer);
									createRelTags(dObj, tObj);				
								}
							}, 10);
};
function createRelTags(dObj, datastore) {
	var tlist = document.createElement('ul');
	for (prop in datastore) {
		var tagName = prop.replace(/_/, ' ');
		if (typeof datastore[prop].data == 'string') {
			continue;
		} else {
			var display = getNodeValue(datastore[prop].data[0]);
			if (display == 'true') {
				tlist.appendChild(Builder.node('li', [tagName]));
			}
		}
	}
	if (tlist.childNodes.length == 0) {
		removeDemandlet(dObj);
	} else {
		var lnk = Builder.node('a', {href:'#', className:'down'}, ['Keywords']);
		dObj.appendChild(Builder.node('h3', [lnk]));
		dObj.appendChild(Builder.node('span'));
		var div = document.createElement('div');
		div.appendChild(tlist);
		dObj.appendChild(div);
		lnk.onclick = function() {
			Effect.toggle(div, 'blind', {duration: 0.3, afterFinish: function () { lnk.className = (lnk.className=='up')?'down':'up'; }});
			return false;
		};
	}
}