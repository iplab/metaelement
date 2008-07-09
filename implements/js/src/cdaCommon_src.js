 	var server_time = ''; //Global Time/Date for use globally (relying on client clock is not a good idea)

	/*
	 * Attach default top_nav navigation loader for cda page
	 */
		Event.observe(window,'load',function() {
			if(!document.getElementById('siteList'))
				createCookie('defaultSite',getMetaValue('siteIdentifier'));
				sfHover();
		});
	
	/*
	 * CSS Based Navigation for Global Nav
	 * renderNavigation is called once page as loaded, once renderNavigation is complete
	 * then we call this function to insert event triggers.
	 */
	sfHover = function() {
		if(document.getElementById('main_navigation'))
		{
			new Ajax.Request
			(
			'/global/subnav.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:ajaxRequest_Error,
				onSuccess:function(t)
				{
					$('main_navigation').innerHTML=renderMainNavigation(t,0);
					var sfEls = document.getElementById("main_navigation").getElementsByTagName("LI");
					for (var i=0; i<sfEls.length; i++) 
					{
						sfEls[i].onmouseover=function() 
						{
							this.className+=" over";
				        }
				        sfEls[i].onmouseout=function() 
						{
				        	this.className='';
				        }
			        }
				}
			});	
		}
	};
	
	var newwindow;
	function popitup(url,properties) 
	{
		if(!properties) properties = '';
		newwindow=window.open(url,'name',properties);
		if (window.focus) {newwindow.focus()}
		return false;
	};

	/*
	 * Redirect Launcher from Launch page
	 */
	function autoRedirect(siteIdentifier,redirectURL)
	{
		if(readCookie('defaultSite')==siteIdentifier) document.location.href = redirectURL;
	};
	
	
	/*
	 * Manage Redirects from Launch page
	 */
	function siteRedirect(siteURL)
	{
		document.location.href = siteURL;
	};


	function submit_FriendPopup(formObj,hideDivObj,showDivObj){
		if(checkForm(formObj)){
			var site_id 	= getMetaValue('siteIdentifier');
			var link = window.opener.location.href.split('://')[1];
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
		   	
	function ajaxRequest_Error() 
	{
		alert("An error occurred during the process");
	};

	//site search functions
	function search_Submit(sObj)
	{
		if($F(sObj)!='')
		{
			if(document.getElementById('page_id')) 
				document.location.href='/search.jsp?kword='+$F(sObj)+'&page_id='+$F('page_id');
			else 
				document.location.href='/search.jsp?kword='+$F(sObj);
		}
		else
		{
			alert('Please enter a keyword');
		}
	};
	
	function search_Page(pNum,sObj)
	{
		$('page_id').value=pNum;search_Submit(sObj);
	};							

	function search_tvSchedule(fObj) 
	{
		if(checkForm(fObj))
		{
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
	
	/*
	 * user login and registration related functions
	 */
	function signIn_success(userId, userName, userEmail, userFname, userLname) 
	{
		createCookie('olio', userEmail+"|"+userId+"|"+userName+"|"+userFname+"|"+userLname, 0);
	};

	function signOut()
	{
		eraseCookie('olio');
		window.location.reload();
	};
	
	function registerUser() 
	{
		if(checkForm($('registration_form'))) 
		{
			if($F('password')!=$F('re_password')) 
			{
				alert('Passwords do not match');
			}
			else 
			{
				if(!$('confirm').checked) 
				{
					alert('Please agree to terms and conditions');
				}
				else 
				{
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
								if(insertStat == ' Success ') 
								{
									var url			= document.location.href;
									var aryCurLoc 	= url.split('/');
									aryCurLoc[aryCurLoc.length - 1] = 'registerthankyou.jsp';
									window.location = aryCurLoc.join('/');
								}
								else 
								{
									alert('The following error occured while trying to create your user account:\n' + error);
								}
							}
						}
					);
				}
			}
		}
	};
	
	function signIn() 
	{
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
								onSuccess:function (xml)
								{
									var response 	= '';
									var userId 		= '';
									var userEmail	= '';
									var userFname	= '';
									var userLname	= '';
									var reasonText	= '';

									if(xml) 
									{
										response = xml.responseXML.getElementsByTagName('response')[0].firstChild ? xml.responseXML.getElementsByTagName('response')[0].firstChild.data : 'error';
										if(response == 'success') 
										{
											userId 		= xml.responseXML.getElementsByTagName('identifier')[0].firstChild ? xml.responseXML.getElementsByTagName('identifier')[0].firstChild.data : 'Unknown';
											userName	= xml.responseXML.getElementsByTagName('username')[0].firstChild ? xml.responseXML.getElementsByTagName('username')[0].firstChild.data : 'Unknown';
											userEmail 	= login_email;
											userFname	= xml.responseXML.getElementsByTagName('firstname')[0].firstChild ? xml.responseXML.getElementsByTagName('firstname')[0].firstChild.data : 'Unknown';
											userLname 	= xml.responseXML.getElementsByTagName('lastname')[0].firstChild ? xml.responseXML.getElementsByTagName('lastname')[0].firstChild.data : 'Unknown';
										}
										else 
										{
											reasonText = xml.responseXML.getElementsByTagName('cause')[0].firstChild ? xml.responseXML.getElementsByTagName('cause')[0].firstChild.data : 'Unknown';
										}
									}
									else 
									{
										alert('An error occurred while trying to log in.\nSorry for the inconvenience.');
										return false;
									}

									if(response != 'success') 
									{
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
					else 
					{
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
								onSuccess:function (xml)
								{
									var response = '';

									if (xml) 
									{
										response = xml.responseXML.getElementsByTagName('response')[0].firstChild ? xml.responseXML.getElementsByTagName('response')[0].firstChild.data : 'Error';
										if (response != 'success')
										{
											reasonText = xml.responseXML.getElementsByTagName('cause')[0].firstChild ? xml.responseXML.getElementsByTagName('cause')[0].firstChild.data : 'Unknown';
											alert(reasonText);
											return false;
										}
									}
									else 
									{
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
					else 
					{
						return false;
					}
				}
			}
		);
	};

	function loadProfilePassword() 
	{
		profilePassword 		= Math.floor(Math.random()*999999999999) + '';
		$('password').value 	= profilePassword;
		$('re_password').value 	= profilePassword;
	}

	function saveProfile() 
	{
		if(checkForm($('profile_form'))) 
		{
			if($F('password')!=$F('re_password')) 
			{
				alert('Passwords do not match');
			}
			else 
			{
				if(profilePassword == $('password').value) 
				{
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
						onSuccess:function (xml)
						{
							$('password').disabled 				= false;
							$('re_password').disabled 			= false;
							$('saveSuccess').style.visibility	= 'visible'; //Element.hide/Element.show...
						}
					}
				);
			}
		}
	};
	
	function render_timeZoneList(dObj) 
	{
		removeAllOptions(dObj);
		new Ajax.Request
		(
			'/ajax/data/timeZoneList.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:function(err)
				{
					addOption(dObj,'No Timezones Found','',false);
				},
				onSuccess:function(xml)
				{ 
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

	function render_programList(dObj) 
	{
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
					for (var i=0;i<x.length;i++) 
					{
						var category_id 		= getNodeValue(x[i],'category_id');
						var program_title 		= getNodeValue(x[i],'display_name');
						addOption(dObj,program_title,category_id,false);
					};
				}
			}
		);
	};	

	function render_CountryList(dObj) 
	{
		removeAllOptions(dObj);
		new Ajax.Request
		(
			'/ajax/data/countryList.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				asynchronous: false,
				onFailure:function(err)
				{
					addOption(dObj,'No Countries Found','',false);
				},
				onSuccess:function(xml){ 
					var x = xml.responseXML.getElementsByTagName('country');
					for (var i=0;i<x.length;i++) 
					{
						var country = getNodeValueByChildName(x[i],'name');
						addOption(dObj,country,country,false);
					};
				}
			}
		);
	};	

	function changeColorTheme() 
	{
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
	
	/*
	 * Do not modify below code
	 */
	function renderMainNavigation(req,parent_id)
	{
		var tmp			= '';
		var subTmp		= '';
		var subNodes	= '';
		var k			= req.responseXML.getElementsByTagName('nav');
		var navLen		= k.length;
		for(var j=0;j<k.length;j++)
		{
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
			if(nParent==parent_id)
			{
				if(parent_id==0)
				{
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
	
	function renderMainNavigation_sub1(req,parent_id,mainImage)
	{
		var tmp			= '';
		var subTmp		= '';
		var subNodes	= '';
		var k			= req.responseXML.getElementsByTagName('nav');
		for(var j=0;j<k.length;j++)
		{
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
			if(nParent==parent_id)
			{
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
	function renderMainNavigation_sub2(req,parent_id)
	{
		var tmp='';
		var subTmp='';
		var k=req.responseXML.getElementsByTagName('nav');
		for (var j=0;j<k.length;j++)
		{
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
			if(nParent==parent_id)
			{
				tmp+='<li>';
				if(popup=='1')
				{
					tmp += '<a href="#" onclick="open_win('+'\''+nUrl+'\','+'\''+nLabel+'\','
					+ '\'toolbar='+popupToolbar+','+'scrollbars='+popupScroll+','+'location=0,'
					+ 'resizable='+popupResize+','+'width='+popupWidth+','+'height='+popupHeight
					+ '\');this.blur();return false;">' + nLabel + '</a>';
				}
				else
				{
					tmp+='<a href="'+nUrl+'">' + nLabel + '</a>';
				}
				if(tmp!=''){
					tmp+='</li>\n';
				}
			}
			if(tmp!=''){
				subTmp+=tmp
			}
		}
		return subTmp;
	};