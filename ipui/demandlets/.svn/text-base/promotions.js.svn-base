/*
* promotions.js
*/
function initiate_promotions(dObj) {
	var itemId = demandletManager.setup(dObj);
	var queryString = window.location.href.split('?');
	if (queryString.length > 1) {
		queryParams = queryString[1].toQueryParams();
    	if (queryParams.p_id) {
    		var promoId = queryParams.p_id;
    	}
	}
	if (!promoId) {
		dObj.parentNode.removeChild(dObj); 
		return false;
	}	
	getPromoEvent(promoId, dObj);
};
function getPromoEvent(promoId, dObj) {
	var itemId = dObj.id;
	var divLeft = Builder.node('div', {id:'event-left'});
	var divRight = Builder.node('div', {id:'event-right'});
	var evtWrapper = Builder.node('div', {id:'event-wrapper', className:'clearfix'}, [divLeft, divRight]);
	var url ='/ajax/data/promotion_'+promoId+'.xml';
	new Ajax.Request( url, 
		{
			method: 'get',
			parameters: 'nC='+noCache(),
			onFailure: function() { dObj.parentNode.removeChild(dObj); },
			onSuccess: function(xml) {
				var firstNode = get_firstchild(xml.responseXML.documentElement);
        		var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
        		if (!x.length || x[0].nodeName.toLowerCase() == 'xml') {
                        	dObj.style.display = 'none';
                } else {
        			x = x[0];
        			var perfs = x.getElementsByTagName('performance'); 
        			var perfDatesStr = getPromoPerfDates(perfs);
        			var eventName = getNodeValueByChildName(x, 'event_name');
        			var promoName = getNodeValueByChildName(x, 'name');
        			var location = getNodeValueByChildName(x, 'location');
        			dObj.appendChild(getEventInfo(promoName, eventName, perfDatesStr, location));
        			dObj.appendChild(Builder.node('div', {className:'evtbnrbg'}));
        			dObj.appendChild(evtWrapper);
        			
        			var imgFileName = getNodeValueByChildName(x, 'large_image_url');
        			var img = Builder.node('img', {src:imgFileName, alt:eventName});
        			var imageHolder = Builder.node('div', {className:'event-photo'}, [img]);
        			divLeft.appendChild(imageHolder);
        			var promoInfo = Builder.node('div', {id: itemId+'PromoInfo'});
	        		var promoCode = getNodeValueByChildName(x, 'promo_code');
	        		if (promoCode) {
	        			var codeHolder = document.createElement('p');
						codeHolder.innerHTML = '<strong>Promotion Code:</strong> <span id="'+itemId+'PromoCode">'+promoCode+'</span>';
						promoInfo.appendChild(codeHolder);
	        		}
	        		var startDate = createDateObj(getNodeValueByChildName(x, 'start_date'));
	        		var endDate = createDateObj(getNodeValueByChildName(x, 'end_date'));
	        		if (isDate(startDate) && isDate(endDate)) {
	        			var dateHolder = document.createElement('p');
	        			var dateStr = getDateString(startDate, endDate);
	        			dateHolder.innerHTML = '<strong>Valid Dates:</strong> <span id="'+itemId+'ValidDates">'+dateStr+'</span>';
	        			promoInfo.appendChild(dateHolder);
	        		}
	        		if (promoInfo.hasChildNodes) {
	        			divLeft.appendChild(promoInfo);
	        		}
	        		var desc = getNodeValueByChildName(x, 'description');
	        		if (desc) {
	        			divLeft.appendChild(Builder.node('p', [desc]));
	        		}
	        		var perfs = x.getElementsByTagName('performance');
	        		if (perfs.length) {
	        			getPromoDates(perfs, divRight);
	        		}
        		}
			}	
		}
	);
};
function getEventInfo(n, en, ds, l) {
	var t = Builder.node('h2', [en]);
	var m = Builder.node('h3', [ds, ' at ', l])
	var b = Builder.node('h4', [n]);
	return Builder.node('div', {id:'event-info', className:'clearfix'}, [t, m, b]);
};

function getPromoDates(perfs, divRight) {
	getServerTime();
	var today = new Date(server_time);
	today.setHours(today.getHours()-4);
	if (perfs) {
		var table = document.createElement('table');
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);
		var h2 = Builder.node('h2', ['Get Tickets']);
		var divTable = Builder.node('div', {className:'promo-dates'}, [h2, Builder.node('div', {className:'scroll'}, [table])]);
		var highlight = false;
		for (var i = 0; i < perfs.length; i++) {
			var eventDate = createDateObj(getNodeValueByChildName(perfs[i], 'event_date'));
			if (dateDiff('n', today, eventDate) > 0) {
				var rec = document.createElement('tr');
				rec.appendChild(Builder.node('td', {className:'date'}, [monthName(eventDate, true), ' ', eventDate.getDate()]));
				rec.appendChild(Builder.node('td', {className:'time'}, [convertHours(eventDate),':',hasZero(eventDate.getMinutes()), showAMPM(eventDate).toLowerCase()]));
				rec.appendChild(Builder.node('td', {className:'price'}, [getNodeValueByChildName(perfs[i], 'price')]));
				var isSoldOut = parseInt(getNodeValueByChildName(perfs[i], 'sold_out'));
				var options = Builder.node('td', {className:'options'});
				if (isSoldOut) {
					var optsChild = Builder.node('span', {className:'sold-out'}, ['Sold Out']);
				} else {
					var purchaseUrl = getNodeValueByChildName(perfs[i], 'ticket_master_url');
					var optsChild = Builder.node('a', {href:purchaseUrl, className:'btn-buy-now'}, ['Buy Now']);
				}
				options.appendChild(optsChild);
				rec.appendChild(options);
				if (highlight) {
					rec.className = 'highlight';
					highlight = false;
				} else {
					highlight = true;
				}
				tbody.appendChild(rec);
			}
		}
	}
	if (tbody.getElementsByTagName('tr').length) {
		divRight.appendChild(divTable);
		var p = Builder.node('p', ['Tickets prices subjected to Ticketmaster surcharge.']);
		var ul = Builder.node('ul', {className:'icon-options'});
		ul.appendChild(Builder.node('li', [Builder.node('a', {className:'icon-seating', href:'/seating/'}, ['Seating Chart'])]));
		var footer = Builder.node('div', {className: 'eventDates-options'}, [p, ul]);
		divRight.appendChild(footer);
	}
};
function getPromoPerfDates(perfs) {
	var perfDate1 = createDateObj(getNodeValueByChildName(perfs[0], 'event_date'));
	if (perfs.length > 1) {
		var perfDate2 = createDateObj(getNodeValueByChildName(perfs[perfs.length-1], 'event_date'));	
	}
	return getDateString(perfDate1, perfDate2);
};
function getDateString(d1, d2) {
	var dStr = '';
	dStr += monthName(d1, true) + ' ' + d1.getDate();
	if (d2) {
		if (d1.getFullYear() != d2.getFullYear()) {
			dStr += ' ' + d1.getFullYear() + ' - ' + monthName(d2, true) + ' ' + d2.getDate();
			dStr += ' '+ d2.getFullYear();
		} else {
		 	if (d1.getMonth() == d2.getMonth()) {
        		if (d1.getDate() != d2.getDate()) {
					dStr += '-' + d2.getDate();
                }
            } else {
				dStr += ' - ' + monthName(d2, true) + ' ' + d2.getDate();
			}
		}
	}
	return dStr;
};