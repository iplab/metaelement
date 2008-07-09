/*
 * browseCloseups.js
 */
function initiate_browseCloseups(dObj) {
	var itemId = demandletManager.setup(dObj);
	dObj.maxAmt = 12;
	createNavBar(dObj);
	var noResults = Builder.node('div', {id:dObj.id+'no-results', style:'display: none'});
	noResults.innerHTML = '<p>No results were found.</p>';
	dObj.appendChild(noResults);
	dataManager.register(['/ajax/data/closeup.xml'], function (xhr) { createCloseups(dObj, xhr); } );
};
function createNavBar(dObj) {
	var curItems = Builder.node('span', {id:dObj.id+'current'});
	var totItems = Builder.node('span', {id:dObj.id+'total'});
	var showing = Builder.node('div', {id:dObj.id+'showing', className:'showing'}, ['Showing ', curItems, ' of ', totItems]);
	var first = Builder.node('a', {id:dObj.id+'first', href:'', className:'first-page-nav'});
	first.innerHTML = '&laquo;';
	var last = Builder.node('a', {id:dObj.id+'last', href:'', className:'last-page-nav'});
	last.innerHTML = '&raquo;';
	var prev = Builder.node('a', {id:dObj.id+'previous', href:''}, ['Previous']);
	var next = Builder.node('a', {id:dObj.id+'next', href:''}, ['Next']);
	var txt = Builder.node('span', ['Page:']);
	var viewAll = Builder.node('a', {id:dObj.id+'viewall', className:'view-all', href:''}, ['View All']);
	var nav = Builder.node('div', {id:dObj.id+'nav', className:'page-nav'}, [first, prev, txt, next, last, viewAll]); 
	var navBar = Builder.node('div', {id:dObj.id+'nav-bar', className:'nav-bar clearfix'}, [showing, nav]);
	var display = dObj.getAttribute('display');
	if (display) {
		navBar.style.display = display; 
	}
	dObj.appendChild(navBar);
};
function createPagNav(dObj) {
	$(dObj.id+'nav-bar').style.visibility = 'visible';
	var navList = Builder.node('ul', {id:dObj.id+'navList', className:'page-nav-list'});
	if ($(navList.id)) {
		$(navList.id).parentNode.removeChild($(navList.id));
	}
	$(dObj.id+'nav').insertBefore(navList, $(dObj.id+'next'));
	for (var i = 0; i < dObj.totalPages; i++) {
		lnk = Builder.node('a', {id:dObj.id+'lnk'+(i+1), href:'#'+itemId+'page'+(i+1)}, [i+1]);
		if (i == 0) $(lnk).addClassName('active-lnk');
		lnk.page = i+1;
		navList.appendChild(Builder.node('li', [lnk]));
		lnk.onclick = function () {
			changePage.call(this, dObj);
			return false;
		}
	}
	var firstPage = $(dObj.id+'first');
	firstPage.page = 1;
	var lastPage = $(dObj.id+'last');
	lastPage.page = dObj.totalPages;
	var next = $(dObj.id+'next');
	next.page = (dObj.activePage + 1 > dObj.totalPages)?dObj.totalPages:dObj.activePage+1;
	var prev = $(dObj.id+'previous');
	prev.page = (dObj.activePage - 1 < 1)?1:dObj.activePage-1;
	var viewAll = $(dObj.id+'viewall');
	if (viewAll.hasClassName('active-lnk')) {
		viewAll.removeClassName('active-lnk');
	}
	viewAll.page = -1;
	viewAll.onclick = firstPage.onclick = lastPage.onclick = next.onclick = prev.onclick = function () {
		changePage.call(this, dObj);
		return false;
	}
};
function updateShowing(dObj) {
	if (!dObj.activePage) {
		dObj.activePage = 1;
		$(dObj.id+'page'+dObj.activePage).addClassName('active-page');
	}
	if (dObj.activePage == -1) {
		var statusTxt = (1==dObj.totalItems)?'1':'1-'+dObj.totalItems;
	} else {
		var activePage = $(dObj.id+'page'+dObj.activePage);
		var firstItem = (dObj.maxAmt*(activePage.page-1))+1;
		var lastItem = activePage.getElementsByTagName('li').length + firstItem - 1;
		var statusTxt = (firstItem != lastItem)?firstItem + '-' + lastItem:firstItem;
	}
	$(dObj.id+'current').innerHTML = statusTxt;
};
function createCloseups() {
	var dObj = arguments[0];
	var type_id = dObj.getAttribute('type_id') || getMetaValue('type_id');
	if (arguments.length == 2) {
		var resp = arguments[1];
		if (!resp.responseXML && !hasChildElements(resp.responseXML.documentElement)) {
			dObj.remove();
			return;
		} else {
			dObj.dataStore = resp.responseXML.documentElement;
		}
	}
	$(dObj.id+'no-results').style.display = 'none';
	var oldCatalog = document.getElementsByClassName('browse-products');
	for (var i = 0; i < oldCatalog.length; i++) {
		if (oldCatalog[i].id.indexOf(dObj.id) > -1) {
			oldCatalog[i].parentNode.removeChild(oldCatalog[i]);
		}
	}
	var odataStore = dObj.dataStore;
	var country = (hasSiteName('canada'))?'canada':'us';
	var closeups = odataStore.getElementsByTagName('closeup');
	if (closeups.length) {
		dObj.prodList = closeups;
		dObj.activePage = '';
		var rows = closeups[0].getElementsByTagName('row');
		var numCells = 3;
		var itemsAdded = 0;
		for (var i = 0 ; i < rows.length; i++) {
			if (hasChildElements(rows[i])) {
				if (type_id) {
					if (type_id != getNodeValueByChildName(rows[i], 'type_id')) {
						continue;
					}
				}
				if (itemsAdded % dObj.maxAmt == 0) {
					var page = Builder.node('div', {id:dObj.id+'page'+((itemsAdded/dObj.maxAmt)+1), className: 'cols-'+numCells+' browse-products'});
					page.page = (itemsAdded/dObj.maxAmt)+1;
					dObj.appendChild(page);
				}
				if (itemsAdded % numCells == 0) {
					var list = document.createElement('ul');
					page.appendChild(list);
					if (page.childNodes.length == 4) {
						list.className = 'clearfix last-row';
					} else {
						list.className = 'clearfix';
					}
				}
				var p = new Closeup(rows[i]);
				var ilnk = Builder.node('a', {href:p.page_name, className:'frame'}, [Builder.node('img', {src: p.image})]);
				var nameCloseup = Builder.node('span', {className:'name'});
				nameCloseup.innerHTML = p.name;
				var dt = Builder.node('dt', {className: 'name'}, [Builder.node('a', {href:p.page_name}, [nameCloseup])]);
				var dd = Builder.node('dd', {className: 'description'});
				dd.innerHTML =  p.description;
				var dl = Builder.node('dl', {className: 'details'}, [dt, dd]);
				var cu = Builder.node('div', {className: 'item'}, [ilnk, dl]);
				list.appendChild(Builder.node('li', [cu]));
				++itemsAdded;
			}
		}
		dObj.totalItems = itemsAdded;
		if (itemsAdded > 0) {
			if ( !($(list).hasClassName('last-row'))) {
				list.addClassName('last-row');
			}
			$(dObj.id+'total').innerHTML = dObj.totalItems;
			dObj.totalPages = Math.ceil(dObj.totalItems / dObj.maxAmt);
			updateShowing(dObj);
			createPagNav(dObj);
		} else {
			$(dObj.id+'nav-bar').style.visibility = 'hidden';
			$(dObj.id+'no-results').style.display = 'block';
		}
	}
};
function changePage(dObj) {
	if (dObj.activePage != this.page) {
		if (this.page == -1) {
			var oldPage = $(dObj.id+'page'+dObj.activePage);
			oldPage.removeClassName('active-page');
			$(dObj.id+'lnk'+dObj.activePage).removeClassName('active-lnk');
			dObj.activePage = this.page;
			for (var i = 0; i < dObj.totalPages; i++) {
				if (i == dObj.totalPages-1) {
					$(dObj.id+'page'+(i+1)).addClassName('last-page');
				}
				$(dObj.id+'page'+(i+1)).addClassName('active-all');
			}
			this.addClassName('active-lnk');
		} else {
			if (dObj.activePage != -1) {
				$(dObj.id+'page'+dObj.activePage).removeClassName('active-page');
				$(dObj.id+'lnk'+dObj.activePage).removeClassName('active-lnk');
			} else {
				for (var i = 0; i < dObj.totalPages; i++) {
					if (i == dObj.totalPages-1) {
						$(dObj.id+'page'+(i+1)).removeClassName('last-page');
					}
					$(dObj.id+'page'+(i+1)).removeClassName('active-all');
				}
				$(dObj.id+'viewall').removeClassName('active-lnk');
			}
			dObj.activePage = this.page;
			var newPage = $(dObj.id+'page'+dObj.activePage);
			newPage.addClassName('active-page');
			$(dObj.id+'lnk'+dObj.activePage).addClassName('active-lnk');
			$(dObj.id+'next').page = (dObj.activePage + 1 > dObj.totalPages)?dObj.totalPages:dObj.activePage+1;
			$(dObj.id+'previous').page = (dObj.activePage - 1 < 1)?1:dObj.activePage-1;
		}
		updateShowing(dObj);
	} 
};
function Closeup(details) {
	this.name = getNodeValueByChildName(details, 'name');
	this.image	= getNodeValueByChildName(details, 'image');
	this.description = getNodeValueByChildName(details, 'description');
	this.page_name = getNodeValueByChildName(details, 'page_name');
};