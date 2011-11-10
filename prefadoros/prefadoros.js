var sinedria = {};	// η συνεδρία που αφορά στην επίσκεψη του παίκτη
var sxesi = [];		// οι σχετιζόμενοι και οι αναζητούμενοι
var permes = [];	// τα PMs του χρήστη
var prosklisi = [];	// οι προσκλήσεις που αφορούν στον χρήστη

var partida = {};	// το τραπέζι στο οποίο συμμετέχει ο παίκτης
var dianomi = [];	// οι διανομές του τραπεζιού
var kinisi = [];	// οι κινήσεις της διανομής

var trapezi = [];	// τα ενεργά τραπέζια
var rebelos = [];	// περιφερόμενοι παίκτες

var pexnidi = {};	// Το παιχνίδι που αντιστοιχεί στην παρτίδα

window.onload = function() {
	init();
	Emoticons.setup();
	motdSetup();
	diafimisiSetup();
	Dumprsp.setup();
	Dedomena.setup();
	Sizitisi.sxolioFocus();
	Pexnidi.reset();
	mainFyi('Απενεργοποιήστε το <span style="color: ' + globals.color.error +
		';">torrent</span> όσο είστε στον Πρεφαδόρο!', 7000);
};

window.onunload = function() {
	try { controlPanel.funchatClose(); } catch(e) {};
	try { controlPanel.kitapiClose(); } catch(e) {};
	try { Dumprsp.close(); } catch(e) {};
	try { offline(); } catch(e) {};
};

function motdSetup() {
	setTimeout(function() {
		var x = getelid('motd');
		if (notSet(x)) { return; }
		if (isSet(x.pineza) && x.pineza) {return; }
		sviseNode(x, 1200);
	}, globals.duration.motd);
}

function diafimisiSetup() {
	setTimeout(function() {
		var x = getelid('diafimisi');
		if (notSet(x)) { return; }
		if (isSet(x.pineza) && x.pineza) {return; }
		sviseNode(x, 1200);
	}, globals.duration.diafimisi);
}

