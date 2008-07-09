var today               = new Date();
var expires             = new Date(today.getTime() + (rmMinutes*60000));
var errMX               = "No More Modules Can Be Placed In This Section";
var errNA               = "Cannot Place This Module Type In This Section";
var errDP               = "This Module Already Exists In This Section";
var args                = /[|?]/gi;
var oMde                = false;
var sTimer              = "";
var ovrLyr              = "";
var srcObj              = "";
var rmMinutes           = 10;
var currentMODname		= "";
var currentMODid		= "";
var currentMODorder     = "";
var sectionObj          = "";
var contentObj          = "";
var loadedModType       = "";
var currentComponent	= '';
var sectionClick        = false;
var moduleClick         = false;
var mouseX				= '';
var mouseY				= '';
var decayLife           = 2;
var dummyObj;
var rClick              = false;
var rightMode           = '';

var sectionPadding      = "<br /><br /><br /><br />";
paddRegExp              = /<br \/><br \/><br \/><br \/>/gi;

function moduleEdit() 
{
	pageObj.editModule(currentModule);
};

function delMOD() 
{
    decayLife=0;popupDecay;
    clearTimeout(decayTMR);
    removeModuleSlot();
};

function moduleMoveUp() 
{
    decayLife=0;
	popupDecay;
	
    var countObj        = $(currentSection + "CNT");
	var contentObj		= $(currentSection+'_content');
	var mPosition		= currentPosition;
	var module_id		= currentModule;

    sectionHTML         = contentObj.innerHTML;
	
    if(mPosition>0 && countObj.value-0>1) {
        sectionHTML     = sectionHTML.replace(paddRegExp,'');
        targetOrder     = mPosition-1;
        
        //*** GET ALL DETAILS AND PREPARE THE MODULE TO MOVE *********************************************************************************
    	mvModuleStart   = sectionHTML.indexOf('<dnd' + mPosition + '>');
		mvModuleEnd     = sectionHTML.indexOf('</dnd' + mPosition + '>');
        mvModuleData    = sectionHTML.substring(mvModuleStart, mvModuleEnd) + '</dnd' + mPosition + '>';
        sectionHTML     = sectionHTML.replace(mvModuleData,'<DND A>');

        mvModuleData    = mvModuleData.replace('<dnd' + mPosition + '>', '<dnd' + targetOrder + '>');
        mvModuleData    = mvModuleData.replace('</dnd' + mPosition + '>', '</dnd' + targetOrder + '>');
        mvModuleData    = mvModuleData.replace('currentPosition=\'' + mPosition + '\';', 'currentPosition=\'' + targetOrder + '\';');
        
        mvModuleID      = currentModule;
        //*** FINISHED MODULE TO MOVE *********************************************************************************************************

        //*** GET ALL THE DETAILS AND PREPARE THE MODULE TO BE RELOCATED **********************************************************************
    	tgModuleStart   = sectionHTML.indexOf('<dnd' + targetOrder + '>');
		tgModuleEnd     = sectionHTML.indexOf('</dnd' + targetOrder + '>');
        tgModuleData    = sectionHTML.substring(tgModuleStart, tgModuleEnd) + '</dnd' + targetOrder + '>';
        sectionHTML     = sectionHTML.replace(tgModuleData,'<DND B>');

        tgModuleData    = tgModuleData.replace('<dnd' + targetOrder + '>', '<dnd' + mPosition + '>');
        tgModuleData    = tgModuleData.replace('</dnd' + targetOrder + '>', '</dnd' + mPosition + '>');
        tgModuleData    = tgModuleData.replace('currentPosition=\'' + targetOrder + '\';', 'currentPosition=\'' + mPosition + '\';');

        tgModuleIDs     = tgModuleData.indexOf('currentModule=\'');
        tgModuleIDe     = tgModuleData.indexOf('\';moduleClick');
        tgModuleID      = tgModuleData.substring(tgModuleIDs-0+15,tgModuleIDe); 
        //*** FINISHED MODULE THAT IS BEING RELOCATED ******************************************************************************************

		sectionHTML             = sectionHTML.replace('<DND A>',tgModuleData);
		sectionHTML             = sectionHTML.replace('<DND B>',mvModuleData);
        contentObj.innerHTML    = '<body>' + sectionHTML;

       	var orderData   	= $F(currentSection + 'DTA');
        mvStringID      	= '|' + mvModuleID + '|';
        tgStringID      	= '|' + tgModuleID + '|';
		
        orderData       	= SearchAndReplace(orderData, mvStringID, '|A|');
        orderData       	= SearchAndReplace(orderData, tgStringID, '|B|');
        orderData       	= SearchAndReplace(orderData, '|A|', tgStringID);
        orderData       	= SearchAndReplace(orderData, '|B|', mvStringID);
        $(currentSection + 'DTA').value = orderData;
    } 
};

