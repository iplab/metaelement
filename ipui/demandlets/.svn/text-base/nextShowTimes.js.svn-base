/*
 * nextShowTimes.js
 */

 	function initiate_nextShowTimes(dObj) {
		loadNextShowTimes(dObj);
	}
	
	function createReminderLink(title, episode, date_str, schedule_id) {
		return Builder.node('a', {href:'#', onclick:"open_ReminderPopup('"+escape(title)+"', '"+escape(episode)+"', '"+date_str+"', '"+schedule_id+"');this.blur();return false;"}, [Builder.node('span', {className:'reminder'}, ["reminder"])]);
	}
	
	function loadNextShowTimes(dObj) {
		var url = '/ajax/tvscheduleProcess.jsp';
		var site_country = getMetaValue('siteCountry');
		var category_id = getMetaValue('category_id');
		var timezone = getMetaValue('defaultTimeZone');
		var count = 3;
		var params = "";
		params += '&category_id='+category_id;
		params += '&count='+count;
		
		new Ajax.Request(url, 
							{ 
								method: 'POST',	parameters: '&nC'+noCache()+params,
								onFailure: function(err) {dObj.innerHTML=""}, 
								onSuccess: function(xml) {
									var firstNode = get_firstchild(xml.responseXML.documentElement);
									if (firstNode.nodeName != "response" && getNodeValue(firstNode) != "failure") {
										var header = Builder.node('h3');
										header.innerHTML = "<p>Next Show Time in <span>" + site_country + 
															"</span></p><a class='change-country'; href='/index.html'><span>Change Country</span></a>";
										dObj.appendChild(header);
										var showtitle = firstNode.firstChild.nodeValue; 
										var show_schedule = xml.responseXML.getElementsByTagName(firstNode.nextSibling.nodeName);
										dObj.appendChild(getShowDates(show_schedule, 3, timezone, showtitle));
									} else {
										dObj.innerHTML = "";
									}
								}
							});
							
	}
	
	function getShowDates(showslist, shows_left, tz, title) {
		var program_list = Builder.node('ol');
		var i = 0;
		while (shows_left > 0 && i < showslist.length) {
			var showdate = createDateObj(getNodeValueByChildName(showslist[i], 'program_date_time'));
			var schedule_id = getNodeValueByChildName(showslist[i], 'schedule_id');
			var episode = getNodeValueByChildName(showslist[i], 'episode');
			var dateObj = convertTimeZone(showdate, tz);
			var local = parseDateObj(dateObj);
			var date_str = monthName(dateObj, false) + " " + local['day'] + " " + local['hour'] + ":" + local['minute'];
			var first_span = Builder.node('span', {className:'time-date'}, [date_str]);
			program_list.appendChild(Builder.node('li', [first_span, " ", createReminderLink(title, episode, date_str, schedule_id)]));
			--shows_left; 
			++i;
		}
		return program_list;
	}