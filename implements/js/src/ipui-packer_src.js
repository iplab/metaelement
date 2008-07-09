	//cdaCommon.js
 	var server_time='';
	var demandletsList = 'poll,quiz,onNow,onTonight,signIn,tvSchedule,azList,userProfile,nextShowTimes,recShows';
	Event.observe(window,'load',function(){
		if(!document.getElementById('siteList')) createCookie('defaultSite',getMetaValue('siteIdentifier'),30);
		demandletManager.load(demandletsList);
	});

	function sfHover(){
		if(document.getElementById('main_navigation')){
			new Ajax.Request
			(
			'/global/subnav.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:ajaxRequest_Error,
				onSuccess:function(t){
					$('main_navigation').innerHTML=renderMainNavigation(t,0);
					var sfEls = document.getElementById("main_navigation").getElementsByTagName("LI");
					for (var i=0;i<sfEls.length;i++){
						sfEls[i].onmouseover=function(){this.className+=' over';};
				        sfEls[i].onmouseout=function(){this.className='';};
			        }
				}
			});	
		}
	};
	
	function autoRedirect(siteIdentifier,redirectURL){if(readCookie('defaultSite')==siteIdentifier) document.location.href=redirectURL;};
	function siteRedirect(siteURL){document.location.href=siteURL;};
	function submit_FriendPopup(formObj,hideDivObj,showDivObj){
		if(checkForm(formObj)){
			var site_id 	= getMetaValue('siteIdentifier');
			var loc = window.opener.location.href;
            loc = loc.split('://');
            var link = loc[1];
			var params		= formObj.serialize();
			new Ajax.Request(
				'/ajax/sendFriend.jsp', 
				{
					method:'POST',
					parameters:'&nC'+noCache()+'&'+params+'&site_id='+site_id+'&link='+link,
					onSuccess: function(xml) 
					{
						var response 		= xml.responseXML.getElementsByTagName(get_firstchild(xml.responseXML.documentElement).nodeName);
						var responseContent = showDivObj.innerHTML;
						if (getNodeValue(response[0]) == 'success') 
							showDivObj.innerHTML = responseContent.replace('<!--response-->','Thank you, your message has been sent.');
						else
							showDivObj.innerHTML = responseContent.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
						Element.hide(hideDivObj);
						Element.show(showDivObj);
					}
				}
			);
		}
	};
	
	function open_ReminderPopup(showtitle, episode, time, scheduleid) {
		newWindow('/reminder.html?showtitle='+showtitle+'&episode='+episode+'&time='+time, scheduleid+'', 315,400,false,false,true);
	}

	
	function submit_ReminderPopup(formObj,hideDivObj,showDivObj){
		if(checkForm(formObj)){
			var params = formObj.serialize();
			new Ajax.Request(
				'/ajax/showReminderSave.jsp', 
				{
					method:'POST',
					parameters:'&nC'+noCache()+'&'+params+'&scheduleid='+window.name,
					onSuccess: function(xml) 
					{
						var response 		= xml.responseXML.getElementsByTagName(get_firstchild(xml.responseXML.documentElement).nodeName);
						var responseContent = showDivObj.innerHTML;
						if (getNodeValue(response[0]) == 'success') 
							showDivObj.innerHTML = responseContent.replace('<!--response-->','Thank you, your reminder will be sent.');
						else
							showDivObj.innerHTML = responseContent.replace('<!--response-->','Sorry there was a problem with your request. Please try again later.');
						Element.hide(hideDivObj);
						Element.show(showDivObj);
					}
				}
			);
		}
	};
		   	
	function ajaxRequest_Error(){alert("An error occurred during the process");};
	function search_Submit(sObj){
		if($F(sObj)!=''){
			if(document.getElementById('page_id')) 
				document.location.href='/search.jsp?kword='+$F(sObj)+'&page_id='+$F('page_id');
			else 
				document.location.href='/search.jsp?kword='+$F(sObj);
		}
		else{
			alert('Please enter a keyword');
		}
	};
	
	function search_Page(pNum,sObj){$('page_id').value=pNum;search_Submit(sObj);};							

	function search_tvSchedule(fObj){
		if(checkForm(fObj)){
			new Ajax.Request
			(
				'/ajax/tvScheduleProcess.jsp',
				{
					method:'POST',
					parameters:'&nC'+noCache()+'&keyword='+$F(fObj.id + '_keyword'),
					onSuccess:function (xml)
					{
						display_tvScheduleResults(xml);
					}
				}
			);
		}
	};
	
	function signIn_success(userId, userName, userEmail, userFname, userLname){createCookie('olio', userEmail+"|"+userId+"|"+userName+"|"+userFname+"|"+userLname, 30);};
	function signOut(){eraseCookie('olio');window.location.reload();};
	
	function registerUser(){
		if(checkForm($('registration_form'))){
			if($F('password')!=$F('re_password')){
				alert('Passwords do not match');
			}
			else{
				if(!$('confirm').checked){
					alert('Please agree to terms and conditions');
				}
				else{
					new Ajax.Request
					(
						'/ajax/registerProcess.jsp',
						{
							method:'POST',
							parameters: $('registration_form').serialize(),
							onFailure:ajaxRequest_Error,
							onSuccess:function (xml)
							{
								var insertStat 	= xml.responseXML.getElementsByTagName('insert')[0].firstChild ? xml.responseXML.getElementsByTagName('insert')[0].firstChild.data : '';
								var error 		= xml.responseXML.getElementsByTagName('error')[0].firstChild ? xml.responseXML.getElementsByTagName('error')[0].firstChild.data : 'Unknown error';
								if(insertStat==' Success '){
									var url			= document.location.href;
									var aryCurLoc 	= url.split('/');
									aryCurLoc[aryCurLoc.length - 1] = 'registerthankyou.jsp';
									window.location = aryCurLoc.join('/');
								}
								else{
									alert('The following error occured while trying to create your user account:\n' + error);
								}
							}
						}
					);
				}
			}
		}
	};
	
	function signIn(){
		var siteUrl = getMetaValue('siteUrl');
		var loc = '';
		if (siteUrl) {
			loc = 'http://'+siteUrl;
		}
		var loginHTML = ''
			+	'<div style="clear:both">'
			+	'</div>'
			+	'<form id="loginForm">'
			+	'<table width="320px">'
			+		'<tr>'
			+			'<td colspan="3">'
			+				'<table>'
			+					'<tr>'
			+						'<td align="right" class="grey 11px" width="130px">'
			+							'Email Address:'
			+						'</td>'
			+						'<td align="left">'
			+							'<input type="text" required alert="Please enter an email address." id="login_email">'
			+						'</td>'
			+					'</tr>'
			+					'<tr>'
			+						'<td colspan="2">'
			+							'<div style="clear:both">'
			+							'</div>'
			+						'</td>'
			+					'</tr>'
			+					'<tr>'
			+						'<td align="right" class="grey 11px">'
			+							'Password:'
			+						'</td>'
			+						'<td align="left">'
			+							'<input type="password" required alert="Please enter password." id="login_password">'
			+						'</td>'
			+					'</tr>'
			+				'</table>'
			+			'</td>'
			+		'</tr>'
			+		'<tr>'
			+			'<td colspan="3">'
			+				'<div style="clear:both">'
			+				'</div>'
			+			'</td>'
			+		'</tr>'
			+		'<tr>'
			+			'<td width="70px">&nbsp;</td>'
			+			'<td align="left">'
			+				'<a href="#" onclick="Dialog.closeInfo();forgotPassDialog(); return false;" class="red 11px">Forgot your password?</a>'
			+			'</td>'
			+			'<td align="right">'
			+				'<a href="'+loc+'/registration.html" class="red 11px">Register</a>'
			+			'</td>'
			+		'</tr>'
			+	'</table>'
			+	'</form>'
			+	'<div style="clear:both">'
			+	'</div>';

		Dialog.confirm
		(
			loginHTML,
			{
				className:"alphacube",
				width:400, 
				okLabel: "Login", cancelLabel: "Cancel",
	    		onOk:function(win)
				{
					var login_email = $('login_email').value;
					var login_password = $('login_password').value;
					if(checkForm($('loginForm'))) {						
						new Ajax.Request
						(
							'/ajax/loginProcess.jsp',
							{
								method:'POST',
								parameters:'&email=' + login_email + '&password=' + login_password,
								onFailure:ajaxRequest_Error,
								onSuccess:function (xml){
									var response 	= '';
									var userId 		= '';
									var userEmail	= '';
									var userFname	= '';
									var userLname	= '';
									var reasonText	= '';

									if(xml){
										response = xml.responseXML.getElementsByTagName('response')[0].firstChild ? xml.responseXML.getElementsByTagName('response')[0].firstChild.data : 'error';
										if(response == 'success'){
											userId 		= xml.responseXML.getElementsByTagName('identifier')[0].firstChild ? xml.responseXML.getElementsByTagName('identifier')[0].firstChild.data : 'Unknown';
											userName	= xml.responseXML.getElementsByTagName('username')[0].firstChild ? xml.responseXML.getElementsByTagName('username')[0].firstChild.data : 'Unknown';
											userEmail 	= login_email;
											userFname	= xml.responseXML.getElementsByTagName('firstname')[0].firstChild ? xml.responseXML.getElementsByTagName('firstname')[0].firstChild.data : 'Unknown';
											userLname 	= xml.responseXML.getElementsByTagName('lastname')[0].firstChild ? xml.responseXML.getElementsByTagName('lastname')[0].firstChild.data : 'Unknown';
										}
										else{
											reasonText = xml.responseXML.getElementsByTagName('cause')[0].firstChild ? xml.responseXML.getElementsByTagName('cause')[0].firstChild.data : 'Unknown';
										}
									}
									else{
										alert('An error occurred while trying to log in.\nSorry for the inconvenience.');
										return false;
									}

									if(response != 'success'){
										alert(reasonText);
										return false;
									}
									signIn_success(userId, userName, userEmail, userFname, userLname); 
									Dialog.closeInfo();
									window.location.reload();
									return true;
								}
							}
						);
					}
					else{
						return false;
					}
				}
			}
		);
	};

	function forgotPassDialog()	
	{
		var loginHTML = ''
			+	'<div style="clear:both">'
			+	'</div>'
			+	'<form id="forgotPassForm">'
			+	'<table width="400">'
			+		'<tr>'
			+			'<td class="grey 11px" align="right">'
			+				'Email Address:'
			+			'</td>'
			+			'<td align="left">'
			+				'<input required alert="Please enter your email address" type="text" id="forgotPass_email">'
			+			'</td>'
			+		'</tr>'
			+	'</table>'
			+	'</form>'
			+	'<div style="clear:both">'
			+	'</div>';

		Dialog.confirm
		(
			loginHTML,
			{
				className:"alphacube",
				width:400, 
				okLabel: "Reset", cancelLabel: "Cancel",
	    		onOk:function(win)
				{
					var email = $F('forgotPass_email');

					if(checkForm($('forgotPassForm'))) 
					{
						var site_id = getMetaValue('siteIdentifier');
						new Ajax.Request
						(
							'/ajax/resetPasswordProcess.jsp',
							{
								method:'POST',
								parameters:'&email=' + email + '&site_id=' + site_id,
								onFailure:ajaxRequest_Error,
								onSuccess:function (xml){
									var response = '';

									if (xml){
										response = xml.responseXML.getElementsByTagName('response')[0].firstChild ? xml.responseXML.getElementsByTagName('response')[0].firstChild.data : 'Error';
										if (response != 'success'){
											reasonText = xml.responseXML.getElementsByTagName('cause')[0].firstChild ? xml.responseXML.getElementsByTagName('cause')[0].firstChild.data : 'Unknown';
											alert(reasonText);
											return false;
										}
									}
									else{
										alert('An error occurred while trying to reset the password.\nSorry for the inconvenience.');
										Dialog.closeInfo();
										return false;
									}

									alert('The password for this account has been reset and the new password has been sent to the email address.');
									Dialog.closeInfo();
									return true;
								}
							}
						);
					}
					else{
						return false;
					}
				}
			}
		);
	};

	function loadProfilePassword(){profilePassword=Math.floor(Math.random()*999999999999)+'';$('password').value=profilePassword;$('re_password').value=profilePassword;};

	function saveProfile(){
		if(checkForm($('profile_form'))) 
		{
			if($F('password')!=$F('re_password')){
				alert('Passwords do not match');
			}
			else{
				if(profilePassword == $('password').value){
					$('password').disabled 		= true;
					$('re_password').disabled 	= true;
				}

				new Ajax.Request
				(
					'/ajax/registerProcess.jsp',
					{
						method:'POST',
						parameters: $('profile_form').serialize(),
						onFailure:ajaxRequest_Error,
						onSuccess:function (xml){
							$('password').disabled 				= false;
							$('re_password').disabled 			= false;
							$('saveSuccess').style.visibility	= 'visible';
						}
					}
				);
			}
		}
	};
	
	function render_timeZoneList(dObj){
		removeAllOptions(dObj);
		new Ajax.Request
		(
			'/ajax/data/timeZoneList.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:function(err){
					addOption(dObj,'No Timezones Found','',false);
				},
				onSuccess:function(xml){ 
					xml.responseXML.getElementsByTagName(firstNode.nodeName).each(function(xmlNode)
					{
						var category_id 		= getNodeValue(xmlNode,getNodeAttribute(xmlNode,'pk'));
						var program_title 		= getNodeValue(xmlNode,'program_title');
						var program_date_time 	= getNodeValue(xmlNode,'program_date_time');
						addOption(dObj,program_title,category_id,false);
					});
				}
			}
		);
	};

	function render_programList(dObj){
		removeAllOptions(dObj);
		new Ajax.Request
		(
			'/ajax/data/programList.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:function(err)
				{
					addOption(dObj,'No Programs Found','',false);
				},
				onSuccess:function(xml){ 
					var firstNode 	= get_firstchild(xml.responseXML.documentElement);
					var x 			= xml.responseXML.getElementsByTagName(firstNode.nodeName);
					for (var i=0;i<x.length;i++){
						var category_id 		= getNodeValue(x[i],'category_id');
						var program_title 		= getNodeValue(x[i],'display_name');
						addOption(dObj,program_title,category_id,false);
					};
				}
			}
		);
	};	

	function render_CountryList(dObj){
		removeAllOptions(dObj);
		new Ajax.Request
		(
			'/ajax/data/countryList.xml',
			{
				method:'POST',
				asynchronous:false,
				parameters:'&nC'+noCache(),
				onFailure:function(err)
				{
					addOption(dObj,'No Countries Found','',false);
				},
				onSuccess:function(xml){ 
					var x = xml.responseXML.getElementsByTagName('country');
					for (var i=0;i<x.length;i++){
						var country = getNodeValueByChildName(x[i],'name');
						addOption(dObj,country,country,false);
					};
				}
			}
		);
	};	

	function changeColorTheme(){
        var now 	= new Date();
        var now_hr 	= now.getHours();
        var cssfile = '';
        if (now_hr >= 4 && now_hr < 12) {
                cssfile		='/media/global/lifestyle-orange.css';
				flashColor 	= 'orange';
		} else if (now_hr >= 12 && now_hr < 18) {
                cssfile		= '/media/global/lifestyle-green.css';
				flashColor 	= 'green';
		} else if ((now_hr >= 18 && now_hr <= 23) || (now_hr >= 0 && now_hr < 4)) {
                cssfile		= '/media/global/lifestyle-purple.css';
				flashColor 	= 'purple';
		}
        document.write('<link rel="stylesheet" type="text/css" href="' + cssfile + '" />');
	};
	
	function renderMainNavigation(req,parent_id){
		var tmp			= '';
		var subTmp		= '';
		var subNodes	= '';
		var k			= req.responseXML.getElementsByTagName('nav');
		var navLen		= k.length;
		for(var j=0;j<k.length;j++){
			tmp					= '';
			subNodes			= '';
			var nLabel			= getNodeAttribute(k[j],'label');
			var nUrl			= getNodeAttribute(k[j],'url');
			var popup			= getNodeAttribute(k[j],'popup');
			var popupWidth		= getNodeAttribute(k[j],'width');
			var popupHeight		= getNodeAttribute(k[j],'height');
			var popupScroll		= getNodeAttribute(k[j],'scroll');
			var popupToolbar	= getNodeAttribute(k[j],'toolbar');
			var popupResize		= getNodeAttribute(k[j],'resize');
			var nParent			= getNodeAttribute(k[j],'parent_id');
			var nOrder			= getNodeAttribute(k[j],'order');
			var nId				= getNodeAttribute(k[j],'nav_id');
			var topImg			= 'top_'+nId;
			if(nParent==parent_id){
				if(parent_id==0){
					if(popup=='1')
						tmp+='<a class="nav_' + SearchAndReplace(nLabel.toLowerCase(),' ', '') + '" href="#" onclick="open_win('
							+ '\'' + nUrl + '\','+'\''+nLabel+'\','
							+ '\'toolbar=' + popupToolbar
							+ ',scrollbars='+popupScroll+','
							+ 'location=0,resizable='+popupResize+','
							+ 'width='+popupWidth
							+ ',height='+popupHeight
							+ '\');this.blur();return false;">';
					else
						tmp += '<a class="nav_' + SearchAndReplace(nLabel.toLowerCase(),' ', '') + '" href="'+nUrl+'">';
						eval('pic'+j+'= new Image(1,1)');
						eval('pic'+j+'.src="/media/global/nav_' + SearchAndReplace(nLabel.toLowerCase(),' ', '') + '_active.png"');	
						
					tmp += '<span>' + nLabel + '</span></a>';
					subNodes = renderMainNavigation_sub1(req,nId,topImg);
					if(subNodes!='')
						tmp+='<ul>'+subNodes+'</ul>';
				}
			}
			if(tmp!='')
				subTmp += '<ul><li>'+tmp+'</li></ul>';
		}
		return subTmp;
	};
	
	function renderMainNavigation_sub1(req,parent_id,mainImage){
		var tmp			= '';
		var subTmp		= '';
		var subNodes	= '';
		var k			= req.responseXML.getElementsByTagName('nav');
		for(var j=0;j<k.length;j++){
			tmp	='';
			subNodes='';
			var nLabel			= getNodeAttribute(k[j],'label');
			var nUrl			= getNodeAttribute(k[j],'url');
			var popup			= getNodeAttribute(k[j],'popup');
			var popupWidth		= getNodeAttribute(k[j],'width');
			var popupHeight		= getNodeAttribute(k[j],'height');
			var popupScroll		= getNodeAttribute(k[j],'scroll');
			var popupToolbar	= getNodeAttribute(k[j],'toolbar');
			var popupResize		= getNodeAttribute(k[j],'resize');
			var nParent			= getNodeAttribute(k[j],'parent_id');
			var nOrder			= getNodeAttribute(k[j],'order');
			var nId				= getNodeAttribute(k[j],'nav_id');
			if(nParent==parent_id){
				tmp+='<li>';
				if(popup=='1')
					tmp+='<a href="#" '
					 + 'onclick="open_win(\'' + nUrl + '\',\''+nLabel+'\',\'toolbar='
					 + popupToolbar+',scrollbars='+popupScroll+',location=0,resizable='
					 + popupResize+',width='+popupWidth+ ',height='+popupHeight
					 + '\');this.blur();return false;">' + nLabel + '</a>';
				else
					tmp+='<a href="'+nUrl+'">' + nLabel + '</a>';
					
				subNodes=renderMainNavigation_sub2(req,nId);
				if(subNodes!='')
					tmp+='<ul>'+subNodes+'</ul>\n';
			}
			if(tmp!='')
				subTmp+=tmp+'</li>\n';
		}
		return subTmp;
	};
	
	function renderMainNavigation_sub2(req,parent_id){
		var tmp='';
		var subTmp='';
		var k=req.responseXML.getElementsByTagName('nav');
		for (var j=0;j<k.length;j++){
			tmp='';
			var nLabel=getNodeAttribute(k[j],'label');
			var nUrl=getNodeAttribute(k[j],'url');
			var popup=getNodeAttribute(k[j],'popup');
			var popupWidth=getNodeAttribute(k[j],'width');
			var popupHeight=getNodeAttribute(k[j],'height');
			var popupScroll=getNodeAttribute(k[j],'scroll');
			var popupToolbar=getNodeAttribute(k[j],'toolbar');
			var popupResize=getNodeAttribute(k[j],'resize');
			var nParent=getNodeAttribute(k[j],'parent_id');
			var nOrder=getNodeAttribute(k[j],'order');
			var nId=getNodeAttribute(k[j],'nav_id');
			if(nParent==parent_id){
				tmp+='<li>';
				if(popup=='1'){
					tmp += '<a href="#" onclick="open_win('+'\''+nUrl+'\','+'\''+nLabel+'\','
					+ '\'toolbar='+popupToolbar+','+'scrollbars='+popupScroll+','+'location=0,'
					+ 'resizable='+popupResize+','+'width='+popupWidth+','+'height='+popupHeight
					+ '\');this.blur();return false;">' + nLabel + '</a>';
				}
				else{
					tmp+='<a href="'+nUrl+'">' + nLabel + '</a>';
				}
				if(tmp!=''){
					tmp+='</li>\n';
				}
			}
			if(tmp!=''){
				subTmp+=tmp;
			}
		}
		return subTmp;
	};	
	
	//ip_common.js
	function newWindow(wURL,wName,wWidth,wHeight,wScroll,wResizable,wCentered){
		var settings = 'height='+wHeight+',width='+wWidth+'scrollbars='+wScroll+',resizable='+wResizable;
		if(wCentered==true){
			lPosition	= (screen.width) ? (screen.width-wWidth)/2 : 0;
			tPosition	= (screen.height) ? (screen.height-wHeight)/2 : 0;	
			settings	+= ',left=' + lPosition + ',top=' + tPosition;
		}
		var nWindow	= window.open(wURL,wName,settings);
		nWindow.focus();
	};
	
	function disableContextMenu(event) {
		Event.stop(event); 
    	event.oncontextmenu = function(){return false;}
	};
		
	function truncateText_Append(txtString,len,append){
		  var trunc = txtString;
		  if (trunc.length > len){
		    trunc = trunc.substring(0, len);
		    trunc = trunc.replace(/\w+$/, '');
		    trunc += append;
		  }
		  return trunc;
	};

	function getPage(url){return url.substring(url.lastIndexOf('/') + 1);};
	
	function hasZero(value){
		if(value+0<10)
			return '0' + value;
		else
			return '' + value;
	};
	
	function noCache(){return Math.random(0, 1000)+'='+Math.random(0,1000);};
	function uniqueId(){return Math.random(0, 1000);};
	function addDays(myDate,days){return new Date(myDate.getTime() + days*24*60*60*1000);};	

	function getMetaValue(metaName){
		var metaArray = document.getElementsByTagName('meta');
		for(m=0;m<metaArray.length;m++){
			if(metaArray[m].name==metaName) {
				return metaArray[m].content;
				break;
			}	
		}
		return false;
	};
					
	function getFileExtension(fileName){
		if( fileName.length == 0 ) return ''; 
		var dot = fileName.lastIndexOf('.'); 
		if( dot == -1 ) return ''; 
		return fileName.substr(dot,fileName.length); 
	};

	function SearchAndReplace(Content, SearchFor, ReplaceWith){
	   var tmpContent = Content;
	   var tmpBefore = new String();   
	   var tmpAfter = new String();
	   var tmpOutput = new String();
	   var intBefore = 0;
	   var intAfter = 0;
	   if (SearchFor.length == 0) return;
	   while (tmpContent.toUpperCase().indexOf(SearchFor.toUpperCase()) > -1) {
	      intBefore = tmpContent.toUpperCase().indexOf(SearchFor.toUpperCase());
	      tmpBefore = tmpContent.substring(0, intBefore);
	      tmpOutput = tmpOutput + tmpBefore;
	      tmpOutput = tmpOutput + ReplaceWith;
	      intAfter = tmpContent.length - SearchFor.length + 1;
	      tmpContent = tmpContent.substring(intBefore + SearchFor.length);
	   }
	   return tmpOutput + tmpContent;
	};
	
	function createCookie(name,value,days){
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = '; expires='+date.toGMTString();
		}
		else var expires = '';
		document.cookie = name+'='+value+expires+'; path=/';
	};
	
	function readCookie(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for(var i=0;i<ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	};
	
	function eraseCookie(name){createCookie(name,'',-1);};
	
	function parseCookie() {
		var x = new Object();
		var y = readCookie('olio');
		if (y) {
			var tmp = y.split("|");
			if (tmp.length == 5) {
				x['userid'] = tmp[0]; 
				x['username'] = tmp[1];
				x['email'] = tmp[2];
				x['fname'] = tmp[3];
				x['lname'] = tmp[4];
			}
		}
		return x;
	};
	
	function loadScript(url, callback) {
		var f = arguments.callee;
		if (!("queue" in f))
			f.queue = {};
		var queue =  f.queue;
		if (url in queue) {
			if (callback) {
				if (queue[url])
					queue[url].push(callback);
				else
					callback();
			}
			return;
		}
		queue[url] = callback ? [callback] : [];
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.onload = script.onreadystatechange = function() {
			if (script.readyState && script.readyState != "loaded" && script.readyState != "complete")
				return;
			script.onreadystatechange = script.onload = null;
			while (queue[url].length)
				queue[url].shift()();
			queue[url] = null;
		};
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	};
	
	
	// ip_xml.js
	function getPropertyNodeByName(object,name){
		try{
			var propertyNode	= object.getElementsByTagName(get_firstchild(object).nodeName);
			var propertyLen		= propertyNode.length; 
			for(var j=0;j<propertyLen;j++){
				switch (getNodeAttribute(propertyNode[j],'name')){
					case  name:
						return getNodeValue(propertyNode[j]);
						break;
				}
			}
		}
		catch(err){
			return '';
		}	
	};
	
	
	function getNodeValueByChildName(node,childname){
		var tmpString='';
		try{
			if(node.getElementsByTagName(childname)[0].firstChild.nodeValue=='null') 
				return '';
			else
				for(var i=0;i<node.getElementsByTagName(childname)[0].childNodes.length;i++) 
					tmpString+=node.getElementsByTagName(childname)[0].childNodes[i].nodeValue;
				return tmpString;
		}
		catch(err){ 
			return '';
		}
	};
	
	function getNodeValue(node){
		var tmpString='';
		try{
			for(var i=0;i<node.childNodes.length;i++)
				tmpString+=node.childNodes[i].nodeValue;
			return tmpString;
		}
		catch(err){
			return '';
		}
	};
	
	function getNodeChildObj(obj,tag){
		var tmpString='';
		try{
			if(obj.getElementsByTagName(tag)[0].firstChild.nodeValue=='null')
				return '';
			else 
				return obj.getElementsByTagName(tag);
		}
		catch(err){
			return '';
		}
	};
	
	function getNodeName(obj){return obj.firstChild.nodeName;};
	
	function getNodeAttribute(obj,attr) {
		try {
			return obj.getAttribute(attr);
		}
		catch(err) {
			return '';
		}
	};
	
	function get_firstchild(n){ 
		try {
			var x=n.firstChild;
			while(x.nodeType!=1) {
				x=x.nextSibling;
			}
			return x;
		}
		catch(err) {
			return '';
		}
	};

	//ip_select.js
	function hasOptions(obj) 
	{
		if(obj!=null&&obj.options!=null)
			return true;
		else
			return false;
	};
	
	
	function selectMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,'select',false);};
	function selectOnlyMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,'select',true);};
	function unSelectMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,'unselect',false);};
	
	function removeSelectedOptions(from){
		if(!hasOptions(from))
			return;
		if(from.type=="select-one")
			from.options[from.selectedIndex]=null;
		else
			for(var i=(from.options.length-1);i>=0;i--){
				var o=from.options[i];
				if(o.selected)
					from.options[i]=null;
			}
		from.selectedIndex=-1;
	};
	
	function removeAllOptions(from){
		if(!hasOptions(from))
			return;
		for(var i=(from.options.length-1);i>=0;i--)
			from.options[i]=null;
		from.selectedIndex=-1;
	};
	
	function addOption(obj,text,value,selected){if(obj!=null&&obj.options!=null)obj.options[obj.options.length]=new Option(text,value,selected);};
	
	function removeOption(fOBJ,value){
		for(i=0;i<fOBJ.options.length;i++){
			if(fOBJ.options[i].value==value)
				fOBJ.options[i]=null;
		}
	};
	
	function getSelectList(fOBJ){
		var pars='';
		for(i=0;i<fOBJ.length;i++){
			if(i>0)
				pars=pars+',';
			pars=pars+fOBJ.options[i].value;
		}
		return pars;
	};
	
	function getSelectListSelected(fOBJ){
		var pars='';
		var count=0;
		for(i=0;i<fOBJ.length;i++){
			if(fOBJ.options[i].selected==true){
				if(count>0)
					pars=pars+',';
				count++;
				pars=pars+fOBJ.options[i].value;
			}
		}
		return pars;
	};
	
	function display_Select(sOptions,sSelected){
		var tmpData='';
		var x=sOptions.split(',');
		for(var i=0;i<x.length;i++){
			var sltcd='';
			var items=x[i].split('|');
			if(items[0]==sSelected)
				sltcd='selected="selected"';
			tmpData+='<option value="'+items[0]+'" '+sltcd+'>'+items[1]+'</option>';
		}
		return tmpData;
	};
		
	// ip_form.xml
	var dfltValue   = '**NO VALUE**';
	var dfltChars   = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.?-()[]+=_-;:/#@$%&!,*<>\"\'\n\r ';
	var dfltMethod  = 'POST';
	
	function checkForm(object){
		errFlag = false;
	    for(var i=0;i<object.elements.length;i++){
	    	if(object.elements[i].attributes['id']){
				theO		= $(object.elements[i]);
				oType		= theO.type;
		        oName  		= theO.attributes['id'].value;
				theO.name 	= oName;
		        oValue 		= $F(theO);
			    (theO.attributes["required"]) ? oReqd=true : oReqd=false;
			   	(theO.attributes["alert"]) ? oAlert=theO.attributes['alert'].value : oAlert ='';
		       	(theO.attributes["chars"]) ? oChars=theO.attributes['chars'].value : oChars=dfltChars;
		        (theO.attributes["editor"]) ? oEditor=true : oEditor=false;
		        (theO.attributes["parent"]) ? oParent=theO.attributes['parent'].value : oParent='';
				(theO.attributes["minLen"]) ? oMin=theO.attributes['minLen'].value : oMin=1;
		        (theO.attributes["maxLen"]) ? oMax=theO.attributes['maxLen'].value : oMax=100;
				if(oReqd==true||(document.getElementById(oParent)&&oParent!=''&&$(oParent).checked==true)){
		        	if(oEditor==true){
						var tmpValue = getEditor(oName);
						if(tmpValue.length<oMin || tmpValue.length>oMax){
							errFlag=true;
							if(oAlert!='') alert(oAlert);
							break;
						}
		        	}
		        	else {
			            if(oName.toLowerCase().indexOf('email')>-1){ 
			                if(isValidEmail(oValue)==false) {
			                	errFlag = true;
								if(oAlert!='') alert(oAlert);
								break;
			                }
			             } 
			             else if(validate(oValue,oChars)==false||oValue.length<oMin||oValue.length>oMax){
			             	errFlag = true;
							if(oAlert!='') alert(oAlert);
							break;
			             }
			     	}
		        }
			}
	    }
		if(errFlag==false) 
			return true;
		else 
			return false;
	};
	function isValidEmail(string){if(string.length<1)return false;if(string.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)!=-1){return true;}else{return false;}};
	function validate(strVl,strChrs){if(!strVl) return false;if(strVl==dfltValue)return false;if(strVl.length<1)return false;for(i=0;i<strVl.length;i++){if(strChrs.indexOf(strVl.charAt(i))==-1)return false;}return true;};	

	// ip_demandlet
	var demandletManager = {
		  loadJS: function(demandlet){
		  		var path = '/ipui/demandlets/';
				loadScript(path+demandlet+'.js',function(){demandletManager.start(demandlet);});		
		  },
		  loadDemandlet: function(demandlet){
		   		$$('.'+demandlet).each(function(item){eval('initiate_' + demandlet + '(item);');});
		  }, 
		  load: function(demandlets){
		      	demandlets.split(',').each(function(demandlet){if($$('.'+demandlet).length>0) demandletManager.loadJS(demandlet);});
		  },
		  start: function(demandlet){
				if($$('.'+demandlet).length>0) demandletManager.loadDemandlet(demandlet); 
		  },
		  setup: function(demandletObject){
			demandletObject.innerHTML 	= '';
			(demandletObject.getAttribute('id')) ? itemId=demandletObject.attributes['id'].value : itemId ='_'+uniqueId();
			demandletObject.setAttribute('id',itemId);
			return itemId;
		  }
	};

	//ip_date.js
	function isDate(p_Expression){return !isNaN(new Date(p_Expression));};

	function dateAdd(p_Interval, p_Number, p_Date){
		if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		if(isNaN(p_Number)){return "invalid number: '" + p_Number + "'";}	
		p_Number = new Number(p_Number);
		var dt = new Date(p_Date);
		switch(p_Interval.toLowerCase()){
			case "yyyy": {
				dt.setFullYear(dt.getFullYear() + p_Number);
				break;
			}
			case "q": {
				dt.setMonth(dt.getMonth() + (p_Number*3));
				break;
			}
			case "m": {
				dt.setMonth(dt.getMonth() + p_Number);
				break;
			}
			case "y":
			case "d":
			case "w": {
				dt.setDate(dt.getDate() + p_Number);
				break;
			}
			case "ww": {
				dt.setDate(dt.getDate() + (p_Number*7));
				break;
			}
			case "h": {
				dt.setHours(dt.getHours() + p_Number);
				break;
			}
			case "n": {
				dt.setMinutes(dt.getMinutes() + p_Number);
				break;
			}
			case "s": {
				dt.setSeconds(dt.getSeconds() + p_Number);
				break;
			}
			case "ms": {
				dt.setMilliseconds(dt.getMilliseconds() + p_Number);
				break;
			}
			default: {
				return "invalid interval: '" + p_Interval + "'";
			}
		}
		return dt;
	};
	
	function dateDiff(p_Interval, p_Date1, p_Date2, p_firstdayofweek, p_firstweekofyear){
		if(!isDate(p_Date1)){return "invalid date: '" + p_Date1 + "'";}
		if(!isDate(p_Date2)){return "invalid date: '" + p_Date2 + "'";}
		var dt1 = new Date(p_Date1);
		var dt2 = new Date(p_Date2);
		var iDiffMS = dt2.valueOf() - dt1.valueOf();
		var dtDiff = new Date(iDiffMS);
		var nYears  = dt2.getUTCFullYear() - dt1.getUTCFullYear();
		var nMonths = dt2.getUTCMonth() - dt1.getUTCMonth() + (nYears!=0 ? nYears*12 : 0);
		var nQuarters = parseInt(nMonths/3);	
		var nMilliseconds = iDiffMS;
		var nSeconds = parseInt(iDiffMS/1000);
		var nMinutes = parseInt(nSeconds/60);
		var nHours = parseInt(nMinutes/60);
		var nDays  = parseInt(nHours/24);
		var nWeeks = parseInt(nDays/7);
		var iDiff = 0;		
		switch(p_Interval.toLowerCase()){
			case "yyyy": return nYears;
			case "q": return nQuarters;
			case "m": return nMonths;
			case "y": 
			case "d": return nDays;
			case "w": return nDays;
			case "ww":return nWeeks;	
			case "h": return nHours;
			case "n": return nMinutes;
			case "s": return nSeconds;
			case "ms":return nMilliseconds;
			default: return "invalid interval: '" + p_Interval + "'";
		}
	};

	function datePart(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear){
		if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		var dtPart = new Date(p_Date);
		switch(p_Interval.toLowerCase()){
			case "yyyy": return dtPart.getFullYear();
			case "q": return parseInt(dtPart.getMonth()/3)+1;
			case "m": return dtPart.getMonth()+1;
			case "y": return dateDiff("y", "1/1/" + dtPart.getFullYear(), dtPart);			// day of year
			case "d": return dtPart.getDate();
			case "w": return dtPart.getDay();	// weekday
			case "ww":return dateDiff("ww", "1/1/" + dtPart.getFullYear(), dtPart);		// week of year
			case "h": return dtPart.getHours();
			case "n": return dtPart.getMinutes();
			case "s": return dtPart.getSeconds();
			case "ms":return dtPart.getMilliseconds();	// millisecond	// <-- extension for JS, NOT available in VBScript
			default: return "invalid interval: '" + p_Interval + "'";
		}
	};
	
	// REQUIRES: isDate()
	function monthName(p_Date, p_abbreviate){
		if(!isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		var dt = new Date(p_Date);	
		var retVal = Array('January','February','March','April','May','June','July','August','September','October','November','December')[dt.getMonth()];
		if(p_abbreviate==true){retVal = retVal.substring(0, 3)}	// abbr to 1st 3 chars
		return retVal;
	}
	
	function DateAdd(p_Interval, p_Number, p_Date){return dateAdd(p_Interval, p_Number, p_Date);};
	function DateDiff(p_interval, p_date1, p_date2, p_firstdayofweek, p_firstweekofyear){return dateDiff(p_interval, p_date1, p_date2, p_firstdayofweek, p_firstweekofyear);};
	function DatePart(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear){return datePart(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear);};
	function getTimeFromDate(date_time){return hasZero(datePart('h', date_time)) + ":" + hasZero(datePart('n', date_time));};
	
	function parseDateObj(dateobj){
		var x = new Object();
		x['month'] = hasZero(dateobj.getMonth()-1);
		x['day'] = hasZero(dateobj.getDate());
		x['year'] = dateobj.getYear();
		x['hour'] = hasZero(dateobj.getHours());
		x['minute'] = hasZero(dateobj.getMinutes());
		x['second'] = hasZero(dateobj.getSeconds());
		return x;
	};
	
	function createDateObj(date_time){return new Date(Date.parse(date_time));};
	
	function convertTimeZone(dateObj, diff){
		var tmp = "";
		var plusminus = 1;
		if (diff.split("-").length > 1){
			tmp = diff.split("-")[1];
			plusminus = -1;
		} else if (diff.split("+").length > 1){
			tmp = diff.split("+")[1];
			plusminus = 1;
		}
		if (tmp.length){
			dateObj = dateAdd('n', plusminus * tmp.split(":")[1], dateObj);
			dateObj = dateAdd('h', plusminus * tmp.split(":")[0], dateObj);
		}
		return dateObj;
	};
	
	function convertToGMT(dateObj, diff){
		var tmp = "";
		var plusminus = 1;
		if (diff.split("-").length > 1){
			tmp = diff.split("-")[1];
			plusminus = 1;
		} else if (diff.split("+").length > 1){
			tmp = diff.split("+")[1];
			plusminus = -1;
		}
		if (tmp.length){
			dateObj = dateAdd('n', plusminus * tmp.split(":")[1], dateObj);
			dateObj = dateAdd('h', plusminus * tmp.split(":")[0], dateObj);
		}
		return dateObj;
	};
	
	function getServerTime(){
		var url = '/ajax/date.jsp';
		new Ajax.Request(
		url,{
			method:'POST',
			asynchronous:false,
			parameters:'&nC'+noCache(),
			onFailure:function(err){},
			onSuccess:function(xml){
				var firstNode = get_firstchild(xml.responseXML.documentElement);
				server_time = getNodeValue(firstNode);
			}
		});
	};

	/**
	 * SWFObject v1.4.4: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
	 *
	 * SWFObject is (c) 2006 Geoff Stearns and is released under the MIT License:
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * **SWFObject is the SWF embed script formerly known as FlashObject. The name was changed for
	 *   legal reasons.
	 */
	if(typeof deconcept=="undefined"){var deconcept=new Object();}
	if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}
	if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}
	deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a,_b){if(!document.getElementById){return;}
	this.DETECT_KEY=_b?_b:"detectflash";
	this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);
	this.params=new Object();
	this.variables=new Object();
	this.attributes=new Array();
	if(_1){this.setAttribute("swf",_1);}
	if(id){this.setAttribute("id",id);}
	if(w){this.setAttribute("width",w);}
	if(h){this.setAttribute("height",h);}
	if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}
	this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();
	if(c){this.addParam("bgcolor",c);}
	var q=_8?_8:"high";
	this.addParam("quality",q);
	this.setAttribute("useExpressInstall",_7);
	this.setAttribute("doExpressInstall",false);
	var _d=(_9)?_9:window.location;
	this.setAttribute("xiRedirectUrl",_d);
	this.setAttribute("redirectUrl","");
	if(_a){this.setAttribute("redirectUrl",_a);}};
	deconcept.SWFObject.prototype={setAttribute:function(_e,_f){
	this.attributes[_e]=_f;
	},getAttribute:function(_10){
	return this.attributes[_10];
	},addParam:function(_11,_12){
	this.params[_11]=_12;
	},getParams:function(){
	return this.params;
	},addVariable:function(_13,_14){
	this.variables[_13]=_14;
	},getVariable:function(_15){
	return this.variables[_15];
	},getVariables:function(){
	return this.variables;
	},getVariablePairs:function(){
	var _16=new Array();
	var key;
	var _18=this.getVariables();
	for(key in _18){_16.push(key+"="+_18[key]);}
	return _16;},getSWFHTML:function(){var _19="";
	if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
	if(this.getAttribute("doExpressInstall")){
	this.addVariable("MMplayerType","PlugIn");}
	_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\"";
	_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";
	var _1a=this.getParams();
	for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}
	var _1c=this.getVariablePairs().join("&");
	if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";
	}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");}
	_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\">";
	_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";
	var _1d=this.getParams();
	for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}
	var _1f=this.getVariablePairs().join("&");
	if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}
	return _19;
	},write:function(_20){
	if(this.getAttribute("useExpressInstall")){
	var _21=new deconcept.PlayerVersion([6,0,65]);
	if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){
	this.setAttribute("doExpressInstall",true);
	this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));
	document.title=document.title.slice(0,47)+" - Flash Player Installation";
	this.addVariable("MMdoctitle",document.title);}}
	if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){
	var n=(typeof _20=="string")?document.getElementById(_20):_20;
	n.innerHTML=this.getSWFHTML();return true;
	}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}
	return false;}};
	deconcept.SWFObjectUtil.getPlayerVersion=function(){
	var _23=new deconcept.PlayerVersion([0,0,0]);
	if(navigator.plugins&&navigator.mimeTypes.length){
	var x=navigator.plugins["Shockwave Flash"];
	if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}
	}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}
	catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
	_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}
	catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}
	catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}
	return _23;};
	deconcept.PlayerVersion=function(_27){
	this.major=_27[0]!=null?parseInt(_27[0]):0;
	this.minor=_27[1]!=null?parseInt(_27[1]):0;
	this.rev=_27[2]!=null?parseInt(_27[2]):0;
	};
	deconcept.PlayerVersion.prototype.versionIsValid=function(fv){
	if(this.major<fv.major){return false;}
	if(this.major>fv.major){return true;}
	if(this.minor<fv.minor){return false;}
	if(this.minor>fv.minor){return true;}
	if(this.rev<fv.rev){
	return false;
	}return true;};
	deconcept.util={getRequestParameter:function(_29){
	var q=document.location.search||document.location.hash;
	if(q){var _2b=q.substring(1).split("&");
	for(var i=0;i<_2b.length;i++){
	if(_2b[i].substring(0,_2b[i].indexOf("="))==_29){
	return _2b[i].substring((_2b[i].indexOf("=")+1));}}}
	return "";}};
	deconcept.SWFObjectUtil.cleanupSWFs=function(){if(window.opera||!document.all){return;}
	var _2d=document.getElementsByTagName("OBJECT");
	for(var i=0;i<_2d.length;i++){_2d[i].style.display="none";for(var x in _2d[i]){
	if(typeof _2d[i][x]=="function"){_2d[i][x]=function(){};}}}};
	deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};
	__flash_savedUnloadHandler=function(){};
	if(typeof window.onunload=="function"){
	var _30=window.onunload;
	window.onunload=function(){
	deconcept.SWFObjectUtil.cleanupSWFs();_30();};
	}else{window.onunload=deconcept.SWFObjectUtil.cleanupSWFs;}};
	if(typeof window.onbeforeunload=="function"){
	var oldBeforeUnload=window.onbeforeunload;
	window.onbeforeunload=function(){
	deconcept.SWFObjectUtil.prepUnload();
	oldBeforeUnload();};
	}else{window.onbeforeunload=deconcept.SWFObjectUtil.prepUnload;}
	if(Array.prototype.push==null){
	Array.prototype.push=function(_31){
	this[this.length]=_31;
	return this.length;};}
	var getQueryParamValue=deconcept.util.getRequestParameter;
	var FlashObject=deconcept.SWFObject;
	var SWFObject=deconcept.SWFObject;

	/**
	 * @author Ryan Johnson <ryan@livepipe.net>
	 * @copyright 2007 LivePipe LLC
	 * @package Control.Tabs
	 * @license MIT
	 * @url http://livepipe.net/projects/control_tabs/
	 * @version 1.6.0
	 */
	if(typeof(Control) == "undefined")
		var Control = {};
	Control.Tabs = Class.create();
	Object.extend(Control.Tabs,{
		tabs: $A([]),
		responders: $A([]),
		addResponder: function(responder){
			Control.Tabs.responders.push(responder);
		},
		removeResponder: function(responder){
			Control.Tabs.responders = Control.Tabs.responders.without(responder);
		},
		notifyResponders: function(event_name,argument_one,argument_two){
			Control.Tabs.responders.each(function(responder){
				if(responder[event_name])
					responder[event_name](argument_one,argument_two);
			});
		},
		findByTabId: function(id){
			return this.tabs.find(function(tab){
				return tab.links.find(function(link){
					return link.key == id;
				});
			});
		}
	});
	Object.extend(Control.Tabs.prototype,{
		activeContainer: false,
		activeLink: false,
		initialize: function(tab_set,options){
			Control.Tabs.tabs.push(this);
			tab_set = $(tab_set);
			this.options = $H({
				beforeChange: Prototype.emptyFunction,
				afterChange: Prototype.emptyFunction,
				linkSelector: 'li a',
				activeClassName: 'active',
				defaultTab: 'first',
				autoLinkExternal: true
			});
			if(options)
				for(o in options)
					this.options[o] = options[o];
			this.containers = $H({});
			this.links = (typeof(this.options.linkSelector == "string")
				? tab_set.getElementsBySelector(this.options.linkSelector)
				: this.options.linkSelector(tab_set)
			).findAll(function(link){return (/^#/).exec(link.href.replace(window.location.href.split('#')[0],''));});
			this.links.each(function(link){
				link.key = $A(link.getAttribute('href').replace(window.location.href.split('#')[0],'').split('/')).last().replace(/#/,'');
				this.containers[link.key] = $(link.key);
				link.onclick = function(link){
					this.setActiveTab(link);
					return false;
				}.bind(this,link);
			}.bind(this));
			if(this.options.defaultTab == 'first')
				this.setActiveTab(this.links.first());
			else if(this.options.defaultTab == 'last')
				this.setActiveTab(this.links.last());
			else
				this.setActiveTab(this.options.defaultTab);
			target_regexp = /#(.+)$/;
			targets = target_regexp.exec(window.location);
			if(targets && targets[1]){
				$A(targets[1].split(',')).each(function(target){
					this.links.each(function(target,link){
						if(link.key == target){
							this.setActiveTab(link);
							throw $break;
						}
					}.bind(this,target));
				}.bind(this));
			}
			if(this.options.autoLinkExternal){
				$A(document.getElementsByTagName('a')).each(function(a){
					if(!this.links.include(a)){
						clean_href = a.href.replace(window.location.href.split('#')[0],'');
						if(clean_href.substring(0,1) == '#'){
							if(this.containers.keys().include(clean_href.substring(1))){
								$(a).observe('click',function(event,clean_href){
									this.setActiveTab(clean_href.substring(1));
								}.bindAsEventListener(this,clean_href));
							}
						}
					}
				}.bind(this));
			}
		},
		setActiveTab: function(link){
			if(typeof(link) == "undefined" || link == false)
				return;
			if(typeof(link) == "string"){
				this.links.each(function(_link){
					if(_link.key == link){
						this.setActiveTab(_link);
						throw $break;
					}
				}.bind(this));
			}else{
				this.containers.each(function(item){
					item[1].hide();
				});			
				this.links.each(function(item){
					item.removeClassName(this.options.activeClassName);
				}.bind(this));
				link.addClassName(this.options.activeClassName);
				this.options.beforeChange(this,this.activeContainer);
				Control.Tabs.notifyResponders('beforeChange',this,this.activeContainer);
				this.activeContainer = this.containers[link.key];
				this.activeLink = link;
				this.containers[link.key].show();
				this.options.afterChange(this,this.containers[link.key]);
				Control.Tabs.notifyResponders('afterChange',this,this.containers[link.key]);
			}
		},
		next: function(){
			this.links.each(function(link,i){
				if(this.activeLink == link && this.links[i + 1]){
					this.setActiveTab(this.links[i + 1]);
					throw $break;
				}
			}.bind(this));
		},
		previous: function(){
			this.links.each(function(link,i){
				if(this.activeLink == link && this.links[i - 1]){
					this.setActiveTab(this.links[i - 1]);
					throw $break;
				}
			}.bind(this));
		},
		first: function(){
			this.setActiveTab(this.links.first());
		},
		last: function(){
			this.setActiveTab(this.links.last());
		}
	});