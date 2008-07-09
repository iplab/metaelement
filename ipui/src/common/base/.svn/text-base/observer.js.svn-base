var brName              = navigator.appName;
var slotClick           = false;
var moduleClick         = false;
var mouseX				= '';
var mouseY				= '';
var decayLife           = 2;
var dummyObj;

var rClick              = false;
var rightMode           = '';

if(brName.indexOf('Netscape')>-1) {
    document.onmousedown    = right;
    document.oncontextmenu  = nocontextmenu;
}
else {
    //*** Set our mousevent capture
    document.onmousedown		= right;
    window.onmousedown          = right;
    document.oncontextmenu      = nocontextmenu;
}      

function nocontextmenu() {
    event.cancelBubble      = true; 
    event.returnValue       = false;
    return false;
} 

function right(e) {

    if (brName.indexOf("Netscape")>-1 && (e.ctrlKey==true || e.which == 3 || e.which == 2)) {
 
        window.event    = e;
        e.cancelBubble;
       
	   	Element.hide('module_select');
	   	Element.hide('right_options');

        if(moduleClick==true){
            $('right_options').style.left        = mouseX + 10 + 'px';
            $('right_options').style.top         = mouseY + document.body.scrollTop-20 + 'px';
            Element.show('right_options');                          
        }
        else if(slotClick==true){
            view_insertModules();
        }
        return false;
    }
    else if (navigator.appName == 'Microsoft Internet Explorer' && (event.button == 2 || event.button == 3)) {
		
	   	Element.hide('module_select');
	   	Element.hide('right_options');

        var rClickLayerStr              = "";
        event.cancelBubble            = true;

        if(moduleClick==true){
            rClickLayerStr = 'right_options';                                
        }
        else if(slotClick==true){
            rClickLayerStr = 'module_select';
        }
        else {
            rClickLayerStr = '';
        }

        if(rClickLayerStr!=''){
            $(rClickLayerStr).style.left          = mouseX;
            $(rClickLayerStr).style.top           = mouseY + document.body.scrollTop-20;
            Element.show(rClickLayerStr);
       }
       return false;
    }
    else {
        return true;
    }
}

function popupDecay() {
    if(decayLife < 1) {
	   if(document.getElementById('right_options')) {
	   		Element.hide('right_options');
        	clearTimeout(decayTMR);
	   }
    }
    else {
        decayLife   = decayLife - 1;
        decayTMR    = setTimeout("popupDecay()",500);
    }
} 

decayTMR    = setTimeout("popupDecay()",500);