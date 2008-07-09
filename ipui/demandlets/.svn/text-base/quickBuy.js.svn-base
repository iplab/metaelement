/**
 * quickBuy.js
 */
function initiate_quickBuy(dObj) {
        getServerTime();
        var today = new Date(server_time);
        var qbTxt = Builder.node('label', ['Quick Buy:']);
        qbTxt.setAttribute('for', 'qb_dd');
        var qbSelect = document.createElement('select');
        addOption(qbSelect, 'Loading...');
        dObj.appendChild(qbTxt);
        dObj.appendChild(qbSelect);
        var qkBuys = new Object();
        var eventNames = new Array();
        getQBEvents(qkBuys, eventNames, qbSelect, today);
        addQBOptions(qkBuys, eventNames, qbSelect);
        qbSelect.onchange = gotoEventsPage;
};
function getQBEvents(qbList, evNames, selObj, today) {
    new Ajax.Request('/ajax/data/quickbuy.xml', { asynchronous: false, method:'get', parameters:'nC='+noCache(),
    	onFailure: function() {qbList.parentNode.style.display = 'none';},
        onSuccess: function(xml) {
            var firstNode = get_firstchild(xml.responseXML.documentElement);
            var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
            var pageStr = '';
            var site = new Site();
            var siteId = site.getSiteId();
            for (var i = 0; i < x.length; i++) {
				 var begin = createDateObj(getNodeValueByChildName(x[i], 'calendar_start_date'));
				 var end = createDateObj(getNodeValueByChildName(x[i], 'calendar_end_date'));
				 if (dateInRange(today, begin, end)) {
				    var name = getNodeValueByChildName(x[i], 'name');
				    var isTeamEvent = parseInt(getNodeValueByChildName(x[i], 'team_event'));
				    if (isTeamEvent && siteId == 1) {
				   		var page_name = getNodeValueByChildName(x[i], 'page_name');
				    	if (pageStr.indexOf(page_name) == -1) {
				    		pageStr += page_name+':';
					    	var re = /(knicks|rangers|liberty)/i;
					    	var teamName = name.match(re);
					    	if (teamName != null) {
					    		teamName = teamName[0];
						    	if (/knick/i.test(teamName)) {
						    		teamName = 'New York Knicks Games';
						    	} else if (/ranger/i.test(teamName)) {
						    		teamName = 'New York Rangers Games';
						    	} else if (/liberty/i.test(teamName)) {
						    		teamName = 'New York Liberty Games';
								}
							} else {
								teamName = page_name.split('.html')[0];
							}
					    	var page = '/sporting-events/'+page_name;
					    	name = teamName;
					    	qbList[name] = page;
				   			evNames[evNames.length] = name;
					    }
					} else if (!isTeamEvent) {
						var page = '/events/'+getNodeValueByChildName(x[i], 'page_name');
						qbList[name] = page;
				   		evNames[evNames.length] = name;
					}
				}
			}
		} 
    });
};
function addQBOptions(qbList, evNames, selObj) {
	if (/WebKit/i.test(navigator.userAgent)) {
		evNames.sort();
	} else {
	 	evNames.sort(function(a, b) {
	 					return a.localeCompare(b);	
	 				});
 	}
    if (qbList) {
        for (var i = 0; i < evNames.length; i++) {
            addOption(selObj, evNames[i], qbList[evNames[i]]);
        }
        selObj.options[0] = new Option('Select an Upcoming Event', '');
        selObj.options[0].selected = true;
    }
};
function gotoEventsPage() {
	if (this.options[this.selectedIndex].value.length) {
    	window.location.href = this.options[this.selectedIndex].value;
    }
};