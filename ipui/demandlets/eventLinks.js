/*
 * eventLinks.js
 */
function initiate_eventLinks(dObj) {
        var eventId = getMetaValue('event_id');
        if (eventId == false)  {
        	dObj.style.display = 'none'; 
        	return false;
        }
        var url = '/ajax/data/'+eventId+'_links.xml';
        new Ajax.Request(url,
                {
                    method:'get',
                    parameters:'nC='+noCache(),
                    onFailure:function() { dObj.style.display = 'none'; },
                    onSuccess: function (xml) {
                        var firstNode = get_firstchild(xml.responseXML.documentElement);
                        var x = xml.responseXML.getElementsByTagName(firstNode.nodeName);
                        if (!x.length || x[0].nodeName.toLowerCase() == 'xml') {
                        	dObj.style.display = 'none';
                        } else {
                                dObj.appendChild(Builder.node('h2', ['On the Web']));
                                var linksList = document.createElement('ul');                  
                                for (i = 0; i < x.length; i++) {
                                        var linkUrl = getNodeValueByChildName(x[i], 'url');
                                        var evlinkLnk = Builder.node('a', {href:linkUrl, target:'_blank'}, [getNodeValueByChildName(x[i], 'name')]);
                                        evlinkLnk.onclick = function() { window.open(this.href); return false;};
                                        linksList.appendChild(Builder.node('li', [evlinkLnk]));
                                }
                                if (linksList.getElementsByTagName('li').length) 
                                    dObj.appendChild(linksList);
                                else
                                	dObj.style.display = 'none';
                        }
                    }
                }
        );
};