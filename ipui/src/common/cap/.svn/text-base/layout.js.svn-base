var cmaObjs 	= new Object();
var regionArray = new Array();
var errConsole	= false;
// This utility function adds a 'trim' method to all strings




function layout(){};
layout.prototype = {

	render: function(xml, parentObj, collectRegions){
		collectRegions = collectRegions ? true : false;
		var cNode;
		var showPanel = false;
		var childObj;
		var events;
		var onRenderComplete;
		var len = xml.childNodes.length;
		for (var x=0;x<len;x++){
			cNode 	= xml.childNodes[x];
			events 	= {};
			onRenderComplete = function(){};
			switch(cNode.nodeName){
	
				case 'panel':
				
					var contentDiv = document.createElement('div');
					var attribsObj = convertAttribsToObj(cNode);
					var tempObj;
					delete attribsObj.on;
					var setSize = attribsObj.setSize;
					delete attribsObj.setSize; 
					if (attribsObj['innerDivProperties']){
						tempObj = stringToObj(attribsObj['innerDivProperties']);
						for(var i in tempObj) contentDiv.setAttribute(i, tempObj[i]);
						delete attribsObj.innerDivProperties;
					}
					renderDisplay(cNode, contentDiv, collectRegions);
					childObj = new Ext.ContentPanel(contentDiv, attribsObj);
					parentObj.add(childObj);
					if(attribsObj['id']) cmaObjs[attribsObj['id']] = childObj;
					if(attribsObj['showPanel']) showPanel = childObj;
					if(setSize){
						setSize = stringToObj(setSize);
						childObj.setSize(setSize.width, setSize.height);
					}
					events = cNode.attributes.getNamedItem('on') ? stringToObj(cNode.attributes.getNamedItem('on').nodeValue) : {};
					break;
	
				case 'tree':
	
				case 'grid':
	
					break;
	
				default:
			}
	
			for (var i in events)
				if (i == 'renderComplete')
					onRenderComplete = events[i];
				else
					childObj.addListener(i, events[i]);
	
			onRenderComplete();
		}
	
		if (showPanel)
			parentObj.showPanel(showPanel);
	}

	
	
};



function updateRegionBoxes()
{
	var rArray = regionArray;
	var tempRegion; 

	while (rArray.length)
	{
		tempRegion = rArray.pop();
		tempRegion.updateBox(tempRegion.getBox())
	}
}

function ajaxNodeUpdateExpandIcon()
{
    if(this.rendered)
	{
        var n = this.node, c1, c2;
        var cls = n.isLast() ? "x-tree-elbow-end" : "x-tree-elbow";
        var hasChild = !n.isLeaf();
        if(hasChild)
		{
            if(n.expanded)
			{
                cls += "-minus";
                c1 = "x-tree-node-collapsed";
                c2 = "x-tree-node-expanded";
            }
			else
			{
                cls += "-plus";
                c1 = "x-tree-node-expanded";
                c2 = "x-tree-node-collapsed";
            }
            if(this.wasLeaf)
			{
                this.removeClass("x-tree-node-leaf");
                this.wasLeaf = false;
            }
            if(this.c1 != c1 || this.c2 != c2)
			{
                Ext.fly(this.elNode).replaceClass(c1, c2);
                this.c1 = c1; this.c2 = c2;
            }
        }
		else
		{
            if(!this.wasLeaf)
			{
                Ext.fly(this.elNode).replaceClass("x-tree-node-expanded", "x-tree-node-leaf");
                delete this.c1;
                delete this.c2;
                this.wasLeaf = true;
            }
        }
        var ecc = "x-tree-ec-icon "+cls;
        if(this.ecc != ecc)
		{
            this.ecNode.className = ecc;
            this.ecc = ecc;
        }
    }
}

