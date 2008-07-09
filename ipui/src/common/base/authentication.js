function authentication(){
	this.aURI 	= 'jserver/authenticate.jsp';
	this.cName	= 'user_';
};
authentication.prototype = {
	
	initialize: function(){
		IPUI.requires('common.base.cookie');
	},
	
	login: function(uname,pwd,options){
		//TO DO: validate uname and pwd before making ajax call
		new Ajax.Request(aURI,
							{
								onComplete:function(xhr){
									//TO DO: valdate a success response from XHR
									//SUCCESS:
									IPUI.cookie.create(this.cName,'autheticated',0);
									if(options.onSuccess) options.callback();
									//TO DO: FAILURE
								}
							});	
	},

	logout: function(){
		IPUI.cookie.remove(this.cName);
	},
	
	isLoggedIn: function(){
		IPUI.cookie.read(this.cName);
	},
	
	privileges: function(){
		return IPUI.cookie.read(this.cname+'p');
	}

};