/**
 * @description The prototype.inherit lib.
 * @constructor
 */	
Function.prototype.inherit = function( parentClassOrObject ){ 
	if (parentClassOrObject.constructor==Function) { 
		//Normal Inheritance 
		this.prototype 				= new parentClassOrObject;
		this.prototype.constructor 	= this;
		this.parent 				= parentClassOrObject.prototype;
	} 
	else { 
		//Pure Virtual Inheritance 
		this.prototype 				= parentClassOrObject;
		this.prototype.constructor 	= this;
		this.parent			 		= parentClassOrObject;
	} 
	return this;
}; 

	
/**
 * @description Construct a new ipBase instance
 * @class ipBase is the class designed to be a base class for the IPUI library. Using IPUI as the base enables strand style building of all the classes required in
 * any application using IPUI.
 */	
function ipuiBase() {
	this.version 		= '1.0';
	this.versionName	= 'Avid Apricot';
	this.theme			= 'standard';
	this.baseURL		= 'ipui.src.';
	this.themeURL		= 'ipui/themes/';
	this.repository		= eval('(' + '{"common":{"base":{"cache":{"file":"cache.js"},"cookie":{"file":"cookie.js"},"date":{"file":"date.js"},"demandlet":{"file":"demandlet.js"},"form":{"file":"form.js"},"history":{"file":"history.js"},"persist":{"file":"persist.js"},"query":{"file":"query.js"},"xml":{"file":"xml.js"}},"cap":{"cats":{"file":"cats.js"},"manager":{"file":"manager.js"}},"legacy":null},"localization":null,"commerce":{"cart":{"file":"cart.js"},"gift":{"file":"gift.js"},"promotion":{"file":"promotion.js"}},"ui":{"grid":{"file":"grid.js"},"lightbox":{"file":"lightbox.js"},"page":{"file":"page.js"},"repeater":{"file":"repeater.js"},"tabs":{"file":"tabs.js"},"tinymce":{"file":"tinymce.js"},"tree":{"file":"tree.js"}},"user":{"address":{"file":"address.js"},"human":{"file":"human.js"}},"utils":{"general":{"file":"general.js"},"hash":{"file":"hash.js"},"json":{"file":"json.js"},"serializer":{"file":"serializer.js"},"xml2json":{"file":"xml2json.js"}}}' + ')');
};
ipuiBase.prototype = {
	/**
	 * Asynchronously load in a JS file and bind its class to IPUI
	 * @param {String} ns - the package path and name
	 * @returns void
	 */
	importClass: function(ns) {
		var nsPath 	= ns.split('.');
		var clName	= nsPath[nsPath.length-1];
		if(!this[clName]) {
			this.loadFile(ns.replace(/\./gi, '/') + '.js');
			if(typeof this[clName] == 'undefined') {
				this[clName] = new Object();
			}
		}
	},
	
	/**
	 * @description Load Javascript class and bind to IPUI synchronously
	 * @param {String} ns - the package path and name
	 * @returns void
	 */
	requires: function(ns){
		var root 	= window;
		var nsPath 	= (this.baseURL+ns).split('.');
		var clName	= nsPath[nsPath.length-1];
		if(!IPUI[clName]) {
			if(!this.inRepository(ns)) 
				this.console({msg:ns + ' not found in repository.',type:'warn'});
			else {
				this.loadFile((this.baseURL+ns).replace(/\./gi, '/') + '.js',{async:false,clName:clName});
				if(IPUI[clName]) {
					if('initialize' in IPUI[clName])
						IPUI[clName].initialize();
				}
				else 
					this.console({msg:ns + ' not found on server.',type:'warn'});
			}
		}
	},
	
	inRepository: function(ns){
		var nsPath 	= ns.split('.');
		var objPath    = '';
		for(var i=0;i<nsPath.length-1;i++){ objPath += '[\'' + nsPath[i] + '\']'; }
		if([nsPath[nsPath.length-1]] in eval('IPUI.repository'+objPath))
			return true;
		else
			return false;
	},
	/**
	 * @description Load Javascript class and bind to IPUI synchronously
	 * @param {String} ns - the package path and name
	 * @returns void
	 */
	setTheme: function(ns) {
		var root 	= window;
		var nsPath 	= ns.split('.');
		var clName	= nsPath[nsPath.length-1];
		this.theme	= ns.replace(/\./gi, '/');
		if(!IPUI[clName]) this.loadFile(this.themeURL + this.theme  + '/css/stylesheet.css',{async:false,clName:clName});
	},
	
	/**
	 * @description Load in a file, specifying async:false will make make SXAJ call
	 * @param {String} url
	 * @param {Object} [optionalParams]
	 * @returns void
	 */
	loadFile: function(url, optionalParams) {	
		try {
			if(url.indexOf('css')>-1) {			
				var lnk 	= document.createElement('link');
				lnk.rel		= 'stylesheet';
				lnk.type	= 'text/css';
				lnk.href	= url;
				var headTag = document.getElementsByTagName('head')[0];
				headTag.appendChild(lnk);			
			}
			else {
				var options = {};Object.extend(options, optionalParams || {});
				var f 		= arguments.callee;
				if(!('queue' in f)) f.queue = {};
				var queue =  f.queue;
				if(url in queue) {
					if (options.onComplete) {
						if(queue[url])
							queue[url].push(options.onComplete);
						else
							options.onComplete();
					}
					return;
				}
				queue[url] = options.onComplete ? [options.onComplete] : [];
				var file;
				if(url.indexOf('.js')>-1) {
					file = document.createElement('script');
					file.setAttribute('type','text/javascript');
				}
				if(!('async' in options) || (('async' in options) && (options.async==true))) {
					if (/WebKit/i.test(navigator.userAgent) && !/Version/i.test(navigator.userAgent)) {
						var _timer = setInterval(function() {
							if (/loaded|complete/.test(document.readyState)) {
								clearInterval(_timer);
								while (queue[url].length) {
									queue[url].shift()();
								}
								queue[url] = null;
							}
						}, 1000);
					} 
					else {
						file.onload = file.onreadystatechange = function() {
							if (file.readyState && file.readyState != 'loaded' && file.readyState != 'complete') return;
							file.onreadystatechange = file.onload = null;
							while (queue[url].length) queue[url].shift()();
							queue[url] = null;
						};
					}
					if(url.indexOf('.js')>-1) file.setAttribute('src',url);
					document.getElementsByTagName("head")[0].appendChild(file);
				}
				else
					new Ajax.Request(url,{asynchronous:false,onSuccess:this.bindClass.bindAsEventListener(this,options)});					
			}
		}
		catch(err) {
			this.errorConsole(err);
		}
	},
	
	console: function(inOptions) {
		var options={};Object.extend(options, inOptions || {});
		if(!('console' in window)||!('firebug' in console)){
		    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group"
		                 , "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
		    window.console = {};
		    for(var i=0;i<names.length;++i) window.console[names[i]]=function(){};
		}
		eval('console.'+options.type+'(\''+options.msg+'\')');
	},
	
	/**
	 * @description Bind a loaded class to the IPUI class
	 * @private
	 * @param {Object} xhr
	 * @param {Object} [options]
	 * @returns void
	 */
	bindClass: function(jsClass,options) {
		if(typeof jsClass=='object') jsClass = jsClass.responseText;
		this[options.clName] = {};
		this[options.clName] = eval(jsClass);
		window[options.cName] = eval(jsClass);
	}
};
var IPUI = new ipuiBase;
IPUI.setTheme(IPUI.theme);