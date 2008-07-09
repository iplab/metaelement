	function persistantStore(name) {
		if(document.all) {
			this.docName= name;
			var element = Builder.node('span',{id:this.docName,name:this.docName,className:'userData'});
			document.body.appendChild(element);
			document.all[this.docName].load('PageData');
			this.preFix = 'pr_';//ID's for products are normally integer values, and attributes cannot be integers - so prepend and make a string...
		}
	};
	persistantStore.prototype = {
		
		save: function() {
			document.all[this.docName].save('PageData');	
		},
		
		put: function(name, data){
			var dataString = json2String(data);
			document.all[this.docName].setAttribute(this.preFix + name,dataString);
			this.save();
		},
	
		remove: function(name) {
			document.all[this.docName].removeAttribute(this.preFix + name);
			this.save();
		},
	
		get: function(name) {
			var attrString = document.all[this.docName].getAttribute(this.preFix + name);
			if(attrString!=null)
				return attrString.evalJSON();
			else
				return false;
		},
	
		empty: function() {
			var keys = this.getKeys();
			var size = keys.size();
			for(var i=0; i<size; i++) {
				this.remove(keys[i]);
			}
			this.save();
		},
	
		getPack: function() {
			var pack = {};
			var keys = this.getKeys();
			var size = keys.size();
			for(var i=0; i<size; i++) {
				pack[keys[i]] = this.get(keys[i]);
				alert(keys[i]);
			}
			return pack;
		},
	
		getKeys: function() {
			var keys = $A();
			var x = document.all[this.docName].xmlDocument.getElementsByTagName('ROOTSTUB')
			for(var i=0;i<x[0].attributes.length;i++) {
				keys.push(x[0].attributes[i].name.replace(this.preFix,''));
			}
			return keys;
		}
	};	