var Prefadoros = new function() {
	this.show = null;

	this.display = function() {
		if (notSet(this.show)) {
			this.show = isPartida() ? 'partida' : 'kafenio';
		}

		if (this.show === 'partida') {
			Prefadoros.showPartida();
		}
		else {
			Prefadoros.showKafenio();
		}
		Prefadoros.clearBikeNeos();
		controlPanel.display();
	};

	this.clearBikeNeos = function() {
		if (notSet(partida)) { return; }
		for (i = 1; i <= 3; i++) {
			var n = 'n' + i;
			if (n in partida) { delete partida[n]; }
		}
	};

	this.showPartida = function(fs) {
		var x = getelid('prefadoros');
		if (notSet(x)) { return false; }

		var s = getelid('sizitisiKafenio');
		if (isSet(s)) { s.style.display = 'none'; }

		this.show = 'partida';
		if (Partida.HTML != x.innerHTML) {
			x.style.overflowY = 'hidden';
			x.innerHTML = Partida.HTML;
			if (pexnidi.epomenos == 1) {
				setTimeout(Dekada.setControls, 100);
			}
		}
		Prefadoros.sizitisiControls();

		var s = getelid('sizitisiTrapezi');
		if (isSet(s)) {
			Sizitisi.scrollBottom();
			s.style.display = 'inline';
		}

		x = getelid('partidaKafenio');
		if (isSet(x)) {
			x.innerHTML = '[&nbsp;<a href="#" ' +
				'onclick="return Prefadoros.showKafenio(true);" ' +
				'class="data" title ="Εμφάνιση τραπεζιού">' +
				'Καφενείο</a>&nbsp;]';
		}

		if (isSet(fs) && fs) { Sizitisi.sxolioFocus(); }

		// Εδώ υπάρχει ένα λεπτό σημείο του προγράμματος. Πρόκειται
		// για διαλόγους επιβεβαίωσης είτε της αγοράς, είτε του claim.
		// Αυτοί οι διάλογοι εμφανίζονται για επικύρωση των επιλογών
		// του τζογαδόρου. Όταν έρχονται, όμως, νέα δεδομένα και πρέπει
		// να γίνει επανασχεδιασμός (π.χ. από σχόλια που γράφει ένας
		// άλλος παίκτης), τότε αυτοί οι διάλογοι εξαφανίζονται. Για
		// το λόγο αυτό χρησιμοποιούνται κάποιες properties που
		// καταδεικνύουν ότι κάποιος διάλογος βρίσκεται σε εξέλιξη,
		// ώστε σε περίπτωση επανασχεδιασμού να εμφανιστεί ο τρέχων
		// διάλογος στην νέα εικόνα.

		if (isSet(Pexnidi) && isSet(Pexnidi.agoraData.agora)) {
			if (isSet(Pexnidi.agoraData.solo)) {
				Pexnidi.confirmSolo();
			}
			else {
				Pexnidi.confirmAgora();
			}
		}
		else if (isSet(controlPanel) && controlPanel.claimConfirmation) {
			controlPanel.confirmClaim();
		}
		return false;
	};

	this.showKafenio = function(fs) {
		var x = getelid('prefadoros');
		if (notSet(x)) { return false; }

		var s = getelid('sizitisiTrapezi');
		if (isSet(s)) { s.style.display = 'none'; }

		// Αν είμαστε σε mode παρτίδας και πάμε να γυρίσουμε σε
		// mode καφενείου, τότε κρατάμε το inner HTML της παρτίδας
		// όπως έχει αυτή ακριβώς τη στιγμή, ώστε να το έχουμε
		// ενημερωμένο όταν ξαναγυρίσουμε σε mode παρτίδας.
		if (isSet(this.show) && (this.show == 'partida') &&
			isSet(Partida) && isSet(x.innerHTML)) {
			Partida.HTML = x.innerHTML;
		}

		this.show = 'kafenio';
		if (Trapezi.HTML != x.innerHTML) {
			x.style.overflowY = 'auto';
			x.innerHTML = Trapezi.HTML;
		}
		Prefadoros.sizitisiControls();

		var s = getelid('sizitisiKafenio');
		if (isSet(s)) {
			Sizitisi.scrollBottom();
			s.style.display = 'inline';
		}

		x = getelid('partidaKafenio');
		if (isSet(x)) {
			x.innerHTML = '[&nbsp;<a href="#" ' +
				'onclick="return Prefadoros.showPartida(true);" ' +
				'class="data" title="Εμφάνιση καφενείου">' +
				'Τραπέζι</a>&nbsp;]';
		}

		if (isSet(fs) && fs) {
			var x = getelid('galleryPhoto');
			if (isSet(x)) {
				x.src = globals.server + 'images/gallery/' + Trapezi.randomPhoto();
			}
			Sizitisi.sxolioFocus();
		}
		return false;
	};

	this.sizitisiControls = function() {
		var x = getelid('sizitisiControls');
		if (notSet(x)) { return; }

		// Επανεμφανίζουμε τα πλήκτρα αποστολής και διαγραφής μηνυμάτων
		// ανάλογα με τις προσβάσεις του χρήστης, αλλά δεν μεταφέρουμε
		// το focus στο πεδίο των σχολίων.
		x.innerHTML = Sizitisi.controlsHTML(false);
	};

	this.sviseBikeTora = function(img) {
		setTimeout(function() {
			Prefadoros.sviseBikeTora2(img);
		}, 3000);
	};

	this.sviseBikeTora2 = function(img) {
		var x = parseFloat(img.style.width);
		if (x < 0.4) {
			try { img.parentNode.removeChild(img); } catch(e) {};
			return;
		}

		img.style.width = (x - 0.2) + 'cm';

		x = parseFloat(img.style.top);
		img.style.top = (x + 0.1) + 'cm';

		x = parseFloat(img.style.right);
		img.style.right = (x + 0.2) + 'cm';
		setTimeout(function() {
			Prefadoros.sviseBikeTora2(img);
		}, 50);
	};
}

