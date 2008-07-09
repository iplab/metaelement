function tabs(element, options){
};
tabs.prototype = {
	
	setup: function(element,options)
	{
	  	this.element = $(element);
		if (options && ('className' in options)) this.element.addClassName(options.className);
	   	var options = Object.extend({}, arguments[1] || {});
	   	this.menu = $A(this.element.getElementsByTagName('a'));
	   	this.show(this.getInitialTab());
	  	this.menu.each(this.setupTab.bind(this));
		return element;
	 },
 
 	render: function(dataObj, options)
	{
		var ulObj = new Element('ul',{id:options.id});
		if (options && ('className' in options)) ulObj.addClassName(options.className);
		var count=0;
		for(each in dataObj)
		{
			count++;
			(dataObj[each].panel) ? tabID=dataObj[each].panel : tabID='tab_'+options.id+'_'+count;
			var liObj 	= new Element('li');
			var anc	  	= new Element('a',{href:'#'+tabID, onclick:dataObj[each].onclick}).update(new Element('span').update(dataObj[each].label));
			liObj.appendChild(anc);
			ulObj.appendChild(liObj);
		}
		return this.setup(ulObj);
	},
	   
	setupTab: function(elm)
	{
    	Event.observe(elm,'click',this.activate.bindAsEventListener(this,this.menu),false);
  	},
    
	add: function(tabObj,options)
	{
		try
		{
			var newTab	= new Element('li').update(
								new Element('a',{href:'#12', onclick:options.onclick}).update(
									new Element('span').update(options.label)
								)
							);
							
			$('tabs_'+tabObj).appendChild(newTab);
		}
		catch(err){
			console.info(err);
		}
	},
	
	activate: function(ev,nm) 
	{
		this.menu = nm;
		var elm = Event.findElement(ev, 'a');
		Event.stop(ev);
		this.show(elm);
		this.menu.without(elm).each(this.hide.bind(this));
   	},
	
	hide: function(elm) 
	{
		$(elm).removeClassName('active-tab');
		if (document.getElementById(this.tabID(elm))) 
			$(this.tabID(elm)).removeClassName('active');
    },
        
	show: function(elm) 
	{
		$(elm).addClassName('active-tab');
		if (document.getElementById(this.tabID(elm))) 
			$(this.tabID(elm)).addClassName('active');
  	},
        
	tabID: function(elm) 
	{
		return elm.href.match(/#(\w.+)/)[1];
    },
	
	getInitialTab: function() 
	{
		if (document.location.href.match(/#(\w.+)/))
		{
			var loc = RegExp.$1;
			var elm = this.menu.find(
							function(value){ 
								return value.href.match(/#(\w.+)/)[1] == loc; 
								
							});
			return elm || this.menu.first();
		} 
		else 
			return this.menu.first();
 	}
};
