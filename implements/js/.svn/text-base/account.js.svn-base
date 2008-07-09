/*
* Interactive Partners Inc 2007
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
* Name: My Account Lib
* Author: Bryan Borst
* Created: 10/20/2007
*/

function accountPreview() {
	var user= new userManager();
	if (user.check() == false) {
		lbCall();		
	}
	else {
		var display = new painter();
		display.loadLayout('/ajax/layouts/myaccountStart.html',{target:'centercolumn',onComplete:'accountLoadComplete()'});
	}
}

function lbCall() {
	var lnk = $('accountSignIn');	 	
	new lightbox(lnk, {oncomplete: function () {
		var loginBtn = $('login-btn');
		if (loginBtn) {
			loginBtn.onclick = function () {	
				var flag = true;					
				signInSubmit(this.form, flag);
			}
			var lk = $('createaccount');		
			new lightbox(lk, {oncomplete: function () {
				var createBtn = $('create-btn');
				if (createBtn) { 
					createBtn.onclick = function () { 
						var flag = true;	
						createAccount(this.form, flag);
					}
				}
			}});
			var hrf = $('forgotpass');		
			new lightbox(hrf, {oncomplete: function () {
				var resetBtn = $('resetpw-btn');
				if (resetBtn) {
					resetBtn.onclick = function () {								
						submitPasswordReset(this.form);
					}
				}
						
			}});
		}
	}});
}

function accountLoadComplete() {
	personalize();
	addAddressLink();
}
function personalize() {
	var user= new userManager();
    $("accountHdr").innerHTML = '<p><strong>Hello, ' + user.getFirstName() + '!</strong></p>'
}

function addAddressLink() {	
	$("addNewAddress").innerHTML = '<a id="new-address" href="/ajax/layouts/addressformLayout_' + getCountry() + '.html">Add a new Address</a>';
	
	var lk = $('new-address');		
	new lightbox(lk, {oncomplete: function() {
		var newSubmit = "new";
		address.createSubmit(newSubmit); 
		}}
		);
}
function loadAddressBook() {
	var display = new painter();
	display.loadLayout('/ajax/layouts/addressbookLayout.html',{target:'centercolumn',onComplete:'address.display(formatAddressBookLayout())' });		
}
function formatAddressBookLayout() {
	$('myAccountAddress').innerHTML = '<h1 class="title"><span><a id="new-address" href="/ajax/layouts/addressformLayout_' + getCountry() + '.html">Add New Address</a></span> Address Book</h1>';
	
	Form.getInputs($('addressBookForm'),'radio').invoke('hide');
		
	var lk = $('new-address');		
	new lightbox(lk, {oncomplete: function() {
		var newSubmit = "new";
		address.createSubmit(newSubmit); 
		}});	
}

