/*
 *  On Tonight
 */

	function initiate_onTonight(dObj) {
		var itemId 		= demandletManager.setup(dObj);
		getServerTime();
		var now = new Date(server_time);
		if (!now) return false;
		var timezone = getMetaValue('defaultTimeZone');
		var local_now = convertTimeZone(now, timezone);
		
		var currentDay	= local_now.getDay();
		var dayLabels	= ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		var dayCounter  = 0;

		var start = (dObj.attributes['start_time']) ? dObj.attributes['start_time'].value : "20:00:00";
		var duration = (dObj.attributes['duration']) ? dObj.attributes['duration'].value : 180;
		local_now.setHours(start.split(":")[0]);
		local_now.setMinutes(start.split(":")[1]);
		local_now.setSeconds(start.split(":")[2]);
		
		dObj.appendChild(Builder.node('h3', ['On Tonight...']));
		dObj.appendChild(Builder.node('ol',{className:'tabs'}));
	    $$('.tabs').each(function(tab) {
			if(tab.parentNode.id==dObj.id) {
				for(i=currentDay;i<7;i++) {
					var tabDateString	= dateAdd('d', dayCounter, local_now);
					var tabLI			= Builder.node('li',[Builder.node('a',{href:'#' + dObj.id+i},[ dayLabels[i] ])]);
					tab.appendChild(tabLI);
					dObj.appendChild(Builder.node('div',{date:tabDateString,id:dObj.id+i},['Loading...']));
					dayCounter++;
				}
				for(i=0;i<currentDay;i++) {
					var tabDateString	= dateAdd('d', dayCounter, local_now);
					var tabLI			= Builder.node('li',[Builder.node('a',{href:'#' + dObj.id+i},[ dayLabels[i] ])]);
					tab.appendChild(tabLI);
					dObj.appendChild(Builder.node('div',{date:tabDateString,id:dObj.id+i},['Loading...']));
					dayCounter++;
				}
			}
	    });
		var sched_link = Builder.node('a', {href:"/tvschedule", className:"view-full"}, ["View Full Schedule "]);
		var img_link = Builder.node('a', {href:"/tvschedule", className:"view-full-img"}, [Builder.node('span', ["Arrow Image"])]); 
		dObj.appendChild(sched_link);
		dObj.appendChild(img_link);
		new Control.Tabs(dObj,{
		    afterChange: function(control_tabs_instance,new_container) {
		        load_tonightData(control_tabs_instance.activeContainer, duration, timezone)
		    },
		    autoLinkExternal: true
		});
	};
	
	function load_tonightData(tabObj, duration, tz) {
		var tab_date = createDateObj(tabObj.attributes['date'].value);
		var start_prime = new Date(tab_date);
		var end_prime = new Date(dateAdd('n', duration, start_prime));
		var remote_date = convertToGMT(start_prime, tz);
		var dateParam = datePart('yyyy',remote_date)+hasZero(datePart('m',remote_date))+hasZero(datePart('d',remote_date));
		if (tabObj.innerHTML.toLowerCase().indexOf('loading...') > -1) {
			new Ajax.Request('/ajax/data/'+getMetaValue('siteIdentifier')+'/'+dateParam+'.xml',{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:function(err){tabObj.innerHTML = '<p>Premieres 29 July noon</p>';},
				onSuccess:function(xml){ 
					tabObj.innerHTML = "";
					var firstNode = get_firstchild(xml.responseXML.documentElement);
					var today_showslist = xml.responseXML.getElementsByTagName(firstNode.nodeName);
					if (today_showslist.length) {
						var program_list = Builder.node('ol');
						var begin = findShow(start_prime, today_showslist, tz);
						var end = findShow(end_prime, today_showslist, tz);	
						var tom_showslist = null;
						if (begin == -1 || end == -1) {
							var nextday = dateAdd('d', 1, remote_date);
							dateParam = datePart('yyyy',nextday)+hasZero(datePart('m',nextday))+hasZero(datePart('d',nextday));	
							var url = '/ajax/data/'+getMetaValue('siteIdentifier')+'/'+dateParam+'.xml';
							new Ajax.Request(url, {
													method:'POST',
													parameters:'&nC'+noCache(),
													onFailure:function(err){tabObj.innerHTML = '<p>No Data Available.</p>';},
													onSuccess:function(xml) {
														var firstNode = get_firstchild(xml.responseXML.documentElement);
														tom_showslist = xml.responseXML.getElementsByTagName(firstNode.nodeName);
														if (tom_showslist) {
															if (begin > -1 && end == -1) {
																for (var i = begin; i < today_showslist.length; i++) {
																	program_list.appendChild(createListForShow(today_showslist[i], tz));
																}
																end = findShow(end_prime, tom_showslist, tz);
																for (var j = 0; j < end; j++) {
																	program_list.appendChild(createListForShow(tom_showslist[j], tz));
																}
															} else if (begin == -1) {
																begin = findShow(start_prime, tom_showslist, tz);
																end = findShow(end_prime, tom_showslist, tz);
																for (var i = begin; i < end; i++) { 
																	program_list.appendChild(createListForShow(tom_showslist[i], tz));
																}
															}
														}
														while (program_list.getElementsByTagName("li").length > 4) {
															program_list.removeChild(program_list.lastChild);
														} 
														$(tabObj).appendChild(program_list);	
													}
												});
							
						} else {
							for (var i = begin; i < end; i++) {
								program_list.appendChild(createListForShow(today_showslist[i], tz));
							}
							while (program_list.getElementsByTagName("li").length > 4) {
								program_list.removeChild(program_list.lastChild);
							} 
							$(tabObj).appendChild(program_list);
						}
					} else tabObj.innerHTML="<p>Premieres 29 July noon</p>";
				}
			});
		}
	};
	
	function findShow(time, shows_list, tz) {
		for (var i = 0; i < shows_list.length; i++) {
			var showtime = createDateObj(getNodeValueByChildName(shows_list[i],'program_date_time'));
			var local_showtime = convertTimeZone(showtime, tz);
			if (dateDiff('s', time, local_showtime) == 0 || time < local_showtime) { // time now and current showtime matches
				return i;
			}
		}
		return -1;  // time now has passed the times for all show on that day, get next day
	}
	
	function createListForShow(show, tz) {
		var showtime = createDateObj(getNodeValueByChildName(show,'program_date_time'));
		var local_showtime = parseDateObj(convertTimeZone(showtime, tz));
		var category_id = getNodeValueByChildName(show, 'category_id');
		var first_span = Builder.node('span', {className:'show-time'}, [local_showtime['hour']+":"+local_showtime['minute']]);
		var second_span = Builder.node('span', {className:'program-name'}, [getNodeValueByChildName(show,'program_title')]);
		if (category_id.length > 0) {
			var short_name = getNodeValueByChildName(show, 'short_name');
			var path = "/"+short_name+"/";
			var link = Builder.node('a', {href:path}, [second_span]);
			return Builder.node('li', [first_span, " ", link]);	
		} 
		return Builder.node('li', [first_span, " ", second_span]);
	}