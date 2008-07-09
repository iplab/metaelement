/*
 * User Profile Demandlet
 */
	function initiate_userProfile(dObj) {
		var itemId 		= demandletManager.setup(dObj);
		var min_year = (dObj.attributes["min_year"]) ? dObj.attributes['min_year'].value : 10;
		var max_children = (dObj.attributes["children"]) ? dObj.attributes['children'].value : 10;
		
			dObj.appendChild(Builder.node('form', {id:itemId+'PersonalDetails'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Username'}));
				$(itemId+'Username').appendChild(Builder.node('span',{className:'required'}, ["(required)"]));
				$(itemId+'Username').appendChild(Builder.node('span',{className:'label'},['Username:']));
				$(itemId+'Username').appendChild(Builder.node('input',{id:itemId+'Input-username',required:'required',minLen:'3',maxLen:'30',alert:'Please specify valid Username'}));
				$(itemId+'Username').appendChild(Builder.node('span',{className:'mustbe'},['(Must be from 3 to 30 characters)']));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'FirstName'}));
				$(itemId+'FirstName').appendChild(Builder.node('span',{className:'required'}, ["(required)"]));
				$(itemId+'FirstName').appendChild(Builder.node('span',{className:'label'},['First Name:']));
				$(itemId+'FirstName').appendChild(Builder.node('input',{id:itemId+'Input-first_name',required:'required',maxLen:'75',alert:'Please specify valid First Name'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'LastName'}));
				$(itemId+'LastName').appendChild(Builder.node('span',{className:'required'}, ["(required)"]));
				$(itemId+'LastName').appendChild(Builder.node('span',{className:'label'},['Last Name:']));
				$(itemId+'LastName').appendChild(Builder.node('input',{id:itemId+'Input-last_name',required:'required',maxLen:'75',alert:'Please specify valid Last Name'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Email'}));
				$(itemId+'Email').appendChild(Builder.node('span',{className:'required'}, ["(required)"]));
				$(itemId+'Email').appendChild(Builder.node('span',{className:'label'},['E-mail Address:']));
				$(itemId+'Email').appendChild(Builder.node('input',{id:itemId+'Input-email',required:'required',maxLen:'75',alert:'Please specify valid E-mail Address'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Password'}));
				$(itemId+'Password').appendChild(Builder.node('span',{className:'required'}, ["(required)"]));
				$(itemId+'Password').appendChild(Builder.node('span',{className:'label'},['Password:']));
				$(itemId+'Password').appendChild(Builder.node('input',{id:itemId+'Input-password',type:'password',disabled:'true',required:'required',minLen:'6',maxLen:'15',alert:'Please specify valid Password'}));
				$(itemId+'Password').appendChild(Builder.node('span',{className:'mustbe'},['(Must be from 6 to 15 characters)']));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div', {id:itemId+'ChangePassword', display:'none'}));
				$(itemId+'ChangePassword').checked = false;
				$(itemId+'ChangePassword').appendChild(Builder.node('span',{className:'label'}, ['Change Password:']));
				$(itemId+'ChangePassword').appendChild(Builder.node('input',{id:itemId+'Input-change-password',type:'password',minLen:'6',maxLen:'15', parent:itemId+'ChangePassword', alert:'Your new password must be from 6 to 15 characters.' }));
				$(itemId+'ChangePassword').appendChild(Builder.node('span',{className:'mustbe'},['(Must be from 6 to 15 characters)']));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div', {id:itemId+'RetypePassword'}));
				$(itemId+'RetypePassword').appendChild(Builder.node('span',{className:'required'}, ["(required)"]));
				$(itemId+'RetypePassword').appendChild(Builder.node('span',{className:'label'}, ['Re-Type Password:']));
				$(itemId+'RetypePassword').appendChild(Builder.node('input',{id:itemId+'Input-retype-password',type:'password',minLen:'6',maxLen:'15',required:'required',alert:'Please fill in re-type password field'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Address'}));
				$(itemId+'Address').appendChild(Builder.node('span',{className:'label'},['Address:']));
				$(itemId+'Address').appendChild(Builder.node('input',{id:itemId+'Input-address'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Address2'}));
				$(itemId+'Address2').appendChild(Builder.node('span',{className:'label'},['Address 2:']));
				$(itemId+'Address2').appendChild(Builder.node('input',{id:itemId+'Input-address2'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'City'}));
				$(itemId+'City').appendChild(Builder.node('span',{className:'label'},['City:']));
				$(itemId+'City').appendChild(Builder.node('input',{id:itemId+'Input-city'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'State'}));
				$(itemId+'State').appendChild(Builder.node('span',{className:'label'},['State / Province:']));
				$(itemId+'State').appendChild(Builder.node('input',{id:itemId+'Input-state'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Zip'}));
				$(itemId+'Zip').appendChild(Builder.node('span',{className:'label'},['Postal Code:']));
				$(itemId+'Zip').appendChild(Builder.node('input',{id:itemId+'Input-zip'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Country'}));
				$(itemId+'Country').appendChild(Builder.node('span',{className:'label'},['Country:']));
				$(itemId+'Country').appendChild(Builder.node('select',{id:itemId+'Input-country', className:'select-country'}));
				render_CountryList($(itemId+'Input-country'));
				findSelected($(itemId+'Input-country'), getMetaValue('siteCountry'));		
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Birthdate'}));
				$(itemId+'Birthdate').appendChild(Builder.node('span',{className:'required'}, ["(required)"]));
				$(itemId+'Birthdate').appendChild(Builder.node('span',{className:'label'},['Date of Birth:']));
				$(itemId+'Birthdate').appendChild(Builder.node('select',{id:itemId+'Input-birthdate-years', className:'select-date'}));
				$(itemId+'Birthdate').appendChild(Builder.node('select',{id:itemId+'Input-birthdate-months', className:'select-date'}));
				$(itemId+'Birthdate').appendChild(Builder.node('select',{id:itemId+'Input-birthdate-days', className:'select-date'}));
				showYears(itemId+'Input-birthdate-years', min_year, 100);
				showNumbers(itemId+'Input-birthdate-months', 1, 13, "MM");
				showNumbers(itemId+'Input-birthdate-days', 1, 32, "DD");
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Gender'}));
				$(itemId+'Gender').appendChild(Builder.node('span',{className:'label'},['Gender:']));
				$(itemId+'Gender').appendChild(Builder.node('select',{id:itemId+'Input-gender', className:'normal-width select-gender'}));
				addOption($(itemId+'Input-gender'),'Select...','',false);
				addOption($(itemId+'Input-gender'),'Male','male',false);
				addOption($(itemId+'Input-gender'),'Female','female',false);
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Children'}));
				$(itemId+'Children').appendChild(Builder.node('span',{className:'label'},['Number of Children:']));
				$(itemId+'Children').appendChild(Builder.node('select',{id:itemId+'Input-children', className:'normal-width select-children'}));
				showNumbers(itemId+'Input-children', 0, max_children+1, "Select...");
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Provider'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Terms'}));
			$(itemId+'PersonalDetails').appendChild(Builder.node('div',{id:itemId+'Optin', className:'optins'}));
		dObj.appendChild(Builder.node('div',{id:itemId+'Submit'}));
		render_Optins($(itemId+'Optin'));
		render_userProfile(itemId);
	};

	
	function render_Optins(dObj) {
		var itemId	= dObj.id;
		new Ajax.Request(
			'/ajax/data/'+getMetaValue('siteIdentifier')+'/optin.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:function(err){},
				onSuccess:function(xml){ 
					var firstNode 		= get_firstchild(xml.responseXML.documentElement);
					var x 				= xml.responseXML.getElementsByTagName(firstNode.nodeName);
					for (var i = 0; i < x.length; i++) {
						var optinId 		= getNodeValueByChildName(x[i],'optin_id');
						var optinName 		= getNodeValueByChildName(x[i],'name');
						var optinText 		= getNodeValueByChildName(x[i],'display_text');
						var optinSelected	= getNodeValueByChildName(x[i],'default_selected');
						var optinRequired	= getNodeValueByChildName(x[i],'is_required');
						$(dObj).appendChild(Builder.node('div',{id:itemId+'optin'+optinId}));
						$(itemId+'optin'+optinId).appendChild(Builder.node('input',{type:'checkbox',id:'optin_'+optinId, className:'normal-width'}));
						$(itemId+'optin'+optinId).appendChild(Builder.node('span', {className:'optin-text'}, [optinText]));
						if (optinRequired == '1') {
							var req = Builder.node('span', {className:'required'}, ["(required)"]);
							$(itemId+'optin'+optinId).insertBefore(req, $('optin_'+optinId));
							$('optin_'+optinId).setAttribute('required', 'required');
							$('optin_'+optinId).setAttribute('alert', 'You must check the '+optinName+' checkbox');
						}
						if (optinSelected=='1') $('optin_'+optinId).checked = true;
					}
				}
			}
		);	
	};
	
	function render_userProfile(itemId) {
		if (readCookie('olio')) {
			new Ajax.Request(
				'/ajax/registerProcess.jsp',
				{
					method:'POST',
					parameters:'&nC'+noCache(),
					onFailure:function(err){},
					onSuccess:function(xml){
						var firstNode 		= get_firstchild(xml.responseXML.documentElement);
						var x 				= xml.responseXML.getElementsByTagName(firstNode.nodeName);
						var username = getNodeValueByChildName(x[0],'username');
						$(itemId+'Input-username').value = username;
						$(itemId+'Input-username').disabled = true;
						var userEmail 		= getNodeValueByChildName(x[0],'email');
						$(itemId+'Input-email').value = userEmail;
						$(itemId+'Input-email').disabled = true;
						var userFirstName 	= getNodeValueByChildName(x[0],'first_name');
						$(itemId+'Input-first_name').value = userFirstName;
						var userLastName 	= getNodeValueByChildName(x[0],'last_name');
						$(itemId+'Input-last_name').value = userLastName;
						$(itemId+'Input-password').removeAttribute('required');
						Element.hide($(itemId+'Password'));
						Element.show($(itemId+'ChangePassword'));
						$(itemId+'ChangePassword').checked = true;
						$(itemId+'Input-retype-password').removeAttribute('required');
						$(itemId+'Input-retype-password').removeAttribute('alert');
						var  retype = $(itemId+'RetypePassword');
						Element.hide(retype.getElementsByTagName('span')[0]);
						var userBirthDate	= getNodeValueByChildName(x[0],'date_of_birth');
						var date_info = userBirthDate.split("-");
						findSelected($(itemId+'Input-birthdate-years'), date_info[0]*1);
						findSelected($(itemId+'Input-birthdate-months'), date_info[1]*1);
						findSelected($(itemId+'Input-birthdate-days'), date_info[2]*1);
						var userAddress 	= getNodeValueByChildName(x[0],'address');
						$(itemId+'Input-address').value = userAddress;
						var userAddress2 	= getNodeValueByChildName(x[0],'address2');
						$(itemId+'Input-address2').value = userAddress2;
						var userCity 		= getNodeValueByChildName(x[0],'city');
						$(itemId+'Input-city').value = userCity;
						var userState 		= getNodeValueByChildName(x[0],'state');
						$(itemId+'Input-state').value = userState;
						var userZip 		= getNodeValueByChildName(x[0],'postal_code');
						$(itemId+'Input-zip').value = userZip;
						var userCountry 	= getNodeValueByChildName(x[0],'country');
						findSelected($(itemId+'Input-country'),userCountry);
						var userGender 		= getNodeValueByChildName(x[0],'gender');
						findSelected($(itemId+'Input-gender'), userGender.toLowerCase());
						var userChildren 	= getNodeValueByChildName(x[0],'number_of_children');
						findSelected($(itemId+'Input-children'), userChildren);
						var sites = xml.responseXML.getElementsByTagName('site');
						if (sites.length) {
							render_userOptins(sites);
						}
						$(itemId+'Submit').innerHTML= "";
						$(itemId+'Submit').appendChild(
							Builder.node('input', {className:"submit", type:"submit", value:"Update", onclick:'submitProfile(\''+itemId+'\', true);this.blur();return false;', id:itemId+'SubmitLink'})
						);
					}
				}
			);
		} else { // new user registration
			var tmp = location.href.split("?");
			if (tmp.length > 1) {
				var params = tmp[1];
				var url = '/ajax/confirmAccount.jsp?'+params;
				new Ajax.Request(
					url, {
						method:'POST',
						parameters:'&nC='+noCache(),
						onFailure:function(err) {},
						onSuccess:function(xml) {
							var firstNode = get_firstchild(xml.responseXML.documentElement);
							if (getNodeValue(firstNode) == "success") {
								$(itemId+'').innerHTML = "<p class='reg_complete'>Thank you! Your registration is now complete. " +
														"Click <a href='#' onclick='signIn(); return false'>here</a> to login</p>"
							} else if (getNodeValue(firstNode) == "failure") {
								var cause = getNodeValue(firstNode.nextSibling);
								$(itemId+'').innerHTML = "<p class='reg_complete'>"+cause+"</p>";
							}
						}
					}
				);
			} else {
				Element.hide($(itemId+'ChangePassword'));
				$(itemId+'Input-password').disabled = false;
				$(itemId+'Submit').innerHTML= "";
				$(itemId+'Submit').appendChild(Builder.node('input', {className:"submit", type:"submit", value:"Register", onclick:'submitProfile(\''+itemId+'\', false);this.blur();return false;', id:itemId+'SubmitLink'}));
			}
		}
	};
	
	function render_userOptins(sites) {
		var siteId = getMetaValue('siteIdentifier');
		for (var i = 0; i < sites.length; i++) {
			if (siteId == getNodeValueByChildName(sites[i], 'site_id')) {
				var optins = sites[i].getElementsByTagName('optin');
				if (optins.length) {
					for (var j = 0; j < optins.length; j++) {
						var optinId = getNodeValueByChildName(optins[j],'optin_id');
						if ($('optin_'+optinId)) {
							var optinSelected = getNodeValueByChildName(optins[j],'selection');
							if (optinSelected=='1') { 
						 		$('optin_'+optinId).checked = true
							} else {
								$('optin_'+optinId).checked = false;
							}
						}
					}
				}
				break;
			}
		}
	}
	
	function submitProfile(id, update) {
		var yr = $(id+'Input-birthdate-years').value;
		var mn = $(id+'Input-birthdate-months').value;
		var dy = $(id+'Input-birthdate-days').value;
		var fObj = $(id+'PersonalDetails');

		if (update) {
			var newpwd = $(id+'Input-change-password').value;
			var newrepeat = $(id+'Input-retype-password').value;
			if (newpwd.length > 0 || newrepeat.length > 0) {
				if (newpwd != newrepeat) {
					alert("New password doesn't match confirm password");
					return false;
				}
				$(id+'ChangePassword').checked=true;
			} else if (newpwd.length == 0) {
				$(id+'ChangePassword').checked=false;
			}
		} else {
			var passwd = $(id+'Input-password').value;
			var repeat = $(id+'Input-retype-password').value;
			if (passwd != repeat) {
				alert("Password doesn't match Confirm Password");
				return false;
			}
		}
		if (!isDate(mn+'/'+dy+'/'+yr)) {
			alert("Please specify a valid date for birthdate");
			return false;
		}
		if (checkForm(fObj)) {
			var params = getValues(id, update);
			new Ajax.Request(
				'/ajax/registerProcess.jsp',
				{
					method:'POST',
					parameters:params+'&nC'+noCache(),
					onFailure:function(err){ alert("An error occurred. Please try again later.");},
					onSuccess:function(xml){
							var firstNode = get_firstchild(xml.responseXML.documentElement);
							if (getNodeValue(firstNode) == "success") {
								if (!update) {
									$(id+'').innerHTML = "<p class='reg_success'>Thank you for registering.</p>" + 
														"<p class='reg_success'>You must confirm your email address in order to complete your registration.  Please check your " +
														"email and click on the link provided.</p>"
								} else {
									$(id+'').innerHTML = "<p class='update_success'>Thank you. Your account information has been updated.</p>"
								}
							} else if (getNodeValue(firstNode) == "failure") {
								var cause_msg = getNodeValue(firstNode.nextSibling);
								alert(cause_msg);
							} else {
								alert("An error occurred. Please try again later.");
							}
					}
				});
		}
	}
	
	function getValues(id, update) {
		var params = "";
		params += "&email="+$(id+'Input-email').value;
		params += "&username="+$(id+'Input-username').value;
		if ($(id+'Input-password').value.length) {
			params += "&password="+$(id+'Input-password').value;
		}
		if (update) {
			params += "&password="+$(id+'Input-change-password').value;
		}
		params += "&firstname="+$(id+'Input-first_name').value;
		params += "&lastname="+$(id+'Input-last_name').value;
		params += "&address="+$(id+'Input-address').value;
		params += "&city="+$(id+'Input-city').value;
		params += "&state="+$(id+'Input-state').value;
		params += "&address2="+$(id+'Input-address2').value;
		params += "&postalcode="+$(id+'Input-zip').value;
		params += "&country="+$(id+'Input-country').value;
		params += "&gender="+$(id+'Input-gender').value;
		params += "&numberofchildren="+$(id+'Input-children').value;
		var bdate = $(id+'Input-birthdate-years').value+"-"+$(id+'Input-birthdate-months').value+"-"+$(id+'Input-birthdate-days').value;
		params += "&dateofbirth="+bdate;
		params += "&siteid="+getMetaValue('siteIdentifier');
		var opts = getSelectedOptins($(id+'Optin'));
		params += "&optins="+opts;
		if (update) params += "&update=1";

		return params.sub('&','');
	}
	
	function showNumbers(id, min, max, value) {
		addOption($(id), value, "", false);
		for (var i = min; i < max; i++) {
			addOption($(id), i, i, false);
		}
	}

	function showYears(id, min, range) {
		var year = new Date().getFullYear() % 100;;
		year += (year < 38) ? 2000 : 1900;
		year -= min;
		addOption($(id), "YYYY", "", false);
		while (range-- && year > 0) {
			addOption($(id), year, year,false);
			--year;
		}
	}
	
	function findSelected(sObj, key) {
		if (sObj.length > 0) {
			key+='';
			for (var i = 0; i < sObj.length; i++) {
				sObj[i].value+='';
				if (sObj[i].value == key || sObj[i].value.toLowerCase() == key.toLowerCase()) {
					sObj.value = key;
					break;
				}
			}
		}
		return false;
	}
	
	function getSelectedOptins(optinObj) {
		var checked_optins = "";
		var optin_list = optinObj.getElementsByTagName('input');
		if (optin_list) {
			for (var i = 0; i < optin_list.length; i++) {
				if (optin_list[i].checked) {
					checked_optins += ","+optin_list[i].id.split("_")[1];
				}
			}
			return checked_optins.sub(',','');
		}
		return "";
	}