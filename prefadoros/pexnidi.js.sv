// Όλη η διαδικασία του παιχνιδιού κυριαρχείται από τα
// αντικείμενα "pexnidi", "dianomi" και "kinisi".

var Pexnidi = new function() {
	this.delay = {
		'pasoPasoPaso':		3000,
		'megistiAgora':		3000,
		'baza':			1200,
		'pliromi':		1500,
		'tzogos':		3000
	};

	this.miosiDelay = function(code) {
		if (code in Pexnidi.delay) {
			Pexnidi.delay[code] -= 700;
			if (Pexnidi.delay[code] < 1000) { Pexnidi.delay[code] = 1000; }
		}
	};

	// Η ιδιότητα "anamoniKinisis" δείχνει αν περιμένουμε κάποια
	// συγκεκριμένη κίνηση από τον server και μάλιστα δείχνει τον
	// κωδικό της κίνησης αυτής. Πρόκειται για την τελευταία κίνηση
	// που στείλαμε και μας επεστράφη ο κωδικός κατά την εισαγωγή.
	// Αν η μεταβλητή έχει τιμή μηδέν, τότε το πεδίο είναι καθαρό
	// και μπορούμε να στείλουμε καινούρια κίνηση. Αν έχει θετική
	// τιμή, πρόκειται για τον κωδικό της αναμενόμενης κίνησης,
	// ενώ αν έχει αρτνητική τιμή, βρισκόμαστε στο μικροδιάστημα
	// μεταξύ αποστολής νέας κίνησης και παραλαβής του κωδικού
	// της νεοεισαχθείσης κίνησης.

	this.anamoniKinisis = 0;

	this.reset = function() {
		pexnidi.akirosi = 0;
		pexnidi.ipolipo = 0;
		pexnidi.kapikia = [ 0, 0, 0, 0 ];
		pexnidi.elima = 0;

		pexnidi.fasi = 'ΣΤΗΣΙΜΟ';
		pexnidi.epomenos = 0;

		pexnidi.dealer = 0;
		pexnidi.fila = [ [], [], [], [] ];

		pexnidi.dilosiCount = 0;
		pexnidi.dilosi = [ '', '', '', '' ];
		pexnidi.curdil = 'DTG';

		pexnidi.pasoCount = 0;
		pexnidi.paso = [ false, false, false, false ];

		pexnidi.tzogadoros = 0;
		pexnidi.agora = '';
		pexnidi.agoraXroma = '';
		pexnidi.agoraBazes = 0;
		pexnidi.asoi = false;

		pexnidi.simetoxi = [ '', '', '', '' ];
		pexnidi.claim = [ false, false, false, false ];

		pexnidi.bazaCount = 0;
		pexnidi.baza = [ 0, 0, 0, 0 ];
		Pexnidi.resetBaza();

		Dodekada.reset();
		Dekada.reset();
	};

	this.resetBaza = function() {
		pexnidi.bazaFilo = [];
		pexnidi.bazaPektis = [];
	};

	// Η function "processDedomena" καλείται κάθε φορά που έχουμε
	// νέα δεδομένα και σκοπό έχει να θέσει τα στοιχεία του παιχνιδιού
	// στα νέα δεδομένα.

	this.processDedomena = function() {
		var errmsg = 'Pexnidi::processDedomena: ';

		// Αρχικά μηδενίζουμε τα πάντα.
		Pexnidi.reset();
		if (notPartida()) { return;}

		// Κάνουμε αντιστοίχιση των θέσεων, καθώς από τον
		// server μας έρχονται δεδομένα με τις πραγματικές
		// θέσεις, ενώ στον client ο παίκτης που βρίσκεται
		// στο νότο έχει θέση 1.
		Pexnidi.dianomiMap();
		Pexnidi.kinisiMap();

		// Κανονίζουμε τα οικονομικά των παικτών και της
		// παρτίδας γενικότερα.
		for (var i = 1; i <= 3; i++) {
			pexnidi.kapikia[i] = -(partida.kasa * 10);
		}

		// Τώρα θα διαχειριστούμε τις διανομές της παρτίδας
		// με σκοπό κυρίως τη διαμόρφωση των οικονομικών
		// και τον καθορισμό του dealer.
		pexnidi.ipolipo = 30 * partida.kasa;
		for (var i = 0; i < dianomi.length; i++) {
			pexnidi.dealer = dianomi[i].dealer;
			for (var j = 1; j <= 3; j++) {
				pexnidi.ipolipo -= dianomi[i].kasa[j];
				pexnidi.kapikia[j] += dianomi[i].kasa[j];
				pexnidi.kapikia[j] += dianomi[i].kapikia[j];
			}
		}

		var x = pexnidi.ipolipo / 3;
		pexnidi.ipolipo = parseInt(pexnidi.ipolipo / 10);

		for (var i = 1; i <= 3; i++) {
			pexnidi.kapikia[i] = parseInt(pexnidi.kapikia[i] + x);
		}

		var x = pexnidi.kapikia[partida.pam[2]] + pexnidi.kapikia[partida.pam[3]];
		pexnidi.elima = pexnidi.kapikia[partida.pam[1]] + x;
		pexnidi.kapikia[partida.pam[1]] = -x;

		// Ήρθε η στιγμή να διαχειριστούμε τις κινήσεις της
		// τελευταίας διανομής.
		for (var i = 0; i < kinisi.length; i++) {
			if (kinisi[i].k == pexnidi.anamoniKinisis) { pexnidi.anamoniKinisis = 0; }
			switch (kinisi[i].i) {
			case 'ΔΙΑΝΟΜΗ':
				ProcessKinisi.dianomi(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΔΗΛΩΣΗ':
				ProcessKinisi.dilosi(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΤΖΟΓΟΣ':
				ProcessKinisi.tzogos(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΑΓΟΡΑ':
				ProcessKinisi.agora(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΣΥΜΜΕΤΟΧΗ':
				ProcessKinisi.simetoxi(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΦΥΛΛΟ':
				ProcessKinisi.filo(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΜΠΑΖΑ':
				ProcessKinisi.baza(kinisi[i].thesi);
				break;
			case 'ΑΚΥΡΩΣΗ':
				ProcessKinisi.akirosi(kinisi[i].thesi);
				break;
			case 'CLAIM':
				ProcessKinisi.claim(kinisi[i].thesi, kinisi[i].d);
				break;
			default:
				mainFyi(errmsg + kinisi[i].i + ': άγνωστο είδος κίνησης');
				break;
			}
		}
	};

	this.dianomiMap = function() {
		for (var i = 0; i < dianomi.length; i++) {
			dianomi[i].dealer = partida.pam[dianomi[i].d];
			dianomi[i].kasa = [ 0,
				eval('dianomi[' + i + '].k' + partida.map[1]),
				eval('dianomi[' + i + '].k' + partida.map[2]),
				eval('dianomi[' + i + '].k' + partida.map[3])
			];
			dianomi[i].kapikia = [ 0,
				eval('dianomi[' + i + '].m' + partida.map[1]),
				eval('dianomi[' + i + '].m' + partida.map[2]),
				eval('dianomi[' + i + '].m' + partida.map[3])
			];
		}
	};

	this.kinisiMap = function() {
		for (var i = 0; i < kinisi.length; i++) {
			kinisi[i].thesi = partida.pam[kinisi[i].p];
		}
	};

	this.spaseFila = function(s) {
		var fila = [];
		if (notSet(s) || (s.length < 2)) { return fila; }

		var alif = [];

		var pikes = 0;
		var kara = 0;
		var spathia = 0;
		var koupes = 0;
		var ble = 0;
		var red = 0;

		var n = parseInt(s.length / 2)
		for (var i = 0; i < n; i++) {
			var l = i * 2;
			alif[i] = s.substring(l, l + 2);
			if (alif[i].match(/^S/)) { pikes++; }
			else if (alif[i].match(/^D/)) { kara++; }
			else if (alif[i].match(/^C/)) { spathia++; }
			else if (alif[i].match(/^H/)) { koupes++; }
			else if (alif[i].match(/^B/)) { ble++; }
			else if (alif[i].match(/^R/)) { red++; }
		}

		if (pikes > 0) {
			if (spathia == 0) { var sira = [ 'D', 'S', 'H', 'B', 'R' ]; }
			else if (kara > 0) { sira = [ 'S', 'D', 'C', 'H', 'B', 'R' ]; }
			else { sira = [ 'S', 'H', 'C', 'B', 'R' ]; }
		}
		else if (spathia > 0) { var sira = [ 'D', 'C', 'H', 'B', 'R' ]; }
		else { var sira = [ 'D', 'H', 'B', 'R' ]; }

		var idx = 0;

		for (var i = 0; i < sira.length; i++) {
			for (var j = 0; j < alif.length; j++) {
				if (alif[j].match('^' + sira[i])) {
					fila[idx++] = alif[j];
				}
			}
		}

		var more = false;
		do {
			more = false;
			for (var i = 1; i < fila.length; i++) {
				if (fila[i].substr(0, 1) == fila[i - 1].substr(0, 1)) {
					var f1 = fila[i - 1].substr(1, 1);
					var f2 = fila[i].substr(1, 1);
					if (globals.rankFila[f1] > globals.rankFila[f2]) {
						var t = fila[i];
						fila[i] = fila[i - 1];
						fila[i - 1] = t;
						more = true;
					}
				}
			}
		} while (more);

		return fila;
	};

	this.deseFila = function(fila) {
		var s = '';
		for (var i = 0; i < fila.length; i++) { s += fila[i]; }
		return s;
	}

	this.addKinisi = function(idos, data, thesi) {
		if (pexnidi.akirosi) {
			playSound('beep');
			mainFyi('Ακύρωση κίνησης σε εξέλιξη');
			return;
		}

		if (pexnidi.anamoniKinisis) {
			playSound('beep');
			mainFyi('Αναμένεται κίνηση από τον server');
			return;
		}

		pexnidi.anamoniKinisis = -1;
		var req = new Request('pexnidi/addKinisi', false);

		if (isSet(thesi)) {
			if (thesi != 0) { thesi = partida.map[thesi]; }
		}
		else {
			thesi = partida.map[1];
		}

		var params = 'thesi=' + uri(thesi);
		params += '&idos=' + uri(idos);
		if (notSet(data)) { data = ''; }
		params += '&data=' + uri(data);
		req.send(params);
		var rsp = req.getResponse();
		if (rsp.match(/^OK@/)) {
			pexnidi.anamoniKinisis = parseInt(rsp.replace(/^OK/));
		}
		else {
			mainFyi(rsp);
			playSound('beep');
			pexnidi.anamoniKinisis = 0;
		}
	};

	this.processFasi = function(batch) {
		var errmsg = 'Pexnidi::processFasi: ';

		if (notSet(batch)) { batch = false; }
		switch (pexnidi.fasi) {
		case 'ΣΤΗΣΙΜΟ':
			ProcessFasi.stisimo();
			break;
		case 'ΔΗΛΩΣΗ':
			ProcessFasi.dilosi();
			break;
		case 'ΠΑΣΟ ΠΑΣΟ ΠΑΣΟ':
			ProcessFasi.pasoPasoPaso();
			break;
		case 'ΤΖΟΓΟΣ':
			ProcessFasi.tzogos();
			break;
		case 'ΑΛΛΑΓΗ':
			ProcessFasi.alagi();
			break;
		case 'ΣΥΜΜΕΤΟΧΗ':
			ProcessFasi.simetoxi();
			break;
		case 'ΠΑΙΧΝΙΔΙ':
			ProcessFasi.pexnidi();
			break;
		case 'ΜΠΑΖΑ':
			ProcessFasi.baza();
			break;
		case 'ΠΛΗΡΩΜΗ':
			ProcessFasi.pliromi();
			break;
		case 'ΠΑΣΟ ΠΑΣΟ':
			ProcessFasi.pliromi();
			break;
		case 'CLAIM':
			ProcessFasi.claim();
			break;
		default:
			mainFyi(errmsg + pexnidi.fasi + ': άγνωστη φάση');
			break;
		}
	};

	this.dianomi = function() {
		mainFyi('Γίνεται διανομή. Παρακαλώ περιμένετε…');
		var req = new Request('trapezi/apodoxi', false);

		params = 'dianomi=yes';
		params += '&thesi=' + partida.map[1];
		req.send(params);
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			playSound('beep');
		}
	};

	this.setEpomenos = function(thesi) {
		if (notSet(thesi)) { thesi = pexnidi.epomenos; }
		pexnidi.epomenos = thesi + 1;
		if (pexnidi.epomenos > 3) { pexnidi.epomenos = 1; }
		return pexnidi.epomenos;
	}

	this.xromaBazesHTML = function(dilosi, bc, xc, spot) {
		var html = '';
		if (notSet(bc)) { bc = 'protasiBazes'; }
		if (notSet(xc)) { xc = 'protasiXroma'; }

		if (dilosi == 'DTG') {
			var de = '';
			var bazes = '<span style="font-size: 70%;">Άμα μείνουν</span>';
			var xroma = null;
		}
		else {
			var de = dilosi.substr(0, 1);
			var xroma = dilosi.substr(1, 1);
			var bazes = Tools.bazesDecode(dilosi.substr(2, 1));
		}

		html += '<div class="' + bc + '">';
		if (de == 'E') { html += '<span style="font-size: 80%;">Έχω </span>'; }
		html += bazes;
		html += '</div>';
		if (spot) {
			html += '<img class="' + xc + '" src="' + globals.server +
				'images/svisimo.gif" alt="" onload="Tools.metalagi(this, ';
			if (isSet(xroma)) {
				html += '\'' + globals.server +
					'images/trapoula/xroma' + xroma + '.png\'';
			}
			else {
				html += 'null';
			}
			html += ', 400);" />';
		}
		else if (isSet(xroma)) {
			html += '<img class="' + xc + '" src="' + globals.server +
				'images/trapoula/xroma' + xroma + '.png" alt="" />';
		}
		if (de == 'Y') {
			html += '&nbsp;+&nbsp;';
			html += '<img class="' + xc + '" src="' + globals.server +
				'images/trapoula/asoi.png" style="width: 0.8cm; height: 0.8cm;" alt="" />';
		}
		return html;
	};

	this.epilogiDilosis = function(div, dilosi) {
		Sizitisi.sxolioFocus();
		Pexnidi.anamoniEpilogis(div);
		if (notSet(dilosi)) { dilosi = pexnidi.curdil; }
		Pexnidi.addKinisi('ΔΗΛΩΣΗ', dilosi);
	};

	this.dilosiPaso = function(div) {
		Sizitisi.sxolioFocus();
		Pexnidi.anamoniEpilogis(div);
		Pexnidi.addKinisi('ΔΗΛΩΣΗ', 'P' + pexnidi.curdil.substr(1, 2));
	};

	this.isAsoi = function() {
		if (notAsoiKolos()) { return false; }
		if (pexnidi.tzogadoros != 1) { return false; }
		var fila = pexnidi.fila[1];
		var count = 0;
		for (var i = 0; i < fila.length; i++) {
			if (fila[i].match(/^.A/)) { count++; }
		}
		return (count >= 4);
	};

	this.epilogiAgoras = function(div, dxb) {
		Sizitisi.sxolioFocus();
		var de = dxb.substr(0, 1);
		var xroma = dxb.substr(1, 1);
		var bazes = dxb.substr(2, 1);
		var agora = ((Pexnidi.isAsoi() && confirm('Θα δηλώσετε τους τέσσερις άσους;')) ?
			'Y' : 'N') + xroma + bazes;

		var fila = pexnidi.fila[1];
		var neaFila = '';
		for (var i = 0; i < 12; i++) {
			if ((i in Dodekada.klidomeno) && (Dodekada.klidomeno[i])) { continue; }
			neaFila += fila[i];
		}

		if (confirm('Να γίνει αγορά ' + Tools.decodeAgora(agora) + ';')) {
			Pexnidi.anamoniEpilogis(div);
			Pexnidi.addKinisi('ΑΓΟΡΑ', agora + ':' + neaFila);
		}
	};

	this.epilogiSimetoxi = function(div, data) {
		Sizitisi.sxolioFocus();
		Pexnidi.anamoniEpilogis(div);
		Pexnidi.addKinisi('ΣΥΜΜΕΤΟΧΗ', data);
	};

	this.anamoniEpilogis = function(div) {
		var cls = div.getAttribute('class');
		cls += ' epilogiAnamoni';
		div.setAttribute('class', cls);
	};

	this.claim = function(div, apodoxi) {
		Sizitisi.sxolioFocus();
		if (pexnidi.akirosi != 0) { return; }
		if (isTheatis()) { return; }

		var cls = div.getAttribute('class');
		cls += ' epilogiAnamoni';
		div.setAttribute('class', cls);
		if (apodoxi) {
			Pexnidi.addKinisi('CLAIM', 'YES');
			return;
		}

		var req = new Request('pexnidi/akirosiClaim', false);
		req.send();
		var rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
			playSound('beep');
		}
	};
};

var ProcessFasi = new function() {
	var toBeDone = null;

	this.stisimo = function() {
		pexnidi.epomenos = 0;
	};

	this.dilosi = function() {
	};

	this.pasoPasoPaso = function() {
		if (isSet(toBeDone)) { return; }
		if (isTheatis()) { return; }
		if (pexnidi.dealer != 3) { return; }
		if (pexnidi.akirosi != 0) { return; }
		toBeDone = setTimeout(function() {
			if (isPasoPasoPaso()) { Pexnidi.addKinisi('ΑΓΟΡΑ', 'NNN', 0); }
			else { Pexnidi.dianomi(); }
			toBeDone = null;
		}, Pexnidi.delay['pasoPasoPaso']);
		Pexnidi.miosiDelay('pasoPasoPaso');
	};

	this.tzogos = function() {
		if (isSet(toBeDone)) { return; }
		if (isTheatis()) { return; }
		if (notTzogadoros()) { return; }
		if (pexnidi.akirosi != 0) { return; }
		toBeDone = setTimeout(function() {
			Pexnidi.addKinisi('ΤΖΟΓΟΣ');
			toBeDone = null;
		}, Pexnidi.delay['tzogos']);
		Pexnidi.miosiDelay('tzogos');
	};

	this.alagi = function() {
	};

	this.simetoxi = function() {
	};

	this.pexnidi = function() {
	};

	this.baza = function() {
		if (isSet(toBeDone)) { return; }
		if (isTheatis()) { return; }
		if (pexnidi.epomenos != 1) { return; }
		if (pexnidi.akirosi != 0) { return; }
		toBeDone = setTimeout(function() {
			Pexnidi.addKinisi('ΜΠΑΖΑ');
			toBeDone = null;
		}, Pexnidi.delay['baza']);
	};

	this.pliromi = function() {
		if (isSet(toBeDone)) { return; }
		if (isTheatis()) { return; }
		if (pexnidi.dealer != 3) { return; }
		toBeDone = setTimeout(function() {
			Pexnidi.dianomi();
			toBeDone = null;
		}, Pexnidi.delay['pliromi']);
		Pexnidi.miosiDelay('pliromi');
	};

	this.claim = function() {
	};
};

var ProcessKinisi = new function() {
	this.dianomi = function(thesi, data) {
		if (thesi != pexnidi.dealer) {
			alert('ProcessKinisi::dianomi: λάθος θέση dealer');
			return;
		}

		var x = data.split(':');
		for (var i = 1; i <= 3; i++) {
			pexnidi.fila[i] = Pexnidi.spaseFila(x[partida.map[i]]);
		}
		pexnidi.fasi = 'ΔΗΛΩΣΗ';
		Pexnidi.setEpomenos(thesi);
	};

	this.dilosi = function(thesi, data) {
		if (thesi != pexnidi.epomenos) {
			alert('ProcessKinisi::dilosi: λάθος θέση δηλούντος');
			return;
		}

		pexnidi.dilosiCount++;
		if (data.match(/^P/)) {
			ProcessKinisi.dilosiPaso(thesi);
			return;
		}

		pexnidi.dilosi[thesi] = data;

		if (data == 'DTG') {
			if (pexnidi.pasoCount == 2) {
				pexnidi.tzogadoros = thesi;
				pexnidi.fasi = 'ΤΖΟΓΟΣ';
				pexnidi.epomenos = 0;
				return;
			}
			pexnidi.curdil = 'DS6';
			ProcessKinisi.setEpomenosDilosi(thesi);
			return;
		}

		for (var i = 1; i <= 3; i++) {
			if (pexnidi.dilosi[i] == 'DTG') {
				pexnidi.paso[i] = true;
				pexnidi.pasoCount++;
			}
		}

		if (pexnidi.pasoCount == 2) {
			pexnidi.tzogadoros = thesi;
			pexnidi.fasi = 'ΤΖΟΓΟΣ';
			pexnidi.epomenos = 0;
			return;
		}

		// Είχα κανονική δήλωση και θα υπολογίσω την επόμενη
		// που πρέπει να προταθεί. Παίζει ρόλο το πρώτο γράμμα
		// που είναι "D" για κανονικές δηλώσεις, ή "E" για
		// δηλώσεις "έχω".
		var de = data.substr(0, 1);
		var xroma = data.substr(1, 1);
		var bazes = data.substr(2, 1);

		// Αν έχει κλείσει γύρος, τότε αρχίζουν να παίζουν
		// δηλώσεις "έχω".
		if ((pexnidi.dilosiCount >= 3) && (de == 'D')) {
			pexnidi.curdil = 'E' + xroma + bazes;
			ProcessKinisi.setEpomenosDilosi(thesi);
		}
		else {
			bazes = Tools.bazesDecode(bazes);
			switch (xroma) {
			case 'S':	xroma = 'C'; break;
			case 'C':	xroma = 'D'; break;
			case 'D':	xroma = 'H'; break;
			case 'H':	xroma = 'N'; break;
			case 'N':	xroma = 'S'; bazes++; break;
			}
			if (bazes <= 10) {
				pexnidi.curdil = 'D' + xroma + Tools.bazesEncode(bazes);
				pexnidi.fasi = 'ΔΗΛΩΣΗ';
				ProcessKinisi.setEpomenosDilosi(thesi);
				return;
			}
			pexnidi.tzogadoros = thesi;
			thesi++;
			if (thesi > 3) { thesi = 1; }
			pexnidi.paso[thesi] = true;
			thesi++
			if (thesi > 3) { thesi = 1; }
			pexnidi.paso[thesi] = true;
			pexnidi.fasi = 'ΤΖΟΓΟΣ';
			pexnidi.epomenos = 0;
		}
	};

	this.setEpomenosDilosi = function(thesi) {
		epomenos = thesi;
		for (var i = 0; i < 2; i++) {
			epomenos++;
			if (epomenos > 3) { epomenos = 1; }
			if (pexnidi.paso[epomenos]) { continue; }
			if (pexnidi.dilosi[epomenos] == 'DTG') { continue; }
			pexnidi.epomenos = epomenos;
			return;
		}
		pexnidi.epomenos = 0;
	};

	this.dilosiPaso = function(thesi) {
		pexnidi.paso[thesi] = true;
		pexnidi.pasoCount++;
		if (pexnidi.pasoCount >= 3) {
			pexnidi.fasi = 'ΠΑΣΟ ΠΑΣΟ ΠΑΣΟ';
			pexnidi.epomenos = 0;
			return;
		}

		Pexnidi.setEpomenos(thesi);
		var methepomenos = pexnidi.epomenos + 1;
		if (methepomenos > 3) { methepomenos = 1; }

		if (pexnidi.paso[pexnidi.epomenos]) {
			if (pexnidi.dilosi[methepomenos] == '') {
				pexnidi.fasi = 'ΔΗΛΩΣΗ';
				pexnidi.epomenos = methepomenos;
				return;
			}
			pexnidi.fasi = 'ΤΖΟΓΟΣ';
			pexnidi.tzogadoros = methepomenos;
			pexnidi.epomenos = 0;
			return;
		}

		if (pexnidi.paso[methepomenos]) {
			if (pexnidi.dilosi[pexnidi.epomenos] == '') {
				pexnidi.fasi = 'ΔΗΛΩΣΗ';
				return;
			}
			pexnidi.fasi = 'ΤΖΟΓΟΣ';
			pexnidi.tzogadoros = pexnidi.epomenos;
			pexnidi.epomenos = 0;
			return;
		}

		pexnidi.fasi = 'ΔΗΛΩΣΗ';
	};

	this.tzogos = function(thesi, data) {
		var errmsg = 'ProcessKinisi::tzogos: ';
		if (thesi != pexnidi.tzogadoros) {
			alert(errmsg + 'λάθος θέση τζογαδόρου');
			return;
		}

		if (pexnidi.epomenos != 0) {
			alert(errmsg + 'λάθος θέση επομένου');
			return;
		}

		var fila = Pexnidi.deseFila(pexnidi.fila[thesi]) + data;
		pexnidi.fila[thesi] = Pexnidi.spaseFila(fila);
		pexnidi.fasi = 'ΑΛΛΑΓΗ';
		pexnidi.epomenos = thesi;
	};

	this.agora = function(thesi, data) {
		var errmsg = 'ProcessKinisi::agora: ';
		if (thesi != pexnidi.tzogadoros) {
			alert(errmsg + 'λάθος θέση τζογαδόρου (θέση: ' +
				thesi + ', επόμενος: ' + pexnidi.tzogadoros + ')');
			return;
		}

		if (thesi != pexnidi.epomenos) {
			alert(errmsg + 'λάθος θέση επομένου (θέση: ' +
				thesi + ', επόμενος: ' + pexnidi.epomenos + ')');
			return;
		}

		var x = data.split(':');
		pexnidi.agora = x[0];
		pexnidi.agoraXroma = x[0].substr(1, 1);
		pexnidi.agoraBazes = parseInt(x[0].substr(2, 1));
		pexnidi.asoi = (x[0].substr(0, 1) == 'Y');
		if (pexnidi.tzogadoros != 0) {
			if (thesi == pexnidi.tzogadoros) {
				pexnidi.fila[thesi] = Pexnidi.spaseFila(x[1]);
			}
			pexnidi.fasi = 'ΣΥΜΜΕΤΟΧΗ';
			Pexnidi.setEpomenos(thesi);
		}
		else {
			pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
			Pexnidi.setEpomenos(pexnidi.dealer);
		}
	};

	this.simetoxi = function(thesi, data) {
		var errmsg = 'ProcessKinisi::simetoxi: ';

		if (thesi != pexnidi.epomenos) {
			alert(errmsg + 'λάθος θέση τζογαδόρου');
			return;
		}

		switch (pexnidi.tzogadoros) {
		case 1: var ena = 2; var dio = 3; break;
		case 2: ena = 3; dio = 1; break;
		case 3: ena = 1; dio = 2; break;
		default:
			alert(errmsg + 'δεν βρέθηκε τζογαδόρος');
			return;
		}

		switch (pexnidi.simetoxi[thesi] = data) {
		case 'ΠΑΙΖΩ':
			if (thesi == ena) {
				pexnidi.fasi = 'ΣΥΜΜΕΤΟΧΗ';
				pexnidi.epomenos = dio;
			}
			else if (pexnidi.simetoxi[ena] != 'ΠΑΣΟ') {
				pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
				Pexnidi.setEpomenos(pexnidi.dealer);
			}
			else {
				pexnidi.fasi = 'ΣΥΜΜΕΤΟΧΗ';
				pexnidi.epomenos = ena;
			}
			break;
		case 'ΜΟΝΟΣ':
			pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
			Pexnidi.setEpomenos(pexnidi.dealer);
			if (pexnidi.simetoxi[pexnidi.epomenos] == 'ΠΑΣΟ') {
				Pexnidi.setEpomenos(pexnidi.epomenos);
			}
			break;
		case 'ΠΑΣΟ':
			if (thesi == dio) {
				if (pexnidi.simetoxi[ena] == 'ΠΑΙΖΩ') {
					pexnidi.fasi = 'ΣΥΜΜΕΤΟΧΗ';
					pexnidi.epomenos = ena;
				}
				else if (pexnidi.simetoxi[ena] == 'ΠΑΣΟ') {
					pexnidi.fasi = 'ΠΑΣΟ ΠΑΣΟ';
					pexnidi.epomenos = 0;
				}
			}
			else if (pexnidi.simetoxi[dio] == '') {
				pexnidi.fasi = 'ΣΥΜΜΕΤΟΧΗ';
				pexnidi.epomenos = dio;
			}
			else {
				pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
				Pexnidi.setEpomenos(pexnidi.dealer);
				if (pexnidi.simetoxi[pexnidi.epomenos] == 'ΠΑΣΟ') {
					Pexnidi.setEpomenos(pexnidi.epomenos);
				}
			}
			break;
		case 'ΜΑΖΙ':
			for (var i = 1; i <= 3; i++) {
				if (pexnidi.simetoxi[i] == 'ΠΑΣΟ') {
					pexnidi.simetoxi[i] = 'ΒΟΗΘΑΩ';
				}
			}
			pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
			Pexnidi.setEpomenos(pexnidi.dealer);
			break;
		default:
			mainFyi(errmsg + data + ': invalid data');
			break;
		}
	};

	this.filo = function(thesi, data) {
		var errmsg = 'ProcessKinisi::filo: ';

		if (thesi != pexnidi.epomenos) {
			alert(errmsg + 'λάθος θέση επομένου');
			return;
		}

		pexnidi.bazaFilo.push(data);
		pexnidi.bazaPektis.push(thesi);

		var fila = Pexnidi.deseFila(pexnidi.fila[thesi]);
		fila = fila.replace(data, '');
		pexnidi.fila[thesi] = Pexnidi.spaseFila(fila);
		Pexnidi.setEpomenos(thesi);
		if (pexnidi.simetoxi[pexnidi.epomenos] == 'ΠΑΣΟ') {
			Pexnidi.setEpomenos(pexnidi.epomenos);
		}
		if (pexnidi.epomenos != pexnidi.bazaPektis[0]) {
			pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
			return;
		}

		var atou = pexnidi.agoraXroma;
		var xroma = pexnidi.bazaFilo[0].substr(0, 1);

		// Αν η μπάζα παίζεται στο χρώμα των ατού, τότε
		// είναι σαν παίζουμε μπάζα χωρίς ατού.
		if (xroma == atou) { atou = 'N'; }

		var axia = globals.rankFila[pexnidi.bazaFilo[0].substr(1, 1)];
		var pios = 0;
		var tsaka = 0;	// αξία μεγαλύτερου φύλλου τσάκας

		for (var i = 1; i < pexnidi.bazaFilo.length; i++) {
			var x = pexnidi.bazaFilo[i].substr(0, 1);
			var a = globals.rankFila[pexnidi.bazaFilo[i].substr(1, 1)];

			// Ελέγχουμε πρώτα την περίπτωση που είχε γίνει τσάκα.
			if (tsaka > 0) {
				if (x != atou) { continue; }
				if (a < tsaka) { continue; }
				tsaka = a;
				pios = i;
				continue;
			}

			// Δεν είχε γίνει τσάκα και ελέγχουμε αν ακολουθούμε
			// στο χρώμα της μπάζας.
			if (x == xroma) {
				if (a < axia) { continue; }
				axia = a;
				pios = i;
				continue;
			}

			// Δεν ακολουθούμε και το χρώμα που βάζουμε είναι άσχετο.
			if (x != atou) { continue; }

			// Έχουμε την πρώτη τσάκα.
			tsaka = a;
			pios = i;
		}
		pexnidi.fasi = 'ΜΠΑΖΑ';
		pexnidi.epomenos = pexnidi.bazaPektis[pios];
	};

	this.baza = function(thesi) {
		var errmsg = 'ProcessKinisi::baza: ';

		if (thesi != pexnidi.epomenos) {
			alert(errmsg + 'λάθος θέση επομένου');
			return;
		}

		Pexnidi.resetBaza();
		pexnidi.bazaCount++;
		pexnidi.baza[thesi]++;
		pexnidi.epomenos = thesi;
		if (pexnidi.bazaCount < 10) {
			pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
		}
		else {
			pexnidi.fasi = 'ΠΛΗΡΩΜΗ';
		}
	};

	this.akirosi = function(thesi) {
		pexnidi.akirosi = thesi in partida.pektis ? thesi : 0;
	};

	this.claim = function(thesi, data) {
		Pexnidi.setEpomenos(thesi);
		if (pexnidi.simetoxi[pexnidi.epomenos] == 'ΠΑΣΟ') { Pexnidi.setEpomenos(); }
		if (data == 'YES') {
			pexnidi.claim[thesi] = true;
			if (pexnidi.epomenos == pexnidi.tzogadoros) {
				pexnidi.fasi = 'ΠΛΗΡΩΜΗ';
				var b = 0;
				for (var i = 1; i <= 3; i++) {
					if (i != pexnidi.tzogadoros) { b += pexnidi.baza[i]; }
				}
				pexnidi.baza[pexnidi.tzogadoros] = 10 - b;
			}
			return;
		}

		pexnidi.claim = [];
		pexnidi.fila[thesi] = Pexnidi.spaseFila(data);
		pexnidi.fasi = 'CLAIM';
	};
};