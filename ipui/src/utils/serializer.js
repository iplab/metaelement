/**
 * @description The serializer Class
 * @constructor
 */	
function serializer(){
	
};
serializer.prototype = {
 
 /**
  * @description Serializes Javascript Objects, useful for sending data to server 
  * @param {Object} object
  * @return Returns a serialized string representation of the Javascript Object
  */
  serialize : function(object) {
    var values = []; 
    var prefix = '';
    values = this.recursive_serialize(object, values, prefix);
    param_string = values.join('&');
    return param_string;
  },
  
  /**
   * @private
   * @param {Object} object
   * @param {Object} values
   * @param {Object} prefix
   */
  recursive_serialize : function(object, values, prefix) {
    var value;
    var prefixed_key;
    var child_prefix = '';
    for(var key in object) {
      if(typeof object[key] == 'object' || typeof object[key] == 'array') {
        if(prefix.length>0)
          child_prefix = prefix + '['+key+']';         
		else
          child_prefix = key;
        values = this.recursive_serialize(object[key], values, child_prefix);       
      } 
	  else if(typeof object[key] != 'function') {
        value = encodeURIComponent(object[key]);
        if(prefix.length>0)
          prefixed_key = prefix+'['+key+']';           
		else
          prefixed_key = key;
        prefixed_key = encodeURIComponent(prefixed_key);
        if(value) values.push(prefixed_key + '=' + value);
      }
    }
    return values;
  }

};
