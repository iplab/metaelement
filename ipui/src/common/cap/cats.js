function cats(){
};
cats.prototype = {
	
	initialize: function(){
		IPUI.requires('common.base.xml');
		this.catURI		= 'implements/cats/';
		this.repo 		= 'implements/cats/repo.xml';	
		this.registry 	= {};
	},

	loadAll: function(options){ //Read through implements repository for specified CAT's
		new Ajax.Request(this.repo,
							{
								onSuccess:function(xhr){
									var applications = eval('('+IPUI.xml.xml2json(xhr.responseXML)+').cats');
									for(cat in applications)
										if(typeof applications[cat]=='string')
											IPUI.cats.load(applications[cat]['@resource']);	
										else
											for(each in applications[cat])
												if(typeof applications[cat][each]=='object')
													IPUI.cats.load(applications[cat][each]['@resource']); 									
									if(options&&(options.onComplete)) options.onComplete(IPUI.cats.registry,options);
								}
							});	
	},
		
	load: function(url){ //Load a specified CAT into the registry
		new Ajax.Request(this.catURI+url,
									{
										asynchronous:false,
										onSuccess:function(xhr){
											var appURI = url.split('/');
											IPUI.cats.registry[url.replace('/'+appURI[appURI.length-1],'')] = eval('('+IPUI.xml.xml2json(xhr.responseXML)+').cat');
											return IPUI.cats.registry[url.replace('/'+appURI[appURI.length-1],'')];
										}
									});		
	},
	
	features: function(cName, options){
		var CATfeatures = {};
		if(!options || (!options.aspect)) IPUI.console('cats.features: Please specify \"aspect\" for \"' + cName + '\"');
		else{
			if(!(cName in IPUI.cats.registry))
				IPUI.console({msg:'CAT \"' + cName + '\" not registered!',type:'error'});
			else
				var aspect = 'admin';
				if(aspect in IPUI.cats.registry[cName].application)
					for(role in IPUI.cats.registry.blogger.application[aspect].feature)
						if(typeof IPUI.cats.registry.blogger.application[aspect].feature[role]=='object')
							CATfeatures[role] = IPUI.cats.registry.blogger.application[aspect].feature[role];
		}	
			return CATfeatures;
	}
	
};
	
