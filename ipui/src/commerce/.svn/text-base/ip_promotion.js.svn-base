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

* Name: Promo Manager Class
* Author: Nicholas A.L. Hoskins
* Created: 10/10/2007
*/

var promoManager = Class.create();
	promoManager.prototype = {
	initialize: function(options) {
		this.basket = new CookieJar('promotion',{  
		    expires:'3600',     
		    path:'/'
		}); 
		this.url = '/ajax/data/';	
	},

	check: function(code,options) {			
		new Ajax.Request(
		this.url+'promo_'+code+'.xml', 
			{
			method: 'post',  
			onSuccess: this.check_success.bindAsEventListener(this,options),
			onFailure: this.check_fail.bindAsEventListener(this,options)
			}
   		);
	},

	check_success: function(response,options) {
		if(options.onSuccess) eval(options.onSuccess);
	},
	
	check_fail: function(response,options) {
		if(options.onFailure) eval(options.onFailure);
	},

    add: function(code,options) {
		new Ajax.Request(
		this.url+'promo_'+code+'.xml', 
			{
			method: 'post',  
			onSuccess: this.process.bindAsEventListener(this,options)
			}
   		);
    },

	getItemByCode: function(code) {
		return this.basket.get(code);
	},

	getContentObj: function() {
		return this.basket.getPack()
	},
		
    process: function(xml,options) {
        var rules          = xml.responseXML.getElementsByTagName('rules');
        var identity        = xml.responseXML.getElementsByTagName('identity');
        var display = new painter();
        if(rules.length>0 && identity.length>0) {
			this.empty();//no promo combinations so clear out previously entered promo codes
            if(getNodeValueByChildName(rules[0],'country')==getCountry()) {
                this.basket.put(getNodeValueByChildName(identity[0],'code'),{
                    min_purchase: getNodeValueByChildName(rules[0],'min-purchase') ,
                    country: getNodeValueByChildName(rules[0],'country'),
                    uses: getNodeValueByChildName(rules[0],'uses'),            
                    type: getNodeValueByChildName(rules[0],'type'),
                    unit: getNodeValueByChildName(rules[0],'unit'),
                    amount: getNodeValueByChildName(rules[0],'amount'),
                    apply_to: getNodeValueByChildName(rules[0],'apply-to'),
                    valid_from: getNodeValueByChildName(rules[0],'valid-from'),
					valid_until: getNodeValueByChildName(rules[0],'valid-until'),
					description: getNodeValueByChildName(identity[0],'description')
                    });
            }
        }
		if(options.onComplete) eval(options.onComplete);
    },
	
	empty: function() {
		try {
			this.basket.empty();
			return true;
		}
		catch(err) {
			return false;
		}
	}  
};



