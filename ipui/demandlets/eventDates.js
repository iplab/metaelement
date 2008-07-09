/*
 * eventDates.js
 */
function initiate_eventDates(dObj) {
        var isTeam = (dObj.attributes['team'])?true:false;
        getServerTime();
        var today = new Date(server_time);
        today.setHours(today.getHours()-4);
        var table = document.createElement('table');
        dObj.appendChild(Builder.node('div', {className:'scroll'}, table));
        if (table.getElementsByTagName('tbody').length) {
                var container = table.getElementsByTagName('tbody')[0];
        } else {
                var container = document.createElement('tbody');
                table.appendChild(container);
        }
        getEventDates(dObj, container, today, isTeam);
};
function getEventDates(dObj, container, today, isTeam) {
        if (!isDate(today)) {
        	hideEventDates(dObj);
        	return false;
        }
        if (!isTeam) {
                var eventId = getMetaValue('event_id');
                if (eventId == false) return false;
                var url = '/ajax/data/'+eventId+'_event.xml';
        } else {
        		var eventSubTypeId = dObj.getAttribute('team');
        		if (!eventSubTypeId) {
        			hideEventDates(dObj);
        			return false;
        		}
        		var site = new Site();
        		var dataFolder = site.getSiteFolder();
       			if (!dataFolder) return false;
                var url = '/ajax/data/'+dataFolder+'/'+eventSubTypeId+'_subtype.xml';
        }
        new Ajax.Request(url, {
                method:'get',
                parameters:'nC='+noCache(),
                onFailure:function() { dObj.style.display = 'none'; },
                onSuccess:function(xml){
                        var firstNode = get_firstchild(xml.responseXML.documentElement);
                        var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                        if (!x.length || x[0].nodeName.toLowerCase() == 'xml') {
                        	hideEventDates(dObj);
                        } else {
                                var numDates = getValidDates(container, x, today, isTeam);
                                if (numDates) {
						        	if (isTeam) {
							        	var title = Builder.node('h2', ['Upcoming Games']);
							        } else {
							        	var title = Builder.node('h2', ['Get Tickets']);
							        }
							        dObj.insertBefore(title, dObj.firstChild);
						        } else {
						        	hideEventDates(dObj);
						        }
                        }
                }
        });
};
function getValidDates(container, evts, today, isTeam) {
        for (var i = 0; i < evts.length; i++) {
                var perfs = evts[i].getElementsByTagName('performance');
                if (perfs.length) {
                        var onSaleDate = getNodeValueByChildName(evts[i], 'onsale_date');
                        var isOnSale = (dateDiff('n', onSaleDate, today) > 0)?true:false;
                        var site = new Site();
                        var tmPrefix = site.getTmPrefix();
                        if (!tmPrefix) tmPrefix = '';
                        for (var j = 0; j < perfs.length; j++) {
                                var eventDate = createDateObj(getNodeValueByChildName(perfs[j], 'event_date'));
                                if (dateDiff('n', today, eventDate) >= 0) {
                                        var row = document.createElement('tr');
                                        var dateInfo = monthName(eventDate, true) + ' ' + eventDate.getDate();
                                        row.appendChild(Builder.node('td', {className:'date'}, [dateInfo]));
                                        if (isTeam) {
                                                var name = getNodeValueByChildName(evts[i], 'name');
                                                row.appendChild(Builder.node('td', {className:'matchup'}, [name]));
                                        }
                                        var timeInfo = convertHours(eventDate) + ':' +hasZero(eventDate.getMinutes())+showAMPM(eventDate).toLowerCase();
                                        row.appendChild(Builder.node('td', {className:'time'}, [timeInfo]));
                                        if (!isTeam) {
                                                var price = getNodeValueByChildName(perfs[j], 'price');
                                                row.appendChild(Builder.node('td', {className:'price'}, [price]));
                                        }
                                        if (isOnSale) {
                                                var isSoldOut = parseInt(getNodeValueByChildName(perfs[j], 'sold_out'));
                                                if (isSoldOut) {
                                                        var soldOut = Builder.node('span', {className:'sold-out'}, ['Sold Out']);
                                                        row.appendChild(Builder.node('td', {className:'options'}, [soldOut]));
                                                } else {
                                                        var buyUrl = getNodeValueByChildName(perfs[j], 'ticket_master_url');
                                                        var buyLnk = Builder.node('a', {className:'btn-buy-now', href:tmPrefix+buyUrl}, ['Buy Now']);
                                                        buyLnk.onclick = function() { window.open(this.href); return false; }
                                                        row.appendChild(Builder.node('td', {className:'options'}, [buyLnk]));
                                                }
                                        } else {
                                                row.appendChild(Builder.node('td', {className:'options'}));
                                        }
                                        container.appendChild(row);
                                        if (row.previousSibling && row.previousSibling.nodeName == 'TR') {
						                	var prevRow = row.previousSibling;
							                if (prevRow.className.indexOf('highlight') == -1) {
						                		row.className = 'highlight';
							                }
						                }
                                }
                        }
                }
        }
        return container.getElementsByTagName('tr').length;
};
function hideEventDates(dObj) {
	dObj.style.display = 'none';
	if ($('eventDatesFooter')) {
		$('eventDatesFooter').style.display = 'none';
	}
};