/*
 * Program A-Z Demandlet
 */

	function initiate_azList(dObj) {
		var itemId = uniqueId();
		
		var toggle_link = Builder.node('a', {href:'#',className:"toggleAzlist",onclick:'toggle_azList(\'az_' + itemId + '\');this.blur();return false;'});
		var header = Builder.node('h3', {id:'programs-header'}, ['Programmes A-Z']);
		toggle_link.appendChild(header);
		
		dObj.appendChild(toggle_link);
		dObj.appendChild(Builder.node('div',{id:'az_'+ itemId,className:'scroll azList',style:'display:none;'},['Loading..']));
		new Ajax.Request('/ajax/data/'+getMetaValue('siteIdentifier')+'/'+'programList.xml',{
			method:'POST',
			parameters:'&nC'+noCache(),
			onFailure:function(err){},
			onSuccess:function(xml){ 
				$('az_'+ itemId).innerHTML = '';
				programList = Builder.node('ol');
				var firstNode 	= get_firstchild(xml.responseXML.documentElement);
				var x 			= xml.responseXML.getElementsByTagName(firstNode.nodeName);
				for (var i = 0; i < x.length; i++) {
					var program_title = getNodeValueByChildName(x[i], 'display_name');
					var short_name = getNodeValueByChildName(x[i], 'short_name');
					if (short_name.length > 0) {
						programList.appendChild(Builder.node('li',[Builder.node('a', {href:'/'+short_name+'/'}, [program_title])]));
					} else {
						programList.appendChild(Builder.node('li', [program_title]));
					}
				};
				$('az_'+ itemId).appendChild(programList);
			}
		});
	};	
	
	function toggle_azList(thisObj) {
		Effect.toggle(thisObj,'blind');
	};