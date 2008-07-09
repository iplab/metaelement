	function tags(){
	};
	tags.prototype = {
		
		fetch: function(objectID, targetObj) {
			new Ajax.Request('/ajax/data/tag/'+objectID, {
				parameters: {nC: noCache()},
					onComplete: function (xhr) { 
						$A(xhr.responseXML.firstChild.getElementsByTagName('resultset')).each( 
							function(rsTemp) {
								console.info(rsTemp);
							}
						);
					}
				});		
		},
		
		weightTags: function(ulObject){
			
		},
		
		render: function(dmObject) {
			that = this;
			var objectID = dmObject.getAttribute('object_id');
			new Ajax.Request('/ajax/layouts/tagCloud.html', {
				parameters: { nC: noCache() },
				onFailure: function () { dmObject.remove(); },
				onSuccess: function (xhr) { 
					dmObject.appendChild( new Element('div',{id:dmObject.getAttribute('id') + '_layout'}).update(xhr.responseText) );
					that.fetch(objectID, dmObject.getAttribute('id'));
				}
			});
		}
	};
	
	function initiate_tagCloud(dObj) { //compatibility for demandlet manager 1.0
		tags.render( demandletManager.setup(dObj) );
	};
	
	function prepare_tagCloud(itemId, layout, blogId) {
		var div = new Element('div',{id:itemId + '_layout'}).update(layout);
		console.info(div);
	};
	
	function fetch_tagCloud(blogId) {
		new Ajax.Request('/ajax/data/tag/'+blogId, {
			parameters: {nC: noCache()},
			onComplete: function (xhr) { 
				console.info(xhr.responseXML);
			}
		});		
	};

	
