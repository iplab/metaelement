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
* Name: Sign In
* Author: Bryan Borst
* Created: 10/20/2007
*/

function myAccountLink() {
var user= new userManager();

	if (user.check()==true){
		$("myaccount").innerHTML = '<a href="/my-account/">My Account</a>|';
	}
	else {
		$("myaccount").innerHTML = '<a id="accountSignIn" href="/templates/html/signinGeneralLayout.html">My Account</a>|';
		
		var lnk = $('accountSignIn');		
		new lightbox(lnk, {oncomplete: function () {
			var loginBtn = $('login-btn');
			if (loginBtn) {
				loginBtn.onclick = function () { 
					signInSubmit(this.form);
				}
				
				var lk = $('createaccount');		
				new lightbox(lk, {oncomplete: function () {
					var createBtn = $('create-btn');
					if (createBtn) {
						createBtn.onclick = function () { 
							createAccount(this.form);
						}
					
					
					}
				}});
			}
		}});
	}
	signInTxt();
}
function signInTxt(){
var user= new userManager();
	if (user.check()==true){
		//alert(user.getName());
		$("signin").innerHTML = '<span style="color:#fff">Hello ' + user.getFirstName() + '!</span>' +
			'<strong style="color:#3a5e72"> | </strong><a href="#" id="log-out" onclick="signOut()"  style="text-decoration:underline">Not ' + user.getFirstName() + '?</a>';		
	
	}
	else {
		if (getCountry() == "US") {
			var shop = "America";
		}
		else{
			var shop = "Canada";
		};
		$("signin").innerHTML = '<a id="sign-in" href="/templates/html/signinGeneralLayout.html" class="btn-hdrsignin">Sign In</a>' +
			'<a id="create-account" href="/templates/html/createAccount.html" >Create a BBC '+shop+' Shop Account</a>';
		
		var lk = $('create-account');		
		new lightbox(lk, {oncomplete: function () {
			var createBtn = $('create-btn');
			if (createBtn) {
				createBtn.onclick = function () { 
					createAccount(this.form, flag);
				}
			}
		}});	
		
		var lnk = $('sign-in');		
		new lightbox(lnk, {oncomplete: function () {
			var loginBtn = $('login-btn');			
			if (loginBtn) {
				loginBtn.onclick = function () { 
					signInSubmit(this.form, flag);
				}
			
				var lk = $('createaccount');		
				new lightbox(lk, {oncomplete: function () {
					var createBtn = $('create-btn');				
					if (createBtn) {
						createBtn.onclick = function () { 
							createAccount(this.form, flag);
						}
					}
				}});			
			}
		}});		
	}	
}

function signinComplete(){
	if(cartLightBox) cartLightBox.deactivate(this);
	signInTxt();
	myAccountLink()
	return true;
}

function signInSubmit(fObj, flag) {
alert(flag);
var user= new userManager();
	user.login($('loginForm'),{onComplete:'signinComplete()'});
	
}

function signOut() {
var user= new userManager();
	user.logout();
	signInTxt();
	myAccountLink()
	return true;
}
function signCreate() {
	
	var lk = $('createaccount');	
	//lk.href = "/templates/html/createAccount.html";	
	new lightbox(lk, {oncomplete: function () {
		var createBtn = $('create-btn');
		if (createBtn) {
			createBtn.onclick = function () { 
				createAccount(this.form);
			}
		}
	}});
	if(cartLightBox) cartLightBox.deactivate();
	return false;
		
}
function createAccount(fObj) {
var user = new userManager();
	user.create($('cform'),{onComplete:'createComplete()'});
	return false;
}
function createComplete(){
	if(cartLightBox) cartLightBox.deactivate(this);
	signInTxt();
	myAccountLink()
}


		