function isPektis() {
	return(isSet(window.pektis) && isSet(pektis.login));
}

function notPektis() {
	return(!isPektis());
}

function isTheatis() {
	return(isSet(window.partida) && isSet(partida.theatis) && partida.theatis);
}

function notTheatis() {
	return(!isTheatis());
}

function isPartida() {
	return(isSet(window.partida) && isSet(partida.kodikos));
}

function notPartida() {
	return(!isPartida());
}

function isPrive() {
	return(isSet(window.partida) && isSet(partida.prive) && partida.prive);
}

function isPublic() {
	return(!isPrive());
}

function isKlisto() {
	return(isSet(window.partida) && isSet(partida.klisto) && partida.klisto);
}

function isAnikto() {
	return(!isKlisto());
}

function isPasoPasoPaso() {
	return(isSet(window.partida) && isSet(partida.ppp) && partida.ppp);
}

function notPasoPasoPaso() {
	return(!isPasoPasoPaso());
}

function isAsoiKolos() {
	return(isSet(window.partida) && isSet(partida.asoi) && partida.asoi);
}

function notAsoiKolos() {
	return(!isAsoiKolos());
}

function denPezoun() {
	var paso = 0;
	for (var i = 1; i <= 3; i++) {
		if (pexnidi.simetoxi[i] == 'ΠΑΣΟ') {
			paso++;
		}
	}
	return (paso > 1);
}

function isDianomi() {
	return(isSet(window.dianomi) && isSet(dianomi.length) && (dianomi.length > 0));
}

function notDianomi() {
	return(!isDianomi());
}

function isKinisi() {
	return(isSet(window.kinisi) && isSet(kinisi.length) && (kinisi.length > 0));
}

function notKinisi() {
	return(!isKinisi());
}

function isApodoxi(thesi) {
	if (notSet(window.partida)) { return false; }
	return partida.apodoxi[thesi];
}

function notApodoxi(thesi) {
	return(!isApodoxi(thesi));
}

function isKeniThesi() {
	if (isSet(window.partida)) {
		for (var i = 1; i <= 3; i++) {
			if (partida.pektis[i] == '') { return true; }
		}
	}
	return false;
}

function notKeniThesi() {
	return(!isKeniThesi());
}

function isVoithao(thesi) {
	if (notSet(window.pexnidi)) { return false; }
	if (notSet(pexnidi.simetoxi)) { return false; }
	return(pexnidi.simetoxi[thesi] == 'ΒΟΗΘΑΩ')
}

function denPezi(thesi) {
	if (notSet(window.pexnidi)) { return false; }
	if (notSet(pexnidi.simetoxi)) { return false; }
	return((pexnidi.fasi != 'ΣΥΜΜΕΤΟΧΗ') && (pexnidi.simetoxi[thesi] == 'ΠΑΣΟ'))
}

function isProsklisi() {
	if (notPartida()) { return false; }
	if (notPektis()) { return false; }
	if (notSet(window.prosklisi)) { return false; }
	for (var i = 0; i < prosklisi.length; i++) {
		if (prosklisi[i].p != pektis.login) { continue; }
		if (prosklisi[i].t != partida.kodikos) { continue; }
		return true;
	}
	return false;
}

function notProsklisi() {
	return(!isProsklisi());
}

function isTzogadoros(thesi) {
	if (notSet(window.pexnidi)) { return false; }
	if (notSet(pexnidi.tzogadoros)) { return false; }

	if (notSet(thesi)) { thesi = 1; }
	return (thesi == pexnidi.tzogadoros);
}

function notTzogadoros(thesi) {
	return (!isTzogadoros(thesi));
}

function isEpomenos(thesi) {
	if (notSet(window.pexnidi)) { return false; }
	if (notSet(pexnidi.epomenos)) { return false; }

	if (notSet(thesi)) { thesi = 1; }
	return (thesi == pexnidi.epomenos);
}

function notEpomenos(thesi) {
	return (!isEpomenos(thesi));
}
