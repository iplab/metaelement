/*
 * On Now Demandlet
 */
	function initiate_onNow(dObj) {
		var itemId = demandletManager.setup(dObj);
		var onNowHeader = Builder.node('h3', {id:'on-now-header'});
		var timezone = getMetaValue('defaultTimeZone');
		var max_shows = 3;
		onNowHeader.appendChild(Builder.node('span', {className:'on-now-text'}, ['On Now In...']));
		onNowHeader.appendChild(Builder.node('span', {className:'on-now-country'}, [getMetaValue('siteCountry')]));
		onNowHeader.appendChild(Builder.node('a', {href:"#", onclick:'changeCountry();return false;', className:'change-country'}, [Builder.node('span',["Change Country Button"])]));
		dObj.appendChild(onNowHeader);
		getServerTime();
		var now = new Date(server_time);
		if (!now) return false;
		var local_now = convertTimeZone(now, timezone);
		var dateParam = datePart('yyyy',local_now) + hasZero(datePart('m',local_now)) + hasZero(datePart('d',local_now));
		new Ajax.Request(
			'/ajax/data/'+getMetaValue('siteIdentifier')+'/'+dateParam+'.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:function(err) {},
				onSuccess:function(xml) {
								var firstNode = get_firstchild(xml.responseXML.documentElement);
								var showslist = xml.responseXML.getElementsByTagName(firstNode.nodeName);
								if (showslist.length) {
									var program_list = Builder.node('ol');
									var first = findShowOnNow(local_now, showslist, timezone);
									var end = (first + max_shows > showslist.length)?showslist.length:first+max_shows;
									for (var i = first; i < end; i++) {
										program_list.appendChild(createListForShow(showslist[i], timezone));
									}
									if (end-first != max_shows) {
										var local_tom = dateAdd('d', 1, local_now);
										var tom_dateParam = datePart('yyyy', local_tom) + hasZero(datePart('m',local_tom)) + hasZero(datePart('d',local_tom));
										var tom_url = '/ajax/data/'+getMetaValue('siteIdentifier')+'/'+tom_dateParam+'.xml';
										new Ajax.Request(tom_url, {
															method:'POST', 
															parameters:'&nC'+noCache(),
															onFailure:function(err) {}, 
															onSuccess:function(xml) {
																			var tom_firstNode = get_firstchild(xml.responseXML.documentElement);
																			var tom_showslist = xml.responseXML.getElementsByTagName(tom_firstNode.nodeName);
																			if (tom_showslist.length) {
																				var tom_first = findShowOnNow(local_now, tom_showslist, timezone);
																				if (tom_first > -1) {
																					var shows_left = max_shows-(end-first);
																					while (shows_left--) {
																						program_list.appendChild(createListForShow(tom_showslist[tom_first++], timezone));
																					}
																				}
																			}
																	}	
															}
										);
									}
							}
							dObj.appendChild(program_list);
				}
			}
		);
	};
	
	function changeCountry() {
		var loc = document.location.href.split('://');
		var sitehost = loc[1].split('/')[0];
		eraseCookie('defaultSite');
		document.location.href = loc[0]+'://'+sitehost;
	}
	
	function findShowOnNow(time, shows_list, tz) {
		var index = -1;
		for (var i = 0; i < shows_list.length; i++) {
			var showtime = createDateObj(getNodeValueByChildName(shows_list[i],'program_date_time'));
			var local_showtime = convertTimeZone(showtime, tz);
			if (dateDiff('s', time, local_showtime) == 0) { 
				index = i;
				break;
			} else if (time < local_showtime) { 
				index = (i-1==-1)?0:i-1;
				break;
			}
		}
		if (i == shows_list.length) {
			index = i-1;
		} 
		return index;
	}
	
	function createListForShow(show, tz) {
		var showtime = createDateObj(getNodeValueByChildName(show,'program_date_time'));
		var local_showtime = parseDateObj(convertTimeZone(showtime, tz));
		var short_name = getNodeValueByChildName(show, 'short_name');
		var first_span = Builder.node('span', {className:'show-time'}, [local_showtime['hour']+":"+local_showtime['minute']]);
		var second_span = Builder.node('span', {className:'program-name'}, [getNodeValueByChildName(show,'program_title')]);
		if (short_name.length) {
			var path = "/"+short_name+"/";
			var link = Builder.node('a', {href:path}, [second_span]);
			return Builder.node('li', [first_span, " ", link]);	
		} 
		return Builder.node('li', [first_span, " ", second_span]);
	}