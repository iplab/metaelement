	function json2String(jsonObj) {
		var string = '';
		var memberCount = 0;
		for(var member in jsonObj) {
		    if(memberCount>0) string += ',';
		    string += member + ":'" + jsonObj[member] + "'";
			memberCount++;
		}
		string = '{' + string + '}';
		return string;	
	};