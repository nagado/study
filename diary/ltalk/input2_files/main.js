var main_js_is_loaded = 0; // 1, если main.js польностью загружен
function log(msg){
	var img = new Image;
	img.src = 'http://ltalk.ru/js_errors?'+msg;
}
function getError(msg, url,lno){
	if (main_js_is_loaded == 1){
		var code='';
		if (lno && !isNaN(lno) && document.documentElement && document.documentElement.innerHTML){
			var lines = String(document.documentElement.innerHTML).split(/\n/);
			if (lines.length>=lno){
				code = '-2:'+lines[lno-3]+'][-1:'+lines[lno-2]+'][0:'+lines[lno-1]+'][1:'+lines[lno]+'][2:'+lines[lno+1];
			}
		}
		log('m='+escape(msg)+'&u='+escape(url)+'&l='+escape(lno)+'&r='+escape(document.referrer)+'&c='+escape(code)+'&'+Math.random());
	}
	return true;
}
xAddEventListener(window,"error",getError,false)

var opera_mini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]" ? 1 : 0;

var tz = escape((new Date()).getTimezoneOffset());
var c_cookie = get_p_cookie(3);
var m_cookie = get_p_cookie(4);
var r_cookie = get_p_cookie(5);
var sw='';
var sh='';
if(typeof(screen)!='undefined'){
	sw = screen.width;
	sh = screen.height;
}
document.cookie = "p="
	+ tz + ':' + sw + ':' + sh
		+ ':' + (c_cookie ? c_cookie : 0)
		+ ':' + (m_cookie ? m_cookie : 'U')
		+ ':' + (r_cookie ? r_cookie : 'Y')
	+"; path=/; domain=.ltalk.ru; expires=Sun, 31 Dec 2034 23:59:59 GMT";

function CheckAvatar(j,context,avatar){
	var f=document.forms[context];
	if(f){
		var i=0;
		while(xGetElementById('a'+i)){
			xGetElementById('a'+i).style.borderColor = '#ffffff';
			i++;
		}
		if (f.avatar.value != avatar){
			f.avatar.value = avatar;
			j.style.borderColor = '#808080';
		}
		else{
			f.avatar.value = '';
		}
	}
}
function CheckPMAvatar(j,context,avatar){
	var f=document.forms[context];
	if(f){
		var i=0;
		while(xGetElementById(context+'_a'+i)){
			xGetElementById(context+'_a'+i).style.borderColor = '#ffffff';
			i++;
		}
		if (f.avatar.value != avatar){
			f.avatar.value = avatar;
			j.style.borderColor = '#808080';
		}
		else{
			f.avatar.value = '';
		}
	}
}
function deleteCookie(n){
	document.cookie = n+"=; path=/; domain=.ltalk.ru; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = n+"=; path=/; domain=."+document.location.hostname+"; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = n+"=; path=/; domain=ltalk.ru; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = n+"=; path=/; domain="+document.location.hostname+"; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = n+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = n+"=; path="+document.location.pathname+"; domain=.ltalk.ru; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = n+"=; path="+document.location.pathname+"; domain=."+document.location.hostname+"; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = n+"=; path="+document.location.pathname+"; domain=ltalk.ru; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = n+"=; path="+document.location.pathname+"; domain="+document.location.hostname+"; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}
function getCookie(n) {
	var c = document.cookie;
	if (c.length < 1)
		return false;

	var data = c.match(new RegExp('(?:^|;)\\s*'+n+'=([^;]*)'));
	if (data != null) {
		return data[1];
	}
	return false;
}
function feelLogin(){
	var f = document.forms['forma'];
	if (f){
		var l = loginFromU();
		if (l && l.length > 4){
			if (f.login && (f.login.value != l)){
				f.login.value = l;
				if (f.pass){
					f.pass.value = '';
				}
			}
		}
		var rm = get_p_cookie(5);
		if (rm){
			if (rm == 'Y'){
				f.remember_me.checked = true;
			}
			else{
				f.remember_me.checked = false;
			}
		}
		xGetElementById('form_div').style.display='block';
		if(f.login.value == null){
			return false;
		}
		f.login.value.length>4?f.pass.focus():f.login.focus();
		return false;
	}
	return true;
}
function loginFromU () {
	var u = getCookie('u');
	if (u) {
		var data = u.split(':');
		return data[1];
	}
	return false;
}
function _show_response(a,n) {
	var str="toolbar=0,scrollbars=0,location=0,statusbar=1,menubar=0,resizable=1,width=300,height=185";
	if(window.screen){
		var xc=screen.availWidth/2-140;
		var yc=screen.availHeight/2-115;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=140";
	}
	return str;
}
function ShowResponse(a,n){
	var str=_show_response(a,n);
	var href=a.href ? a.href : a;
	if (window.open(href,n ? n : '',str)){
		return false;
	}
	else{
		return true;
	}
}
function ShowResponseSubmit(a,n){
	var str=_show_response(a,n);
	var href=a.href ? a.href : a;
	window.open(href,n ? n : '',str);
	return true;
}

function ShowWebcam(a){
	if (is_guest){
		var login = loginFromU();

		if (login){
			document.location = 'http://ltalk.ru/p/login.cgi?r=http://ltalk.ru/live/';
		}
		else{
			document.location = 'http://ltalk.ru/p/register.cgi?r=http://ltalk.ru/live/';
		}
		return false;
	}
	var str="toolbar=0,scrollbars=0,location=0,statusbar=1,menubar=0,resizable=1,width=338,height=276";
	if(window.screen){
		var xc=screen.availWidth/2-160;
		var yc=screen.availHeight/2-158;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=158";
	}
	var href = a.href ? a.href : a;
	if (window.open(href,'webcam',str)){
		return false;
	}
	else{
		return true;
	}
}
var image_context;
var image_timeout_id;
function checkWindow(){
	var image_code=getCookie('ic');
	if (!image_code){
		clearTimeout(image_timeout_id);
		image_timeout_id=setTimeout("checkWindow();",99);
		return;
	}
	deleteCookie('ic');
	clearTimeout(image_timeout_id);

	image_code = unescape(image_code);

	var f = document.forms[image_context];
	if (f){
		if (image_code){
			f.message.value += image_code;
			f.message.focus();
		}
		return;
	}
	var image_context_element = xGetElementById(image_context);
	if(image_context_element){
		image_context_element.value += image_code;
	}
}
function addImage(context){
	var str="toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=780,height=466";
	if(window.screen){
		var xc=screen.availWidth/2-390;
		var yc=screen.availHeight/2-233;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=120";
	}
	deleteCookie('ic');
	window.open("http://"+document.location.hostname+"/p/add_image.cgi","",str);
	image_context=context;
	image_timeout_id=setTimeout("checkWindow();",99);
}
var video_context;
var video_timeout_id;
function checkVideoWindow(){
	var video_code=getCookie('vc');
	if (!video_code){
		clearTimeout(video_timeout_id);
		video_timeout_id=setTimeout("checkVideoWindow();",99);
		return;
	}

	deleteCookie('vc');
	clearTimeout(video_timeout_id);

	video_code = unescape(video_code);

	var f = document.forms[video_context];
	if (f){
		f.message.value += video_code;
		f.message.focus();
		return;
	}

	var user_context_element = xGetElementById(video_context);
	if (user_context_element){
		user_context_element.value += video_code;
	}
}
function addVideo(context){
	var str="toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=780,height=466";
	if(window.screen){
		var xc=screen.availWidth/2-390;
		var yc=screen.availHeight/2-233;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=120";
	}
	deleteCookie('vc');
	window.open("http://"+document.location.hostname+"/p/add_video.cgi","",str);
	video_context=context;
	video_timeout_id=setTimeout("checkVideoWindow();",99);
}
var audio_context;
var audio_timeout_id;
function checkAudioWindow(){
	var audio_code=getCookie('ac');
	if (!audio_code){
		clearTimeout(audio_timeout_id);
		audio_timeout_id=setTimeout("checkAudioWindow();",99);
		return;
	}

	deleteCookie('ac');
	clearTimeout(audio_timeout_id);

	audio_code = unescape(audio_code);

	var f = document.forms[audio_context];
	if (f){
		f.message.value += audio_code;
		f.message.focus();
		return;
	}

	var user_context_element = xGetElementById(audio_context);
	if (user_context_element){
		user_context_element.value += audio_code;
	}
}
function addAudio(context){
	var str="toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=780,height=466";
	if(window.screen){
		var xc=screen.availWidth/2-390;
		var yc=screen.availHeight/2-233;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=120";
	}
	deleteCookie('ac');
	window.open("http://"+document.location.hostname+"/p/add_audio.cgi","",str);
	audio_context=context;
	audio_timeout_id=setTimeout("checkAudioWindow();",99);
}
var file_context;
var file_timeout_id;
function checkWindow2(){
	var image_code=getCookie('filecookie');
	if (image_code){
		image_code = unescape(image_code);
		var f = document.forms[file_context];
		if (f){
			if (image_code){
				f.message.value += image_code;
			}
		}
		deleteCookie('filecookie');
		clearTimeout(file_timeout_id);
	}
	else{
		clearTimeout(file_timeout_id);
		file_timeout_id=setTimeout("checkWindow2();",99);
	}
}
function addFile(context){
	var str="toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=780,height=466";
	if(window.screen){
		var xc=screen.availWidth/2-390;
		var yc=screen.availHeight/2-233;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=120";
	}
	deleteCookie('filecookie');
	window.open('http://ltalk.ru/p/add_file.cgi','',str);
	file_context=context;
	file_timeout_id=setTimeout("checkWindow2();",99);
}
var user_context;
var user_timeout_id;
function checkWindow3(){
	var user_code=getCookie('uc');
	if (!user_code){
		clearTimeout(user_timeout_id);
		user_timeout_id=setTimeout("checkWindow3();",99);
		return;
	}

	deleteCookie('uc');
	clearTimeout(user_timeout_id);

	user_code=unescape(user_code);

	var f = document.forms[user_context];
	if (f){
		f.message.value += user_code;
		f.message.focus();
		return;
	}
	var user_context_element = xGetElementById(user_context);
	if (user_context_element){
		user_context_element.value += user_code;
	}
}
function addUser(context){
	var str="toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=780,height=466";
	if(window.screen){
		var xc=screen.availWidth/2-390;
		var yc=screen.availHeight/2-233;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=120";
	}
	deleteCookie('uc');
	window.open('http://ltalk.ru/p/add_user.cgi?topic_id='+last_topic_id+'&blog_topic_id='+last_blog_topic_id+'&photo_id='+last_photo_id+'&blog_id='+last_blog_id,'',str);
	user_context=context;
	user_timeout_id=setTimeout("checkWindow3();",99);
}
var blog_context;
var blog_timeout_id;
function checkWindow4(){
	var blog_code=getCookie('bc');
	if (!blog_code){
		clearTimeout(blog_timeout_id);
		blog_timeout_id=setTimeout("checkWindow4();",99);
		return;
	}

	deleteCookie('bc');
	clearTimeout(blog_timeout_id);

	blog_code=unescape(blog_code);

	var f = document.forms[blog_context];
	if (f){
		f.message.value += blog_code;
		f.message.focus();
		return;
	}
	var user_context_element = xGetElementById(blog_context);
	if (user_context_element){
		user_context_element.value += blog_code;
	}
}
function addBlog(context){
	var str="toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=780,height=466";
	if(window.screen){
		var xc=screen.availWidth/2-390;
		var yc=screen.availHeight/2-233;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=120";
	}
	deleteCookie('bc');
	window.open('http://ltalk.ru/p/add_blog.cgi?topic_id='+last_topic_id+'&blog_topic_id='+last_blog_topic_id+'&photo_id='+last_photo_id+'&blog_id='+last_blog_id,'',str);
	blog_context=context;
	blog_timeout_id=setTimeout("checkWindow4();",99);
}
function addSmile(context,smile){
	var m;
	var f=document.forms[context];
	if(f){
		m = f.message;
	}
	else{
		m = xGetElementById(context);
	}

	if(!m){
		return;
	}

	if(document.selection){
		m.focus();
		sel=document.selection.createRange();
		sel.text=smile;
	}
	else if( m.selectionStart || m.selectionStart=="0" ){
		var s=m.selectionStart;
		var e=m.selectionEnd;
		m.value=m.value.substring(0,s)+smile+m.value.substring(e,m.value.length);
	}else{
		m.value += smile;
	}
	resizeTextArea(m);
	m.focus();
}
function addTag(context,tag){
	var f = document.forms[context];
	if(f){
		var m = f.message;
	}
	else{
		var m=xGetElementById(context);
	}

	if(!m){
		return;
	}

	if(document.selection){
		m.focus();
		sel=document.selection.createRange();
		sel.text='['+tag+']'+sel.text+'[/'+tag+']';
	}
	else if(m.selectionStart || m.selectionStart=="0"){
		var s=m.selectionStart;
		var e=m.selectionEnd;
		m.value=m.value.substring(0,s)+'['+tag+']'+m.value.substring(s, e)+'[/'+tag+']'+m.value.substring(e,m.value.length);
	}
	else{
		m.value += '['+tag+'][/'+tag+']';
	}
	resizeTextArea(m);
	m.focus();
}
function clearFormating(context){
	var f=document.forms[context];
	if(f){
		var m=f.message;
	}
	else{
		var m=xGetElementById(context);
	}

	if(!m){
		return;
	}

	var str=String(m.value);
	str=str.replace(/\[[BIUSH]\]/ig, '');
	str=str.replace(/\[\/[BIUSH]\]/ig, '');
	str=str.replace(/\[OFF\]/ig, '');
	str=str.replace(/\[\/OFF\]/ig, '');
	str=str.replace(/\[CENTER\]/ig, '');
	str=str.replace(/\[\/CENTER\]/ig, '');
	str=str.replace(/\[RIGHT\]/ig, '');
	str=str.replace(/\[\/RIGHT\]/ig, '');
	str=str.replace(/\[SPOILER\]/ig, '');
	str=str.replace(/\[\/SPOILER\]/ig, '');
	m.value=str;
	resizeTextArea(m);
	m.focus();
}
var quoteText = '';
var helped=0;
var pasted=0;
function get_quote(){
	var isMozilla = document.getElementById && !( document.all && document.all.item) && !window.opera;

	if(window.opera){
		quoteText = document.getSelection();
	} else if(window.getSelection){
		quoteText = window.getSelection();
		if( isMozilla){
			quoteText = quoteText.toString();
		}
	} else if(document.getSelection){
		quoteText = document.getSelection();
	} else if(document.selection){
		quoteText = document.selection.createRange().text;
	}
}
function quote(context){
	var text = quoteText;

	if( ! ( window.getSelection || document.getSelection || document.selection)){
		alert("Ваш браузер не поддерживает автоматическое цитирование. Но Вы можете выделить цитаты в тексте сообщения сами, поставив знак &gt; в начале каждого цитируемого абзаца.");
		return;
	}

	if(text==''){
		if(helped!=1 && pasted!=1){
			helped=1;
			alert("Если Вы хотите вставить цитату, то выделите её и нажмите 'Quote'");
		}
	}else{
		pasted=1;
		var str=String('\n'+text);
		str=str.replace(/(\n\s*)+/g, '\n> ');

		var f=document.forms[context];
		if(f){
			var m=f.message;
			m.focus();
			m.value=m.value+str;
			m.caretPos=m.value;
			resizeTextArea(m);
			m.focus();
		}
	}
}
var rus_lr2 = ('Е-е-О-о-Ё-Ё-Ё-Ё-Ж-Ж-Ч-Ч-Ш-Ш-Щ-Щ-Ъ-Ь-Э-Э-Ю-Ю-Я-Я-Я-Я-ё-ё-ж-ч-ш-щ-э-ю-я-я').split('-');
var lat_lr2 = ('/E-/e-/O-/o-ЫO-Ыo-ЙO-Йo-ЗH-Зh-ЦH-Цh-СH-Сh-ШH-Шh-ъ'+String.fromCharCode(35)+'-ь'+String.fromCharCode(39)+'-ЙE-Йe-ЙU-Йu-ЙA-Йa-ЫA-Ыa-ыo-йo-зh-цh-сh-шh-йe-йu-йa-ыa').split('-');
var rus_lr1 = ('А-Б-В-Г-Д-Е-З-И-Й-К-Л-М-Н-О-П-Р-С-Т-У-Ф-Х-Х-Ц-Щ-Ы-Я-а-б-в-г-д-е-з-и-й-к-л-м-н-о-п-р-с-т-у-ф-х-х-ц-щ-ъ-ы-ь-я').split('-');
var lat_lr1 = ('A-B-V-G-D-E-Z-I-J-K-L-M-N-O-P-R-S-T-U-F-H-X-C-W-Y-Q-a-b-v-g-d-e-z-i-j-k-l-m-n-o-p-r-s-t-u-f-h-x-c-w-'+String.fromCharCode(35)+'-y-'+String.fromCharCode(39)+'-q').split('-');
var pause=false;
function trans(vorTxt,txt){
	var buk=vorTxt+txt;
	var code=txt.charCodeAt(0);

	if(txt=="[")pause=true;
	else if(txt=="]")pause=false;

	if (pause==true|| !(((code>=65)&&(code<=123))||(code==35)||(code==39))) return buk;

	for (x=0;x<lat_lr2.length;x++){
		if (lat_lr2[x]==buk)return rus_lr2[x];
	}
	for (x=0;x<lat_lr1.length;x++){
		if (lat_lr1[x]==txt)return vorTxt+rus_lr1[x];
	}
	return buk;
}
function lat2win(str){
	var strnew=trans("",str.substr(0,1));
	var symb="";
	for (i=1;i<str.length;i++){
		symb=trans(strnew.substr(strnew.length-1,1),str.substr(i,1));
		strnew=strnew.substr(0,strnew.length-1)+symb;
	}
	return strnew;
}
function translit(context){
	var f=document.forms[context];
	if(f){
		var m=f.message;
	}
	else{
		var m = xGetElementById(context);
	}

	if(!m){
		return;
	}

	if(document.selection){
		m.focus();
		sel=document.selection.createRange();
		sel.text=lat2win(sel.text);
	}
	else if(m.selectionStart || m.selectionStart=="0"){
		var s=m.selectionStart;
		var e=m.selectionEnd;
		m.value=m.value.substring(0,s)+lat2win(m.value.substring(s, e))+m.value.substring(e,m.value.length);
	}
	else{
		m.value=lat2win(m.value);
	}
	resizeTextArea(m);
	m.focus();
}
var lastDiv='comment_reply';

// Copyright 2001-2010 Michael Foster (Cross-Browser.com)
// id string or object reference
function xGetElementById(e){
	if (typeof(e) == 'string') {
		if (document.getElementById) e=document.getElementById(e);
		else if(document.all) e=document.all[e];
		else e=null;
	}
	return e;
}
// tagName string
// parentID string or element reference
function xGetElementsByTagName(t,p){
	var list=null;
	t = t || '*';
	p = xGetElementById(p) || document;
	if (typeof p.getElementsByTagName != 'undefined') { // DOM1
		list=p.getElementsByTagName(t);
		if (t=='*' && (!list || !list.length)) list=p.all; // IE5 '*' bug
	}
	else { // IE4 object model
		if (t=='*') list=p.all;
		else if (p.all && p.all.tags) list=p.all.tags(t);
	}
	return list || [];
}
// sClsNameString. A className. This can also be a regular expression.
// oParentEleElement reference. If omitted "document" will be used. This can be an ID string if this function uses xGetElementsByTagName.
// sTagNameString. An HTML tagName. If omitted "*" will be used.
// fnCallbackCallback function, iterates thru the list of found elements. Is passed a reference to each Element object found.
function xGetElementsByClassName(c,p,t,f){
	var r=[], re, e, i, l;
	re = new RegExp("(^|\\s)"+c+"(\\s|$)");
	e = xGetElementsByTagName(t,p);
	for (i=0, l=e.length; i<l; ++i) {
		if (re.test(e[i].className)) {
			r[r.length] = e[i];
			if (f) f(e[i]);
		}
	}
	return r;
}
// ele id string or object reference
// name optional nodeName of parent to return
function xParent(e, s){
	e=xGetElementById(e);
	if (e) {
		e=e.parentNode;
		if (s) {
			while (e && e.nodeName.toLowerCase() != s) e=e.parentNode;
		}
	}
	return e;
}
function xDef(){
	for (var i=0, l=arguments.length; i<l; ++i) {
		if (typeof(arguments[i]) === 'undefined')
			return false;
	}
	return true;
}
// eleID string or object reference.
// sEventTypeString event type: 'mousemove', 'click', 'resize', etc.
// fnEventListenerReference to the listener function.
// bCaptureBoolean capture event flag.
function xAddEventListener(e,eT,eL,cap){
	if(!(e=xGetElementById(e)))return;
	eT=eT.toLowerCase();
	if(e.addEventListener)e.addEventListener(eT,eL,cap||false);
	else if(e.attachEvent)e.attachEvent('on'+eT,eL);
	else {
		var o=e['on'+eT];
		e['on'+eT]=typeof o=='function' ? function(v){o(v);eL(v);} : eL;
	}
}
// eleid string or object reference
// sEventTypestring event type ('mousemove', 'click', 'resize', etc.)
// fnEventListenerreference to the listener function
// bCaptureboolean capture event flag
function xRemoveEventListener(e,eT,eL,cap){
	if(!(e=xGetElementById(e)))return;
	eT=eT.toLowerCase();
	if(e.removeEventListener)e.removeEventListener(eT,eL,cap||false);
	else if(e.detachEvent)e.detachEvent('on'+eT,eL);
	else e['on'+eT]=null;
}
// oEventthe native event object passed to your event listener
function xEvent(evt){
	var e = evt || window.event;
	if (!e) return;
	this.type = e.type;
	this.target = e.target || e.srcElement;
	this.relatedTarget = e.relatedTarget;
	/*@cc_on if (e.type == 'mouseover') this.relatedTarget = e.fromElement;
	else if (e.type == 'mouseout') this.relatedTarget = e.toElement; @*/
	if (xDef(e.pageX)) { this.pageX = e.pageX; this.pageY = e.pageY; }
	else if (xDef(e.clientX)) { this.pageX = e.clientX + xScrollLeft(); this.pageY = e.clientY + xScrollTop(); }
	if (xDef(e.offsetX)) { this.offsetX = e.offsetX; this.offsetY = e.offsetY; }
	else if (xDef(e.layerX)) { this.offsetX = e.layerX; this.offsetY = e.layerY; }
	else { this.offsetX = this.pageX - xPageX(this.target); this.offsetY = this.pageY - xPageY(this.target); }
	this.keyCode = e.keyCode || e.which || 0;
	this.shiftKey = e.shiftKey; this.ctrlKey = e.ctrlKey; this.altKey = e.altKey;
	if (typeof e.type == 'string') {
		if (e.type.indexOf('click') != -1) {this.button = 0;}
		else if (e.type.indexOf('mouse') != -1) {
			this.button = e.button;
			/*@cc_on if (e.button & 1) this.button = 0;
			else if (e.button & 4) this.button = 1;
			else if (e.button & 2) this.button = 2; @*/
		}
	}
}
function xDocSize(){
	var b=document.body, e=document.documentElement;
	var esw=0, eow=0, bsw=0, bow=0, esh=0, eoh=0, bsh=0, boh=0;
	if (e) {
		esw = e.scrollWidth;
		eow = e.offsetWidth;
		esh = e.scrollHeight;
		eoh = e.offsetHeight;
	}
	if (b) {
		bsw = b.scrollWidth;
		bow = b.offsetWidth;
		bsh = b.scrollHeight;
		boh = b.offsetHeight;
	}
	return {w:Math.max(esw,eow,bsw,bow),h:Math.max(esh,eoh,bsh,boh)};
}
function xScrollTop(){
	var w, offset=0;

	w = window;
	if(w.document.documentElement && w.document.documentElement.scrollTop) offset=w.document.documentElement.scrollTop;
	else if(w.document.body && xDef(w.document.body.scrollTop)) offset=w.document.body.scrollTop;

	return offset;
}
function xScrollLeft(){
	var w, offset=0;

	w = window;
	if(w.document.documentElement && w.document.documentElement.scrollLeft) offset=w.document.documentElement.scrollLeft;
	else if(w.document.body && xDef(w.document.body.scrollLeft)) offset=w.document.body.scrollLeft;

	return offset;
}
function xWindowWidth(){
	return (window.innerWidth)?window.innerWidth:((document.all)?document.body.offsetWidth:null);
}
function xWindowHeight(){
	return (window.innerHeight)?window.innerHeight:((document.all)?document.body.offsetHeight:null);
}
function xClientWidth()
{
	var v=0,d=document,w=window;
	if((!d.compatMode || d.compatMode == 'CSS1Compat') && !w.opera && d.documentElement && d.documentElement.clientWidth){
		v=d.documentElement.clientWidth;}
	else if(d.body && d.body.clientWidth){
		v=d.body.clientWidth;}
	else if(xDef(w.innerWidth,w.innerHeight,d.height)){
		v=w.innerWidth;
		if(d.height>w.innerHeight) v-=16;
	}
	return v;
}
// ele element object reference or id string
// sProp css property name
// bInt if true, return value is an integer
function xGetComputedStyle(e, p, i){
	if(!(e=xGetElementById(e))) return null;
	var s, v = 'undefined', dv = document.defaultView;
	if(dv && dv.getComputedStyle){
		s = dv.getComputedStyle(e,'');
		if (s) v = s.getPropertyValue(p);
	}
	else if(e.currentStyle) {
		v = e.currentStyle[xCamelize(p)];
	}
	else return null;
	return i ? (parseInt(v) || 0) : v;
}
// cssPropStr A dash-separated string such as a CSS property name. If it has no dashes then cssPropStr will be returned.
function xCamelize(cssPropStr)
{
	var i, c, a, s;
	a = cssPropStr.split('-');
	s = a[0];
	for (i=1; i<a.length; ++i) {
		c = a[i].charAt(0);
		s += a[i].replace(c, c.toUpperCase());
	}
	return s;
}
// sProp string - any valid style object property identifier. For example, "zIndex" and not "z-index".
// sVal string - a value to assign to sProp.
// e id string or element reference.
function xStyle(p, v)
{
	var i, e;
	for (i = 2; i < arguments.length; ++i) {
		e = xGetElementById(arguments[i]);
		try { e.style[p] = v; }
		catch (ex) {
/*@cc_on
@if (@_jscript_version <= 5.7) // IE7 and down
if(p!='display'){continue;}var s='',t=e.tagName.toLowerCase();switch(t){case'table':case'tr':case'td':case'li':s='block';break;case'caption':s='inline';break;}e.style[p]=s;
@end @*/
		}
	}
}

