/*
 * recEvents.js
 */
function initiate_recEvents(dObj) {
		getServerTime();
        var today = new Date(server_time);
        today.setHours(today.getHours()-4);
        dObj.addClassName('clearfix');
        getRecEvents(today, dObj);
};
function getRecEvents(today, dObj) {
		var site = new Site();
		var dataFolder = site.getSiteFolder();
		var subtypeId = getMetaValue('event_subtype_id');
		var event_id = getMetaValue('event_id');
        if (!dataFolder || subtypeId == false || event_id == false) {
        	dObj.style.display = 'none';
        	return false;
        }
        var url = '/ajax/data/'+dataFolder+'/'+subtypeId+'_subtype.xml';
        new Ajax.Request(url, {
        		method:'get',
                parameters:'nC='+noCache(),
                onFailure:function() { dObj.style.display = 'none'; },
                onSuccess: function(xml) {
                        var firstNode = get_firstchild(xml.responseXML.documentElement);
                        var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                        if (!x.length || x[0].nodeName.toLowerCase() == 'xml') {
                        	dObj.style.display = 'none';
                		} else {
	                        var amtDisplay = 0;
	                        for (var i = 0; i < x.length; i++) {
	                        		var recEventId = getNodeValueByChildName(x[i], 'event_id');
	                        		if (recEventId == event_id) continue;
	                                if (amtDisplay == 4) break;
	                                var startDate = createDateObj(getNodeValueByChildName(x[i], 'calendar_start_date'));
	                                var endDate = createDateObj(getNodeValueByChildName(x[i], 'calendar_end_date'));
	                                if (dateInRange(today, startDate, endDate)) {
	                                        var perfs = x[i].getElementsByTagName('performance');
	                                        if (perfs.length) {
	                                                if (isValidDates(perfs, today)) {
	                                                		var pageName = getNodeValueByChildName(x[i], 'page_name');
	                                                		var name = getNodeValueByChildName(x[i], 'name');
	                                                        var img = Builder.node('img', {src:getNodeValueByChildName(x[i], 'small_image_url'),alt:name});
	                                                        if (pageName) {
	                                                        	var pageName = '/events/'+getNodeValueByChildName(x[i], 'page_name');
	                                                        	var dtName = Builder.node('dt', {className:'name'}, [Builder.node('a', {href:pageName}, [name])]);
	                                                        	var ddPic = Builder.node('dd', {className:'thumbnail', style:'padding-bottom:10px;'}, [Builder.node('a', {href:pageName}, [img])]);
	                                                        	var learnLnk = Builder.node('a', {className:'btn-learn-more', href:pageName}, ['Learn More']);
	                                                        } else {
		                                                        var dtName = Builder.node('dt', {className:'name'}, [name]);
		                                                        var ddPic = Builder.node('dd', {className:'thumbnail', style:'padding-bottom:10px;'}, [img]);
		                                                    }
	                                                        var perfDates = getPerfDates(perfs);
	                                                        var ddPerfDates = Builder.node('dd', {className:'date'}, [perfDates]);
	                                                        var venueName = getNodeValueByChildName(x[i], 'location');
	                                                        var ddVenueName = Builder.node('dd', {className:'venue'}, [venueName]);
	                                                        var row = Builder.node('dl', [dtName, ddPic, ddPerfDates, ddVenueName]);
	                                                        if (learnLnk) {
																row.appendChild(Builder.node('dd', [learnLnk]));
															}
															dObj.appendChild(row);
	                                                        ++amtDisplay;
	                                                }
	                                        }
	                                }
	                        }
	                        if (amtDisplay) {
	                                var header = Builder.node('h3', ['You might also like...']);
	                                var firstChild = dObj.firstChild;
	                                dObj.insertBefore(header, firstChild);
	                        } else {
	                        	dObj.style.display = 'none';
	                        }
	                    }
                }
        });
};
function getPerfs(perfsNodeList, today) {
        var perfsList = document.createElement('ol');
        perfsList.isMore = false;
        if (perfsNodeList) {
                for (var i = 0; i < perfsNodeList.length; i++) {
                        if (perfsList.getElementsByTagName('li').length == 5) {
                                perfsList.isMore = true;
                                break;
                        }
                        var perfDate = createDateObj(getNodeValueByChildName(perfsNodeList[i], 'event_date'));
                        if (dateDiff('n', today, perfDate) > 0) {
                                var perfDatePart = Builder.node('span', [weekdayName(perfDate, true) + ', ' + monthName(perfDate, true) + ' ' + perfDate.getDate()]);
                                var perfTimePart = Builder.node('span', [convertHours(perfDate) + ':' + hasZero(perfDate.getMinutes()) + ' ' + showAMPM(perfDate)]);
                                if (getNodeValueByChildName(perfsNodeList[i], 'sold_out') == '1') {
                                        var perfTixType = Builder.node('span', {className:'sold_out'}, ['Sold Out']);
                                } else {
                                        var tnUrl = getNodeValueByChildName(perfsNodeList[i], 'ticket_master_url');
                                        var perfTixType = Builder.node('a', {href:tnUrl, className:'buy_now'}, ['Buy Now']);
                                }
                                perfsList.appendChild(Builder.node('li', [perfDatePart, ' ', perfTimePart, ' ', perfTixType]));
                        }
                }
        }
        return perfsList;
};
function isValidDates(perfs, today) {
        var isPassed = isSoldOut = true;
        for (var i = 0; i < perfs.length; i++) {
                if (getNodeValueByChildName(perfs[i], 'sold_out') == 0) {
                        isSoldOut = false;
                }
                var eventDate = createDateObj(getNodeValueByChildName(perfs[i], 'event_date'));
                if (dateDiff('n', today, eventDate) > 0) {
                        isPassed = false;
                }
        }
        if (isPassed || isSoldOut) return false;
        else return true;
};
function getPerfDates(perfs) {
        var dateStr;
        if (perfs.length) {
                var startPerfDate = createDateObj(getNodeValueByChildName(perfs[0], 'event_date'));
                if (perfs.length == 1) {
                        dateStr = monthName(startPerfDate, true) + ' ' + startPerfDate.getDate() + ', ' + startPerfDate.getFullYear();
                } else {
                        var endPerfDate = createDateObj(getNodeValueByChildName(perfs[perfs.length-1], 'event_date'));
                        var diffYears = (startPerfDate.getFullYear() != endPerfDate.getFullYear())? true: false;
                        if (diffYears) {
                                dateStr = monthName(startPerfDate, true) + ' ' + startPerfDate.getDate() + ', ' + startPerfDate.getFullYear() + ' - ' +
                                                        monthName(endPerfDate, true) + ' ' + endPerfDate.getDate() + ', ' + endPerfDate.getFullYear();
                        } else {
                        	if (startPerfDate.getMonth() == endPerfDate.getMonth()) {
                        		if (startPerfDate.getDate() != endPerfDate.getDate()) {
                        			dateStr = monthName(startPerfDate, true) + ' ' + startPerfDate.getDate() + ' - ' +
                                                        monthName(endPerfDate, true) + ' ' + endPerfDate.getDate() + ' ' + endPerfDate.getFullYear();
                        		} else {
                        			dateStr = monthName(startPerfDate, true) + ' ' + startPerfDate.getDate() + ', ' + startPerfDate.getFullYear()
                        		}
                        	} else {
                        		dateStr = monthName(startPerfDate, true) + ' ' + startPerfDate.getDate() + ' - ' +
                                          monthName(endPerfDate, true) + ' ' + endPerfDate.getDate() + ' ' + endPerfDate.getFullYear();
                        	}   
                        }
                }
        }
        return dateStr;
};