function ajaxNodeExpand(deep, anim, callback)
{
	if (!this.loaded)
	{
		if(this.fireEvent("beforeload", this) === false)
		{
			return;
		}
		this.loading = true;
		this.ui.beforeLoad(this);

		var parentNode = this;
		var request = new Ext.data.Connection({});
		request.on
		(
			{
				requestcomplete: function (conn, response)
				{
					renderDisplay(response.responseXML.childNodes[0], parentNode);
					parentNode.loaded = true;
					parentNode.loading = false;
					parentNode.ui.afterLoad(parentNode);
					Ext.tree.AsyncTreeNode.superclass.expand.call(parentNode, deep, anim, callback);
				}
			}
		);
		request.request({url:'/jsp/transform.jsp', params: {busobj: 'category', stylesheet: 'tree.xsl', objcols: 'parent_id', colvals: this.id.substring(this.id.lastIndexOf('_') + 1), sort_by: 'display_name'}});
		
	}
	else
	{
		//expand node
		Ext.tree.AsyncTreeNode.superclass.expand.call(this, deep, anim, callback);
	}
};

function assetsAjaxNodeExpand(deep, anim, callback)
{
	if (!this.loaded)
	{
		if(this.fireEvent("beforeload", this) === false)
		{
			return;
		}
		this.loading = true;
		this.ui.beforeLoad(this);

		var parentNode = this;
		var request = new Ext.data.Connection({});
		request.on
		(
			{
				requestcomplete: function (conn, response)
				{
					renderDisplay(response.responseXML.childNodes[0], parentNode);
					parentNode.loaded = true;
					parentNode.loading = false;
					parentNode.ui.afterLoad(parentNode);
					Ext.tree.AsyncTreeNode.superclass.expand.call(parentNode, deep, anim, callback);
				}
			}
		);
		request.request({url:'/jsp/transform.jsp', params: {busobj: 'category', stylesheet: 'assetSelector_tree.xsl', objcols: 'parent_id', colvals: this.id.substring(this.id.lastIndexOf('_') + 1), sort_by: 'display_name'}});
		
	}
	else
	{
		//expand node
		Ext.tree.AsyncTreeNode.superclass.expand.call(this, deep, anim, callback);
	}
};

function renderXHTML(xml, parentObj)
{
	var len = xml.childNodes.length;
	var curTag;

	for (var x = 0; x < len; x++)
	{
		curTag = xml.childNodes[x];

		switch(curTag.nodeType)
		{
			case 1:
				var childObj = document.createElement(curTag.nodeName);
				var childAttribs = convertAttribsToObj(curTag);

				for (var i in childAttribs)
					childObj.setAttribute(i, childAttribs[i]);

				renderXHTML(curTag, childObj);

				parentObj.appendChild(childObj);
				break;
			case 3:
				parentObj.appendChild(document.createTextNode(curTag.nodeValue));
				break;
		}
	}
		
}

function stringToBool(str)
{
	return ((str == 'true') ? true : false);
}

function stringToObj(str)
{
	return str ? eval('new function () { return {' + str + '}}') : {};
}

function stringToNum(str)
{
	return str-0;
}

function stringToArray(str)
{
	return str ? eval('new Array(' + str + ')') : new Array();
}

function stringToFunction(str)
{
	return eval(str);
}

var tagAttribConvert = new Object();

tagAttribConvert['north'] =
{
	'alwaysShowTabs': stringToBool,
	'animate': stringToBool,
	'autoHide': stringToBool,
	'autoScroll': stringToBool,
	'closeOnTab': stringToBool,
	'collapsed': stringToBool,
	'collapsible': stringToBool,
	'disableTabTips': stringToBool,
	'floatable': stringToBool,
	'hidden': stringToBool,
	'hideTabs': stringToBool,
	'hideWhenEmpty': stringToBool,
	'preservePanels': stringToBool,
	'resizeTabs': stringToBool,
	'showPin': stringToBool,
	'split': stringToBool,
	'titlebar': stringToBool,
	'cmargins': stringToObj,
	'margins': stringToObj,
	'minTabWidth':  stringToNum,
	'preferredTabWidth':  stringToNum
}

tagAttribConvert['south'] = tagAttribConvert['north'];
tagAttribConvert['east'] = tagAttribConvert['north'];
tagAttribConvert['west'] = tagAttribConvert['north']
tagAttribConvert['center'] = tagAttribConvert['north'];

tagAttribConvert['ContentPanel'] =
{
	'adjustments': stringToArray,
	'autoCreate': stringToBool,
	'autoScroll': stringToBool,
	'background': stringToBool,
	'closable': stringToBool,
	'fitContainer': stringToBool,
	'fitToFrame': stringToBool,
	'loadOnce': stringToBool,
	'showPanel': stringToBool
}

