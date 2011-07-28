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
		"motd":			30000,
		"diafimisi":		20000,
		"formaFyi":		3000,
		"ligoFyi":		2000,
		"mainFyi":		5000,
		"soundRep":		600,
		"errorIcon":		300
	};

	globals.timeDif -= parseInt((new Date).getTime() / 1000);
}

window.onload = function() {
	init();
}

function Request(page, asynch) {
	this.xhr = new XMLHttpRequest();
	if (notSet(this.xhr)) {
		this.xhr = new ActiveXObject("Msxml2.XMLHTTP");
		if (notSet(this.xhr)) {
			this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
			if (notSet(this.xhr)) {
				window.location = globals.server + 'error.php?message=' +
					uri('new Request: failed');
			}
		}
	}

	if (notSet(asynch)) {
		asynch = true;
	}

	this.page = page;
	this.xhr.open('POST', globals.server + page + '.php', asynch);

	this.send = function(data) {
		if (notSet(this.xhr)) {
			return 'undefined Ajax request';
		}

		if (notSet(data)) {
			data = '';
		}
		else if (data != '') {
			data += '&';
		}
		data += 'avoidCache=' + globals.avoidCache.base + ':' + globals.avoidCache.dif++;

		this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		this.xhr.send(data);
	};

	this.getResponse = function() {
		if (notSet(this.xhr)) {
			return 'undefined Ajax request';
		}

		if (notSet(this.xhr.status)) {
			return 'undefined Ajax returned status';
		}

		if (this.xhr.status != 200) {
			return this.page + ' (status = ' + this.xhr.status + ')';
		}

		if (notSet(this.xhr.responseText)) {
			return this.page + ': undefined Ajax response';
		}

		return this.xhr.responseText;
	};
}

function sviseNode(x, stadiaka) {
	if (notSet(stadiaka)) {
		if (isSet(x)) { x.parentNode.removeChild(x); }
		return;
	}

	var opacity = 100;
	var vima = parseInt(stadiaka / 10);
	if (notSet(vima) || (vima <= 0)) { vima = 120; }
	setTimeout(function() { sviseNodeVima(x, opacity, vima); }, vima);
}

function sviseNodeVima(x, opacity, vima) {
	if (notSet(x)) { return; }
	if (opacity <= 0) { sviseNode(x); return; }

	if (isSet(x.style)) { x.style.opacity = opacity / 100; }
	if (isSet(x.filters) && isSet(x.filters.alpha) &&
		isSet(x.filters.alpha.opacity)) {
		x.filters.alpha.opacity = opacity;
	}
	opacity -= 10;
	setTimeout(function() { sviseNodeVima(x, opacity, vima); }, vima);
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
	location.href = globals.server + 'error.php?minima=' +
		uri(isSet(msg) ? msg : 'Άγνωστο σφάλμα');
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
	fyi.clearTimer = setTimeout(function() {
		clearFyi(fyi);
	}, dur);
}

function clearFyi(fyi) {
	fyi.innerHTML = '&nbsp;';
	fyi.style.visibility = 'hidden';
}

// Η function `playSound' δέχεται ως παράμετρο το id κάποιου ηχητικού
// εφέ και παίζει τον αντίστοιχο ήχο. Οι ήχοι του ΔΚ βρίσκονται ως
// MP3 files στο lib/sounds directory της εφαρμογής και αρχικοποιούνται
// με το φόρτωμα της javascript βιβλιοθήκης `soundmanager.js' στο head
// section. Στο τέλος της βιβλιοθήκης έχω προσθέσει κώδικα που δημιουργεί
// τους ήχους και τους συσχετίζει με ids. Για να προσθέσω νέο ήχο στο ΔΚ,
// πρέπει να βάλω στο lib/sounds το αντίστοιχο MP3 file και να προσθέσω
// το αντίστοιχο κομμάτι κώδικα στο soundmanager.js source που βρίσκεται
// στο lib directory της εφαρμογής.

function playSound(name, vol) {
	if (notSet(window.soundManager)) {
		mainFyi('soundManager: not supported');
		return;
	}

	if (soundManager.prefaVolume == 0) {
		return;
	}

	var x = soundManager.getSoundById(name);
	if (notSet(x)) {
		return;
	}

	var tora = currentTimestamp();
	if ((tora - soundManager.prefaLast) < globals.duration.soundRep) {
		setTimeout(function() {
			playSound(name, vol);
		}, globals.duration.soundRep);
		return;
	}
	soundManager.prefaLast = tora;

	var v = (isSet(vol) ? vol : x.volume) * soundManager.prefaVolume;
	try {
		soundManager.play(name, {volume:v});
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
	if (notSet(dur)) {
		dur = 1;
	}

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
		ico.src = oldSrc;
		if (isSet(w)) {
			ico.style.width = w;
		}
	}, globals.duration.errorIcon * dur);
}

function isPektis() {
	if (notSet(pektis)) {
		return false;
	}

	if (notSet(pektis.login)) {
		return false;
	}

	return true;
}

function isPartida() {
	if (notSet(partida)) {
		return false;
	}

	if (notSet(partida.k)) {
		return false;
	}

	return true;
}

function isPrive() {
	if (notSet(partida)) {
		return false;
	}

	if (notSet(partida.p)) {
		return false;
	}

	return (partida.p == 1);
}

function isDianomi() {
	if (notSet(dianomi)) {
		return false;
	}

	if (dianomi.length < 1) {
		return false;
	}

	return true;
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

function strPote(ts, offset) {
	var tora = parseInt(currentTimestamp() / 1000);
	var dif = tora - ts + (isSet(offset) ? offset : globals.timeDif);
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
