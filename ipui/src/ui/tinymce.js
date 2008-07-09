function startEditorArray(editorArry) {
	editorArry.each(function(editor){
		if (!tinyMCE.getInstanceById(editor.id)) {
			tinyMCE.execCommand('mceAddControl', false, editor.id);
		}
	});	
};

function startEditors(cssSource) {
	editorTheme.simple();
	startEditorArray($$('.editorSimple'));
	editorTheme.advanced(cssSource ? cssSource : '');
	startEditorArray($$('.editorAdvanced'));
};

function makeSimpleEditor(editorObject){
	if(editorObject.hasClassName('editorSimple')&&tinyMCE.getInstanceById(editorObject.id)) return false;
	editorTheme.simple();
	if (tinyMCE.getInstanceById(editorObject.id)) tinyMCEDeinit(editorObject);
	editorObject.removeClassName('editorAdvanced');
	editorObject.addClassName('editorSimple');	
	tinyMCE.execCommand('mceAddControl', false, editorObject.id);
};

function makeAdvancedEditor(editorObject, cssSource){
	if(editorObject.hasClassName('editorAdvanced')&&tinyMCE.getInstanceById(editorObject.id)) return false;
	editorTheme.advanced(cssSource ? cssSource : '');
	if (tinyMCE.getInstanceById(editorObject.id)) tinyMCEDeinit(editorObject);
	editorObject.removeClassName('editorSimple');
	editorObject.addClassName('editorAdvanced');
	tinyMCE.execCommand('mceAddControl', false, editorObject.id);
};

function getEditor(object){
	try{
		tinyMCE.execInstanceCommand(object,'mceFocus');
		return tinyMCE.getContent();
	}
	catch(e){
		return '';
	}
};

function tinyMCEDeinit(editorObject){
	try{
		tinyMCE.execCommand('mceRemoveControl',true,editorObject.id);
	}
	catch(e) {}
	
};        

function stopEditors() {
	var editors = $$('.editorAdvanced','.editorSimple');
	editors.each(function(editor){
			tinyMCEDeinit($(editor.id));
		});
};

var editorTheme = {
	advanced: function(cssSource) {
		tinyMCE.init({
			mode : 'textareas',
			theme : 'advanced',
/*			plugins : 'style,table,preview,contextmenu,paste,fullscreen,noneditable,visualchars,nonbreaking,customtag,advimage',
			theme_advanced_buttons1 : "fullscreen,code,separator,cut,copy,paste,separator,undo,redo,separator,pastetext,pasteword,seperator,styleselect,separator,bold,italic,underline,separator,justifyleft,justifycenter,justifyright,justifyfull,separator,numlist,bullist,separator,outdent,indent,separator,forecolor,backcolor,separator,anchor,image,customtag",
			theme_advanced_buttons2 : "hr,removeformat,visualaid,separator,sub,sup,separator,charmap,separator,link,unlink,cleanup,separator,preview,separator,tablecontrols,separator,moveforward,movebackward,absolute,cite,abbr,acronym,del,ins,|,visualchars,nonbreaking",
			theme_advanced_buttons3 : "",
			theme_advanced_toolbar_location : 'top',
			theme_advanced_toolbar_align : 'left',
*/
			plugins : 'inlinepopups,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,zoom,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras',
			theme_advanced_buttons1 : 'bold,italic,underline,|,forecolor,backcolor,|,cut,copy,paste,pastetext,pasteword,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,fontselect,fontsizeselect',
			theme_advanced_buttons2 : 'search,replace,|,bullist,numlist,|,outdent,indent,|,sub,sup,|,undo,redo,|,link,unlink,anchor,image,cleanup,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|abbr,attribs,|,nonbreaking',
			theme_advanced_buttons3 : 'tablecontrols,|,hr,removeformat,visualaid,|,charmap,iespell,media,advhr,|,preview,fullscreen,code',
			theme_advanced_toolbar_location : 'top',
			extended_valid_elements : 'a[name|href|target|title|onclick],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name],hr[class|width|size|noshade],font[face|size|color|style],span[class|align|style]',
			relative_urls : false,
	        convert_urls : false,
			valid_elements : '*[*]',
			apply_source_formatting : false,
			content_css: cssSource,
			editor_selector : 'editorAdvanced',
			strict_loading_mode : true
		});	
	},
	simple: function() {
		tinyMCE.init({
			mode : 'textareas',
			theme : 'simple',
			editor_selector : 'editorSimple',
			strict_loading_mode : true
		});
	}
};

/*        tinyMCE.init({

               mode : "textareas",

               theme : 'advanced',
               plugins : 'inlinepopups,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,zoom,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras',
               theme_advanced_buttons1 : 'bold,italic,underline,|,forecolor,backcolor,|,cut,copy,paste,pastetext,pasteword,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,fontselect,fontsizeselect',
               theme_advanced_buttons2 : 'search,replace,|,bullist,numlist,|,outdent,indent,|,sub,sup,|,undo,redo,|,link,unlink,anchor,image,cleanup,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,|abbr,attribs,|,nonbreaking',
               theme_advanced_buttons3 : 'tablecontrols,|,hr,removeformat,visualaid,|,charmap,iespell,media,advhr,|,preview,fullscreen,code',
               theme_advanced_toolbar_location : 'top',
               extended_valid_elements : 'a[name|href|target|title|onclick],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name],hr[class|width|size|noshade],font[face|size|color|style],span[class|align|style]',
               template_external_list_url : 'example_template_list.js'

        });
*/