tagAttribConvert['NestedLayoutPanel'] =
{
	'adjustments': stringToArray,
	'autoCreate': stringToBool,
	'autoScroll': stringToBool,
	'background': stringToBool,
	'closable': stringToBool,
	'fitContainer': stringToBool,
	'fitToFrame': stringToBool,
	'loadOnce': stringToBool
}

tagAttribConvert['TabPanel'] =
{
	'animate': stringToBool,
	'containerScoll': stringToBool,
	'ddScroll': stringToBool,
	'enableDD': stringToBool,
	'enableDrag': stringToBool,
	'enableDrop': stringToBool,
	'hlDrop': stringToBool,
	'lines': stringToBool,
	'loader': stringToBool,
	'rootVisible': stringToBool,
	'singleExpand': stringToBool,
	'selModel': function (str){ return (str == 'multi' ? Ext.tree.MultiSelectionModel : Ext.tree.DefaultSelectionModel);}
}

tagAttribConvert['TreePanel'] =
{
	'animate': stringToBool,
	'containerScroll': stringToBool,
	'ddScroll': stringToBool,
	'dragConfig': stringToObj,
	'dropConfig': stringToObj,
	'enableDD': stringToBool,
	'enableDrag': stringToBool,
	'enableDrop': stringToBool,
	'hlDrop': stringToBool,
	'lines': stringToBool,
	'loader': stringToBool,
	'rootVisible': stringToBool,
	'selModel': stringToBool,
	'singleExpand': stringToBool
}

tagAttribConvert['node'] =
{
	'allowDrag': stringToBool,
	'allowDrop': stringToBool,
	'disabled': stringToBool,
	'expanded': stringToBool,
	'leaf': stringToBool,
	'singleClickExpand': stringToBool
}

tagAttribConvert['rootNode'] = tagAttribConvert['node'];
tagAttribConvert['ajaxNode'] = tagAttribConvert['node'];

tagAttribConvert['col'] =
{
	'renderer': stringToFunction,
	'locked': stringToBool,
	'sortable': stringToBool,
	'width': stringToNum,
	'editable': stringToBool,
	'hidden': stringToBool,
	'fixed': stringToBool,
	'resizeable': stringToBool
}

tagAttribConvert['data'] =
{
	'baseParams': stringToObj,
	'remoteSort': stringToBool,
	'sortInfo': stringToObj,
	'readerCfg': stringToObj
}

tagAttribConvert['GridPanel'] =
{
	'width': stringToNum,
	'height': stringToNum,
	'minColumnWidth': stringToNum,
	'autoSizeColumns': stringToBool,
	'autoSizeHeaders': stringToBool,
	'monitorWindowResize': stringToBool,
	'maxRowsToMeasure': stringToNum,
	'trackMouseOver': stringToBool,
	'enableDragDrop': stringToBool,
	'enableColumnMove': stringToBool,
	'enableColumnHide': stringToBool,
	'enableRowHeightSync': stringToBool,
	'stripeRows': stringToBool,
	'autoHeight': stringToBool,
	'autoExpandMin': stringToNum,
	'autoExpandMax': stringToNum,
	'allowTextSelectionPattern': stringToFunction,
	'loadMask': stringToBool,
	'pagingCfg': stringToObj
}


function convertAttribsToObj(tag)
{
	var attribs;
	var len;
	var attribsObj = new Object();

	if (tag && tag.attributes)
	{
		attribs = tag.attributes;
		len = attribs.length;

		if (tagAttribConvert[tag.nodeName])
		{
			for (var x = 0; x < len; x++)
				attribsObj[attribs.item(x).nodeName] = (tagAttribConvert[tag.nodeName][attribs.item(x).nodeName] ? tagAttribConvert[tag.nodeName][attribs.item(x).nodeName](attribs.item(x).nodeValue) : attribs.item(x).nodeValue);
		}
		else
		{
			for (var x = 0; x < len; x++)
				attribsObj[attribs.item(x).nodeName] = attribs.item(x).nodeValue;
		}
	}

	return attribsObj;
}
