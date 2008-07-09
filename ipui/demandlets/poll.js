/*
 * Poll Demandlet
 */
	function initiate_poll(dObj) {
		var itemId 		= demandletManager.setup(dObj);
		var poll_id		= '';
		(dObj.attributes["poll_id"]) ? poll_id=dObj.attributes['poll_id'].value : poll_id = '';
		if(poll_id=='') return false;
		(dObj.attributes['frequency']) ? frequency=dObj.attributes['frequency'].value : frequency = '30';
		dObj.setAttribute('frequency',frequency);
		dObj.appendChild(Builder.node('div',{id:itemId+'Intro',className:'intro',style:'display:none;'}));
		dObj.appendChild(Builder.node('div',{id:itemId+'Question',className:'question',style:'display:none;'}));
		dObj.appendChild(Builder.node('form',{id:itemId+'Form',style:'display:none;'}));
		dObj.appendChild(Builder.node('div',{id:itemId+'Submit',className:'submit',style:'display:none;'}));
			$(itemId+'Submit').appendChild(Builder.node('a',{href:'#',onclick:'submit_poll($(\''+itemId+'\'),\'' + poll_id + '\');this.blur();return false;'},['Submit']));
		dObj.appendChild(Builder.node('div',{id:itemId+'Result',className:'result',style:'display:none;'},['Please wait... Loading Results']));
		dObj.appendChild(Builder.node('div',{id:itemId+'Closed',className:'closed',style:'display:none;'},['Voting for this poll has now closed.']));
		dObj.appendChild(Builder.node('div',{id:itemId+'Thankyou',className:'thankyou',style:'display:none;'},['Thanks for your vote.']));
		dObj.appendChild(Builder.node('div',{id:itemId+'ViewResults',className:'viewresults',style:'display:none;'}));
			$(itemId+'ViewResults').appendChild(Builder.node('a',{href:'#',onclick:'render_pollResults($(\''+itemId+'\'));this.blur();return false;'},['View Results']));
		dObj.appendChild(Builder.node('div',{id:itemId+'VoteAgain',className:'voteagain',style:'display:none;'}));
			$(itemId+'VoteAgain').appendChild(Builder.node('a',{href:'#',onclick:'initiate_poll($(\''+itemId+'\'));this.blur();return false;'},['Vote Again']));
		dObj.appendChild(Builder.node('div',{id:itemId+'VoteNow',className:'votenow',style:'display:none;'}));
			$(itemId+'VoteNow').appendChild(Builder.node('a',{href:'#',onclick:'initiate_poll($(\''+itemId+'\'));this.blur();return false;'},['Vote Now']));
		if(!readCookie('olio_poll'+poll_id)) {
			render_pollQuestion(dObj);
		}
		else {
			var votedDate 	= new Date(readCookie('olio_poll'+poll_id));
			var currentDate	= new Date(datePart('yyyy',new Date())+'/'+hasZero(datePart('m',new Date()))+'/'+hasZero(datePart('d',new Date())));
			if(frequency==0 || dateDiff('d',currentDate,votedDate)>frequency) {
				render_pollQuestion(dObj);
			}
			else {
				render_pollResults(dObj);
			}	
		}
	};	

	function submit_poll(dObj){
		var itemId	= dObj.id;
		var poll_id	= dObj.attributes['poll_id'].value;
		var fObj	= $(itemId+'Form');
		var vote	= Form.getInputs(fObj,'radio').find(function(re){return re.checked;});
		if(vote) {
			var chosenItem 	= Form.serialize(fObj).split('=');
			var answer_id	= chosenItem[1];

			new Ajax.Request
			(
				'/ajax/pollProcess.jsp',
				{
					method:'POST',
					parameters:'&nC'+noCache()+'&answer_id='+answer_id+'&poll_id='+poll_id,
					onFailure:function(){},
					onSuccess:function (xml){
						createCookie('olio_poll'+poll_id,new Date(),60);
						render_pollResults(dObj,xml);
					}
				}
			);
		}
		else {
			alert('Please pick a choice before voting');
		}
	};
	
	function render_pollQuestion(dObj){
		var itemId 		= dObj.id;
		var poll_id		= '';
		(dObj.attributes["poll_id"]) ? poll_id=dObj.attributes['poll_id'].value : poll_id = '';
		if(poll_id=='') return false;
		new Ajax.Request(
			'/ajax/data/'+getMetaValue('siteIdentifier')+'/'+'poll'+poll_id+'.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:function(err){},
				onSuccess:function(xml){ 
					var firstNode 		= get_firstchild(xml.responseXML.documentElement);
					var x 				= xml.responseXML.getElementsByTagName(firstNode.nodeName);
					var close_date		= getNodeValueByChildName(x[0],'expiration_date');
					if(!isDate(close_date)) 
						close_date = dateAdd('d',1,new Date());
					if(dateDiff('s',new Date(),new Date(close_date))>0) {
						var poll_id 		= getNodeValueByChildName(x[0],'poll_id');
						var category_id		= getNodeValueByChildName(x[0],'category_id');
						var poll_name		= getNodeValueByChildName(x[0],'name');
						var poll_question	= getNodeValueByChildName(x[0],'question');
						var display_result	= getNodeValueByChildName(x[0],'display_result');
						if(display_result=='' || display_result=='0') {
							display_result = 'false';
						}
						else {
							display_result = 'true';
						};
						if(!dObj.attributes['showresults']) dObj.setAttribute('showresults',display_result);
						var choices			= x[0].getElementsByTagName('choice');
						for(j=0;j<choices.length;j++){
							var answer_id 	= getNodeValueByChildName(choices[j],'answer_id');
							var answer 		= getNodeValueByChildName(choices[j],'answer');
							$(itemId+'Form').appendChild(Builder.node('div',{id:itemId+'_choice'+j,className:'choice'}));
							$(itemId+'_choice'+j).appendChild(Builder.node('input',{type:'radio',name:itemId+'_group',value:answer_id}));
							$(itemId+'_choice'+j).appendChild(Builder.node('span',[answer]));
						};
						$(itemId+'Question').innerHTML = poll_question;
						Element.show(itemId+'Question');
						Element.show(itemId+'Form');
						Element.show(itemId+'Submit');	
						if(dObj.attributes['showresults']=='true') {
							Element.show(itemId+'ViewResults');
						}
						else {
							Element.hide(itemId+'ViewResults');
						};
					}
					else {
						alert('s');
						if(getNodeValueByChildName(x[0],'closing_text')!='') $(itemId+'Closed').innerHTML = getNodeValueByChildName(x[0],'closing_text');
						Element.show(itemId+'Closed');
					};
				}
			}
		);
	};
	
	function render_pollResults(dObj,xml){
		var itemId 			= dObj.id;
		var poll_id			= dObj.attributes['poll_id'].value;
		var showResults 	= '';
		(dObj.attributes['showresults']) ? showResults=dObj.attributes['showresults'].value : showResults = '';
		var frequency		= dObj.attributes['frequency'].value;
		Element.hide(itemId+'Form');
		Element.hide(itemId+'Submit');
		Element.hide(itemId+'ViewResults');
		Element.hide(itemId+'VoteNow');
		if(showResults=='true' || showResults=='') {
			if(!xml){
				new Ajax.Request
				(
					'/ajax/pollProcess.jsp',
					{
						method:'POST',
						parameters:'&nC'+noCache()+'&poll_id='+poll_id,
						onFailure:function(){},
						onSuccess:function (xml){
							var firstNode 		= get_firstchild(xml.responseXML.documentElement);
							var x 				= xml.responseXML.getElementsByTagName(firstNode.nodeName);
							var poll_question	= getNodeValueByChildName(x[0],'question');
							Element.show(itemId+'Question');
							$(itemId+'Question').innerHTML = poll_question;
							if(getNodeValueByChildName(x[0],'thankyou_text')=='1') {
								render_pollResultsXml(xml,itemId);
							}
							else {
								Element.show(itemId+'Thankyou');
								if(frequency-0==0 || dateDiff('d',currentDate,votedDate)>expiration-0) {
									Element.show(itemId+'VoteAgain');
								};
							};
						}
					}
				);
			}
			else {
				render_pollResultsXml(xml,itemId);
			};
			var votedDate 	= new Date(readCookie('olio_poll'+poll_id));
			var currentDate	= new Date(datePart('yyyy',new Date())+'/'+datePart('m',new Date())+'/'+datePart('d',new Date()));
			if(!readCookie('olio_poll'+poll_id)) {
				Element.show(itemId+'VoteNow');
			}
			else if(frequency-0==0 || dateDiff('d',currentDate,votedDate)>frequency-0) {
				Element.show(itemId+'VoteAgain');
			};
			
		}
		else {
			Element.show(itemId+'Thankyou');
			if(frequency-0==0 || dateDiff('d',currentDate,votedDate)>frequency-0) {
				Element.show(itemId+'VoteAgain');
			};
		};
	};
	
	function render_pollResultsXml(xml,itemId) {
		Element.show(itemId+'Result');
		var firstNode 		= get_firstchild(xml.responseXML.documentElement);
		var x 				= xml.responseXML.getElementsByTagName(firstNode.nodeName);
		var poll_question	= getNodeValueByChildName(x[0],'question');
		var poll_thanks		= getNodeValueByChildName(x[0],'thankyou_text');
		var rObj 			= $(itemId+'Result');
		rObj.innerHTML 		= '';
		var totalVotes		= 0;
		var answers 		= xml.responseXML.getElementsByTagName('choice');
		for(i=0;i<answers.length;i++)	{totalVotes += getNodeValueByChildName(answers[i],'result')-0;}
		for(i=0;i<answers.length;i++){
			var answer 		= getNodeValueByChildName(answers[i],'answer');
			var result		= getNodeValueByChildName(answers[i],'result');
			var percent		= Math.round((100 / totalVotes) * result);
			rObj.appendChild(Builder.node('div',{id:itemId+'Answer'+i,className:'answer'}));
			$(itemId+'Answer'+i).appendChild(Builder.node('span',[answer+':']));
			$(itemId+'Answer'+i).appendChild(Builder.node('span',[result+' (' + percent + '%)']));
		};	
		Element.show(itemId+'Result');
		$(itemId+'Thankyou').innerHTML = poll_thanks;
	};