/*
 * Quiz Demandlet
 */
	function initiate_quiz(dObj) {
		var itemId 		= demandletManager.setup(dObj);
		(dObj.attributes["quiz_id"]) ? quiz_id=dObj.attributes['quiz_id'].value : quiz_id = '';
		if(quiz_id=='') return false;
		(dObj.attributes['authenticated']) ? authenticated=dObj.attributes['authenticated'].value : authenticated = 'false';
		(dObj.attributes['frequency']) ? frequency=dObj.attributes['frequency'].value : frequency = '0';
		dObj.setAttribute('frequency',frequency);
		dObj.appendChild(Builder.node('div',{id:itemId+'Intro',className:'intro',style:'display:none;'}));
		var total = Builder.node('div',{id:itemId+'TotalQuestions',className:'totalquestions'});
		total.innerHTML="<p>Question <span class='currentQ'></span> of <span class='totalQ'></span></p>";
		dObj.appendChild(total);
		dObj.appendChild(Builder.node('div',{id:itemId+'Thankyou',className:'thankyou',style:'display:none;'},['Thank you for participating.']));
		dObj.appendChild(Builder.node('div',{id:itemId+'Result',className:'result',style:'display:none;'}));
		dObj.appendChild(Builder.node('div',{id:itemId+'Closed',className:'closed',style:'display:none;'},['This quiz is now closed.']));
		dObj.appendChild(Builder.node('div',{id:itemId+'ViewResults',className:'viewresults',style:'display:none;'}));
		$(itemId+'ViewResults').appendChild(Builder.node('a',{href:'#',onclick:'render_quizResults($(\''+itemId+'\'));this.blur();return false;'},['View Results']));
		dObj.appendChild(Builder.node('div',{id:itemId+'TakeAgain',className:'takeagain',style:'display:none;'}));
		$(itemId+'TakeAgain').appendChild(Builder.node('a',{href:'#',onclick:'initiate_quiz($(\''+itemId+'\'));this.blur();return false;'},['Take Quiz Again']));
		if(!readCookie('olio_quiz'+quiz_id)) {
			render_quizQuestions(dObj);
		}
		else {
			var completedDate 	= new Date(readCookie('olio_quiz'+quiz_id));
			var currentDate		= new Date(datePart('yyyy',new Date())+'/'+hasZero(datePart('m',new Date()))+'/'+hasZero(datePart('d',new Date())));
			if(frequency==0 || dateDiff('d',currentDate,completedDate)>frequency) {
				render_quizQuestions(dObj);
			}
			else {
				render_quizResults(dObj);
			}	
		};
	};	

	
	function render_quizQuestions(dObj) {
		var itemId 	= dObj.id;
		var quiz_id	= dObj.attributes['quiz_id'].value;
		dObj.correct = 0;
		new Ajax.Request
		(
			'/ajax/data/'+getMetaValue('siteIdentifier')+'/'+'quiz'+quiz_id+'.xml',
			{
				method:'POST',
				parameters:'&nC'+noCache(),
				onFailure:function(err){},
				onSuccess:function(xml){ 
					var firstNode 		= get_firstchild(xml.responseXML.documentElement);
					var x 				= xml.responseXML.getElementsByTagName(firstNode.nodeName);
					var quiz_type		= getNodeValueByChildName(x[0],'quiz_type');
					var quiz_intro		= getNodeValueByChildName(x[0],'intro_text');
					var quiz_thankyou	= getNodeValueByChildName(x[0],'thankyou_text');
					var steps			= x[0].getElementsByTagName('step');
					var lastStep		= steps.length;
					for(i = 0; i < lastStep; i++){
						var question_id 	= getNodeValueByChildName(steps[i],'question_id');
						var question_text 	= getNodeValueByChildName(steps[i],'question');
						var question_reason	= getNodeValueByChildName(steps[i],'reason');
						var nextStep		= i + 1;
						dObj.appendChild(Builder.node('div',{id:itemId+'Step'+i,style:'display:none;',className:'step'}));
						$(itemId+'Step'+i).appendChild(Builder.node('form',{id:itemId+'Form'+i}));							
						$(itemId+'Form'+i).appendChild(Builder.node('div',{className:'question'},[question_text]));
						var choices	= steps[i].getElementsByTagName('choice');
						var is_correct = "";
						for(j = 0; j < choices.length; j++) {
							var answer_id	= getNodeValueByChildName(choices[j],'answer_id');
							var answer_text	= getNodeValueByChildName(choices[j],'answer');
							if (getNodeValueByChildName(choices[j],'is_correct') == 1)
								is_correct = answer_id;
							$(itemId+'Form'+i).appendChild(Builder.node('div',{id:itemId+'Choice'+i+'_'+j,className:'choice'}));
							$(itemId+'Choice'+i+'_'+j).appendChild(Builder.node('input',{type:'radio',name:itemId+'Group'+question_id,value:answer_id}));
							$(itemId+'Choice'+i+'_'+j).appendChild(Builder.node('span',[answer_text]));
						};
						$(itemId+'Form'+i).appendChild(Builder.node('div', {id:itemId+'Response'+i,className:'response'}));
						$(itemId+'Form'+i).appendChild(Builder.node('div',{id:itemId+'Submit'+i,className:'submit'}));
						$(itemId+'Form'+i).appendChild(Builder.node('div',{id:itemId+'Continue'+i,className:'continue',style:'display:none;'}));
						var span_submit = Builder.node('span', {className:"submit_bttn"}, ["Submit"]);
						var span_continue = Builder.node('span', {className:"continue_bttn"}, ["Continue"]);
						if(i == lastStep-1) {
							$(itemId+'Submit'+i).appendChild(Builder.node('a',{href:'#',onclick:'submit_quizAnswer($(\''+itemId+'\'),'+i+','+is_correct+');this.blur();return false;'},[span_submit]));
							$(itemId+'Continue'+i).appendChild(Builder.node('a',{href:'#',onclick:'submit_quiz($(\''+itemId+'\'),'+lastStep+');this.blur();return false;'},[span_continue]));
						}
						else {
							$(itemId+'Submit'+i).appendChild(Builder.node('a',{href:'#',onclick:'submit_quizAnswer($(\''+itemId+'\'),'+i+', '+is_correct+');this.blur();return false;'},[span_submit]));
							$(itemId+'Continue'+i).appendChild(Builder.node('a',{href:'#',onclick:'next_quizQuestion($(\''+itemId+'\'),'+nextStep+');this.blur();return false;'},[span_continue]));
						}
					};
					$(itemId).getElementsBySelector('.currentQ')[0].innerHTML=1;
					$(itemId).getElementsBySelector('.totalQ')[0].innerHTML=lastStep;
					Element.show(itemId+'Step0');
				}
			}
		);	
	};

	function submit_quizAnswer(dObj,currentStep, correct_ans) {
		var itemId		= dObj.id;
		var fObj 		= $(itemId+'Form'+currentStep);
		var validAnswer	= Form.getInputs(fObj,'radio').find(function(re){return re.checked;});
		if (validAnswer) {
			if (correct_ans != validAnswer.value) {
				var radioButtons = Form.getInputs(fObj, 'radio');
				for (var i = 0; i < radioButtons.length; i++) {
					if (radioButtons[i].value != validAnswer.value) {
						radioButtons[i].disabled = true;
						radioButtons[i].nextSibling.className = "disabled";
					}
				}
				$(itemId+'Response'+currentStep).appendChild(Builder.node('p', ["Sorry that is incorrect."]));
			} else {
				$(itemId+'Response'+currentStep).appendChild(Builder.node('p', ["That is correct!"]));
				++dObj.correct;
			}
			buildResults(dObj, currentStep, correct_ans);
			Element.hide($(itemId+'Submit'+currentStep));
			Element.show($(itemId+'Continue'+currentStep));
		}
		else {
			alert('Please choose an answer');
		}
	};
	
	function submit_quiz(dObj, currentStep) {
		var itemId = dObj.id;
		Element.hide($(itemId+'Form'+(currentStep - 1)));
		$(itemId+'TotalQuestions').innerHTML= "<p>You got " + dObj.correct + " out of " + currentStep + " correct.</p>";
		Element.show(itemId+'Thankyou');
		Element.show($(itemId+'ViewResults'));
		Element.show($(itemId+'TakeAgain'));	
	}

	function next_quizQuestion(dObj,displayStep) {
		var itemId		= dObj.id;
		// hide previous form first
		$(itemId).getElementsBySelector('.currentQ')[0].innerHTML = displayStep+1;
		Element.hide($(itemId+'Form'+(displayStep-1)));
		var frequency	= dObj.attributes['frequency'].value;
		var quiz_id		= dObj.attributes['quiz_id'].value
		if(document.getElementById(itemId+'Step'+displayStep)) {
			Element.show(itemId+'Step'+displayStep);
		}
		else {
			var qCount 		= displayStep;
			var quizParam 	= '&nc='+noCache()+'&questionCount='+qCount+'&quiz_id='+quiz_id;
			for(i=0;i<qCount;i++) {
				var fObj			= $(itemId+'Form'+i);
				var selectedAnswer	= Form.getInputs(fObj,'radio').find(function(re){return re.checked;});	
				var chosenItem 		= Form.serialize(fObj).split('=');
				var question_id		= chosenItem[0].replace(itemId+'Group','');
				var answer_id		= chosenItem[1];
				quizParam			+= '&question'+i+'='+question_id+','+answer_id;
			}
			new Ajax.Request
			(
				'/ajax/quizProcess.jsp',
				{
					method:'POST',
					parameters:quizParam,
					onFailure:function(){},
					onSuccess:function (xml){
						createCookie('olio_quiz'+quiz_id,new Date(),frequency);
						render_quizResults(dObj,xml);
					}
				}
			);
		}
	};
	
	function buildResults(dObj, step, correctAns) {
		var itemId = dObj.id;
		var fObj = $(itemId+'Form'+step);
		var validChoices = Form.getInputs(fObj,'radio');
		var ans_txt = "";
		for (var i = 0; i < validChoices.length; i++) {
			if (validChoices[i].value == correctAns) {
				ans_txt = validChoices[i].nextSibling.firstChild.nodeValue;
			}	
		}
		var x = $(itemId+'Form'+step).getElementsBySelector(' .question');
		var question = Builder.node('dt', [x[0].firstChild.nodeValue]);
		var answer = Builder.node('dd', [ans_txt]);	
		var answerKey = Builder.node('dl', [question, answer]);
		$(itemId+'Result').appendChild(answerKey);
	}
	
	function render_quizResults(dObj,xml) {
		var itemId = dObj.id;
		
		Element.hide(itemId+'Thankyou');
		Element.hide($(itemId+'ViewResults'));
		Element.show($(itemId+'Result'));
		Element.show($(itemId+'TakeAgain'));
			
	}