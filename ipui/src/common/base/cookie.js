/**
 * @description Cookie Jar Class
 * @constructor
 */	
function cookie() {
	this.version 		= '0.1b';
};
cookie.prototype = {
	/**
	 * @description Creates a single cookie
	 * @param {String} name
	 * @param {String} value
	 * @param {Integer} days
	 */
	 create: function(name,value,days) {
		if(days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = '; expires='+date.toGMTString();
		}
		else var expires = '';
		document.cookie = name+'='+value+expires+'; path=/';
	},
	
	/**
	 * @description Reads the value of a given cookie if it exists
	 * @param {String} name
	 */
	read: function(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for(var i=0;i<ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	
	/**
	 * @description Expires a cookie matching the name
	 * @param {String} name
	 */
	remove: function(name) {
		this.create(name,'',-1);
	}
};

cookie.prototype.jar = {
	/**
	 * @description Define expiration and other settings for the cookie jar
	 * @param {String} name The name of the cookie jar
	 * @param {Object} options Options for the cookie jar
	 * @return void
	 */
	initialize: function(name,options) {
		this.appendString=name+'_';
		this.options = {
			expires: 3600,		// seconds (1 hr)
			path: '',			// cookie path
			domain: '',			// cookie domain
			secure: '',			// secure ?
		};
		Object.extend(this.options, options || {});
		if (this.options.expires != '') {
			var date 	= new Date();
			date 		= new Date(date.getTime() + (this.options.expires * 1000));
			this.options.expires = '; expires=' + date.toGMTString();
		}
		if (this.options.path != '') this.options.path = '; path=' + escape(this.options.path);
		if (this.options.domain != '') this.options.domain = '; domain=' + escape(this.options.domain);
		if (this.options.secure == 'secure') 
			this.options.secure = '; secure';
		else
			this.options.secure = '';
	},

	/**
	 * @description Adds a new cookie in the jar - if the name is unique, a new cookie is created, if the name already exists then the cookie is overwritten
	 * @param {String} name The matching ID or name of the cookie
	 * @param {Object} value The JSON Object of the cookie data
	 * @return Boolean Returns a Boolean true/false based on the success of the cookie put
	 */
	put: function(name, value) {
		name = this.appendString + name;
		cookie = this.options;
		var type = typeof value;
		switch(type) {
		  case 'undefined':
		  case 'function' :
		  case 'unknown'  : return false;
		  case 'boolean'  : 
		  case 'string'   : 
		  case 'number'   : value = String(value.toString());
		}
		var cookie_str = name + "=" + escape(Object.toJSON(value));
		try {
			document.cookie = cookie_str + cookie.expires + cookie.path + cookie.domain + cookie.secure;
		} 
		catch (err) {
			return false;
		}
		return true;
	},

	/**
	 * @description Remove a cookie from the jar matching the name specified
	 * @param {String} name The matching ID or name of the cookie
	 * @return Boolean Returns a Boolean true/false based on the success of the cookie delete
	 */
	remove: function(name) {
		name = this.appendString + name;
		cookie = this.options;
		try {
			var date = new Date();
			date.setTime(date.getTime() - (3600 * 1000));
			var expires = '; expires=' + date.toGMTString();
			document.cookie = name + "=" + expires + cookie.path + cookie.domain + cookie.secure;
		} 
		catch (err) {
			return false;
		}
		return true;
	},

	/**
	 * @description Returns a cookie from the jar matching the name specified
	 * @param {String} name The matching ID or name of the cookie
	 * @return JSON Object of cookie matching the name specified
	 */
	get: function(name) {
		name = this.appendString + name;
		var cookies = document.cookie.match(name + '=(.*?)(;|$)');
		if(cookies)
			return (unescape(cookies[1])).evalJSON();
		else
			return null;
	},

	/**
	 * @description Clears the cookie jar
	 * @return void
	 */
	empty: function() {
		keys = this.getKeys();
		size = keys.size();
		for(var i=0;i<size;i++) this.remove(keys[i]);
	},

	/**
	 * @description Return JSON Object reflecting all cookies in jar
	 * @return Object
	 */
	getPack: function() {
		pack = {};
		keys = this.getKeys();
		size = keys.size();
		for(var i=0;i<size;i++)	pack[keys[i]] = this.get(keys[i]);
		return pack;
	},
	
	/**
	 * @description Return key/value pair of all cookie names in jar
	 * @return Object
	 */
	getKeys: function() {
		keys = $A();
		keyRe= /[^=; ]+(?=\=)/g;
		str  = document.cookie;
		CJRe = new RegExp("^" + this.appendString);
		while((match = keyRe.exec(str)) != undefined) {
			if (CJRe.test(match[0].strip())) keys.push(match[0].strip().gsub("^" + this.appendString,""));
		}
		return keys;
	}
};	
