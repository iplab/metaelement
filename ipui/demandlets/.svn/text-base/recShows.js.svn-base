/*
 * recShows.js
 */

 	function initiate_recShows(dObj) {
		var header = Builder.node('h3', {className:'header-section'}, ["Recommended"]);
		dObj.appendChild(header);
		findRecShows(dObj);
	}
	
	function findRecShows(dObj) {
		var category_id = getMetaValue('category_id');
		var todayObj = new Date();
		var dateParam = datePart('yyyy',todayObj) + hasZero(datePart('m',todayObj)) + hasZero(datePart('d',todayObj));
		var url = '/ajax/data/'+getMetaValue('siteIdentifier')+'/'+category_id+'Property.xml';
		var rec_shows = "";
		new Ajax.Request(url, 
							{ 
								method:'POST', parameters:'&nC'+noCache(), 
								onFailure: function(err) {dObj.innerHTML="";},
								onSuccess: function(xml) {
									getRecShows(dObj, xml, 3, category_id);
								}
							});
	}
	
	function getRecShows(dObj, xml, max_rec_shows, id) {

		var firstNode = get_firstchild(xml.responseXML.documentElement);
		var rec_list = "";
		if (firstNode) {
			var showslist = xml.responseXML.getElementsByTagName(firstNode.nodeName);
			var random_indices = [];
			if (showslist.length > 3) { // get random shows
				var counter = max_rec_shows;
				var x = "";
				while (counter) {
					var random = Math.floor(Math.random() * showslist.length);
					if (counter != 1) random += ",";
					if (x.indexOf(random) == -1) {
						x += random;
						--counter;
					}
				}
				if (x) {
					random_indices = x.split(",");
				}				
			} else {
				random_indices = new Array(showslist.length);
				for (var i = 0; i < random_indices.length; i++)
					random_indices[i] = i;
			}
			for (var i = 0; i < random_indices.length; i++) {
				rec_list = (i == 0)? Builder.node('dl', {className:'no-border'}): Builder.node('dl');
				var j = random_indices[i];
				var display_name = getNodeValueByChildName(showslist[j],'display_name');
				var shows_page = '/'+getNodeValueByChildName(showslist[j], 'short_name')+'/';
				var program_link = Builder.node('a', {href:shows_page}, [display_name]);
				rec_list.appendChild(Builder.node('dt', [program_link]));
				var thumbnail = Builder.node('img', {src:getNodeValueByChildName(showslist[j],'default_tn')});
				var thumbnail_link = Builder.node('a', {href:shows_page}, [thumbnail]);
				rec_list.appendChild(Builder.node('dd', {className:'pic'}, [thumbnail_link]));
				rec_list.appendChild(Builder.node('dd', {className:'description'}, getNodeValueByChildName(showslist[j],'default_description')));
				var more_link = Builder.node('a', {href:shows_page}, [Builder.node('strong', ["More"])]);
				var img_link = Builder.node('a', {href:shows_page, className:'more-img-link'}, [Builder.node('span',["More Image"])]);
				rec_list.appendChild(Builder.node('dd', {className:'more'}, [more_link, " ", img_link]));
				dObj.appendChild(rec_list);
			}
		} else {
			dObj.innerHTML = "";
		}

	}
	