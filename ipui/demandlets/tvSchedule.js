/*
 * TV Schedule Demandlet
 */
	
	function initiate_tvSchedule(dObj) {
		var itemId = demandletManager.setup(dObj);
		dObj.innerHTML = '';
		if (!dObj.view)  dObj.view = "list";
		if (!dObj.start) dObj.start = 0;
		if (!dObj.duration) dObj.duration = 24*60;
		var tz = getMetaValue('defaultTimeZone');
		var local_date = setStartTime(getLocalDate(tz), dObj.start);
		var label_id  = (dObj.view=='grid')?'menu_hour':'menu_day';
		dObj.appendChild(Builder.node('ol', {id:label_id,className:'tabs clearfix'}));
		var day_tabs = createTabs(dObj, local_date, tz);
	};
	
	function gotoDate(dObj, date) {
		var tz = getMetaValue('defaultTimeZone');
		if (dObj.view == 'grid') {
			var label_id = 'menu_hour';
		} else {
			var label_id = 'menu_day';
			if (dObj.view == 'none') {
				dObj.view = 'list';
			}
		}
		var label_id  = (dObj.view=='grid')?'menu_hour':'menu_day';
		if (!dObj.start) dObj.start = 0;
		var goto_date = setStartTime(date, dObj.start);
		dObj.innerHTML = '';
		dObj.appendChild(Builder.node('ol', {id:label_id,className:'tabs clearfix'}));
		var day_tabs = createTabs(dObj, goto_date, tz);
	};
	
	function changeViewLayout(dObj, mode) {
		var itemId = dObj.id
		if (dObj.view == 'list' && mode == 'detail') {
			dObj.view = 'detail';
			var tables = $$('.tvsched_list');
			for (var i = 0; i < tables.length; i++) {
				tables[i].className = 'tvsched_detail';
			}
			$$('.description').invoke('show');
		} else if (dObj.view == 'detail' && mode == 'list') {
			dObj.view = 'list';
			var tables = $$('.tvsched_detail');
			for (var i = 0; i < tables.length; i++) {
				tables[i].className = 'tvsched_list';
			}
			$$('.description').invoke('hide');
		} else if (dObj.view != mode) {
			dObj.view = mode;
			dObj.innerHTML = "";
			var tz = getMetaValue('defaultTimeZone');
			var local_date = setStartTime(getLocalDate(tz), dObj.start);
			var label_id  = (dObj.view=='grid')?'menu_hour':'menu_day';
			dObj.appendChild(Builder.node('ol', {id:label_id,className:'tabs clearfix'}));
			var tabs = createTabs(dObj, local_date, tz);
		}
	};
	
	function changeSchedRange(dObj, range) {
		if (range == 'primetime') {
			dObj.start = 20*60;
			dObj.duration = 3*60;
		} else {
			dObj.start = 0;
			dObj.duration = 24*60;
		}
		var active = getActiveSched(dObj);
		if (!active) {
			if (dObj.view != 'list') 
				dObj.view = 'list';
			initiate_tvSchedule(dObj);
		} else {
			if (dObj.view != "grid") {
				var table = $(active);
				load_tvScheduleData(table);
			}
		}
	};
	
	function viewSchedByShow(dObj, cat_id) {
		params='&category_id='+cat_id+'&count=101';
		dObj.innerHTML = '';
		dObj.view = 'none';
		new Ajax.Request(
			'/ajax/tvscheduleProcess.jsp', { 
			method:'POST',
			parameters:'&nC'+noCache()+params,
			onFailure: function(err){},
			onSuccess: function(xml) {
							var firstNode = get_firstchild(xml.responseXML.documentElement);
							if (firstNode.nodeName != "response" && getNodeValue(firstNode) != "failure") {
								removeDisplayDate();
								var tz = getMetaValue('defaultTimeZone');
								var now_local = getLocalDate(tz);
								var prog_title = firstNode.firstChild.nodeValue; 
								var showslist = xml.responseXML.getElementsByTagName(firstNode.nextSibling.nodeName);
								var cur_month = -1;
								var cur_day = -1
								var oddeven = 'odd';
								var tbody = Builder.node('tbody');
								var tab = Builder.node('table', {id:'tvsched_show'}, [tbody]);
								dObj.appendChild(tab);
								for (var i = 0; i < showslist.length; i++) {
									var reminder = false;
									var showdate = createDateObj(getNodeValueByChildName(showslist[i], 'program_date_time'));
									var episode = getNodeValueByChildName(showslist[i], 'episode');
									var localdate = convertTimeZone(showdate, tz);
									if (localdate.getMonth() != cur_month || localdate.getDate() != cur_day) {
										cur_month = localdate.getMonth();
										cur_day = localdate.getDate();
										var header = Builder.node('th', {colspan:'3'}, [weekdayName(localdate, false), ' ', 
																						monthName(localdate, false), ' ', 
																						localdate.getDate(), ', ', 
																						localdate.getFullYear()]);
										header.colSpan=3; // play nice with ie6
										tbody.appendChild(Builder.node('tr', [header]));
										oddeven = 'odd';										
									}
									if (oddeven.length > 0) {
										var row = Builder.node('tr', {className: oddeven});
										oddeven='';
									} else {
										var row = Builder.node('tr');
										oddeven='odd';
									}
									row.appendChild(Builder.node('td', {className:'time'}, [hasZero(localdate.getHours()),':',hasZero(localdate.getMinutes())]));
									row.appendChild(Builder.node('td', {className:'show'}, [prog_title, '-', episode]));
									var options = Builder.node('td', {className:'options'});
									if (now_local < localdate && dateDiff('n', now_local, localdate) > 120) {
										reminder = true;
									}				
									var optionslist = createOptionsList2(showslist[i], localdate, reminder, prog_title);
									if (optionslist.getElementsByTagName('li').length) {
										options.appendChild(optionslist);
									}
									row.appendChild(options);
									tbody.appendChild(row);
								}
							}
						}
			});
	};
	
	function viewSchedBySearch(dObj, keysearch) {
		params='&site_id='+getMetaValue('siteIdentifier')+'&val='+keysearch;
		dObj.innerHTML = '';
		dObj.view = 'none';
		new Ajax.Request(
			'/ajax/searchTvschedule.jsp', { 
			method:'POST',
			parameters:'&nC'+noCache()+params,
			onFailure: function(err){},
			onSuccess: function(xml) {
							var firstNode = get_firstchild(xml.responseXML.documentElement);
							if (firstNode.nodeName != "response" && getNodeValue(firstNode) != "failure") {
								removeDisplayDate();
								var tz = getMetaValue('defaultTimeZone');
								var now_local = getLocalDate(tz);
								var firstNode = get_firstchild(xml.responseXML.documentElement);
								var showslist = xml.responseXML.getElementsByTagName(firstNode.nodeName);
								if (!showslist.length || showslist[0].nodeName == 'xml') {
									dObj.appendChild(Builder.node('p', {className:'no-results'}, ['Sorry no results were found.']));
									return false;
								}
								var tab = Builder.node('table', {id:'tvsched_show'});
								var tbody = Builder.node('tbody');
								tab.appendChild(tbody);
								dObj.appendChild(tab);
								var cur_month = -1;
								var cur_day = -1
								var oddeven = 'odd';
								for (var i = 0; i < showslist.length; i++) {
									var reminder = false;
									var prog_title = getNodeValueByChildName(showslist[i], 'program_title');
									var showdate = createDateObj(getNodeValueByChildName(showslist[i], 'program_date_time'));
									var episode = getNodeValueByChildName(showslist[i], 'episode');
									var localdate = convertTimeZone(showdate, tz);
									if (localdate.getMonth() != cur_month || localdate.getDate() != cur_day) {
										cur_month = localdate.getMonth();
										cur_day = localdate.getDate();
										var header = Builder.node('th', {colspan:'3'}, [weekdayName(localdate, false), ' ', 
																						monthName(localdate, false), ' ', 
																						localdate.getDate(), ', ', 
																						localdate.getFullYear()]);
										header.colSpan = 3;
										tbody.appendChild(Builder.node('tr', [header]));
										oddeven = 'odd';										
									}
									if (oddeven == 'odd') {
										var row = Builder.node('tr', {className: oddeven});
										oddeven='';
									} else {
										var row = Builder.node('tr');
										oddeven='odd';
									}
									row.appendChild(Builder.node('td', {className:'time'}, [hasZero(localdate.getHours()),':',hasZero(localdate.getMinutes())]));
									row.appendChild(Builder.node('td', {className:'show'}, [prog_title, '-', episode]));
									var options = Builder.node('td', {className:'options'});
									if (now_local < localdate && dateDiff('n', now_local, localdate) > 120) {
										reminder = true;
									}
									var optionslist = createOptionsList2(showslist[i], localdate, reminder, prog_title);										
									if (optionslist.getElementsByTagName('li').length) {
										options.appendChild(optionslist);
									}
									row.appendChild(options);
									tbody.appendChild(row);
								}
							}
						}
			});
		
	};
	
	function createTabs(dObj, start_date, tz) {
		if (dObj.view == 'grid') {
			var tab_labels =  ['00:00-04:00','04:00-08:00','08:00-12:00','12:00-16:00','16:00-20:00', '20:00-00:00'];
			$$('.tabs').each(function(tab) {
				if (tab.parentNode.id == dObj.id) {
					for (var i = 0; i < tab_labels.length; i++) {
						var mins = i*4;
						var tabLI = Builder.node('li',[Builder.node('a', {href:'#'+dObj.id+i, minutes:mins}, [tab_labels[i]])]);
						tab.appendChild(tabLI);
						dObj.appendChild(Builder.node('div',
														{date:start_date, duration:dObj.duration, time:tab_labels[i].split('-')[0], id:dObj.id+i, className:'tvsched_'+dObj.view}, 
														[Builder.node('span', {className:'loading'}, ["Loading..."])]));
					}
				}
			});
		} else {
			var tab_labels = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			var current_day = start_date.getDay();
			var dayCounter = 0;
			$$('.tabs').each(function(tab) {
				if (tab.parentNode.id == dObj.id) {
					for (var i = current_day; i < 7; i++) {
						var tabDateString = dateAdd('d', dayCounter, start_date);
						var tabLI = Builder.node('li',[Builder.node('a', {href:'#'+dObj.id+i}, [ tab_labels[i] ])]);
						tab.appendChild(tabLI);
						dObj.appendChild(Builder.node('table',{date:tabDateString, duration:dObj.duration, id:dObj.id+i, 
														className:'tvsched_'+dObj.view}, [Builder.node('span', {className:'loading'}, ["Loading..."])]));
						dayCounter++;
					}
					for (var i = 0; i < current_day; i++) {
						var tabDateString = dateAdd('d', dayCounter, start_date);
						var tabLI = Builder.node('li',[Builder.node('a', {href:'#'+dObj.id+i}, [ tab_labels[i] ])]);
						tab.appendChild(tabLI);
						dObj.appendChild(Builder.node('table',{date:tabDateString, duration:dObj.duration, id:dObj.id+i, 
														className:'tvsched_'+dObj.view}, [Builder.node('span', {className:'loading'}, ["Loading..."])]));
						dayCounter++;
					}
				}
	   		}); 
		}
		return new Control.Tabs(dObj, { afterChange: function(control_tabs_instance, new_container) {load_tvScheduleData(control_tabs_instance.activeContainer)}, 
										autoLinkExternal: true });
	};	
	
	function load_tvScheduleData(tabObj) {
		if (tabObj.innerHTML.toLowerCase().indexOf('loading...') > -1 
			|| tabObj.parentNode.duration != tabObj.attributes['duration'].value) {
			if (tabObj.parentNode.start < 0 || tabObj.parentNode.duration <= 0) return false;
			while (tabObj.childNodes.length) {
				tabObj.removeChild(tabObj.firstChild);
			}
			var start_date = new Date(tabObj.attributes['date'].value);
			if (tabObj.parentNode.view != 'grid') {
				tabObj.attributes['duration'].value = tabObj.parentNode.duration;
				tabObj.attributes['date'].value = setStartTime(start_date, tabObj.parentNode.start);
			}
			start_date = new Date(tabObj.attributes['date'].value);
			var tz = getMetaValue('defaultTimeZone');
			var now_date = getLocalDate(tz);			
			displayDate(start_date, tabObj.parentNode);
			if (tabObj.parentNode.view == 'grid') {
				var grid_hours = Builder.node('ul', {id:'grid_hours'});
				tabObj.appendChild(grid_hours);
				var start_time = tabObj.attributes['time'].value.split(':');
				createGridHeader(grid_hours, start_time[0]*60 + start_time[1]*1);
				var grid_days = Builder.node('ul', {id:'grid_days'});
				tabObj.appendChild(grid_days);
			} 
			var num_days=(tabObj.parentNode.view == 'grid')?7:1;
			for (var i = 0; i < num_days; i++) { 
				var render_date = dateAdd('d', i, start_date);
				var date_param = datePart('yyyy',render_date)+hasZero(datePart('m',render_date))+hasZero(datePart('d',render_date));
				if (tabObj.parentNode.view == 'grid') {
					grid_days.appendChild(createRow(render_date, tabObj.attributes['time'].value));
				}
				if (dateDiff('d', now_date, render_date) > 30) {
					var url = '/ajax/tvScheduleProcess.jsp';
					params = '&date='+date_param;
				} else {
					var url	= '/ajax/data/'+getMetaValue('siteIdentifier')+'/'+date_param+'.xml';
					params = '';	
				}
				new Ajax.Request(url, {
										method:'POST',
										parameters:'&nC'+noCache()+params,
										onFailure:function(err) {tabObj.innerHTML = 'No Data Available';},
										onSuccess:function(xml) { 
											var firstNode = get_firstchild(xml.responseXML.documentElement);
											var shows = xml.responseXML.getElementsByTagName(firstNode.nodeName);
											if (shows.length > 0) {
												if (tabObj.parentNode.view != 'grid') {
													var begin = findTvShow(render_date, shows, tz);
													var end_day = dateAdd('n', tabObj.parentNode.duration, render_date);
													var end = findTvShow(end_day, shows, tz);
													var shows_data = getShowData(begin, end, shows);
													var tbody = Builder.node('tbody');
													tabObj.appendChild(tbody);
													tbody.appendChild(createListHeader());	
													createListSchedule(tbody, shows_data, tz);
													if (tabObj.parentNode.view == 'detail') {
														$$('.description').invoke('show');
													}
												} else if (tabObj.parentNode.view == 'grid') {
													var remote_date = createDateObj(getNodeValueByChildName(shows[0],'program_date_time'));
													var local_date = convertTimeZone(remote_date, tz);
													local_date.setHours(start_time[0]);
													local_date.setMinutes(start_time[1]);
													var max_hours = 4;
													var start_index = findTvShow(local_date, shows, tz);
													var end_index = findTvShow(dateAdd('h', max_hours, local_date), shows, tz);
													var shows_data = getShowData(start_index, end_index, shows);
													var row_id = getRowId(local_date, tabObj.attributes['time'].value);										
													createGridSchedule($(row_id), shows_data, local_date, tz, max_hours);
												}
											}
										}
									}
								);
			}
		}
			
	};
	
	function getShowData(start, end, list) {
		var showdata = new Array(end-start);
		var j = 0;
		if (end > list.length) {
			end = list.length;
		}
		for (var i = start; i < end; i++) { 
			showdata[j] = new Object();
			showdata[j]['program_date_time'] = getNodeValueByChildName(list[i],'program_date_time');
			var showdate_obj = new Date(getNodeValueByChildName(list[i],'program_date_time'));
			if (i+1 < list.length) {
				var nextshowdate_obj = new Date(getNodeValueByChildName(list[i+1],'program_date_time'));
				showdata[j]['duration'] = dateDiff('n', showdate_obj, nextshowdate_obj);
			} else {
				showdata[j]['duration'] = 30;
			}
			showdata[j]['category_id'] = getNodeValueByChildName(list[i],'category_id');
			showdata[j]['program_title'] = getNodeValueByChildName(list[i],'program_title');
			showdata[j]['program_description'] = getNodeValueByChildName(list[i],'program_description');
			showdata[j]['program_duration']	= getNodeValueByChildName(list[i],'program_duration');
			showdata[j]['episode'] = getNodeValueByChildName(list[i],'episode');
			showdata[j]['short_name'] = getNodeValueByChildName(list[i],'short_name');
			showdata[j]['default_video_link'] = getNodeValueByChildName(list[i],'default_video_link');
			showdata[j]['schedule_id'] = getNodeValueByChildName(list[i],'schedule_id');
			showdata[j]['genre'] = getNodeValueByChildName(list[i],'genre');
			
			++j;
		}
		return showdata;
	};
	
	function createGridSchedule(li, showdata, startdate, tz, max_hours) {
		if (showdata.length) {
			var total_offset = 0;
			var cur_width = 0;
			for (var i = 0; i < showdata.length; i++) {
				if (showdata[i]['short_name'].length) {
					var link = Builder.node('a', {href:'/'+showdata[i]['short_name']+'/'}, [showdata[i]['program_title']]);
					var show_info = Builder.node('div', [Builder.node('span', [link])]);
				} else {
					var show_info = Builder.node('div', [Builder.node('span', [showdata[i]['program_title']]) ]);
				}
				if (i == 0) {
					var diff = dateDiff('n', convertTimeZone(createDateObj(showdata[i]['program_date_time']), tz), startdate);
					if (diff == 0) {
						show_info.style.left = 0;
						total_offset = showdata[i]['duration'] / (max_hours*60) * 100;
						show_info.style.width = total_offset +'%';
					} else {
						var filler = Builder.node('div');
						total_offset  = (Math.abs(diff) / (max_hours*60)) * 100;
						filler.style.left = 0;
						filler.style.width = total_offset+'%';
						li.appendChild(filler);						
						cur_width = showdata[i]['duration'] / (max_hours*60) * 100;
						show_info.style.left = total_offset + '%';
						show_info.style.width = cur_width + '%';
						total_offset = total_offset + cur_width;
					}
				} else if (i == showdata.length-1) {
					show_info.style.left = total_offset + '%';
					cur_width = showdata[i]['duration'] / (max_hours*60) * 100;
					if (total_offset + cur_width > 100) {
						show_info.style.width = 100-total_offset + '%';
					} else {
						show_info.style.width = cur_width +'%';
					}
				} else {
					show_info.style.left = total_offset + '%';
					cur_width = showdata[i]['duration'] / (max_hours*60) * 100;
					show_info.style.width = cur_width + '%';
					total_offset = total_offset + cur_width;
				}
				li.appendChild(show_info);
			}
		}
	};
	
	function createListSchedule(container, showdata, timediff) {
		if (showdata.length) {
			var reminder = false;
			var now_local = getLocalDate(timediff);
			var oddeven = 'odd';
			for (var i = 0; i < showdata.length; i++) {
				var program_date_time	= showdata[i]['program_date_time'];
				var remote = createDateObj(program_date_time);
				var local = convertTimeZone(remote, timediff);
				var x = parseDateObj(local);
				if (now_local < local && dateDiff('n', now_local, local) > 120) {
					reminder = true;
				}
				var show = Builder.node('tr');
				if (oddeven == 'odd') {
					show.className = 'odd';
					oddeven = '';
				} else {
					oddeven = 'odd';
				}				
				show.appendChild(Builder.node('td', {className:'time'}, [x['hour']+":"+x['minute']]));
				var link = "";
				if (showdata[i]['short_name'].length) {
					var path = '/'+showdata[i]['short_name']+'/';
					if (showdata[i]['episode'].length) {
						link = Builder.node('a', {href:path}, [showdata[i]['program_title']]);
					} else {
						link = Builder.node('a', {href:path}, [showdata[i]['program_title']]);
					}
					show.appendChild(Builder.node('td', {className:'show'}, [link]));
				} else {
					if (showdata[i]['episode'].length) {
						show.appendChild(Builder.node('td', {className:'show'}, [showdata[i]['program_title']]));
					} else {
						show.appendChild(Builder.node('td', {className:'show'}, [showdata[i]['program_title']]));
					}	
				}
				show.appendChild(Builder.node('td', {className:'genre'}, [showdata[i]['genre']]));
				var options = createOptionsList(showdata[i], local, reminder);
				if (options.getElementsByTagName('li').length) {
					show.appendChild(Builder.node('td', {className:'options'}, [options]));
				} else {
					show.appendChild(Builder.node('td', {className:'options'}));
				}
				container.appendChild(show);
				var desc_rec = Builder.node('tr', {className:'description'});
				desc_rec.style.display='none';
				var desc = Builder.node('p', [showdata[i]['program_description']]);
				desc_rec.appendChild(Builder.node('td'));
				desc_rec.appendChild(Builder.node('td', [desc]));
				desc_rec.appendChild(Builder.node('td'));
				desc_rec.appendChild(Builder.node('td'));
				container.appendChild(desc_rec);
			}
			
		}
	};
	
	function createListHeader() {
		var time_title = Builder.node('th', {className:'time'}, ["Time"]);
		var show_title = Builder.node('th', {className:'show'}, ["Show Title & Description"]);
		var genre_title = Builder.node('th', {className:'genre'}, ["Genre"]);
		var option_title = Builder.node('th', {className:'options'});
		
		return Builder.node('tr', [time_title, show_title, genre_title, option_title]);
	};
	
	function createGridHeader(container, starttime) {
		var hr = Math.floor(starttime/60);
		var mins = hasZero(starttime%60);
		var hh_width = (30/(4*60))*100;
		var total_offset = 0;
		for (var i = 0; i < 4; i++) {
			var top_half = Builder.node('li', [hasZero(hr+i)+':'+'00']);
			top_half.style.left = total_offset+'%';
			top_half.style.width = hh_width + '%';
			total_offset += hh_width;
			container.appendChild(top_half);
			var bot_half = Builder.node('li', [hasZero(hr+i)+':'+'30']);
			bot_half.style.left = total_offset+'%';
			bot_half.style.width = hh_width + '%';
			total_offset += hh_width;
			container.appendChild(bot_half);
		}
	};
	
	function findTvShow(time, shows_list, tz) {
		var index = 0;
		for (var i = 0; i < shows_list.length; i++) {
			var showtime = createDateObj(getNodeValueByChildName(shows_list[i],'program_date_time'));
			var local_showtime = convertTimeZone(showtime, tz);
			if (time < local_showtime || dateDiff('s', time, local_showtime) == 0) {
				 index = i;
				 break;
			}
		}
		if (i == shows_list.length) 
			index = shows_list.length;
		return index;
	};
	
	function getActiveSched() {
		if ($$('.active').length) {
			var id = $$('.active')[0].href.split('#')[1];
			return id;
		} else return false;
	};
	
	function setStartTime(d, total_mins) {
		var newDate = new Date(d);
		newDate.setHours(Math.floor(total_mins/60));
		newDate.setMinutes(total_mins%60);
		newDate.setSeconds(0);
		return newDate;
	};
	
	function getLocalDate(tz) {
		getServerTime();
		var remote_date = new Date(server_time);
		return convertTimeZone(remote_date, tz);
	};
	
	function createRow(dateObj, start_time) {
		var date_id = getRowId(dateObj, start_time);
		var day_header = Builder.node('li', {id:date_id});
		day_header.appendChild(Builder.node('span', {className:'grid_day '+weekdayName(dateObj, true)}, [weekdayName(dateObj, false)]));
		return day_header;
	};
	
	function getRowId(dateObj, timetab) {
		return 'r'+dateObj.getFullYear() + hasZero(dateObj.getMonth()+1)+ hasZero(dateObj.getDate())+timetab;
	};
	
	function displayDate(start_date, dObj) {
		var placeholder = $('active_day');
		if (!placeholder) return false;
		var date_str = weekdayName(start_date, false)+', '+monthName(start_date, false)+ ' ' + start_date.getDate() + ', ' +start_date.getFullYear();
		if (dObj.view == 'grid') {
			 var x = dateAdd('d', 6, start_date);
			 date_str += '-';
			 date_str += weekdayName(x, false)+', '+monthName(x, false) + ' ' + x.getDate() + ', ' + x.getFullYear();
		}
		placeholder.innerHTML = date_str;
	};
	
	function removeDisplayDate() {
		if ($('active_day')) {
			$('active_day').innerHTML = '';
		} else return false;
	};
	
	function createOptionsList(show, localtime, reminder) {
		var optlist = Builder.node('ul', {className:'clearfix'});
		if (show['default_video_link']) {
			var watchli = Builder.node('li', {className:'watch'});
			watchli.appendChild(Builder.node('a', {href:show['default_video_link']}, [Builder.node('span', ['Watch Video'])]));
			optlist.appendChild(watchli);
		}
		if (show['schedule_id'] && reminder) {
			var remindli = Builder.node('li', {className:'reminder'});
			var x = parseDateObj(localtime);
			var time_str = monthName(localtime, false) + ' ' + x['day'] + ' ' + x['hour'] + ':' + x['minute'];
			remindli.appendChild(Builder.node('a', {href:'#', 
													onclick:'open_ReminderPopup("'+escape(show['program_title'])+'", "'
													+escape(show['episode'])+'", "'
													+time_str+'", "'
													+show['schedule_id']+'");this.blur();return false;'}, 
													[Builder.node('span', ['Reminder'])]));
			optlist.appendChild(remindli);
		}
		return optlist;
	}
	
	function createOptionsList2(xmlshow, localtime, reminder, prog_title) {
		var optionslist = Builder.node('ul', {className:'clearfix'});
		var videolink = getNodeValueByChildName(xmlshow, 'default_video_link');
		if (videolink) {
			var watchli = Builder.node('li', {className:'watch'});
			watchli.appendChild(Builder.node('a', {href:videolink}, [Builder.node('span', ['Watch Video'])]));
			optionslist.appendChild(watchli);
		}
		var schedule_id = getNodeValueByChildName(xmlshow, 'schedule_id');
		if (schedule_id && reminder) {
			var episode = getNodeValueByChildName(xmlshow, 'episode');
			var remindli = Builder.node('li', {className:'reminder'});
			var time_str = monthName(localtime, false) + ' ' + hasZero(localtime.getDate()) + ' ' + hasZero(localtime.getHours()) + ':' + hasZero(localtime.getMinutes());
			remindli.appendChild(Builder.node('a', {href:'#', onclick:'open_ReminderPopup(\''+escape(prog_title)+'\', \''
																		+escape(episode)+'\', \''
																		+time_str+'\', \''
																		+schedule_id+'\');this.blur();return false;'}, [Builder.node('span',['Reminder'])]));
			optionslist.appendChild(remindli);
		}
		return optionslist;
	}