/*
 * recipeBox.js
 */ 
function initiate_recipeBox(dObj) {
	var itemId = demandletManager.setup(dObj);
	var pId = getMetaValue('product_id');
	if (pId == false) {
		removeDemandlet(dObj);
		return;
	}
	var rbData = {
		product: new DataStore('/ajax/data/'+pId+'_product.xml'),
		prodType: new DataStore('/ajax/data/productType.xml'),
		recipeBox: new DataStore('/ajax/data/'+pId+'_recipebox.xml')
	};
	for (var prop in rbData) {
		rbData[prop].retrieve();
	}
	var _timer = setInterval(function() {
								var n = 0;
								for (var prop in rbData) {
									n += rbData[prop].complete;
								}
								if (n == 3) {
									clearInterval(_timer);
									createRecipeBox(dObj, rbData);
								}
							}, 10);
};
function createRecipeBox(dObj, rbData) {
	if (typeof rbData.product.data == 'string' || typeof rbData.prodType.data == 'string') {
		removeDemandlet(dObj);
		return;
	}
	var itemId = dObj.id;
	var amtTabs = (typeof rbData.recipeBox.data == 'string'?1:rbData.recipeBox.data.length+1);
	var x = new RecipeBox(itemId, amtTabs);
	var tabList = x.getTabs(rbData);
	dObj.appendChild(tabList);
	var containers = x.getContents(rbData);
	for (var i = 0; i < containers.length; i++) {
		if (containers[i]) {
			dObj.appendChild(containers[i]);
		} else {
			if (i == 0) {
				dObj.appendChild(Builder.node('div', {id: itemId+'item'+i, className:'tab-details-box'}));
			} else {
				dObj.appendChild(Builder.node('div', {id: itemId+'item'+i, className:'tab-list-box'}));
			}
		}
	}
	new Control.Tabs(itemId+'tab-list', { setClassOnContainer: true, activeClassName: 'current', defaultTab: ($('default-current') || 'first') });
};
function RecipeBox(itemId, numTabs) {
	this.itemId = itemId;
	this.numTabs = numTabs;
	this.tabList = Builder.node('ul', {id:itemId+'tab-list', className:'tab-list clearfix'});
	this.contents = new Array(numTabs);
};
RecipeBox.prototype.getTabs = function(rbData) {
	for (var i = 0; i < this.numTabs; i++) {
		var boxId = this.itemId+'item'+i;
		if (i == 0) {
			var item = Builder.node('li', Builder.node('a', {href:'#'+boxId}, [Builder.node('span', ['Details'])]));
			this.tabList.appendChild(item);
		} else {
			var name = getNodeAttribute(rbData.recipeBox.data[i-1], 'name');
			var isActive = parseInt(getNodeAttribute(rbData.recipeBox.data[i-1], 'default'));
			var item = Builder.node('li', Builder.node('a', {href:'#'+boxId}, [Builder.node('span', [name])]));
			if (isActive) {
				item.firstChild.id = 'default-current';
			}
			this.tabList.appendChild(item);
		}
	}
	return this.tabList;
};
RecipeBox.prototype.getContents = function(rbData) {
	for (var i = 0; i < this.contents.length; i++) {
		if (i == 0) {
			var pType = new RegExp('^'+getNodeValueByChildName(rbData.product.data[0], 'type')+'$', 'i');
			for (var j = 0; j < rbData.prodType.data.length; j++) {
				var ptType = getNodeAttribute(rbData.prodType.data[j], 'type');
				if (pType.test(ptType)) {
					var t = rbData.prodType.data[j];
					break;
				}
			}
			if (!t) {
				continue;
			}
		} else {
			var t = rbData.recipeBox.data[i-1];
		}
		if (i == 0) {
			this.contents[i] = Builder.node('div', {id:this.itemId+'item'+i, className:'tab-details-box'});
		} else {
			this.contents[i] = Builder.node('div', {id:this.itemId+'item'+i, className:'tab-list-box'});
		}
		var fields = t.getElementsByTagName('field');
		for (var j = 0; j < fields.length; j++) { 
			if (fields[j].hasChildNodes()) {
				var txt = (fields[j].textContent || fields[j].text);
				if (fields[j].textContent) {
					this.contents[i].innerHTML = txt;
				} else {
					this.contents[i].innerHTML = '<span>.</span>'+txt;
					this.contents[i].removeChild(this.contents[i].firstChild);
				}
				var subFields = this.contents[i].getElementsByTagName('field');
				if (subFields.length) {
					var parent = subFields[0].parentNode;
					var txt = '';
					for (var k = 0; k < subFields.length; k++) { 
						var labelTxt = getNodeAttribute(subFields[k], 'label');
						var infoType = getNodeAttribute(subFields[k], 'data');
						var info = getNodeValueByChildName(rbData.product.data[0], infoType);
						if (info) {
							if (i == 0) {
								txt += '<dt>'+labelTxt+'</dt><dd>'+info+'</dd>';
							} else {
								txt += labelTxt + info;
							}
						}
					}
					parent.innerHTML = txt;
				}
			}
		}
	}
	return this.contents;
};