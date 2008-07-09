/**
 * @description The date Class
 * @constructor
 */	
 function date(){
	this.url = '/ajax/date.jsp';
};
date.prototype = {

	/**
	 * 
	 */
	getServerTime: function() {
		IPUI.requires('ipui.src.base.xml');
		new Ajax.Request(this.url,{asynchronous:false,
				onSuccess:function(xml){
					server_time=IPUI.xml.getNodeValue(IPUI.xml.get_firstchild(xml.responseXML.documentElement));
				}});
	},
	
	/**
	 * 
	 * @param {Object} p_Expression
	 */	
	isDate: function(p_Expression){
		return !isNaN(new Date(p_Expression));		// <<--- this needs checking
	},

	/**
	 * 
	 * @param {Object} p_Interval
	 * @param {Object} p_Number
	 * @param {Object} p_Date
	 */
	dateAdd: function(p_Interval, p_Number, p_Date){
		if(!this.isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		if(isNaN(p_Number)){return "invalid number: '" + p_Number + "'";}	
	
		p_Number = new Number(p_Number);
		var dt = new Date(p_Date);
		switch(p_Interval.toLowerCase()){
			case "yyyy": {// year
				dt.setFullYear(dt.getFullYear() + p_Number);
				break;
			}
			case "q": {		// quarter
				dt.setMonth(dt.getMonth() + (p_Number*3));
				break;
			}
			case "m": {		// month
				dt.setMonth(dt.getMonth() + p_Number);
				break;
			}
			case "y":		// day of year
			case "d":		// day
			case "w": {		// weekday
				dt.setDate(dt.getDate() + p_Number);
				break;
			}
			case "ww": {	// week of year
				dt.setDate(dt.getDate() + (p_Number*7));
				break;
			}
			case "h": {		// hour
				dt.setHours(dt.getHours() + p_Number);
				break;
			}
			case "n": {		// minute
				dt.setMinutes(dt.getMinutes() + p_Number);
				break;
			}
			case "s": {		// second
				dt.setSeconds(dt.getSeconds() + p_Number);
				break;
			}
			case "ms": {		// second
				dt.setMilliseconds(dt.getMilliseconds() + p_Number);
				break;
			}
			default: {
				return "invalid interval: '" + p_Interval + "'";
			}
		}
		return dt;
	},
	
	/**
	 * 
	 * @param {Object} p_Interval
	 * @param {Object} p_Date1
	 * @param {Object} p_Date2
	 * @param {Object} p_firstdayofweek
	 * @param {Object} p_firstweekofyear
	 */
	dateDiff: function(p_Interval, p_Date1, p_Date2, p_firstdayofweek, p_firstweekofyear){
		if(!this.isDate(p_Date1)){return "invalid date: '" + p_Date1 + "'";}
		if(!this.isDate(p_Date2)){return "invalid date: '" + p_Date2 + "'";}
		var dt1 = new Date(p_Date1);
		var dt2 = new Date(p_Date2);
	
		// get ms between dates (UTC) and make into "difference" date
		var iDiffMS = dt2.valueOf() - dt1.valueOf();
		var dtDiff = new Date(iDiffMS);
	
		// calc various diffs
		var nYears  = dt2.getUTCFullYear() - dt1.getUTCFullYear();
		var nMonths = dt2.getUTCMonth() - dt1.getUTCMonth() + (nYears!=0 ? nYears*12 : 0);
		var nQuarters = parseInt(nMonths/3);	//<<-- different than VBScript, which watches rollover not completion
		
		var nMilliseconds = iDiffMS;
		var nSeconds = parseInt(iDiffMS/1000);
		var nMinutes = parseInt(nSeconds/60);
		var nHours = parseInt(nMinutes/60);
		var nDays  = parseInt(nHours/24);
		var nWeeks = parseInt(nDays/7);
	
	
		// return requested difference
		var iDiff = 0;		
		switch(p_Interval.toLowerCase()){
			case "yyyy": return nYears;
			case "q": return nQuarters;
			case "m": return nMonths;
			case "y": 		// day of year
			case "d": return nDays;
			case "w": return nDays;
			case "ww":return nWeeks;		// week of year	// <-- inaccurate, WW should count calendar weeks (# of sundays) between
			case "h": return nHours;
			case "n": return nMinutes;
			case "s": return nSeconds;
			case "ms":return nMilliseconds;	// millisecond	// <-- extension for JS, NOT available in VBScript
			default: return "invalid interval: '" + p_Interval + "'";
		}
	},
	
	/**
	 * 
	 * @param {Object} p_Interval
	 * @param {Object} p_Date
	 * @param {Object} p_firstdayofweek
	 * @param {Object} p_firstweekofyear
	 */
	datePart: function(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear){
		if(!this.isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		var dtPart = new Date(p_Date);
		switch(p_Interval.toLowerCase()){
			case "yyyy": return dtPart.getFullYear();
			case "q": return parseInt(dtPart.getMonth()/3)+1;
			case "m": return dtPart.getMonth()+1;
			case "y": return this.dateDiff("y", "1/1/" + dtPart.getFullYear(), dtPart);			// day of year
			case "d": return dtPart.getDate();
			case "w": return dtPart.getDay();	// weekday
			case "ww":return this.dateDiff("ww", "1/1/" + dtPart.getFullYear(), dtPart);		// week of year
			case "h": return dtPart.getHours();
			case "n": return dtPart.getMinutes();
			case "s": return dtPart.getSeconds();
			case "ms":return dtPart.getMilliseconds();	// millisecond	// <-- extension for JS, NOT available in VBScript
			default: return "invalid interval: '" + p_Interval + "'";
		}
	},
	
	/**
	 * 
	 * @param {Object} p_Date
	 * @param {Object} p_abbreviate
	 */
	weekdayName: function(p_Date, p_abbreviate){
		if(!this.isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		var dt = new Date(p_Date);
		var retVal = dt.toString().split(' ')[0];
		var retVal = Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')[dt.getDay()];
		if(p_abbreviate==true){retVal = retVal.substring(0, 3)}	// abbr to 1st 3 chars
		return retVal;
	},
	
	/**
	 * 
	 * @param {Object} p_Date
	 * @param {Object} p_abbreviate
	 */
	monthName: function(p_Date, p_abbreviate){
		if(!this.isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
		var dt = new Date(p_Date);	
		var retVal = Array('January','February','March','April','May','June','July','August','September','October','November','December')[dt.getMonth()];
		if(p_abbreviate==true){retVal = retVal.substring(0, 3)}	// abbr to 1st 3 chars
		return retVal;
	},
	
	/**
	 * 
	 * @param {Object} p_Expression
	 */
	IsDate: function(p_Expression){
		return this.isDate(p_Expression);
	},
	
	/**
	 * 
	 * @param {Object} p_Interval
	 * @param {Object} p_Number
	 * @param {Object} p_Date
	 */
	DateAdd: function(p_Interval, p_Number, p_Date){
		return this.dateAdd(p_Interval, p_Number, p_Date);
	},
	
	/**
	 * 
	 * @param {Object} p_interval
	 * @param {Object} p_date1
	 * @param {Object} p_date2
	 * @param {Object} p_firstdayofweek
	 * @param {Object} p_firstweekofyear
	 */
	DateDiff: function(p_interval, p_date1, p_date2, p_firstdayofweek, p_firstweekofyear){
		return this.dateDiff(p_interval, p_date1, p_date2, p_firstdayofweek, p_firstweekofyear);
	},
	
	/**
	 * 
	 * @param {Object} p_Interval
	 * @param {Object} p_Date
	 * @param {Object} p_firstdayofweek
	 * @param {Object} p_firstweekofyear
	 */
	DatePart: function(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear){
		return this.datePart(p_Interval, p_Date, p_firstdayofweek, p_firstweekofyear);
	},
	
	/**
	 * 
	 * @param {Object} p_Date
	 */
	WeekdayName: function(p_Date){
		return this.weekdayName(p_Date);
	},
	
	/**
	 * 
	 * @param {Object} p_Date
	 */
	MonthName: function(p_Date){
		return this.monthName(p_Date);
	},
	
	/**
	 * 
	 * @param {Object} dateobj
	 */
	parseDateObj: function(dateobj) {
		var x = new Object();
		x['month'] = hasZero(dateobj.getMonth()+1);
		x['day'] = hasZero(dateobj.getDate());
		x['year'] = dateobj.getYear();
		x['hour'] = hasZero(dateobj.getHours());
		x['minute'] = hasZero(dateobj.getMinutes());
		x['second'] = hasZero(dateobj.getSeconds());
		
		return x;
	},
	
	/**
	 * 
	 * @param {Object} date_time
	 */
	createDateObj: function(date_time) {
		return new Date(Date.parse(date_time));
	},
	
	/**
	 * 
	 * @param {Object} dateObj
	 * @param {Object} diff
	 */
	convertTimeZone: function(dateObj, diff) {
		var tmp = "";
		var plusminus = 1;
		if (diff.split("-").length > 1) {
			tmp = diff.split("-")[1];
			plusminus = -1;
		} else if (diff.split("+").length > 1) {
			tmp = diff.split("+")[1];
			plusminus = 1;
		}
		if (tmp.length) {
			dateObj = dateAdd('n', plusminus * tmp.split(":")[1], dateObj);
			dateObj = dateAdd('h', plusminus * tmp.split(":")[0], dateObj);
		}
		return dateObj;
	},
	
	/**
	 * 
	 * @param {Object} dateObj
	 * @param {Object} diff
	 */
	convertToGMT: function(dateObj, diff) {
		var tmp = "";
		var plusminus = 1;
		if (diff.split("-").length > 1) {
			tmp = diff.split("-")[1];
			plusminus = 1;
		} else if (diff.split("+").length > 1) {
			tmp = diff.split("+")[1];
			plusminus = -1;
		}
		if (tmp.length) {
			dateObj = dateAdd('n', plusminus * tmp.split(":")[1], dateObj);
			dateObj = dateAdd('h', plusminus * tmp.split(":")[0], dateObj);
		}
		return dateObj;
	},
	
	/**
	 * 
	 * @param {Object} p_Date
	 */
	convertHours: function(p_Date) {
	    if(!this.isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
	    var regHr = p_Date.getHours();
	    if (regHr == 0) regHr = 12;
	    else if (regHr > 12) regHr -= 12;
	    return regHr;
	},
	
	/**
	 * 
	 * @param {Object} p_Date
	 */
	showAMPM: function(p_Date) {
		if(!this.isDate(p_Date)){return "invalid date: '" + p_Date + "'";}
	    var amPM;
	    if (p_Date.getHours() < 12) amPM = 'AM';
	    else amPM = 'PM';
	    return amPM;
	},
	
	/**
	 * 
	 * @param {Object} dx
	 * @param {Object} begin
	 * @param {Object} end
	 */
	dateInRange: function(dx, begin, end) {
	    if (!this.isDate(dx) || !this.isDate(begin) || !this.isDate(end)) { return false; }
	    return (this.dateDiff('n', begin, dx) >= 0 && dateDiff('n', dx, end) >= 0)?true:false;
	}
	
	
	
};