function xGetDocument(d) {
	var doc = null;
	if (d == undefined)
		doc = document;
	else if (d.contentDocument)
		doc  = d.contentDocument;
	else if (d.contentWindow)
		doc = d.contentWindow.document;
	else if (d.document)
		doc = d.document;
	return doc;
}
function reply(topic_id, div_id, form_action,redir_uri,global_topic_id,global_blog_topic_id,show_radio_buttons, global_blog_id, blog_login){
	last_topic_id=global_topic_id;
	last_blog_topic_id=global_blog_topic_id;
	last_blog_id = global_blog_id;

	var comment_form = xGetElementById('comment_form');
	if (!comment_form.topic_id){
		return true;
	}
	comment_form.topic_id.value = topic_id;
	comment_form.action = form_action;
	comment_form.elements['r'].value = redir_uri;
	if (comment_form.blog_login) comment_form.blog_login.value = (blog_login || '');

	var qr_div = xGetElementById('comment_reply');
	var cur_div = xGetElementById(div_id);

	if (lastDiv == 'comment_reply'){
		if (! showQRdiv(qr_div)){
			return true;
		}
		// Only one swap
		if (! swapnodes(qr_div, cur_div)){
			return true;
		}
	}
	else if (lastDiv != div_id){
		var last_div = xGetElementById(lastDiv);
		// Two swaps
		if (! (swapnodes(last_div, cur_div) && swapnodes(qr_div, last_div))){
			return true;
		}
	}
	var comment_radios = xGetElementById('comment_radios');
	if (comment_radios){
		if (show_radio_buttons)
			comment_radios.style.display = 'block';
		else
			comment_radios.style.display = 'none';
	}
	lastDiv = div_id;
	// So it does not follow the link
	return false;
}
function swapnodes (orig, to_swap){
	var orig_pn = xParent(orig);
	var next_sibling = orig.nextSibling;
	var to_swap_pn = xParent(to_swap);
	if (! to_swap_pn){
		return false;
	}

	to_swap_pn.replaceChild(orig, to_swap);
	orig_pn.insertBefore(to_swap, next_sibling);
	return true;
}
function showQRdiv(qr_div){
	if (! qr_div){
		qr_div = xGetElementById('comment_reply');
		if (! qr_div){
			return false;
		}
	}
	else if (qr_div.style && xDef(qr_div.style.display)){
		qr_div.style.display='inline';
		return true;
	}
	else{
		return false;
	}
}
function showOptions(t){
	t.nextSibling.style.display = 'block';
	t.style.display='none';
	return false;
}
function showCommentOptionsAdv(t, topic_id, comment_id, pQuote, pEmail, pEdit, pDelete, pBlock, pApprove, pReportSpam, pRepost){
	var result_text = new String();
	if(pRepost){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/repost.png width=12 height=12 alt="Забрать" title="Забрать к себе в дневник">&nbsp;<a href=http://ltalk.ru/p/repost.cgi?type=comment&id='+comment_id+'&topic_id='+topic_id+' title="Забрать к себе в дневник" target=_blank>забрать</a></font>&nbsp;&nbsp; ';
	}
	if(pQuote){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/smiles/memorize.gif width=17 height=12 alt="в цитатник" title="добавить в цитатник">&nbsp;<a href=http://ltalk.ru/p/add_to_quotations.cgi?topic_id='+topic_id+'&comment_id='+comment_id+' target=_blank onClick="return ShowResponse(this);" title="Добавить комментарий в цитатник">в&nbsp;цитатник</a></font>&nbsp;&nbsp; ';
	}
	if(pEmail){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить комментарий знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://ltalk.ru/p/email_it.cgi?topic_id='+topic_id+'&comment_id='+comment_id+' target=_blank title="Отправить комментарий знакомым на e-mail">отправить&nbsp;на&nbsp;email</a></font>&nbsp;&nbsp; ';
	}
	if(pEdit){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать комментарий" title="Отредактировать комментарий">&nbsp;<a href=http://ltalk.ru/p/edit_comment.cgi?topic_id='+topic_id+'&comment_id='+comment_id+' title="Отредактировать комментарий">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить комментарий" title="Удалить комментарий">&nbsp;<a href=http://ltalk.ru/p/delete_comment.cgi?topic_id='+topic_id+'&comment_id='+comment_id+' title="Удалить комментарий" target=_blank onClick="return ShowResponse(this);">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pBlock){
		result_text += '<font class=m6>Банить&nbsp;по&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=cookie&topic_id='+topic_id+'&comment_id='+comment_id+' target=_blank onClick="return ShowResponse(this);">куке</a>&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=ip&topic_id='+topic_id+'&comment_id='+comment_id+' target=_blank onClick="return ShowResponse(this);">IP</a>&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=subnet&topic_id='+topic_id+'&comment_id='+comment_id+' target=_blank onClick="return ShowResponse(this);">подсети</a></font>&nbsp;&nbsp; ';
	}
	if(pApprove){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve.png width=12 height=12 alt="Опубликовать комментарий" title="Опубликовать комментарий">&nbsp;<a href=http://ltalk.ru/p/approve_comment.cgi?topic_id='+topic_id+'&comment_id='+comment_id+' target=_blank onClick="return ShowResponse(this);">Опубликовать</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://ltalk.ru/p/report_spam.cgi?type=comment&id='+comment_id+'&topic_id='+topic_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showDuelCommentOptions(t, duel_id, comment_id, pEdit, pDelete){
	var result_text = new String();
	if(pEdit){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать комментарий" title="Отредактировать комментарий">&nbsp;<a href=http://ltalk.ru/p/duel_comment.cgi?action=edit&duel_id='+duel_id+'&comment_id='+comment_id+' title="Отредактировать комментарий">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить комментарий" title="Удалить комментарий">&nbsp;<a href=http://ltalk.ru/p/duel_comment.cgi?action=delete&duel_id='+duel_id+'&comment_id='+comment_id+' title="Удалить комментарий" target=_blank onClick="return ShowResponse(this);">удалить</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showDuelOptions(t, duel_id, off_side){
	var result_text = '';
	if (!off_side){
		result_text = '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать дуэль" title="Отредактировать дуэль">&nbsp;<a href=http://ltalk.ru/p/manage_duel.cgi?act=edit&duel_id='+duel_id+' title="Отредактировать дуэль">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if (is_admin){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить дуэль" title="Удалить дуэль">&nbsp;<a href=http://ltalk.ru/p/manage_duel.cgi?duel_id='+duel_id+'&act=delete title="Удалить дуэль" onClick="return ShowResponse(this);">удалить</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showBlogCommentOptionsAdv(t, blog_host, topic_id, comment_id, pQuote, pEmail, pEdit, pDelete, pApprove, pReportSpam, pRepost){
	var result_text = new String();
	if(pRepost){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/repost.png width=12 height=12 alt="Забрать" title="Забрать к себе в дневник">&nbsp;<a href=http://'+blog_host+'/p/repost.cgi?type=blog_comment&id='+comment_id+'&topic_id='+topic_id+' title="Забрать к себе в дневник" target=_blank>забрать</a></font>&nbsp;&nbsp; ';
	}
	if(pQuote){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/smiles/memorize.gif width=17 height=12 alt="в цитатник" title="добавить в цитатник">&nbsp;<a href=http://' + blog_host + '/p/add_to_quotations.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + ' target=_blank onClick="return ShowResponse(this);" title="Добавить запись в цитатник">в&nbsp;цитатник</a></font>&nbsp;&nbsp; ';
	}
	if(pEmail){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить комментарий знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://' + blog_host + '/p/email_it.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + ' target=_blank title="отправить комментарий знакомым на e-mail">отправить&nbsp;на&nbsp;email</a></font>&nbsp;&nbsp; ';
	}

	if(pEdit){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать комментарий" title="Отредактировать комментарий">&nbsp;<a href=http://' + blog_host + '/p/edit_comment.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + ' title="Отредактировать комментарий">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить комментарий" title="Удалить комментарий">&nbsp;<a href=http://' + blog_host + '/p/delete_comment.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + ' title="Удалить комментарий" target=_blank onClick="return ShowResponse(this);">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pApprove){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve.png width=12 height=12 alt="Опубликовать комментарий" title="Опубликовать комментарий">&nbsp;<a href=http://' + blog_host + '/p/approve_comment.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + ' target=_blank onClick="return ShowResponse(this);">Опубликовать</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://' + blog_host + '/p/report_spam.cgi?type=blog_comment&id='+comment_id+'&topic_id='+topic_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showPhotoCommentOptionsAdv(t, blog_host, topic_id, comment_id, pQuote, pEmail, pEdit, pDelete, pApprove, pReportSpam, pRepost){
	var result_text = new String();
	if(pRepost){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/repost.png width=12 height=12 alt="Забрать" title="Забрать к себе в дневник">&nbsp;<a href=http://'+blog_host+'/p/repost.cgi?type=photo_comment&id='+comment_id+'&topic_id='+topic_id+' title="Забрать к себе в дневник" target=_blank>забрать</a></font>&nbsp;&nbsp; ';
	}
	if(pQuote){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/smiles/memorize.gif width=17 height=12 alt="в цитатник" title="добавить в цитатник">&nbsp;<a href=http://' + blog_host + '/p/add_to_quotations.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + '&photo=1 target=_blank onClick="return ShowResponse(this);" title="Добавить запись в цитатник">в&nbsp;цитатник</a></font>&nbsp;&nbsp; ';
	}
	if(pEmail){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить комментарий знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://' + blog_host + '/p/email_it.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + '&photo=1 target=_blank title="отправить комментарий знакомым на e-mail">отправить&nbsp;на&nbsp;email</a></font>&nbsp;&nbsp; ';
	}

	if(pEdit){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать комментарий" title="Отредактировать комментарий">&nbsp;<a href=http://' + blog_host + '/p/edit_comment.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + '&photo=1 title="Отредактировать комментарий">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить комментарий" title="Удалить комментарий">&nbsp;<a href=http://' + blog_host + '/p/delete_comment.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + '&photo=1 title="Удалить комментарий" target=_blank onClick="return ShowResponse(this);">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pApprove){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve.png width=12 height=12 alt="Опубликовать комментарий" title="Опубликовать комментарий">&nbsp;<a href=http://' + blog_host + '/p/approve_comment.cgi?topic_id='+topic_id+'&comment_id=' + comment_id + '&photo=1 target=_blank onClick="return ShowResponse(this);">Опубликовать</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://' + blog_host + '/p/report_spam.cgi?type=photo_comment&id='+comment_id+'&topic_id='+topic_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showTopicOptionsAdv(t, topic_id, pQuote, pFavorite, pSubscribe, pEmail, pEdit, pDelete, pApprove, pBlock, pWait, pAproveAll, pReportSpam, pRepost){
	var result_text = new String();
	if (pRepost) {
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/repost.png width=12 height=12 alt="Забрать" title="Забрать к себе в дневник">&nbsp;<a href=http://ltalk.ru/p/repost.cgi?type=topic&id='+topic_id+' target=_blank title="Забрать к себе в дневник">забрать</a></font>&nbsp;&nbsp; ';
	}
	if(pQuote){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/smiles/memorize.gif width=17 height=12 alt="в цитатник" title="добавить в цитатник">&nbsp;<a href=http://ltalk.ru/p/add_to_quotations.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);" title="Добавить запись в цитатник">в&nbsp;цитатник</a></font>&nbsp;&nbsp; ';
	}
	if(pFavorite == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/heart.png width=13 height=12 alt="в избранное" title="добавить в избранное">&nbsp;<a href=http://ltalk.ru/p/add_to_favourite.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);" title="Добавить тему в избранное">в&nbsp;избранное</a></font>&nbsp;&nbsp; ';
	}
	if(pFavorite == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/heart.png width=13 height=12 alt="в избранное" title="добавить в избранное">&nbsp;<a href=http://ltalk.ru/p/add_to_favourite.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">Добавить&nbsp;тему&nbsp;в&nbsp;избранное</a></font><br>';
	}
	if(pSubscribe == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/email.gif width=13 height=11 alt="подписаться" title="получать комментарии на e-mail">&nbsp;<a href=http://ltalk.ru/p/subscribe.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);" title="Получать комментарии на e-mail">подписаться</a></font>&nbsp;&nbsp; ';
	}
	if(pSubscribe == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/email.gif width=13 height=11 alt="подписаться" title="получать комментарии на e-mail">&nbsp;<a href=http://ltalk.ru/p/subscribe.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);" title="Получать комментарии на e-mail">Подписаться&nbsp;на&nbsp;тему</a></font><br>';
	}

	if(pEmail == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить тему знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://ltalk.ru/p/email_it.cgi?topic_id='+topic_id+' target=_blank title="Отправить тему знакомым на e-mail">отправить&nbsp;на&nbsp;email</a></font>&nbsp;&nbsp; ';
	}
	if(pEmail == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить тему знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://ltalk.ru/p/email_it.cgi?topic_id='+topic_id+' target=_blank title="Отправить тему знакомым на e-mail">Отправить&nbsp;тему&nbsp;на&nbsp;email</a></font><br>';
	}
	if(pEdit){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать топик" title="Отредактировать топик">&nbsp;<a href=http://ltalk.ru/p/edit_topic.cgi?topic_id='+topic_id+' title="Отредактировать топик">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить топик" title="Удалить топик">&nbsp;<a href=http://ltalk.ru/p/delete_topic.cgi?topic_id='+topic_id+' title="Удалить топик" onClick="return ShowResponse(this);">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pApprove){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve.png width=12 height=12 alt="Опубликовать топик" title="Опубликовать топик">&nbsp;<a href=http://ltalk.ru/p/approve_topic.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">Опубликовать</a></font>&nbsp;&nbsp; ';
	}
	if(pBlock){
		result_text += '<font class=m6>Банить&nbsp;по&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=cookie&topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">куке</a>&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=ip&topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">IP</a>&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=subnet&topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">подсети</a></font>&nbsp;&nbsp; ';
	}
	if(pWait > 0 ){
		result_text += '<font class=m8>'+pWait+' '+CorrectNumber(pWait,'комментарий','комментария','комментариев')+' ожидает модерации</font>&nbsp;&nbsp; ';
	}
	if(pAproveAll){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve-all.png width=12 height=12 alt="Опубликовать все комментарии" title="Опубликовать все комментарии">&nbsp;<a href=http://ltalk.ru/p/approve_all_comments.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">Опубликовать все комментарии</a></font>&nbsp;&nbsp; ';
	}

	if (pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://ltalk.ru/p/report_spam.cgi?type=topic&id='+topic_id+' target=_blank title="Сообщить о спаме" onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showBlogTopicOptionsAdv(t, blog_host, topic_id, pQuote, pFavorite, pSubscribe, pEmail, pApprove, pEdit, pDelete, pBlock, pWait, pAproveAll, pReportSpam, pRepost){
	var result_text = new String();
	if(pRepost){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/repost.png width=12 height=12 alt="Забрать" title="Забрать к себе в дневник">&nbsp;<a href=http://'+blog_host+'/p/repost.cgi?type=blog_topic&id='+topic_id+' title="Забрать к себе в дневник" target=_blank>забрать</a></font>&nbsp;&nbsp; ';
	}
	if(pQuote){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/smiles/memorize.gif width=17 height=12 alt="в цитатник" title="добавить в цитатник">&nbsp;<a href=http://'+blog_host+'/p/add_to_quotations.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);" title="Добавить запись в цитатник">в&nbsp;цитатник</a></font>&nbsp;&nbsp; '
	}
	if(pFavorite == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/heart.png width=13 height=12 alt="в избранное" title="добавить в избранное">&nbsp;<a href=http://'+blog_host+'/p/add_to_favourite.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);" title="Добавить запись в избранное">в&nbsp;избранное</a></font>&nbsp;&nbsp; ';
	}
	if(pFavorite == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/heart.png width=13 height=12 alt="в избранное" title="добавить в избранное">&nbsp;<a href=http://'+blog_host+'/p/add_to_favourite.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">Добавить&nbsp;запись&nbsp;в&nbsp;избранное</a></font><br>';
	}
	if(pSubscribe == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/email.gif width=13 height=11 alt="подписаться" title="получать комментарии на e-mail">&nbsp;<a href=http://'+blog_host+'/p/subscribe.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);" title="Получать комментарии на e-mail">подписаться</a></font>&nbsp;&nbsp; ';
	}
	if(pSubscribe == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/email.gif width=13 height=11 alt="подписаться" title="получать комментарии на e-mail">&nbsp;<a href=http://'+blog_host+'/p/subscribe.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);" title="Получать комментарии на e-mail">Подписаться&nbsp;на&nbsp;комментарии</a></font><br>';
	}

	if(pEmail == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить запись знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://'+blog_host+'/p/email_it.cgi?topic_id='+topic_id+' target=_blank title="Отправить запись знакомым на e-mail">отправить&nbsp;на&nbsp;email</a></font>&nbsp;&nbsp; '
	}
	if(pEmail == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить запись знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://'+blog_host+'/p/email_it.cgi?topic_id='+topic_id+' target=_blank title="Отправить запись знакомым на e-mail">Отправить&nbsp;тему&nbsp;на&nbsp;email</a></font><br>';
	}
	if(pApprove){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve.png width=12 height=12 alt="Опубликовать запись" title="Опубликовать запись">&nbsp;<a href=http://'+blog_host+'/p/approve_topic.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">Опубликовать</a></font>&nbsp;&nbsp; ';
	}
	if(pEdit){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать запись" title="Отредактировать запись">&nbsp;<a href=http://'+blog_host+'/p/edit_topic.cgi?topic_id='+topic_id+' title="Отредактировать запись">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить запись" title="Удалить запись">&nbsp;<a href=http://'+blog_host+'/p/delete_topic.cgi?topic_id='+topic_id+' title="Удалить запись" onClick="return ShowResponse(this);">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pBlock){
		result_text += '<font class=m6>Банить&nbsp;по&nbsp;<a href=http://'+blog_host+'/p/block.cgi?type=cookie&topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">куке</a>&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=ip&topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">IP</a>&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=subnet&topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">подсети</a></font>&nbsp;&nbsp; ';
	}
	if(pWait > 0 ){
		result_text += '<font class=m8>'+pWait+' '+CorrectNumber(pWait,'комментарий','комментария','комментариев')+' ожидает модерации</font>&nbsp;&nbsp; ';
	}
	if(pAproveAll){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve.png width=12 height=12 alt="Опубликовать все комментарии" title="Опубликовать все комментарии">&nbsp;<a href=http://'+blog_host+'/p/approve_all_comments.cgi?topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">Опубликовать все комментарии</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://'+blog_host+'/p/report_spam.cgi?type=blog_topic&id='+topic_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showPhotoTopicOptionsAdv(t, blog_host, topic_id, pQuote, pFavorite, pSubscribe, pEmail, pApprove, pEdit, pDelete, pBlock, pWait, pAproveAll, pReportSpam, pRepost){
	var result_text = new String();
	if(pRepost){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/repost.png width=12 height=12 alt="Забрать" title="Забрать к себе в дневник">&nbsp;<a href=http://'+blog_host+'/p/repost.cgi?type=photo&id='+topic_id+' title="Забрать к себе в дневник" target=_blank>забрать</a></font>&nbsp;&nbsp; ';
	}
	if(pQuote){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/smiles/memorize.gif width=17 height=12 alt="в цитатник" title="добавить в цитатник">&nbsp;<a href=http://'+blog_host+'/p/add_to_quotations.cgi?topic_id='+topic_id+'&photo=1 target=_blank onClick="return ShowResponse(this);" title="Добавить изображение в цитатник">в&nbsp;цитатник</a></font>&nbsp;&nbsp; '
	}
	if(pFavorite == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/heart.png width=13 height=12 alt="в избранное" title="добавить в избранное">&nbsp;<a href=http://'+blog_host+'/p/add_to_favourite.cgi?topic_id='+topic_id+'&photo=1 target=_blank onClick="return ShowResponse(this);" title="Добавить изображение в избранное">в&nbsp;избранное</a></font>&nbsp;&nbsp; ';
	}
	if(pFavorite == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/heart.png width=13 height=12 alt="в избранное" title="добавить в избранное">&nbsp;<a href=http://'+blog_host+'/p/add_to_favourite.cgi?topic_id='+topic_id+'&photo=1 target=_blank onClick="return ShowResponse(this);">Добавить&nbsp;изображение&nbsp;в&nbsp;избранное</a></font><br>';
	}
	if(pSubscribe == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/email.gif width=13 height=11 alt="подписаться" title="получать комментарии на e-mail">&nbsp;<a href=http://'+blog_host+'/p/subscribe.cgi?topic_id='+topic_id+'&photo=1 target=_blank onClick="return ShowResponse(this);" title="Получать комментарии на e-mail">подписаться</a></font>&nbsp;&nbsp; ';
	}
	if(pSubscribe == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/email.gif width=13 height=11 alt="подписаться" title="получать комментарии на e-mail">&nbsp;<a href=http://'+blog_host+'/p/subscribe.cgi?topic_id='+topic_id+'&photo=1 target=_blank onClick="return ShowResponse(this);" title="Получать комментарии на e-mail">Подписаться&nbsp;на&nbsp;комментарии</a></font><br>';
	}
	if(pEmail == 1){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить изображение знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://'+blog_host+'/p/email_it.cgi?topic_id='+topic_id+'&photo=1 target=_blank title="Отправить изображение знакомым на e-mail">отправить&nbsp;на&nbsp;email</a></font>&nbsp;&nbsp; '
	}
	if(pEmail == 2){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить изображение знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://'+blog_host+'/p/email_it.cgi?topic_id='+topic_id+'&photo=1 target=_blank title="Отправить изображение знакомым на e-mail">Отправить&nbsp;изображение&nbsp;на&nbsp;email</a></font><br>';
	}
	if(pApprove){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve.png width=12 height=12 alt="Опубликовать изображение" title="Опубликовать изображение">&nbsp;<a href=http://'+blog_host+'/p/approve_topic.cgi?topic_id='+topic_id+'&photo=1 target=_blank onClick="return ShowResponse(this);">Опубликовать</a></font>&nbsp;&nbsp; ';
	}
	if(pEdit){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать изображение" title="Отредактировать изображение">&nbsp;<a href=http://'+blog_host+'/p/add_photo.cgi?topic_id='+topic_id+' title="Отредактировать изображение">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить изображение" title="Удалить изображение">&nbsp;<a href=http://'+blog_host+'/p/delete_topic.cgi?topic_id='+topic_id+'&photo=1 title="Удалить изображение" onClick="return ShowResponse(this);">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pBlock){
		result_text += '<font class=m6>Банить&nbsp;по&nbsp;<a href=http://'+blog_host+'/p/block.cgi?type=cookie&topic_id='+topic_id+'&photo=1 target=_blank onClick="return ShowResponse(this);">куке</a>&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=ip&topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">IP</a>&nbsp;<a href=http://ltalk.ru/p/block.cgi?type=subnet&topic_id='+topic_id+' target=_blank onClick="return ShowResponse(this);">подсети</a></font>&nbsp;&nbsp; ';
	}
	if(pWait > 0 ){
		result_text += '<font class=m8>'+pWait+' '+CorrectNumber(pWait,'комментарий','комментария','комментариев')+' ожидает модерации</font>&nbsp;&nbsp; ';
	}
	if(pAproveAll){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/approve.png width=12 height=12 alt="Опубликовать все комментарии" title="Опубликовать все комментарии">&nbsp;<a href=http://'+blog_host+'/p/approve_all_comments.cgi?topic_id='+topic_id+'&photo=1 target=_blank onClick="return ShowResponse(this);">Опубликовать все комментарии</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://' + blog_host + '/p/report_spam.cgi?type=photo&id='+topic_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showWishesOptions(t, blogLogin, wishId, copyToUserLogin, pChange, pDelete, pCopy, pReportSpam){
	var result_text = new String();

	if(pChange){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png alt="редактировать" title="редактировать" height=12 width=12>&nbsp;<a href="http://' + blogLogin + '.ltalk.ru/p/add_wish.cgi?wish_id=' + wishId + '">редактировать...</a></font>&nbsp;&nbsp; ';
	}

	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png alt="удалить" title="удалить" height=12 width=13>&nbsp;<a href="/p/delete_wish.cgi?wish_id='+wishId+'" onClick="return ShowResponse(this);">удалить...</a></font>&nbsp;&nbsp; ';
	}
	if(pCopy){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/copy.gif alt="скопировать себе" title="скопировать себе" height=12 width=15>&nbsp;<a href="http://' + copyToUserLogin + '.ltalk.ru/p/add_wish.cgi?copy=1&wish_id=' + wishId + '">скопировать себе...</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://ltalk.ru/p/report_spam.cgi?type=wish&id='+wishId+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showLinksOptions(t, blogLogin, linkId, pDelete, pChange, pReportSpam){
	var result_text = new String();

	if(pChange){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png alt="редактировать" title="редактировать" height=12 width=12>&nbsp;<a href="http://' + blogLogin + '.ltalk.ru/p/add_link.cgi?link_id=' + linkId + '">редактировать...</a></font>&nbsp;&nbsp; ';
	}
	if (pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png alt="удалить" title="удалить" height=12 width=13>&nbsp;<a href="/p/delete_link.cgi?link_id='+linkId+'" onClick="return ShowResponse(this);">удалить...</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://' + blogLogin + '.ltalk.ru/p/report_spam.cgi?type=link&id='+linkId+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showTestsOptions (t, testId, pEdit, pDelete, pReportSpam){
	var result_text = new String();

	result_text += '<span class=nobr><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить тест знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://ltalk.ru/p/email_it.cgi?test_id='+testId+' target=_blank title="Отправить тест знакомым на e-mail">отправить&nbsp;на&nbsp;email</a></span>&nbsp;&nbsp; ';

	if (pEdit){
		result_text += '<span class=nobr><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="редактировать" title="редактировать">&nbsp;<a href=http://ltalk.ru/p/add_test.cgi?id='+testId+'>редактировать</a></span>&nbsp;&nbsp; ';
	}
	if (pDelete){
		result_text += '<span class=nobr><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="удалить" title="удалить">&nbsp;<a href=http://ltalk.ru/p/delete_test.cgi?id='+testId+' onClick="return ShowResponse(this);">удалить</a></span>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<span class=nobr><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://ltalk.ru/p/report_spam.cgi?type=test&id='+testId+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></span>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showPollsOptions (t, pollId, pEdit, pDelete, pReportSpam){
	var result_text = new String();

	result_text += '<span class=nobr><img class=flag src=http://ltalk.ru/i/emailit.png alt="На e-mail" title="Отправить тест знакомым на e-mail" height=11 width=25>&nbsp;<a href=http://ltalk.ru/p/email_it.cgi?poll_id='+pollId+' target=_blank title="Отправить тест знакомым на e-mail">отправить&nbsp;на&nbsp;email</a></span>&nbsp;&nbsp; ';

	if (pEdit){
		result_text += '<span class=nobr><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="редактировать" title="редактировать">&nbsp;<a href=http://ltalk.ru/p/add_poll.cgi?id='+pollId+'>редактировать</a></span>&nbsp;&nbsp; ';
	}
	if (pDelete){
		result_text += '<span class=nobr><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="удалить" title="удалить">&nbsp;<a href=http://ltalk.ru/p/delete_poll.cgi?id='+pollId+' onClick="return ShowResponse(this);">удалить</a></span>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<span class=nobr><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://ltalk.ru/p/report_spam.cgi?type=poll&id='+pollId+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></span>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function CorrectNumber(n, a, b, c){
	var u = n % 10;
	var d = Math.floor(n / 10) % 10;
	if (u == 1 && d != 1){
		return a;
	}
	else if (u >= 2 && u < 5 && d != 1){
		return b;
	}
	return c;
}
function insertUser(context,smile){
	var f=document.forms[context];
	if(f){
		var m=f.message;
		m.value += smile;
	}
}
var podcast_timeout_id;
function checkWindow5(){
	var podcast_url = getCookie('pu');
	var podcast_name = getCookie('pn');
	if (podcast_url){
		podcast_url = unescape(podcast_url);
		podcast_name = unescape(podcast_name);
		var f = document.forms['topic_form'];
		if (f){
			f.podcast_url.value = podcast_url;
			f.podcast_name.value = podcast_name;
			var n = xGetElementById('podcast');
			podcast_name = podcast_name.replace(/&/g, '&amp;');
			podcast_name = podcast_name.replace(/\"/g, '&quot;');
			podcast_name = podcast_name.replace(/</g, '&lt;');
			podcast_name = podcast_name.replace(/>/g, '&gt;');
			if (n){
				n.innerHTML='<a href='+podcast_url+' target=_blank>'+podcast_name+'</a>&nbsp;<img id="clearpodcast" class=rad src=http://ltalk.ru/i/smiles/clear.png width=15 height=15 alt="Удалить" title="Удалить подкаст" style="cursor:pointer;cursor:hand" onClick="deletePodcast();">&nbsp;&nbsp;&nbsp;<a href=# target=_blank onClick="return addPodcast();">Перезакачать подкаст</a>';
			}
			if(navigator.appVersion.indexOf('MSIE')){
				var arVersion = navigator.appVersion.split("MSIE");
				var version = parseFloat(arVersion[1]);
				if(version >= 5.5 && version < 7 && document.body.filters){
					var clrimg = xGetElementById('clearpodcast');
					if(clrimg){
						var imgsrc = clrimg.src;
						if(imgsrc in PNGImages){
							clrimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'"+imgsrc+"\', sizingMethod='scale');";
							clrimg.src = 'http://ltalk.ru/i/emp.gif';
						}
					}
				}
			}
		}
		deleteCookie('pu');
		deleteCookie('pn');
		clearTimeout(podcast_timeout_id);
	}
	else{
		clearTimeout(podcast_timeout_id);
		podcast_timeout_id=setTimeout("checkWindow5();",99);
	}
}
function addPodcast(){
	var str="toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=680,height=420";
	if(window.screen){
		var xc=screen.availWidth/2-340;
		var yc=screen.availHeight/2-210;
		str+=",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str+=",top=120";
	}
	deleteCookie('pu');
	deleteCookie('pn');
	window.open("http://"+document.location.hostname+"/p/add_podcast.cgi","",str);
	podcast_timeout_id=setTimeout("checkWindow5();",99);
	return false;
}
function deletePodcast(){
	var f = document.forms['topic_form'];
	if (f){
		f.podcast_url.value = '';
		f.podcast_name.value = '';
		var n = xGetElementById('podcast');
		if (n){
			n.innerHTML='<a href=# target=_blank onClick="return addPodcast();">Закачать подкаст</a>';
		}
	}
}
var images_to_check = new Array();
function register_image(id){
	images_to_check.push(id);
}

var audios_to_check = new Array();
function register_audio(id){
	var audio = xGetElementById('a'+id);
	if (audio) audio.data = audio.data.replace('prostopleer.com', 'pleer.com');
	audios_to_check.push(id);
}
var resize_audios_timeout;
function check_audios(){
	resize_audios_timeout = setTimeout(resize_audios, 100);
}
function resize_audios(){
	clearTimeout(resize_audios_timeout);
	if (audios_to_check.length == 0){
		return;
	}

	var max_audio_width=get_max_object_width();

	var i = 0;
	var audio;
	while(audio = xGetElementById('a'+audios_to_check[i])){

		if(audio.width > max_audio_width){
			audio.width = max_audio_width;
		}

		audios_to_check.splice(i, 1);
	}
	if(audios_to_check.length > 0){
		check_audios();
	}
}
var games_to_check = new Array();
function register_games(id){
	games_to_check.push(id);
}
var resize_games_timeout;
function check_games(){
	resize_games_timeout = setTimeout(resize_games, 100);
}
function resize_games(){
	clearTimeout(resize_games_timeout);
	if (games_to_check.length == 0){
		return;
	}

	var max_game_width=get_max_object_width();

	var i = 0;
	var game_obj, game_emb;
	while(game_obj = xGetElementById('go'+games_to_check[i])){
		if(game_obj.width > max_game_width){
			game_obj.height = game_obj.height / game_obj.width * max_game_width;
			game_obj.width = max_game_width;
			if (game_emb = xGetElementById('ge'+games_to_check[i])) {
				game_emb.height = game_obj.height;
				game_emb.width = game_obj.width;
			}
		}
		games_to_check.splice(i, 1);
	}
	if(games_to_check.length > 0){
		check_games();
	}
}
var videos_to_check = new Array();
function register_video(id){
	videos_to_check.push(id);
}
var resize_videos_timeout;
function check_videos(){
	resize_videos_timeout = setTimeout(resize_videos, 100);
}
function resize_videos(){
	clearTimeout(resize_videos_timeout);
	if (videos_to_check.length == 0){
		return;
	}

	var max_video_width=get_max_object_width();

	var max_video_height = max_video_width * 1.61;

	var i = 0;
	var video;
	while(video = xGetElementById('v'+videos_to_check[i])){

		if(video.width > max_video_width){
			video.height = video.height / video.width * max_video_width;
			video.width = max_video_width;
		}

		if(video.height > max_video_height){
			video.width = video.width / video.height * max_video_height;
			video.height = max_video_height;
		}

		if (video.src){
			var span = document.createElement("span");
			var form_id = 'tf'+videos_to_check[i];
			span.innerHTML = '<br><form action=http://'+user_login+'.ltalk.ru/p/add_topic.cgi method=post id='+form_id+' style="margin:0;"><input name=video_url type=hidden value="'+video.src+'"><img class=flag src=http://ltalk.ru/i/download.png alt="Скачать" height=10 width=10>&nbsp;<a href=http://savefrom.net/'+video.src+' title="Скачать видео" target=_blank>Скачать видео</a>&nbsp;&nbsp;<img class=flag src=http://ltalk.ru/i/repost.png alt="Скачать" height=10 width=10>&nbsp;<a href=# title="Забрать видео в дневник" onclick="xGetElementById(\''+form_id+'\').submit(); return false;">Забрать в дневник</a></form>';
			video.parentNode.insertBefore(span, video.nextSibling);
		}

		videos_to_check.splice(i, 1);
	}
	if(videos_to_check.length > 0){
		check_videos();
	}
}

function get_max_object_width(){
	var avatar_width = 150;
	var padding = 30;
	var votebox_width = 70;
	var left_baner_co = 0.75;
	if (window.matchMedia && window.matchMedia('screen and (max-width:767px)').matches){ // если ширина экрана менее 1024 и поддерживается css media query, то контент переносится под левый банер и расширяетсяна 100%
		left_baner_co=1;
	}

	var window_width = xClientWidth();

	var max_object_width;
	if (is_duel){
		max_object_width = (window_width/2 - padding - avatar_width - votebox_width);
		if(max_object_width < 100){
			max_object_width = 100;
		}
	}
	else{
		max_object_width= ((window_width - padding) * left_baner_co - avatar_width);
		if(max_object_width < 200){
			max_object_width = 200;
		}
	}
	return max_object_width;
}
var photo_width;
function get_width_for_photo() {
	if (photo_width) return photo_width;
	var padding = 30;
	var window_width = xClientWidth();
	var avatar_width = xGetComputedStyle('phmch', 'padding-left', 1) == 11 ? 0 : 110;
	var width_coef = xGetComputedStyle('phmch', 'padding-right', 1) == 11 ? 1 : 0.5;
	photo_width = parseInt((window_width - padding) * width_coef - avatar_width);
	if (photo_width < 200) photo_width = 200;
	return photo_width;
}
var photos_array = new Array();
var check_photo_timeout;
function load_photo(photo_id, photo_url, element_id, max_size, need_zoom){
	var need_zoom = typeof(need_zoom) != 'undefined' ? need_zoom : false;
	if(max_size == 0){
		var window_width = xClientWidth();
		if(!window_width){
			max_size = 800;
		}
		else{
			max_size = (window_width - 30) * 0.75 - 150;
			if(max_size < 200){
				max_size = 200;
			}
		}
	}

	var img = {photo_id: photo_id, photo_url: photo_url, element_id: element_id, max_size: max_size, photo: false, need_to_append: false, need_zoom: need_zoom};

	photos_array.push(img);

	check_photo_timeout = setTimeout('check_photo_loaded()', 300);
}
var check_photo_lock = false;
function check_photo_loaded(){
	if(photos_array.length == 0){
		return;
	}

	if(check_photo_lock){
		return;
	}
	check_photo_lock = true;
	clearTimeout(check_photo_timeout);

	var photo_struct;
	var i = 0;
	while(photo_struct = photos_array[i]){
		var photo;
		if(photo_struct.photo){
			photo = photo_struct.photo;
		}
		else{
			photo = xGetElementById(photo_struct.photo_id);
			if(!photo){
				photo = new Image;
				photo.id	= photo_struct.photo_id;
				photo.src	= photo_struct.photo_url;
				photo_struct.need_to_append = true;
			}
			photo_struct.photo = photo;
		}

		if(!photo.complete){
			i++;
			continue;
		}

		photos_array.splice(i, 1);

		var max_size = photo_struct.max_size;
		var new_width;
		var new_height;
		if(photo.width > photo.height){
			if(photo.width <= max_size){
				new_width = photo.width;
				new_height = photo.height;
			}
			else{
				new_height = photo.height / photo.width * max_size;
				new_width = max_size;
				if(photo_struct.need_zoom){
					photo.className = 'zoom';
				}
			}
		}else{
			if(photo.height <= max_size){
				new_width = photo.width;
				new_height = photo.height;
			}
			else{
				new_width = photo.width / photo.height * max_size;
				new_height = max_size;
				if(photo_struct.need_zoom){
					photo.className = 'zoom';
				}
			}
		}

		if(photo_struct.need_to_append){
			var td_elem = xGetElementById(photo_struct.element_id);
			if (td_elem){
				td_elem.appendChild(photo);
			}
		}
		photo.width = new_width;
		photo.height = new_height;

		photo.style.border = '0';

		if(photos_array.length < 1){
			break;
		}
	}

	check_photo_lock = false;
	check_photo_timeout = setTimeout('check_photo_loaded()', 300);
}

// AJAX Class
function Ajax(){
	this.req = null;
	this.url = null;
	this.PostData = null;
	this.Method = null;
	this.status_error = null;
	this.statusText = '';
}

Ajax.prototype.empty_func = function(){};

Ajax.prototype.init = function(){
	if(!this.req){
		try{
			this.req = new XMLHttpRequest();
		}catch(e){
			try{
				this.req = new ActiveXObject('MSXML2.XMLHTTP');
			}catch(e){
				try{
					this.req = new ActiveXObject('Microsoft.XMLHTTP');
				}catch(e){
					// Could not create an XMLHttpRequest object.
					return false;
				}
			}
		}
	}
	return this.req;
};

Ajax.prototype.doReq = function(){
	if(!this.init()){
		return;
	}
	var self = this; // Fix loss-of-scope in inner function
	this.req.onreadystatechange = function(){
		var resp = null;
		if(self.req.readyState != 4 || self.req.readyState == 0)
			 return;
		self.req.onreadystatechange = self.empty_func;

		try{
			if(self.req.status != 200){
				self.status_error(self.req.status);
				return;
			}
		}catch(e){
			self.status_error(500); // well, this was most logical status
			return;
		}
		self.status_ok(self.req.responseText);
	};
	this.req.open(this.Method, this.url, true);
	if(this.Method == 'POST'){
		this.req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	}
	this.req.send(this.PostData || '');
	return 1;
};

Ajax.prototype.status_error = function(a){};

Ajax.prototype.status_ok = function(a){};

Ajax.prototype.doGet = function(url, f_ok, f_error){
	this.url			= url;
	this.status_error	= f_error;
	this.status_ok		= f_ok;
	this.Method			= 'GET';
	this.doReq();
};

Ajax.prototype.doPost = function(url, data, f_ok, f_error){
	this.url			= url;
	this.PostData		= data;
	this.status_error	= f_error;
	this.status_ok		= f_ok;
	this.Method			= 'POST';

	this.doReq();
};
var func_err = function(a){};
function showTagsCloud(context, blog_login){
	if(!context){
		context = 1;
	}
	if(xGetElementById('add_tags_div')){

		var tags_div = xGetElementById('add_tags_div');
		tags_div.style.display = 'none';

		setTimeout("var tdiv=xGetElementById('add_tags_div');if(tdiv) xParent(tdiv).removeChild(tdiv);", 100);
		return false;
	}
	var ajax = new Ajax();
	ajax.doGet('http://'+document.location.hostname+'/ajax/gen_tags?c='+context+'&'
		+(blog_login ? 'l='+blog_login+'&' : '')
		+Math.random(), CalculateTags, func_err);
	return false;
}
var categories = null;
var hov_timeout;
function CalculateTags(resp){
	var str_tags_array = resp.split(/,/);

	if(str_tags_array.length % 3){ // должно быть кратно трем
		return false;
	}

	var i = 0;
	var cnt = 0;
	var result_str = new String();
	categories = new Array();
	while(str_tags_array.length > i){
		var tag_name = str_tags_array[i++];
		var html_tag_name = str_tags_array[i++];
		var tag_size = str_tags_array[i++];


		var quoted_name = tag_name.replace(/\\/g, '\\\\');
		var quoted_name = tag_name.replace(/\'/g, '\\\'');
		categories.push({tag_name: tag_name, html_tag_name: html_tag_name});

		result_str += ' <a style="font-size: ' + tag_size + 'px;" class=tag href=# onClick="return addTagName(\'' + cnt + '\')"/>' + html_tag_name + '</a> ';
		cnt++;
	}

	clearTimeout(hov_timeout);

	var tag_div = xGetElementById('add_tags_div');
	if(!tag_div){
		tag_div = document.createElement('DIV');
		var comment_link_element = xGetElementById('add_comment_link');
		xParent(comment_link_element).insertBefore(tag_div, comment_link_element);
		tag_div.id = "add_tags_div";
		var offset = get_offset(comment_link_element);
		tag_div.style.left = offset.left;
		tag_div.style.top = offset.top + 12;
	}

	tag_div.innerHTML = result_str;

	xAddEventListener(tag_div,'mouseover',do_hover,false);

	if (!opera_mini) out_hover();

	return false;
}
function out_hover(){
	hov_timeout = setTimeout("clearTimeout(hov_timeout);var tdiv = xGetElementById('add_tags_div');if(tdiv) {tdiv.style.display='none';hov_timeout = setTimeout(\"var tdiv = xGetElementById('add_tags_div');if(tdiv) xParent(tdiv).removeChild(tdiv)\", 100);}", 2000);
}
function do_hover(){
	clearTimeout(hov_timeout);
}
function addTagName(tag_num){
	var tag_name = categories[tag_num].tag_name;
	var input_tags = xGetElementById('tags');
	input_tags.focus();
	var value = input_tags.value;
	value = value.replace(/^\s+/, '');
	value = value.replace(/\s+$/, '');
	value = value.replace(/,+/g, ',');
	value = value.replace(/,$/,   '');
	if(value.length > 0){
		value += ',';
	}
	value += tag_name + ',';
	input_tags.value = value;
	input_tags.focus();
	return false;
}
function get_offset(element){ // XXX возможно функцию стоит заменить на get_offset_visible_width()
	var left = element.offsetLeft;
	var top = element.offsetTop;
	for (var parent = element.offsetParent; parent; parent = parent.offsetParent)	{
		left += parent.offsetLeft;
		top += parent.offsetTop;
	}
	var right = left + element.offsetWidth;
	var bottom = top + element.offsetHeight;
	return {left: left, top: top, right: right, bottom: bottom};
}
function get_mouseXY(event) {
	if ( !event.target ) {
		event.target = event.srcElement || document;
	}

	if ( event.target.nodeType === 3 ) {
		event.target = event.target.parentNode;
	}

	if ( event.pageX == null && event.clientX != null ) {
		var eventDocument = event.target.ownerDocument || document;
		var doc = eventDocument.documentElement;
		var body = eventDocument.body;

		event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
		event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
	}

	return {x: event.pageX, y: event.pageY};
}
var searchArray = new Array();
function ParseTagSuggestion(resp){
	var str_tags_array = resp.split(/,/);
	if(str_tags_array.length % 3){ // должно быть кратно 3
		return false;
	}

	var i = 0;
	categories = new Array();
	while(str_tags_array.length > i){
		var tag_name = str_tags_array[i++];
		var html_tag_name = str_tags_array[i++];
		var tag_size = str_tags_array[i++];

		categories.push({tag_name: tag_name, html_tag_name: html_tag_name});
	}

	ShowTagSuggestion();
};
function ShowTagSuggestion(){
	var input_element = xGetElementById('tags');
	var element_value = input_element.value;

	var str = element_value.match(/,[^,]+$/g);
	if(str != null && typeof(str) == 'object'){
		str = str[0];
	}
	if(str == null && element_value.length > 0){
		str = element_value;
	}

	if(str == null){
		CloseSuggestBox();
		return;
	}
	else{
		str = str.replace(/\s+$/, '');
		if(str.match(/,$/)){
			CloseSuggestBox();
			return;
		}

		str = str.replace(/^,/, '');
		str = str.replace(/,$/, '');
		ShowSuggestBox(str, element_value);
	}
}
var is_suggest_active = false;
function CloseSuggestBox(){
	var suggest_div = xGetElementById('suggest_div');
	if(suggest_div){
		suggest_div.style.display = 'none';
		setTimeout("var sdiv = xGetElementById('suggest_div');if(sdiv) xParent(sdiv).removeChild(sdiv)", 100);
		is_suggest_active = false;
	}
}
function tagContains(tag_name, tags_array){
	var u_tag_name = tag_name.toUpperCase();
	for(var j = 0; j < tags_array.length; j++){
		if(tags_array[j].toUpperCase() == u_tag_name)
			return true;
	}
	return false;
}
var regEx = new RegExp();
function ShowSuggestBox(tag_start, tags_str){
	tag_start = tag_start.replace(/^\s+/, '');
	tag_start = tag_start.replace(/\s+$/, '');

	regEx.compile("^".tag_start, "i");

	var tags_array = tags_str.split(/\s*,\s*/);

	var result = '';
	searchArray = new Array();
	iSelect = -1;
	var counter = 0;
	for(var i = 0; i < categories.length; i++){
//		if(regEx.test(categories[i])){
		var curr_tag = categories[i].tag_name;
		var curr_tag_upper = curr_tag.toUpperCase();
		if(curr_tag_upper.indexOf(tag_start.toUpperCase()) == 0 && curr_tag_upper != tag_start.toUpperCase() && !tagContains(curr_tag, tags_array)){
			result += '<a href="#" id="a_id'+ counter + '" onmouseover="moveTo('+ counter + ')" class="notactive" onClick="return addSuggest(\'' + counter + '\')">' + categories[i].html_tag_name + '</a>';
			var ttt = categories[i];
			searchArray.push(ttt);
			counter++;
		}
	}

	if(result == ''){
		CloseSuggestBox();
		return;
	}

	var suggest_div = xGetElementById('suggest_div');
	if(!suggest_div){
		var suggest_div = document.createElement('DIV');
		var tags_element = xGetElementById('tags');
		xParent(tags_element).insertBefore(suggest_div, tags_element);
		suggest_div.id = "suggest_div";

		var offset = get_offset(tags_element);
		suggest_div.style.left	= offset.left;
		suggest_div.style.top	= offset.top + 21;
		is_suggest_active = true;
	}

	suggest_div.innerHTML = result;
}
function addSuggest(index){

	var tag_name = searchArray[index];
	if (!tag_name) {
		return false;
	}

	var input_element = xGetElementById('tags');
	if (!input_element) {
		return false;
	}

	input_element.focus();
	var element_value = input_element.value;
	element_value = element_value.replace(/,+/g, ',');

	if(element_value.indexOf(',') >= 0){
		element_value = element_value.replace(/,[^,]*$/, ','+tag_name.tag_name+',');
	}
	else{
		element_value = tag_name.tag_name+',';
	}

	CloseSuggestBox();

	input_element.value = element_value;
	input_element.focus();
	searchArray = new Array();
	categories = null;
	return false;
}
var pressedEnter = false;
function break_enter_key(e){
	var k;
	if (window.event) {
		k = window.event.keyCode;
	}
	else if (e) {
		k = e.keyCode;
	}
	
	if(k == 13){ // catch Enter key to prevent submit
		pressedEnter = true;
	}
}
function block_submit(elem, mode, subdomain){

	if(is_suggest_active && pressedEnter){
		addSuggest(iSelect);
		return false;
	}

	var url = '';
	if(subdomain.length > 0){
		url = 'http://'+subdomain+'.ltalk.ru';
	}
	switch(mode){
		case 'add':
			url += '/p/add_topic.cgi';
			break;
		case 'pm':
			url += '/p/send_message.cgi';
			break;
		case 'aq':
			url += '/p/ask_question.cgi';
			break;
		case 'aa':
			url += '/p/manage_questions.cgi';
			break;
		default:
			url += '/p/edit_topic.cgi';
			break;
	}
	elem.action = url;

	return true;
}
function photo_block_submit(elem, mode, subdomain){

	if(is_suggest_active && pressedEnter){
		addSuggest(iSelect);
		return false;
	}

	var url = '';
	if(subdomain.length > 0){
		url = 'http://'+subdomain+'.ltalk.ru';
	}

	if(mode == 'add'){
		url += '/p/add_photo.cgi';
	}
	else{
		url += '/p/edit_photo.cgi';
	}

	elem.action = url;

	return true;
}
function sugest_category(e, context, blog_login){
	var k,s;
	if(window.event){
		e = window.event;
		k = e.keyCode;
		s = e.srcElement
	}
	else if(e){
		k = e.keyCode;
		s = e.target
	}

	if(!k || !s)
		return true;

	if(k == 38){
		moveUp();
		return true;
	}

	if(k == 40){
		moveDown();
		return true;
	}

	if(categories == null){
		categories = new Array();
		var ajax = new Ajax();
		ajax.doGet('http://'+document.location.hostname+'/ajax/gen_tags?c='+context+'&' + (blog_login ? 'l='+blog_login+'&' : '') + Math.random(), ParseTagSuggestion, func_err);
		return true;
	}

	if(categories.length == 0){
		return true;
	}

	ShowTagSuggestion();
}
var iSelect=-1;
function moveUp(){
	var k = 0;
	if(!searchArray.length){
		iSelect = -1;
		return false
	};
	k = (iSelect <= 0) ? searchArray.length - 1 : iSelect - 1;
	moveTo(k);
}
function moveDown(){
	var k = 0;
	if (!searchArray.length){
		iSelect = -1;
		return false
	};
	k = (iSelect < searchArray.length - 1) ? iSelect + 1 : 0;
	moveTo(k);
}
function moveTo(k){
	var tmpObj;
	if(tmpObj = xGetElementById("a_id"+iSelect))
		tmpObj.className = "notactive";

	iSelect = k;

	if(tmpObj = xGetElementById("a_id"+iSelect))
		tmpObj.className = "active";
	TryTag(k);
}
function TryTag(k){
	if(!searchArray[k])
		return;
	var value = xGetElementById('tags').value;
	value = value.replace(/^\s+/, '');
	value = value.replace(/\s+$/, '');
	value = value.replace(/,+/g, ',');
	if(value.indexOf(',') >= 0){
		value = value.replace(/,[^,]+$/,   ',');
	}
	else{
		value = '';
	}

	xGetElementById('tags').value = value + searchArray[k].tag_name;
	return;
}
function fix_tag_to_html(tag_name){
	tag_name = tag_name.replace(/\&/g, '&amp;');
	tag_name = tag_name.replace(/>/g, '&gt;');
	tag_name = tag_name.replace(/</g, '&lt;');
	tag_name = tag_name.replace(/"/g, '&quot;');
	tag_name = tag_name.replace(/'/g, "&apos;");
	return tag_name;
}

var updater_timeout_obj;
var current_topic_id;
var last_comment_id;
var is_blog;
var is_photo;
var is_duel;
var blog_login;
var resize_images_timeout;
function check_images(){
	resize_images_timeout = setTimeout(resize_images, 100);
}
function resize_images(){
	clearTimeout(resize_images_timeout);
	if (images_to_check.length == 0){
		return;
	}

	var max_img_width=get_max_object_width();

	var i = 0;
	var img;
	while(img = xGetElementById('i'+images_to_check[i])){

		if(!img.complete){
			i += 1;
			continue;
		}

		max_img_height = max_img_width * 1.61;

		if(img.width > max_img_width){
			img.height = img.height / img.width * max_img_width;
			img.width = max_img_width;
			img.className = 'zoom';
		}

		if(img.height > max_img_height){
			img.width = img.width / img.height * max_img_height;
			img.height = max_img_height;
			img.className = 'zoom';
		}

		if ((img.className != 'zoom') && img.getAttribute('width')) img.className = 'zoom';

		if (!img.src.match(/^http:\/\/a\d+.ltalk.ru\/i\/temp\//)) {
		var sim_callback = function(event){sim(event);};
		var him_callback = function(event){him(event);};
		xAddEventListener(img,'mouseover',sim_callback,false);
		xAddEventListener(img,'mouseout',him_callback,false);
		}
		var si_callback = function(event){
			if (!event) event = window.event;
			var object = get_event_sender(event);
			return si(object);
		};
		if (!img.onclick) xAddEventListener(img,'click',si_callback,false);

		images_to_check.splice(i, 1);
	}
	if(images_to_check.length > 0){
		check_images();
	}
}
function StartCommentUpdater(p_topic_id, p_last_comment, p_is_blog, p_is_photo, p_blog_login){
	current_topic_id = p_topic_id;
	last_comment_id = p_last_comment;
	is_blog = p_is_blog;
	is_photo = p_is_photo;
	blog_login = p_blog_login;

	runChecker();
}
var current_counters, last_vote_time;
function StartDuelCommentUpdater(p_topic_id, p_last_comment, p_first_points, p_second_points, p_last_vote_time){
	current_topic_id = p_topic_id;
	last_vote_time = p_last_vote_time;
	is_duel = 1;
	current_counters = new Array(p_first_points, p_second_points);
	last_comment_id = p_last_comment;

	runChecker();
}
var is_runned;
function runChecker(){
	if(is_runned != undefined){
		return;
	}
	if (opera_mini) return;
	is_runned = 1;
	updater_timeout_obj = setTimeout("checkNewComments();", 5000);
}
var func_err_run_again = function(a){
	is_runned = undefined;
	runChecker();
};
function checkNewComments(){
	clearTimeout(updater_timeout_obj);
	if(is_runned != 1){
		return;
	}
	is_runned = 2;
	var ajax = new Ajax();
	var url = 'http://'+document.location.hostname+'/c/'+(is_photo==1?'f/'+blog_login:( is_blog==1 ? 'b/'+blog_login : (is_duel == 1 ? 'd' : 't') ))+'/'+current_topic_id+'?' + Math.random();
	ajax.doGet(url, CheckLastTopicID, func_err_run_again);

	return true;
}
var func_err_comm	= function(a){
	is_runned = undefined;
};
function CheckLastTopicID(resp){
	if(is_runned != 2){
		return;
	}
	is_runned = 3

	resp = resp.replace(/^\s+/, '');
	resp = resp.replace(/^\n+/, '');
	resp = resp.replace(/\s+$/, '');
	resp = resp.replace(/\n+$/, '');

	if (resp.match(/:/)){
		var counters = resp.split(':');
		var is_points_changed = 0;
		if (counters[0] != current_counters[0]){
			current_counters[0] = counters[0];
			var first_span = xGetElementById('first_points');
			first_span.innerHTML = counters[0]+' <font size=5>баллов</font>';
			is_points_changed = 1;
		}
		if (counters[1] != current_counters[1]){
			current_counters[1] = counters[1];
			var second_span = xGetElementById('second_points');
			second_span.innerHTML = counters[1]+' <font size=5>баллов</font>';
			is_points_changed = 1;
		}
		if (is_points_changed){
			var ajax = new Ajax();
			ajax.doGet('http://'+document.location.hostname+'/d/?did=' + current_topic_id + '&st=' + last_vote_time + '&ft=' + counters[3], ProcessDuelCommentsPoints, func_err_comm);
			last_vote_time = counters[3];
			return;
		}
		if (counters[2] != last_comment_id){
			GetNewComments();
		}
		else{
			is_runned = undefined;
			runChecker();
		}
		return;
	}

	if(!resp.match(/^\d+$/)){
		is_runned = undefined;
		runChecker();
		return;
	}

	if(last_comment_id == resp){
		is_runned = undefined;
		runChecker();
		return;
	}

	GetNewComments();
}
var is_photo_topic = false;
function GetNewComments(resp){
	if(is_runned != 3){
		return;
	}

	is_runned = 4;
	var hide = false;
	var hide_message;

	if(resp){
		var matched;
		if(matched = resp.match(/^HIDE(\(([^)]*)\))?/)){
			hide_message = matched[2];
			resp = resp.replace(/^HIDE(\([^)]*\))?/, '');
			hide = true;
		}

		if(resp.match(/^ERROR/)){
			resp = resp.replace(/^ERROR/, '');
			var err_div			= xGetElementById('error_message');
			err_div.innerHTML	= '<font color=ff0000><img src=http://ltalk.ru/i/alert_error.gif width=14 height=14 alt="">&nbsp;'+resp+'</font>';
			err_div.style.display = 'block';
			PlayNotice('warn');
			is_runned = undefined;
			runChecker();
			return;
		}
		var form_elem = xGetElementById('comment_form');
		if(resp.match(/^REDIR/)){
			form_elem.submit();
			return;
		}
		var textArea = form_elem.message;
		textArea.value = '';
		resizeTextAreaDelayed(textArea);
		if(hide){
			HideFormIfCan(hide_message);
		}
	}

	is_runned = 2;
	var url = 'http://'+document.location.hostname+'/ajax/get_comments';
	var data = (blog_login ? 'blog_login='+blog_login+'&' : '')+'tid='+current_topic_id+'&lcid='+last_comment_id+(is_photo==1?'&photo=1': (is_duel ? '&duel=1' : '') )+'&adc='+(ad_counter?ad_counter:0);
	var ajax = new Ajax();
	ajax.doPost(url, data, UpdateComments, func_err_comm);
}
function UpdateComments(resp){
	is_runned = undefined;

	var matched;
	if(matched = resp.match(/^HIDE(\(([^)]*)\))?/)){
		var hide_message = matched[2];
		resp = resp.replace(/^HIDE(\([^)]*\))?/, '');
		HideFormIfCan(hide_message);
	}
	if(resp.match(/^ERROR/)){
		resp = resp.replace(/^ERROR/, '');
		var err_div			= xGetElementById('error_message');
		err_div.innerHTML	= '<font color=ff0000><img src=http://ltalk.ru/i/alert_error.gif width=14 height=14 alt="">&nbsp;'+resp+'</font>';
		err_div.style.display = 'block';
		PlayNotice('warn');
		is_runned = undefined;
		runChecker();
		return;
	}

	try{
		eval(resp);
	}
	catch(e){
		runChecker();
		return;
	}
	fix_favicons_images();
	runChecker();
};
function AddComment(p_html_text){
	var container = xGetElementById('comments_box');
	var elem = document.createElement("SPAN");
	elem.innerHTML = p_html_text;
	container.appendChild(elem);

	registerImagesInHtml(p_html_text);
	fix_favicons_images();

	PlayNotice('ok');
}
function DuelVote(params, span_id){
	if (is_guest){
		feelLogin();
	}
	var ajax = new Ajax();
	ajax.doPost('http://ltalk.ru/p/duel_comment.cgi', 'action=vote&'+params, checkNewComments, func_err_comm);
	block_span = xGetElementById(span_id);
	if (block_span){
		block_span.innerHTML = block_span.innerHTML.replace(/<\/?A[^>]+>/gi, '');
	}
	return;
}
function ProcessDuelCommentsPoints(response){
	var comments_points = response.split(';');
	var comment_points, point_span;
	for (var i=0, len = comments_points.length; i<len; i++){
		comment_points = comments_points[i].split(':');
		point_span = xGetElementById('cp'+comment_points[0]);
		if (point_span){
			point_span.innerHTML = comment_points[1];
		}
	}
	is_runned = undefined;
	runChecker();
	return;
}
function AddDuelComment(side, p_html_text){
	var tbl = xGetElementById('comments_table');
	if (tbl){
		var lastRow = tbl.rows.length;
		var iteration = lastRow;
		var row = tbl.insertRow(lastRow);
		// left cell
		var cellLeft = row.insertCell(0);
		var cellRight = row.insertCell(1);
		var elem = document.createElement("SPAN");
		elem.innerHTML = p_html_text;
		var space = document.createTextNode(' ');
		if (side == 'first'){
			cellLeft.appendChild(elem);
			cellRight.appendChild(space);
		}
		else{
			cellLeft.appendChild(space);
			cellRight.appendChild(elem);
		}

		registerImagesInHtml(p_html_text);
		fix_favicons_images();

		PlayNotice('ok');
	}
}
function removeElem(id){
	var el = xGetElementById(id);
	if(el){
		el.parentNode.removeChild(el);
	}
}
function ShowAds(p_html_text){
	var container = xGetElementById('comments_box');
	var elem = document.createElement("SPAN");
	elem.innerHTML = p_html_text;
	container.appendChild(elem);
}
function DownloadIframeAds(a,s,t){
	var ad_frame=xGetElementById(a);
	if(ad_frame){
		ad_frame.src='http://softbn.ru/p/0.cgi?s='+s+'&t='+t+'&o='+(new Date()).getTimezoneOffset()+'&r='+Math.round(Math.random()*1000000000);
	}
}
function setLastComment(p_last_comment_id){
	if(p_last_comment_id > 0){
		last_comment_id = p_last_comment_id;
	}
}
var button_type;
function SendFormAddComment(form){
	// Clear error message because new action
	var err_div			= xGetElementById('error_message');
	err_div.style.display = 'none';
	err_div.innerHTML	= '';

	form.action = 'http://'+document.location.hostname+'/p/add_comment.cgi';

//	return true;  //  uncomment this to disable ajax

	var form_topic_id	= form.topic_id.value;
	var form_r			= form.r.value;
	var form_message	= form.message.value;

	var form_alogin		= (form.alogin ? form.alogin.value : '');
	var form_password	= (form.password ? form.password.value : '');
	var form_authorize	= (form.authorize ? (form.authorize.checked ? form.authorize.value : '') : '');
	var form_avatar		= (form.avatar ? form.avatar.value : '');
	var form_add		= form.add.value;
	var form_preview	= form.preview.value;
	var form_is_photo	= (form.photo ? form.photo.value : 0);
	var form_nlogin		= (form.new_login ? form.new_login.value : '');
	var form_name		= (form.name ? form.name.value : '');
	var form_email		= (form.email ? form.email.value : '');
	var form_www		= (form.www ? form.www.value : '');
	var form_blog_login = (form.blog_login ? form.blog_login.value : '');
	var form_user_type	= '';
	if (form.user_type){
		if(form.user_type.length != undefined){
			for (i=0; i<form.user_type.length; i++){
				if (form.user_type[i]){
					if (form.user_type[i].checked){
						form_user_type = form.user_type[i].value;
					}
				}
			}
		}
		else{
			form_user_type = form.user_type.value;
		}
	}

	// User enter login and password. So we don't use ajax
	if(form_user_type == 'notanon' && form.authorize.checked ||
		form_user_type == 'new_user'){
		return true;
	}

	var data =	'ajax=1&'+(form_blog_login ? 'blog_login='+form_blog_login+'&' : '')+
				'topic_id='+form_topic_id+'&'+
				'r='+my_encodeURIComponent(form_r)+'&'+
				'message='+my_encodeURIComponent(form_message)+'&'+
				'user_type='+form_user_type+'&'+
				'alogin='+my_encodeURIComponent(form_alogin)+'&'+
				'password='+my_encodeURIComponent(form_password)+'&'+
				'authorize='+form_authorize+'&'+
				'avatar='+form_avatar+'&'+
				'button='+button_type+'&'+
				'photo='+form_is_photo+'&'+
				'new_login='+my_encodeURIComponent(form_nlogin)+'&'+
				'name='+my_encodeURIComponent(form_name)+'&'+
				'email='+my_encodeURIComponent(form_email)+'&'+
				'www='+my_encodeURIComponent(form_www);

	var ajax = new Ajax();
	var url = 'http://'+document.location.hostname+'/p/add_comment.cgi';

	if(!ajax.init()){
		return true;
	}

	is_runned = 3;

	if(button_type == 'add'){
		data += '&add=' + form_add;
		ajax.doPost(url, data, GetNewComments, func_err);
	}
	else if(button_type == 'preview'){
		data += '&preview=' + form_preview;
		ajax.doPost(url, data, UpdateComments, func_err);
	}
	else{
		return true;
	}

	return false;
}
function SendFormAddDuelComment(form){
	// Clear error message because new action
	var err_div			= xGetElementById('error_message');
	err_div.style.display = 'none';
	err_div.innerHTML	= '';

	form.action = 'http://'+document.location.hostname+'/p/duel_comment.cgi';

//	return true;  //  uncomment this to disable ajax

	var form_duel_id	= form.duel_id.value;
	var form_r			= form.r.value;
	var form_message	= form.message.value;

	var form_avatar		= (form.avatar ? form.avatar.value : '');

	var data =	'ajax=1&'+
				'duel_id='+form_duel_id+'&'+
				'r='+my_encodeURIComponent(form_r)+'&'+
				'message='+my_encodeURIComponent(form_message)+'&'+
				'avatar='+form_avatar+'&'+
				'button='+button_type;

	var ajax = new Ajax();
	var url = 'http://'+document.location.hostname+'/p/duel_comment.cgi';

	if(!ajax.init()){
		return true;
	}

	is_runned = 3;

	if(button_type == 'add'){
		ajax.doPost(url, data, GetNewComments, func_err);
	}
	else if(button_type == 'preview'){
		ajax.doPost(url, data, UpdateComments, func_err);
	}
	else{
		getError('wrong button_type. button_type="'+button_type+'"',document.location,'');
		return true;
	}

	return false;
}
function SetAddButton(form_name){
	button_type = 'add';
	var form_elem = xGetElementById(form_name);
	form_elem.button.value = button_type;
}
function SetPreviewButton(form_name){
	button_type = 'preview';
	var form_elem = xGetElementById(form_name);
	form_elem.button.value = button_type;
}
function SetSendToMutualButton(form_name){
	button_type = 'send_to_mutual';
	var form_elem = xGetElementById(form_name);
	form_elem.button.value = button_type;
}
function my_encodeURIComponent(s){
	if(typeof encodeURIComponent=="function"){
		return encodeURIComponent(s);
	}
	else{
		return escape(s).replace(new RegExp('\\+','g'), '%2B');
	}
}
function ShowPreview(p_message){
	var err_div = xGetElementById('error_message');
	err_div.innerHTML = p_message;
	err_div.style.display = 'block';

	registerImagesInHtml(p_message);
	fix_favicons_images();

	is_runned = undefined;
	runChecker();
	return;
}
function HideFormIfCan(hide_message){
	var form_elem = xGetElementById('comment_form');
	if(!form_elem){
		return;
	}
	if(form_elem.message.value == ''){
		var new_span = document.createElement( "SPAN" );
		xParent(form_elem).insertBefore( new_span, form_elem );
		new_span.innerHTML =
			hide_message == undefined
				? 'Превышено максимальное количество комментариев к одной записи.'
				: hide_message;
		form_elem.style.display = 'none';
	}
}
function GetToolbar(context, is_not_guest, webcam){
	var is_pm_form = (context.substr(0, 7) == 'pm_form');
	var increment =
		is_pm_form ? 50 : 300;

	var toolbar = '<table cellpadding=0 cellspacing=0 width="100%" class=' + (is_pm_form ? 'pmtoolbar' : 'toolbar') + '><tr><td width="100%"><table height=19px cellpadding=0 cellspacing=0 class="hbutton_bar"><td><a href="javascript:addTag(\'' +
		context + '\',\'B\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/b.gif width=12 height=15 alt="B" title="Жирный"></a><a href="javascript:addTag(\'' +
		context + '\',\'I\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/i.gif width=10 height=15 alt="I" title="Курсив"></a><a href="javascript:addTag(\'' +
		context + '\',\'U\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/u.gif width=12 height=15 alt="U" title="Подчёркнутый"></a><a href="javascript:addTag(\'' +
		context + '\',\'S\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/s.gif width=16 height=15 alt="S" title="Зачеркнутый"></a><a href="javascript:addTag(\'' +
		context + '\',\'H\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/h.gif width=12 height=15 alt="H" title="Подзаголовок"></a><a href="javascript:addTag(\'' +
		context + '\',\'OFF\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/off.gif width=31 height=15 alt="OFF" title="Офф-топик, не по теме"></a>&nbsp;<a href="javascript:addTag(\'' +
		context + '\',\'CENTER\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/center.gif width=17 height=15 alt="CENTER" title="По центру"></a><a href="javascript:addTag(\'' +
		context + '\',\'RIGHT\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/right.gif width=17 height=15 alt="RIGHT" title="По правому краю"></a>&nbsp;';

	if (context == 'topic_form'){
		toolbar += '<a href="javascript:addTag(\'' + context + '\',\'SPOILER\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/spoiler.gif width=22 height=15 alt="SPOILER" title="Скрыть текст за ссылкой &quot;Подробнее&hellip;\&quot;"></a>&nbsp;';
	}

	if ((context == 'comment_form' || is_pm_form) && (window.getSelection || document.getSelection || document.selection)){
		toolbar += '<a href="javascript:false;" onClick="return false;" class="hbutton"><img src=http://ltalk.ru/i/smiles/quote.gif width=46 height=15 alt="Quote" title="Вставить цитату" onMouseOver="get_quote();" onMouseDown="quote(\'' + context + '\');"></a>&nbsp;';
	}

	toolbar += '<a href="javascript:clearFormating(\'' + context + '\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/clear.png width=15 height=15 alt="Clear formating" title="Удалить форматирование"></a>&nbsp;';

	if(is_not_guest){
		toolbar += '<a href="javascript:addImage(\'' + context + '\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/image.gif width=19 height=15 alt="Image" title="Вставить изображение"></a>';
	}
	toolbar += '<a href="javascript:addVideo(\'' + context + '\');" class="hbutton"><img src=http://ltalk.ru/i/video.gif width=15 height=15 alt="Video" title="Вставить видео-ролик"></a>';
	toolbar += '<a href="javascript:addAudio(\'' + context + '\');" class="hbutton"><img src=http://ltalk.ru/i/audio.png width=18 height=15 alt="Audio" title="Вставить аудио-трек или плейлист"></a>';

//	if(is_not_guest){
		toolbar += '<a href="javascript:addUser(\'' + context + '\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/user.png width=15 height=15 alt="User" title="Вставить ссылку на пользователя"></a><a href="javascript:addBlog(\'' + context + '\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/blogs.png width=22 height=15 alt="Blog" title="Вставить ссылку на дневник"></a>';
//	}
	if (is_pm_form && webcam) {
		var login = context.substr(8);
		toolbar += '<a href="javascript:enableWebcam(\''+login+'\');UpdateHash();" class="hbutton" id=camon_'+login+'><img src=http://ltalk.ru/i/smiles/webcam.png width=15 height=15 alt="Enable webcam" title="Включить вебкамеру"></a>'
	}

	toolbar += '&nbsp;<a href="javascript:translit(\'' +
		context + '\');" class="hbutton"><img src=http://ltalk.ru/i/smiles/translit.gif width=54 height=15 alt="Translit" title="Перекодировать выделенный текст из латиницы в кириллицу"></a><a href=http://ltalk.ru/i/translit.html target=_blank onClick="window.open(this.href,\'\',\'toolbar=0,scrollbars=0,location=0,statusbar=1,menubar=0,resizable=1,width=760,height=160\');return false;" style="vertical-align:4px;margin-left:2px;margin-bottom:-1px;" title="Таблица транслитерации">?</a>&nbsp;</td></table>' +
		'</td></tr><tr><td><table border=0 cellpadding=0 cellspacing=0 width=100%><td class=smiles_box>' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-) \');"><img src=http://ltalk.ru/i/smiles/smile.png alt=":-)" title=":-) улыбка" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-( \');"><img src=http://ltalk.ru/i/smiles/sad.png alt=":-(" title=":-( разочарование" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\';-) \');"><img src=http://ltalk.ru/i/smiles/wink.png alt=";-)" title=";-) подмигивание" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-* \');"><img src=http://ltalk.ru/i/smiles/kiss.png alt=":-*" title=":-* поцелуйчик" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-D \');"><img src=http://ltalk.ru/i/smiles/big-smile.png alt=":-D" title=":-D смеяться" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-O \');"><img src=http://ltalk.ru/i/smiles/surprised.png alt=":-O" title=":-O удивление" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-P \');"><img src=http://ltalk.ru/i/smiles/tongue-sticking-out.png alt=":-P" title=":-P показывать язык" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\'X-( \');"><img src=http://ltalk.ru/i/smiles/angry.png alt="X-(" title="X-( злость" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\']:-) \');"><img src=http://ltalk.ru/i/smiles/devil.png alt="]:-)" title="]:-) чёртик" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\'O:-) \');"><img src=http://ltalk.ru/i/smiles/angel.png alt="O:-)" title="O:-) ангелочек" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':\\\'( \');"><img src=http://ltalk.ru/i/smiles/cry.png alt=":\'(" title=":\'( плакать" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-[ \');"><img src=http://ltalk.ru/i/smiles/upset.png alt=":-[" title=":-[ огорчение" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-\\\\ \');"><img src=http://ltalk.ru/i/smiles/confused.png alt=":-\\" title=":-\\ смущение" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-| \');"><img src=http://ltalk.ru/i/smiles/undecided.png alt=":-|" title=":-| неуверенность" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-? \');"><img src=http://ltalk.ru/i/smiles/thinking.png alt=":-?" title=":-? хм-м-м..." height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\';~) \');"><img src=http://ltalk.ru/i/smiles/cunning.png alt=";~)" title=";~) хитрая улыбка" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\'(:| \');"><img src=http://ltalk.ru/i/smiles/tired.png alt="(:|" title="(:| усталость" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\'8-} \');"><img src=http://ltalk.ru/i/smiles/crazy.png alt="8-}" title="8-} сумасшествие" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':-$ \');"><img src=http://ltalk.ru/i/smiles/shhh.png alt=":-$" title=":-$ тц-ц-ц!" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\'8-| \');"><img src=http://ltalk.ru/i/smiles/shocked.png alt="8-|" title="8-| я в шоке!" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\'B-) \');"><img src=http://ltalk.ru/i/smiles/sun-glasses.png alt="B-)" title="B-) в очках!" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\':^) \');"><img src=http://ltalk.ru/i/smiles/turn-red.png alt=":^)" title=":^) покраснеть!" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\'=^B \');"><img src=http://ltalk.ru/i/smiles/thumbs-up.png alt="=^B" title="=^B классно!" height=15 width=15></a>&nbsp;' +
		'<a href="javascript:addSmile(\'' + context + '\',\'=,B \');"><img src=http://ltalk.ru/i/smiles/thumbs-down.png alt="=,B" title="=,B отстой" height=15 width=15></a>' +
		'</td></table></td></tr></table>';

	return toolbar;
}
function InitNotice(){
	setTimeout("DelayedInitNotice();",99);
}
var myMovie;
function DelayedInitNotice(){
	if (document.playmp3){
		myMovie=document.playmp3;
	}
}
function PlayNotice(n){
	if (myMovie){
		if (n=='ok'){
			if (myMovie.playOK){
				myMovie.playOK(sound_levels[sound]['ok']);
			}
		}
		else{
			if (myMovie.playWarn){
				myMovie.playWarn(sound_levels[sound]['warn']);
			}
		}
	}
}
function CtrlEnterPress(f,e){
	var isCtrl;
	var code;
	if (!e){
		var e = window.event;
	}

	if (e.keyCode){
		code = e.keyCode;
	}
	else if (e.which){
		code = e.which;
	}

	if (code==10 || (code==13 && e.ctrlKey)){
		f();
		return false;
	}
	return true;
}
function radioClick(e,form,ac){
	var myelements = ['other_user','new_user_t'];
	var d,el,i;
	for (i = 0; i < 2; i++){
		if (myelements[i] == e){
			d = 'block';
		}
		else{
			d = 'none';
		}

		el = xGetElementById(myelements[i]);
		if (el){
			el.style.display = d;
		}
	}

	if (form != null && ac != null) {
		if (form.alogin) form.alogin.setAttribute('autocomplete', ac ? 'on' : 'off');
	}
}
var pm_timeout_id;
function checkWindow6(){
	var pm_code=getCookie('pc');
	clearTimeout(pm_timeout_id);
	if (!pm_code){
		pm_timeout_id = setTimeout("checkWindow6();",99);
		return;
	}

	deleteCookie('pc');

	var f = document.forms['pm'];
	if (!f){
		f = xGetElementById('pm');
	}
	if (f){
		f.mark_as_read.click();
	}
	return;
}
function checkWindow7(){
	var pm_code=getCookie('pc');
	clearTimeout(pm_timeout_id);
	if (!pm_code){
		pm_timeout_id = setTimeout("checkWindow7();",99);
		return;
	}

	deleteCookie('pc');

	location.reload();
	return;
}
function pm_window(reload, login){
	login = login.toLowerCase();

	var contact = xGetElementById('cnt_'+login);
	if (contact) {
		contact.className='contact';
	}

	var pmw = getCookie('pw');

	deleteCookie('n');
	document.cookie = 'n='+login+'; path=/; domain=.ltalk.ru;';

	if (pmw) {
		return;
	}

	var str = get_pm_widow_str();

	deleteCookie('pc');

	var apache = apaches[Math.floor(Math.random() * apaches.length)];
	var href = 'http://'+apache+'/private/';

	var new_window = window.open(href, "private_messages", str);

	if (reload){
		pm_timeout_id = setTimeout("checkWindow7();",99);
	}
	else{
		pm_timeout_id = setTimeout("checkWindow6();",99);
	}
	return;
}

function edit_pm_window(href, reload) {
	var str = get_pm_widow_str();

	var apache = apaches[Math.floor(Math.random() * apaches.length)];
	href = href.replace(/http:\/\/ltalk\.ru/, 'http://'+apache);

	var new_window = window.open(href, "private_messages", str);
	new_window.focus();

	if (reload){
		pm_timeout_id = setTimeout("checkWindow7();",99);
	}
	else{
		pm_timeout_id = setTimeout("checkWindow6();",99);
	}
}

function get_pm_widow_str() {
	var str = "toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=1024";

	if (window.screen){
		var xc = screen.availWidth/2-495;
		var screen_height;
		if (window.opera) {
			screen_height = xWindowHeight();
		}
		else {
			screen_height = window.screen.availHeight;
		}
		screen_height -= 10;

		var window_height = screen_height-50;
		if (window_height < 410){
			window_height = 410;
		}
		var yc = (screen_height - window_height)/2;
		str += ",height="+window_height+",left="+xc+",screenX="+xc+",top="+yc+",screenY="+yc;
	}
	else{
		str += ",top=120";
	}

	return str;
}

var menu_div;
function sme(object, event, login, blog_topics, photos, community, domain, guest_user){
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}

	if (!event){
		event = window.event;
	}
	var coord = get_mouseXY(event);

	clearTimeout(object.timer);
	object.timer = setTimeout(function(){ show_menu_div(object, coord.x, coord.y, login.toLowerCase(), blog_topics, photos, community, domain, guest_user); }, 500);
}
function get_event_sender(event) {
	var sender;
	if (event.target) sender = event.target;
	else if (event.srcElement) sender = event.srcElement;
	if (sender.nodeType == 3) sender = sender.parentNode;
	return sender;
}
function sim(event){
	if (!event) event = window.event;
	var object = get_event_sender(event);

	var coord = get_mouseXY(event);

	clearTimeout(object.timer);
	object.timer = setTimeout(function(){ show_image_menu(object, coord.x, coord.y); }, 500);
}
function him(event) {
	if (!event) event = window.event;
	var object = get_event_sender(event);

	clearTimeout(object.timer);
	if (!menu_div) menu_div = xGetElementById('menu_div');
	if (menu_div && object === menu_div.parent_object) object.timer = setTimeout('hide_menu_div()', 500);
}
function show_image_menu(object, x, y) {
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}

	var download_url = object.src.replace(/^(http:\/\/)(i\d+\.)/, "$1d.$2");
	var add_to_album = '';
	var image_take_form = '';
	if (!is_guest) {
		add_to_album = '<tr><td><img class=flag src=http://ltalk.ru/i/repost.png alt="Забрать" title="Забрать к себе в альбом" height=12 width=12>&nbsp;<a href=# onclick="xGetElementById(\'image_take_form\').submit(); return false;" title="Забрать к себе в альбом">Забрать в альбом</a></td></tr>';
		image_take_form = '<form id=image_take_form action=http://'+user_login+'.ltalk.ru/p/add_photo.cgi method=post style="margin:0"><input type=hidden name=url value="'+object.src+'"></form>';
	}
	menu_div.innerHTML = '<table border=0><tr><td><img class=flag src=http://ltalk.ru/i/download.png alt="Скачать" height=10 width=10>&nbsp;<a href='+download_url+'>Скачать изображение</a></td></tr>'+add_to_album+'</table>'+image_take_form;

	if (menu_div.style.visibility != 'visible'){
		menu_div.parent_object = object;
		var img_pos = get_offset_visible_width(object);
		var menu_left = img_pos.left - menu_div.offsetWidth;
		if (menu_left < 0) menu_left = 0;
		menu_div.style.left = menu_left  + 'px';
		menu_div.style.top = img_pos.top + 'px';
		menu_div.style.visibility = 'visible';
	}
}
function ignore(object, event, type, community, topic_id, comment_id, domain)  {
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}

	if (!event){
		event = window.event;
	}
	var coord = get_mouseXY(event);

	clearTimeout(object.timer);
	object.timer = setTimeout(function(){ show_menu_div_ignore_only(object, coord.x, coord.y, type, community, topic_id, comment_id, domain); }, 500);
}
function scme(object, event, login, blog_topics, photos){
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}

	if (!event){
		event = window.event;
	}
	var coord = get_mouseXY(event);

	clearTimeout(object.timer);
	object.timer = setTimeout(function() { show_community_menu_div(object, coord.x, coord.y, login.toLowerCase(), blog_topics, photos); }, 500);
}
function hme(object){
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}
	clearTimeout(object.timer);
	if (object === menu_div.parent_object) object.timer = setTimeout('hide_menu_div()', 500);
}
function show_menu_div(object, x, y, login, blog_topics, photos, community, domain, guest_user){
	domain = domain || 'ltalk.ru';
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}
	var div_code = '';
	if ( !is_guest && (user_login.toLowerCase() != login.toLowerCase()) ){
		if (!guest_user) {
		div_code += '<tr><td class=mdp><a href="#" onClick="pm_window(false, \''+login.toLowerCase()+'\'); return false;"><img class=flag width=12 height=12 src=http://ltalk.ru/i/pm.png></a></td><td><a href="#" onClick="pm_window(false, \''+login.toLowerCase()+'\'); return false;"><nobr>Написать личное сообщение</nobr></a></td></tr><tr><td class=mdp><a href=http://'+domain+'/p/manage_goods.cgi?from=user_menu&tologin='+login.toLowerCase()+'#gifts target=_blank><img class=flag src=http://ltalk.ru/i/gift.png height=12 width=13></a></td><td><a href=http://'+domain+'/p/manage_goods.cgi?from=user_menu&tologin='+login.toLowerCase()+'#gifts target=_blank>Подарить подарок</a></td></tr><tr><td class=mdp><a href=http://'+domain+'/p/manage_duel.cgi?opp_login='+login.toLowerCase()+'><img class=flag width=12 height=12 src=http://ltalk.ru/i/duel.png></a></td><td><a href=http://'+domain+'/p/manage_duel.cgi?opp_login='+login.toLowerCase()+'>Вызвать на дуэль</a></td></tr><tr><td class=mdp><a href=http://'+domain+'/p/add_to_friend.cgi?friend='+login.toLowerCase()+' target=_blank><img id=menu_add_friend class=flag src=http://ltalk.ru/i/add.png height=12 width=12></a></td><td><a href=http://'+domain+'/p/add_to_friend.cgi?friend='+login.toLowerCase()+' target=_blank>Добавить в друзья</a></td></tr>';
		}
		div_code += '<tr><td class=mdp><a href=http://'+domain+'/p/ignore.cgi?enemy='+login.toLowerCase()+' target=_blank onClick="return ShowResponse(this);"><img class=flag src=http://ltalk.ru/i/ignor.gif width=12 height=12 alt="Игнорировать" title="Игнорировать"></a></td><td><a href=http://'+domain+'/p/ignore.cgi?enemy='+login.toLowerCase()+' target=_blank onClick="return ShowResponse(this);">Игнорировать</a></td></tr>' ;
	}
	if (community){
		div_code += '<tr><td class=mdp><a href=http://'+community+'.'+domain+'/p/ignore.cgi?enemy='+login.toLowerCase()+' target=_blank onClick="return ShowResponse(this);"><img class=flag src=http://ltalk.ru/i/ignor.gif width=12 height=12 alt="Игнорировать в сообществе" title="Игнорировать в сообществе"></a></td><td><a href=http://'+community+'.'+domain+'/p/ignore.cgi?enemy='+login.toLowerCase()+' target=_blank onClick="return ShowResponse(this);">Игнорировать в сообществе</a></td></tr>';
	}
	if (is_admin && !guest_user){
		div_code += '<tr><td class=mdp><a onClick="return ShowResponse(this);" target="_blank" href="http://'+domain+'/p/ignore.cgi?enemy='+login.toLowerCase()+'&g=1"><img class=flag width=12 height=12 src=http://ltalk.ru/i/global-ignore.gif></a></td><td><a onClick="return ShowResponse(this);" target="_blank" href="http://'+domain+'/p/ignore.cgi?enemy='+login.toLowerCase()+'&g=1">Игнорировать глобально</a></td></tr>';
	}
	if (blog_topics){
		div_code += '<tr><td class=mdp><a href=http://'+login.toLowerCase()+'.'+domain+'/><img class=flag src=http://ltalk.ru/i/blog-mini.png width=12 height=12></a></td><td><a href=http://'+login.toLowerCase()+'.'+domain+'/>Дневник</a></td></tr>';
	}
	if (photos){
		div_code += '<tr><td class=mdp><a href=http://'+login.toLowerCase()+'.'+domain+'/photos/><img class=flag width=12 height=12 src=http://ltalk.ru/i/photos.png></a></td><td><a href=http://'+login.toLowerCase()+'.'+domain+'/photos/>Альбом</a></td></tr>';
	}
	if (!guest_user && (user_login.toLowerCase() != login.toLowerCase())) {
		div_code += '<tr><td class=mdp><a href=http://'+login.toLowerCase()+'.'+domain+'/answers/#add><img class=flag width=13 height=12 src=http://ltalk.ru/i/smiles/help.png></a></td><td><a href=http://'+login.toLowerCase()+'.'+domain+'/answers/#add>Задать вопрос</a></td></tr>';
	}
	if (!guest_user) {
	div_code += '<tr><td class=mdp><a href=http://ltalk.ru/users/'+login.toLowerCase()+'/><img class=flag src=http://ltalk.ru/i/profile.png width=12 height=12></a></td><td><a href=http://ltalk.ru/users/'+login.toLowerCase()+'/>Профиль</a></td></tr>';
		if (!is_guest && (user_login.toLowerCase() != login.toLowerCase())) {
			div_code += '<tr><td class=mdp><a href=http://ltalk.ru/p/manage_goods.cgi?from=user_menu&tologin='+login.toLowerCase()+'#vip><img class=flag src=http://ltalk.ru/i/vip.png width=12 height=12></a></td><td><a href=http://ltalk.ru/p/manage_goods.cgi?from=user_menu&tologin='+login.toLowerCase()+'#vip>Подарить VIP-статус</a></td></tr>';
		}
	}
	if (!div_code) return;
	menu_div.innerHTML = '<table border=0>' + div_code + '</table>';

	if (menu_div.style.visibility != 'visible') set_menu_div_visible(menu_div, object);
}
function set_menu_div_visible (menu_div, obj) {
	menu_div.parent_object = obj;
	var img_pos = get_offset_visible_width(obj);

	var docsize = xDocSize();
	var mw = menu_div.offsetWidth;
	var mh = menu_div.offsetHeight;
	var sw = xWindowWidth();
	var sh = xWindowHeight();
	if (sh < docsize.h) {
		// has scrollbar
		sbw = getScrollBarWidth();
		sw -= sbw;
	}
	var sleft = xScrollLeft();
	var stop  = xScrollTop();

	menu_div.style.left =
		(img_pos.right+mw > sw + sleft
			? (sw+sleft - mw)
			: img_pos.right)  + 'px';
	menu_div.style.top =
		(img_pos.top+mh > sh+stop
			? (sh+stop - mh)
			: img_pos.top + 'px');
	menu_div.style.visibility = 'visible';

	return;
}
var sb_width;
function getScrollBarWidth () {
	if (sb_width === undefined) {
		var inner = document.createElement('p');
		inner.style.width = "100%";
		inner.style.height = "200px";

		var outer = document.createElement('div');
		outer.style.position = "absolute";
		outer.style.top = "0px";
		outer.style.left = "0px";
		outer.style.visibility = "hidden";
		outer.style.width = "200px";
		outer.style.height = "150px";
		outer.style.overflow = "hidden";
		outer.appendChild (inner);

		document.body.appendChild (outer);
		var w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		var w2 = inner.offsetWidth;

		if (w1 == w2) w2 = outer.clientWidth;

		document.body.removeChild (outer);

		sb_width = (w1 - w2);
	}
	return sb_width;
}
function get_offset_visible_width(element){
	var left,top;

	if (element.getBoundingClientRect()) {
		var box = element.getBoundingClientRect();
		var body = document.body;
		var docElem = document.documentElement;
		var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		var clientTop = docElem.clientTop || body.clientTop || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		top  = Math.round(box.top +  scrollTop - clientTop);
		left = Math.round(box.left + scrollLeft - clientLeft);
	}
	else {
		left = element.offsetLeft;
		top = element.offsetTop;
		for (var parent = element.offsetParent; parent; parent = parent.offsetParent)	{
			left += parent.offsetLeft;
			top += parent.offsetTop;
		}
	}
	var width = element.offsetWidth;
	for (var parent = element.parentNode; parent; parent = parent.parentNode)	{
		if (parent.offsetWidth < width) width = parent.offsetWidth;
	}
	return {left: left, top: top, right: left + width, bottom: top + element.offsetHeight};
}
function show_menu_div_ignore_only (object, x, y, type, community, topic_id, comment_id, domain) {
	domain = domain || 'ltalk.ru';
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}
	var ignore_url =
		'http://'+community+'.'+domain
		+'/p/ignore.cgi?t='+type+'&tid='+topic_id
		+(comment_id ? '&cid='+comment_id : '');

	menu_div.innerHTML = '<table border=0><tr><td class=mdp><a href='+ignore_url+' target=_blank onClick="return ShowResponse(this);"><img class=flag src=http://ltalk.ru/i/ignor.gif width=12 height=12 alt="Игнорировать в сообществе" title="Игнорировать в сообществе"></a></td><td><a href='+ignore_url+' target=_blank onClick="return ShowResponse(this);">Игнорировать в сообществе</a></td></tr></table>';
	if (menu_div.style.visibility != 'visible') set_menu_div_visible(menu_div, object);
}
function show_community_menu_div(object, x, y, login, blog_topics, photos){
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}
	var div_code = '<tr><td class=mdp><a href=http://ltalk.ru/p/add_to_friend.cgi?friend='+login.toLowerCase()+' target=_blank><img class=flag src=http://ltalk.ru/i/add.png height=12 width=12></a></td><td><a href=http://ltalk.ru/p/add_to_friend.cgi?friend='+login.toLowerCase()+' target=_blank>Добавить в друзья</a></td></tr><tr><td class=mdp><a href=http://ltalk.ru/p/ignore.cgi?enemy='+login.toLowerCase()+' target=_blank onClick="return ShowResponse(this);"><img class=flag src=http://ltalk.ru/i/ignor.gif width=12 height=12 alt="Игнорировать" title="Игнорировать"></a></td><td><a href=http://ltalk.ru/p/ignore.cgi?enemy='+login.toLowerCase()+' target=_blank onClick="return ShowResponse(this);">Игнорировать</a></td></tr>';

	if (is_admin){
		div_code += '<tr><td class=mdp><a onClick="return ShowResponse(this);" target="_blank" href="http://ltalk.ru/p/ignore.cgi?enemy='+login.toLowerCase()+'&g=1"><img class=flag width=12 height=12 src=http://ltalk.ru/i/global-ignore.gif></a></td><td><a onClick="return ShowResponse(this);" target="_blank" href="http://ltalk.ru/p/ignore.cgi?enemy='+login.toLowerCase()+'&g=1">Игнорировать глобально</a></td></tr>';
	}
	if (blog_topics){
		div_code += '<tr><td class=mdp><a href=http://'+login.toLowerCase()+'.ltalk.ru/><img class=flag src=http://ltalk.ru/i/blog-mini.png width=12 height=12></a></td><td><a href=http://'+login.toLowerCase()+'.ltalk.ru/>Дневник</a></td></tr>';
	}
	if (photos){
		div_code += '<tr><td class=mdp><a href=http://'+login.toLowerCase()+'.ltalk.ru/photos/><img class=flag width=12 height=12 src=http://ltalk.ru/i/photos.png></a></td><td><a href=http://'+login.toLowerCase()+'.ltalk.ru/photos/>Альбом</a></td></tr>';
	}
	div_code += '<tr><td class=mdp><a href=http://ltalk.ru/users/'+login.toLowerCase()+'/><img class=flag src=http://ltalk.ru/i/profile.png width=12 height=12></a></td><td><a href=http://ltalk.ru/users/'+login.toLowerCase()+'/>Профиль</a></td></tr>';
	if (!div_code) return;
	menu_div.innerHTML = '<table border=0>' + div_code + '</table>';

	if (menu_div.style.visibility != 'visible') set_menu_div_visible(menu_div, object);
}
function hide_menu_div(){
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}
	menu_div.style.visibility = 'hidden';
}
function over_menu_div(){
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}
	clearTimeout(menu_div.parent_object.timer);
}
function out_menu_div(){
	if (!menu_div){
		menu_div = xGetElementById('menu_div');
		if (!menu_div){
			return;
		}
	}
	clearTimeout(menu_div.parent_object.timer);
	menu_div.parent_object.timer = setTimeout('hide_menu_div()', 500);
}
function login_or_register(){
	document.write(' <a href="http://ltalk.ru/p/login.cgi?r=' + escape(document.location) + '">Войдите</a> или <a href="http://ltalk.ru/p/register.cgi?r=' + escape(document.location) + '">зарегистрируйтесь</a>.');
}

// личные сообщения #+++1
var current_item_num;
var clear_message=true;
function highlightMessage(item_num){
	if (item_num != current_item_num){
		var ajax = new Ajax();
		var url  = 'http://ltalk.ru/messages/' + messages_folder + '/';

		if (!ajax.init){
			return true;
		}

		var pressed_row = xGetElementById('row'+item_num);
		var current_row = xGetElementById('row'+current_item_num);

		if (pressed_row != null){
			pressed_row.className = 'rcurrent';
		}
		if (current_row != null){
			current_row.className = 'rplain';
		}
		current_item_num = item_num;

		var data = 'ajax=1&c='+item_num;
		ajax.doPost(url, data, ChangeMessage, func_err);
	}

	return false;
}
function ChangeMessage(response){
	var messagetextdiv = xGetElementById('messagetext');
	if (messagetextdiv != null){
		messagetextdiv.innerHTML = response;
		registerImagesInHtml(response);
		fix_favicons_images();
	}

	var pressed_link = xGetElementById('fe'+current_item_num);
	if (pressed_link != undefined && messages_folder == 'incoming'){
		pressed_link.className = 'lreaded';
	}
	if (clear_message){
		sayMessage('');
	}
	clear_message = true;
}
var deleted_item_num;
function deleteMessage(item_num){
	var ajax = new Ajax();

	if (!ajax.init){
		return true;
	}

	var url  = 'http://ltalk.ru/p/delete_message.cgi';
	var data = 'ajax=1&folder='+messages_folder+'&id='+item_num;

	deleted_item_num = item_num;
	ajax.doPost(url, data, doDeleteMessage, func_err);

	return false;
}
function doDeleteMessage(response){
	if (response == 'DELETED'){
		if (deleted_item_num == current_item_num){
			var table = xGetElementById('messagelist');
			if (table == undefined){
				return true;
			}
			var trows = table.rows;
			var i,curid;
			for (i = 0; i < trows.length; i++){
				if (trows[i].id == 'row' + deleted_item_num){
					if (trows[i+1] != undefined){
						curid = trows[i+1].id;
					}
					else if (trows[i-1] != undefined){
						curid = trows[i-1].id;
					}
				}
			}
			if (curid != undefined){
				// перейти на curid
				var linkid = curid.slice(3);
				clear_message = false;
				highlightMessage(linkid);
			}
		}
		removeElem('row' + deleted_item_num);

		sayMessage('Сообщение успешно удалено.');
	}
}
var unreaded_item_num;
function unreadMessage(item_num){
	var ajax = new Ajax();

	if (!ajax.init){
		return true;
	}

	var url  = 'http://ltalk.ru/p/unread_message.cgi';
	var data = 'ajax=1&id='+item_num;

	unreaded_item_num = item_num;
	ajax.doPost(url, data, doUnreadMessage, func_err);

	return false;
}
function doUnreadMessage(response){
	if (response == 'UNREADED'){
		var link = xGetElementById('fe'+unreaded_item_num);

		if (link != undefined){
			link.className = 'lunreaded';
		}
		sayMessage('Сообщение помечено непрочтённым.');
	}
}
function sayMessage(message){
	var usermessagediv = xGetElementById('usermessage');
	if (usermessagediv != null){
		usermessagediv.innerHTML = message;
	}
}
function Navigate(e){
	var k;
	if(window.event){
		e = window.event;
		k = e.keyCode;
	}else if(e){
		k = e.keyCode;
	}

	var code;
	if (k) code = k;
	else if (e.which) code = e.which;

	if (e.ctrlKey){
		switch (code)
		{
			case 0x25: // left
				var link = xGetElementById('prevpage');
				if (link && link.href){
					document.location = link.href;
				}
				break;
			case 0x27: // right
				var link = xGetElementById('nextpage');
				if (link && link.href){
					document.location = link.href;
				}
				break;
			case 0x26: // up
				moveRelative(-1);
				break
			case 0x28: // down
				moveRelative(1);
				break;
			case 0x2e:
				deleteMessage(current_item_num);
		}
	}
}

// move vertically by dr rows. negative moves up positive moves down
function moveRelative(dr){
	var table = xGetElementById('messagelist');
	if (table == undefined){
		return true;
	}
	var trows = table.rows;
	var i,curid;
	for (i = 0; i < trows.length; i++){
		if (trows[i].id == 'row' + current_item_num){
			if (trows[i+dr] != undefined){
				curid = trows[i+dr].id;
			}
		}
	}
	if (curid != undefined && curid.slice(0,3) == 'row'){
		// перейти на curid
		var linkid = curid.slice(3);
		highlightMessage(linkid);
	}
}
var DuelFinishes;
var duel_timeout;
function countDown(howmuch){
	if (duel_timeout){
		clearTimeout(duel_timeout);
	}
	DuelFinishes = howmuch;

	updateCountdownTimer();
}
function updateCountdownTimer(){
	if (DuelFinishes != undefined){
		var timer1 = xGetElementById('countdown1');
		var timer2 = xGetElementById('countdown2');

		if (timer1 || timer2){
			var diff = DuelFinishes;
			DuelFinishes--;

			if (diff <= 0){
				if (duel_timeout){
					clearTimeout(duel_timeout);
				}
				duel_timeout = setTimeout(reloadDuelPage, Math.random()*5000);
				return;
			}

			var days  = Math.floor(diff / 86400);
			diff -= days * 86400;
			var hours = Math.floor(diff / 3600);
			diff -= hours * 3600;
			var minutes = Math.floor(diff / 60);
			var seconds = diff - minutes*60;

			var timestring =
				"До завершения дуэли "
				+ correctNumberForm(
					seconds, 'осталась', 'осталось', 'осталось')
				+ ' '
				+ (days > 0  ? (days  + "д. ") : '')
				+ (hours > 0 ? (hours + ":") : '')
				+ (minutes > 0 ? (minutes + ":") : '')
				+ seconds
				+ ( days == 0 && hours==0 && minutes ==0
						? (' ' + correctNumberForm(
									seconds,
									'секунда', 'секунды', 'секунд'))
						: '');
			if (timer1){
				timer1.innerHTML = timestring;
			}
			if (timer2){
				timer2.innerHTML = timestring;
			}

			duel_timeout = setTimeout("updateCountdownTimer();", 1000);
		}
	}
}
var CommentToFinishDuel;
function commentDown(comments){
	CommentToFinishDuel = comments;

	updateCommentDown();
}
function updateCommentDown(){
	if (CommentToFinishDuel){
		if (CommentToFinishDuel > 0){
			var counter1 = xGetElementById('countdown1');
			var counter2 = xGetElementById('countdown2');

			if (counter1 || counter2){
				var countstring =
					'До завершения дуэли '
					+ correctNumberForm(
						CommentToFinishDuel,
						'остался', 'осталось', 'осталось')
					+ ' '
					+ CommentToFinishDuel
					+ ' ' + correctNumberForm(
								CommentToFinishDuel,
								'комментарий',
								'комментария',
								'комментариев');
				if (counter1){
					counter1.innerHTML = countstring;
				}
				if (counter2){
					counter2.innerHTML = countstring;
				}
			}
		}

		if (CommentToFinishDuel <= 0){
			duel_timeout = setTimeout(reloadDuelPage, Math.random()*5000);
			return;
		}
	}
}
function removeCountDown(){
	var counter1 = xGetElementById('countdown1');
	var counter2 = xGetElementById('countdown2');
	if (counter1){
		counter1.innerHTML = '';
	}
	if (counter2){
		counter2.innerHTML = '';
	}
	if (duel_timeout){
		clearTimeout(duel_timeout);
	}
}
function correctNumberForm(n, one, two, more)	//возвращает правильную форму исчисляемого
{
	var u = n % 10;
	var d = Math.floor(n / 10) % 10;

	if (u == 1 && d != 1){
		return one;
	}
	else if (u >= 2 && u < 5 && d != 1){
		return two;
	}
	return more;
}
function reloadDuelPage(){
	if (duel_timeout){
		clearTimeout(duel_timeout);
	}
	document.location = document.location;
}
var full_images = new Array();
var full_image_timeout;
var full_image_flag = new Array();
var full_image_width = new Array();
var full_image_height = new Array();
function si(image){
	if (full_image_flag[image.id]){
		image.width = full_image_width[image.id];
		image.height = full_image_height[image.id];
		full_image_flag[image.id] = false;
	}
	else{
		var full_image = new Image;
		full_image.src = image.src;
		full_images.push(full_image);
		full_images.push(image);

		StartFullImagesResizer();
	}
	return true;
}
function StartFullImagesResizer(){
	if (!full_image_timeout){
		full_image_timeout = setTimeout(FullImagesResizer, 99);
	}
}
function FullImagesResizer(){
	if (full_image_timeout){
		clearTimeout(full_image_timeout);
		full_image_timeout = undefined;
	}
	var i=0;
	while(full_image = full_images[i]){
		if (full_image){
			if (full_image.complete){
				var image = full_images[i+1];
				if (image){
					full_image_width[image.id] = image.width;
					full_image_height[image.id] = image.height;
					full_image_flag[image.id] = true;

					image.width = full_image.width;
					image.height = full_image.height;

					full_images.splice(i, 2);
				}
			}
		}
		i+=2;
	}
	if(full_images.length>0){
		StartFullImagesResizer();
	}
}
var contact_email = 'a@talxy.ru';
function ShowEmail(){
	status="mailto:"+contact_email;
}
function HideEmail(){
	status="";
}
function SendEmail(){
	this.location="mailto:"+contact_email;
}
function EmailUs(s){
	document.write("<a href='mailto:[antispam_protected]' onMouseOver='ShowEmail()' onMouseLeave='HideEmail()' onClick='return SendEmail();'>"+s+"</a>");
}
// semaphores #+++2
function Semaphore () {
	this.v = 0;
}

Semaphore.prototype.lock = function() {
	if (this.v > 0)
		return false;
	else {
		this.v ++;
		return true
	}
}

Semaphore.prototype.raise = function() {
	this.v ++;
}

Semaphore.prototype.lower = function () {
	if (this.v > 0)
			this.v --;
}
Semaphore.prototype.unlock = Semaphore.prototype.lower;

Semaphore.prototype.is_open = function () {
	return (this.v <= 0);
}
// semaphores #---2

var get_messages_s = new Semaphore();
function SendFormSendMessage(form, use_ajax){
	var recipient = form.recipient.value;

	// Clear error message because new action
	hideErrorDiv(recipient);
	removeElem('message_preview_'+recipient.toLowerCase());

	form.action = 'http://'+document.location.hostname+'/p/send_message.cgi';

	if(!use_ajax){
		return true;
	}

	var subject = form.subject.value;
	var message = form.message.value;
	var avatar_elem = form.avatar;
	var avatar;
	if (avatar_elem){
		avatar = avatar_elem.value;
	}
	else{
		avatar = '';
	}
	var redir = form.redir.value;

	var data =	'ajax=1&'+
				'recipient='+recipient+'&'+
				'subject='+my_encodeURIComponent(subject)+'&'+
				'message='+my_encodeURIComponent(message)+'&'+
				'avatar='+avatar+'&'+
				'button='+button_type+'&'+
				'redir='+my_encodeURIComponent(redir);

	if (form.cacode && form.cahash){
		cacode = form.cacode.value;
		cahash = form.cahash.value;

		data += '&cacode='+cacode+'&cahash='+cahash;
	}

	var is_chat = (recipient.match(/^chat_/));
	if (is_chat) {
		var tab = all_chats_list[recipient];
		if (tab.chat_closed)
			return false;
	}

	var ajax = new Ajax();
	var url = 'http://'+document.location.hostname+'/p/'
				+ (is_chat
					? 'send_chat_message.cgi'
					: (button_type == 'send_to_mutual')
						? 'send_pm_to_mutual_friends.cgi'
						: 'send_message.cgi');

	if(!ajax.init()){
		return true;
	}

	is_runned = 3;

	if(button_type == 'add' || button_type == 'send_to_mutual' ){
		data += '&send=1';
		ajax.doPost(url, data,
			GetNewMessages,
			func_err);
	}
	else if(button_type == 'preview'){
		data += '&preview=1';
		get_messages_s.raise();
		ajax.doPost(url, data, UpdateMessages, UpdateMessagesFail);
	}
	else{
		return true;
	}

	return false;
}
var p_user_login, p_user_avatars, p_user_av_url;
var cur_incoming, cur_outgoing;
var updater_started = false;
function StartMessageUpdater(clogins){
	LoadMessages(clogins);

	if (updater_started) {
		return;
	}
	updater_started = true;

	fix_favicons_images();
	is_runned = undefined;
	runMessageChecker();
}

function setSelfLogin(ulogin) {
	p_user_login = ulogin;
}
function setSelfAvatars(avatars) {
	p_user_avatars = avatars;
}
function setSelfAvatarsUrl(url) {
	p_user_av_url  = url;
}
function setAnonymousStatus(login, st) {
	var tab = all_chats_list[login];
	if (tab) {
		tab.tab_class = st ? 'anonchat' : 'chat';
		tab.tab.className =
			tab.tab_class
			+ (login == active_pm_tab
				? ' activetab'
				: ' inactivetab');
		if(st) {
			hideAvatarsSelect(login);

			removeElem('tavatar_'+login);
		}
	}
}
function setComradeName(login, name) {
	var tab = all_tabs_list[login];
	if (tab) {
		var span = xGetElementById('tname_'+login);
		if (span) {
			span.innerHTML = name;
		}

		var input = xGetElementById('name_'+login);
		if (input) {
			input.value = name;
		}
	}
}
function setWebcamSecret(login, secret) {
	var tab = all_tabs_list[login];
	if (tab) {
		var input = xGetElementById('secret_'+login);
		if (input) {
			input.value = secret;
		}
	}
}
function setCurIncoming(incoming) {
	if ((cur_incoming == undefined)
		|| (cur_incoming-0) < (incoming-0)) {
		cur_incoming = incoming;
	}
}

function setCurOutgoing(outgoing) {
	if ((cur_outgoing == undefined)
		|| (cur_outgoing - 0) <= (outgoing-0)) {
		cur_outgoing = outgoing;
	}
}

function setCurChatItem(item_num, login) {
	var tab = all_chats_list[login];
	if (tab) {
		if ((tab.cur_chat_item == undefined)
			|| (tab.cur_chat_item-0) <= (item_num-0))
		{
			tab.cur_chat_item = item_num;
		}
	}
}

function setFirstIncoming(incoming, login) {
	var tab = all_tabs_list[login];
	if (!tab) return;
	if ((tab.first_incoming == undefined)
		|| (tab.first_incoming-0) > (incoming-0)) {
		tab.first_incoming = incoming;
	}
}

function setFirstOutgoing(outgoing, login) {
	var tab = all_tabs_list[login];
	if (!tab) return;
	if ((tab.first_outgoing == undefined)
		|| (tab.first_outgoing-0) > (outgoing-0)) {
		tab.first_outgoing = outgoing;
	}
}

function setFirstChatItem(item, login) {
	setFirstIncoming(item, login);
}

var wipe_list = false;
function runMessageChecker(){
	if(is_runned != undefined){
		return;
	}
	if (opera_mini) {
		wipe_list = false;
		return;
	}
	is_runned = 1;
	updater_timeout_obj = setTimeout("checkNewMessages();", 5000);
}
function checkNewMessagesOM(login){
	login = login.toLowerCase();
	var container = xGetElementById('messages_box_'+login);
	if (container) removeMessagesFromList(login, container, 2);
	is_runned = 1;
	wipe_list = true;
	checkNewMessages();
}
function removeMessagesFromList(login,list,limit){
	var nodes = list.childNodes;
	var surplus = 0;
	var first_incoming = undefined;
	var first_outgoing = undefined;
	for(var j=nodes.length-1; j>=0; j--) {
		if (nodes[j].tagName === 'TABLE') {
			if (++surplus > limit) {
				list.removeChild(nodes[j]);
			}
			else {
				var msg_id = nodes[j].id.match(/^(sent|incoming|chat_\d+)_?(\d+)$/);
				if (msg_id) {
					switch(msg_id[1]) {
						case 'incoming':
							first_incoming = msg_id[2];
							break;
						case 'sent':
							first_outgoing = msg_id[2];
							break;
						case login:
							first_incoming = msg_id[2];
							break;
					}
				}
			}
		}
	}
	var tab = all_tabs_list[login];
	if (tab) {
		tab.loadold = true;
		tab.first_incoming = first_incoming;
		tab.first_outgoing = first_outgoing;
		var link = xGetElementById('prevmessages_'+login);
		if (link) link.style.display = 'inline';
	}
	return;
}
function checkNewMessages(){
	clearTimeout(updater_timeout_obj);
	if(is_runned != 1){
		return;
	}
	is_runned = 2;
	var ajax = new Ajax();
	var url = 'http://'+document.location.hostname
		+ '/c/p/'
		+ p_user_login + '-sent'
		+ '?' + Math.random();
	ajax.doGet(url, CheckLastOutgoing, continueCheckLastIncoming);

	return true;
}
function CheckLastOutgoing(resp){
	if(is_runned != 2){
		return;
	}
	if (resp
		&& resp.match(/^\d+$/)
		&& resp != cur_outgoing)
	{
		GetNewMessages();
		return;
	}
	continueCheckLastIncoming();
}
function continueCheckLastIncoming(a){
	if(is_runned != 2){
		return;
	}
	var ajax=new Ajax();
	url = 'http://'+document.location.hostname
		+ '/c/p/'
		+ p_user_login + '-incoming'
		+ '?' + Math.random();

	ajax.doGet(url, CheckLastIncoming, CheckLastChat);
}
function func_err_messages_again(a){
	if(is_runned != 2){
		return;
	}
	is_runned=undefined;
	runMessageChecker();
}
function CheckLastIncoming(resp){
	if(is_runned != 2){
		return;
	}
	if (resp
		&& resp.match(/^\d+$/)
		&& resp != cur_incoming)
	{
		GetNewMessages();
		return;
	}
	CheckLastChat();
}

function CheckLastChat(resp) {
	if (is_runned != 2) {
		return;
	}

	var list = new Array();
	for (var login in all_chats_list) {
		list.push(login);
	}

	recursiveCheckChats(undefined, list);
}

function recursiveCheckChats(login, list, resp) {
	if (resp) {
		var tab = all_chats_list[login];
		if (resp.match(/^\d+$/)
			&& resp != tab.cur_chat_item)
		{
			GetNewMessages();
			return;
		}
		else if (resp == 'closed') {
			CloseChat(login);
		}
	}

	if (!list.length) {
		func_err_messages_again();
		return;
	}

	do {
		login = list.pop();
	} while(all_chats_list[login].chat_closed);

	var ajax = new Ajax();

	if (!ajax.init())
		return;

	var url =
		'http://'+document.location.hostname
		+'/c/p/'+login+'?'+Math.random();

	ajax.doGet(url,
		function(a) {
			recursiveCheckChats(login, list, a);
		},
		func_err_messages_again
		);
}

function GetNewMessages(resp){
	if (!get_messages_s.lock()) {
		return;
	}
	if (resp){
		var data = resp.match(/^ERROR([a-zA-Z0-9]{3,15}|chat_[0-9]+)\s+(.+)$/);
		if (data != null){
			var login = data[1];
			var message = data[2];
			removeElem('captcha_div');
			showErrorDiv(login, message);
			get_messages_s.lower();
			is_runned = undefined;
			runMessageChecker();
			return;
		}

		data = resp.match(/^REDIR([a-zA-Z0-9]{3,15}|chat_[0-9]+)\s+([\s\S]+)/);
		if (data != null){
			var login = data[1];
			var js = data[2];
			var captcha_div = xGetElementById('captcha_div');
			if (!captcha_div){
				captcha_div = document.createElement('DIV');
				captcha_div.id = 'captcha_div';
				document.body.appendChild(captcha_div);
			}

			captcha_div.style.position = 'absolute';
			if (opera_mini) {
				captcha_div.style.top = captcha_div.style.left = 0;
			}
			else {
			captcha_div.style.top = xWindowHeight()/2 - 150;
			captcha_div.style.left = xWindowWidth()/2 - 150;
			}

			try{
				eval(js);
			}
			catch(e){
				return;
			}

			captcha_div.style.display = 'block';
			get_messages_s.lower();
			var focusing = xGetElementById('cacode');
			if (focusing) {
				focusing.focus();
			}
			if (opera_mini) {
				captcha_div.innerHTML = '<a name="'+document.location.hash+'"></a>'+captcha_div.innerHTML;
				document.location.hash = document.location.hash;
			}
			return;
		}

		data = resp.match(/^CLEAR([a-zA-Z0-9]{3,15}|chat_[0-9]+)$/);
		if (data != null) {
			clearMessageForm(data[1]);
		}

	}

	removeElem('captcha_div');
	var params = '';
	var url =
		'http://' + document.location.hostname + '/ajax/get_messages';

	if (cur_incoming != undefined && cur_outgoing != undefined) {
		params += 'ci=' + cur_incoming + '&co=' + cur_outgoing+'&m=1';
	}

	var chats = new Array();
	var ch    = new Array();
	for (var login in all_chats_list) {
		var tab = all_chats_list[login];
		if (!tab.chat_closed) {
			chats.push(login);
			ch.push(tab.cur_chat_item);
		}
	}
	params += (params.length > 0 ? '&' : '')+'login='+chats.join(',')+'&ch='+ch.join(',');

	var ajax = new Ajax();
	ajax.doPost(url, params, UpdateMessages,
		function(a) {
			UpdateMessagesFail(a);
			func_err_comm(a);
		});
}

function UpdateMessages(resp){
	var data = resp.match(/^ERROR([a-zA-Z0-9]{3,15}|chat_[0-9]+)\s+(.+)$/);
	if (data != null){
		var login = data[1];
		var message = data[2];
		showErrorDiv(login, message);
		get_messages_s.lower();
		is_runned = undefined;
		runMessageChecker();
		return;
	}

	try{
		eval(resp);
	}
	catch (e){
		// log errors
		//	var linenumber = Math.random();
		//getError('UpdateMessages error: ['+e.name+': '+e.message+']',
					//document.location, linenumber);
		//alert('UpdateMessages error: ['+e.name+': '+e.message+']');
		//postError(resp, linenumber);
	}

	focusMessageForm();
	MarkAsRead(all_tabs_list[active_pm_tab]);

	fix_favicons_images();

	get_messages_s.lower();
	is_runned = undefined;
	runMessageChecker();
}
function showErrorDiv(login, message) {
	login = login.toLowerCase();
	var err_div	= xGetElementById('error_message_'+login);
	var msg_div = xGetElementById('messages_box_'+login);

	if (err_div && msg_div) {
		err_div.innerHTML	= '<font color=ff0000><img src=http://ltalk.ru/i/alert_error.gif width=14 height=14 alt="">&nbsp;'+message+'</font>';
		err_div.style.display = 'block';

		if (!opera_mini) msg_div.style.height =
			(msg_div.offsetHeight - err_div.offsetHeight)+'px';
	}
	PlayNotice('warn');
}
function hideErrorDiv(login) {
	login = login.toLowerCase();
	var err_div	= xGetElementById('error_message_'+login);
	var msg_div = xGetElementById('messages_box_'+login);

	if (err_div && msg_div) {
		if (!opera_mini) msg_div.style.height =
			(msg_div.offsetHeight + err_div.offsetHeight)+'px';
		err_div.innerHTML = '';
		err_div.style.display = 'none';
	}
}
function UpdateMessagesFail(resp) {
	get_messages_s.lower();
}
function PrevMessages(login) {
	var tab = all_tabs_list[login];
	if (tab && tab.loadold) {
		var ajax = new Ajax();
		if (ajax.init()) {
			var data =
				tab.is_chat
					? 'ch='+(tab.first_incoming || 0)
					+ '&d=b'
					+ '&login='+login
					: 'ci='+(tab.first_incoming || 0)
					+ '&co='+(tab.first_outgoing || 0)
					+ '&d=b&m=1'
					+ '&login='+login;
			var url =
				'http://' + document.location.hostname
					+ '/ajax/get_messages';
			get_messages_s.raise();
			ajax.doPost(url, data, UpdateMessages, UpdateMessagesFail);
		}
	}
	return false;
}
function retry(func, ms) {
	var timeout;
	timeout =
		setTimeout(function() {
			clearTimeout(timeout);
			func();
		}, ms || Math.ceil(Math.random()*200));
}
function LoadMessages(logins) {
	for (var i in logins) {
		var login = logins[i];
		if (all_tabs_list[login]) {
			var pm_loading = xGetElementById('pm_loading_'+login);
			if (pm_loading) {
				pm_loading.style.display='block';
			}
		}
	}
	if (!get_messages_s.lock()) {
		retry(function() {LoadMessages(logins);});
		return false;
	}
	var good_logins = new Array();
	for (var i in logins) {
		var login = logins[i];
		if (all_tabs_list[login]) {
			good_logins.push(login);
		}
	}
	if (good_logins.logins == 0) {
		get_messages_s.lower();
		return false;
	}

	var ajax = new Ajax();
	if (ajax.init()) {
		var data =
			'login='+good_logins.join(',')+'&d=f&ci=0&co=0&m=1&ch=0&i=1';

		var url =
			'http://' + document.location.hostname
				+ '/ajax/get_messages';
		ajax.doPost(url, data, UpdateMessages, UpdateMessagesFail);
	}
}
function hidePMLoading(login) {
	var pm_loading = xGetElementById('pm_loading_'+login);
	pm_loading.style.display='none';
}
function noMoreOldMessages(login) {
	var tab = all_tabs_list[login];
	tab.loadold = false;

	var link = xGetElementById('prevmessages_'+login);
	if (link) {
		link.style.display = 'none';
	}
}
function postError (msg, linenumber) {
	var ajax = new Ajax();
	if (ajax.init()) {
		var data = 'm='+escape(msg)
			+ '&u='+escape(document.location)
			+ '&l='+escape(linenumber)
			+ '&r='+escape(document.referrer)
			+ '&'+Math.random();
		ajax.doPost('http://'+document.location.hostname+'/js_errors',
					data,
					function (resp) { },
					func_err);
	}
	else {
		var chunk=150;
		for (var i=0; i<=resp.length;i+=chunk) {
			getError('SR '+i+': ['+resp.substr(i, chunk)+']',
						document.location, linenumber);
		}
	}
}
function scrollMessages(login){
	var tab_obj = all_tabs_list[login];
	var div = xGetElementById('messages_box_'+login);
	if (div && tab_obj){
		div.scrollTop =
			tab_obj.scroll >= 0
				? tab_obj.scroll
				: div.scrollHeight;
	}
}
function clearMessageForm(login){
	var form = xGetElementById('pm_form_'+login);
	if (form) {
		var subject = form.subject;
		if (subject){
			subject.value = '';
		}
		var message = form.message;
		if (message){
			message.value='';
		}
	}
}
function NewMessageInd(v) {
	new_message_ind = v;
}
function AddMessage(login, item_num, p_html_text, type){
	login = login.toLowerCase();
	var container = xGetElementById('messages_box_'+login);
	if (container) {
		if (opera_mini && wipe_list && login == active_pm_tab) {
			removeMessagesFromList(login, container, 0);
			wipe_list = false;
		}
		var elem = document.createElement("SPAN");
		p_html_text = processAvatar(p_html_text);
		elem.innerHTML = p_html_text;
		var table = elem.childNodes[0];

		var preview = xGetElementById('message_preview_'+login);
		container.insertBefore(table, preview);

		var tab_obj = all_tabs_list[login];

		if (tab_obj) {
			if (new_message_ind && login != active_pm_tab) {
				tab_obj.tab.className =
						'newmessage '+all_tabs_list[login].tab_class;
			}
			if (type == 'incoming') {
				tab_obj.mark_as_read.push(item_num);
			}
		}

		registerImagesInHtml(p_html_text);
		fix_favicons_images();
	}
	switch (type) {
		case 'incoming':
			setCurIncoming(item_num);
			setFirstIncoming(item_num, login);
			break;
		case 'sent':
			setCurOutgoing(item_num);
			setFirstOutgoing(item_num, login);
			break;
		case 'chat':
			setCurChatItem(item_num, login);
			setFirstChatItem(item_num, login);
			break;
	}
	if (new_message_ind) {
		PlayNotice('ok');
	}
}
function OldMessage(login, item_num, p_html_text, type) {
	login = login.toLowerCase();
	var container = xGetElementById('messages_box_'+login);
	if (container) {
		var elem = document.createElement("SPAN");
		p_html_text = processAvatar(p_html_text);
		elem.innerHTML = p_html_text;
		var table = elem.childNodes[0];

		var first_elem = container.childNodes[0];
		container.insertBefore(table, first_elem);

		var tab_obj = all_tabs_list[login];
		if (tab_obj) {
			if (type == 'incoming') {
				tab_obj.mark_as_read.push(item_num);
			}
		}

		registerImagesInHtml(p_html_text);
		fix_favicons_images();
	}
	switch(type) {
		case 'incoming':
			setFirstIncoming(item_num, login);
			setCurIncoming(item_num);
			break;
		case 'sent':
			setFirstOutgoing(item_num, login);
			setCurOutgoing(item_num);
			break;
		case 'chat':
			setFirstChatItem(item_num, login);
			setCurChatItem(item_num, login);
			break;
	}
}
function processAvatar(html) {
	if (!avatars_on) {
		html = html.replace(/class=avatar/g, 'class=avatar style="display:none;"');
		html = html.replace(/class=sign/g, 'class=sign style="display:none;"');
	}
	return html;
}
function scrollMessagesTo(login, id) {
	var tab_obj = all_tabs_list[login];
	var container = xGetElementById('messages_box_'+login);
	var message   = xGetElementById(id);

	if (container && message) {
		container.scrollTop = message.offsetTop;

		if (tab_obj) {
			tab_obj.scroll = message.offsetTop;
		}
	}
}
function registerImagesInHtml(html) {
	var str = html.match(/register_image\(\d+/g);

	if(str != null && typeof(str[0]) == 'string' && str[0] != ''){
		for(var i = 0; i < str.length; i++){
			var img_id_str = new String(str[i]);
			var img_id = img_id_str.match(/\d+$/);
			register_image(img_id[0]);
		}
	}

	str = html.match(/register_video\(\d+/g);
	if(str != null && typeof(str[0]) == 'string' && str[0] != ''){
		for(var i = 0; i < str.length; i++){
			var video_id_str = new String(str[i]);
			var video_id = video_id_str.match(/\d+$/);
			register_video(video_id[0]);
		}
	}

	str = html.match(/register_audio\(\d+/g);
	if(str != null && typeof(str[0]) == 'string' && str[0] != ''){
		for(var i = 0; i < str.length; i++){
			var audio_id_str = new String(str[i]);
			var audio_id = audio_id_str.match(/\d+$/);
			register_audio(audio_id[0]);
		}
	}}

function blinkContact (login) {
	var is_friend = false;
	var friend = xGetElementById('frn_'+login);
	if (friend) {
		friend.className = 'newmessage';

		blinkCTab(1);
		new_messages_from[login] = 1;
		is_friend = true;
	}
	var contact = xGetElementById('cnt_'+login);
	if (contact) {
		contact.className = 'newmessage';
		if (!is_friend) {
			blinkCTab(2);
			new_messages_from[login] = 2;
		}
	}
}

function detectCTab (login) {
	var friend = xGetElementById('frn_'+login);
	if (friend) {
		return 1;
	}
	var contact = xGetElementById('cnt_'+login);
	if (contact) {
		return 2;
	}
	return 0;
}

function moveContactToToday(login, name, avatar) {
	var tab = all_tabs_list[login];

	var contact = xGetElementById('cnt_'+login);
	if (contact) {
		if (contact.parentNode.id != 'cat0') {
			var cparent = contact.parentNode;
			contact = cparent.removeChild(contact);
			if (cparent.childNodes.length == 0) {
				cparent.parentNode.parentNode.removeChild(cparent.parentNode);
			}
		}
		else {
			if (!tab) {
				blinkContact(login);
			}
			return;
		}
	}
	else {
		var button = xGetElementById('showavbutton2');
		var display = button.checked ? 'inline' : 'none';

		contact = document.createElement('LI');
		contact.id = 'cnt_'+login;
		if (tab)
			contact.className = 'contact';
		else
			contact.className = 'contact newmessage';
		var callback = function () { SwitchToTab(login)};

		xAddEventListener(contact,'click',callback,false);

		contact.innerHTML = (avatar
			? (
				avatarsLoaded[2]
					? '<img class="avatar contactavatar2" alt="" src="'+avatar+'" style="display:'+display+'">'
					: '<a href="'+avatar+'" style="display:none"></a>')
			: '')
		+'<img class=flag src=http://ltalk.ru/i/smiles/user.png width=15 height=15>' + name;
	}

	var today_cat = xGetElementById('cat0');
	if (!today_cat) {
		var container = document.createElement('DIV');

		container.id='catcontainer0';
		container.className = 'rdiv';
		container.innerHTML = 'Сегодня';

		var list2 = xGetElementById('contactlist2');
		var nocnt = xGetElementById('nocnt');
		if (nocnt) {
			nocnt.parentNode.removeChild(nocnt);
		}
		var firstChild = list2.childNodes[0];
		list2.insertBefore(container, firstChild);

		today_cat = document.createElement('UL');
		today_cat.id='cat0';
		today_cat.className='contactlist';
		container.appendChild(today_cat);
	}

	today_cat.appendChild(contact);
	if (!tab) {
		blinkContact(login);
	}
}

var avatarsLoaded={1:false,2:false};
function showContactAvatars(num) {
	var cparent = xGetElementById('list'+num);
	var button  = xGetElementById('showavbutton'+num);

	if (button && cparent) {
		var display = button.checked ? 'block' : 'none';
		var avartList = xGetElementsByClassName('contactavatar'+num);

		if (avatarsLoaded[num]) {
			for (var i in avartList)
				avartList[i].style.display = display;
		}
		else {
			for (var i in avartList) {
				var element = avartList[i];
				if (element.tagName == 'A' && display == 'block') {
					var image = document.createElement('IMG');
					image.className = 'avatar contactavatar'+num;
					image.src = element.href;
					image.style.border = 0;
					image.style.display = 'block';

					element.parentNode.insertBefore(image, element);
					element.parentNode.removeChild(element);
				}
			}
			avatarsLoaded[num]=true;
		}
	}
	return true;
}

function ShowMessage(login, p_message){
	login = login.toLowerCase();
	var container = xGetElementById('messages_box_'+login);
	removeElem('message_preview_'+login);
	var elem = document.createElement('SPAN');
	elem.innerHTML	= p_message;
	elem.id = 'message_preview_'+login;
	container.appendChild(elem);
	scrollMessages(login);

	registerImagesInHtml(p_message);
	fix_favicons_images();

	is_runned = undefined;
	runMessageChecker();
	return;
}
function showMessageOptionsAdv(t, login, message_id, folder, pDelete, pReportSpam, pMarkUnread){
	var result_text = new String();
	var hostname = document.location.hostname;

	if (pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить сообщение" title="Удалить сообщение">&nbsp;<a href=http://'+hostname+'/p/delete_message.cgi?folder='+folder+'&id='+message_id+' title="Удалить сообщение" target=_blank onClick="return deleteMessagePrivate(\''+folder+'\','+message_id+');">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://'+login.toLowerCase()+'.ltalk.ru/p/report_spam.cgi?type=message&id='+message_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}
	if (pMarkUnread){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/email.gif width=13 height=11 alt="Пометить непрочитанным" title="Пометить непрочитанным">&nbsp;<a href=http://'+login.toLowerCase()+'.ltalk.ru/p/unread_message.cgi?id='+message_id+' title="Пометить непрочитанным" target=_blank onClick="return ShowResponse(this);">Пометить непрочитанным</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function showChatMessageOptionsAdv(t, login, message_id, chat_id, pDelete, pReportSpam){
	var result_text = new String();
	var hostname = document.location.hostname;

	if (pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png width=13 height=12 alt="Удалить сообщение" title="Удалить сообщение">&nbsp;<a href=http://'+hostname+'/p/delete_chat_message.cgi?id='+message_id+'&chat_id='+chat_id+' title="Удалить сообщение" target=_blank onClick="return deleteMessageChat('+chat_id+','+message_id+');">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pReportSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://'+login.toLowerCase()+'.ltalk.ru/p/report_spam.cgi?type=chat&id='+message_id+'&chat_id='+chat_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">Это спам</a></font>&nbsp;&nbsp; ';
	}

	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}
function deleteMessagePrivate(folder, item_num){
	var ajax = new Ajax();

	if (!ajax.init){
		return true;
	}

	var url  = 'http://'+document.location.hostname+'/p/delete_message.cgi';
	var data = 'ajax=1&folder='+folder+'&id='+item_num;

	ajax.doPost(url, data, function(a) {
		doDeleteMessagePrivate(a, folder+item_num)}, func_err);

	return false;
}
function deleteMessageChat(chat_id, item_num) {
	var ajax = new Ajax();

	if (!ajax.init){
		return true;
	}

	var url  =
		'http://'+document.location.hostname+'/p/delete_chat_message.cgi';
	var data = 'chat_id='+chat_id+'&id='+item_num;

	ajax.doPost(url, data, function(a) {
		doDeleteMessagePrivate(a, 'chat_'+chat_id+'_'+item_num)}, func_err);

	return false;
}
function doDeleteMessagePrivate(resp, elem_id){
	if (resp == 'DELETED'){
		removeElem(elem_id);
	}
}
var viewport;
var contactListWidth=176;
var contactListVisible = true;
function setChatAreaSize() {
	var messages_box = xGetElementById('messages_box_'+active_pm_tab);
	if (opera_mini) {
		if (messages_box) messages_box.style.position = 'relative';
		setContactlistsSize();
		return;
	}
	if (viewport == undefined)
		viewport = xGetElementById('viewportdiv');
	var windowHeight = viewport.offsetHeight;
	var windowWidth  = viewport.offsetWidth;
	windowWidth -= 5;

	var divtabs = xGetElementById('divtabs');
	windowHeight -= (divtabs.offsetHeight + 20);

	setContactlistsSize();

	var tdmessages=xGetElementById('tdmessages');
	tdmessages.style.height = windowHeight+'px';

	if(windowHeight < 0) return;
	var webcam_div = xGetElementById('webcams_div');
	if (webcam_div) {
		var webcams_height = webcam_div.offsetHeight;
		if (windowHeight < webcams_height) windowHeight = webcams_height;
	}

		var chat_td = xGetElementById('chat_td_'+active_pm_tab);
		if (messages_box) {
		messages_box.style.height =
			windowHeight - xGetElementById('pm_form_'+active_pm_tab).offsetHeight;
			var outer_mb = xGetElementById('outer_mb_'+active_pm_tab);
			if (outer_mb) {
				outer_mb.style.height = messages_box.style.height;
			}
		}

		if (chat_td) {
			chat_td.style.height = windowHeight;
			chat_td.style.width  = windowWidth;
		}
	scrollMessages(active_pm_tab);
}

function resizePMWindow() {
	RebuildTabs();
}

function removeMsgBanner() {
	removeElem('privatemessage1');
	removeElem('privatemessage2');
	removeElem('privatemessage3');
}
function markAsRead() {
	var ajax = new Ajax();

	if (!ajax) {
		return true;
	}

	var form = document.forms['pm'];
	var item = form.item.value;
	var recipient=form.recipient.value;
	var return_url = document.location.href;

	var url =
		'http://'+document.location.hostname+'/p/send_message.cgi'
	var data = 'ajax=1'
		+ '&mark_as_read=1'
		+ '&item='+item
		+ '&recipient='+recipient
		+ '&return_url='+my_encodeURIComponent(return_url);
	ajax.doPost(url, data, markAsRead_ok, func_err);

	return false;
}
function markAsRead_ok(resp) {
	if (resp == 'OK') {
		removeMsgBanner();
	}
	else {
		alert('ERROR marking as read: '+resp);
	}
}

var active_pm_tab;
var all_tabs_list = {};
var all_chats_list = {};
var new_messages_from = {};
var tabs_order    = new Array();
var last_tab_width;
var rows = new Array();
rows[0] = new Array();
var focused=false;
var new_message_ind  = true;
var avatars_on = true;

function SwitchToTab (login) {
	login = login.toLowerCase();
	var user_tab = all_tabs_list[login];

	DeactivateActiveTab();
	unBlinkCTab(login);

	if (!user_tab) {
		var n = 0;
		for (var i in all_tabs_list) {
			n = 1;
			break;
		}
		if (n == 0 && login.match(/^chat_/)) {
			showCTab(3);
		}
		user_tab = CreateTab(login);
		ShowTab(user_tab);
		StartMessageUpdater(new Array(login));
	}

	ActivateTab(user_tab);

	deleteCookie('n');
	window.focus();
	focusMessageForm();
	return;
}

function blinkCTab (ntab) {
	if (active_ctab != ntab) {
		var ctab = xGetElementById('ctab'+ntab);
		if (ctab) {
			ctab.className = 'newmessage';
		}
	}
}

function unBlinkCTab(login) {
	var ctab = new_messages_from[login];
	delete new_messages_from[login];

	if (ctab === undefined) {
		ctab = detectCTab(login);
	}

	if (ctab != 0) {
		var n = 0;
		for (var i in new_messages_from) {
			if (new_messages_from[i] == ctab)
				n++;
		}
		if (n == 0) {
			var ctab_obj = xGetElementById('ctab'+ctab);
			if (ctab_obj)
				ctab_obj.className=
					(ctab == active_ctab) ? 'activetab' : 'inactivetab';
		}
	}
}

function PMform(user_avatars, avatars_url, recipient_login, is_chat) {
	var rows = 13;
	var height = 220;

	var textarea_code;
	if (user_avatars.length > 1) {
		var avatars_block='';
		for (var i in user_avatars) {
			if (avatars_block)
				avatars_block += '<br>';

			var avatar = user_avatars[i];
			avatars_block +=
				'<img id=pm_form_'+recipient_login+'_a'+i
					+ ' src="'+avatars_url+avatar
					+ '" alt="" style="border: 4px solid #ffffff;" onClick="CheckPMAvatar(this,\'pm_form_'
							+recipient_login+'\',\''+avatar
					+'\');document.forms[\'pm_form_'+recipient_login+'\'].message.focus();">';
		}
		textarea_code =
			'<table cellspacing=0 cellpadding=0 border=0 width=100%><tr valign=top><td width=100%>'
			+ '<textarea class=message id=message_'+recipient_login+' spellcheck=true rows='+rows+' cols=50 name=message tabindex=2></textarea>'
			+ '</td><td class=chooseavatar><div id="avatars_block_'+recipient_login+'">'
			+ '<input name=avatar value="" type=hidden><span unselectable=on style="display:block;"><center>'
				+avatars_block
			+'</center></span></div></td></tr></table>';
	}
	else {
		textarea_code = textareaNoAvatars(rows, recipient_login);
	}

	var prevmessages =
		'<a class=m3 id="prevmessages_'
			+recipient_login
		+'" href="#" onClick="return PrevMessages(\''
			+recipient_login
		+'\');">Предыдущие&nbsp;сообщения</a>';

	var toggle_avatars =
		'<a class="m3 tavatar" id="tavatar_'+recipient_login+'" href="#" onClick="return TogglePMAvatars();">'
		+ (avatars_on ? 'Скрыть&nbsp;аватары' : 'Показать&nbsp;аватары')
		+ '</a>';

	var r_to = '<input type=hidden name=redir value="">';

	var update_link = opera_mini ? '<div style="padding:5px 3px"><a href=# onclick="checkNewMessagesOM(\''+recipient_login+'\');return false">Подгрузить новые сообщения</a></div>' : '';
	var form_content =
update_link + '<div id=error_message_'+recipient_login+' style="display:none"></div>'
+'<form id=pm_form_'+recipient_login+' method=post style="margin:0; padding:0;" action=http://ltalk.ru/howtocookie.html onSubmit="return SendFormSendMessage(this,true);" onKeyPress="return CtrlEnterPress(function(){document.forms[\'pm_form_'+recipient_login+'\'].send.click();},event);">'+r_to+'<input type=hidden name=button value=""><input name="recipient" type="hidden" value="'+recipient_login+'">'+'<table border=0 width=100%><tr valign=center><td align=right width=1><span class=pmsubject>Тема:</span></td><td width=100%><input class=pmsubject id=subject size=50 maxlength=100 name=subject value="" type=text tabindex=1 style="width:100%"></td><td>'
+prevmessages+'<br class=m3>'
+toggle_avatars
+'</td></tr><tr><td colspan=3 id=toolbar_'+recipient_login+'>'+GetToolbar('pm_form_'+recipient_login, true, !is_chat)+'</td></tr><tr valign=top><td colspan=3 id=pmt_'+recipient_login+'>'+textarea_code+'</td></tr><tr valign=center><td colspan=3><table cellspacing=0 cellpadding=0 border=0 width=100%><td width=1><input type=submit name=send value="Отправить Ctrl+Enter" onClick="SetAddButton(\'pm_form_'+recipient_login+'\');" tabindex=12></td><td width=1>&nbsp;</td><td><input type=submit class=preview name=preview value="Просмотр" onClick="SetPreviewButton(\'pm_form_'+recipient_login+'\');" tabindex=13>'+(is_chat ? '' : '</td><td>&nbsp;</td><td width=100% align=right><input type=submit class=send_to_mutual name=send_to_mutual value="Отправить взаимным друзьям" onClick="SetSendToMutualButton(\'pm_form_'+recipient_login+'\');" tabindex=14>')+'</font></td></table></td></tr></table></form>';
	return form_content;
}

function hideAvatarsSelect(login) {
	var td = xGetElementById('pmt_'+login);
	if (td) {
		td.innerHTML = textareaNoAvatars(13, login);
	}
}

function textareaNoAvatars(rows, login) {
	return '<textarea class=message id=message_'+login+' spellcheck=true rows='+rows+' cols=50 name=message tabindex=2></textarea>';
}

function TogglePMAvatars() {
	avatars_on = !avatars_on;

	var avlist = xGetElementsByClassName('avatar');
	for (var a in avlist) {
		if (avlist[a].style) {
			avlist[a].style.display = avatars_on ? 'block' : 'none';
		}
	}

	var signlist = xGetElementsByClassName('sign');
	for (var s in signlist) {
		if (signlist[s].style) {
			signlist[s].style.display = avatars_on ? 'block' : 'none';
		}
	}

	var linklist = xGetElementsByClassName('tavatar');
	for (var l in linklist) {
		linklist[l].innerHTML =
			avatars_on
				? 'Скрыть&nbsp;аватары'
				: 'Показать&nbsp;аватары';
	}

	UpdateHash();

	return false;
}

function PMdiv(comrade_login, is_chat) {
	return '<div class="pm_loading" style="display:none" id="pm_loading_'
			+comrade_login+'">Загружаю...</div>'
		+ '<table cellspacing=0 cellpadding=0><tr>'
		+ (is_chat ? '' : webcam_code(comrade_login))
		+ '<td id="chat_td_'+comrade_login
		+ '" style="font-size: 100%; padding-left: 5px;">'
		+ '<div class=outer_mb id="outer_mb_'+comrade_login+'"><div class=messages_box id="messages_box_'
			+ comrade_login+'">'
		+ '<div class=message_preview id="message_preview_'
			+comrade_login+'"></div></div></div>'
		+ PMform(p_user_avatars, p_user_av_url, comrade_login, is_chat)
		+ '</td></tr></table>';
}

function webcam_code(login) {
	var code = '<td valign=top id=webcams_'+login+' width=0>'
				+'<input type=hidden id="secret_'+login+'" value="">'
				+'<input type=hidden id="name_'+login+'" value="">'
				+'</td>';
	return code;
}

function CreateTab (login){
	login = login.toLowerCase();
	if (!login.match(/^[a-zA-Z0-9]{3,15}$|^chat_[0-9]+$/)) {
		return;
	}

	if (login == p_user_login) {
		return;
	}

	var is_chat = (login.match(/^chat_/));

	var pm_user_div = document.createElement('div');
	pm_user_div.id = 'pm_'+login;
	pm_user_div.style.display = 'none';

	var pm_user_tab = document.createElement('td');
	pm_user_tab.id = 'tab_'+login;
	var f_swither = function () { SwitchToTab(login)}
	var f_deleter = function () { DeleteTab(login) }

	xAddEventListener(pm_user_tab,'click',f_swither,false);
	xAddEventListener(pm_user_tab,'dblclick',f_deleter,false);

	var tab_class = is_chat ? 'chat' : 'pm';
	pm_user_tab.className = 'inactivetab '+tab_class;

	pm_user_tab.innerHTML =
		'<span id=tname_'+login+'>Загрузка...</span>'
		+'&nbsp;<img onclick="DeleteTab(\''
			+login
		+'\', event)" src=http://ltalk.ru/i/close.gif height=12 width=12>';

	var p_tabs = document.location.hash;
	if (p_tabs) {
		document.location.hash = p_tabs+','+login;
	}
	else {
		document.location.hash = login;
	}
	tabs_order.push(login);

	var td_messages = xGetElementById('tdmessages');
	if (td_messages) {
		var md = PMdiv(login, is_chat);
		pm_user_div.innerHTML = md;

		td_messages.appendChild(pm_user_div);
	}

	var new_tab =
	{
		login: login,
		div: pm_user_div,
		tab: pm_user_tab,
		first_incoming: undefined,
		first_outgoing: undefined,
		row: 0,
		mark_as_read: new Array(),
		has_webcams: false,
		loadold: true,
		is_chat: is_chat,
		tab_class: tab_class,
		chat_closed: false,
		cur_chat_item: 0,
		scroll: -1
	};
	if (new_tab.is_chat)
		all_chats_list[login] = new_tab;
	all_tabs_list[login] = new_tab;
	setScrollHandler(login);

	return new_tab;
}

function AppendToRow (tab, tab_row) {
	var tab_row_obj = xGetElementById('trtabs'+tab_row);
	var lasttab = xGetElementById('lasttab'+tab_row);
	if (tab_row_obj && lasttab) {
		last_tab_width = lasttab.offsetWidth;
		tab_row_obj.insertBefore(tab.tab, lasttab);

		rows[tab_row].push(tab);
		tab.row = tab_row;
	}
}

function RemoveFromRow (tab) {
	var current_index=undefined;
	for (var i in rows[tab.row]) {
		if (rows[tab.row][i].login == tab.login) {
			current_index = i;
			break;
		}
	}
	tab.tab = tab.tab.parentNode.removeChild(tab.tab);
	var current_tab_row = tab.row;
	rows[current_tab_row].splice(current_index, 1);
	tab.row = undefined;
}

function ActivateTab (tab) {
	var login = tab.login.toLowerCase();
	active_pm_tab = login;
	tab.div.style.display = 'block';
	tab.tab.className = 'activetab '+tab.tab_class;

	var contact = xGetElementById('cnt_'+login);
	if (contact) {
		contact.className = 'contact';
	}
	contact = xGetElementById('frn_'+login);
	if (contact) {
		contact.className = 'contact';
	}

	UpdateHash();

	setChatAreaSize();
	MarkAsRead(tab);
}

function UpdateHash () {
	var hash = '';
	for (var l in tabs_order) {
		hash = hash + ','
			+ (tabs_order[l] == active_pm_tab
				? '!'
				: '')
			+ (all_tabs_list[tabs_order[l]].has_webcams
				? '@'
				: '')
			+ tabs_order[l];
	}
	hash =
		(avatars_on ? '' : '$')
		+ hash.substr(1);

	document.location.hash = hash;
}

function DeactivateActiveTab () {
	if (active_pm_tab) {
		var o_tab = all_tabs_list[active_pm_tab];

		if (!o_tab)
			return;

		o_tab.div.style.display = 'none';

		o_tab.tab.className = 'inactivetab '+o_tab.tab_class;
	}
}

function MarkAsRead(tab) {
	var ajax = new Ajax();

	if (tab.mark_as_read.length==0)
		return;

	var data = '';
	for (var i in tab.mark_as_read) {
		data += '&i='+tab.mark_as_read[i];
	}
	data = data.substr(1);

	ajax.doPost('http://'+document.location.hostname
					+'/p/mark_as_read.cgi',
				data,
				function (resp) {
					if (resp == 'OK') {
						tab.mark_as_read.length = 0;
					}
				},
				func_err);
}

var pm_tabs_timeout;
function StartSwitcher() {
	if (pm_tabs_timeout) {
		clearTimeout(pm_tabs_timeout);
	}
	var pm_cookie = getCookie('n');

	if (pm_cookie && pm_cookie.match(/^[a-zA-Z0-9]{3,15}$|^chat_[0-9]+$/)) {
		SwitchToTab(pm_cookie);
	}

	pm_tabs_timeout = setTimeout('StartSwitcher();', 2000);
}

function ReloadAllTabs () {
	var tabs_list = document.location.hash.substr(1);

	if (tabs_list.substr(0,1) == '$') {
		avatars_on = false;
		tabs_list = tabs_list.substr(1);
	}
	else {
		avatars_on = true;
	}

	if (!tabs_list) {
		return;
	}

	var loginList = tabs_list.split(',');
	document.location.hash = '';

	var aLogins = new Array();

	for (var i in loginList) {
		var nextLogin = loginList[i];
		var has_webcams = false;
		var is_active = false;
		while (1) {
			if (nextLogin.substr(0,1) == '!') {
				nextLogin = nextLogin.substr(1);
				is_active = true;
				continue;
			}
			if (nextLogin.substr(0,1) == '@') {
				nextLogin = nextLogin.substr(1);
				has_webcams = true;
				continue;
			}
			break;
		}
		var last = CreateTab(nextLogin);
		ShowTab(last);
		if (is_active)
			ActivateTab(last);
		last.has_webcams = has_webcams;

		aLogins.push(nextLogin);
	}
	setChatAreaSize();
	StartMessageUpdater(aLogins);
}

function DeleteTab (login, event) {
	if (tabs_order.length <= 1) {
		window.close();
		return false;
	}

	var tab = all_tabs_list[login];
	var current_row_number = tab.row-0;

	RemoveFromRow(tab);
	tab.div.parentNode.removeChild(tab.div);

	var tab_row = rows.length-1;
	if (tab_row > 0
		&& current_row_number < tab_row)
	{
		for (var ri = current_row_number; ri < tab_row; ri++) {
			var i_lasttab = xGetElementById('lasttab'+ri);

			while (rows[ri+1].length > 0
					&& rows[ri+1][0].tab.offsetWidth
						< i_lasttab.offsetWidth)
			{
				var tab = rows[ri+1][0];
				RemoveFromRow(tab);
				AppendToRow(tab, ri);
			}
		}
	}

	while (rows.length && rows[rows.length-1].length == 0) {
		removeElem('tabtabs'+(rows.length-1));
		rows.pop();
	}

	var index;
	for (var i in tabs_order) {
		if (tabs_order[i] == login) {
			index = i;
			break;
		}
	}
	tabs_order.splice(index, 1);
	delete all_tabs_list[login];
	delete all_chats_list[login];

	// something else
	index--;
	if (index < 0)index=0;

	SwitchToTab(tabs_order[index]);

	if (event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}

	return false;
}

function CloseChat(login) {
	var tab = all_chats_list[login];
	tab.chat_closed = true;

	AddMessage(tab.login, 0,
		'<b>Чат закрыт как неактивный</b>',
		'chat');
}

function setScrollHandler(login) { // XXX засунуть в messages_div
	if (opera_mini) return;
	var messages_box = xGetElementById('messages_box_'+login);
	var tab = all_tabs_list[login];
	var callback = function() {
						if (messages_box.scrollTop <= 0) {
							PrevMessages(login);
						}
						else {
							tab.scroll =
								 (messages_box.scrollTop < messages_box.scrollHeight - messages_box.clientHeight)
								 	? messages_box.scrollTop
									: -1;
						}
					};

	xAddEventListener(messages_box,'scroll',callback,false);
}

function ShowTab(tab) {
	var tab_row = rows.length-1;
	AppendToRow(tab, tab_row);
	if(rows[tab_row].length > 1
		&& last_tab_width
		&& tab.tab.offsetWidth > last_tab_width)
	{
		MoveToNewRow(tab);
	}
}

function MoveToNewRow(tab) {
	RemoveFromRow(tab);

	var divtabs = xGetElementById('divtabs');
	if (!divtabs) {
		return;
	}

	rows.push(new Array());
	var tab_row = rows.length-1;

	var new_table = document.createElement('table');
	new_table.id = 'tabtabs'+tab_row;
	new_table.className = 'tabs chat';
	new_table.cellSpacing = 1;
	new_table.cellPadding = 5;

	var tbody = document.createElement('tbody');

	var tr = document.createElement('tr');
	tr.id  = 'trtabs'+tab_row;

	var td  = document.createElement('td');
	td.id   = 'lasttab'+tab_row;
	td.width = '100%';
	td.className = 'lasttab';

	var img = document.createElement('img');
	img.width = 1;
	img.height = 1;
	img.src = 'http://ltalk.ru/i/emp.gif';

	divtabs.appendChild(new_table);
	new_table.appendChild(tbody);
	tbody.appendChild(tr);
	tr.appendChild(td);
	td.appendChild(img);

	AppendToRow(tab, tab_row);
}

var rebuild_s = new Semaphore();
function RebuildTabs () {
	if (!rebuild_s.lock()) {
		return;
	}
	var i;
	for (i in all_tabs_list) {
		var tab = all_tabs_list[i];
		tab.tab = tab.tab.parentNode.removeChild(tab.tab);
		tab.row = undefined;
	}
	rows = new Array();
	rows[0] = new Array();
	for (var i = 1; ; i++) {
		var elem = xGetElementById('tabtabs'+i);
		if (elem) {
			elem.parentNode.removeChild(elem);
		}
		else {
			break;
		}
	}

	for (i in all_tabs_list) {
		ShowTab(all_tabs_list[i]);
	}
	setChatAreaSize();
	rebuild_s.unlock();
}

var pm_cookie_timeout;
function setPMWindowCookie() {
	if (pm_cookie_timeout) {
		clearTimeout(pm_cookie_timeout);
	}
	var now = new Date();
	var expires = new Date(now.getTime()+2000);
	document.cookie = 'pw=1; path=/; domain=.ltalk.ru; expires='
						+expires.toUTCString();
	pm_cookie_timeout = setTimeout('setPMWindowCookie();', 1000);
}

function deletePMWindowCookie() {
	deleteCookie('pw');
}

var active_ctab;
function showCTab (num) {
	if (num < 1 || num > 3)
		return;

	setCTabProp('inactivetab', 'none');
	active_ctab = num;
	setCTabProp('activetab', 'block');

	var m_from = {};
	for (var i in new_messages_from) {
		if (new_messages_from[i] != num)
			m_from[i] = num;
	}
	new_messages_from = m_from;
	if (opera_mini && (num == 3)) updateChatList();
	setContactlistsSize();
}
function setCTabProp(tabclass, listdisp) {
	if (active_ctab != undefined) {
		var tab = xGetElementById('ctab'+active_ctab);
		var list = xGetElementById('list'+active_ctab);

		if (tab && list) {
			tab.className = tabclass;
			list.style.display = listdisp;
		}
	}
}
function setContactlistsSize() {
	var contactlist = xGetElementById('contactlist'+active_ctab);
	if (opera_mini) {
		if (contactlist) contactlist.style.position = 'relative';
		return;
	}
	if (viewport == undefined)
		viewport = xGetElementById('viewportdiv');
	var windowHeight = viewport.offsetHeight;
	var ctabs = xGetElementById('ctabs');
	windowHeight -= (ctabs.offsetHeight + 20);
	var button = xGetElementById('showavbutton'+active_ctab);
	contactlist.style.height = (windowHeight-button.offsetHeight)+'px';
	var outer_cl = xGetElementById('outer_cl'+active_ctab);
	if (outer_cl) {
		outer_cl.style.height = contactlist.style.height;
	}
}

var blinkNewMessageTimeout;
function focusMessageWindow() {
	focused=true;

	if (blinkNewMessageTimeout) {
		clearTimeout(blinkNewMessageTimeout);
	}

	var favicon = xGetElementById('favicon');
	if (favicon) {
		favicon.href="http://ltalk.ru/favicon.ico";
	}
	document.title = 'Личные сообщения';
	focusMessageForm();
}

function focusMessageForm () {
	var message_area = xGetElementById('message_'+active_pm_tab);
	if (message_area) {
		message_area.focus();
	}
}

function blurMessageWindow() {
	focused=false;
}

function blinkNewMessage(name) {
	blinkNewMessageWork(false, name);
}

function blinkNewMessageWork (blinkOn, name) {
	if (blinkNewMessageTimeout) {
		clearTimeout(blinkNewMessageTimeout);
	}
	if (!focused) {
	var favicon = xGetElementById('favicon');
	if (favicon) {
		favicon.href = blinkOn
			? 'http://ltalk.ru/i/new_pm1.ico'
			: 'http://ltalk.ru/i/new_pm2.ico';
	}

	document.title = blinkOn
		? name
		: '***********************';

	name = name.replace(/\\/g, '\\\\');
	name = name.replace(/\'/g, '\\\'');
	}

	if (!contactListVisible) {
		var flipper = xGetElementById('arr');
		flipper.className = blinkOn
			? 'pm_arr_b'
			: 'pm_arr';
	}

	if (focused && contactListVisible) {
		var flipper = xGetElementById('arr');
		flipper.className = 'pm_arr';
		return;
	}

	blinkOn = !blinkOn;
	blinkNewMessageTimeout = setTimeout('blinkNewMessageWork('+blinkOn+',\''+name+'\');', 500);
}

function showWebcams() {
	for (var login in all_tabs_list) {
		tab = all_tabs_list[login];

		if (tab.has_webcams)
			enableWebcam(login);
	}
	UpdateHash();
}

function enableWebcam (login) {
	var webcam_td = xGetElementById('webcams_'+login);

	if (webcam_td) {
		var comname = xGetElementById('name_'+login).value;
		var secret  = xGetElementById('secret_'+login).value;

		var wdiv = document.createElement('DIV');
		wdiv.id = 'webcams_div_'+login;
		wdiv.innerHTML =
			'Вы:<br>'
			+privateWebcam(user_login, login, user_name, secret, true, false)
			+'Ваш собеседник '+comname+':<br>'
			+privateWebcam(user_login, login, user_name, secret, false, false);

		webcam_td.appendChild(wdiv);

		all_tabs_list[login].has_webcams = true;

		var button = xGetElementById('camon_'+login);
		if (button) {
			button.href = "javascript:disableWebcam('"+login+"');UpdateHash();";
			var firstChild = button.childNodes[0];
			firstChild.alt = 'Disable webcam';
			firstChild.title = 'Отключить вебкамеру';
			firstChild.src =
				'http://ltalk.ru/i/smiles/disabled-webcam.png';
		}
	}
}

function disableWebcam(login) {
	removeElem('webcams_div_'+login);
	all_tabs_list[login].has_webcams = false;

	var button = xGetElementById('camon_'+login);
	if (button) {
		button.href = "javascript:enableWebcam('"+login+"');UpdateHash();";
		var firstChild = button.childNodes[0];
		firstChild.alt = 'Enable webcam';
		firstChild.title = 'Включить вебкамеру';
		firstChild.src =
			'http://ltalk.ru/i/smiles/webcam.png';
	}
}

function privateWebcam (mylogin, comradelogin, myname, secret, broadcast, autoplay) {
	var params =
	 'channel='+mylogin+'.ltalk.ru'
		+'&amp;recipient='+comradelogin+'.ltalk.ru'
		+'&amp;secret='+secret
		+'&amp;viewer='+encodeURIComponent(myname);

	if (autoplay)
		params += '&amp;autoplay=true';
	if (broadcast)
		params += '&amp;broadcast=true';

	return '<object width=322 height=259><param name=allowFullScreen value=true></param><param name=allowscriptaccess value=always></param><param name=flashvars value="'+params+'"></param><param name=movie value=http://talxy.com/i/p2p.swf></param><embed src=http://talxy.com/i/p2p.swf flashvars="'+params+'" type="application/x-shockwave-flash" allowscriptaccess=always allowfullscreen=true width=322 height=259></embed></object>';
}

var sound_levels =
	{ 0: {ok: 5, warn: 10, img:'sound-on.png'},
	1: {ok:2, warn:5, img: 'sound-less.png'},
	2: {ok:0, warn:0, img: 'sound-off.png'}};
var sound = 0;
function resetSound() {
	setSound(0);
}
function cycleSound() {
	setSound((sound+1)%3);
}
function setSound(s) {
	sound = s;

	for (var i = 1; i<=3; i++) {
		var img = xGetElementById('snd'+i);
		if (img)
			img.src = 'http://ltalk.ru/i/'+sound_levels[s]['img'];
	}
}

function toggleRight () {
	var righttd = xGetElementById('right');
	var arr = xGetElementById('arr');

	if (righttd && arr) {
		contactListVisible = !contactListVisible;
		if (contactListVisible) {
			righttd.style.display = 'block';
			arr.style.backgroundImage = 'url(http://ltalk.ru/i/a_right.png)';
		}
		else {
			righttd.style.display = 'none';
			arr.style.backgroundImage = 'url(http://ltalk.ru/i/a_left.png)';
		}

		setChatAreaSize();
	}
}

//### chats ####### #+++1
function createNewChat() {
	var ajax = new Ajax();

	if (!ajax.init()) {
		return undef;
	}

	ajax.doGet('http://'+document.location.hostname
					+'/p/create_chat.cgi?check=1&'+Math.random(),
				createNewChatSuccess, func_err);
}

function createNewChatSuccess(resp) {
	var newchatwin = xGetElementById('newchatwin');
	if (newchatwin) {
		newchatwin.style.display = 'block';
	}
	if (resp == 'OK') {
		setNewChatInputsVisibility(true);
	}
	else {
		createChatSuccess(resp, true);
	}
}

function closeNewChatWin() {
	var newchatwin = xGetElementById('newchatwin');
	if (newchatwin) {
		newchatwin.style.display = 'none';
	}

	var form = xGetElementById('createchatform');
	if (form) {
		form.name.value = '';
		form.anonymous.checked = false;
	}

	var span = xGetElementById('createchatformerror');
	if (span) {
		span.innerHTML = '';
		span.style.display = 'none';
	}
}

function postCreateChat(form) {
	if (form) {
		var name = form.name.value;
		var anonymous = form.anonymous.checked ? 1 : 0;

		var ajax = new Ajax();

		if (!ajax.init())
			return true;

		var url = 'http://'+document.location.hostname+'/p/create_chat.cgi';
		var data = 'name='+my_encodeURIComponent(name)
					+ '&anonymous='+anonymous;

		ajax.doPost(url, data, createChatSuccess, func_err);
	}
	return false;
}

function createChatSuccess(resp, disableinput) {
	var data = resp.match(/^OK([0-9]+)$/);
	if (data != null) {
		closeNewChatWin();
		updateChatList();
		SwitchToTab('chat_'+data[1]);
		return;
	}
	data = resp.match(/^ERROR(.*)$/);
	if (data != null) {
		var msg = data[1];

		var span = xGetElementById('createchatformerror');
		if (span) {
			span.innerHTML = msg;
			span.style.display = 'block';
		}

		if (disableinput) {
			setNewChatInputsVisibility(false);
		}
	}
}

function setNewChatInputsVisibility(v) {
	var vis = v ? 'inline' : 'none';

	for (var n in {line1:1, line2:2, newchatsubmit:3})
	{
		var input = xGetElementById(n);
		if (input) {
			input.style.display = vis;
		}
	}
}

var chat_list_timeout;
function StartChatListUpdater() {
	if (chat_list_timeout) {
		clearTimeout(chat_list_timeout);
	}
	if (opera_mini) return;

	updateChatList();
	chat_list_timeout = setTimeout('StartChatListUpdater()', 5000);
}

var update_chat_list_s=new Semaphore();
function updateChatList() {
	if (!update_chat_list_s.lock())
		return;
	var ajax = new Ajax();

	if (!ajax.init())
		return false;

	ajax.doGet('http://'+document.location.hostname+'/e/chats/?'+Math.random(),
				drawChatList, func_err);
}
function drawChatList(resp, openwindow) {
	var div = xGetElementById('contactlist3');
	if (div) {
		var text;
		if (resp.length == 0) {
			text = 'Ни одного чата.';
		}
		else {
			// 0 id,  1 name,  2 creator_id, 3 create_timestamp, 4 number_of_users,
			// 5 is_paid 6 is_anonymous
			var data = resp.split('<>');

			var lists = {
				my_chats: { label: 'Мои',               a: new Array()},
				by_vips:  { label: 'Созданные VIP-ами', a: new Array()},
				new_chats:{ label: 'Новые',             a: new Array()},
				anonymous:{ label: 'Анонимные',			a: new Array()},
				active:   { label: 'Активные',          a: new Array()},
				inactive: { label: 'Заброшенные',       a: new Array()}
			};

			var now = new Date();
			var timestamp = now.getTime()/1000;
			var tz  = get_p_cookie(0);
			var gmttimestamp = timestamp + tz*60;

			for (var i = 0; i < data.length; i+=7) {
				var is_anonymous = (data[i+6] == 'Y');
				var group;
				if (data[i+2] == loginFromU()) {
					group = 'my_chats';
				}
				else if (data[i+5] != 0 && data[i+4] > 0) {
					group = 'by_vips';
				}
				else if (gmttimestamp - data[i+3] < 300
						&& lists['new_chats'].a.length < 5)
				{
					group = 'new_chats';
				}
				else if (data[i+4] > 0) {
					if (is_anonymous)
						group = 'anonymous';
					else
						group = 'active';
				}
				else if (data[i+4] == 0) {
					group = 'inactive';
				}
				lists[group].a.push(
					{id: data[i],
						u: is_anonymous ? 0 : data[i+4],
						n: data[i+1],
						image: (is_anonymous
								? 'anonymous.png'
								: 'chat.png')});
			}
			var text = '';
			for (var i in lists) {
				var group = lists[i];
				if (group.a.length >0) {
					group.a.sort(function(x, y) {
						return (y.u - x.u)
						|| (x.n < y.n
							? -1
							: (x.n > y.n ? 1 :0));
					});
					text +=
						'<b>'+group.label+':</b>'
						+ '<ul class="contactlist">';
					for (var j in group.a) {
						var item = group.a[j];
						text += '<li class="contact" id="chat_'
								+item.id
								+'" onClick="'+
								(openwindow
									? 'pm_window(false, \'chat_'
									: 'SwitchToTab(\'chat_')
									+item.id+'\')'
								+';">'
								+'<img src=http://ltalk.ru/i/'
									+item.image
								+' width=18 height=15 alt="" class=flag>'
								+item.n
								+(item.u> 0
									? '<font class=m2>&nbsp;&ndash;&nbsp;'+item.u+'</font>'
									:'')
								+'</li>';
					}
					text += '</ul>';
				}
			}
		}

		div.innerHTML = text;
	}
	update_chat_list_s.unlock();
}
//#---1
function IconImage(p_img_src, p_element){
	this.img = new Image();
	this.img_element = null;
	this.counter = 0;

	var self = this;
	this.check_complete = function(){
		if(!self.img.complete){
			if(self.counter++ < 300){
				setTimeout(self.check_complete, 1000);
			}
			else{
				self.img_element.src = 'http://ltalk.ru/i/emp.gif';
			}
			return;
		}

		var elem = self.img_element;
		if(self.img.width >= 16 && self.img.height >= 16){
			elem.src = self.img.src;
			elem.hspace = 2;
			elem.width = 16;
			elem.height = 16;
			return;
		}

		elem.src = 'http://ltalk.ru/i/emp.gif';
		return;
	}

	this.src(p_img_src);
	this.element(p_element);
}
IconImage.prototype.src = function(p_src){
	if(p_src != undefined){
		this.img.src = p_src;
	}
	return this.img.src;
}
IconImage.prototype.element = function(p_element){
	this.img_element = p_element;
}
var j=0;
var hum_callback = function(event){
	if (!event) event = window.event;
	var object = get_event_sender(event);
	return hme(object);
};
function favicons_processor(){
	if (document.links){
		var page_links  = document.links;
		var linkList  = new Array();
		var faviconLinkList = new Array();
		var faviconLinkList1 = new Array();
		var userLinkList = new Array();
		var page_links_length = page_links.length;
		for (var i=0; i<page_links_length; i++){
			var page_link=page_links[i];
			var linkclass = page_link.className;
			if(linkclass == 'favicon_processed' || linkclass == 'user_processed'){
				continue;
			}
			if (page_link.href.match(/\.mp3$/i)){
				linkList.push(page_link);
			}else if (linkclass == 'needfavicon'){
				faviconLinkList.push(page_link);
			}
			else if (linkclass == 'needfavicon1'){
				faviconLinkList1.push(page_link);
			}
			else if (linkclass == 'user'){
				if (!page_link.onmouseover) userLinkList.push(page_link);
			}
		}
		var linkList_length = linkList.length;
		for (var i=0; i<linkList_length; i++){
			var link = linkList[i];
			var span = document.createElement("span");
			span.innerHTML = "&nbsp;<a href=http://ltalk.ru/p/play_mp3.cgi?url=" + escape(link.href) + " title=\"Слушать\" target=_blank onClick=\"return ShowResponse(this);\" class=\"favicon_processed\"><img class=rad width=17 height=17 src=http://ltalk.ru/i/play.png></a>";
			link.parentNode.insertBefore(span, link.nextSibling);
			link.className = 'favicon_processed';
		}

		var userLinkList_lenght = userLinkList.length;
		var userLinkHandlers = {};
		for (var i=0; i<userLinkList_lenght; i++) {
			var link = userLinkList[i];
			if (!is_guest) {
				var um_callback;
				if (((loginMatches = link.href.match(/\/users\/([A-Za-z0-9]{3,15})\/$/)) != null) || ((loginMatches  = link.href.match(/^http:\/\/([A-Za-z0-9]{3,15})\.ltalk\.ru\//)) != null)) {
					var userLogin = loginMatches[1].toLowerCase();
					if (userLinkHandlers[userLogin]) {
						um_callback = userLinkHandlers[userLogin];
					}
					else {
						um_callback = function(login){
							return function(event){
								if (!event) event = window.event;
								var object = get_event_sender(event);
								return sme(object, event, login, 1, 1);
							};
						}(userLogin);
						userLinkHandlers[userLogin] = um_callback;
					}
					xAddEventListener(link,'mouseover',um_callback,false);
					xAddEventListener(link,'mouseout',hum_callback,false);
				}
			}
			link.className = 'user_processed';
		}

		var urls = /ltalk\.ru\/r\?r=(http|ftp)%3A%2F%2F(?:.+%40)?([^\%]+)/i;

		var host_refexp = new RegExp('^[a-zA-Z]+\.(beon\.ru|ltalk\.ru|mind'+'mix\.ru|carguru\.ru|car\-guru\.com|qaix\.com|ryxi\.com|gyxe\.com|gyxu\.com|xywe\.com|xyqe\.com)$');

		var faviconLinkList_length = faviconLinkList.length;
		for (var i=0; i<faviconLinkList_length; i++){
			var link = faviconLinkList[i];

			var hostname;
			var href = link.href;
			var match_array = href.match(urls);
			if (match_array != null){
				hostname = match_array[2];
			}
			else{
				hostname = link.hostname;
			}

			hostname = hostname.replace(host_refexp, '$1');

			var image_url = 'http://f.ltalk.ru/'+hostname;
			link.innerHTML = "<img class=flag id=fav"+j+" name=fav"+j+" width=1 height=1 src="+image_url+">"+link.innerHTML;

			var new_img = new IconImage(image_url, xGetElementById('fav'+j));
			new_img.check_complete();

			link.className = 'favicon_processed';
			j++;
		}

		var faviconLinkList1_length = faviconLinkList1.length;
		for (var i=0; i<faviconLinkList1_length; i++){
			var link = faviconLinkList1[i];

			var hostname;
			var href = link.href;
			var match_array = href.match(urls);
			if (match_array != null){
				hostname = match_array[2];
			}
			else{
				hostname = link.hostname;
			}

			hostname = hostname.replace(host_refexp, '$1');

			var image_url = 'http://f.ltalk.ru/'+hostname;

			link.innerHTML = "<img class=flag id=fav"+j+" name=fav"+j+" width=16 height=16 hspace=2 src=http://ltalk.ru/i/emp.gif>"+link.innerHTML;
			var new_img = new IconImage(image_url, xGetElementById('fav'+j));
			new_img.check_complete();

			link.className = 'favicon_processed';
			j++;
		}
	}
}

// extended controls for search
function toggleExControls() {
	var excontrols = xGetElementById('excontrols');

	if (excontrols) {
		excontrols.style.display = excontrolsshown ? 'none' : 'block';
	}

	var showexcontrols = xGetElementById('showexcontrols');

	if (showexcontrols) {
		showexcontrols.innerHTML =
			excontrolsshown ? 'Расширенный поиск' : 'Простой поиск';
	}

	excontrolsshown = !excontrolsshown;

	return false;
}

var ad_timeout_id;
var displayed_url_edited=false;
function UpdateAdPreview(){
	clearTimeout(ad_timeout_id);
	var f=document.forms['ad_form'];
	if(f){
			// default values
			var ad_name='Заголовок объявления';
			var ad_description1='Первая строка описания';
			var ad_description2='вторая строка описания';
			var ad_url='#';
			var ad_displayed_url='my.site.ru';

			var durl = f.d_url;

			if (f.aname.value != '' || !(f.url.value == '' || f.url.value == 'http://') || f.description1.value != '' || f.description2.value != ''){
				ad_name = f.aname.value;
				ad_description1 = f.description1.value;
				ad_description2 = f.description2.value;
				ad_url = f.url.value;
				if (!displayed_url_edited) {
					ad_displayed_url = '';
				}
				else if (durl) {
					ad_displayed_url = durl.value;
				}

				if (ad_displayed_url == '') {
				// get hostname from url
				var pattern = "^(([^:/\\?#]+):)?(//(([^:/\\?#]*)(?::([^/\\?#]*))?))?([^\\?#]*)(\\?([^#]*))?(#(.*))?$";
				var rx = new RegExp(pattern);
				var parts = rx.exec(ad_url);

				ad_displayed_url = parts[5] || "";

				// remove www. from ad_displayed_url
				ad_displayed_url = ad_displayed_url.replace(/^www\./, '');

					if (!displayed_url_edited && durl) {
						durl.value = ad_displayed_url;
					}
				}
			}

			xGetElementById('ad_name').innerHTML = ad_name;
			xGetElementById('ad_name_url').href = ad_url;
			xGetElementById('ad_description1').innerHTML = ad_description1;
			xGetElementById('ad_description2').innerHTML = ad_description2;
			xGetElementById('ad_url').href = ad_url;
			xGetElementById('ad_displayed_url').innerHTML = ad_displayed_url;
	}
	ad_timeout_id=setTimeout("UpdateAdPreview();",99);
}

var has_focus=false;
var cur_disp_url;
function AdDispUrlFocus (){
	var f=document.forms['ad_form'];

	if (f) {
		durl = f.d_url;
		if (durl) {
		if (has_focus) {
			if (cur_disp_url != durl.value) {
				displayed_url_edited = true;
			}
			else {
				displayed_url_edited = false;
			}
			has_focus = false;
		}
		else {
			if (!displayed_url_edited) {
				displayed_url_edited = true;
				cur_disp_url = durl.value;
				has_focus = true;
			}
		}
		}
	}
	return true;
}

function BClick(id) {
	var f = document.forms[id];

	if (f) {
		f.submit();
	}
	return false;
}

//### cookies ####### #+++1
function get_p_cookie (n) {
	var param_cookies = get_all_p_cookies();
	return param_cookies[n];
}

function get_all_p_cookies () {
	var param_cookies;
	var p = getCookie('p');

	if (!p) {
		p = '0:0:0:0:U:Y';
	}

	if (p) {
		param_cookies = p.split(':');
	}
	return param_cookies;
}

function set_p_cookie (n,v) {
	var param_cookies = get_all_p_cookies();
	param_cookies[n] = v;
	document.cookie = 'p='+param_cookies.join(':')
		+"; path=/; domain=.ltalk.ru"
		+"; expires=Sun, 31 Dec 2034 23:59:59 GMT";
}
//#---1

//### validators ####### #+++1
var validation_error_ids = new Object();

function stringValidator ( str, min, max) {
	str = str.replace( /^\s+/, '');
	str = str.replace( /\s+$/, '');

	if( str.length == 0)
	return [ 'bad', str];

	if( str.length < min)
	return [ 'min', str];

	if( str.length > max)
	return [ 'max', str];

	return [ 'ok', str];
}

function loginValidator ( str, param) {
	var res = stringValidator( str, 3, 15);

	if( res[ 0] == 'ok' && !res[ 1].match( /^[A-Za-z0-9]+$/))
		res[ 0] = 'bad';

	if( res[ 0] == 'bad')
		res[ 0] = 'Некорректный логин.';
	else if( res[ 0] == 'min')
		res[ 0] = 'Очень короткий логин. Логин должен содержать не менее 3 символов.';
	else if( res[ 0] == 'max')
		res[ 0] = 'Очень длинный логин. Логин должен содержать не более 15 символов.';
	else if ( str.match(/[Aa]+[dD]+[mM]+[iIuUlL]+[nNhH]+/) ||
			  str.match(/[mM]+[oO0]+[dD]+[eE]+[rRpP]+/) ||
			  str.match(/[sScC]+[uUyY]+[pP]+[oO0]+[rRpP]+[tT]+/) ||
			  str.match(/^[wW]+$/)  ||
			  str.match(/^[aAiI]..$/)
			)
		res[ 0] = 'Пользователь с таким логином \'' + str + '\' уже существует';
	else if ( str.match(/aciphex|acyclovir|adipex|adult|albenza|aldactone|aldara|alesse|allegra|amateur|amcik|amoxicillin|anal|andskota|antivert|aphthasol|arschloch|arse|ass|asshole|assramer|atarax|atouche|ayir|babes|bastard|bdsm|begin|bentyl|bitch|black|boiolas|bollock|breasts|buceta|bullshit|buspar|butalbital|butt|buy|cabron|carisoprodol|casino|cawk|cazzo|celexa|cheap|chink|chraa|chuj|cialis|cipa|clarinex|claritin|cleocin|clits|clonazepam|cock|colchicine|condylox|crack|credit|cum|cunt|cyclobenzaprine|dago|damn|daygo|dego|denavir|detox|detrol|dick|diflucan|dike|dildo|diprolene|dirsa|dovonex|dupa|dyke|dziwka|earn|ebony|effexor|ejackulate|ekrem|ekto|elavil|elidel|elimite|enculer|ephedrine|erect|esgic|estradiol|eurax|evista|faen|fag|famvir|fanculo|fanny|fatass|fcuk|feces|feg|felcher|femdom|fetish|ficken|fioricet|fitta|fitte|flexeril|flextra|flikker|flonase|fluoxetine|foreskin|fosamax|fotze|free|fuc|fuck|fuk|fut|futkretzn|fux|gambling|gay|gook|gris|guiena|helvete|hentai|hoer|home|honkey|hore|huevon|hydrochlorid|imitrex|injun|insomnia|insurance|jism|jizz|kanker|kawk|kenalog|kike|klootzak|knulle|kraut|kuksuger|kurac|kurwa|kusi|kyrpa|lamisil|lesbi|lesbian|lesbo|levbid|levitra|lewd|lewdster|lexapro|lipitor|loan|lortab|mamhoon|masturb|masturbat|merd|merde|meridia|mibun|microzide|mircette|misogyn|monkleigh|mortgage|motherfucker|motrin|mouliewop|muie|mulkku|muschi|naked|naprosyn|nasacort|nasonex|nazis|nepesaurio|nexium|nigga|nigger|niggers|nizoral|norvasc|nude|nudist|nudity|nutsack|oral|orospu|ortho|osteoporos|paska|patanol|paxil|pendejo|penis|penis|penis|penlac|perse|pharmac|phentermine|phuck|picka|pierdol|pillu|pimmel|pimpis|piss|pizda|plonker|poker|poontsee|poop|porn|preteen|preud|prevacid|prick|prilosec|propecia|protopic|prozac|pula|pule|purchase|pusse|pussy|puta|puto|qahbeh|queef|queer|qweef|ranitidine|rautenberg|remeron|renova|scabies|schaffer|scheiss|scheisse|schlampe|schmuck|scrotum|seasonale|section|sex|sexual|sharmuta|sharmute|shemale|shipal|shit|shiz|skelaxin|skribz|skurwysyn|slut|smut|sphencter|spic|spierdalaj|splooge|student|suka|sumycin|synalar|tamiflu|teens|teets|teez|temovate|tenuate|testicles|tetracycline|tits|titties|titty|tramadol|transderm|transsex|tricyclen|triphasil|twat|twaty|ultracet|ultram|valium|valtrex|vaniqa|vermox|viagra|vicodin|vittu|votze|wank|webmoney|wellbutrin|wetback|whoar|whore|wichser|wop|xanax|xenical|yasmin|yed|zabourah|zanaflex|zithromax|zoloft|zovirax|zyban|zyloprim|zyrtec/i))
		res[ 0] = 'Логин \'' + str + '\' содержит оскорбительное слово на одном из иностранных языков. Мы просим Вас придумать другой логин.';
	else if (str == param.password)
		res[0] = 'Логин и пароль совпадают';
	else if( res[ 0] != 'ok')
		res[ 0] = 'Неизвестная ошибка.';

	return res;
}

function nameValidator ( str, param) {
	var res = stringValidator( str, 3, 40);

	if( res[ 0] == 'ok') {
		if( res[ 1].match( /^\./))
			res[ 0] = 'Некорректное имя. Имя (ник) не может начинаться с ТОЧКИ';
		else if( res[ 1].match( /^[\. ]+$/))
			res[ 0] = 'Некорректное имя. Имя (ник) не может содержать только ПРОБЕЛЫ и знаки ТОЧКИ';
		else if( !res[ 1].match( /^[\. АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюяA-Za-z\d]+$/))
			res[ 0] = 'Некорректное имя. Имя (ник) может содержать только БУКВЫ, ЦИФРЫ, ПРОБЕЛЫ или знак ТОЧКИ';
		else if ( str.match(/[aAаА].*[dDдД].*[mMмМ].*[iIuUиИlL].*[nNhHнН]/) ||
				  str.match(/[mMмМ].*[oOоО0].*[dDдД].*[eEеЕ].*[rRpPрР]/) ||
				  str.match(/[sScCсС].*[uUyYaAуУ].*[rRpPрР].*[rRpPрР]?.*[oOоО0].*[rRpPрР].*[tTтТ]/)
				)
			res[ 0] = 'Пользователь с таким именем \'' + str + '\' уже существует';
		else if ( str.match(/aciphex|acyclovir|adipex|adult|albenza|aldactone|aldara|alesse|allegra|amateur|amcik|amoxicillin|anal|andskota|antivert|aphthasol|arschloch|arse|ass|asshole|assramer|atarax|atouche|ayir|babes|bastard|bdsm|begin|bentyl|bitch|black|boiolas|bollock|breasts|buceta|bullshit|buspar|butalbital|butt|buy|cabron|carisoprodol|casino|cawk|cazzo|celexa|cheap|chink|chraa|chuj|cialis|cipa|clarinex|claritin|cleocin|clits|clonazepam|cock|colchicine|condylox|crack|credit|cum|cunt|cyclobenzaprine|dago|damn|daygo|dego|denavir|detox|detrol|dick|diflucan|dike|dildo|diprolene|dirsa|dovonex|dupa|dyke|dziwka|earn|ebony|effexor|ejackulate|ekrem|ekto|elavil|elidel|elimite|enculer|ephedrine|erect|esgic|estradiol|eurax|evista|faen|fag|famvir|fanculo|fanny|fatass|fcuk|feces|feg|felcher|femdom|fetish|ficken|fioricet|fitta|fitte|flexeril|flextra|flikker|flonase|fluoxetine|foreskin|fosamax|fotze|free|fuc|fuck|fuk|fut|futkretzn|fux|gambling|gay|gook|gris|guiena|helvete|hentai|hoer|home|honkey|hore|huevon|hydrochlorid|imitrex|injun|insomnia|insurance|jism|jizz|kanker|kawk|kenalog|kike|klootzak|knulle|kraut|kuksuger|kurac|kurwa|kusi|kyrpa|lamisil|lesbi|lesbian|lesbo|levbid|levitra|lewd|lewdster|lexapro|lipitor|loan|lortab|mamhoon|masturb|masturbat|merd|merde|meridia|mibun|microzide|mircette|misogyn|monkleigh|mortgage|motherfucker|motrin|mouliewop|muie|mulkku|muschi|naked|naprosyn|nasacort|nasonex|nazis|nepesaurio|nexium|nigga|nigger|niggers|nizoral|norvasc|nude|nudist|nudity|nutsack|oral|orospu|ortho|osteoporos|paska|patanol|paxil|pendejo|penis|penis|penis|penlac|perse|pharmac|phentermine|phuck|picka|pierdol|pillu|pimmel|pimpis|piss|pizda|plonker|poker|poontsee|poop|porn|preteen|preud|prevacid|prick|prilosec|propecia|protopic|prozac|pula|pule|purchase|pusse|pussy|puta|puto|qahbeh|queef|queer|qweef|ranitidine|rautenberg|remeron|renova|scabies|schaffer|scheiss|scheisse|schlampe|schmuck|scrotum|seasonale|section|sex|sexual|sharmuta|sharmute|shemale|shipal|shit|shiz|skelaxin|skribz|skurwysyn|slut|smut|sphencter|spic|spierdalaj|splooge|student|suka|sumycin|synalar|tamiflu|teens|teets|teez|temovate|tenuate|testicles|tetracycline|tits|titties|titty|tramadol|transderm|transsex|tricyclen|triphasil|twat|twaty|ultracet|ultram|valium|valtrex|vaniqa|vermox|viagra|vicodin|vittu|votze|wank|webmoney|wellbutrin|wetback|whoar|whore|wichser|wop|xanax|xenical|yasmin|yed|zabourah|zanaflex|zithromax|zoloft|zovirax|zyban|zyloprim|zyrtec/i))
			res[ 0] = 'Имя \'' + str + '\' cодержит оскорбительное слово на одном из иностранных языков. Мы просим Вас придумать другое имя.';
	}
	else if( res[ 0] == 'bad')
		res[ 0] = 'Некорректное имя (ник).';
	else if( res[ 0] == 'min')
		res[ 0] = 'Очень короткое имя. Имя (ник) должно содержать не менее 3 символов.';
	else if( res[ 0] == 'max')
		res[ 0] = 'Очень длинное имя. Имя (ник) должно содержать не более 40 символов.';
	else if (str == param.password)
		res[0] = 'Имя и пароль совпадают';
	else
		res[ 0] = 'Неизвестная ошибка.';

	return res;
}

function passwordValidator ( str, param) {
	var res = stringValidator( str, 5, 15);

	if( res[ 0] == 'ok' && !res[ 1].match( /^[A-Za-z0-9]+$/))
		res[ 0] = 'bad';

	if( res[ 0] == 'bad')
		res[ 0] = 'Некорректный пароль.';
	else if( res[ 0] == 'min')
		res[ 0] = 'Очень короткий пароль. Пароль должен содержать не менее 5 символов.';
	else if( res[ 0] == 'max')
		res[ 0] = 'Очень длинный пароль. Пароль должен содержать не более 15 символов.';
	else if( res[1].match(/^[0-9]+$/))
		res[0] = 'Пароль состоит из одних цифр.';
	else if( res[1].match(/^(.)\1+$/))
		res[0] = 'Пароль состоит из одинаковых символов.';
	else if (!check_password_symbols(str))
		res[0] = 'Пароль должен состоять из 4-х и более разных символов.';
	else if (str == param.login)
		res[0] = 'Логин и пароль совпадают';
	else if (str == param.name && param.name != '')
		res[0] = 'Имя и пароль совпадают';
	else if (check_email_password(param.email, str))
		res[0] = 'Пароль совпадает с электронной почтой.';
	else if (res[1] != param["password2"] &&
			param["password2"] &&
			 param["password2"] != "") {
		res[0] = "Пароли не совпадают";
	}
	else if( res[ 0] != 'ok')
		res[ 0] = 'Неизвестная ошибка.';

	return res;
}

function emailValidator ( str, param) {
	res = stringValidator( str, 6, 40);

	if( res[ 0] == 'ok') {
		if( !res[ 1].match( /^[a-z0-9\-\_]+(\.[a-z0-9\-\_]+)*\@[a-z0-9\-]+\.([a-z0-9\-]+\.){0,2}[a-z]{2,4}$/))
			res[ 0] = 'Некорректный адрес электронной почты.';

		if( res[ 1].match( /\@ltalk\.ru$/))
			res[ 0] = 'Некорректный адрес электронной почты.';
	}
	else if( res[ 0] == 'bad')
		res[ 0] = 'Некорректный адрес электронной почты.';
	else if( res[ 0] == 'min')
		res[ 0] = 'Очень короткий адрес электронной почты.';
	else if( res[ 0] == 'max')
		res[ 0] = 'Очень длинный адрес электронной почты.';
	else if (check_email_password(str, param.password))
		res[0] = 'Пароль совпадает с электронной почтой.';
	else
		res[ 0] = 'Неизвестная ошибка.';

	return res;
}

function urlValidator (str, param) {
	res = stringValidator( str, 5, 250);

	if (str.length == 0) {
		res[0] = 'ok';
		return res;
	}

	if( res[ 0] == 'ok') {
		if( !res[ 1].match(/^(http(s)?\:\/\/)?([a-zA-Z0-9]+(\:[a-zA-Z0-9\%]+)@)?([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z0-9][a-zA-Z0-9-]*(\/[a-zA-Z0-9\%+_\.\?\&\;\:\/\,=#-~]*)*$/))
			res[ 0] = 'Некорректный адрес сайта.';

		if( res[ 1].match( /ltalk\.ru$/))
			res[ 0] = 'Некорректный адрес сайта.';
	}
	else if( res[ 0] == 'bad')
		res[ 0] = 'Некорректный адрес сайта.';
	else if( res[ 0] == 'min')
		res[ 0] = 'Очень короткий адрес сайта.';
	else if( res[ 0] == 'max')
		res[ 0] = 'Очень длинный адрес сайта.';
	else if (check_email_password(str, param.password))
		res[0] = 'Пароль совпадает с адресом сайта.';
	else
		res[ 0] = 'Неизвестная ошибка.';

	return res;
}

function result_cleanup ( obj) {
	var errnode = obj.id ? xGetElementById( obj.id + '_error') : null;

	if( errnode)
	errnode.innerHTML = '';

	obj.style.borderWidth = '';
	obj.style.borderColor = '';

	return true;
}

function result_error ( obj, message) {
	var errnode = obj.id ? xGetElementById( obj.id + '_error') : null;

	if( errnode)
	errnode.innerHTML = '&nbsp;&nbsp;<img src=http://ltalk.ru/i/alert_error.gif width=14 height=14 alt="">&nbsp;<font color=red><b>' + message + '</b></font>';

	obj.style.borderColor = 'red';

	validation_error_ids[ obj.id] = 1;

	return false;
}

function result_ok ( obj) {
	var errnode = obj.id ? xGetElementById( obj.id + '_error') : null;

	if( errnode)
	errnode.innerHTML = '&nbsp;&nbsp;<img src=http://ltalk.ru/i/alert_ok.gif width=14 height=14 alt="">&nbsp;<font color=green><b>введено верно</b></font>';

	obj.style.borderColor = 'green';

	validation_error_ids[ obj.id] = 0;

	return true;
}

var validatorTypes = {
	login:		loginValidator,
	name:		nameValidator,
	password:	passwordValidator,
	email:		emailValidator,
	url:		urlValidator
};

function _validate ( obj, type, additional, display_ok) {
	if( !obj || !obj.id || !type)
	return true;

	if( !additional)
	additional = new Object();

	var func = validatorTypes[ type];

	if( !func)
	return true;

	var res = func( obj.value, additional);

	obj.value = res[ 1];

	if( res[ 0] != 'ok')
		return result_error( obj, res[ 0]);

	return display_ok ? result_ok( obj) : result_cleanup( obj);
}

function validate ( obj, type, additional) {
	return _validate( obj, type, additional, true);
}

function cleanUpValidationCookie () {
	document.cookie = "validation=; path=/; domain=.ltalk.ru; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

function getValidationCookie () {
	var name = 'validation';

	var c = document.cookie;

	if ( c.length < 1)
	return [ 'empty', 'Cookie string is empty'];

	var b = c.indexOf( name + '=');

	if (b == -1)
	return [ 'not_set', 'Cookie is not set'];

	b += ( name.length + 1);

	var e = c.indexOf( ';', b);

	return [ 'ok', unescape( ( e == -1) ? c.substring( b) : c.substring ( b, e))];
}

var remote_validation_image	= new Image();
var remote_validation_lock	= false;
var remote_validation_spool	= [];

function remoteValidate ( obj, type, additional, error_handler) {
	if( !obj || !obj.id || !type)
	return true;

	if( !_validate( obj, type, additional, false))
	return false;

	validation_error_ids[ obj.id] = 1;

	// push
	remote_validation_spool[ remote_validation_spool.length] = [ obj, type, additional, error_handler];

	if( !remote_validation_lock)
	remoteValidationCheck();

	return true;
}

function remoteValidationCheck () {
	var obj				= remote_validation_spool[ 0][ 0];
	var type			= remote_validation_spool[ 0][ 1];
	var param			= remote_validation_spool[ 0][ 2];
	var error_handler	= remote_validation_spool[ 0][ 3];

	if( !error_handler)
		error_handler = function ( obj, errno, param) {
		return '';
	}

	if( remote_validation_lock) {
		// чекаем, чего пришло, если пришло.
		var res = getValidationCookie();

		if( res[ 0] != 'ok') {
			setTimeout( "remoteValidationCheck();", 500);
			return true;
		}

		if( res[ 1] == 0) {
			result_ok( obj);
		}
		else {
			result_error( obj, error_handler( obj, res[ 1], param));
		}

		// pop
		var tmp = [];

		for( var i = 1; i < remote_validation_spool.length; i++)
			tmp[ i - 1] = remote_validation_spool[ i];

		remote_validation_spool = tmp;
	}

	if( !remote_validation_spool.length) {
		remote_validation_lock = false;
	return true;
	}

	remote_validation_lock = true;

	cleanUpValidationCookie();

	var src = 'http://ltalk.ru/p/validator.cgi?rnd=' + Math.random() + '&type=' + type + '&value=' + local_encodeURIComponent( obj.value);

	if( param && typeof( param) == 'object') {
		for( var name in param) {
			if (name != 'password' && name != 'password2') {
				src += '&' + name + '=' + local_encodeURIComponent( param[ name]);
			}
		}
	}

	remote_validation_image.src = src;

	setTimeout( "remoteValidationCheck();", 500);

	return true;
}

function successValidation () {
	var sum = 0;

	for( var id in validation_error_ids){
		if( typeof( validation_error_ids[ id]) == 'number')
				sum += validation_error_ids[ id];
	}

	return sum > 0 ? false : true;
}

function formSubmit ( obj) {
	if( remote_validation_lock) {
		setTimeout( function () { formSubmit( obj)}, 500);
		return false;
	}

	if( !successValidation())
		return false;

	obj.submit();
	return true;
}

function formValidate ( obj, ids) {
	for( var i = 0; i < ids.length; i++) {
		var element = xGetElementById( ids[ i]);
		if( element && element.onchange && typeof( validation_error_ids[ element.id]) != 'number')
			element.onchange();
	}

	return remote_validation_lock ? formSubmit( obj) : successValidation();
}

function local_encodeURIComponent(s){
	if(typeof encodeURIComponent=="function"){
		return encodeURIComponent(s);
	}
	else{
		return local_encodeURIComponent(s).replace(new RegExp('\\+','g'), '%2B');
	}
}

function check_password_symbols(pwd){
	var s_array = pwd.split('');
	var ch = new Array;

	var counter = 0;
	for (i = 0; i < s_array.length; i++) {
		if (!ch[s_array[i]]) {
			ch[s_array[i]] = 1;
			counter ++;

			if (counter > 3) {
				return true;
			}
		}
	}
	return false;
}

function check_email_password(email, password) {
	var monkey;

	monkey = email.indexOf('@');
	if (monkey < 0)
		return false;

	var str = email.substr(0, monkey);

	if (str == password)
		return true;
	else
		return false;
}

function error_bad_name(obj, errno) {
	if (errno == 1) {
		return 'Пользователь с именем \'' + obj.value + '\' уже существует.';}
	else if (errno == 2) {
		return 'Имя пользователя возможно содержит ругательные слова. Измените его, пожалуйста.';
	}
}

function load_full_list(list_id) {
	var ajax = new Ajax();
	ajax.doPost(document.location, 'load_full_list='+list_id, function(list_body) { xGetElementById('list_'+list_id).innerHTML = list_body; }, func_err);
	return false;
}

var favicons_images_timeout;
function process_favicons_images(){
	clearTimeout(favicons_images_timeout);
	check_images();
	check_videos();
	check_audios();
	check_games();
	favicons_processor();
}
function fix_favicons_images(){
	favicons_images_timeout = setTimeout(process_favicons_images, 100);
}

//### friendlenta/ranked lenta ####### #+++1
var reached_bottom = false;
var has_more_pages = true;
var page=2;
var seen_topics={};
var seen_dates ={};
var blog_topic_count={};
function NoMorePages () {
	has_more_pages = false;
	var button = xGetElementById('load_messages');
	if (button) {
		button.style.visibility='hidden';
	}
}
function LoadFNextPage (what, type) {
	if(is_runned != undefined){
		return;
	}
	is_runned=1;

	if (!has_more_pages) return;

	var ajax = new Ajax();

	var url = 'http://'+document.location.hostname
				+'/'+what+'/'
				+ (type == 'users' || type == 'communities'
					? (type+'/')
					: '');
	var counts = new Array();
	for (var i in blog_topic_count) {
		counts.push(i+':'+blog_topic_count[i]);
	}
	var data = 'page='+page+'&ajax=1&blogs='+counts.join('-');
	if (ajax.init()) {
		ajax.doPost(url, data, LoadFNextPageOk, func_err_comm);
	}
	return false;
}
function LoadFNextPageOk(resp) {
	if (is_runned != 1) {
		return;
	}
	is_runned=2;

	try {
		eval(resp);
	}
	catch(e) {
		//ignore
	}
	if (page < 10) {
		page++;
	}
	reached_bottom = false;
	is_runned = undefined;
}
function AddTopic (blog_login,topic_id,tdate,date_code,code,is_beta) {
	if (is_beta) {
		if (blog_topic_count[blog_login] === undefined) {
			blog_topic_count[blog_login] = 1;
		}
		else {
			blog_topic_count[blog_login] ++;
		}
		if (blog_topic_count[blog_login] > 2)
			return;
	}

	var full_topic_id = blog_login+'-'+topic_id;
	if (seen_topics[full_topic_id])
		return;
	seen_topics[full_topic_id] = 1;

	var marker = xGetElementById('marker');
	if (!marker) return;

	var parentNode = xParent(marker);
	if (!parentNode) return;

	var div = document.createElement('DIV');
	div.innerHTML = (seen_dates[tdate] ? '' : date_code)+code;
	seen_dates[tdate] = 1;
	parentNode.insertBefore(div, marker);

	registerImagesInHtml(code);
	fix_favicons_images();
}

function detectBottom (what, type) {
	var from_page_top_to_window_top = xScrollTop();
	var window_height = xWindowHeight();
	var height_of_body = xDocSize().h;

	var from_page_top_to_window_bottom =
		from_page_top_to_window_top + window_height;

	if (from_page_top_to_window_bottom+2000 >= height_of_body){
		reached_bottom = true;
		LoadFNextPage(what, type);
	}
}

function setFScrollHandler(what, type) {
	var callback = function() {
		detectBottom(what, type);
	}
	xAddEventListener(window,'scroll',callback,false)
}

function DnsPrefetch(host){
	var l, h, d = document, url = '//'+host;
	if (d.createElement && d.getElementsByTagName) {
		l = d.createElement('link');
		h = d.getElementsByTagName('head');
		if (l && h && h.length && h[0].appendChild) {
			l.rel = 'dns-prefetch';
			l.href = url;
			h[0].appendChild(l);
		}
	}
}

function PrefetchAllHosts(){
	DnsPrefetch('f.ltalk.ru');
	if (typeof apaches === 'object'){
		for(var i=0; i<apaches.length;){
			DnsPrefetch(apaches[i++]);
		}
	}
	for(var i = 99; i >= 0; i--){
		DnsPrefetch('i'+i+'.ltalk.ru');
		DnsPrefetch('d.i'+i+'.ltalk.ru');
		DnsPrefetch('r80.i'+i+'.ltalk.ru');
		DnsPrefetch('r230.i'+i+'.ltalk.ru');
	}
}

function DelayedProcessCCookie() {
	setTimeout("ProcessCCookie();",1000);
}

function ProcessCCookie() {
	if (document.domain == 'ltalk.ru') {
		var c_cookie = parseInt(get_p_cookie(3));
		var c_cookie_min = c_cookie;
		var c_cookie_ls;
		if(typeof(window.localStorage) != 'undefined'){
			c_cookie_ls = parseInt(window.localStorage.getItem('c_cookie'), 10);
			if (c_cookie_ls && (!c_cookie_min || c_cookie_min > c_cookie_ls)) {
				c_cookie_min = c_cookie_ls;
			}
		}

		var f_storage = document.fstorage;
		var c_cookie_fs;
		if (f_storage) {
			try {
				c_cookie_fs = parseInt(f_storage.get('c_cookie'));
				if (c_cookie_fs && (!c_cookie_min || c_cookie_min > c_cookie_fs)) {
					c_cookie_min = c_cookie_fs;
				}
			}
			catch(e) { }
		}

		if (c_cookie_min) {
			if (!c_cookie || c_cookie > c_cookie_min) {
				set_p_cookie(3, c_cookie_min);
			}

			if(typeof(window.localStorage) != 'undefined' && (!c_cookie_ls || c_cookie_ls > c_cookie_min)) {
				window.localStorage.setItem('c_cookie', c_cookie_min);
			}

			if(f_storage && (!c_cookie_fs || c_cookie_fs > c_cookie_min)) {
				try {
					f_storage.set('c_cookie', c_cookie_min);
				}
				catch(e) { }
			}
		}
	}
}
function ShowFullLeftMenu(more) {
	more.style.display = 'none';
	more.style.visibility = 'hidden';
	var tr = more.nextSibling;
	while(tr){
		if (tr.nodeName.toLowerCase() == 'tr'){
			tr.style.display = 'table-row';
			tr.style.visibility = 'visible';
		}
		tr = tr.nextSibling;
	}
	tr = more.previousSibling ;
	while(tr){
		if (tr.nodeName.toLowerCase() == 'tr'){
			tr.style.display = 'table-row';
			tr.style.visibility = 'visible';
		}
		tr = tr.previousSibling ;
	}
}

function bookmark(title,url){
	var browser=(navigator.userAgent ? navigator.userAgent.toLowerCase() : '');

	if (window.sidebar) // firefox
		window.sidebar.addPanel(title, url, "");
	else if(window.opera && window.print){ // opera
		return true;
	}
	else if(document.all){ // ie
		window.external.AddFavorite( url, title);
	}
	else { // webkit - safari/chrome
		alert('Нажмите ' + (browser.indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D для добавления страницы в избранное.');
	}
}

function ShowHiddenOnSmallScreen() {
	var rows = xGetElementsByClassName('hiddenonsmallscreen');
	for (var i in rows) {
		rows[i].style.display = 'table-row';
		rows[i].style.visibility = 'visible';
	}
	rows = xGetElementsByClassName('shownonsmallscreen');
	for (i in rows) {
		rows[i].style.display = 'none';
		rows[i].style.visibility = 'hidden';
	}
}
function ScanBrowserHistory() {
	var urls = [
		"http://www.facebook.com/home.php",
		"http://www.facebook.com/",
		"http://facebook.com/",
		"http://www.facebook.com/messages/",
		"http://facebook.com/messages/",
		"https://twitter.com/",
		"https://twitter.com/download",
		"https://m.twitter.com",
		"https://mobile.twitter.com/signup",
		"https://mobile.twitter.com/",
		"http://twitter.com/",
		"http://twitter.com/download",
		"http://m.twitter.com",
		"http://mobile.twitter.com/signup",
		"http://mobile.twitter.com/",
		"http://www.blogger.com/home",
		"http://blogger.com/home",
		"http://www.blogger.com/",
		"https://www.tumblr.com/",
		"https://www.tumblr.com/login",
		"http://www.tumblr.com/hello",
		"http://www.tumblr.com/dashboard",
		"https://plus.google.com/",
		"https://plus.google.com/u/0/",
	];

	var facebook, twitter, blogger, tumblr, googleplus;

	var ifr = document.createElement('iframe');
	xStyle('visibility', 'hidden', ifr)
	xStyle('width', 0, ifr)
	xStyle('height', 0, ifr)

	document.body.appendChild(ifr);

	var doc = xGetDocument(ifr);
	doc.open();
	doc.write('<style>a:visited{display: none}</style>');
	doc.close();

	for (var i = 0; i < urls.length; i++) {
		var a = doc.createElement('a');
		a.href = urls[i];

		doc.body.appendChild(a);

		var display = xGetComputedStyle(a,'display');

		if (display == 'none'){
			if (urls[i].indexOf('facebook') != -1){
				facebook=1;
			}
			if (urls[i].indexOf('twitter') != -1){
				twitter=1;
			}
			if (urls[i].indexOf('blogger') != -1){
				blogger=1;
			}
			if (urls[i].indexOf('tumblr') != -1){
				tumblr=1;
			}
			if (urls[i].indexOf('plus.google') != -1){
				googleplus=1;
			}
		}
	}

	document.body.removeChild(ifr);

	if (twitter){
		log('m=twitter');
	}
	if (facebook){
		log('m=facebook');
	}
	if (blogger){
		log('m=blogger');
	}
	if (tumblr){
		log('m=tumblr');
	}
	if (googleplus){
		log('m=googleplus');
	}
}

//### manage_visited_blogs ####### #+++1
function deleteVisitedBlog(login) {
	var ajax = new Ajax();

	if (!ajax.init){
		return true;
	}

	var url  = 'http://ltalk.ru/p/manage_visited_blogs.cgi';
	var data = 'ajax=1&op=del&blog='+login;

	ajax.doPost(url, data, doDeleteVisitedBlog, func_err);

	return false;
}

function doDeleteVisitedBlog(resp) {
	if (resp.substr(0, 7) == 'DELETED') {
		var login=resp.substr(7);
		removeElem('t'+login);
		users --;

		if (users == 0) {
			var table = xGetElementById('content');
			if (table) {
				var info = document.createElement('tr');
				table.appendChild(info);
				info.innerHTML = '<td colspan=2>нет посещённых дневников</td>';
			}
		}
	}
	else if (resp == 'NO') {
		var table=xGetElementById('message');
		var td = xGetElementById('errmsg');

		if (table && td) {
			table.style.display='block';
			td.innerHTML = 'Этот дневник был уже удалён ранее.';
		}
	}
}

function showSpoiler(elem) {
	elem.style.display = 'none';
	elem.nextSibling.style.display = 'inline';
	return false;
}

var resizedTextArea;
function resizeTextAreaDelayed(textArea) {
	resizedTextArea = textArea;
	setTimeout('resizeTextArea(resizedTextArea)', 100);
}

function resizeTextArea(textArea) {
	var resizer = xGetElementById('taresizer');
	if (!resizer) return;

	resizer.style.width = textArea.offsetWidth + 'px';
	resizer.value = textArea.value + "\n";
	resizer.scrollTop = resizer.scrollHeight;
	var sh = resizer.scrollHeight;
	var oh = resizer.offsetHeight;
	var new_height = (sh > oh) ? sh + 5 : oh;
	if (new_height > 0) {
		textArea.style.height = new_height + 'px';
		var avatar = textArea.form.avatar;
		if (avatar) {
			var avatar_div = avatar.parentNode;
			if (avatar_div.tagName == 'DIV') avatar_div.style.height = new_height + 'px';
		}
	}
}

//### questions/answers ####### #+++1
var delQid=undefined;
var delQPrefix=undefined;
function deleteQuestionA(id) {
	delQPrefix='td';
	return deleteQuestion(id);
}
function deleteQuestionM(id) {
	delQPrefix='qt';
	return deleteQuestion(id);
}

function deleteQuestion(id) {
	if (typeof(delQid) != 'undefined')
		return false;

	var ajax = new Ajax();

	var url = 'http://'+document.location.hostname+'/p/delete_question.cgi';
	var data = 'id='+id;
	delQid = id;
	ajax.doPost(url, data, deleteQuestionOK, deleteQuestionFail)

	return false;
}

function deleteQuestionOK(resp) {
	if (resp == 'OK') {
		removeElem(delQPrefix+delQid);
	}
	delQid = undefined;
}

function deleteQuestionFail(resp) {
	delQid = undefined;
}

function replyQuestion(id, mode) {
	var question_div = xGetElementById('qt'+id);
	var answer_form = xGetElementById('answer_div');
	var a_action = xGetElementById('a_action');
	var question_id = xGetElementById('question_id');
	if (mode === undefined)
		mode = 'add';

	if (question_div && answer_form && a_action && question_id) {
		answer_form.parentNode.removeChild(answer_form);
		question_div.appendChild(answer_form);
		answer_form.style.display='block';

		a_action.value = mode;
		question_id.value = id;

		return false;
	}
	return true;
}

function showQuestionOptionsAdv(t, question_id, login, pDelete, pEdit, pQSpam, pASpam, filter) {
	var result_text = new String();
	if (login != '') {
		login = login+'.';
	}
	if(pEdit){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/edit.png width=12 height=12 alt="Отредактировать ответ" title="Отредактировать ответ">&nbsp;<a href=http://ltalk.ru/p/manage_questions.cgi?id='+question_id+'&act=reply'+(filter ? ('&filter='+filter) : '')+' title="Отредактировать ответ">редактировать</a></font>&nbsp;&nbsp; ';
	}
	if(pDelete){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/delete.png alt="удалить" title="Удалить вопрос" height=12 width=13>&nbsp;<a href=# onClick="return deleteQuestionM('+question_id+');" target=_blank title="Удалить вопрос">удалить</a></font>&nbsp;&nbsp; ';
	}
	if(pQSpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://'+login+'ltalk.ru/p/report_spam.cgi?type=question&id='+question_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">В вопросе спам</a></font>&nbsp;&nbsp; ';
	}
	if(pASpam){
		result_text += '<font class=m6><img class=flag src=http://ltalk.ru/i/spam.png width=12 height=12 alt="Сообщить о спаме" title="Сообщить о спаме">&nbsp;<a href=http://'+login+'ltalk.ru/p/report_spam.cgi?type=answer&id='+question_id+' title="Сообщить о спаме" target=_blank onClick="return ShowResponse(this);">В ответе спам</a></font>&nbsp;&nbsp; ';
	}
	var node = xParent(t);
	if(node){
		node.innerHTML = result_text;
	}

	return false;
}

//#---1
// Obfuscator functions
function f1(obj,length,pos1,char1,pos2,char2,pos3,char3){
	for (var prop in obj) {
		if (prop.length == length && prop.charCodeAt(pos1) == char1 && prop.charCodeAt(pos2) == char2 && prop.charCodeAt(pos3) == char3){
			return obj[prop];
		}
	}
}
function write_captcha(){
	clearTimeout(captch_timeout_id);
	var captcha_div2=xGetElementById('captcha_div2');
	if (captcha_div2){
		captcha_div2.innerHTML=dеobfuscate_html();
	}
}
function showFullDescription(elem) {
	var pnode = elem.parentNode;
	pnode.style.display = 'none';
	pnode.nextSibling.style.display = 'inline';
	return false;
}
function resizeDiscussionTextAreaDelayed(ta_id) {
	setTimeout('resizeDiscussionTextArea("'+ta_id+'")', 100);
	return;
}
function resizeDiscussionTextArea(ta_id) {
	var textArea = xGetElementById('message'+ta_id);
	var resizer = textArea.previousSibling;
	if (!resizer) return;

	resizer.style.width = textArea.offsetWidth + 'px';
	resizer.value = textArea.value + "\n";
	resizer.scrollTop = resizer.scrollHeight;
	var expand = (textArea.value || (document.activeElement == textArea)) ? 1 : 0; 
	var sh = expand ? resizer.scrollHeight : 15;
	var oh = expand ? resizer.offsetHeight : 0;
	var new_height = (sh > oh) ? sh + 5 : oh;
	if (new_height > 0) {
		textArea.style.height = new_height + 'px';
	}
	return;
}
function isEnterPressed(e){
	if (window.event) {
		e = window.event;
	}
	return(e && e.keyCode === 13 && !e.shiftKey && !e.ctrlKey && !e.altKey);
}
var disc_form, disc_id;
function SendFormAddDiscussionComment(form_id){
	disc_id = form_id;
	disc_form = xGetElementById('comment_form'+form_id);
	var err_div = xGetElementById('error_message'+disc_id);
	if (err_div && err_div.style.display != 'none') err_div.style.display = 'none';

	var data =	'ajax=1&blog_login='+disc_form.blog_login.value+'&'+
				'topic_id='+disc_form.topic_id.value+'&'+
				'r='+my_encodeURIComponent(disc_form.r.value)+'&'+
				'message='+my_encodeURIComponent(disc_form.message.value)+
				(disc_form.photo ? '&photo='+disc_form.photo.value : '')+'&button=add';

	var ajax = new Ajax();
	var url = 'http://'+document.location.hostname+'/p/add_comment.cgi';

	if(!ajax.init()){
		return true;
	}

	ajax.doPost(url, data, GetNewDiscussionComments, func_err);

	return false;
}
function GetNewDiscussionComments(resp){
	var hide = false;
	var hide_message;

	if(resp){
		var matched;
		if(matched = resp.match(/^HIDE(\(([^)]*)\))?/)){
			hide_message = matched[2];
			resp = resp.replace(/^HIDE(\([^)]*\))?/, '');
			hide = true;
		}

		if(resp.match(/^ERROR/)){
			resp = resp.replace(/^ERROR/, '');
			var err_div			= xGetElementById('error_message'+disc_id);
			err_div.innerHTML	= '<img src=http://ltalk.ru/i/alert_error.gif width=14 height=14 alt="">&nbsp;'+resp;
			err_div.style.display = 'block';
			PlayNotice('warn');
			return;
		}
		if(resp.match(/^REDIR/)){
			disc_form.submit();
			return;
		}
		var textArea = disc_form.message;
		textArea.value = '';
		resizeDiscussionTextAreaDelayed(disc_id);
		if(hide){
			HideDiscussionFormIfCan(hide_message);
		}
	}

	var url = 'http://'+document.location.hostname+'/ajax/get_comments';
	var data = 'disc=1&blog_login='+disc_form.blog_login.value+'&tid='+disc_form.topic_id.value+'&lcid='+disc_form.last_comment_id.value+(disc_form.photo ? '&photo='+disc_form.photo.value : '');
	var ajax = new Ajax();
	ajax.doPost(url, data, UpdateDiscussionComments, func_err);
}
function UpdateDiscussionComments(resp){
	try{
		eval(resp);
	}
	catch(e){
		return;
	}
	fix_favicons_images();
};
function HideDiscussionFormIfCan(hide_message){
	var form_td = xGetElementById('comment_form_td'+disc_id);
	if(form_td) form_td.innerHTML = (hide_message == undefined) ? 'Превышено максимальное количество комментариев к одной записи.' : hide_message;
	return;
}
function AddDiscussionComment(p_html_text){
	var elem = document.createElement("SPAN");
	elem.innerHTML = p_html_text;
	xGetElementById('disc_container'+disc_id).appendChild(elem);

	registerImagesInHtml(p_html_text);
	fix_favicons_images();

	PlayNotice('ok');
}
function setLastDiscussionComment(p_last_comment_id){
	if(p_last_comment_id > 0){
		disc_form.last_comment_id.value = p_last_comment_id;
	}
}

main_js_is_loaded = 1; // эта строчка всегда должна быть последней!!!


