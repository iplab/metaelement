function history(){
};
history.prototype = {
	initialize: function(){
		this.registry = {};
		this.parse(elements);
		callback 	= fn || 'alert';
		scriptUri 	= uri || '';
		cHash 		= this.getHash() || '';
		if(!document.all){
			(function(){
				cHash = this.getHash();
				if(cHash !== '' && pHash != cHash){
					pHash = cHash;
					this.doCallback();
				}
			}).periodical(200);
		} else {
			var iframe = new Element('iframe').setProperty('name','_hst___');
			try{
				iframe.setProperty('id','_hst___').setProperty('frameBorder', '0').setProperty('width','1').setProperty('height','1');
			}catch(e){}
			document.appendChild(iframe);
		}
	},
	
	parse: function(elements){
		elements.each(function(el){
			var attr = el.getProperty('history');
			if(attr !== undefined){
				eval('var obj = ' + attr);
				
				var key = (obj.hash) ? obj.hash : obj.arg;
				registry[key] = {arg:obj.arg, callback: (obj.callback || false)};
				el.addEvent('click',function(e){
					new Event(e).stop();									
					HistMan.add(key);					
				});
			}
		});
	},	
};

var HistMan = function(){

var registry = {};
var pHash = '';
var scriptUri;
var callback;

return {
	cHash: '',
	
	start: function(uri, elements, fn){
		HistMan.parse(elements);
		
		callback = fn || 'alert';
		scriptUri = uri || '';
		cHash = HistMan.getHash() || '';
		
		if(!document.all){
			(function(){
				cHash = this.getHash();
				if(cHash !== '' && pHash != cHash){
					pHash = cHash;
					this.doCallback();
				}
			}).periodical(200);
		} 
		else {
			var iframe = new Element('iframe').setProperty('name','_histman___');
			try{
				iframe.setProperty('id','_histman___').setProperty('frameBorder', '0').setProperty('width','1').setProperty('height','1');
			}catch(e){}
			document.appendChild(iframe);
				
			if(cHash !== '') HistMan.add(cHash);
		}
	},
	
	add: function(key){
		if(!key) return;
		if(!document.all) window.location.hash = 'h_'+key;
		else frames['_histman___'].location.href = scriptUri + "?arg=" + registry[key].arg + "&hash=" + key;
	},
	
	doCallback: function(arg){
		var obj = registry[HistMan.getHash()];
		window[obj.callback || callback](arg || obj.arg);
	},
	
	parse: function(elements){
		
		elements.each(function(el){
			var attr = el.getProperty('history');
			if(attr !== undefined){
				eval('var obj = ' + attr);
				
				var key = (obj.hash) ? obj.hash : obj.arg;
				registry[key] = {arg:obj.arg, callback: (obj.callback || false)};
				el.addEvent('click',function(e){
					new Event(e).stop();									
					HistMan.add(key);					
				});
			}
		});
	},
	
	getHash: function(){
		return window.location.hash.replace('#h_','');
	}
};}()