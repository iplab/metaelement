/*
 * searchResults.js
 */
function initiate_searchResults(dObj) {
    dObj.appendChild(Builder.node('div', {id:'search-results', style:'position:relative'}));
    var queryParams = window.location.href.toQueryParams();
    if (queryParams) {
    	var site = new Site();
		var siteName = site.getSiteUrl();
        if (queryParams.query) {
                var searchValue = queryParams.query;
                if ($('site-search-field')) {
                	$('site-search-field').value = searchValue;
                }
                var url = '/ajax/siteSearch.jsp';
                new Ajax.Request(url,
                        {
                            method: 'get',
                            parameters: 'nC='+noCache()+'&site_id='+siteName+'&kword='+searchValue,
                            onCreate: function() {
	                                if (!$('loading_sign')) {
	                                	createLoadingSign($('search-results'));
	                                }
	                                var x = $('loading_sign');
	                                Element.show(x);
	                        },
	                        onFailure:function() { handleSearchError(dObj); },
                            onSuccess:function(xml) { 
                                    var xmlData = xml.responseXML.documentElement;
                                    var totalPages = xmlData.getElementsByTagName('totalPages');
                                    var currentPage = xmlData.getElementsByTagName('currentPage');
                                    var suggestion = xmlData.getElementsByTagName('suggestion');
                                    if ((!totalPages.length || !currentPage.length) && !suggestion.length) {
                                    		handleSearchError(dObj);
                                            return false;
                                    }
                                    if (suggestion.length) {
                                            var suggestionContainer = getSuggestion(suggestion[0]);
                                            dObj.insertBefore(suggestionContainer, $('search-results'));
                                    }
                                    totalPages = parseInt(getNodeValue(totalPages[0]));
                                    currentPage = parseInt(getNodeValue(currentPage[0]));
                                    if (isNaN(totalPages) || isNaN(currentPage) || (currentPage > totalPages)) {
                                           handleSearchError(dObj);
                                    } else {
                                    		if (totalPages == 0 && !suggestion.length) {
                                    			dObj.appendChild(Builder.node('p', {id:'no-result-text'}, ['No results were found for '+ searchValue]));
                                    		} else {
                                                var searchResults = xmlData.getElementsByTagName('links');
                                                if (searchResults && searchResults.length) {
                                                        var resultsList = getResults(currentPage, searchResults[0]);
                                                        if (resultsList.hasChildNodes()) {
                                                                $('search-results').appendChild(resultsList);
                                                                resultsList.className = 'currentDisplay';
                                                        }
                                                        var pages = getPages(currentPage, totalPages, searchValue);
                                                        if (pages.hasChildNodes()) {
                                                                dObj.appendChild(pages);
                                                                setSearchLinks(siteName, totalPages);
                                                        }
                                                }
                                            }
                                    }
                            },
                            onComplete: function() {
                                if ($('loading_sign')) {
                                        var x = $('loading_sign');
                                        x.parentNode.removeChild(x);
                                }
                                if (!$('search-results').hasChildNodes) 
                                	handleSearchError(dObj);
	                        }
                        }
                );
        }
    }
};
function getResults(currentPage, results) {
        var container = Builder.node('ul', {id:'search-results-'+currentPage});
        var title_links = results.getElementsByTagName('title-link');
        var tmp;
        for (var i = 0; i < title_links.length; i++) {
    		var siteUrl = getNodeValueByChildName(title_links[i], 'link');
    		if (!siteUrl) continue;
    		var item = document.createElement('li');
    		var title = getNodeValueByChildName(title_links[i], 'title');
    		if (!title) title = siteUrl;
    		tmp = Builder.node('a', {href:siteUrl});
    		tmp.innerHTML = title;
   			item.appendChild(Builder.node('h3', [tmp]));
            item.appendChild(Builder.node('h4', [Builder.node('a', {href:siteUrl}, [siteUrl])]));
   			var evtDesc = getNodeValueByChildName(title_links[i], 'description');
   			if (evtDesc) {
   				tmp = document.createElement('p');
   				tmp.innerHTML = evtDesc;
   				item.appendChild(tmp);
   			}
            container.appendChild(item);
        }
        return container;
};
function getPages(currentPage, totalPages, searchValue) {
        if ($('searchPages')) {
                var container = $('searchPages');
                container.innerHTML = '';
        } else {
                var container = Builder.node('div', {id:'searchPages'});
        }
        if (totalPages == 1) {
        	container.style.visibility = 'hidden';
        } else {
        	container.style.visibility = 'visible';
        }
        if (currentPage > 1) {
                container.appendChild(Builder.node('a', {id:'previous_page', href:'search-results.html?query='+escape(searchValue)+'&page='+(parseInt(currentPage)-1), className:'searchLink'}, ['Prev']));
        }
        for (var i = 1; i <= totalPages; i++) {
                if ( i != currentPage) {
                        var pageNumber = Builder.node('a', {href:'search-results.html?query='+escape(searchValue)+'&page='+i, className:'searchLink'}, [i]);
                } else {
                        var pageNumber = Builder.node('strong', [i]);
                }
                container.appendChild(pageNumber);
        }
        if (currentPage < totalPages) {
                container.appendChild(Builder.node('a', {id:'next_page', href:'search-results.html?query='+escape(searchValue)+'&page='+(parseInt(currentPage)+1), className:'searchLink'}, ['Next']));
        }
        return container;
};
function getSuggestion(suggestion) {
        var suggestPhrase = getNodeValue(suggestion);
        var lnk = Builder.node('a', {href:'search-results.html?query='+escape(suggestPhrase), className:'searchLink', suggest:true}, [suggestPhrase]);
        return Builder.node('p', {id: 'suggestion-text'}, ['Did you mean ', lnk, '?']);
};
function setSearchLinks(siteName, totalPages) {
        var lnks = document.getElementsByClassName('searchLink');
        for (var i = 0; i < lnks.length; i++) {
                lnks[i].onclick = function() {
                        var queryParams = this.href.toQueryParams();
                        if (queryParams.page && $('search-results-'+queryParams.page)) {
                                var currentDisplay = document.getElementsByClassName('currentDisplay');
                                if (currentDisplay.length) {
                                        currentDisplay = currentDisplay[0];
                                        currentDisplay.removeClassName('currentDisplay');
                                }
                                $('search-results-'+queryParams.page).addClassName('currentDisplay');
                                 var pages = getPages(queryParams.page, totalPages, queryParams.query);
                                if (pages.hasChildNodes()) {
                                        setSearchLinks(siteName, totalPages);
                                }
                        } else {
                                var searchParams = 'site_id='+siteName;
                                if (queryParams.query) {
                                        searchParams += '&kword='+queryParams.query;
                                        if (queryParams.page) {
                                                searchParams += '&page_id='+queryParams.page;
                                        }
                                }
                                var isSuggest = (this.suggest)?true:false;
                                if (isSuggest) {
                                        $('search-results').innerHTML = '';
                                }
                                new Ajax.Request('/ajax/siteSearch.jsp',
                                        {
                                                method:'get',
                                                parameters:'nC='+noCache()+'&'+searchParams,
												onCreate: function() {
						                                if (!$('loading_sign')) {
						                                	createLoadingSign($('search-results'));
						                                }
						                                var x = $('loading_sign');
						                                Element.show(x);
						                        },
                                                onSuccess:function(xml) {
                                                		var xmlData = xml.responseXML.documentElement;
                                                        var currentPage = xmlData.getElementsByTagName('currentPage');
                                                        var totalPages = xmlData.getElementsByTagName('totalPages');
                                                        if (!totalPages.length || !currentPage.length) {
                                                    		return false;
                                           				}
                                           				totalPages = parseInt(getNodeValue(totalPages[0]));
                                            			currentPage = parseInt(getNodeValue(currentPage[0]));
                                                        var searchResults = xmlData.getElementsByTagName('links');
                                                        if (searchResults && searchResults.length) {
                                                                var resultsList = getResults(currentPage, searchResults[0]);
                                                                if (resultsList.hasChildNodes()) {
                                                                	var currentDisplays = document.getElementsByClassName('currentDisplay');
                                                                	if (currentDisplays.length) {
                                                                		for (var i = 0; i < currentDisplays.length; i++) {
                                                                			currentDisplays[i].removeClassName('currentDisplay');
                                                                		}
                                                                	}
                                                                	resultsList.className = 'currentDisplay';
                                                                    $('search-results').appendChild(resultsList);
                                                                }
                                                                var pages = getPages(currentPage, totalPages, queryParams.query);
                                                                if (pages.hasChildNodes()) {
                                                                        setSearchLinks(siteName, totalPages);
                                                                }
                                                        }
                                                },
                                               onComplete: function() {
					                                if ($('loading_sign')) {
					                                        var x = $('loading_sign');
					                                        x.parentNode.removeChild(x);
					                                }
						                        }
                                        }
                                );
                        }
                       window.location.href = '#search-results';
                       return false;
                }
        }
};
function createLoadingSign(container) {
		if (!container) return false;
        var img = Builder.node('img', {src:'/media/global/loading.gif', alt:'Loading...'});
        var span = Builder.node('span', [' Loading... ']);
        var div = Builder.node('div', {id: 'loading_sign', style: 'display: none; width:auto;'}, [img, span]);
        container.appendChild(div);
};
function handleSearchError(dObj) {
	dObj.innerHTML = '<p>An error occurred during search.</p>';
};