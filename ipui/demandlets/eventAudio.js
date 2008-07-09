/*
 * eventAudio.js
 */
function initiate_eventAudio(dObj) {
        var eventId = getMetaValue('event_id');
        if (eventId == false) { 
        	dObj.style.display = 'none'; 
	        return false;
	    }
        var url = '/ajax/data/'+eventId+'_audio.xml';
        new Ajax.Request(url,
            {
                method:'get',
                parameters:'nC='+noCache(),
                onFailure: function() { dObj.style.display = 'none'; },
                onSuccess: function (xml) {
                        var firstNode = get_firstchild(xml.responseXML.documentElement);
                        var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                        if (!x.length || x[0].nodeName.toLowerCase() == 'xml') {
                        	dObj.style.display = 'none';
                        } else {
	                        dObj.appendChild(Builder.node('h2', ['Audio Clips']));
	                        var audioList = document.createElement('ul');
	                        var highlight = false;      
	                        for (i = 0; i < x.length; i++) {
	                                var name = Builder.node('span', {className:'name'}, [getNodeValueByChildName(x[i], 'name')]);
	                                var audioUrl = getNodeValueByChildName(x[i], 'url');
	                                var buyUrl = getNodeValueByChildName(x[i], 'purchase_url');
	                                var listenLnk = Builder.node('a', {className:'btn-listen', href:audioUrl}, ['Listen']);
	                                listenLnk.onclick = function() { window.open(this.href); return false; };
	                                var optionSpan = Builder.node('span', {className:'options'}, [listenLnk]);
	                                var item = Builder.node('li', [name, ' ', optionSpan]);
	                                audioList.appendChild(item);
	                                if (highlight) { 
	                                	item.className = 'clearfix highlight';
	                                	highlight = false;
	                                } else {
	                                	item.className = 'clearfix';
	                                	highlight = true;
	                                }
	                        }
	                        if (audioList.getElementsByTagName('li').length)
	                            dObj.appendChild(audioList);
	                        else 
	                        	dObj.style.display = 'none';
	                   }
                }
            }
        );
};