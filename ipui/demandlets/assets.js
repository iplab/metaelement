/*
 * assets.js
 */
function initiate_assets(dObj) {
	var itemId = demandletManager.setup(dObj);
	var productId = getMetaValue('product_id');
	if (productId == false) {
		removeDemandlet(dObj);
	}
	retrieveData('/ajax/data/'+productId+'_assets.xml', dObj, displayAssets);
};
function displayAssets(dObj) {
	var dataStore = dObj.dataStore;
	var itemId = dObj.id;
	if (typeof dataStore.data == 'string') {
		removeDemandlet(dObj);
	} else {
		var list = Builder.node('ul', {className:'view-options'});
		var txtLabels = {video:'View Clip', photo:'View Additional Photos'};
		list.tabOrder = [];
		var prodAssets = new Assets(itemId);
		for (var i = 0; i < dataStore.data.length; i++) {
			var mediaType = getNodeAttribute(dataStore.data[i], 'name').toLowerCase();
			var rows = dataStore.data[i].getElementsByTagName('row');
			if (rows.length) {
				list.tabOrder.push(mediaType);
				var lnk= Builder.node('a', {rel:mediaType, href:'/ajax/layouts/viewMedia.html', className:'icon-'+mediaType}, [txtLabels[mediaType]]);
				list.appendChild(Builder.node('li', [lnk]));
				prodAssets.addAsset(mediaType);
				for (var j = 0; j < rows.length; j++) {
					var url = getNodeValueByChildName(rows[j], 'url');
					var desc = getNodeValueByChildName(rows[j], 'description');
					prodAssets[mediaType].url.push(url);
					prodAssets[mediaType].description.push(desc);
				}
			}
		}
		if (list.childNodes.length) {
			var lnks = list.getElementsByTagName('a');
			for (var i = 0; i < lnks.length; i++) {
				new lightbox(lnks[i], {oncomplete: pushAssetInfo.bind(lnks[i], list, prodAssets), nodisplay: true});
			}
			dObj.appendChild(list);
		} else {
			dObj.remove();
		}
	}
};
function pushAssetInfo(assetList, prodAssets) {
	new Draggable('lightbox', { handle: 'lb-close', 
		onStart: function(){ 
			$('lightbox').style.width = getWidth($('lightbox'))+'px';
		} } );
	var itemId = prodAssets.itemId;
	var container = $('viewMedia');
	var tabOrder = assetList.tabOrder;
	var tabLabels = { video: 'Video Clips', photo: 'Additional Images' };
	var list = container.getElementsByTagName('ul')[0];
	var selMedia = this.getAttribute('rel');
	var docTitle = document.title.split('-');
	if (docTitle.length > 1) {
		docTitle.shift();
		docTitle = docTitle.join('-');
	}
	container.insertBefore(Builder.node('h2', [docTitle]), container.firstChild);
	list.id = itemId+'tab-list';
	list.className = 'tab-list clearfix';
	for (var i = 0; i < tabOrder.length; i++) {
		var div = Builder.node('div', {id:itemId+'item'+i, className: tabOrder[i] + '-container'});
		if (tabOrder[i] == 'video')	$(div).addClassName('clearfix');
		container.appendChild(div);
		createContent(div, prodAssets[tabOrder[i]]);
		var lnk = Builder.node('a', {href:'#'+itemId+'item'+i}, [Builder.node('span', tabLabels[tabOrder[i]])]);
		if (selMedia == tabOrder[i]) {
			lnk.id = itemId+'selected';
		}
		list.appendChild(Builder.node('li', [lnk]));
	}
	new Control.Tabs(itemId+'tab-list', { 
		setClassOnContainer: true, 
		activeClassName: 'current', 
		defaultTab: ($(itemId+'selected') || 'first') });
	centerElem($('lightbox'));
	$('lightbox').style.display = 'block';
};
function createContent(container, media) {
	var txtLabels = { video: 'clips', photo: 'images' };
	var showing = Builder.node('p', {className: 'asset-status'});
	var totalMedia = media.url.length;
	var title = Builder.node('h3', {className: 'asset-title'}, [media.description[0]]);
	if (media.type == 'photo') {
		var table = Builder.node('table', {className: 'additional-photos'});
		var tbody = document.createElement('tbody');
		var row = document.createElement('tr');
		var mainImg = Builder.node('img', {src:changeFileName(media.url[0], 'large'), alt: media.description[0]});
		var mediaHolder = Builder.node('td', {className:'media-holder'}, [mainImg]);
		row.appendChild(mediaHolder);
		tbody.appendChild(row);
		table.appendChild(tbody);
	} else {
		var p = document.createElement('p');
		p.innerHTML = ['For a complete experience, this site requires the Adobe Flash Player&#151; please download from:',
						'<a target="_blank" href="http://www.adobe.com/products/flashplayer/">http://www.adobe.com/products/flashplayer/</a>'].join(''); 
		var mediaHolder = Builder.node('div', {id:'flash-videoplayer'}, [p]);
		var so = new SWFObject("/media/global/vid_player.swf", "vidplayer", "320", "240", "9", '#FFFFFF');
		so.addVariable("vidUrl", media.url[0]);
        so.addVariable("vidVolume", "100");
        so.addVariable("vidAutoPlay", "true");
	} 
	mediaHolder.type = media.type;
	showing.innerHTML = '<span id="current-'+media.type+'">1</span> of '+totalMedia+' '+txtLabels[media.type];
	container.appendChild(showing);
	container.appendChild(title);
	if (media.type == 'photo') {
		container.appendChild(table);
	} else {
		mediaHolder.so = so;
		container.appendChild(mediaHolder);
		so.write("flash-videoplayer");
	}
	if (media.url.length > 1) {
		var othersList = document.createElement('ul');
		for (var i = 0; i < media.url.length; i++) {
			var lnk = Builder.node('a', {href: media.url[i]});
			if (media.type == 'photo') {
				var img = Builder.node('img', { src: changeFileName(media.url[i], 'thumbnail'), alt: media.description[i] });
				lnk.appendChild(img);
			} else if (media.type == 'video') {
				othersList.className = 'other-videos';
				lnk.appendChild(document.createTextNode(media.description[i]));
			}
			if (i == 0) {
				mediaHolder.curDisplay = lnk;
				mediaHolder.curDisplay.className = 'current-display';
			}
			lnk.number = i;
			lnk.onclick = updateGallery.bind(lnk, mediaHolder, title);
			othersList.appendChild(Builder.node('li', [lnk]));
		}
		if (media.type == 'video') {
			var othersListTitle = Builder.node('h3', {className: 'other-text'}, ['Other clips (click link to play):']);
			container.appendChild(othersListTitle);
			container.appendChild(othersList);
		} else if (media.type == 'photo') {
			var td = Builder.node('td', [othersList]);
			td.className = 'other-photos';
			row.appendChild(td);
		}
		
	}
};
function updateGallery(gallery, title) {
	if (gallery.type == 'photo') {
		gallery.firstChild.src = changeFileName(this.href, 'large');
		gallery.firstChild.alt = this.firstChild.alt;
		title.innerHTML = this.firstChild.alt;
	} else if (gallery.type == 'video') {
		title.innerHTML = this.firstChild.nodeValue;
		gallery.so.addVariable("vidUrl", this.href);
		gallery.so.write("flash-videoplayer");
	}
	$(gallery.curDisplay).removeClassName('current-display');
	gallery.curDisplay = $(this);
	gallery.curDisplay.addClassName('current-display');
	$('current-'+gallery.type).innerHTML = this.number + 1;
	return false;
};
function Assets(itemId) {
	this.itemId = itemId;
};
Assets.prototype.addAsset = function(type) {
	this[type] = { type: type, url: [], description: [] };
};