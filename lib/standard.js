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

function sviseNode(x) {
	if (isSet(x)) {
		x.parentNode.removeChild(x);
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
			playSound(name);
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

var dialogos = new function() {
	this.check = function() {
		var d = getelid('dialogos');
		if (notSet(d)) {
			mainFyi('dialogos: element not found');
			return null;
		}
		if (notSet(d.style) || notSet(d.style.left) || notSet(d.style.top)) {
			mainFyi('dialogos: undefined position');
			return null;
		}
		return d;
	};

	this.setOpacity = function(obj, opa) {
		obj.style.opacity = opa / 100;
		if (isSet(obj.filters) && isSet(obj.filters.alpha)) {
			obj.filters.alpha.opacity = opa;
		}
	};

	this.display = function(e, html, xyMode, x, y) {
		var d = dialogos.check(); if (notSet(d)) { return; }
		if (notSet(e)) { e = window.event; }

		if (isSet(e)) {
			var mxy = mouseXY(e);
			if (notSet(xyMode)) {
				xyMode = '';
			}

			if (xyMode == 'offset') {
				x = mxy.x + x; if (x <= 0) { x = 100; } x += 'px';
				y = mxy.y + y; if (y <= 0) { y = 100; } y += 'px';
			}
			else if (xyMode != 'set') {
				x = (mxy.x + 100) + 'px';
				y = mxy.y - 100; if (y <= 0) { y = 100; } y += 'px';
			}
		}
		else if (notSet(x) || notSet(y)) {
			mainFyi('dialogos.display: x/y: undefined');
			return;
		}

		d.style.position = 'absolute';
		d.style.top = y;
		d.style.left = x;
		d.innerHTML = '<div onmousedown="dialogos.moveBegin(event);" ' +
			'onmousemove="dialogos.moveMoving(event);" ' +
			'onmouseup="dialogos.moveEnd();">' +
			html + '</div>';
		d.style.visibility = 'visible';
	};

	var dx = 0;
	var dy = 0;
	var moving = false;

	this.moveBegin = function(e) {
		var d = dialogos.check(); if (notSet(d)) { return; }
		if (notSet(e)) { e = window.event; }

		var mxy = mouseXY(e);
		var dxy = apolitaXY(d);
		dx = dxy.x - mxy.x;
		dy = dxy.y - mxy.y;
		moving = true;
		d.style.cursor = 'move';
	};

	this.moveMoving = function(e) {
		if (!moving) { return; }
		var d = dialogos.check(); if (notSet(d)) { return; }
		if (notSet(e)) { e = window.event; }

		var mxy = mouseXY(e);
		d.style.left = (mxy.x + dx) + 'px';
		d.style.top = (mxy.y + dy) + 'px';
		d.style.cursor = 'move';
		dialogos.setOpacity(d, 50);
	};

	this.moveEnd = function() {
		dx = 0;
		dy = 0;
		moving = false;
		setTimeout(function() {
			var d = dialogos.check(); if (notSet(d)) { return; }
			dialogos.setOpacity(d, 100);
		}, 10);
	};

	this.yesNo = function(e, msg, func, xy, x, y) {
		dialogos.display(e, '<div class="dialogosBox">' + msg +
			'<div style="text-align: right;">' +
			'<div class="dialogosYesNo" ' +
			'onmouseover="dialogos.fotise(this);" ' +
			'onmouseout="dialogos.fotise(this, false);"' +
			'onclick="dialogos.hide();' + func + ';">' +
			'Ναι</div><div class="dialogosYesNo" ' +
			'onmouseover="dialogos.fotise(this);" ' +
			'onmouseout="dialogos.fotise(this, false);"' +
			'onclick="dialogos.hide();">Άκυρο</div></div></div>', xy, x, y);
	};

	this.fotise = function(obj, yes) {
		if (notSet(obj)) { return; }
		if (notSet(yes)) { yes = true; }

		if (yes) {
			obj.style.borderStyle = 'outset';
			obj.style.backgroundColor = '#FFFF66';
			obj.prinFotisiBold = obj.style.fontWeight;
			obj.style.fontWeight = 'bold';
		}
		else {
			obj.style.borderStyle = 'solid';
			obj.style.backgroundColor = '#FFFFCC';
			if (isSet(obj.prinFotisiBold)) {
				obj.style.fontWeight = obj.prinFotisiBold;
			}
			else {
				obj.style.fontWeight = 'normal';
			}
		}
	};

	this.hide = function() {
		dx = 0;
		dy = 0;
		moving = false;

		var d = getelid('dialogos'); if (notSet(d)) { return; }
		if (isSet(d.style)) {
			d.style.visibility = 'hidden';
		}
		d.innerHTML = '';
	};
};

function isPektis() {
	if (notSet(pektis)) {
		return false;
	}

	if (notSet(pektis.login)) {
		return false;
	}

	return true;
}

function isTrapezi() {
	if (notSet(trapezi)) {
		return false;
	}

	if (notSet(trapezi.kodikos)) {
		return false;
	}

	return true;
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
