/*
 * 
 */
function renderOptins(dObj) {
	dataManager.register('/ajax/data/optin.xml', function (xhr) { renderOptins(xhr, dObj) });
	if (xhr && xhr.responseXML) {
		var rows =  xhr.responseXML.documentElement.getElementsByTagName('row');
		for (var i = 0; i < rows.length; i++) {
			var optin = (function (row) {
							var optinObj = {};
							var fields = row.getElementsByTagName('*');
							for (var i = 0; i < fields.length; i++) {
								optinObj[fields[i].nodeName] = getNodeValueByChildName(row, fields[i].nodeName);
							}
							return optinObj;
						})(rows[i]);
			dObj.appendChild(Builder.node('input', { type: 'checkbox', id:'optin_'+optin.optin_id }));
			dObj.appendChild(Builder.node('span', {className:'optin-text'}, [optin.display_text]));
			if (optin.is_required == 1) {
				var req = Builder.node('span', {className:'required'}, ["(required)"]);
				dObj.insertBefore(req, $('optin_'+optin.optin_id));
				$('optin_'+optin.optin_id).setAttribute('required', 'required');
				$('optin_'+optin.optin_id).setAttribute('alert', 'You must check the '+optin.name+' checkbox');
			}
		}
	}
};