function giftCertPreview() {
	var display = new painter();
	display.loadLayout('/ajax/layouts/giftcertificate.html',{target:'centercolumn'});			
}
function giftValidate(formObj) {	
	if(checkForm(formObj)==true) {
		$('failed').hide();
		$('Amount').innerHTML='';
		(getCountry()=='US') ? storeID	= 'USA' : storeID = 'CAN';
		var gift_code = $('Code').value;
		gift.balance(gift_code,storeID,{
			onSuccess:'$(\'Amount\').innerHTML=\'$\'+amount',
			onFailure:'$(\'failed\').show();'
		})
	}
	return false;
}
function addToCart(formObj) {
	var errFlag     = false;
	var slObj		= Form.getInputs(formObj,'radio').find(function(item){return item.checked;});
	if(slObj==undefined) {
            errFlag=true;
    }
	else if(slObj.value=='Email Recipient') {
	   if(checkFormElement($('sendEmail'),{required:'true'})==false) {
	   	alert('Please enter valid email address');
		errFlag=true;
	   }
	}

	if(errFlag==false && checkForm(formObj)) {
		var gift 	    	= new giftManager();
		var product_format 	= slObj.value;
		if(product_format=='Email Recipient'){product_format='Email Recipient:'+$F('sendEmail')}
		var gift_number 	= $("productId").value;	
		var giftObj			= gift.getType(gift_number);
		cart.add(gift_number,{
			product_image:'/media/products/thumbnail_gift_certificate.jpg',
			product_price:giftObj.amount,
			product_name:giftObj.name,
			product_format:product_format,
			gift_to:$F('toName'),
			gift_message:$F('message'),
			gift_email: $F('sendEmail'),
			product_number:gift_number,
			product_shipping:'digital'
		});			
		Form.reset('gcForm');
		$('sendEmail').removeAttribute('required');
	}
}
function displayUpdateEmailPass() {
	var display = new painter();
	var complete = 'getOptins($("updateAccount-optins")); changeCountryLinks(document.getElementsByClassName("change-country"));';
	display.loadLayout('/ajax/layouts/changeEmailPass.html',{target:'centercolumn', onComplete:complete});			
}
function updateAccount(fObj) {
	var user = new userManager();
	user.update($('uform'),{onComplete:'updateComplete()'});
	return false;
}
function updateComplete(){
	signInTxt();
	myAccountLink()
}



//Order Information
//DEV
function ordersDetailsPage(orderId) {
	
	//alert(orderId);
	var display = new painter();
	display.loadLayout('/ajax/layouts/orderDetails.html',{target:'centercolumn',onComplete:'controleRightCol()'});
	return false;	
}
function ordersLookUp() {
	getOrderStatus($('centercolumn'));	
}




function orderRow(order) {	
	$('openOrders').innerHTML += "<table class='order-table'> " +
	"<tr><td class='orderno'>" + order.OrderNumb + "</td>" +
	"<td class='orderdate'>" + formatDate(order) + " </td>" +
	"<td class='status'>" + order.OrderStatus.Item['1'].getStatusMsg() + " </td>" +
	"<td class='ordertotal'>" +displayTotalCost(order) + "</td>"+
	"</tr>"+
	"</table>"	
};


function displayTotalCost(order){	
	var total = 0.0;	
	var unitPrice = getTotals(order, 'UnitPrice');	
	var shipHandAmt = getTotals(order, 'ShipHandAmt');
	total = '$' + (parseFloat(shipHandAmt) + parseFloat(unitPrice));
	return total
}

function formatDate(order) {
	var d = new Date(order.OrderStatus.OrderDate.split('T').join(' ').split('-').join('/'));
	formatedDate = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear(); 
	return formatedDate
}

//dev does not work
function displayInOpenCompleteSec(order) {
		var statusMsg = '';
		switch (this.Status)  {
			case '01':
			case '02':
			case '03':
			case '04':
			case '05':
			case '06':
			case '07':
			case '08':
			case '09':
			case '12':
			case '13':
			case '20':
			case '22':
			case '23':
			case '24':
			case '25':
			case '21':
			case '26':
			case '50':
			case '61':
			//open orders
			statusMsg = 'Open Order Section';			
			break;
			
			case '28':
			case '29':
			case '30':
			case '31':
			case '32':
			case '33':
			case '40':
			case '42':
			case '43':
			case '60':
			//Completed Orders
			statusMsg = 'Completed Order Section';			
			break;
		}
		alert(statusMsg);
};

function newDisplay(options){
	var storeIds = { US: 'USA', CA: 'CAN' };
	var orderParams = {
		user_id: user.getUserId(),
		StoreID: storeIds[getCountry()]
	};
	
	new Ajax.Request(
		'/ajax/data/ordstatusresults-Shpped2.xml',
		//'/ajax/orderHistory.jsp',
		{
	  		method: 'post', 
	  		parameters: orderParams,
			onComplete: this.newDisplay_complete.bindAsEventListener(this,options)
		});				
};