function moduleMoveDown() 
{
    decayLife=0;
	popupDecay;
	
    var countObj        = $(currentSection + "CNT");
	var contentObj		= $(currentSection+'_content');
	var mPosition		= currentPosition;
	var module_id		= currentModule;
	
    sectionHTML         = contentObj.innerHTML;

    if(mPosition<countObj.value-0 && countObj.value-0>1) {
        sectionHTML     = sectionHTML.replace(paddRegExp,'');
        targetOrder     = mPosition-0+1;
        oldOrder        = mPosition-0;

        //*** GET ALL DETAILS AND PREPARE THE MODULE TO MOVE *********************************************************************************
    	mvModuleStart   = sectionHTML.indexOf('<dnd' + oldOrder + '>');
		mvModuleEnd     = sectionHTML.indexOf('</dnd' + oldOrder + '>');
        mvModuleData    = sectionHTML.substring(mvModuleStart, mvModuleEnd) + '</dnd' + oldOrder + '>';
        sectionHTML     = sectionHTML.replace(mvModuleData,'<DND A>');

        mvModuleData    = mvModuleData.replace('<dnd' + mPosition + '>', '<dnd' + targetOrder + '>');
        mvModuleData    = mvModuleData.replace('</dnd' + mPosition + '>', '</dnd' + targetOrder + '>');
        mvModuleData    = mvModuleData.replace('currentPosition=\'' + oldOrder + '\';', 'currentPosition=\'' + targetOrder + '\';');
        
        mvModuleID      = module_id;
        //*** FINISHED MODULE TO MOVE *********************************************************************************************************

        //*** GET ALL THE DETAILS AND PREPARE THE MODULE TO BE RELOCATED **********************************************************************
    	tgModuleStart   = sectionHTML.indexOf('<dnd' + targetOrder + '>');
		tgModuleEnd     = sectionHTML.indexOf('</dnd' + targetOrder + '>');
        tgModuleData    = sectionHTML.substring(tgModuleStart, tgModuleEnd) + '</dnd' + targetOrder + '>';
        sectionHTML     = sectionHTML.replace(tgModuleData,'<DND B>');

        tgModuleData    = tgModuleData.replace('<dnd' + targetOrder + '>', '<dnd' + oldOrder + '>');
        tgModuleData    = tgModuleData.replace('</dnd' + targetOrder + '>', '</dnd' + oldOrder + '>');
        tgModuleData    = tgModuleData.replace('currentPosition=\'' + targetOrder + '\';', 'currentPosition=\'' + oldOrder + '\';');

        tgModuleIDs     = tgModuleData.indexOf('currentModule=\'');
        tgModuleIDe     = tgModuleData.indexOf('\';moduleClick');
        tgModuleID      = tgModuleData.substring(tgModuleIDs-0+15,tgModuleIDe); 

        //*** FINISHED MODULE THAT IS BEING RELOCATED ******************************************************************************************
		sectionHTML             = sectionHTML.replace('<DND A>',tgModuleData);
		sectionHTML             = sectionHTML.replace('<DND B>',mvModuleData);
        contentObj.innerHTML    = '<body>' + sectionHTML;

        var orderData   			= $F(currentSection + 'DTA');
        mvStringID      			= '|' + mvModuleID + '|';
        tgStringID      			= '|' + tgModuleID + '|';
        orderData       			= SearchAndReplace(orderData, mvStringID, '|A|');
        orderData       			= SearchAndReplace(orderData, tgStringID, '|B|');
        orderData       			= SearchAndReplace(orderData, '|A|', tgStringID);
        orderData       			= SearchAndReplace(orderData, '|B|', mvStringID);
        $(currentSection + 'DTA').value = orderData;
    } 
};

