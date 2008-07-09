// Launching AOL IM and CONSOLES
// STaF Functions for Email this and IM this Functionalities
var IM_global_title;
var IM_global_url;

var IM_default_text_IE = "Check%20out%20this%20page%20on%20";
var IM_default_text_OT = "Check out this page on ";

// To check AIM install in the local machine or not
function canRunAIM() {
    var agt = navigator.userAgent.toLowerCase();
    var isIE =  (agt.indexOf("msie") != -1);
    if (!isIE) 
       return true;

    var a = document.anchors;
    for (var i=0;i<a.length;i++) {
        if (a[i].name=="aimnotfound") {
            return false;
        }
    }
    return true;
}

// To check AOL Client install in the local machine or not
function canRunAOLClient() {
    var agt = navigator.userAgent.toLowerCase();
    var isIE =  (agt.indexOf("msie") != -1);
    if (!isIE) 
        return true;

    var a = document.anchors;
    for (var i=0;i<a.length;i++) {
        if (a[i].name=="aolclientnotfound") {
            return false;
        }
    }
    return true;
}

// To send IM through AOL Client Messenger
function sendAOLCLNT() {
 
 var title = IM_global_title;
 var url   = IM_global_url;

 var uAgt	=	navigator.userAgent.toLowerCase();
 var isAOL	=	uAgt.indexOf(" aol ")	!= -1;
 var isIE =  uAgt.indexOf("msie") != -1;
 
 try {

  if (!isAOL) {
 	 if (!isIE) {
        document.location="aol://9293::"+ IM_default_text_OT + "<br><a href='" + url + "'>" + title + "</a>";
	 } else {
	   document.location="aol://9293::"+ IM_default_text_IE +"%3cbr%3e%3ca href='" + url + "'%3e" + title + "%3c%2fa%3e";
     }
  } else {
     document.location='aol://9293::' + IM_default_text_OT +'<br><a href="' + url + '">' + title + '</a>'
  }

 } catch (e) {
    AIMExpress.start();
 }
}

// To send IM through AIM
function sendAIM() {
 
 var title = IM_global_title;
 var url   = IM_global_url;

 var title = title.replace(/ /g, "+");
 var uAgt	=	navigator.userAgent.toLowerCase();
 var isIE	=	uAgt.indexOf(" msie ")	!= -1;
 var isAOLBrowser	=	uAgt.indexOf(" america online browser ") != -1; 
 if (!isIE) {
    var message = IM_default_text_OT + title + ':' + '<br><a href="' + url + '">' + url + '</a>';
 } else if(isAOLBrowser) {
    var message = IM_default_text_OT + title + ':' + '<br><a href="' + url + '">' + url + '</a>';
 } else {
    var message = IM_default_text_IE + title + ':' + "%3cbr%3e%3ca+href=%22" + escape(url) + "%22%3e" + url + "%3c%2fa%3e";
 }
	message = escape(message);  
 
 try {
  document.location = 'aim:GoIm?message=' + message;
 } catch (e) {
//	sendAOLCLNT();
  AIMExpress.start();
 }
}

// If user is not using AOL Client then 
// send IM thro AIM if exists else if AOLClient exists then 
// send IM thro AOLClient else launch AIM Express and send IM

// If user in using the AOL Client then send IM thro AOL Client Instant Messenger
function sendIM(title, url) {

 if(title == '') {
	title = 'Click here to checkout';
 }

 IM_global_title = title;
 IM_global_url = url;

 var uAgt	=	navigator.userAgent.toLowerCase();
 var isAOL	=	uAgt.indexOf(" aol ")	!= -1;
 var isIE	=	uAgt.indexOf(" msie ")	!= -1;
 if (!isAOL) {
   if (!isIE) {
      sendAIM ();
   } else {
	  if (!canRunAIM()) {
//	     if (!canRunAOLClient()) {
		    AIMExpress.start();
//	     } else {
//          sendAOLCLNT ();
//	     }
      } else {
         sendAIM ();
      }
   }
 } else {
       sendAOLCLNT ();
 }

}

function sendPageToFriend() {
     top.document.location.href = "http://www.msg.com/mail_Form.jsp?url=" + escape(top.document.location.href) + "&sports=basketball";
}