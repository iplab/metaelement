function cache(){
};
cache.prototype = {
	
	initialize: function() {
		IPUI.requires('common.base.date');
		this.registry = {};
	},	
	
	executeCallback: function(url) {
        for(var i=0; i<this.registry[url].callbacks.length;i++) {
        	this.registry[url].callbacks[i](this.registry[url].xhr);
        }
        this.registry[url].callbacks = null;
	},
	
	fetch: function(url) {
        var params = { onComplete: this.store.bindAsEventListener(this, url) };
        new Ajax.Request(url, params);	
	},
	
	store: function(xhr, url) {
		this.registry[url].timestamp = new Date();
		this.registry[url].xhr = xhr;
		this.executeCallback(url);
	},
	
	flush: function(url) {
        if(this.registry[url]) {
        	this.registry[url] = null;
        }
	},
	
	get: function(url, options) {
        if(this.registry[url] && this.registry[url].xhr) {
			if('expires' in this.registry[url]) {
				if(IPUI.date.dateDiff(this.registry[url].timestamp,new Date(),'n')>this.registry[url].expires)
	                this.fetch(url);
				else
					options.onComplete(this.registry[url].xhr);
			}
			else
				options.onComplete(this.registry[url].xhr);
        } 
		else {
            if(!this.registry[url]) {
				this.registry[url] = {};
				if(options) {
					if(options.expires) this.registry[url].expires = options.expires;
					if(options.onComplete) this.registry[url] = { callbacks: [options.onComplete] };
				}
                this.fetch(url,options.onComplete);
            } 
        }
	}
};