function updateModule(moduleData) 
{
    decayLife=0;
	popupDecay;
	moduleData			= SearchAndReplace(moduleData, '/media', '/' + siteFldrArry[$F('siteId_select')] + '/media');
	var module_id 		= currentModule;
	var contentObj		= $(currentSection+'_content');
	var mPosition		= currentPosition;
    if(module_id!="") 
	{
        dataContent         	= contentObj.innerHTML;
		var dndStart			= '<dnd' +  mPosition + '>'
									+ '<span onmouseover="currentSection=\'' + currentSection + '\';currentPosition=\'' + mPosition + '\';currentModule=\'' + module_id + '\';moduleClick=true;" '
									+ 'onmouseout="moduleClick=false;">';
		var dndEnd				= '</span></dnd' +  mPosition + '>';
        dataContentSTART    	= dataContent.indexOf(dndStart);
        dataContentEND      	= dataContent.indexOf(dndEnd);
        moduleToUpdate      	= dataContent.substring(dataContentSTART-0+(dndStart.length), dataContentEND+(dndEnd.length));
        dataContent         	= dataContent.replace(moduleToUpdate,moduleData + '</span></div' + mPosition + '>');
       	contentObj.innerHTML    = dataContent;
		demandletRenderer.load();			
   }
};

function removeModule() 
{
    decayLife=0;
	popupDecay;
	
	var contentObj		= $(currentSection+'_content');
	var mPosition		= currentPosition-0;
	var module_id		= currentModule;
	
    if(module_id!="") {

        sectionHTML         = contentObj.innerHTML;
        sectionHTML         = sectionHTML.replace(paddRegExp,'');

        dataContentSTART    = sectionHTML.indexOf('<dnd' +  mPosition + '>');
        dataContentEND      = sectionHTML.indexOf('</dnd' + mPosition + '>');

        moduleToDelete      = sectionHTML.substring(dataContentSTART, dataContentEND) + '</dnd' + mPosition + '>';
        sectionHTML         = sectionHTML.replace(moduleToDelete,'');

        var countObj        = $(currentSection + 'CNT');
        var moduleCount     = countObj.value;
   
		for (var i=0; i<moduleCount; i++) {
			if(i>0)
			{
				nLyrID	= i-1;	
			} 
			else
			{
				nLyrID = 0;
			}
            sectionHTML	= sectionHTML.replace('<dnd' + i,'<dnd' + nLyrID);
            sectionHTML	= sectionHTML.replace('</dnd' + i,'</dnd' + nLyrID);
            sectionHTML	= sectionHTML.replace('currentPosition=\'' + i + '\'', 'currentPosition=\'' + nLyrID + '\'');
		}

        countObj.value          = moduleCount-1;
        contentObj.innerHTML    = '';
        contentObj.innerHTML    = sectionHTML;						
        currentData             = document.getElementById(currentSection + 'DTA').value; 
        document.getElementById(currentSection + 'DTA').value = currentData.replace('|' + module_id + '|','');
        currentModule           = '';
        contentObj.innerHTML   = contentObj.innerHTML;
   }
};

function setSection(sectionObject)
{
    currentSection  = sectionObject.id;
};


function view_insertModules()
{
	var dialog = new Ext.BasicDialog
	(
		'x-msg-box',
		{
			autoCreate: true,
			title: 'Insert Module',
			height: 300,
			width: 420,
			shadow: true,
			resizable: false,
			modal: true,
			shim: true,
			closable: true,
			buttonAlign: 'right',
			collapsible: false,
			constraintoviewport: false,
			draggable: true,
			fixedcenter: true
		}
	);
	dialog.body.createChild
	(
		{
			html:
				'<input type="hidden" id="module_type_id" />'
				+ '<table width="419">'
				+ 	 ' <tr>'
				+ 		'<td>'
				+ 			'<select id="module_category" onchange="pageObj.listModules($F(\'module_category\'),$F(\'module_type_id\'));"><option>Loading...</option></select>'
				+ 		'</td>'
				+ 	  '</tr>'
				+ '</table>'
				+ '<table width="419">'
				+ 	  '<tr>'
				+ 		'<td>'
				+ 			'<select id="module_list" multiple="multiple" size="10" onclick="pageObj.insertModuleGet($F(this));"><option></option></select>'
				+ 		'</td>'
				+ 	  '</tr>'
				+  '</table>'
		}
	);
	dialog.body.enableDisplayMode();
	dialog.addKeyListener(27, dialog.hide, dialog);
	dialog.addButton('Close', dialog.hide, dialog);
	dialog.on('hide', function() {this.destroy(true);}, dialog);
	dialog.show();	
	showModuleOptions();
};

