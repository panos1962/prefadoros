// Όλη η διαδικασία του παιχνιδιού κυριαρχείται από τα
// αντικείμενα "pexnidi", "dianomi" και "kinisi".

var Pexnidi = new function() {
	// Η μεταβλητή "anamoniKinisis" δείχνει αν περιμένουμε κάποια
	// συγκεκριμένη κίνηση από τον server και μάλιστα δείχνει τον
	// κωδικό της κίνησης αυτής. Πρόκειται για την τελευταία κίνηση
	// που στείλαμε και μας επεστράφη ο κωδικός κατά την εισαγωγή.
	// Αν η μεταβλητή έχει τιμή μηδέν, τότε το πεδίο είναι καθαρό
	// και μπορούμε να στείλουμε καινούρια κίνηση. Αν έχε θετική
	// τιμή, πρόκειται για τον κωδικό της αναμενόμενης κίνησης,
	// ενώ αν έχει αρτνητική τιμή, βρισκόμαστε στο μικροδιάστημα
	// μεταξύ αποστολής νέας κίνησης και παραλαβής του κωδικού
	// της νεοεισαχθείσης κίνησης.

	var anamoniKinisis = 0;

	// Οι παρακάτω ιδιότητες, μέθοδοι και μεταβλητές, σκοπό έχουν
	// κυρίως την αποφυγή της επανάληψης ενδείξεων σημαντικότητας
	// κατά την επαναδιαμόρφωση της εικόνας. Π.χ., όταν κάποιος
	// δηλώνει αγορά, εμφανίζεται σχετική ένδειξη σημαντικότητας
	// στην περιοχή του. Το ίδιο συμβαίνει και όταν κάποιος κερδίζει
	// τον τζόγο, κλπ. Αυτά πυροδοτούνται από την έλευση των
	// σχετικών κινήσεων. Πιο συγκεκριμένα, αν η τελευταία κίνηση
	// που παρελήφθη είναι κάποια κίνηση που απαιτεί ένδειξη
	// σημαντικότητας, τότε γίνεται η ένδειξη, παράλληλα όμως
	// μαρκάρουμε τις κινήσεις αυτές, ώστε να μην έχουμε
	// ανεπιθύμητες επαναλήψεις. Το array δεικοδοτείται με
	// tags που εμπεριέχουν τους κωδικούς των σχετικών
	// κινήσεων και "καθαρίζει" σε κάθε νέα διανομή.

	this.spotList = [];
	var spotListDianomi = 0;

	this.spotListPush = function(idx) {
		if (notDianomi()) { return; }
		var d = dianomi[dianomi.length - 1].k;
		if (d != spotListDianomi) {
			Pexnidi.spotList = [];
			spotListDianomi = d;
		}
		Pexnidi.spotList[idx] = true;
	};

	this.resetData = function() {
		pexnidi.ipolipo = 0;
		pexnidi.kapikia = [ 0, 0, 0, 0 ];
		pexnidi.elima = 0;

		pexnidi.fasi = '';
		pexnidi.epomenos = 0;

		pexnidi.dealer = 0;
		pexnidi.fila = [ [], [], [], [] ];

		pexnidi.curdil = '';

		pexnidi.dilosi = [ '', '', '', '' ];
		pexnidi.dilosiCount = 0;

		pexnidi.paso = [ false, false, false, false ];
		pexnidi.dilosiPaso = [ '', '', '', '' ];

		pexnidi.tzogadoros = 0;
		pexnidi.agora = '';
		pexnidi.xromaAgoras = '';
		pexnidi.xromaBazes = 0;
		pexnidi.asoi = false;

		pexnidi.mazi = [ false, false, false, false ];
	};

	// Η function "setData" καλείται κάθε φορά που έχουμε νέα δεδομένα
	// και σκοπό έχει να θέσει τα στοιχεία του παιχνιδιού στα νέα
	// δεδομένα.

	this.setData = function() {
		Pexnidi.resetData();
		if (notPartida()) { return;}

		pexnidi.fasi = 'ΣΤΗΣΙΜΟ';

		Pexnidi.dianomiMap();
		Pexnidi.kinisiMap();

		for (var i = 1; i <= 3; i++) {
			pexnidi.kapikia[i] = -(partida.kasa * 10);
		}

		pexnidi.ipolipo = 30 * partida.kasa;
		for (var i = 0; i < dianomi.length; i++) {
			pexnidi.dealer = dianomi[i].dealer;
			for (var j = 1; j <= 3; j++) {
				pexnidi.ipolipo -= dianomi[i].kasa[j];
				pexnidi.kapikia[j] += dianomi[i].kasa[j];
				pexnidi.kapikia[j] += dianomi[i].kapikia[j];
			}
		}
		Pexnidi.setEpomenos(pexnidi.dealer);

		var x = pexnidi.ipolipo / 3;
		pexnidi.ipolipo = parseInt(pexnidi.ipolipo / 10);

		for (var i = 1; i <= 3; i++) {
			pexnidi.kapikia[i] = parseInt(pexnidi.kapikia[i] + x);
		}

		var x = pexnidi.kapikia[partida.pam[2]] + pexnidi.kapikia[partida.pam[3]];
		pexnidi.elima = pexnidi.kapikia[partida.pam[1]] + x;
		pexnidi.kapikia[partida.pam[1]] = -x;

		for (var i = 0; i < kinisi.length; i++) {
// alert('kinisi[' + i + '].thesi = ' + kinisi[i].thesi);
			if (kinisi[i].k == anamoniKinisis) { anamoniKinisis = 0; }
			switch (kinisi[i].i) {
			case 'ΔΙΑΝΟΜΗ':
				pexnidi.fasi = 'ΔΗΛΩΣΗ';
				Pexnidi.setEpomenos(kinisi[i].thesi);
				pexnidi.curdil = 'DTG';
				break;
			case 'ΔΗΛΩΣΗ':
				Pexnidi.processKinisiDilosi(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΤΖΟΓΟΣ':
				Pexnidi.processKinisiTzogos(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΑΓΟΡΑ':
				Pexnidi.processKinisiAgora(kinisi[i].thesi, kinisi[i].d);
				break;
			}
		}
	};

	this.processKinisiDilosi = function(thesi, data) {
		pexnidi.dilosiCount++;
		if (data.match(/^P/)) {
			pexnidi.paso[thesi] = true;
			pexnidi.dilosiPaso[thesi] = data.substr(1, 2);
			Pexnidi.setEpomenos(thesi);
			if (pexnidi.epomenos == 0) {
				pexnidi.fasi = 'ΤΡΙΑ ΠΑΣΟ';
				pexnidi.dealer++;
				if (pexnidi.dealer > 3) { pexnidi.dealer = 1; }
			}
			return;
		}

		pexnidi.dilosi[thesi] = data;
		pexnidi.fasi = 'ΔΗΛΩΣΗ';
		Pexnidi.setEpomenos(thesi);
		if (data == 'DTG') {
			pexnidi.curdil = 'DS6';
			return;
		}

		var de = data.substr(0, 1);
		var xroma = data.substr(1, 1);
		var bazes = data.substr(2, 1);
		if ((pexnidi.dilosiCount >= 3) && (de == 'D')) {
			pexnidi.curdil = 'E' + xroma + bazes;
		}
		else {
			bazes = Pexnidi.bazesDecode(bazes);
			switch (xroma) {
			case 'S':	xroma = 'C'; break;
			case 'C':	xroma = 'D'; break;
			case 'D':	xroma = 'H'; break;
			case 'H':	xroma = 'N'; break;
			case 'N':	xroma = 'S'; bazes++; break;
			}
			pexnidi.curdil = 'D' + xroma + Pexnidi.bazesEncode(bazes);
		}
	};

	this.processKinisiTzogos = function(thesi, data) {
		pexnidi.tzogadoros = thesi;
		fila = pexnidi.fila[thesi];
		fila.push(data.substr(0, 2));
		fila.push(data.substr(2, 2));

		pexnidi.fila[thesi] = Pexnidi.spaseFila(Pexnidi.deseFila(fila));
		pexnidi.fasi = 'ΤΖΟΓΟΣ';
		pexnidi.epomenos = thesi;
	};

	this.processKinisiAgora = function(thesi, data) {
		pexnidi.tzogadoros = thesi;
		var x = data.split(':');
		if ((x.length != 2) || (!x[0].match(/^[YN][SCDHN][6789T]$/)) ||
			(!x[1].match(/^([SCDH][6789TJQKA]){10}$/))) {
			fatalError(data + ': λάθος δεδομένα κίνησης αγοράς');
		}

		pexnidi.agora = x[0];
		pexnidi.asoi = (pexnidi.agora).match(/^Y/);
		pexnidi.xromaAgoras = (pexnidi.agora).substr(1, 1);
		var bazes = (pexnidi.agora).substr(2, 1);
		pexnidi.bazesAgoras = bazes == 'T' ? 10 : parseInt(bazes);

		pexnidi.fila[thesi] = Pexnidi.spaseFila(x[1]);
		pexnidi.fasi = 'ΣΥΜΜΕΤΟΧΗ';
		pexnidi.epomenos = Pexnidi.setEpomenos(thesi);
	};

	this.bazesDecode = function(s) {
		return s == 'T' ? 10 : parseInt(s);
	};

	this.bazesEncode = function(b) {
		return b == 10 ? 'T' : b;
	};

	this.setEpomenos = function(thesi) {
		if (notSet(thesi)) { thesi = pexnidi.epomenos; }
		if (thesi) {
			pexnidi.epomenos = thesi;
			do {
				pexnidi.epomenos++;
				if (pexnidi.epomenos > 3) { pexnidi.epomenos = 1; }
				if (!pexnidi.paso[pexnidi.epomenos]) {
					return;
				}
			} while (pexnidi.epomenos != thesi);
		}

		pexnidi.epomenos = 0;
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
			if (kinisi[i].i == 'ΔΙΑΝΟΜΗ') {
				var x = kinisi[i].d.split(':');
				for (var j = 1; j <= 3; j++) {
					pexnidi.fila[j] = Pexnidi.spaseFila(x[partida.map[j]]);
				}
			}
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

	this.stisimoHTML = function() {
		var html = '<div style="padding: 0.2cm;">';
		if (isTheatis()) {
			html += Pexnidi.anamoniHTML();
			html += 'Καθορίζεται το ύψος της κάσας και η διάταξη των παικτών ' +
				'στο τραπέζι. Παρακαλώ περιμένετε…';
		}
		else {
			html += 'Ελέγξτε την ' + Pexnidi.lexiIconHTML('κάσα (',
				'controlPanel/kasa.png', ')') + ' και τη ' +
				Pexnidi.lexiIconHTML('διάταξη (', 'controlPanel/diataxi.png', ')') +
				' των παικτών χρησιμοποιώντας τα σχετικά εργαλεία του control panel. ';
			html += 'Τέλος, πατήστε το πλήκτρο αποδοχής όρων του ' +
				Pexnidi.lexiIconHTML('παιχνιδιού (', 'controlPanel/check.png', '),') +
				' ή το πλήκτρο ' + Pexnidi.lexiIconHTML('εκκίνησης (',
				'controlPanel/go.jpg', ')') + ' για να ξεκινήσετε την παρτίδα.';
		}
		html += '</div>';
		return html;
	};

	this.dilosiHTML = function() {
		var html = '';
		html += Pexnidi.tzogosHTML();

		if (isTheatis()) {
			html += '<div style="position: absolute; z-index: 1;">';
			html += 'Οι παίκτες πλειοδοτούν με διαδοχικές δηλώσεις αγοράς, ' +
				'ή αποσύρονται δηλώνοντας «πάσο». Παρακαλώ περιμένετε…';
			html += '</div>';
		}
		else if (pexnidi.epomenos == 1) {
			html += '<div class="protasiArea">';
			if (pexnidi.curdil == 'DTG') {
				html += Tools.epilogiHTML('Άμα μείνουν',
					'Pexnidi.epilogiDilosis(this)', '', 'protasi');
				html += Tools.epilogiHTML('ΠΡΩΤΑ',
					'Pexnidi.epilogiDilosis(this, \'DS6\')', '', 'protasi');
			}
			else {
				html += Tools.epilogiHTML(Pexnidi.xromaBazesHTML(pexnidi.curdil),
					'Pexnidi.epilogiDilosis(this)', '', 'protasi');
			}
			html += Tools.epilogiHTML('ΠΑΣΟ',
				'Pexnidi.dilosiPaso(this)', '', 'protasi');
			html += '</div>';
		}
		else if (!pexnidi.paso[1]) {
			html += '<div style="position: absolute; z-index: 1;">';
			html += 'Πλειοδοτήστε για την αγορά, ή αποσυρθείτε ' +
				'δηλώνοντας «πάσο». Περιμένετε τη σειρά σας…';
			html += '</div>';
		}
		return html;
	};

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
			var bazes = Pexnidi.bazesDecode(dilosi.substr(2, 1));
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
		var cls = div.getAttribute('class');
		cls += ' epilogiAnamoni';
		div.setAttribute('class', cls);
		if (notSet(dilosi)) { dilosi = pexnidi.curdil; }
		Pexnidi.addKinisi('ΔΗΛΩΣΗ', dilosi);
	};

	this.dilosiPaso = function(div) {
		var cls = div.getAttribute('class');
		cls += ' epilogiAnamoni';
		div.setAttribute('class', cls);
		Pexnidi.addKinisi('ΔΗΛΩΣΗ', 'P' + pexnidi.curdil.substr(1, 2));
	};

	this.addKinisi = function(idos, data) {
		if (anamoniKinisis) {
			playSound('beep');
			mainFyi('Αναμένεται κίνηση από τον server');
			return;
		}

		anamoniKinisis = -1;
		var req = new Request('pexnidi/addKinisi');
		req.xhr.onreadystatechange = function() {
			Pexnidi.addKinisiCheck(req);
		};

		var params = 'thesi=' + uri(partida.map[1]);
		params += '&idos=' + uri(idos);
		params += '&data=' + uri(data);
		req.send(params);
	};

	this.addKinisiCheck = function(req) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp.match(/^OK@/)) {
			anamoniKinisis = parseInt(rsp.replace(/^OK/));
		}
		else {
			mainFyi(rsp);
			playSound('beep');
			anamoniKinisis = 0;
		}
	};

	this.dianomiHTML = function() {
		var html = '';
		if (pexnidi.dealer == 1) {
			html += Pexnidi.anamoniHTML('dianomi.gif', 'width: 2.0cm;');
		}
		else {
			html += Pexnidi.anamoniHTML();
		}
		if (isTheatis()) {
			html += 'Και οι τρεις παίκτες δήλωσαν «πάσο». ' +
				'Θα γίνει νέα διανομή. ';
			html += Pexnidi.piosPektis(pexnidi.dealer) + 'μοιράζει φύλλα. ';
		}
		else {
			html += 'Και οι τρεις παίκτες δηλώσατε «πάσο». ';
			html += Pexnidi.piosPektis(pexnidi.dealer, 'Μοιράζετε', 'μοιράζει') + 'φύλλα. ';
		}
		html += 'Παρακαλώ περιμένετε…';
		return html;
	};

	this.triaPasoHTML = function() {
		if (!isPPP()) { return Pexnidi.dianomiHTML(); };
		var html = '';
		if (isTheatis()) {
			html += 'Και οι τρεις παίκτες δήλωσαν «πάσο». ' +
				'Η διανομή θα παιχτεί και ο παίκτης που θα πάρει τις ' +
				'περισσότερες μπάζες θα καταθέσει 100 καπίκια στην κάσα. ' +
				'Παρακαλώ περιμένετε…';
		}
		else {
			html += 'Και οι τρεις παίκτες δηλώσατε «πάσο». ' +
				'Θα παίξετε τη διανομή και όποιος από σας κάνει τις ' +
				'περισσότερες μπάζες θα καταθέσει 100 καπίκια στην κάσα.';
		}
		return html;
	};

	this.alagiTzogouHTML = function() {
		var msg = 'πλειοδότησε και έχει «σηκώσει» τα φύλλα του τζόγου. ' +
			'Παρακαλώ περιμένετε την αγορά του…';
		var html = '';
		if (isTheatis()) {
			if (pexnidi.tzogadoros != 1) {
				html += Pexnidi.anamoniHTML('nevrikos.gif', 'width: 1.0cm;');
			}
			else {
				html += Pexnidi.anamoniHTML('bares.gif', 'width: 0.4cm;');
			}
			html += Pexnidi.piosPektis(pexnidi.tzogadoros) + msg;
		}
		else {
			if (pexnidi.tzogadoros != 1) {
				html += Pexnidi.anamoniHTML('nevrikos.gif', 'width: 1.0cm;');
			}
			html += Pexnidi.piosPektis(pexnidi.tzogadoros,
				'Πλειοδοτήσατε και έχετε ήδη «σηκώσει» τα φύλλα του τζόγου. ' +
				'Ξεσκαρτάρετε δύο φύλλα και επιλέξτε την αγορά σας.', msg);
		}
		return html;
	};

	this.dixeAgoresHTML = function() {
		var dilosi = pexnidi.dilosi[pexnidi.tzogadoros];
		var xromaAgoras = dilosi.substr(1, 1);
		var bazesAgoras = dilosi.substr(2, 1);
		var xroma = [ 'S', 'C', 'D', 'H', 'N' ];
		var html = '';
		html = '<table style="border-collapse: collapse;">';
		for (var i = 6; i <= 10; i++) {
			html += '<tr>';
			for (j = 0; j < xroma.length; j++) {
				var dxb = 'D' + xroma[j] + (i > 9 ? 'T' : i);
				html += '<td>';
				if ((i < bazesAgoras) || ((i == bazesAgoras) &&
					(globals.rankXroma[xroma[j]] < globals.rankXroma[xromaAgoras]))) {
					html += '<div class="epilogi protasiAgora protasiAgoraOxi">' +
						Pexnidi.xromaBazesHTML(dxb, 'protasiAgoraBazes',
						'protasiAgoraXroma') + '</div>';
				}
				else {
					html += Tools.epilogiHTML(Pexnidi.xromaBazesHTML(dxb,
						'protasiAgoraBazes', 'protasiAgoraXroma'),
						'Pexnidi.epilogiAgoras(this, \'' + dxb +
						'\')', 'Επιλογή αγοράς: ' + Tools.decodeAgora(dxb),
						'protasiAgora');
				}
				html += '</td>';
			}
			if (i == 10) {
				html += '<td>';
				html += Tools.epilogiHTML('<span style="color: red;">ΣΟΛΟ</span>',
					'Pexnidi.epilogiAgoras(this)', 'Σολάρετε αξιοπρεπώς!',
					'protasiAgora');
				html += '</td>';
			}
			html += '</tr>';
		}
		html += '</table>';

		if (Pexnidi.isAsoi()) {
			html += '<img class="spotAsoi" src="' + globals.server;
			if ('4A' in Pexnidi.spotList) {
				html += 'images/trapoula/asoi.png"';
			}
			else {
				Pexnidi.spotListPush('4A');
				html += 'images/asteraki.gif" onload="Tools.metalagi(this, \'' +
				globals.server + 'images/trapoula/asoi.png\', 700);"';
			}
			html += ' title="Έχετε 4 άσους!" alt="" />';
		}
		return html;
	};

	this.isAsoi = function() {
		if (pexnidi.tzogadoros != 1) { return false; }
		var fila = pexnidi.fila[1];
		var count = 0;
		for (var i = 0; i < fila.length; i++) {
			if (fila[i].match(/^.A/)) { count++; }
		}
		return (count > 3);
	};

	this.piosPektis = function(thesi, ena, dio) {
		if (notSet(ena)) { ena = 'Ο παίκτης που παρακολουθείτε '; }
		else { ena += ' '; }
		if (notSet(dio)) { dio = ''; }
		else { dio + ' '; }
		switch (thesi) {
		case 1:		return ena;
		case 2:		return 'Ο παίκτης στα δεξιά σας ' + dio;
		case 3:		return 'Ο παίκτης στα αριστερά σας ' + dio;
		}

		fataError('Αδυναμία προσανατολισμού (ακαθόριστη θέση)');
	};

	this.lexiIconHTML = function(prin, src, meta) {
		var html = '';
		html += '<span class="nobr">' + prin;
		html += Pexnidi.textIcon(src);
		if (isSet(meta)) { html += meta; }
		html += '</span>';
		return html;
	};

	this.textIcon = function(src) {
		var html = '';
		html = '<img src="' + globals.server + 'images/' + src + '" ' +
			'class="gipedoTextIcon" alt="" />';
		return html;
	};

	this.anamoniHTML = function(img, style) {
		if (notSet(img)) { img = 'wormspin.gif'; }
		var html = '';
		html = '<div><img src="' + globals.server + 'images/' + img +
			'" class="gipedoAnamoni" ';
		if (isSet(style)) { html += 'style="' + style + '" '; }
		html += 'alt="" /></div>';
		return html;
	};

	this.tzogosHTML = function() {
		var html = '';
		html += '<img class="tzogosIcon" src="' + globals.server +
			'images/trapoula/tzogos.png" title="Τζόγος" alt="" />';
		return html;
	};

	this.agnostiFasiHTML = function() {
		var html = '<img class="gipedoProvlimaIcon" src="' + globals.server +
			'images/provlima.gif" alt="" />';
		html += '<div style="position: absolute; z-index: 1; top: 0.6cm;">';
		html += 'Παρουσιάστηκε κάποιο πρόβλημα. Το πρόγραμμα δεν αναγνωρίζει ' +
			'την παρούσα φάση ';
		if (pexnidi.fasi) { html += '(' + pexnidi.fasi + ') '; }
		html += 'του παιχνιδιού. Παρακαλώ ειδοποιήστε τον ' +
			'προγραμματιστή.';
		html += '</div>';
		return html;
	}

	this.processFasi = function() {
		if (isTheatis()) { return; }
		switch (pexnidi.fasi) {
		case 'ΤΡΙΑ ΠΑΣΟ':
			if ((!isPPP()) && (pexnidi.dealer == 1)) {
				setTimeout(Pexnidi.dianomi, 2000);
			}
			break;
		}
	};

	this.dianomi = function() {
		mainFyi('Γίνεται διανομή. Παρακαλώ περιμένετε…');
		var req = new Request('trapezi/apodoxi');
		req.xhr.onreadystatechange = function() {
			Pexnidi.dianomiCheck(req);
		};

		params = 'dianomi=yes';
		params += '&thesi=' + partida.map[1];
		req.send(params);
	};

	this.dianomiCheck = function(req) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			playSound('beep');
		}
	};

	this.epilogiAgoras = function(div, dxb) {
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
			Pexnidi.addKinisi('ΑΓΟΡΑ', agora + ':' + neaFila);
		}
	};
}
