/*
* ipui framework class file

* Interactive Partners Inc 2007
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

* Name: Gift Manager Class
* Author: Nicholas Hoskins
* Created: 10/02/2007
*/

var giftManager = Class.create();

giftManager.prototype = {
	initialize: function(options) {
		this.basket = new CookieJar('gift',{  
		    expires:'3600',     
		    path:'/'
		}); 
		this.url = '/ajax/order.jsp';
	},

	add: function(amount,code) {
		this.basket.put(code, {code:code,amount:amount});
	},
	
	create: function(formObj) {
	
	},
	
	balance: function(gift_code,storeID,options) {
		this.options = {};
		Object.extend(this.options, options || {});
		var formParams = 'gCCheck=1&Code='+gift_code+'&StoreID='+storeID;
		new Ajax.Request(
		  this.url, 
		  	{
				method: 'post', 
				parameters: formParams + '&nc='+noCache(), 
				onComplete: this.balance_complete.bindAsEventListener(this,
																		{
																			onSuccess: this.options.onSuccess, 
																			onFailure: this.options.onFailure, 
																			code:gift_code
																		})
			});	
	},
	
	balance_complete: function(response,options) {
		this.options = {};
		Object.extend(this.options, options || {});
		try {
            var amount 	= 0;
			var code	= this.options.code;
			var x 		= response.responseXML.getElementsByTagName('Amount');
			if(x.length>0) {
				amount = getNodeValue(x[0]);
				if(this.options.onSuccess) eval(this.options.onSuccess);
			}
			else {
				if(this.options.onFailure) eval(this.options.onFailure);
			}
			
		}
		catch(err) {
			if(this.options.onFailure) eval(this.options.onFailure);
		}
	},

	empty: function() {
		try {
			this.basket.empty();
			return true;
		}
		catch(err) {
			return false;
		}
	},	

	getItems: function() {
		return this.basket.getKeys();
	},
	
	getContentObj: function() {
		return this.basket.getPack()
	},
	
	getItemByCode: function(code) {
		return this.basket.get(code);
	},
			
	getTotal: function() {
		var gcList 	= this.getItems();
		var total	= 0;
		for(var i=0;i<gcList.length;i++) {
			obj	= this.getItemByCode(gcList[i]);
			total = total + parseFloat(obj.amount);
		}
		return total;
	}
};






