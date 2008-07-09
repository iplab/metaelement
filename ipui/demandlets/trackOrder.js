function checkGuestOrders(container) {
	if ($(container)) {
		var formObj = $('non-registered');
		if (formObj) {
			var errorMsg = [];
			formObj.getInputs('text').each(function(input) {
				if (/email/i.test(input.name)) {
					if (!isValidEmail(input.value)) {
						errorMsg.push(input.name + ' is not valid.');
					}
				}
				if (input.value.length == 0) {
					errorMsg.push(input.name + ' is blank.');
				}
			});
			if (errorMsg.length) {
				alert('Please correct the following:\n' + (function() {
					var txt = '';
					for (var i = 0; i < errorMsg.length; i++) {
						txt += (i+1)+') The '+ errorMsg[i] + '\n';
					}
					return txt;
				})());
			} else {
				var params = formObj.serialize(true);
				params = { email: params['email address'], order_number: params['order number'] }
				checkOrderStatus(params, $(container));
			}
		}
	} else {
		alert("Sorry we're unable to process your request at this time."); 
	}
};
function checkOrderStatus(params, container) {
	var storeIds = { US: 'USA', CA: 'CAN' };
	var orderParams = {
		orderStatus: 1,
		StoreID: storeIds[getCountry()]
	};
	orderParams.email = params['email'];
	orderParams.OrderNumb = params['order_number'];
	new Ajax.Request(
		'/ajax/data/orderStatus.xml',
		{
			parameters: orderParams,
			onComplete: function (xhr) {
				if (xhr && xhr.responseXML) {
					var order = createOrder(xhr.responseXML.documentElement);
					if (order.OrderStatus.Response && /failure/i.test(order.OrderStatus.Response)) {
						alert('There was a problem with the information that was provided. Please try again later.');
					} else {
						renderMarkup(container, function () { displayContents(order); });
					}
				}
			}
		}
	);
};
function renderMarkup(container, cb) {
	new Ajax.Request(
		'/ajax/data/trackOrderLayout.html',
		{
			onSuccess: function (xhr) {
				if (xhr && xhr.responseText) {
					container.innerHTML = xhr.responseText;
					if (cb) cb();
				} 
			}
		}
	);	
};
function displayContents(order) {
	displayOrderInfo(order);
	displayAddress(order.AddressInfo.ship, 'shipping_address');
	displayAddress(order.AddressInfo.bill, 'billing_address');
	displayShippingMethod(order);
	displayItems(order);
	displayTotals(order);
};
function displayOrderInfo(order) {
	if ($('order_number')) $('order_number').innerHTML = order.OrderNumb;
	var d = new Date(order.OrderStatus.OrderDate.split('T').join(' ').split('-').join('/'));
	if ($('order_date')) $('order_date').innerHTML = monthName(d) + ' ' + d.getDate() + ', ' + d.getFullYear(); 
};
function displayAddress(address, container) {
	var addr = document.createElement('ul');
	var name = '';
	if (address.FirstName) {
		name += address.FirstName + ' ';
	}
	if (address.LastName) {
		name += address.LastName;
	}
	addr.appendChild(Builder.node('li', [name]));
	if (address.Address1) {
		addr.appendChild(Builder.node('li', [address.Address1]));
	}
	addr.appendChild(Builder.node('li', [
		(address.City || '') + ' ' + (address.State || '') + ' ' + (address.Zip || '')]));
	if ($(container) && addr.childNodes.length) {
		$(container).innerHTML = '';
		$(container).appendChild(addr);
	}
};
function displayShippingMethod(order) {
	var method = document.createElement('ul');
	if (order.OrderStatus.Tracking.ShipVia) {
		method.appendChild(Builder.node('li', [order.OrderStatus.Tracking.ShipVia]));
	}
	if (order.OrderStatus.Tracking.ShipDate) {
		var d = new Date(order.OrderStatus.Tracking.ShipDate.split('T').join(' ').split('-').join('/'));
		var shipdate = Builder.node('li', ['Shipped ' + 
											monthName(d) + ' ' + d.getDate() + ', ' + d.getFullYear() +
											' via ' + order.OrderStatus.Tracking.Carrier]);
		if (order.OrderStatus.Tracking.TrackingNum) {
			shipdate.appendChild(document.createTextNode(' with tracking number ' + order.OrderStatus.Tracking.TrackingNum));
		} else {
			shipdate.appendChild(document.createTextNode('. Tracking number is not available.'));
		}
		method.appendChild(shipdate);
	}
	if ($('shipping_method') && method.childNodes.length) {
		$('shipping_method').innerHTML = '';
		$('shipping_method').appendChild(method);
	}
};
function getTotals(order, field) {
	var items = $H(order.OrderStatus.Item);
	var total = 0.0;
	items.keys().each(function (key) {
		total += parseFloat(items[key][field] || 0);
	});
	return total;
};
function displayItems(order) {
	var table = document.createElement('table');
	table.className = 'chkout-table';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	var items = $H(order.OrderStatus.Item);
	items.keys().each(function (key) {
		var item  = order.OrderStatus.Item[key];
		var itemno = Builder.node('td', {className:'itemno'}, [item.Id]);
		var desc = Builder.node('td', {className:'desc'}, [Builder.node('h4', item.Description)]);
		var options = Builder.node('td', {clasName: 'options'}, [Builder.node('span', [item.getStatusMsg()] )]);
		var itemQty = item.Quantity || 1;
		var qty = Builder.node('td', {className: 'qty'}, [itemQty]);
		item.totalPrice =  item.UnitPrice * itemQty;
		var price = Builder.node('td', {className:'price'}, ['$'+item.totalPrice]);
		var row = Builder.node('tr', [itemno, desc, options, qty, price]);
		tbody.appendChild(row);
	});
	if ($('order-header')) {
		var tableHeader = $('order-header');
		if (tableHeader.nextSibling) {
			tableHeader.parentNode.insertBefore(table, tableHeader.nextSibling);
		} else {
			tableHeader.parentNode.appendChild(table);
		}
	}
};
function displayTotals(order){
	var costs = {};
	var total = 0.0;
	if ($('sub_total')) {
		$('sub_total').innerHTML = '$' + (costs.subtotal = getTotals(order, 'UnitPrice'));
	}
	if ($('shipping_handling')) {
		$('shipping_handling').innerHTML = '$' + (costs.shipping = getTotals(order, 'ShipHandAmt'));
	}
	for (var item in costs) {
		total += parseFloat(costs[item]);
	}
	$A($('centercolumn').getElementsByClassName('total_cost')).each(function (elem) {
		elem.innerHTML = '$' + total;
	});
};