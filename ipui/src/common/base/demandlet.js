/**
 * @description The Demandlets Loader Class.
 * @constructor
 */	
function demandletManager() {
	this.version 		= '0.4';
	this.demandlets 	= {};
};
demandletManager.prototype = {
	/**
	 * @description
	 * @param {String} dName
	 * @return
	 */
    callback: function(dName) {
        for(var i=0;i<this.demandlets[dName].queue.length; i ++) {
        	var o = this.demandlets[dName].queue[i];
            this.demandlets[dName].init(o.elem, o.attr);
        }
        this.demandlets[dName].queue = null;
    },
	
	/**
	 * @description
	 * @param {Object} dElem
	 * @return
	 */
    setup: function(dElem) {
		IPUI.requires('utils.general');
        var dAttr = dElem.getAttribute('demandlet').evalJSON();
        dElem.setAttribute('id', '_'+IPUI.common.uniqueId()+'_'+dAttr.name);
        if(this.demandlets[dAttr.name] && this.demandlets[dAttr.name].init) {
        	this.demandlet[dAttr.name].init(dElem, dAttr);
        } 
		else {
            if(!this.demandlets[dAttr.name]) {
                this.demandlets[dAttr.name] = { queue: [ {elem: dElem, attr: dAttr} ] };
				IPUI.loadFile('/demandlets/' + dAttr.name + '.js');
            } 
			else {
            	this.demandlets[dAttr.name].queue.push({elem: dElem, attr: dAttr});
            }
        }
    },
	
	/**
	 * @description
	 * @return
	 */
    load: function() {
        $$('[demandlet]').each(function (dElem) {
                dElem.innerHTML = '';
               this.setup(dElem);
        });
    },
	
	/**
	 * @description
	 * @param {Object} dName
	 * @param {Object} dInit
	 * @return
	 */
    register: function (dName, dInit) {
	    this.demandlets[dName].init = dInit;
	    this.callback(dName);
    }
};