/*
 * modalBox.js
 */
function addOverlay() {
        var overlay = Builder.node('div', {id: 'ue_overlay', style:'display: none;'});
        overlay.style.filter = 'alpha(opacity=0)';
        document.body.appendChild(overlay);
};
function addEventPopup() {
        var ue_popup = Builder.node('div', {id: 'ue_popup', style:'display:none'});
        var close_button = Builder.node('a', {id:'close_popup', href:'#'}, ['Close X']);
        ue_popup.innerHTML = popupDefaultElems();
        ue_popup.insertBefore(close_button, ue_popup.firstChild);
        close_button.onclick = function() {
                closeEvPopup();
                closeOverlay();
                return false;
        }
        return document.body.appendChild(ue_popup);
};
function showOverlay() {
        if ($('ue_overlay')) {
                var overlay = $('ue_overlay');
                overlay.style.height = windowHeight() + 'px';
                overlay.style.width = windowWidth() + 'px';
                Effect.Appear(overlay, {to:0.75});
                Event.observe(window, 'resize', adjustOverlay);
        }
};
function showEvPopup() {
        if ($('ue_popup')) {
                var ue_popup = $('ue_popup');
                Effect.Appear(ue_popup);
                adjustEvPopup();
                Event.observe(window, 'resize', adjustEvPopup);
        }
};
function closeEvPopup() {
        var ue_popup = $('ue_popup');
        ue_popup.parentNode.removeChild(ue_popup);
        return false;
};
function closeOverlay() {
        var overlay = $('ue_overlay');
        overlay.parentNode.removeChild(overlay);
};
function adjustOverlay() {
        if (!$('ue_overlay')) return false;
        var overlay = $('ue_overlay');
        overlay.style.height = windowHeight() + 'px';
        overlay.style.width = windoWidth() + 'px';
};
function adjustEvPopup() {
        if (!$('ue_popup')) return false;
        var w = getWidth($('ue_popup'));
        var h = getHeight($('ue_popup'));
        var t = (windowHeight() /2) - (h/2);
        var l = (windowWidth() / 2) - (w/2);
        if (t < 0) t = 0;
        if (l < 0) l = 0;
        $('ue_popup').style.top = t + "px";
        $('ue_popup').style.left = l + "px";
};
function getStyle(elem, name) {
        if (elem.style[name]) return elem.style[name];
        else if (elem.currentStyle) return elem.currentStyle[name];
        else if (document.defaultView && document.defaultView.getComputedStyle) {
                name = name.replace(/([A-Z])/g,"-1$");
                name = name.toLowerCase();
                var s = document.defaultView.getComputedStyle(elem,"");
                return s && s.getPropertyValue(name);
        } else return null;
};
function popupDefaultElems() {
        return '<h2 id="popup_evname"></h2>' +
                        '<p id="popup_evinfo"><span id="popup_evdate"></span> at <span id="popup_venue"></span></p>' +
                        '<p><span id="popup_evtour"></span></p>';
};
function getHeight(elem) {
        if (getStyle(elem, 'display') != 'none')
                return elem.offsetHeight || parseInt(getStyle(elem, 'height'));
        var old = resetCSS(elem, {display:'', visibility:'hidden', position:'absolute'});
        var h = elem.clientHeight || parseInt(getStyle(elem, 'height'));
        restoreCSS(elem, old);
        return h;
};
function getWidth(elem) {
        if (getStyle(elem, 'display') != 'none')
                return elem.offsetWidth || parseInt(getStyle(elem, 'width'));
        var old = resetCSS(elem, {display:'', visibility:'hidden', position:'absolute'});
        var w = elem.clientWidth || parseInt(getStyle(elem, 'width'));
        restoreCSS(elem, old);
        return w;
};
function resetCSS(elem, prop) {
        var old = {};
        for (var i in prop) {
                old[i] = elem.style[i];
                elem.style[i] = prop[i];
        }
        return old;
};
function restoreCSS(elem, prop) {
        for (var i in prop)
                elem.style[i] = prop[i];
};
function windowHeight() {
        var de = document.documentElement;
        return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
};
function windowWidth() {
        var de = document.documentElement;
        return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
};