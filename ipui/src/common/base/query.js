function query() {
}
query.prototype = {
	where: function(query,dataObj) {
		try {
			var response=false;var reason='No Error';var error=false;
			if(query.indexOf('!=')>-1)
				whereArray=query.split('!='),operator='!=';
			else if(query.indexOf('=')>-1)
				whereArray=query.split('='),operator='==';
			else if(query.indexOf('>')>-1)
				whereArray=query.split('>'),operator='>';
			else if(query.indexOf('<')>-1)
				whereArray=query.split('<'),operator='<';
			else if(query.indexOf(' is ')>-1)
				whereArray=query.split(' is '),operator='is';
			if(isArray(whereArray)) {
				(isString(whereArray[1].replace(/\'/g,''))) ? than=whereArray[1] : than=parseFloat(whereArray[1].replace(/\'/g,''));
				var condition = {member:whereArray[0], is:operator, than:than};
				if(condition.is=='is' && condition.than=='null') {
					((condition.member in dataObj)==false) ? response=true : response=false;
				}
				else if(condition.member in dataObj) {
               		(eval('dataObj[\'' + condition.member + '\']' + condition.is + condition.than)==true) ? response=true : response=false;
				}
				else {
					(condition.is == '!=') ? response=true : response=false;
					error=true;reason='No data member (' + condition.member + ') found. Query (' + query + ')';
				}
			}
			else {
				error=true;reason='Incorrect query (' + query + ')';
			}
			return {result:response,reason:reason,error:error};		
		}
		catch(err) {
			return {result:false,reason:err,error:true};			
		}	
	}

}