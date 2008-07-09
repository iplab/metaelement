/*
 * Sign In / Sign Out Demandlet
 */

	function initiate_signIn(dObj) {
		var itemId = demandletManager.setup(dObj);
		var siteUrl = getMetaValue('siteUrl');
		var loc = '';
		if (siteUrl) {
			loc = 'http://'+siteUrl;
		}
		if(readCookie('olio')) {
			var signInText = 'Welcome, ' + parseCookie('olio')['fname'] + ' | <a href="'+loc+'/profile.html">My Profile</a> | <a href="#" onclick="signOut();return false;">Sign Out</a>';
		}
		else{
			var signInText = '<a href="'+loc+'/registration.html">Register</a> | <a href="#" onclick="signIn();return false;">Sign In</a>';
		};
		$(dObj).innerHTML = signInText;
	};	