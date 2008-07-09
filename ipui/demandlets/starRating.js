/*
 * post work
 */
function getProductRating(elem) {
	new Ajax.Request(url, {
		onComplete: function (xhr) {
			if (xhr.responseXML) {
				var xml = xhr.responseXML.documentElement;
				var rating = xml.getElementsByTagName('rating')[0];
				if (rating) {
					so.write(elem);
				} else {
					elem.innerHTML = '<p> This product has not yet been rated. </p>';
				}
			}
		}
	});
};
function prepareUserOptions() {
	var acctUser = new userManager();
	var userOptions = $('productdetail').getElementsByClassName('useroptions')[0];
	var lnkTxt = { rate: 'Rate This', review: 'Write a Review', wish: 'Add to Wishlist' };
	for (var feature in lnkTxt) {
		var lnk = Builder.node('a', {feature: feature}, [lnkTxt[feature]]);
		if (acctUser.check()) {
			getFeatureData(lnk, acctUser.getUserId());
		} else {
			lnk.href = '/ajax/layouts/signinGeneralLayout.html';
			new lightbox(lnk, {oncomplete: prepareSignUp});
		}
	}
};
function getFeatureData (lnk, userId) {
	var ajaxParams = { 
		rate: {url:'/ajax/productRatingnReviews.jsp', params: { getRating: '1', product_id: getMetaValue('product_id'), user_id: userId }}, 
		review: {url:'/ajax/productRatingnReviews.jsp', params: { getReview: '1', product_id: getMetaValue('product_id'), user_id: userId }}, 
		wish: {url:'/ajax/wishList.jsp', params: { getWishList: '1', user_id: userId }} 
	};
	new Ajax.Request(ajaxParams[lnk.feature][url], {	
		parameters: ajaxParams[lnk.feature][params],
		onComplete: function (xhr) {
			lnk.xmlNode = xhr.responseXML.documentElement; 
			setFeature(lnk); 
		}
	});
};
function setFeature(lnk) {
	var popupHtml = { rate: '/ajax/layouts/rateproduct-popup.html', review: '/ajax/layouts/reviewLayout.html', wish: '/wishlist.html' };
	lnk.href = popupHtml[lnk.feature];
	if (/(rate|review)/i.test(lnk.feature)) {
		new lightbox(lnk, { oncomplete: function () { prepareFeature(lnk.xmlNode, lnk.feature); }});
	} else {
		var pidNodes = lnk.xmlNode.getElementsByTagName('product_id');
		if (pidNodes.length) {
			lnk.href += '?product_ids=';
			var pidArr = [];
			$A(pidNodes).each(function (pid) {	pidArr.push(pid); });
			lnk.href = [lnk.href, pidArr.join()].join('');
		} 
	}
};
function prepareFeature(xml, type) {
	var funcs = { 
		rate: function () {
			$$('#lightbox .rating ul').each( function (elem) {
				var myVote = parseInt(xml.getElementsByTagName('rating')[0]);
				if (myVote) {
					elem.className = 'stars_'+myVote;
				}
				Event.observe(elem, 'click', setVote.bindAsEventListener(this));
			});
		},
		review: function () {
		},
	};
	funcs[type]();
};
function setVote(e) {
	var evtTarget = e.target || e.srcElement;
	var voteObj = evtTarget.href.toQueryParams();
	var _this = this;
	new Ajax.Request('/ajax/productRatingnReviews.jsp',
		{
			parameters: {saveRating: '1', product_id: getMetaValue('product_id'), user_id: userId, rating: voteObj.vote },
			onComplete: function (xhr) {
				var xml = xhr.responseXML.documentElement;
				if (xml.getElementsByTagName('response')[0].indexOf('success') > -1) {
					_this.className = 'stars_'+voteObj.vote;
				}
			}
		}	
	);
};
function prepareSignUp() {
	$('email').focus();			
	var loginLnk = $('login-btn');
	var createAcctLnk = $('createaccount');
	var forgotLnk = $('forgotpass');	
	if (loginLnk) {
		loginLnk.onclick = function () {	
			signInSubmit(this.form, true);
		}
	}	
	new lightbox(createAcctLnk, { oncomplete: function () {
		$('FirstName').focus();
		var createBtn = $('create-btn');
		if (createBtn) {
			createBtn.onclick = function () { 	
				createAccount(this.form, true);
			}
		}
	}});	
	new lightbox(forgotLnk, {oncomplete: function () {
		$('email').focus();
		var resetBtn = $('resetpw-btn');
		if (resetBtn) {
			resetBtn.onclick = function () {								
				submitPasswordReset(this.form);
			}
		}
	}});
};