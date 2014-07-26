function init() {
	globals.avoidCache = {
		"base":		(new Date).getTime(),
		"dif":		0
	};

	globals.color = {
		"error":	'#FF0000',
		"ok":		'#000000'
	};

	globals.duration = {
		"motd":			90000,
		"diafimisi":		40000,
		"formaFyi":		3000,
		"ligoFyi":		2000,
		"mainFyi":		5000,
		"soundRep":		600,
		"errorIcon":		300
	};

	globals.timeDif -= parseInt((new Date).getTime() / 1000);

	globals.rankXroma = {
		"S":	2,
		"C":	3,
		"D":	4,
		"H":	5,
		"N":	6
	};
	globals.xromaDesc = {
		"S":	'μπαστούνια',
		"C":	'σπαθιά',
		"D":	'καρά',
		"H":	'κούπες',
		"N":	'άχροα'
	};
	globals.bazesDesc = {
		"6":	'έξι',
		"7":	'επτά',
		"8":	'οκτώ',
		"9":	'εννιά',
		"T":	'δέκα'
	};
	globals.rankFila = {
		"7":	1,
		"8":	2,
		"9":	3,
		"T":	4,
		"J":	5,
		"Q":	6,
		"K":	7,
		"A":	8
	};

	try {
		document.body.style.backgroundImage = 'url(' + globals.server +
			'images/background/' + globals.paraskinio + ')';
	} catch(e) {};

	setTimeout(function() {
		p = getelid('twitter');
		if (notSet(p)) { return; }

		var html = '';
		html += '<a href="https://twitter.com/prefadorosTT" target="_blank">' +
			'<img src="' + globals.server + 'images/external/twitter.png" ' +
			'alt="Ο «Πρεφαδόρος» στο twitter" style="height: 0.55cm; ' +
			'margin-right: 0.1cm;" /></a>';
		html += '<a target="_blank" href="http://www.facebook.com/groups/prefadoros">' +
			'<img src="' + globals.server + 'images/external/facebook.jpg" alt="" ' +
			'title="Ο «Πρεφαδόρος» στο Facebook" style="height: 0.55cm; ' +
			'margin-right: 0.1cm;" /></a>';
		p.innerHTML = html;
	}, 1000);

	setTimeout(function() {
		var p = getelid('donate');
		if (notSet(p)) { return; }

		// Το πλήκτρο δωρεάς συνοδεύεται από εικονίδιο το οποίο κατεβαίνει
		// από server της PayPal. Πολλές φορές, όμως, δεν κατέβαινε με
		// αποτέλεσμα να έχω χαμένη εικόνα. Για το λόγο αυτό το εικονίδιο
		// αντιγράφτηκε στον server του «Πρεφαδόρου».
		var img = 'https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif';
		var img = globals.server + 'images/external/donate.gif';

		p.innerHTML = '<form target="_blank" action="https://www.paypal.com/' +
				'cgi-bin/webscr" method="post">' +
			'<input type="hidden" name="cmd" value="_s-xclick">' +
			'<input type="hidden" name="hosted_button_id" value="7UGXKWGRM5TXU">' +
			'<input type="image" src="' + img + '" border="0" name="submit" ' +
				'title="Buy me a beer!" ' +
				'alt="PayPal - The safer, easier way to pay online!">' +
			'<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" ' +
				'width="1" height="1" />' +
			'</form>';
	}, 2000);

	setTimeout(function() {
		var p, html;

		p = getelid('googlePlus');
		if (isSet(p)) {
			html = '';

			html += '<g:plusone size="medium" style="padding-bottom: 0.1cm;"></g:plusone>';
			p.innerHTML = html;

			setTimeout(function() {
				window.___gcfg = {lang: 'el'};
				var po = document.createElement('script');
				po.type = 'text/javascript';
				po.async = true;
				po.src = 'https://apis.google.com/js/plusone.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(po, s);
			}, 1000);
		}
	}, 3000);
}

window.onload = function() {
	init();
}

