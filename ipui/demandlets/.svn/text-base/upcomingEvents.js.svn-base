/*
 * upcomingEvents.js
 */
function initiate_upcomingEvents(dObj) {
        var event_type = dObj.getAttribute('event_type');
        var event_type_id;
        if (!event_type) {
        	hideContainer(dObj);
        	return false;
        } else {
        	event_type_re = new RegExp(event_type, 'i');
        	new Ajax.Request('/ajax/data/event_type.xml', 
        		{
        			method: 'get', 
        			asynchronous: false,
        			parameters: 'nC='+noCache(),
        			onFailure: function() {
        				hideContainer(dObj);
        			},
        			onSuccess: function(xml) {
        				var firstNode = get_firstchild(xml.responseXML.documentElement);
	                    var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
	                    for (var i = 0; i < x.length; i++) {
	                    	if (getNodeValueByChildName(x[i], 'name').match(event_type_re)) {
	                    		event_type_id = getNodeValueByChildName(x[i], 'event_type_id');
	                    		break;
	                    	}
	                    }
        			}
        		}
        	);
        }
        if (!event_type_id) {
        	hideContainer(dObj);
        	return false;
        }
        getServerTime();
        var today = new Date(server_time);
        today.setHours(today.getHours()-4);
        var emonth = new Date(today);
        emonth.setDate(1);
        var table = Builder.node('table', {className:'upcoming-events-table'});
        table.uniqueIds = ',';
        if (table.getElementsByTagName('tbody').length) {
        	var container = table.getElementsByTagName('tbody')[0];
        } else {
        	var container = document.createElement('tbody');
        	table.appendChild(container);
        }
        getUpcomingEvents(event_type_id, container, today, emonth, dObj);
        dObj.appendChild(table);
};
function getUpcomingEvents(eventTypeId, container, today, emonth, dObj) {
        if (!isDate(today) || !isDate(emonth)) {
        	hideContainer(dObj);
        	return false;
        }
        var site = new Site();
        var dataFolder = site.getSiteFolder();
        if (!dataFolder) return false;
        var url = '/ajax/data/'+dataFolder+'/'+hasZero(emonth.getMonth()+1)+emonth.getFullYear()+'.xml';
        new Ajax.Request(url, {
                method:'get',
                parameters:'nC='+noCache(),
                onFailure:function() {
                	if (!container.getElementsByTagName('tr').length) {
                		hideContainer(dObj);
                	}
                },
                onSuccess:function(xml){
                        var firstNode = get_firstchild(xml.responseXML.documentElement);
                        var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                        if (!x.length || x[0].nodeName.toLowerCase() == 'xml') {
                        	hideContainer(dObj);
                        } else {
	                        var count = getValidEvents(container, x, today, eventTypeId);
	                        if (count < 8) {
	                                emonth.setMonth(emonth.getMonth()+1);
	                                getUpcomingEvents(eventTypeId, container, today, emonth, dObj);
	                        }
	                    }
                }
        });
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
        var site = new Site();
		var tmPrefix = site.getTmPrefix();
		if (!tmPrefix) tmPrefix='';
        if (perfsNodeList) {
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
                                        perfTixType.onclick = function() { window.open(this.href); return false; };
                                }
                                perfsList.appendChild(Builder.node('li', {className: 'clearfix'}, [perfDatePart, ' ', perfTimePart, ' ', perfTixType]));
                        }
                }
        }
        return perfsList;
};
function getValidEvents(container, evtList, today, eventTypeId) {
		var highlight = false;
		var site = new Site();
		var tmPrefix = site.getTmPrefix();
		if (!tmPrefix) tmPrefix='';
        for (var i = 0; i < evtList.length; i++) {
                if (container.getElementsByTagName('tr').length == 8) break;
                var start_display = createDateObj(getNodeValueByChildName(evtList[i], 'calendar_start_date'));
                var end_display = createDateObj(getNodeValueByChildName(evtList[i], 'calendar_end_date'));
                if (!dateInRange(today, start_display, end_display)) continue;
                if (eventTypeId != getNodeValueByChildName(evtList[i], 'event_type_id')) continue;
                var eventId = getNodeValueByChildName(evtList[i], 'event_id');
                var table = container.parentNode;
                if (table.uniqueIds.indexOf(','+eventId+',') > -1) {
                	continue;
                } else {
                	table.uniqueIds += ','+eventId+',';
                }
                var row = document.createElement('tr');
                var perfData = getPerfInfo(evtList[i].getElementsByTagName('performance'));
                row.appendChild(Builder.node('td', {className:'date'}, [perfData['event_date']]));
                var event_name = getNodeValueByChildName(evtList[i], 'name');
                var isTeam = parseInt(getNodeValueByChildName(evtList[i], 'team_event'));
                var pageUrl = getNodeValueByChildName(evtList[i], 'page_name');
                if (pageUrl) {
                	if (isTeam) {
                		var pageName = '/sporting-events/'+pageUrl;
                	} else {
                		var pageName = '/events/'+pageUrl;
                	}
                	var eventNameLnk = Builder.node('a', {href:pageName}, [event_name]);
                	row.appendChild(Builder.node('td', {className:'event_name'}, [eventNameLnk]));
                } else {
                	row.appendChild(Builder.node('td', {className:'event-name'}, [event_name]));
                }
                var venueLocation = getNodeValueByChildName(evtList[i], 'location');
                row.appendChild(Builder.node('td', {className:'venue-location'}, [venueLocation]));
                row.appendChild(Builder.node('td', {className:'time'}, [perfData['event_time']]));
                var onSaleDate = createDateObj(getNodeValueByChildName(evtList[i], 'onsale_date'));
                var purchaseLnk= document.createElement('a');
                if (dateDiff('n', onSaleDate, today) >= 0) {
                        if (perfData['isAvailable']) {
                                if (perfData['isMultiple']) {
                                        purchaseLnk.className = 'btn-get-tickets';
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
                                                                eventVenue: venueLocation,
                                                                eventOptions: tixOptions
                                                                };
                                        purchaseLnk.onclick = function() {
                                                addOverlay();
                                                showOverlay();
                                                addData(addEventPopup(), this);
                                                showEvPopup();
                                                return false;
                                        }
                                        purchaseLnk.appendChild(document.createTextNode('Get Tickets'));
                                } else {
                                        purchaseLnk.className = 'btn-get-tickets';
                                        purchaseLnk.appendChild(document.createTextNode('Get Tickets'));
                                        purchaseLnk.href = (perfData['tm_url'])? tmPrefix+perfData['tm_url']: '#';
                                        purchaseLnk.onclick = function() { window.open(this.href); return false; };
                                }
                                row.appendChild(Builder.node('td', {className:'options'}, [purchaseLnk]));
                        } else {
                                var soldOut = Builder.node('span', {className:'sold-out'}, ['Sold Out']);
                                row.appendChild(Builder.node('td', {className:'options'}, [soldOut]));
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
                        signupButton.onclick = function() { window.open(this.href); return false; };
                        var signupOptions = [signupTxtHolder, signupButton];
                        purchaseLnk.evtInfo = {eventName: event_name,
                                            	eventTour: getNodeValueByChildName(evtList[i], 'tour_name'),
                                                eventDate: perfData['event_date'],
                                                eventVenue: venueLocation,
                                                eventOptions: signupOptions
                                                };
                        purchaseLnk.onclick = function() {
                                addOverlay();
                                showOverlay();
                                addData(addEventPopup(), this);
                                showEvPopup();
                                return false;
                        }
                        purchaseLnk.appendChild(document.createTextNode('On Sale Info'));
                        row.appendChild(Builder.node('td', {className:'options'}, [purchaseLnk]));
                }
                container.appendChild(row);
                if (row.previousSibling && row.previousSibling.nodeName == 'TR') {
                	var prevRow = row.previousSibling;
	                if (prevRow.className.indexOf('highlight') == -1) {
                		row.className = 'highlight';
	                }
                }
        }
        return container.getElementsByTagName('tr').length;
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
function hideContainer(dObj) {
	dObj.style.display = 'none';
	if ($('upcoming-events-header')) {
		$('upcoming-events-header').style.display = 'none';
	}
};