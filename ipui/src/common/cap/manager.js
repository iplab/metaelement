function manager(){
};
manager.prototype={

	initialize: function(){
		that=this;
		IPUI.setTheme(IPUI.theme); //Load Theme
		
		this.elements = {
				
			regionPanel: function(node){
				var tmpObj 	= {};
				var div		= new Element('div',that.nodeAttributes(node));
				if(node.getAttribute('tabs') && (node.getAttribute('tabs')=='yes')){ //if there are contentPanels with tabs, then we need to render the top tab
					IPUI.requires('ui.tabs');
					var t = node.childNodes;
					var panelCnt=0;
					for(var i=0;i<t.length;i++) {
						if(t[i].nodeName=='contentPanel'){
							if(panelCnt==0) t[i].setAttribute('class', t[i].getAttribute('class') + ' active'); //sets active class attribute for first contentPanel						} 
							tmpObj[i] = {label:t[i].getAttribute('label'),onclick:t[i].getAttribute('onclick'),panel:t[i].getAttribute('id')};
							panelCnt++;
						}
					}
					div.appendChild(IPUI.tabs.render(tmpObj,{id:'tabs_' + node.getAttribute('id'),className:'tabs'}));
				}
				return div;
			},
			
			tabPanel: function(node){
				IPUI.requires('ui.tabs');
				var tmpObj 	= {};
				var div		= new Element('div',{id:node.getAttribute('id'),style:node.getAttribute('style')}); 
				if(node.getAttribute('tabs')=='$cats'){
					for(application in cats)
						tmpObj[application] = {label:cats[application].overview.label, onclick:'alert(\'' + cats[application].overview.label + '\')'}; 
				}
				else{
					var f = node.getElementsByTagName('tab');
					for(var i=0;i<f.length;i++)
						tmpObj[i] = {label:f[i].getAttribute('label'),onclick:f[i].getAttribute('onclick')};
				}					
				div.appendChild(IPUI.tabs.render(tmpObj,{id:'tabs_' + node.getAttribute('id')}));
				return div;
			}, 
			
			contentPanel: function(node){
				return new Element('div',that.nodeAttributes(node));
			},
			
			gridPanel: function(node){
				IPUI.requires('ui.grid');				
				var columns = new Element('div',{className:'columns'}); 
				var f = node.getElementsByTagName('column');
				for(var i=0;i<f.length;i++)
					columns.appendChild(new Element('div',that.nodeAttributes(f[i]))); 
				var grid = new Element('div',that.nodeAttributes(node));
				grid.appendChild(columns);	
				
				var dataObj = {};
				var row = node.getElementsByTagName('row');
				for(var i=0;i<row.length;i++){
					var recordset = row[i].getElementsByTagName('data');
					dataObj[i] = {};
					for(var j=0;j<recordset.length;j++){
						dataObj[i][recordset[j].getAttribute('dataIndex')] = recordset[j].nodeValue;	
					} 	
				}			
				console.info(dataObj);
				console.info(grid);
				var a =IPUI.grid.display(grid,dataObj);
				return grid;
			}			
			
		};
	},
	
	nodeAttributes: function(node,optionalTags){
		var attrObj = {};
		if(node&&(node.attributes))
			for(var i=0;i<node.attributes.length;i++) {
				attrObj[node.attributes[i].nodeName]=node.attributes[i].nodeValue;
			}
		return attrObj;
	},
	
	start: function(){
		var topNavObj = new Element('ul',{id:'top_navigation'});
		var i=0;
		for(application in cats){
			i++;
			var navLI 	= new Element('li',{id:'nav_' + application});
			navLI.innerHTML = application;
			var navA	= new Element('a',{href:'#tab'+i, onclick:'console.info(IPUI.cats.registry[\'' + application + '\'])'}).update(application);
			topNavObj.appendChild(navLI.appendChild(navA));
		}
		$('topNav').appendChild(topNavObj);
	},
	
	loadInterface: function(url, options){
		that = this;
		new Ajax.Request(url,{asynchronous:false,onComplete:this.transformXML.bindAsEventListener(this, document.body, that.elements)});			
	},
	
	run: function(catObj){
		console.info(catObj);
	},
	
	transformXML: function(xmlRoot, parentObj, extensions){
		try{
			if('responseXML' in xmlRoot) xmlRoot 	= xmlRoot.responseXML.firstChild;
	        var nLen = xmlRoot.childNodes.length;
			var cNode;
	        for(var i=0;i<nLen;i++){	
				cNode = xmlRoot.childNodes[i];
				switch(cNode.nodeType){
					case 1:
						var extFound=false;
						var childObj;
						for(each in extensions){
							if(typeof extensions[each]=='function' && (cNode.nodeName==each)){
								extFound	= true;
								childObj 	= extensions[each](cNode);
								break;
							}
						}
						if(extFound==false)	childObj = document.createElement(cNode.nodeName);	
						var childAttribs = this.nodeAttributes(cNode);
						for(var attrName in childAttribs) childObj.setAttribute(attrName,childAttribs[attrName]);
						this.transformXML(cNode, childObj, extensions);
						parentObj.appendChild(childObj);
						break;
					case 3:
						parentObj.appendChild(document.createTextNode(cNode.nodeValue));
						break;
				}
			}
		}
		catch(err){
			IPUI.console({msg:err,type:'error'});
		}
	}
};






