function Request(page, asynch) {
	try { this.xhr = new XMLHttpRequest(); } catch(e) {
		try { this.xhr = new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) {
			try { this.xhr = new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {
				window.location = globals.server + 'error.php?minima=' +
					uri('new Request: failed');
				return null;
			}
		}
	}

	if (notSet(asynch)) { asynch = true; }
	this.page = page;
	this.xhr.open('POST', globals.server + page + '.php', asynch);

	this.send = function(data) {
		if (notSet(this.xhr)) { return; }

		if (notSet(data)) { data = ''; }
		else if (data != '') { data += '&'; }
		data += 'timeDif=' + globals.timeDif;
		data += '&avoidCache=' + globals.avoidCache.base + ':' + globals.avoidCache.dif++;

		this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		this.xhr.send(data);
	};

	this.getResponse = function() {
		if (notSet(this.xhr)) { return 'undefined Ajax request'; }
		if (notSet(this.xhr.status)) { return 'undefined Ajax returned status'; }
		if (this.xhr.status != 200) { return this.page + ' (status = ' + this.xhr.status + ')'; }
		if (notSet(this.xhr.responseText)) { return this.page + ': undefined Ajax response'; }

		return this.xhr.responseText;
	};
}

function sviseNode(x, stadiaka, stay) {
	if (notSet(stay)) { stay = false; }
	if (notSet(stadiaka) || (stadiaka <= 0)) {
		if (isSet(x)) {
			try {
				if (stay) { x.style.visibility = 'hidden'; }
				else { x.parentNode.removeChild(x); }
			} catch(e) {};
		}
		return;
	}

	var opacity = 100;
	var vima = parseInt(stadiaka / 10);
	if (notSet(vima) || (vima <= 0)) { vima = 120; }
	setTimeout(function() { sviseNodeVima(x, opacity, vima, stay); }, vima);
}

function sviseNodeVima(x, opacity, vima, stay) {
	if (notSet(x)) { return; }
	if (notSet(stay)) { stay = false; }
	if (opacity <= 0) { sviseNode(x, null, stay); return; }

	setOpacity(x, opacity);
	opacity -= 10;
	setTimeout(function() { sviseNodeVima(x, opacity, vima, stay); }, vima);
}

function setOpacity(div, opacity) {
	try { div.style.opacity = opacity / 100; } catch(e) {};
	try { div.filters.alpha.opacity = opacity; } catch(e) {};
}

function karfitsoma(id, img) {
	var x = getelid(id);
	if (notSet(x)) { return; }
	if (isSet(x.pineza) && x.pineza) {
		x.pineza = false;
		img.src = globals.server + 'images/pineza.png';
		img.title = 'Καρφίτσωμα';
	}
	else {
		x.pineza = true;
		img.src = globals.server + 'images/karfitsomeno.png';
		img.title = 'Καρφιτσωμένο';
	}
}

function isSet(x) {
	if (x === undefined) {
		return false;
	}

	if (x === null) {
		return false;
	}

	return true;
}

function notSet(x) {
	return(!isSet(x));
}

function getelid(id) {
	return(document.getElementById(id));
}

function currentTimestamp(db) {
	var x = new Date();
	if (isSet(db)) {
		 x = (x.getFullYear() * 10000000000) +
			((x.getMonth() + 1) * 100000000) +
			(x.getDate() * 1000000) +
			(x.getHours() * 10000) +
			(x.getMinutes() * 100) +
			x.getSeconds();
	}
	else {
		x = x.getTime();
	}

	return x;
}

function uri(s) {
	return(encodeURIComponent(s));
}

function isNum(x) {
	return (x.match(/^[0-9]+$/));
}

String.prototype.trim = function() {
	return (this.replace(/^\s+|\s+$/g,""));
}

String.prototype.ltrim = function() {
	return (this.replace(/^\s+/,""));
}

String.prototype.rtrim = function() {
	return (this.replace(/\s+$/,""));
}

function validEmail(email) {
	if (notSet(email)) {
		return false;
	}

	return email.match(/^[a-zA-Z0-9_\.-]+\@([a-zA-Z0-9-]+\.)+([a-zA-Z0-9]{2,4})+$/);
}

function fatalError(msg) {
	if (notSet(msg)) { msg = 'άγνωστο σφάλμα'; }
	location.href = globals.server + 'error.php?minima=' + uri(msg);
}

function mainFyi(msg, dur) {
	var fyi = getelid('mainFyi');
	if (notSet(fyi)) {
		return;
	}
	if (isSet(fyi.clearTimer)) {
		clearTimeout(fyi.clearTimer);
	}

	if (notSet(msg) || (msg === '')) {
		var visibility = 'hidden';
		msg = '&#8203;';
	}
	else {
		visibility = 'visible';
	}

	if (notSet(dur)) {
		dur = globals.duration.mainFyi;
	}

	fyi.innerHTML = msg;
	fyi.style.visibility = visibility;
	if (dur > 0) {
		fyi.clearTimer = setTimeout(function() {
			clearFyi(fyi);
		}, dur);
	}
}

function clearFyi(fyi) {
	try {
		fyi.innerHTML = '&nbsp;';
		fyi.style.visibility = 'hidden';
	} catch(e) {};
}

// Δέχεται ως παράμετρο ένα string που περιέχει λίστα από ήχους
// χωρισμένους με κόμμα, π.χ. "balothia,polivolo:500,:pistolia:1000"
// και τους παίζει τον έναν μετά τον άλλον με τις καθυστερήσεις
// που καθορίζονται με ":" σε microseconds.
 
function playSoundList(lista) {
	var tmima = lista.split(',');
	var melon = 0;
	for (var i = 0; i < tmima.length; i++) {
		var sd = tmima[i].split(':');
		switch (sd.length) {
		case 2:
			melon += parseInt(sd[1]);
		case 1:
			break;
		default:
			continue;
		}

		if (melon > 0) {
			setTimeout('playSound("' + sd[0] + '")', melon);
		}
		else {
			playSound(sd[0]);
		}
	}
}

// Η function "playSound" δέχεται ως παράμετρο το id κάποιου ηχητικού
// εφέ και παίζει τον αντίστοιχο ήχο. Οι ήχοι του ΔΚ βρίσκονται ως
// MP3 files στο lib/sounds directory της εφαρμογής και αρχικοποιούνται
// με το φόρτωμα της javascript βιβλιοθήκης "soundmanager.js" στο head
// section. Στο τέλος της βιβλιοθήκης έχω προσθέσει κώδικα που δημιουργεί
// τους ήχους και τους συσχετίζει με ids. Για να προσθέσω νέο ήχο στο ΔΚ,
// πρέπει να βάλω στο lib/sounds το αντίστοιχο MP3 file και να προσθέσω
// το αντίστοιχο κομμάτι κώδικα στο soundmanager.js source που βρίσκεται
// στο lib directory της εφαρμογής.

function playSound(ixos, vol) {
	if (notSet(window.soundManager)) {
		mainFyi('soundManager: not supported');
		return;
	}

	if (soundManager.prefaVolume == 0) {
		return;
	}

	var x = soundManager.getSoundById(ixos);
	if (notSet(x)) {
		return;
	}

	var tora = currentTimestamp();
	if ((tora - soundManager.prefaLast) < globals.duration.soundRep) {
		setTimeout(function() {
			playSound(ixos, vol);
		}, globals.duration.soundRep);
		return;
	}
	soundManager.prefaLast = tora;

	var v = (isSet(vol) ? vol : x.volume) * soundManager.prefaVolume;
	try {
		soundManager.play(ixos, {volume:v});
	}
	catch (e) {
		// alert('No Audio Support!');
	};
}

// Δέχεται ως παράμετρο κάποιο εικονίδιο και το αντικαθιστά με
// το εικονίδιο λάθους (κόκκινο "X") για ένα μικρό χρονικό διάστημα.
// αν επιθυμούμε περισσότερο διάστημε περνάμε ως δεύτερη παράμετρο
// έναν πολλαπλασιαστή διάρκειας, π.χ. 2, 3 κλπ.

function errorIcon(ico, siz, dur) {
	if (notSet(dur)) { dur = 1; }
	var oldSrc = ico.src;
	ico.src = globals.server + 'images/X.png';
	if (isSet(siz) && isSet(ico.style) && isSet(ico.style.width)) {
		var w = ico.style.width;
		ico.style.width = siz;
	}
	else {
		w = null;
	}
	setTimeout(function() {
		try {
			ico.src = oldSrc;
			if (isSet(w)) {
				ico.style.width = w;
			}
		} catch(e) {};
	}, globals.duration.errorIcon * dur);
}

function logout() {
	var req = new Request('account/logout', false);
	req.send();
	var rsp = req.getResponse();
	if (rsp) {
		mainFyi(rsp);
		return false;
	}

	location.href = globals.server + 'index.php';
	return false;
}

function offline() {
	var req = new Request('account/logout', false);
	req.send('offlineOnly=yes');
	var rsp = req.getResponse();
	if (rsp) { mainFyi(rsp); }
}

// Η παρακάτω function δέχεται ως παράμετρο ένα DOM node (object)
// και επιστρέφει αντικείμενο με πεδία "x" και "y" που δείχνουν
// τις απόλυτες συντεταγμένες του αρχικού αντικειμένου στο
// παράθυρο του browser.

function apolitaXY(obj) {
	var XY = new Object;
	XY.x = 0;
	XY.y = 0;

	while (obj.offsetParent) {
		XY.x += obj.offsetLeft;
		XY.y += obj.offsetTop;
		obj = obj.offsetParent;
	}

	return(XY);
}

function mouseXY(e){ 
	if(isSet(e.pageX)) {
		return {x:e.pageX, y:e.pageY}; 
	}

	return {
		x:e.clientX + document.body.scrollLeft - document.body.clientLeft, 
		y:e.clientY + document.body.scrollTop  - document.body.clientTop 
	};
}

function emfanesAfanesHTML() {
	return ' onmouseover="emfanesAfanes(this, true);" ' +
		' onmouseout="emfanesAfanes(this, false);" ';
}

function emfanesAfanes(obj, emfanes) {
	if (isSet(obj.style)) {
		if (emfanes) {
			if (isSet(obj.style.backgroundColor)) {
				obj.oldBC = obj.style.backgroundColor;
				obj.style.backgroundColor = '#FFFF66';
			}
			if (isSet(obj.style.opacity)) {
				obj.oldOPC = obj.style.opacity;
				obj.style.opacity = 1;
			}
			if (isSet(obj.filters) && isSet(obj.filters.alpha) &&
				isSet(obj.filters.alpha.opacity)) {
				obj.oldALP = obj.filters.alpha.opacity;
				obj.filters.alpha.opacity = 100;
			}
		}
		else {
			if (isSet(obj.oldBC)) {
				obj.style.backgroundColor = obj.oldBC;
			}
			if (isSet(obj.oldOPC)) {
				obj.style.opacity = obj.oldOPC;
			}
			if (isSet(obj.oldALP)) {
				obj.filters.alpha.opacity = obj.oldALP;
			}
		}
	}
}

function stopProp(e) {
	if (notSet(e)) {
		e = window.event;
	}
	if (notSet(e)) {
		return;
	}

	e.cancelBubble = true;
	if (isSet(e.stopPropagation)) {
		e.stopPropagation();
	}
}

function exitChild() {
	var w = window.opener;
	if (isSet(w)) {
		window.close();
	}
	else {
		location.href = globals.server + 'index.php';
	}
	return false;
}

function strPote(ts) {
	var tora = parseInt(currentTimestamp() / 1000);
	var dif = tora - ts;
	if (dif < 60) {
		return 'τώρα';
	}
	if (dif < 3600) {
		var x = parseInt(dif / 60);
		return 'πριν ' + x + ' λεπτ' + (x < 2 ? 'ό' : 'ά');
	}
	if (dif < 86400) {
		var x = parseInt(dif / 3600);
		return 'πριν ' + x + ' ώρ' + (x < 2 ? 'α' : 'ες');
	}
	
	ts = new Date(ts * 1000);
	return strDate(ts) + ', ' + strTime(ts);
}

function strDate(d) {
	var s = '';

	var x = d.getDate();
	if (x < 10) { s += '0'; } s += x;
	s += '/';

	x = d.getMonth() + 1;
	if (x < 10) { s += '0'; } s += x;
	s += '/'; 

	x = d.getFullYear();
	if (x < 2000) {
		s += x;
	}
	else {
		x %= 100;
		if (x < 10) { s += '0'; } s += x;
	}

	return s;
}

function strTime(d, sec) {
	var s = '';

	var x = d.getHours();
	if (x < 10) { s += '0'; } s += x;
	s += ':';

	x = d.getMinutes();
	if (x < 10) { s += '0'; } s += x;

	if (isSet(sec) && sec) {
		s += ':'; 
		x = d.getSeconds();
		if (x < 10) { s += '0'; } s += x;
	}

	return s;
}

function scrollBottom(x) {
	x.scrollTop = x.scrollHeight;
}

function diathesimosXoros() {
	var wh = {
		w:0,
		h:0
	};
	if (typeof(window.innerWidth) == 'number') {
		//Non-IE
		wh.w = window.innerWidth;
		wh.h = window.innerHeight;
	} else if (document.documentElement &&
		(document.documentElement.clientWidth ||
		document.documentElement.clientHeight)) {
		//IE 6+ in 'standards compliant mode'
		wh.w = document.documentElement.clientWidth;
		wh.h = document.documentElement.clientHeight;
	} else if (document.body && (document.body.clientWidth ||
		document.body.clientHeight ) ) {
		//IE 4 compatible
		wh.w = document.body.clientWidth;
		wh.h = document.body.clientHeight;
	}

	return wh;
}

function diafaniaSet(obj, opacity) {
	if (notSet(obj)) { return; }
	if (notSet(opacity)) { opacity = 100; }
	if (isSet(obj.style) && isSet(obj.style.opacity)) {
		obj.style.opacity = opacity / 100;
	}
	if (isSet(obj.filters) && isSet(obj.filters.alpha) &&
		isSet(obj.filters.alpha.opacity)) {
		obj.filters.alpha.opacity = opacity;
	}
}

function warningBottom(msg) {
	var x = getelid('infoBottom');
	if (notSet(x)) { return; }
	x.innerHTML = '<div class="warningBottom">' + msg + '</div>';
}

function errorFyi(msg) {
	mainFyi('<div style="padding-left: 0.2em; text-align: left; color: ' +
		globals.color.error + ';">' + msg + '</div>');
}

function akirosiScript(s) {
	return s.replace(/script/i, '&#8203;script');
}