function showModuleOptions()
{
	decayLife=0;
	popupDecay();

    var moduleSelect	= $('module_select');
    var module_type_id  = '';
	var sectionObj		= $(currentSection);
    for (i=0;i<sectionObj.attributes.length;i++)
	{
        if (sectionObj.attributes[i].specified)
		{
            if(sectionObj.attributes[i].nodeName.toLowerCase() == "allowtype") 
			{
                module_type_id = sectionObj.attributes[i].nodeValue; 
				break;
            }
        }
    }
	pageObj.listModuleCategories(module_type_id);
}

function insertModule(module_id,moduleData) 
{
	moduleData			= SearchAndReplace(moduleData, '/media', '/' + siteFldrArry[$F('siteId_select')] + '/media');
	var contentObj		= $(currentSection+'_content');
    var frmKeeper		= $(currentSection + 'DTA');  
    var countObj        = $(currentSection + 'CNT');
    var moduleCount     = countObj.value-0;
    var sectionHTML		= contentObj.innerHTML;
    sectionHTML         = sectionHTML.replace(paddRegExp,"");
    var crModContent    = frmKeeper.value;
    if(crModContent.indexOf("|" + module_id + "|")<0) {   
        layerContent        	= '<dnd' + moduleCount + '>'
									+ '<span onmouseover="currentSection=\'' + currentSection + '\';currentPosition=\'' + moduleCount + '\';currentModule=\'' + module_id + '\';moduleClick=true;\" '
                                	+ 'onmouseout="moduleClick=false;">' + moduleData + '</span></dnd' + moduleCount + '>'; 
		moduleCount++;
		contentObj.innerHTML	= sectionHTML + layerContent;
        countObj.value      	= moduleCount;
        frmKeeper.value     	+= '|' + module_id + '|';
        contentObj.innerHTML   	= "<body>" + contentObj.innerHTML;
		demandletRenderer.load();
    } 
    else {
        alert(errDP);
    }			
};

function pageRightClick(event) 
{
	if(!Event.isLeftClick(event)) 
	{
		if(event.stopPropagation)
		{
			event.stopPropagation();
			event.preventDefault();
		}
		event.cancelBubble            = true;
		Element.hide('right_options');
	    if(moduleClick==true){
	        $('right_options').style.left        = mouseX-270 + 'px';
	        $('right_options').style.top         = mouseY-150 + 'px';
	        Element.show('right_options');                    
	    }
	    else if(sectionClick==true){
	        view_insertModules();
	    }
	    return false;
	} 
};

function popupDecay() 
{
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

/*
 * DEMANDLET PLACEHOLDER RENDERER FOR PAGE EDITOR
 */
	var demandletRenderer = {

		  renderPlaceholder: function(demandlet) 
		  {
	   		$$('.'+demandlet).each(
				function(item){
					//console.info(item.innerHTML = '<img src="/ipui/demandlets/placeholders/' + demandlet.toLowerCase() + '.gif" alt="' + demandlet + ' Demandlet" title="' + demandlet + ' Demandlet" />');
					if(item.innerHTML=='') item.innerHTML = '<img src="/ipui/demandlets/placeholders/' + demandlet.toLowerCase() + '.gif" style="margin-bottom: 10px;" alt="' + demandlet + ' Demandlet" title="' + demandlet + ' Demandlet" />';
					
				}
			);
		  }, 
		  load: function() 
		  {
		  	var demandlets = 'demandlet-localNav,demandlet-featureProducts,demandlet-genreProducts,demandlet-browseCloseups';
	      	demandlets.split(',').each(
		      	function(demandlet) { 
					if($$('.'+demandlet).length>0) demandletRenderer.renderPlaceholder(demandlet); 
			  	}
			);
		  }
	};
