/**
 * The Form Class
 * @constructor
 */
function form() {
	this.dfltChars	= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.?-()[]+=_-;:/#@$%&!,*<>\"\'\n\r ';
	this.version	= '0.4a';
}; 
form.prototype = {	
	/**
	 * @description Validates a form based upon validation attributes specified in the form elements
	 * @param {Object} frmObj The form as an object
	 * @return Returns a Boolean true/false based upon the validation of the form
	 */
	validateForm: function(frmObj) {
		try {
			if(object.tagName!='FORM') return false;
			var valid 	= true;
			var obj 	= this;
			Form.getInputs(object).each(
				function(element) {
					valid = obj.validateElement(element);
				}
			);
			return valid;
		}
		catch(err) { return false; }
	},
	
	/**
	 * @description Validates a form element based upon the validation attributes it contains
	 * @param {Object} itmObj The element as an object
	 * @param {Object} [optionalParams] Optional attributes passed as an object
	 * @return Returns a Boolean true/false based upon the validation of the element
	 */
	validateElement: function(itmObj,optionalParams) {
		var options = {};Object.extend(options, optionalParams || {});
		var response = true;
		if(itmObj.attributes['id']) {
			oType		= itmObj.type;
	        oName  		= itmObj.getAttribute('id');
			if(!itmObj.getAttribute('name')) itmObj.setAttribute('name',oName);
	        oValue 		= $F(itmObj);
			if(this.options.required=='true') 
				oReqd=true;
			else 
				(itmObj.getAttribute("required")) ? oReqd=true : oReqd=false;
		   	(itmObj.getAttribute("alert")) ? oAlert=itmObj.getAttribute('alert') : oAlert ='';
			(itmObj.getAttribute("highlight")) ? oHighlight=itmObj.getAttribute('highlight') : oHighlight='';
	       	(itmObj.getAttribute("chars")) ? oChars=itmObj.getAttribute('chars') : oChars=dfltChars;
	        (itmObj.getAttribute("editor")) ? oEditor=true : oEditor=false;
	        (itmObj.getAttribute("parent")) ? oParent=itmObj.getAttribute('parent') : oParent='';
			(itmObj.getAttribute("minLen")) ? oMin=itmObj.getAttribute('minLen') : oMin=1;
	        (itmObj.getAttribute("maxLen")) ? oMax=itmObj.getAttribute('maxLen') : oMax=100;
			if(oReqd==true||(document.getElementById(oParent)&&oParent!=''&&$(oParent).checked==true)||oAlert!='') {
	        	if(oEditor==true) {
					var tmpValue = getEditor(oName);
					if(tmpValue.length<oMin || tmpValue.length>oMax) {
						response=false;
						if(oHighlight!='') theO.className = oHighlight;
						if(oAlert!='') alert(oAlert);
					}
	        	}
				else if(oType.indexOf('select-single')>-1 && oValue=="") {
					response=false;
					if(oHighlight!='') {
						theO.addClassName(oHighlight);
					}
					if(oAlert!='') alert(oAlert);
				}
				else if(oType.indexOf('select-multiple')>-1) {
					if(oValue=='') {
						response=false;
						if(oHighlight!='') {
							theO.addClassName(oHighlight);
						}
						if(oAlert!='') alert(oAlert);
					}
					else {
						if(oValue.indexOf(',')>-1 && oMin>1) {}
					}
				}
	        	else {
		            if(oName.toLowerCase().indexOf('email')>-1) { 
		                if(isValidEmail(oValue)==false) {
		                	response=false;
							if(oHighlight!='') theO.addClassName(oHighlight);
							if(oAlert!='') alert(oAlert);
		                }
		             } 
		             else if(validate(oValue,oChars)==false||oValue.length<oMin||oValue.length>oMax) {
		             	response=false;
						if(oHighlight!='') {
							theO.addClassName(oHighlight);
						}
						if(oAlert!='') alert(oAlert);
		             }
		     	}
	        }
		}	
		return response;
	},
	
	/**
	 * @description Validates a string value for valid email address syntax 
	 * @param {String} emlAddress The email address to validate
	 * @return Returns a Boolean true/false based upon validation of the email address
	 */
	validateEmail: function(emlAddress) {
		if(emlAddress.length<1)	return false;
		if(emlAddress.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)!=-1)
			return true;
		else
			return false;
	},
	
	/**
	 * @description Validates a string value against a string value of allowed characters
	 * @param {String} strVl The string value to validate
	 * @param {String} strChrs The string value of allowed characters
	 * @return Returns a Booelan true/false based upon validation of the string
	 */
	validateInput: function(strVl,strChrs) { 
		if(!strVl || ((strVl==dfltValue) || (strVl.length<1))) return false;
		if(!strChrs) strChrs=dfltChars;
		for(var i=0;i<strVl.length;i++){
			if(strChrs.indexOf(strVl.charAt(i))==-1) return false;break;
		}
		return true;
	}	
};
form.prototype.select = {
	
	/**
	 * 
	 * @param {Object} element
	 * @description returns true or false if object has options
         * @return {Boolean} 
	 */
	hasOptions: function(element){
		if(obj!=null&&obj.options!=null)
			return true;
		else
			return false;
	},
	
	/**
     * @description select or unselect state of object's options, if options exist
	 * @param {Object} obj
	 * @param {Object} regex
	 * @param {Object} which values are 'selected' or 'unselected'
	 * @param {Object} only if value is true, only these options will be selected or unselected, all other options will be set to the inverse. if false, all other options will remain in their current state.
     * @return void
	 */
	selectUnSelectMatchingOptions: function (obj,regex,which,only) {
		if(window.RegExp) {
			if(which=='select') {
				var selected1=true;
				var selected2=false;
			}
			else if(which=='unselect') {
				var selected1=false;
				var selected2=true;
			}
			else {
				return;
			}
			var re = new RegExp(regex);
			if(!this.hasOptions(obj)) return;
			for(var i=0;i<obj.options.length;i++) {
				if(re.test(obj.options[i].value))
					obj.options[i].selected=selected1;
				else
					if(only==true) obj.options[i].selected=selected2;
			}
		}
	},
	
	/**
	 * @description select the object's options that matches regex
	 * @param {Object} obj
	 * @param {Object} regex
     * @return void
	 */
	selectMatchingOptions: function(obj,regex) {
		this.selectUnselectMatchingOptions(obj,regex,'select',false);
	},
	
	/**
	 * @description select only the object's options that match regex, and unselect all other options
	 * @param {Object} obj
	 * @param {Object} regex
     * @return void
	 */
	selectOnlyMatchingOptions: function(obj,regex) {
		this.selectUnselectMatchingOptions(obj,regex,'select',true);
	},
	
	/**
	 * 
     * @description unselect options that matches regex
	 * @param {Object} obj
	 * @param {Object} regex
     * @return void
	 */
	unSelectMatchingOptions: function(obj,regex) {
		this.selectUnselectMatchingOptions(obj,regex,'unselect',false);
	},	
	
	/**
	 * @description sort options alphanumerically
	 * @param {Object} element
	 */
	sortSelect: function(element) {
		if(!hasOptions(element)) return;
		var o=new Array();
		for(var i=0;i<element.options.length;i++) o[o.length]=new Option(element.options[i].text,element.options[i].value,element.options[i].defaultSelected,element.options[i].selected);
		if(o.length==0) return;
		o=o.sort(
			function(a,b) {
				if((a.text+'')<(b.text+'')){
					return -1;
				}
				if((a.text+'')>(b.text+'')){
					return 1;
				}
				return 0;
			}
		);
		for(var i=0;i<o.length;i++) obj.options[i]=new Option(o[i].text,o[i].value,o[i].defaultSelected,o[i].selected);
	},
	
	/**
	 * @description select all options of object
	 * @param {Object} obj
	 */
	selectAllOptions: function(obj) {
		if(!this.hasOptions(obj)) return;
		for(var i=0;i<obj.options.length;i++) obj.options[i].selected=true;
	},
	
	/**
	 * @description unselect all options of object
	 * @param {Object} obj
	 */
	unselectAllOptions: function(obj) {
		if(!this.hasOptions(obj)) return;
		obj.selectedIndex='-1';
		for(var i=0;i<obj.length;i++) obj.options[i].selected=false;
	},
	
	/**
	 * @description remove selected options from the "from" object and append to options of "to" object.
	 * @param {Object} from
	 * @param {Object} to
	 */
	moveSelectedOptions: function(from,to) {
		if(arguments.length>3){
			var regex=arguments[3];
			if(regex!='') this.unSelectMatchingOptions(from,regex);
		}
		if(!this.hasOptions(from)) return;
		for(var i=0;i<from.options.length;i++) {
			var o = from.options[i];
			if(o.selected) {
				if(!this.hasOptions(to)){
					var index=0;
				}
				else{
					var index=to.options.length;
				}
				to.options[index]=new Option(o.text,o.value,false,false);
			}
		}
		for(var i=(from.options.length-1);i>=0;i--) {
			var o=from.options[i];
			if(o.selected) from.options[i]=null;
		}
		if((arguments.length<3)||(arguments[2]==true)) {
			sortSelect(from);
			sortSelect(to);
		}
		from.selectedIndex=-1;
		to.selectedIndex=-1;
	},
	
	/**
	 * @description copy selected options from src object to destination object
	 * @param {Object} from
	 * @param {Object} to
	 */
	copySelectedOptions: function(from,to) {
		var options = new Object();
		if(this.hasOptions(to)) for(var i=0;i<to.options.length;i++) options[to.options[i].value]=to.options[i].text;
		if(!this.hasOptions(from)) return;
		for(var i=0;i<from.options.length;i++) {
			var o=from.options[i];
			if(o.selected) {
				if(options[o.value]==null||options[o.value]=='undefined'||options[o.value]!=o.text){
					if(!this.hasOptions(to)) 
						var index=0;
					else
						var index=to.options.length;
					to.options[index]=new Option(o.text,o.value,false,false);
				}
			}
		}
		if((arguments.length<3)||(arguments[2]==true)) sortSelect(to);
		from.selectedIndex=-1;
		to.selectedIndex=-1;
	},
	
	/**
	 * @description move all options from object and add to options list of "to" object
	 * @param {Object} from
	 * @param {Object} to
	 */
	moveAllOptions: function(from,to) {
		this.selectAllOptions(from);
		if(arguments.length==2)
			this.moveSelectedOptions(from,to);
		else if(arguments.length==3)
			this.moveSelectedOptions(from,to,arguments[2]);
		else if(arguments.length==4) 
			this.moveSelectedOptions(from,to,arguments[2],arguments[3]);
	},
	
	/**
	 * @description copy all options from object to "to" object
	 * @param {Object} from
	 * @param {Object} to
	 */
	copyAllOptions: function(from,to) {
		this.selectAllOptions(from);
		if(arguments.length==2) {
			this.copySelectedOptions(from,to);
		}
		else if(arguments.length==3) {
			this.copySelectedOptions(from,to,arguments[2]);
		}
	},
	
	/**
	 * @description swap places of 2 options of object obj.
	 * @param {Object} obj
	 * @param {Object} i
	 * @param {Object} j
	 */
	swapOptions: function(obj,i,j) {
		var o=obj.options;
		var i_selected=o[i].selected;
		var j_selected=o[j].selected;
		var temp=new Option(o[i].text,o[i].value,o[i].defaultSelected, o[i].selected);
		var temp2= new Option(o[j].text,o[j].value,o[j].defaultSelected,o[j].selected);
		o[i]=temp2;
		o[j]=temp;
		o[i].selected=j_selected;
		o[j].selected=i_selected;
	},
	
	/**
	 * @description move selected option of object up one position, as long as the option is not already first, and the previous option is not selected.
	 * @param {Object} obj
	 */
	moveOptionUp: function(obj) {
		if(!this.hasOptions(obj)) return;
		for(var i=0;i<obj.options.length;i++) {
			if(obj.options[i].selected) {
				if(i!=0&&!obj.options[i-1].selected){this.swapOptions(obj,i,i-1);obj.options[i-1].selected=true;}
			}
		}
	},
	
	/**
	 * @description move selected option down one place, unless already in last position, or if the next option is selected
	 * @param {Object} obj
	 */
	moveOptionDown: function(obj) {
		if(!this.hasOptions(obj)) return;
		for(var i=obj.options.length-1;i>=0;i--) {
			if(obj.options[i].selected){
				if(i!=(obj.options.length-1)&&!obj.options[i+1].selected){
					this.swapOptions(obj,i,i+1);
					obj.options[i+1].selected=true;
				}
			}
		}
	},
	
	/**
	 * @description remove selected options
	 * @param {Object} from
	 */
	removeSelectedOptions: function(from) {
		if(!this.hasOptions(from)) return;
		if(from.type=="select-one"){
			from.options[from.selectedIndex]=null;
		}
		else{
			for(var i=(from.options.length-1);i>=0;i--) {
				var o=from.options[i];
				if(o.selected) from.options[i]=null;
			}
		}
		from.selectedIndex=-1;
	},
	
	/**
	 * @description remove all options
	 * @param {Object} from
	 */
	removeAllOptions: function(from) {
		if(!this.hasOptions(from)) return;
		for(var i=(from.options.length-1);i>=0;i--) {
			from.options[i]=null;
		}
		from.selectedIndex=-1;
	},
	
	/**
	 * @description append new option to object's options
	 * @param {Object} obj
	 * @param {Object} text display text in option
	 * @param {Object} value option's value
	 * @param {Object} selected option's selected state
	 */
	addOption: function(obj,text,value,selected) {
		if(obj!=null&&obj.options!=null)
			obj.options[obj.options.length]=new Option(text,value,selected);
	},
	
	/**
	 * @description remove option with value that matches the supplied parameter value
	 * @param {Object} fOBJ
	 * @param {Object} value
	 */
	removeOption: function(fOBJ,value) {
		for(var i=0;i<fOBJ.options.length;i++) {
			if(fOBJ.options[i].value==value)
				fOBJ.options[i]=null;
		}
	},
	
	/**
	 * @description returns a comma delimited string of all options' values
	 * @param {Object} fOBJ
         * @return {String} comma separated string of all options values
	 */
	getSelectList: function(fOBJ) {
		var pars='';	
		for(var i=0;i<fOBJ.length;i++) {
			if(i>0) pars=pars+',';
			pars=pars+fOBJ.options[i].value;
		}
		return pars;
	},
	
	/**
	 * @description get a comma delimited string of all selected options' values
	 * @param {Object} fOBJ
         * @return {String} comma separated string of all selected options' values
	 */
	getSelectListSelected: function(fOBJ) {
		var pars='';
		var count=0;
		for(var i=0;i<fOBJ.length;i++) {
			if(fOBJ.options[i].selected==true) {
				if(count>0) pars=pars+',';
				count++;
				pars=pars+fOBJ.options[i].value;
			}
		}
		return pars;
	},
	
	/**
	 * 
     * @description returns options list markup
	 * @param {Object} sOptions comma separated String of options
	 * @param {Object} sSelected value of selected option
         * @return {String} html for options 
	 */
	display_Select: function(sOptions,sSelected) {
		var tmpData='';
		var x=sOptions.split(',');
		for(var i=0;i<x.length;i++) {
			var sltcd='';
			var items=x[i].split('|');
			if(items[0]==sSelected)	sltcd='selected="selected"';
			tmpData+='<option value="'+items[0]+'" '+sltcd+'>'+items[1]+'</option>';
		}
		return tmpData;
	}
};