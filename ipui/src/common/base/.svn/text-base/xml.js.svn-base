/**
 * @description The XML Class.
 * @constructor
 */	
function xml() {
	this.version = '0.1';	
};
xml.prototype = {

	/**
	 * @description Finds and retrieves a <property> node value based upon name attribute match
	 * @param {Object} nObj The top level node that contains the node matching the name
	 * @param {Object} nName The node name that is used to match the node
	 * @return Returns String value of matching property node value, blank String if no match is found
	 */
	getPropertyNodeByName: function(nObj,nName) {
		try {
			var propertyNode	= nObj.getElementsByTagName(get_firstchild(object).nodeName);
			var propertyLen		= propertyNode.length; 
			for(var j=0;j<propertyLen;j++) {
				switch (getNodeAttribute(propertyNode[j],'name')) {
					case nName:
						return getNodeValue(propertyNode[j]);
						break;
				}
			}
		}
		catch(err) {return '';}	
	},
	
	/**
	 * @description Specifying the parent node, this will return all chilnodes matching the child node name
	 * @param {Object} nObj Parent Node
	 * @param {String} cnName Childnode Name
	 * @return Returns String value of matching childnodes
	 */
	getNodeValueByChildName: function(nObj,cnName){
		try	{
			var tmpString='';
			if(nObj.getElementsByTagName(cnName)[0].firstChild.nodeValue=='null') {
				return '';
			}
			else { 
				for(var i=0;i<nObj.getElementsByTagName(cnName)[0].childNodes.length;i++) {
					tmpString+=nObj.getElementsByTagName(cnName)[0].childNodes[i].nodeValue;
				}
				return tmpString;
			}
		}
		catch(err) {return '';}	
	},

	/**
	 * @description Return the node value of a specified node, will also handle the 4k limitation
	 * @param {Object} nObj The node that the value will be read from
	 * @return Will return the value of the specified node or blank if no matching node is found
	 */
	getNodeValue: function(nObj){
		try {
			var tmpString='';
			for(var i=0;i<nObj.childNodes.length;i++){
				tmpString+=nObj.childNodes[i].nodeValue;
			}
			return tmpString;
		}
		catch(err) {return '';}	
	},

	/**
	 * @description Return first child node matching node name
	 * @param {Object} nObj Parent Node
	 * @param {String} tName Childnode name
	 * return Return matching childnode(s) as an object or return blank string if no match is found
	 */
	getNodeChildObj: function(nObj,tName){
		try{
			var tmpString='';
			if(nObj.getElementsByTagName(tName)[0].firstChild.nodeValue=='null') 
				return '';
			else 
				return nObj.getElementsByTagName(tName);
		}
		catch(err) {return '';}	
	},

	/**
	 * @description Returns the name of specified node
	 * @param {Object} nObj The Node
	 * @return Return String value of node name
	 */
	getNodeName: function(nObj) {
		return nObj.firstChild.nodeName;
	},
	
	/**
	 * @description Returns matching attribute value from specified node
	 * @param {Object} nObj The Node
	 * @param {String} attr The Node attribute
	 * @return Returns the String value of the node attribute or blank string if no match is found
	 */
	getNodeAttribute: function(nObj,attr) {
		try {
			return nObj.getAttribute(attr);
		}
		catch(err) {return '';}	
	},

	/**
	 * @description Return firstchild object from specified node
	 * @param {Object} nObj The Node
	 * @return Returns Object of first childnode from specified node, or blank string if no node found
	 */
	get_firstchild: function(nObj) { 
		try {
			var x=nObj.firstChild;
			while(x.nodeType!=1) {
				x=x.nextSibling;
			}
			return x;
		}
		catch(err) {return '';}	
	},
	
	/**
	 * @description Remove all child nodes of specified node
	 * @param {Object} node The Node
	 * @return void
	 */
	removeAllChildNodes: function(node) {
		while (node.childNodes.length)
			if (node.childNodes[0].childNodes && node.childNodes[0].childNodes.length)
				removeAllChildNodes(node.childNodes[0]);
			else
				node.removeChild(node.childNodes[0]);
	},

	string2xml: function(xml) { 
	   var dom = null;
	   if (window.DOMParser) {
	      try { 
	         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
	      } 
	      catch (e) { dom = null; }
	   }
	   else if (window.ActiveXObject) {
	      try {
	         dom = new ActiveXObject('Microsoft.XMLDOM');
	         dom.async = false;
	         if (!dom.loadXML(xml)) // parse error ..
	
	            window.alert(dom.parseError.reason + dom.parseError.srcText);
	      } 
	      catch (e) { dom = null; }
	   }
	   else
	      alert('cannot parse xml string!');
	   return dom;
	},
			
	json2xml: function (o, tab) {
	   var toXml = function(v, name, ind) {
	      var xml = "";
	      if (v instanceof Array) {
	         for (var i=0, n=v.length; i<n; i++)
	            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
	      }
	      else if (typeof(v) == "object") {
	         var hasChild = false;
	         xml += ind + "<" + name;
	         for (var m in v) {
	            if (m.charAt(0) == "@")
	               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
	            else
	               hasChild = true;
	         }
	         xml += hasChild ? ">" : "/>";
	         if (hasChild) {
	            for (var m in v) {
	               if (m == "#text")
	                  xml += v[m];
	               else if (m == "#cdata")
	                  xml += "<![CDATA[" + v[m] + "]]>";
	               else if (m.charAt(0) != "@")
	                  xml += toXml(v[m], m, ind+"\t");
	            }
	            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
	         }
	      }
	      else {
	         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
	      }
	      return xml;
	   }, xml="";
	   for (var m in o)
	      xml += toXml(o[m], m, "");
	   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	},
	
	xml2json: function(xml, tab) {
	   //orig src: http://goessner.net/download/prj/jsonxml/
	   if(!tab) tab='';
	   var X = {
	      toObj: function(xml) {
	         var o = {};
	         if (xml.nodeType==1) {   // element node ..
	            if (xml.attributes.length)   // element with attributes  ..
	               for (var i=0; i<xml.attributes.length; i++)
	                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
	            if (xml.firstChild) { // element has child nodes ..
	               var textChild=0, cdataChild=0, hasElementChild=false;
	               for (var n=xml.firstChild; n; n=n.nextSibling) {
	                  if (n.nodeType==1) hasElementChild = true;
	                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
	                  else if (n.nodeType==4) cdataChild++; // cdata section node
	               }
	               if (hasElementChild) {
	                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
	                     X.removeWhite(xml);
	                     for (var n=xml.firstChild; n; n=n.nextSibling) {
	                        if (n.nodeType == 3)  // text node
	                           o["#text"] = X.escape(n.nodeValue);
	                        else if (n.nodeType == 4)  // cdata node
	                           o["#cdata"] = X.escape(n.nodeValue);
	                        else if (o[n.nodeName]) {  // multiple occurence of element ..
	                           if (o[n.nodeName] instanceof Array)
	                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
	                           else
	                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
	                        }
	                        else  // first occurence of element..
	                           o[n.nodeName] = X.toObj(n);
	                     }
	                  }
	                  else { // mixed content
	                     if (!xml.attributes.length)
	                        o = X.escape(X.innerXml(xml));
	                     else
	                        o["#text"] = X.escape(X.innerXml(xml));
	                  }
	               }
	               else if (textChild) { // pure text
	                  if (!xml.attributes.length)
	                     o = X.escape(X.innerXml(xml));
	                  else
	                     o["#text"] = X.escape(X.innerXml(xml));
	               }
	               else if (cdataChild) { // cdata
	                  if (cdataChild > 1)
	                     o = X.escape(X.innerXml(xml));
	                  else
	                     for (var n=xml.firstChild; n; n=n.nextSibling)
	                        o["#cdata"] = X.escape(n.nodeValue);
	               }
	            }
	            if (!xml.attributes.length && !xml.firstChild) o = null;
	         }
	         else if (xml.nodeType==9) { // document.node
	            o = X.toObj(xml.documentElement);
	         }
	         else
	            alert("unhandled node type: " + xml.nodeType);
	         return o;
	      },
		  
	      toJson: function(o, name, ind) {
	         var json = name ? ("\""+name+"\"") : "";
	         if (o instanceof Array) {
	            for (var i=0,n=o.length; i<n; i++)
	               o[i] = X.toJson(o[i], "", ind+"\t");
	            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
	         }
	         else if (o == null)
	            json += (name&&":") + "null";
	         else if (typeof(o) == "object") {
	            var arr = [];
	            for (var m in o)
	               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
	            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
	         }
	         else if (typeof(o) == "string")
	            json += (name&&":") + "\"" + o.toString() + "\"";
	         else
	            json += (name&&":") + o.toString();
	         return json;
	      },
		  
	      innerXml: function(node) {
	         var s = ""
	         if ("innerHTML" in node)
	            s = node.innerHTML;
	         else {
	            var asXml = function(n) {
	               var s = "";
	               if (n.nodeType == 1) {
	                  s += "<" + n.nodeName;
	                  for (var i=0; i<n.attributes.length;i++)
	                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
	                  if (n.firstChild) {
	                     s += ">";
	                     for (var c=n.firstChild; c; c=c.nextSibling)
	                        s += asXml(c);
	                     s += "</"+n.nodeName+">";
	                  }
	                  else
	                     s += "/>";
	               }
	               else if (n.nodeType == 3)
	                  s += n.nodeValue;
	               else if (n.nodeType == 4)
	                  s += "<![CDATA[" + n.nodeValue + "]]>";
	               return s;
	            };
	            for (var c=node.firstChild; c; c=c.nextSibling)
	               s += asXml(c);
	         }
	         return s;
	      },
		  
	      escape: function(txt) {
	         return txt.replace(/[\\]/g, "\\\\")
	                   .replace(/[\"]/g, '\\"')
	                   .replace(/[\n]/g, '\\n')
	                   .replace(/[\r]/g, '\\r');
	      },
		  
	      removeWhite: function(e) {
	      	e.normalize();
			for (var n = e.firstChild; n; ) {
				if (n.nodeType == 3) {  // text node
				   if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
				      var nxt = n.nextSibling;
				      e.removeChild(n);
				      n = nxt;
				   }
				   else
				      n = n.nextSibling;
				}
				else if (n.nodeType == 1) {  // element node
				   X.removeWhite(n);
				   n = n.nextSibling;
				}
				else                      // any other node
				   n = n.nextSibling;
				}
				return e;
			}
	   };
	   if (xml.nodeType == 9) // document node
	      xml = xml.documentElement;
	   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
	   return '{\n' + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, '')) + '\n}';
	}

};

