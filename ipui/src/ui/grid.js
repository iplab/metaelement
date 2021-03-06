function grid() {
}
grid.prototype = {
	
	initialize: function() {
		IPUI.setTheme(IPUI.theme); //Load Theme
		this.defaultRows 	= 10;
		this.grid 			= {};
	},
	
	display: function(targetObj, dataObj){
	try {
		var gridId 						= targetObj.getAttribute('id');
		this.grid[gridId] 				= {};
		//console.info('$$=' + targetObj.$$('.columns'));
		this.grid[gridId]['columns']	= $$('#' + gridId + ' .columns div').toArray();
		console.info(this.grid[gridId].columns.length);
		this.grid[gridId].data 			= dataObj;
		this.grid[gridId]['settings']	= {
	            column_count: $$('#'+ gridId + ' .columns div').size(),
	            align: 'center',
				total_width: this.gridWidth(targetObj),
				cursor: 1,
				rows: parseFloat(this.getRows(targetObj)),
				pages: Math.ceil(dataObj.length / parseFloat(this.getRows(targetObj))),
				currentPage: 1
	        };
		this.buildLayout(targetObj);
		}
		catch(e) {
			console.info(e)
		}
	},
	
	buildLayout: function (targetObj){
		IPUI.requires('common.base.query');
		var gridId		= targetObj.getAttribute('id');
		var contentObj  = new Element('div',{id:gridId+'_content','className':targetObj.getAttribute('class')});
		if(this.grid[gridId].settings.column_count>0)
			contentObj.innerHTML = this.gridNavigation(gridId,'header') 
									+ this.gridColumnHeader(gridId)
									+ '<div id="' + gridId + '_data" class="gridContent">' 
									+ this.gridData(gridId,this.grid[gridId].settings.cursor, this.grid[gridId].settings.rows) + '</div>'
									+ this.gridNavigation(gridId,'footer'); 
		console.info(contentObj);
		targetObj.appendChild(contentObj);
	},
	
	getRows: function(targetElement) {
		var rows;
		(targetElement.getAttribute('rows')) ? rows=targetElement.getAttribute('rows') : rows=this.defaultRows;
		return rows;
	},
	
	gridData: function(gridId, cursor, rows) {
		var tmpHtml = '';
		for(var j=cursor;j<=(cursor+rows-1);j++) {
			var dataRow = this.grid[gridId].data[j];
			if(typeof dataRow == 'function'){
				continue;
			}
			else if(j>=(cursor-1) && j <=(cursor+rows-1)) {
				tmpHtml += '<ul class="gridContent">';
				if(typeof dataRow == 'object') {
					for(var i=0;i<this.grid[gridId].settings.column_count;i++){
						var columnId 	= this.grid[gridId].columns[i].getAttribute('index');
						var row 		= '<li class="data"></li>';
						if(columnId in dataRow)
							tmpHtml += row.replace('><','>' + dataRow[columnId] + '<');
						else
							tmpHtml += row;	
					}
				}
				else break;
				tmpHtml += '</ul>';
			}
		}
		for(var i=j;i<(cursor+rows);i++) {
			var row = '<ul class="gridContent">';
			for(var j=0;j<this.grid[gridId].settings.column_count;j++) row += '<li class="data"></li>';
			tmpHtml += row + '</ul>';
		}
		return tmpHtml;
	},
	
	sort: function(gridId, dataIndex) {
		console.info(arguments)
	},
	
	next: function(gridId) {
		if(this.grid[gridId].settings.currentPage<this.grid[gridId].settings.pages) {
			this.grid[gridId].settings.currentPage++;
			this.gotoPage(gridId,this.grid[gridId].settings.currentPage);
		}
	},

	back: function(gridId) {
		if(this.grid[gridId].settings.currentPage>1) {
			this.grid[gridId].settings.currentPage--;
			this.gotoPage(gridId,this.grid[gridId].settings.currentPage);
		}
	},
	
	last: function(gridId) {
		this.gotoPage(gridId, this.grid[gridId].settings.pages);
	},

	first: function(gridId) {
		this.gotoPage(gridId, 1);
	},
		
	gotoPage: function(gridId, pageNum) {
		IPUI.requires('utils.general');
		if(IPUI.general.isNumber(pageNum) && (pageNum>0 && pageNum<=this.grid[gridId].settings.pages)) {
			this.grid[gridId].settings.cursor 		= this.grid[gridId].settings.rows * (pageNum-1) + 1;
			this.grid[gridId].settings.currentPage 	= pageNum;
			$(gridId + '_data').innerHTML 			= this.gridData(gridId, this.grid[gridId].settings.cursor, this.grid[gridId].settings.rows);
			this.setPageNum(gridId);
		}
		else {
			alert('Invalid Page Number');
			this.setPageNum(gridId);
		}
	},
	
	setPageNum: function(gridId) {
		var pageNum = this.grid[gridId].settings.currentPage;
		$$('#' + gridId + '_content .x-grid-page-number').each(function(item){item.value = pageNum;});
	},
	
	gridColumnHeader: function(gridId) {
		var columnRow = '<ul class="columnHeader">';
		for(var i=0;i<this.grid[gridId].settings.column_count;i++) {
			columnRow += '<li><a href="#" onclick="IPUI.grid.sort(\'' + gridId + '\',\'' + this.grid[gridId].columns[i].getAttribute('dataIndex') + '\');">' + this.grid[gridId].columns[i].getAttribute('label') + '</a></li>';
		}
		columnRow += '</ul>';
		console.info(columnRow)
		return columnRow;
	},
	
	gridNavigation: function(gridId,prepend) {
		
		var tmpLyt = '<div class="gridNav">'
			 + '<button class="first-page" onclick="IPUI.grid.first(\'' + gridId + '\');return false;"></button>'
			 + '<button class="prev-page" onclick="IPUI.grid.back(\'' + gridId + '\');return false;"></button>'
			 +  '<span></span>'
			 + 'Page <input type="text" onkeyup="IPUI.grid.gotoPage(\'' + gridId + '\',$F(this));" class="x-grid-page-number" value="1" /> of ' + this.grid[gridId].settings.pages
			 + '<span></span>'
			 + '<button class="next-page" onclick="IPUI.grid.next(\'' + gridId + '\');return false;"></button>'
			 + '<button class="last-page" onclick="IPUI.grid.last(\'' + gridId + '\');return false;"></button>' 
			 + '<span></span>'
			 + '<button class="done-icon"></button>' 
			 + '</div>';
		return tmpLyt;
	},
	
	gridWidth: function (targetElement){
		var gridId = targetElement.getAttribute('id');
		IPUI.requires('utils.general');
		var totalWidth=0;
		if(IPUI.general.isNumber(targetElement.getAttribute('width'))) {
			totalWidth = parseFloat(targetElement.getAttribute('width'));
		}
		else {
			for(var i=0;i<this.grid_columnArray.length;i++) {
				if(IPUI.general.isNumber(this.grid[gridId].columns[i].getAttribute('width'))) {
					totalWidth = parseFloat(this.grid[gridId].columns[i].getAttribute('width')-0 + totalWidth);
				}
			}
		}
		return totalWidth;
	},
	
	gridHeight: function (){
		IPUI.requires('utils.general');
		var arrWinSizeAndScroll = IPUI.general.getWinSizeAndScroll();
		$('#GridLayout ul li').css({height:(arrWinSizeAndScroll[1] + arrWinSizeAndScroll[3] + "px")});
		if (this.grid_settings.align == 'center'){
			$('#GridLayout').css({left:(arrWinSizeAndScroll[0] + "px")});	
		}
		else if (this.grid_settings.align == 'right'){
			$('#GridLayout').css({right:"0px"});	    
		}
		else{
			$('#GridLayout').css({left:"0px"});	    	    
		}
	}
	
};
