/*
 * genreProducts.js
 */
function initiate_genreProducts(dObj) {
	var itemId = demandletManager.setup(dObj);
	dObj.numCols = dObj.getAttribute('cols');
	if (!dObj.numCols || isNaN(dObj.numCols)) dObj.numCols = 3;
	dObj.maxAmt = (dObj.numCols == 4)?20:15;
	dObj.quickInfo = getQuickInfo(dObj);
	showloading(dObj);
	createGenreToolbar(dObj);
	createNavBar(dObj);
	var noResults = Builder.node('div', {id:dObj.id+'no-results', style:'display: none'});
	noResults.innerHTML = '<p>No results were found.</p>';
	dObj.appendChild(noResults);
	var type = dObj.getAttribute('type');
	if (type) {
		if (type.toLowerCase() == 'search') {
			$(dObj.id+'filter-bar').style.display = 'none';
			var queryParams = window.location.href.toQueryParams();
			if (queryParams.kword) {
				var searchfor = queryParams.kword;
				$('searchfor').value  = searchfor;
				var cat_id = (queryParams.cat_id)?queryParams.cat_id:'';
				var url = '/ajax/productSearch.jsp';
				new Ajax.Request(url, {
					parameters: 'nC='+noCache()+'&kword='+searchfor+'&cat_id='+cat_id,
					onComplete: function (xhr) {
						var xml = xhr.responseXML.documentElement;
						createCatalog(dObj, xml, searchfor);
					}
				});
			} else {
				dObj.remove();
			}
		} else if (/(sale|upcoming|formatproducts)/i.test(type)) {
			var typeId = dObj.getAttribute('fn');
			if (typeId) {
				var uri = '/ajax/data/'+typeId+'_'+type;
				if (/upcoming/i.test(type)) {
					uri = uri+'_'+getCountry().toLowerCase();
				}
				uri = uri+'.xml';
				dataManager.register([uri],
					function (xhr) {
						var xml = xhr.responseXML.documentElement;
						var products = xml.getElementsByTagName('genres')[0].getElementsByTagName('products')[0];
						if (products) createCatalog(dObj, products);
					} 
				);
			} else {
				dObj.remove();
			}
		} else {
			dObj.remove();
		}
	} else {
		var genreId = getMetaValue('genre_id');
		if (genreId == false) {
			dObj.remove();
		} else {			
			dataManager.register(['/ajax/data/'+genreId+'_genre.xml'], 
				function(xhr) {
					var xml = xhr.responseXML.documentElement;
					var products = xml.getElementsByTagName('genres')[0].getElementsByTagName('products')[0];
					if (products) createCatalog(dObj, products);
				}
			);
		}
	}
};
function getQuickInfo(dObj) {
	var itemId = dObj.id;
	var img = Builder.node('img', {alt: 'Quick Info'});
	img.src = (dObj.numCols == 4)?'/media/global/quickview.png':'/media/global/quickview-wide.png';
	var lnk = Builder.node('a', {id:itemId+'quickInfo', href:'/ajax/layouts/productQuickInfo.html', className:'quick-info'}, [img]);
	var lb = new lightbox(lnk, { oncomplete: function() { pushProdInfo.call(lnk, lb); }, nodisplay: true });	
	lnk.onmouseout = function (e) {
		if (this.parentNode) {
			if (this.parentNode.firstChild.id == dObj.id+'quickInfo') {
				this.parentNode.removeChild(this);
			}
		}
		Event.stop(e||window.event);
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
function pushProdInfo(lb) {
	new Draggable('lightbox', { handle: 'lb-close' } );
	var nameLnk = Builder.node('a', {href:this.prodInfo.pageName});
	nameLnk.innerHTML = this.prodInfo.name;
	$('qi-name').appendChild(Builder.node('h2', [nameLnk]));
	$('qi-desc').innerHTML = this.prodInfo.short_description;
	$('qi-format').innerHTML = this.prodInfo.format;
	$('qi-availability').innerHTML = 'Availability: '+ this.prodInfo.availTxt;
	$('qi-price').innerHTML = this.prodInfo.curSymbol + this.prodInfo.ourPrice;
	if (this.prodInfo.isOnSale) {
		$('qi-price').className = 'line-through';
		$('qi-saleprice').addClassName('current-price');
		$('qi-saleprice').innerHTML = [' Only ',this.prodInfo.curSymbol, this.prodInfo.salePrice,'!'].join('');
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
		this.prodInfo.setBuyStatus(buylnk);
	}
	var mainImage = Builder.node('img', {src:this.prodInfo.mainImage, alt:this.prodInfo.mainImage});
	$('qi-image').appendChild(Builder.node('a', {href:this.prodInfo.pageName},[mainImage]));
	centerElem($('lightbox'));
	$('lightbox').style.display = 'block';
};
function createGenreToolbar(dObj) {
	var txt = Builder.node('span', ['Filter by: ']);
    var typesFilter = Builder.node('select', {id:dObj.id+'select-type'});
	var formatsFilter = Builder.node('select', {id:dObj.id+'select-format'});
	formatsFilter.onchange = typesFilter.onchange = function () {
		dObj.filterParams = {
                subgenre: $(dObj.id+'select-type').options[$(dObj.id+'select-type').selectedIndex].value,
                media: $(dObj.id+'select-format').options[$(dObj.id+'select-format').selectedIndex].value
        };
		createCatalog(dObj);
	};
	addOption(typesFilter, 'All Types', '');
    addOption(formatsFilter, 'All Formats', '');
	var genreBar = Builder.node('div', {id:dObj.id+'filter-bar', className:'filteroptions-bar'}, [txt, typesFilter, formatsFilter]);
	var display = dObj.getAttribute('display');
	if (display) {
		genreBar.style.display = display; 
	}
	var genre_id = getMetaValue('genre_id');
	var category_id = getMetaValue('category_id');
	if (genre_id != false) {
		retrieveData('/ajax/data/'+genre_id+'_subgenre.xml', typesFilter, getDropdownData);
	} else {
		typesFilter.style.display = 'none';
	}
	if (category_id != false) {
		retrieveData('/ajax/data/'+category_id+'_format.xml', formatsFilter, getDropdownData);
	} else {
		formatsFilter.style.display = 'none';
	}
	if (typesFilter.style.display == 'none' && formatsFilter.style.display == 'none') {
		txt.style.display = 'none';
	}
	dObj.appendChild(genreBar);
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
function changePage(dObj) {
	if (dObj.activePage != this.page) {
		if (this.page == -1) {
			var oldPage = $(dObj.id+'page'+dObj.activePage);
			oldPage.removeClassName('active-page');
			$(dObj.id+'lnk'+dObj.activePage).removeClassName('active-lnk');
			dObj.activePage = this.page;
			for (var i = 0; i < dObj.totalPages; i++) {
				var imgs = $(dObj.id+'page'+(i+1)).getElementsByTagName('img');
				if (!imgs[0].src) {
					$A(imgs).each(function (img) {
						img.src = img.imagePath;
					});
				}
				$(dObj.id+'page'+(i+1)).addClassName('active-all');
				if (i == dObj.totalPages-1) {
					$(dObj.id+'page'+(i+1)).addClassName('last-page');
				}
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
			var imgs = newPage.getElementsByTagName('img');
			if (!imgs[0].src) {
				$A(imgs).each(function (img) {
					img.src = img.imagePath;
				});
			}
			$(dObj.id+'lnk'+dObj.activePage).addClassName('active-lnk');
			$(dObj.id+'next').page = (dObj.activePage + 1 > dObj.totalPages)?dObj.totalPages:dObj.activePage+1;
			$(dObj.id+'previous').page = (dObj.activePage - 1 < 1)?1:dObj.activePage-1;
		}
		updateShowing(dObj);
	} 
};
function updateShowing(dObj) {
	if (arguments.length > 1) {
		var kword = arguments[1];
	}
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
	if (kword) {
		$(dObj.id+'showing').insertBefore(document.createTextNode('results for '+kword+' ') ,$(dObj.id+'current'));
	}
};
function createCatalog() {
	var dObj = arguments[0];
	if (arguments.length > 1) {
		dObj.dataStore = arguments[1];
		if (arguments.length == 3) {
			var kword = arguments[2];
		}
	}
	$(dObj.id+'no-results').style.display = 'none';
	var prevPages = $(dObj).getElementsByClassName('browse-products');
	for (var i = 0; i < prevPages.length; i++) {
		if (prevPages[i].id.indexOf(dObj.id) > -1) {
			prevPages[i].parentNode.removeChild(prevPages[i]);
		}
	}
	var country = (hasSiteName('canada'))?'canada':'us';
	if (dObj.dataStore) {
		dObj.activePage = '';
		var rows = dObj.dataStore.getElementsByTagName('row');
		var numCells = dObj.numCols;
		var itemsAdded = 0;
		for (var i = 0 ; i < rows.length; i++) {
			if (hasChildElements(rows[i])) {
				if (country == 'canada' && getNodeValueByChildName(rows[i], 'product_canada') == 0) {
					continue;
				}
				if (dObj.filterParams) {
					if (dObj.filterParams['subgenre'] && dObj.filterParams['other_genres'] != '') {
						var noMatch = true;
						var subgenres = getNodeValueByChildName(rows[i], 'other_genres').split(',');
						for (var j = 0; j < subgenres.length; j++) {
							if (subgenres[j] == dObj.filterParams['subgenre']) {
								noMatch = false;
								break;
							}
						}
						if (noMatch) continue;
					}
					if (dObj.filterParams['media'] && dObj.filterParams['media'] != '') {
						if (dObj.filterParams['media'] != getNodeValueByChildName(rows[i], 'format_id')) {
							continue;
						} 
					}
				}
				if (itemsAdded % dObj.maxAmt == 0) {
					var page = Builder.node('div', {id:dObj.id+'page'+((itemsAdded/dObj.maxAmt)+1), className: 'cols-'+dObj.numCols+' browse-products'});
					page.page = (itemsAdded/dObj.maxAmt)+1;
					dObj.appendChild(page);
				}
				if (itemsAdded % numCells == 0) {
					var list = document.createElement('ul');
					page.appendChild(list);
					if (page.childNodes.length == 5) {
						list.className = 'clearfix last-row';
					} else {
						list.className = 'clearfix';
					}
				}
				var p = new Product(rows[i], country, dObj.numCols);
				var browseImage = document.createElement('img');
				if (page.page == 1) {
					browseImage.src = p.imgName;
				} else {
					browseImage.imagePath = p.imgName;
				}
				var ilnk = Builder.node('a', {href:p.pageName, className:'frame'}, [browseImage]);
				var nameSpan = Builder.node('span', {className:'name'});
				nameSpan.innerHTML = p.name;
				var nlnk = Builder.node('a', {href:p.pageName}, [nameSpan]);
				var dt = Builder.node('dt', {className: 'name'}, [nlnk]);
				var mediaType = Builder.node('dd', {className: 'format'}, [p.format]);
				var ourPrice = Builder.node('span', {className: 'our-price'}, [p.curSymbol + p.ourPrice]);
				var priceData = Builder.node('dd', {className: 'price'}, [ourPrice]);
				if (p.isOnSale) {
					priceData.appendChild(document.createElement('br'));
					ourPrice.className = [ourPrice.className, 'line-through'].join(' ');
					var salePrice = Builder.node('span', {className: 'current-price'}, [[' Only ',p.curSymbol, p.salePrice,'!'].join('')]);
					priceData.appendChild(salePrice);
				}
				var buyData = Builder.node('div', {className: 'buy'});
				var dl = Builder.node('dl', {className: 'details'}, [dt, mediaType, priceData]);
				if (p.personalized == 1) {
					p.setAvailTxt();
					var phone = Builder.node('p', {className: 'phone-order'}, ['Phone Orders Only']);
					buyData.appendChild(phone);
				} else {
					var buyStatus = Builder.node('a', {href:'#'});
					p.setBuyStatus(buyStatus);
					buyData.appendChild(buyStatus);
				}
				var prod = Builder.node('div', {className: 'item'}, [ilnk, dl]);
				ilnk.prodInfo = p;
				prepareQuickInfo(ilnk, dObj);
				list.appendChild(Builder.node('li', [prod, Builder.node('div', {className:'spcr'}), buyData]));
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
			if (kword) {
				updateShowing(dObj, kword);
			} else {
				updateShowing(dObj);
			}
			createPagNav(dObj);
		} else {
			$(dObj.id+'nav-bar').style.visibility = 'hidden';
			if (kword) {
				if (/^\d{5}$/.test(kword)) {
					$(dObj.id+'no-results').innerHTML = '<p>Item number '+kword+' cannot be found.</p>';
				} else {
					$(dObj.id+'no-results').innerHTML = '<p>No results were found for '+kword+'</p>';
				}	
			} 
			$(dObj.id+'no-results').style.display = 'block';
		}
	}
	removeloading(dObj);
};
function prepareQuickInfo(lnk, dObj) {
	lnk.onmouseover = function () {
		dObj.quickInfo.prodInfo = this.prodInfo;
		this.parentNode.insertBefore(dObj.quickInfo, this);
	};
	lnk.onmousemove = function (e) {
		if (Event && Event.stop) {
			Event.stop(e || window.event);
		}
	}
};
function getDropdownData(dropDown) {
	var dataStore = dropDown.dataStore;
	if (typeof (dataStore.data) != 'string') {
		if (dropDown.id.indexOf('select-type') > -1) {
			var val = 'sub_genre';
		} else if (dropDown.id.indexOf('select-format') > -1) {
			var val = 'format';
		}
		for (var i = 0; i < dataStore.data.length; i++) {
			var typeName = getNodeValueByChildName(dataStore.data[i], 'name');
			var typeId = getNodeValueByChildName(dataStore.data[i], val+'_id');
            addOption(dropDown, typeName, typeId, false);
		}
	} else {
		dropDown.style.display = 'none';
	}
};
function Product(details, country, numCols) {
	this.country = country;
	this.curSymbol = '$';
	this.product_id	= getNodeValueByChildName(details, 'id');
	this.product_number	= getNodeValueByChildName(details, 'number');
	this.pageName = getNodeValueByChildName(details, 'page_name');
	this.imgPath = getNodeValueByChildName(details, 'image');
	this.imgName = (numCols == 3)?getNodeValueByChildName(details, 'feature_image'):changeFileName(this.imgPath, 'browse');
	this.mainImage = changeFileName(this.imgPath, 'main');
	this.type_id = getNodeValueByChildName(details, 'type_id');
	this.name = getNodeValueByChildName(details, 'name')
	this.format = getNodeValueByChildName(details, 'format');
	this.ourPrice = getNodeValueByChildName(details, 'our_price_'+country);
	this.salePrice = getNodeValueByChildName(details, 'sale_price_'+country);
	this.isOnSale = (this.salePrice && this.salePrice != 0)?true:false;
	this.availDate = new Date(getNodeValueByChildName(details, 'availability_date_'+country));
	this.back_order_date = new Date(getNodeValueByChildName(details, 'back_order_date_'+country));
	this.prodType = getNodeValueByChildName(details, 'type_id');
	this.short_description = getNodeValueByChildName(details, 'short_description');
	this.product_canada = getNodeValueByChildName(details, 'product_canada');
	this.personalized = getNodeValueByChildName(details, 'personalized');
	this.availTxt = this.setAvailTxt();
	this.dropShipCost = getNodeValueByChildName(details, 'drop_ship_'+country);
	this.gift_wrap = getNodeValueByChildName(details, 'gift_wrap');
};
Product.prototype.setBuyStatus = function (lnk) {
	var product_id = this.product_id;
	var cartProduct = { 
		product_number: this.product_number,
		product_name: this.name,
		product_price: (this.salePrice && this.salePrice>0)?this.salePrice:this.ourPrice,
		product_availability: this.availTxt,
		product_giftwrap: this.gift_wrap
	}
	if (this.dropShipCost && this.dropShipCost > 0) {
		cartProduct.product_ship_cost = this.dropShipCost;
		cartProduct.product_shipping = 'dropship';
	}
	if (/magazine/i.test(this.type)) {
		cartProduct.product_shipping = 'subscription';
	}
	if (this.imgPath) {
		cartProduct.product_image = changeFileName(this.imgPath, 'thumbnail');
	}
	if (this.format) {
		cartProduct.product_format = this.format;
	}
	if (/back/i.test(this.availTxt)) {
		cartProduct.product_availability_date = this.back_order_date; 
	} else {	
		cartProduct.product_availability_date = this.availDate;
	}
	Event.observe(lnk, 'click', function (e) {
		var evtTarget = e.target || e.srcElement;
		if (evtTarget.id == 'qi-buylink') {
			evtTarget.lb.deactivate(e);
		}
		cart.add(product_id, cartProduct);
		Event.stop(e);
	});
	if (/magazine/i.test(this.type)) {
		lnk.className += ' btn-subscribenow';
		lnk.innerHTML = 'Subscribe Now';
	} else {
		if (/pre/i.test(this.availTxt)) {
			lnk.className += ' btn-preordernow';
			lnk.innerHTML = 'Pre-Order Now';
		} else {
			lnk.className += ' btn-addtocart';
			lnk.innerHTML = 'Add to Cart';
		}
	}
};
Product.prototype.setAvailTxt = function () {
	var today = new Date(getServerTime());
	var availTxt = null;
	if (dateDiff('n', today, this.availDate) > 0) {
		availTxt = 'ON PRE-ORDER';
	} else if (this.back_order_date && dateDiff('n', today, this.back_order_date) > 0) {
		availTxt = 'ON BACKORDER';
	} else {
		availTxt = 'IN STOCK';
	}
	return availTxt;
};
function hideBars(id) {
	$(id+'filter-bar').style.visibility = 'hidden';
	$(id+'nav-bar').style.visibility = 'hidden';
};
function showloading(container) {
	if (container.style.height) {
		container.oldHeight = container.style.height;
	}
	if (container.style.overflow) {
		container.oldOverflow = container.style.overflow;
	}
	container.style.height = 100 + 'px';
	container.style.overflow = 'hidden';
	var image = Builder.node('img', { src:'/media/global/loading.gif' });
	var frame = Builder.node('div', {style:'width: 7em; margin: 0 auto; padding-top: 60px;'},[image, ' Loading...']);
	var holder = Builder.node('div', {className:'loading-sign', style:'height: 100px;'},[frame])
	container.insertBefore(holder, container.firstChild);
};
function removeloading(container) {
	var signs = $(container).getElementsByClassName('loading-sign');
	for (var i = 0; i < signs.length; i++) {
		container.removeChild(signs[i]);
	}
	container.style.height = (container.oldHeight)?container.oldHeight+'px':null;
	container.style.overflow = (container.oldOverflow)?container.oldOverflow:null;
}