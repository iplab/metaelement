/*
 * @author clam
 */
function initiate_localNav(dObj) {
	var dept = getMetaValue('dept');
	if (dept == false || dept == 'home') {
		var url = '/subnav.xml';
	} else {
		var url = '/'+dept+'/subnav.xml';
	}
	retrieveData(url, dObj, createLocalNav);
};
function createLocalNav(dObj) {
	if (typeof dObj.dataStore.data != 'string') {
		var navs = new Object;
		for (var i = 0; i < dObj.dataStore.data.length; i++) {
			navs[dObj.dataStore.data[i].getAttribute('nav_id')] = new NavItem(dObj.dataStore.data[i]);
		}
		for (prop in navs) {
			if (navs[prop].parent_id != 0) {
				var parentNav = navs[prop].parent_id;
				var order = navs[prop].order;
				navs[parentNav].children[order] = prop;
			}
		}
		for (prop in navs) {
			if (navs[prop].parent_id == 0) {
				var navLnk = createLink(navs[prop].label, navs[prop].url);
				dObj.appendChild(Builder.node('h3', [navLnk]));
				dObj.appendChild(Builder.node('span'));
				if (navs[prop].children.length) {
					navLnk.className = 'down';
					var list = document.createElement('ul');
					for (var i = 0; i < navs[prop].children.length; i++) {
						var navId = navs[prop].children[i];
						var subnavLnk = createLink(navs[navId].label, navs[navId].url);
						list.appendChild(Builder.node('li', [subnavLnk]));
					}
					var listContainer = Builder.node('div', [list]);
					dObj.appendChild(listContainer);
					navLnk.toggleItem = listContainer;
					navLnk.onclick = function () {
						Effect.toggle(this.toggleItem, 'blind', { 
																	duration: 0.3,  
																	afterFinish: toggleClassName.bind(this, { up:'down', down:'up' })
																});
						return false;
					};
					
				}
			}	
		}
	}
};
function NavItem(navNode) {
	this.label = navNode.getAttribute('label');
	this.url = navNode.getAttribute('url');
	this.parent_id = navNode.getAttribute('parent_id');
	this.order = navNode.getAttribute('order');
	this.nav_id = navNode.getAttribute('nav_id');
	this.children = [];
};
function toggleClassName(toggle) {
	this.className = toggle[this.className];
};
function createLink(name, url) {
	return Builder.node('a', {href: url}, [name]);
};