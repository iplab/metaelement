function tree(element, options){
};
tree.prototype = {
	initialize: function(){
		IPUI.setTheme(IPUI.theme); //Load Theme
		this.elem 			= '';
		this.registry		= {};
		this.nodeTemplate 	= new Template('<img src="#{image}" /><span><a href="#{href}" onclick="#{onclick}" #{c_attrib}>#{label}</a></span>');
	},
	
	render: function(element, options){
		IPUI.requires('utils.hash');
		var treeId	= '';
		if(typeof element=='object') treeId = element.id
		 else{
			treeId = element;
			element = $(treeId);
		}
		if(!(treeId in this.registry)) this.registry[treeId] = {}; 
		if(element.className.indexOf('tree')<0) element.addClassName('tree');
		this.elem = element;
		this.registry[treeId]['treeOptions'] = {										
			icons: [ 'ipui/themes/' + IPUI.theme + '/images/list.gif', 'ipui/themes/' + IPUI.theme + '/images/fold.gif', 'ipui/themes/' + IPUI.theme + '/images/open.gif' ],
			getIcon: function(li, tree){		
				if (options && ('getIcon' in options)) return options.getIcon(li, tree);
				var ulElements 	= li.getElementsByTagName('ul');
				var icons 		= (options && ('icons' in options)) ? options.icons : this.icons;
				if (ulElements.length == 0)	return icons[0];
				return icons[ulElements[0].style.display == 'none' ? 1 : 2];
			},
			onclickImg: function(li, tree){
				if(options && ('onclickImg' in options)) return opt.onclickImg(li, tree);
				var ulElements = li.getElementsByTagName('ul');
				if(ulElements.length==0) return;
				ulElements[0].style.display = (ulElements[0].style.display!='none') ? 'none' : 'block';
				var imgElements = li.getElementsByTagName('img');
				imgElements[0].src = this.getIcon(li);
			}
		};
		return Object.extend(this.elem,{
						tree_id: treeId, 
						tree: this.renderUL(this.elem, this.registry[treeId].treeOptions),
						options: this.registry[treeId].treeOptions,
						addNode: function(path, options){
							var tNode = this._getDOMelement(path);
							var li = this._createLI(options);
							if(tNode.nodeName=='LI'){
								if(tNode.lastChild.nodeName=='UL') 
									tNode.lastChild.appendChild(li);
								else {
									var ul = new Element('ul');
									ul.appendChild(li);
									tNode.appendChild(ul);
								}
							}
							else
								tNode.appendChild(li);
							li.initDone=true;
							IPUI.tree.renderUL($(this.tree_id), IPUI.tree.registry[this.tree_id].treeOptions);
							return li;
						},					
						removeNode: function(targetNode){
							targetNode.parentNode.removeChild(targetNode);
						},
						toggle: function(path, options){
							var dState 	= '';
							var tNode	= this._getDOMelement(path);
							if(options && ('display' in options))
								dState = options.display;
							else {
								if(tNode.nodeName=='LI'){
									if(tNode.lastChild.nodeName=='UL') 
										if(tNode.lastChild.style.display=='block' || tNode.lastChild.style.display=='')
											dState = 'none';
										else
											dState = 'block';
								}
								else{
									if(tNode.style.display=='block' || tNode.style.display=='')
										dState = 'none';
									else
										dState = 'block';
								}
							}
							if(tNode.nodeName=='LI'){
								if(tNode.lastChild.nodeName=='UL') 
									tNode.lastChild.style.display=dState;
							}
							else
								tNode.style.display=dState;
						},
						rename: function(targetNode, nameStr){
							targetNode.innerHTML = nameStr;
						},
						setImage: function(targetNode, imageStr){
							
						},
						highlight: function(targetNode){
							
						},
						_getDOMelement: function(node){
							if(typeof node=='string')
								return eval('this.tree' + [IPUI.tree.buildPath(node)] + '.element');
							else
								return node;
						},
						_createLI: function(options){
							var el = new Element('li',{id:IPUI.hash.getKeyValue(options,'node_id')});
							el.innerHTML = IPUI.tree.nodeTemplate.evaluate({
									onclick: IPUI.hash.getKeyValue(options,'click'), 
									label: IPUI.hash.getKeyValue(options,'label'), 
									href: IPUI.hash.getKeyValue(options,'href'), 
									image: IPUI.hash.getKeyValue(options,'image'), 
									c_attrib: IPUI.hash.getKeyValue(options,'c_attrib')
							});
							return el;
						}
					});
	},
	
	renderUL: function(element, options){
		var last 	= true;
		var treeUL	= {};
		for(var li=element.lastChild;li;li=li.previousSibling){
			if (li.nodeName == 'LI'){
				var nodeNme = '';
				if(li.getAttribute('node_id'))
					nodeNme = li.getAttribute('node_id');
				else
					if(li.initDone)
						nodeNme = li.getElementsByTagName('span')[0].innerHTML;
					else 
						nodeNme = li.firstChild.nodeValue + '';
				treeUL[nodeNme.replace(/^\s+|\s+$/g,'')] = this.renderLI(li, options);
				if(last){
					if(li.className.indexOf('lastChild')<0) {
						li.className += ', lastChild ,';	
					}
					last = false;
				}
				else li.className = li.className.replace(', lastChild ,','');
			}

		}
		return treeUL;
	},
		
	renderLI: function(element, options){	
		var hasChildren 	= false;
		var childrenNodes	= {};							
		if(!element.initDone){
			element.initDone = true;
			var treeId = this.elem.id;
			var img = new Element('img', {src: options.getIcon(element, this)}).observe('click',
				function(e){
					var t = e.target || e.srcElement;
					IPUI.tree.registry[treeId].treeOptions.onclickImg(t.parentNode, t);
				}
			);
			var span = new Element('span', {tree_id: this.elem.id}).observe('click',
				function(e){
					e = e || window.event; 
					var thisElement = e.target || e.srcElement;
				}
			);	
			for(var i=element.childNodes.length-1;i>=0;i--) { 
				if(element.childNodes[i].nodeName=='UL') {
					hasChildren 	= true;
					childrenNodes	= this.renderUL(element.childNodes[i], options);
				}
				else
					span.insertBefore(element.removeChild(element.childNodes[i]), span.firstChild);
			}
			element.insertBefore(span, element.firstChild);				
			element.insertBefore(img, element.firstChild);	
		}
		else {
			for(var i=element.childNodes.length-1;i>=0;i--){
				if(element.childNodes[i].nodeName=='UL'){
					hasChildren 	= true;
					childrenNodes	= this.renderUL(element.childNodes[i], options);
				};
			}
		}
		return {hasChildren:hasChildren, childrenNodes:childrenNodes, element:element, length:element.childNodes.length};
	},
	
	buildPath: function(pathStr) {
	    var pathArray = pathStr.split('/');
	    var pathString = '';    
	    for(var i=0;i<pathArray.length;i++) {
	            if(pathArray[i]!='') {
	                if(pathString!='') pathString += '.childrenNodes';
	                pathString += '[\'' + pathArray[i] + '\']';
	            }
	    }
	    return pathString;
	}
			
};