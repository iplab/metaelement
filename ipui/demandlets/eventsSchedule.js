/*
* eventsSchedule.js
*/
function initiate_eventsSchedule(dObj) {
		var site = new Site();
		var dataFolder = site.getSiteFolder();
        if (!dataFolder) return false;
        var table = Builder.node('table', {id:'events_table'});
        table.dataFolder = dataFolder;
        getServerTime();
        table.today = new Date(server_time);
        table.today.setHours(table.today.getHours()-4);
        table.emonth = new Date(table.today);
        table.emonth.setDate(1);
        table.isNextMonth = true;
        table.uniqueIds = ',';
        table.max_events = 20;
        var filterParams = window.location.href.split('?');
		if (filterParams.length > 1) {
        	filterParams = filterParams[1].toQueryParams();
        	if (filterParams.event_type) {
        		table.filterParams = new Object();
        		table.filterParams.event_type = filterParams.event_type;
        	}
        }	
        dObj.appendChild(createFilterControls(table.today, dataFolder));
        dObj.appendChild(createSendToControls());
        //dObj.appendChild(createChangeViewControls());
        var list_container = dObj.appendChild(createListContainer());
        list_container.insertBefore(table, $('bottom_list_header'));
        if (table.getElementsByTagName('tbody').length) {
        	var tbodies = table.getElementsByTagName('tbody');
        	table.removeChild(tbodies[0]);
        }
        table.appendChild(createListHeader());
      	getUpcomingMonthlyEvents(table);
};
function createFilterControls(today, folder) {
        var desc_span = Builder.node('span', {id:'view-by'}, ['View Calendar By']);
        var months_dd = Builder.node('select', {id:'select_evmonth'});
        var events_dd = Builder.node('select', {id:'select_evtype'});
        var venues_dd = Builder.node('select', {id:'select_venue'});
        addOption(months_dd, 'All Months', '');
        addOption(events_dd, 'All Event Types', '');
        addOption(venues_dd, 'All Venues', '');
        var months = {January:'01', February:'02', March:'03', April:'04', May:'05', June:'06', 
        			July:'07', August:'08', September:'09', October:'10', November:'11', December:'12' };
        var url = '/ajax/data/'+folder+'/month.xml';
        new Ajax.Request(url, {method:'get', parameters:'nC='+noCache(),
        	onSuccess: function(xml) {
        		var firstNode = get_firstchild(xml.responseXML.documentElement);
        		var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
        		var maxLength = (x.length > 12)? 12: x.length;
        		var sortDatesArray = [];
        		var datesArray = new Object();
        		for (var i = 0; i < maxLength; i++) {
					var monthYear = getNodeValue(x[i]);
					var dateArray = monthYear.split(' ');
					var evtMonth = dateArray[0];
					var evtYear = dateArray[1];
					datesArray[evtYear+months[evtMonth]] = monthYear + '__' + months[evtMonth]+evtYear;
					sortDatesArray.push(evtYear+months[evtMonth]);
        		}
        		sortDatesArray.sort(function(a, b){ return a - b; });
        		for (var i = 0; i < sortDatesArray.length; i++) {
        			var dateValue = sortDatesArray[i];
        			var tmp = datesArray[dateValue].split('__');
        			addOption(months_dd, tmp[0], tmp[1]);
        		}
        	}
        });
        url = '/ajax/data/venues.xml';
        new Ajax.Request(url, {method:'get', parameters:'&nC='+noCache(),
                onSuccess: function(xml) {
                                        var firstNode = get_firstchild(xml.responseXML.documentElement);
                                        var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                                        for (var i = 0; i < x.length; i++) {
                                                var venue_id = getNodeValueByChildName(x[i], 'venue_id');
                                                var venue_name = getNodeValueByChildName(x[i], 'name');
                                                addOption(venues_dd, venue_name, venue_id, false);
                                        }
                                }
        });
        url = '/ajax/data/event_type.xml';
        new Ajax.Request(url, {method:'get', parameters:'&nC='+noCache(), 
                onSuccess: function(xml) {
                                                var firstNode = get_firstchild(xml.responseXML.documentElement);
                                                var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                                                for (var i = 0; i < x.length; i++) {
                                                        var event_id = getNodeValueByChildName(x[i], 'event_type_id');
                                                        var event_name = getNodeValueByChildName(x[i], 'name');
                                                        addOption(events_dd, event_name, event_id, false);
                                                }
                                        }
        });
        var go_button = Builder.node('a', {id:'go_filter', className:'btn-go', href:'#'}, ['Go']);
        go_button.onclick = function() {
                if ($('events_table')) { 
                	var table = $('events_table');
					createLoadingSign($('list_container'));
                    if (table.style.visibility) {
                            if (table.style.visibility == 'hidden') {
                                    table.style.visibility = 'visible';
                            }
                    }
                    resetTable(table);
                    table.today = new Date(today);
                    table.emonth = new Date(today);
                    var filterParams = {
                            month: $('select_evmonth').options[$('select_evmonth').selectedIndex].value,
                            event_type: $('select_evtype').options[$('select_evtype').selectedIndex].value,
                            venue_id: $('select_venue').options[$('select_venue').selectedIndex].value
                    };
                    table.filterParams = filterParams;
                    getUpcomingMonthlyEvents(table);
                }
                return false;
        }
        return Builder.node('div', {id:'filter_controls', className:'clearfix'}, [desc_span, months_dd, events_dd, venues_dd, go_button]);
};
function createSendToControls() {
		var siteUrl = window.location.href;
        var siteName = window.location.href.split('://')[1].split('/')[0];
        var email_lnk = Builder.node('a', {id:'ev_email',href:'#'}, ['Email This']);
        email_lnk.onclick = function() {
        	newWindow('/send-to-friend.html','sendtoFriend',320,360,false,false,true);
        	this.blur();
        	return false;
        }
        var im_lnk = Builder.node('a', {id:'ev_im', href:'#'}, ['IM This']);
        var print_lnk = Builder.node('a', {id:'ev_print', href:'#'}, ['Print']);
        var email_li = Builder.node('li', [email_lnk]);
        var im_li = Builder.node('li', [im_lnk]);
        im_lnk.onclick = function() { sendIM(siteName, siteUrl); return false; }
        var print_li = Builder.node('li', [print_lnk]);
        print_lnk.onclick = function() { window.print(); return false; };
        return Builder.node('ul', {id:'sendto_controls'}, [email_li, im_li, print_li]);
};
function createChangeViewControls() {
		/*
		* TODO:
		* ATTENTION! - DISABLED UNTIL CALENDAR VIEW IS AVAILABLE - NICHOLAS HOSKINS 09/05/2007
        var lvr = Builder.node('input', {id:'list_radio', type:'radio', name:'view', checked:'', value:'list_view'});
        var lvlabel = Builder.node('label', ['List View']);
        lvlabel.setAttribute('for', 'list_radio');
        var cvr = Builder.node('input', {id:'calendar_radio', type:'radio', name:'view', value:'calendar_view'});
        var cvlabel = Builder.node('label', ['Calendar View']);
        cvlabel.setAttribute('for','calendar_radio');
        return Builder.node('div', {id:'changeview_controls'}, [lvr, lvlabel, cvr, cvlabel]);
        */
};
function createListContainer() {
        var top_p = Builder.node('p', {className:'display_status'});
        var bot_p = Builder.node('p', {className:'display_status'});
        var top_prev_lnk = Builder.node('a', {className:'prev_events', href:'#leftcolumn', style:'visibility:hidden'});
        var bot_prev_lnk = Builder.node('a', {className:'prev_events', href:'#leftcolumn', style:'visibility:hidden'});
        var top_next_lnk = Builder.node('a', {className:'next_events', href:'#leftcolumn', style:'visibility:hidden'});
        var bot_next_lnk = Builder.node('a', {className:'next_events', href:'#leftcolumn', style:'visibility:hidden'});
        top_prev_lnk.onclick = top_next_lnk.onclick = bot_prev_lnk.onclick = bot_next_lnk.onclick = viewEventsControl;
        var top_header = Builder.node('div',{id:'top_list_header'}, [top_p, top_prev_lnk, top_next_lnk]);
        var bottom_header = Builder.node('div',{id:'bottom_list_header'}, [bot_p, bot_prev_lnk, bot_next_lnk]);
        return Builder.node('div', {id:'list_container'}, [top_header, bottom_header]);
};
function createCalContainer(today) {
        var prev_nav = Builder.node('a', {id:'prev_month_nav'}, ['Previous Month']);
        var next_nav = Builder.node('a', {id:'next_month_nav'}, ['Next Month']);
        var months_dd = createCalSelectBox('cal_select_month', new Date(today));
        var dObj = Builder.node('div', {id:'cal_header'}, [prev_nav, next_nav, months_dd]);
        return Builder.node('div', {id:'cal_container'}, [dObj]);
};
function createListHeader() {
        var row = document.createElement('tr');
        ['', 'Date', 'Event', 'Venue', 'Time', 'Purchase'].each(function(h) {
                row.appendChild(Builder.node('th', [h]));
        });
        return Builder.node('thead', [row]);
};
function changeToCalendar() {
        Element.hide($('months_dd'));
        createCalContainer();
};
function changetoList() {
        Element.show($('months_dd'));
        createListContainer();
};
function getUpcomingMonthlyEvents(table) {
        if (!isDate(table.today) || !isDate(table.emonth)) return false;
        var dataFolder = table.dataFolder;
        if (table.filterParams) {
                var isFiltersOn = (table.filterParams.month || table.filterParams.event_type || table.filterParams.venue_id)? true: false;
        } else {
                var isFiltersOn = false;
        }
        if (isFiltersOn && table.filterParams.month) {
                var url = '/ajax/data/'+dataFolder+'/'+table.filterParams.month+'.xml';
                new Ajax.Request(url, {
                        method:'get',
   						parameters:'nC='+noCache(),                  
                        onCreate: function() {
                                if (!$('loading_sign')) {
                                	createLoadingSign($('list_container'));
                                }
                                var x = $('loading_sign');    
                                Element.show(x);
                        },
                        onFailure:function(err) { handleNoData();},
                        onSuccess: function(xml) {
                                var firstNode = get_firstchild(xml.responseXML.documentElement);
                                var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                                getValidEvents(table, x);
                                table.isNextMonth = false;
                                setDisplayInfo(table);
                                showDisplayInfo(table);
                        },
                        onComplete: function() {
                                if ($('loading_sign')) {
                                        var x = $('loading_sign');
                                        x.parentNode.removeChild(x);
                                }
                                var divHeight = getHeight(table.parentNode);
                				table.parentNode.style.minHeight = divHeight+'px';
                        }
                });
        } else {
                var url = '/ajax/data/'+dataFolder+'/'+hasZero(table.emonth.getMonth()+1)+table.emonth.getFullYear()+'.xml';
                var isLast = true;
                new Ajax.Request(url, {
                        method:'get',
   						parameters:'nC='+noCache(),
                        onCreate: function() {
                                if (!$('loading_sign')) {
                                	createLoadingSign($('list_container'));
                                }
                                var x = $('loading_sign');    
                                Element.show(x);
                        },
                        onFailure:function(err) { handleNoData(); },
                        onSuccess:function(xml){
                                var firstNode = get_firstchild(xml.responseXML.documentElement);
                                var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                                isLast = false;
                                getValidEvents(table, x);
                                var activePage = document.getElementsByClassName('active')[0];
                                if (activePage.getElementsByTagName('tr').length < table.max_events) {
                                        table.emonth.setMonth(table.emonth.getMonth()+1);
                                        getUpcomingMonthlyEvents(table);
                                } else {
                                        isLast = true;
                                }
                                setDisplayInfo(table);
                                showDisplayInfo(table);
                        },
                        onComplete:function() {
                                if (isLast) {
                                    if ($('loading_sign')) {
                                            var x = $('loading_sign');
                                            x.parentNode.removeChild(x);
                                    }
                                    var divHeight = getHeight(table.parentNode);
                					table.parentNode.style.minHeight = divHeight+'px';
                                }
                        }
                });
        }
};
function getPerfInfo(x) {
        var perfObj = new Object();
        var perfDateStr, hr, min, prevHr, prevMin;
        perfObj['isAvailable'] = false;
        perfObj['isMultiple'] = false;
 
        if (x.length > 0) {
                var d1 = createDateObj(getNodeValueByChildName(x[0], 'event_date'));
                perfDateStr = monthName(d1, true) + ' ' + d1.getDate();
                if (x.length > 1) {
                        var d2 = createDateObj(getNodeValueByChildName(x[x.length-1], 'event_date'));
                        if (d1.getMonth() == d2.getMonth()) {
                        		if (d1.getDate() != d2.getDate()) {
                                	perfDateStr += '-' + d2.getDate();
                                }
                        } else {
                                perfDateStr += '-' + monthName(d2, true) + ' ' + d2.getDate();
                        }
                        perfObj['isMultiple'] = true;
                }
                perfObj['event_date'] = perfDateStr;
                perfObj['tm_url'] = getNodeValueByChildName(x[0], 'ticket_master_url');
        }
        for (var i = 0; i < x.length; i++) {
                var d1 = createDateObj(getNodeValueByChildName(x[i], 'event_date'));
                hr = d1.getHours();
                min = d1.getMinutes();
                if (i != 0) {
                        if (hr != prevHr || min != prevMin) {
                                perfObj['event_time'] = 'Various';
                                break;
                        }
                }
                prevHr = hr;
                prevMin = min;
                perfObj['event_time'] = convertHours(d1) + ':' + hasZero(min) + showAMPM(d1).toLowerCase();
        }
        for (var i = 0; i < x.length; i++) {
                if (getNodeValueByChildName(x[i], 'sold_out') == '0') {
                        perfObj['isAvailable'] = true;
                        break;
                }
        }
        return perfObj;
};
function getPerfs(perfsNodeList, today) {
        var perfsList = document.createElement('ol');
        perfsList.isMore = false;
        if (perfsNodeList) {
        		var site = new Site();
        		var tmPrefix = site.getTmPrefix();
        		if (!tmPrefix) tmPrefix='';
                for (var i = 0; i < perfsNodeList.length; i++) {
                        if (perfsList.getElementsByTagName('li').length == 6) {
                                perfsList.isMore = true;
                                break;
                        }
                        var perfDate = createDateObj(getNodeValueByChildName(perfsNodeList[i], 'event_date'));
                        if (dateDiff('n', today, perfDate) > 0) {
                                var perfDatePart = Builder.node('span', [weekdayName(perfDate, true) + ', ' + monthName(perfDate, true) + ' ' + perfDate.getDate()]);
                                var perfTimePart = Builder.node('span', [convertHours(perfDate) + ':' + hasZero(perfDate.getMinutes()) + ' ' + showAMPM(perfDate)]);
                                if (getNodeValueByChildName(perfsNodeList[i], 'sold_out') == '1') {
                                        var perfTixType = Builder.node('span', {className:'sold-out'}, ['Sold Out']);
                                } else {
                                        var tnUrl = getNodeValueByChildName(perfsNodeList[i], 'ticket_master_url');
                                        var perfTixType = Builder.node('a', {href:tmPrefix+tnUrl, className:'btn-buy-now'}, ['Buy Now']);
                                        perfTixType.onclick = function() { window.open(this.href); return false; }
                                }
                                perfsList.appendChild(Builder.node('li', {className:'clearfix'}, [perfDatePart, ' ', perfTimePart, ' ', perfTixType]));
                        }
                }
        }
        return perfsList;
};
function getValidEvents(table, evtList) {
        if (!table) return false;
        if (!table.today) {
                return false;
        } else {
                var today = table.today;
        }
        if (!table.getElementsByTagName('tbody').length) {
                var container = document.createElement('tbody');
                table.appendChild(container);
                container.className = 'active';
        } else {
                var tbodies = table.getElementsByTagName('tbody');
                var last_tbody = tbodies[tbodies.length-1];
                var recs = last_tbody.getElementsByTagName('tr');
                if (recs.length < table.max_events) {
                        var container = last_tbody;
                } else {
                        var container = document.createElement('tbody');
                        table.appendChild(container);
                        if (!document.getElementsByClassName('active').length) {
                                container.className = 'active';
                        }
                }
        }
        var site = new Site();
        var tmPrefix = site.getTmPrefix();
        if (!tmPrefix) tmPrefix='';
        for (var i = 0; i < evtList.length; i++) {
                var start_display = createDateObj(getNodeValueByChildName(evtList[i], 'calendar_start_date'));
                var end_display = createDateObj(getNodeValueByChildName(evtList[i], 'calendar_end_date'));
                if (!dateInRange(today, start_display, end_display)) continue;
                if (table.filterParams) {
                        if (table.filterParams.event_type) {
                                var event_type = getNodeValueByChildName(evtList[i], 'event_type_id');
                                if (table.filterParams.event_type != event_type) continue;
                        }
                        if (table.filterParams.venue_id) {
                                var venue_id = getNodeValueByChildName(evtList[i], 'venue_id');
                                if (table.filterParams.venue_id != venue_id) continue;
                        }
                }
                var eventId = getNodeValueByChildName(evtList[i], 'event_id');
                if (table.uniqueIds.indexOf(','+eventId+',') > -1) {
                	continue;
                } else {
                	table.uniqueIds += eventId+','
                }
                var rec = document.createElement('tr');
                if (container.getElementsByTagName(rec.nodeName).length == table.max_events) {
                        var container = document.createElement('tbody');
                        table.appendChild(container);
                }
                var event_name = getNodeValueByChildName(evtList[i], 'name');
                var small_img_url = getNodeValueByChildName(evtList[i], 'small_image_url');
                var venue_location = getNodeValueByChildName(evtList[i], 'location');
                var perfData = getPerfInfo(evtList[i].getElementsByTagName('performance'));
                var onSaleDate = createDateObj(getNodeValueByChildName(evtList[i], 'onsale_date'));
                var isTeam = parseInt(getNodeValueByChildName(evtList[i], 'team_event'));
                var pageUrl = getNodeValueByChildName(evtList[i], 'page_name');
                if (pageUrl) {
                	if (isTeam) {
                		var pageName = '/sporting-events/'+pageUrl;
                	} else {
                		var pageName = '/events/'+pageUrl;
                	}
                	var imgNode = Builder.node('a', {href:pageName}, [Builder.node('img', {alt:event_name, src:small_img_url})]);
                } else {
                	var imgNode = Builder.node('img', {alt:event_name, src:small_img_url});
                }
                rec.appendChild(Builder.node('td', {className:'small_image'}, [imgNode]));
                rec.appendChild(Builder.node('td', {className:'event_date'}, [perfData['event_date']]));
                if (pageUrl) {
                	var eventNameLnk = Builder.node('a', {href:pageName});
                	eventNameLnk.innerHTML = event_name;
                	rec.appendChild(Builder.node('td', {className:'event_name'}, [eventNameLnk]));
                } else {
                	rec.appendChild(Builder.node('td', {className:'event_name'}, [event_name]));	
                }
                rec.appendChild(Builder.node('td', {className:'venue_loc'}, [venue_location]));
                rec.appendChild(Builder.node('td', {className:'event_time'}, [perfData['event_time']]));
                var purchaseLnk= document.createElement('a');
                if (dateDiff('n', onSaleDate, today) >= 0) {
                        if (perfData['isAvailable']) {
                                if (perfData['isMultiple']) {
                                        purchaseLnk.className = 'multiple_events btn-get-tickets';
                                        purchaseLnk.href = '#';
                                        var perfsList = getPerfs(evtList[i].getElementsByTagName('performance'), today);
                                        if (perfsList.isMore) {
                                                var moreLnk = Builder.node('a', {href:pageName, className:'more_events'}, ['More']);
                                                var tixOptions = [perfsList, moreLnk];
                                        } else {
                                                var tixOptions = [perfsList];
                                        }
                                        purchaseLnk.evtInfo = {eventName: event_name,
                                                                eventTour: getNodeValueByChildName(evtList[i], 'tour_name'),
                                                                eventDate: perfData['event_date'],
                                                                eventVenue: venue_location,
                                                                eventOptions: tixOptions
                                                                };
                                        purchaseLnk.onclick = function() {
                                                addOverlay();
                                                showOverlay();
                                                addData(addEventPopup(), this);
                                                if ($('ue_popup')) {
                                                	var pos = getStyle($('ue_popup'), 'position');
                                                	if (pos != 'fixed') {
                                                		$('filter_controls').style.visibility = 'hidden';
                                                	}
                                                }
                                                showEvPopup();
                                                return false;
                                        }
                                        purchaseLnk.appendChild(Builder.node('span', ['Get Tickets']));
                                } else {
                                        purchaseLnk.className = 'btn-get-tickets';
                                        purchaseLnk.appendChild(Builder.node('span', ['Get Tickets']));
                                        purchaseLnk.href = tmPrefix + perfData['tm_url'];
                                        purchaseLnk.onclick = function() { window.open(this.href); return false; }
                                }
                                rec.appendChild(Builder.node('td', {className:'options'}, [purchaseLnk]));
                        } else {
                        		var sos = Builder.node('span', {className:'sold-out'}, ['Sold Out']);
                                rec.appendChild(Builder.node('td', {className:'options'}, [sos]));
                        }
                } else {
                        purchaseLnk.href='#';
                        purchaseLnk.className = 'btn-onsale-info';
                        var time_str = weekdayName(onSaleDate) + ', '
                                                        + monthName(onSaleDate) + ' '
                                                        + onSaleDate.getDate() + '&nbsp;at '
                                                        + convertHours(onSaleDate)+':'+hasZero(onSaleDate.getMinutes())
                                                        + ' ' + showAMPM(onSaleDate).toLowerCase();
                        var signupTxtHolder = document.createElement('div');
                        signupTxtHolder.innerHTML = '<p>Tickets go on sale, '+time_str+
                                                    '. Sign up now for exclusive ticket offer information!</p>';
                        var signUpUrl = getSignUpUrl();
                        var signupButton = Builder.node('a', {className:'btn-sign-up-now', href:signUpUrl}, ['Sign Up']);
                        signupButton.onclick = function() {
                        	window.open(this.href);
                        	return false;
                        }
                        var signupOptions = [signupTxtHolder, signupButton];
                        purchaseLnk.evtInfo = {eventName: event_name,
                                                eventTour: getNodeValueByChildName(evtList[i], 'tour_name'),
                                                eventDate: perfData['event_date'],
                                                eventVenue: venue_location,
                                                eventOptions: signupOptions
                                                };
                        purchaseLnk.onclick = function() {
                                addOverlay()
                                showOverlay();
                                addData(addEventPopup(), this);
                                showEvPopup();
                                return false;
                        }
                        purchaseLnk.appendChild(Builder.node('span', ['On Sale Info']));
                        rec.appendChild(Builder.node('td', {className: 'options'}, [purchaseLnk]));
                }
                container.appendChild(rec);
                if (rec.previousSibling && rec.previousSibling.nodeName == 'TR') {
                	var prevRow = rec.previousSibling;
	                if (prevRow.className.indexOf('highlight') == -1) {
                		rec.className = 'highlight';
	                }
                }
        }
};
function createCalSelectBox(identifier, today) {
        var months_dd = Builder.node('select', {id:identifier});
        addOption(months_dd, 'All Months', '');
        for (var i = 0; i < 12; i++) {
                var d = dateAdd('m', i, today);
                var d_val = hasZero(d.getMonth()+1)+''+d.getFullYear();
                var d_txt = monthName(d)+' '+d.getFullYear();
                addOption(months_dd, d_txt, d_val, false);
        }
        return months_dd;
};
function viewEventsControl(e) {
        var evt = e || window.event;
        var evtTarget = evt.target || evt.srcElement;
        var active_tbodies = document.getElementsByClassName('active');
        for (var i = 0; i < active_tbodies.length; i++) {
                if (active_tbodies[i].nodeName.toLowerCase() == 'tbody') {
                        active_tbodies[i].removeClassName('active');
                }
        }
        var active_tbody = active_tbodies[0];
        var table = active_tbody.parentNode;
        if (evtTarget.className == 'next_events') {
                if (active_tbody.next('tbody')) {
                        var next_tbody = active_tbody.next('tbody');
                        next_tbody.className = 'active';
                        if (next_tbody.getElementsByTagName('tr').length < table.max_events && table.isNextMonth) {
                                table.emonth.setMonth(table.emonth.getMonth()+1);
                                getUpcomingMonthlyEvents(table);
                        } else {
                                showDisplayInfo(table);
                        }
                } else {
                        if (table.isNextMonth) {
                                table.emonth.setMonth(table.emonth.getMonth()+1);
                                getUpcomingMonthlyEvents(table);
                        } else {
                                active_tbody.className = 'active';
                        }
                }
        } else if (evtTarget.className == 'prev_events') {
                if (active_tbody.previous('tbody')) {
                        var prev_tbody = active_tbody.previous('tbody');
                        prev_tbody.className = 'active';
                        showDisplayInfo(prev_tbody.parentNode);
                } else {
                        active_tbody.className = 'active';
                }
        }     
};
function showDisplayInfo(table) {
        var active_tbody = document.getElementsByClassName('active')[0]; 
        setDisplayStatusMsg(document.getElementsByClassName('display_status'), table.isData); 
        var next_events = document.getElementsByClassName('next_events');
        var prev_events = document.getElementsByClassName('prev_events');
        if (table.isData) {
                table.style.visibility = 'visible';
                var current_sets = document.getElementsByClassName('current_set');
                if (active_tbody.next('tbody') || table.isNextMonth) {
                        for (var i = 0; i < next_events.length; i++) {
                                next_events[i].innerHTML = 'Next';
                                next_events[i].style.visibility = 'visible';
                        }
                } else {
                        for (var i = 0; i < next_events.length; i++) {
                                next_events[i].style.visibility = 'hidden';
                        }
                }
                if (active_tbody.previous('tbody')) {
                        for (var i = 0; i < prev_events.length; i++) {
                                prev_events[i].innerHTML = 'Previous';
                                prev_events[i].style.visibility = 'visible';
                        }
                } else {
                        for (var i = 0; i < prev_events.length; i++) {
                                prev_events[i].style.visibility = 'hidden';
                        }
                }
                if (active_tbody.first == active_tbody.last) {
                        for (var i = 0; i < current_sets.length; i++) {
                                current_sets[i].innerHTML = active_tbody.first;
                        }
                } else if (active_tbody.first > active_tbody.last) {
                	current_set[i].innerHTML = '';
                } else {
                        if (active_tbody.last - active_tbody.first + 1 < table.max_events) {
                                for (var i = 0; i < next_events.length; i++) {
                                        next_events[i].style.visibility = 'hidden';
                                }
                        }
                        for (var i = 0; i < current_sets.length; i++) {
                                current_sets[i].innerHTML = active_tbody.first +  '-' + active_tbody.last;
                        }
                }
                if (!active_tbody.next('tbody') && !active_tbody.previous('tbody')) {
                        $('bottom_list_header').style.visibility = 'hidden';    
                } else {
                        $('bottom_list_header').style.visibility = 'visible';
                }
        } else {
                table.style.visibility = 'hidden';
                $('top_list_header').style.visibility = 'visible';
                $('bottom_list_header').style.visibility = 'hidden';
                for (var i = 0; i < next_events.length; i++) {
                        next_events[i].style.visibility = 'hidden';
                }
                for (var i = 0; i < prev_events.length; i++) {
                        prev_events[i].style.visibility = 'hidden';
                }
        }
};
function addData(popElem, lnkElem) {
		var container = popElem.firstChild;
        $('popup_evname').innerHTML = lnkElem.evtInfo.eventName;
        $('popup_evdate').innerHTML = lnkElem.evtInfo.eventDate;
        $('popup_evtour').innerHTML = lnkElem.evtInfo.eventTour;
        $('popup_venue').innerHTML = lnkElem.evtInfo.eventVenue;
        if (lnkElem.evtInfo.eventOptions.length) {
                for (var i = 0; i < lnkElem.evtInfo.eventOptions.length; i++) {
                        container.appendChild(lnkElem.evtInfo.eventOptions[i]);
                }
        }
};
function resetTable(table) {
        var tbodies = table.getElementsByTagName('tbody');
        for (var i = tbodies.length-1; i > -1; i--) {
                table.removeChild(tbodies[i]);
        }
        table.uniqueIds = ',';
        table.isData = false;
        table.isNextMonth = true;
};
function setDisplayInfo(table) {
        var tbodies = table.getElementsByTagName('tbody');
        if (tbodies.length == 1 && tbodies[0].getElementsByTagName('tr').length == 0) {
                table.isData = false;
        } else if (tbodies.length) {
                table.isData = true;
                for (var i = 0; i < tbodies.length; i++) {
                        tbodies[i].first = (i*table.max_events) +1;
                        tbodies[i].last = tbodies[i].first + table.max_events - 1;
                        if (i == tbodies.length-1) {
                                var num_recs = tbodies[i].getElementsByTagName('tr').length;
                                tbodies[i].last = tbodies[i].first + num_recs - 1;
                        }
                }
        }
};
function setDisplayStatusMsg(paras, isData) {
        for (var i = 0; i < paras.length; i++) {
                if (isData) {
                        paras[i].innerHTML = 'Showing Events: <span class="current_set"></span>';
                } else {
                        paras[i].innerHTML = 'Showing Events: No Events Found.';
                }
        }
};
function createLoadingSign(container) { 
        var container_height = getHeight(container);
      	var div = Builder.node('div', {id: 'loading_sign', style: 'height:'+container_height+'px; display: none;'});
        var img = Builder.node('img', {src:'/media/global/loading.gif', alt:'Loading....'});
        var span = Builder.node('span', [' Loading... ']);
       	div.appendChild(img);
       	div.appendChild(span);
        container.appendChild(div);
};
function handleNoData() {
        if ($('events_table')) {
                var table = $('events_table');
                if ($('events_table').getElementsByTagName('tbody').length) {
                        table.isNextMonth = false;
                        if (!document.getElementsByClassName('active').length) {
                                var tbodies = table.getElementsByTagName('tbody');
                                var last_tbody = tbodies[tbodies.length-1];
                                last_tbody.className = 'active';
                        } else {
                                var lastPage = document.getElementsByClassName('active')[0];
                                if (lastPage.getElementsByTagName('tr').length == 0) {
                                    if (lastPage.previous('tbody')) {
                                        var prevPage = lastPage.previous('tbody');
                                        table.removeChild(lastPage);
                                       	if ($('loading_sign')) {
                                       		var x = $('loading_sign');
                                            x.parentNode.removeChild(x);
                                       	}
                                        alert('No additional events were found, click OK to return to previous results.');
                                        if (!prevPage.hasClassName('active')) {
                                                prevPage.className = 'active';
                                        }
                                    }
                                };
                        }
                        setDisplayInfo(table);
                        showDisplayInfo(table);
                } else {
                        table.style.visibility = 'hidden';
                        var paras = document.getElementsByClassName('display_status');
                        if (paras.length) {
                                setDisplayStatusMsg(paras, table.isData);
                        }
                        var prev_events = document.getElementsByClassName('prev_events');
                        var next_events = document.getElementsByClassName('next_events');
                        for (var i = 0; i < prev_events.length; i++) {
                                prev_events[i].style.visibility = 'hidden';
                                next_events[i].style.visibility = 'hidden';
                        }
                        $('bottom_list_header').style.visibility = 'hidden';
                }
        }
};
function getSignUpUrl() {
    var site =  window.location.href.split('://')[1].split('/')[0];
    var beacon = /beacon/i;
    var wamu = /wamu/i;
    var garden = /garden/i;
    var radiocity = /radiocity/i;
    var url;
    if (site.match(beacon)) {
            url = 'http://msg.myprefs.com/?@Beacon_Theatre&p2p=signup';
    } else if (site.match(wamu)) {
            url = 'http://msg.myprefs.com/?@Beacon_Theatre&p2p=signup';
    } else if (site.match(garden)) {
            url = 'https://msg.smartdm.com/Survey/dspSurvey.cfm?N=35043&SID=2&SEQ=1';
    } else if (site.match(radiocity)) {
            url = 'http://msg.myprefs.com/?@BackStage_Access&p2p=Signup';
    } else {
            url = '#';
    }
    return url;
};