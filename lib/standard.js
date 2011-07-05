var pektis = null;	// ο τρέχων παίκτης;

function init() {
	globals.avoidCache = {
		"base":		(new Date).getTime(),
		"dif":		0
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

function fatalError(msg) {
	location.href = globals.server + 'error.php?minima=' +
		uri(isSet(msg) ? msg : 'Άγνωστο σφάλμα');
}

function mainFyi(msg) {
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

	fyi.innerHTML = msg;
	fyi.style.visibility = visibility;
	fyi.clearTimer = setTimeout(function() {
		clearFyi(fyi);
	}, globals.duration.mainFyi);
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

function playSound(name) {
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

	var v = x.volume * soundManager.prefaVolume;
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

function errorIcon(ico, dur) {
	if (notSet(dur)) {
		dur = 1;
	}

	var oldSrc = ico.src;
	ico.src = globals.server + 'images/X.png';
	setTimeout(function() {
		ico.src = oldSrc;
	}, globals.duration.errorIcon * dur);
}

function dialogos(html, x, y) {
	var m = getelid('dialogos');
	if (notSet(m)) {
		return;
	}

	if (notSet(x)) {
		x = '2.0cm';
	}

	if (notSet(y)) {
		y = '4.0cm';
	}

	m.style.top = y;
	m.style.left = x;
	m.innerHTML = html;
}

function dialogosOff() {
	var m = getelid('dialogos');
	if (isSet(m)) {
		m.innerHTML = '';
	}
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
