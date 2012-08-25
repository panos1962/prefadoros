// Όλη η διαδικασία του παιχνιδιού κυριαρχείται από τα
// αντικείμενα "pexnidi", "dianomi" και "kinisi".

var Pexnidi = new function() {
	this.mavroKokino = {
		'S':	'M',
		'C':	'M',
		'D':	'K',
		'H':	'K'
	};

	this.delay = {
		'baza':			300,
		'tzogos':		1500
	};

	this.filoSeKinisi = 0;
	this.bazaSeKinisi = 0;

	// Η ιδιότητα "anamoniKinisis" δείχνει αν περιμένουμε κάποια
	// συγκεκριμένη κίνηση από τον server και μάλιστα δείχνει τον
	// κωδικό της κίνησης αυτής. Πρόκειται για την τελευταία κίνηση
	// που στείλαμε και μας επεστράφη ο κωδικός κατά την εισαγωγή.
	// Αν η μεταβλητή έχει τιμή μηδέν, τότε το πεδίο είναι καθαρό
	// και μπορούμε να στείλουμε καινούρια κίνηση. Αν έχει θετική
	// τιμή, πρόκειται για τον κωδικό της αναμενόμενης κίνησης,
	// ενώ αν έχει αρνητική τιμή, βρισκόμαστε στο μικροδιάστημα
	// μεταξύ αποστολής νέας κίνησης και παραλαβής του κωδικού
	// της νεοεισαχθείσης κίνησης.

	this.anamoniKinisis = 0;

	// Τα arrays "prevBazaFilo" και "prevBazaPektis" χρησιμοποιούνται
	// στην επανεμφάνιση της προηγούμενης (τελευταίας) μπάζας. Ο παίκτης
	// μπορεί να δει ακόμη και μπάζα από την προηγούμενη διανομή, εφόσον
	// βρίσκεται στην αρχή νέας διανομής. Σε περίπτωση που έχει ανοίξει
	// ο τζόγος μετά από πάσο, στη θέση της τελευταίας μπάζας εμφανίζονται
	// τα φύλλα του τζόγου.

	pexnidi.prevBazaFilo = [];
	pexnidi.prevBazaPektis = [];
	pexnidi.prevTzogosFilo = [];

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

		pexnidi.tzogos = '';
		pexnidi.tzogadoros = 0;
		pexnidi.agora = '';
		pexnidi.agoraXroma = '';
		pexnidi.agoraBazes = 0;
		pexnidi.asoi = false;

		pexnidi.prepiBazes = [ 0, 0, 0, 0 ];
		pexnidi.mesaKinisi = 0;
		pexnidi.mesaIxos = '';

		pexnidi.simetoxi = [ '', '', '', '' ];
		pexnidi.claim = [ false, false, false, false ];

		pexnidi.bazaCount = 0;
		pexnidi.baza = [ 0, 0, 0, 0 ];
		pexnidi.bazaFilo = [];
		pexnidi.bazaPektis = [];
		Pexnidi.resetBaza();

		Dodekada.reset();
		Dekada.reset();
	};

	this.resetBaza = function() {
		if (pexnidi.bazaFilo.length > 0) {
			pexnidi.prevBazaFilo = pexnidi.bazaFilo;
			pexnidi.prevBazaPektis = pexnidi.bazaPektis;
			if (notTzogadoros()) { pexnidi.prevTzogosFilo = []; }
		}

		pexnidi.bazaFilo = [];
		pexnidi.bazaPektis = [];
		Gipedo.anadromi = 'baza';
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
				ProcessKinisi.simetoxi(kinisi[i].thesi, kinisi[i].d, i);
				break;
			case 'ΦΥΛΛΟ':
				ProcessKinisi.filo(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΜΠΑΖΑ':
				// Αν η τελευταία μας κίνηση είναι μπάζα, τότε δεν τη
				// διαχειριζόμαστε τώρα, αλλά θα τη διαχειριστούμε
				// αργότερα, μετά την αποστολή της μπάζας προς τον
				// παίκτη που την κερδίζει.
				if (i < (kinisi.length - 1)) {
					ProcessKinisi.baza(kinisi[i].thesi, kinisi[i].k);
				}
				break;
			case 'ΑΚΥΡΩΣΗ':
				ProcessKinisi.akirosi(kinisi[i].thesi);
				break;
			case 'CLAIM':
				ProcessKinisi.claim(kinisi[i].thesi, kinisi[i].d);
				break;
			case 'ΣΟΛΟ':
				ProcessKinisi.solo(kinisi[i].thesi, kinisi[i].k, kinisi[i].d);
				break;
			case 'ΠΛΗΡΩΜΗ':
				ProcessKinisi.pliromi(kinisi[i].k);
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

		if (isPektis() && isSet(pektis.enalagi) && pektis.enalagi) {
			if (pikes > 0) {
				if (spathia == 0) { var sira = [ 'D', 'S', 'H', 'B', 'R' ]; }
				else if (kara > 0) { sira = [ 'S', 'D', 'C', 'H', 'B', 'R' ]; }
				else { sira = [ 'S', 'H', 'C', 'B', 'R' ]; }
			}
			else if (spathia > 0) { var sira = [ 'D', 'C', 'H', 'B', 'R' ]; }
			else { sira = [ 'D', 'H', 'B', 'R' ]; }
		}
		else {
			sira = [ 'S', 'D', 'C', 'H', 'B', 'R' ];
		}

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

	// Ορισμένες φορές παρατηρείται το φαινόμενο της απόπειρας επανεισαγωγής
	// της τελευταίας κίνησης. Για να το αποφύγουμε χρησιμοποιούμε διάφορες
	// τεχνικές, πρώτη από τις οποίες είναι η καταγραφή του πλήθους των
	// μέχρι τώρα κινήσεων στη μεταβλητή "kinisiCountPrinAdd" και η θέση
	// εκ νέου σε null της ίδιας μεταβλητής μετά την εισαγωγή (είτε πέτυχε
	// αυτή, είτε όχι). Αν κατά την εισαγωγή, το πλήθος των μέχρι τώρα κινήσεων
	// παραμένει το ίδιο, τότε πρόκειται για απόπειρα διπλής εισαγωγής κίνησης
	// και ακυρώνουμε την ενέργεια.

	var kinisiCountPrinAdd = null;

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

		if (notDianomi()) {
			playSound('beep');
			mainFyi('Ακαθόριστη διανομή κίνησης');
			return;
		}

		if ((kinisi.length > 0) && (idos == 'ΜΠΑΖΑ') &&
			(kinisi[kinisi.length - 1].i == 'ΜΠΑΖΑ')) {
			playSound('felos');
			mainFyi('Απόπειρα διπλομπάζας');
			return;
		}

		if (isSet(kinisiCountPrinAdd) && (kinisi.length == kinisiCountPrinAdd)) {
			playSound('felos');
			mainFyi('Απόπειρα διπλοκίνησης');
			return;
		}
		kinisiCountPrinAdd = kinisi.length;

		pexnidi.anamoniKinisis = -1;
		var req = new Request('pexnidi/addKinisi');
		req.xhr.onreadystatechange = function() {
			Pexnidi.addKinisiCheck(req);
		};

		if (isSet(thesi)) {
			if (thesi != 0) { thesi = partida.map[thesi]; }
		}
		else {
			thesi = partida.map[1];
		}

		var params = 'dianomi=' + uri(dianomi[dianomi.length - 1].k);
		params += '&thesi=' + uri(thesi);
		params += '&idos=' + uri(idos);
		if (notSet(data)) { data = ''; }
		params += '&data=' + uri(data);
		req.send(params);
	};

	this.addKinisiCheck = function(req) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp.match(/^OK@/)) {
			pexnidi.anamoniKinisis = parseInt(rsp.replace(/^OK/));
		}
		else {
			mainFyi(rsp);
			playSound('felos');
			pexnidi.anamoniKinisis = 0;
		}
		kinisiCountPrinAdd = null;
	};

	this.processFasi = function() {
		var errmsg = 'Pexnidi::processFasi: ';

		if (notTheatis()) {
			if (pexnidi.epomenos == 1) { Xipnitiri.vale(0); }
			else { Xipnitiri.vgale(); }
		}

		if ((kinisi.length > 0) &&
			(pexnidi.mesaKinisi == kinisi[kinisi.length - 1].k)) {
			playSoundList(pexnidi.mesaIxos);
		}
		switch (pexnidi.fasi) {
		case 'ΔΙΑΝΟΜΗ':
			ProcessFasi.dianomi();
			break;
		case 'ΠΑΣΟ ΠΑΣΟ ΠΑΣΟ':
			ProcessFasi.pasoPasoPaso();
			break;
		case 'ΤΖΟΓΟΣ':
			ProcessFasi.tzogos();
			break;
		case 'ΜΠΑΖΑ':
			ProcessFasi.baza();
			break;
		case 'ΠΛΗΡΩΜΗ':
		case 'ΠΑΣΟ ΠΑΣΟ':
		case 'ΣΟΛΟ':
			ProcessFasi.pliromi();
			break;
		case 'ΣΤΗΣΙΜΟ':
		case 'ΔΗΛΩΣΗ':
		case 'ΑΛΛΑΓΗ':
		case 'ΣΥΜΜΕΤΟΧΗ':
		case 'ΠΑΙΧΝΙΔΙ':
		case 'CLAIM':
			break;
		default:
			mainFyi(errmsg + pexnidi.fasi + ': άγνωστη φάση');
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
				'images/trapoula/asoi.png" style="width: 0.7cm; height: 0.6cm;" alt="" />';
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

	this.agoraData = {};

	this.clearAgora = function() {
		Tools.dialogosClear();
		Pexnidi.agoraData = {};
	};

	this.kaneAgora = function() {
		Sizitisi.sxolioFocus();
		Pexnidi.anamoniEpilogis(Pexnidi.agoraData.div);
		Pexnidi.addKinisi('ΑΓΟΡΑ', Pexnidi.agoraData.agora + ':' + Pexnidi.agoraData.neaFila);
		Pexnidi.clearAgora();
	};

	this.akiriAgora = function() {
		Sizitisi.sxolioFocus();
		Pexnidi.clearAgora();
	};

	this.confirmAsoiHTML = function() {
		var html = '';
		html = '<div class="dialogosAsoiArea">';
		html += '<img class="dialogosAsoiIcon';
		if (!Pexnidi.agoraData.asoi) { html += ' dialogosAsoiOff'; }
		html += '" src="' + globals.server + 'images/trapoula/asoi.png" alt="" />';
		html += '<input type="checkbox" ';
		if (Pexnidi.agoraData.asoi) { html += 'checked="checked" '; }
		html += 'onclick="Pexnidi.agoraData.asoi=!Pexnidi.agoraData.asoi;' +
			'Pexnidi.confirmAgora();" />';
		html += '</div>';
		return html;
	};

	this.confirmAgora = function() {
		Pexnidi.agoraData.agora = (Pexnidi.agoraData.asoi ?  'Y' : 'N') +
			Pexnidi.agoraData.xroma + Pexnidi.agoraData.bazes;

		var html = '';
		html += '<div>Να γίνει αγορά ' + Tools.decodeAgora(Pexnidi.agoraData.agora) +
			';' + '</div><br />';
		if (Pexnidi.isAsoi()) { html += Pexnidi.confirmAsoiHTML(); }
		html += '<div class="dialogosYesNo" onclick="Pexnidi.kaneAgora();" ' +
			'onmouseover="this.style.backgroundColor=\'#FFFF33\';" ' +
			'onmouseout="this.style.backgroundColor=\'#FFFF99\';">ΝΑΙ</div>';
		html += '<div class="dialogosYesNo" onclick="Pexnidi.akiriAgora();" ' +
			'onmouseover="this.style.backgroundColor=\'#FFFF33\';" ' +
			'onmouseout="this.style.backgroundColor=\'#FFFF99\';">ΑΚΥΡΟ</div>';

		Tools.dialogos(html);
	};

	this.epilogiAgoras = function(div, dxb) {
		Sizitisi.sxolioFocus();
		var fila = pexnidi.fila[1];
		var neaFila = '';
		var itzogos = 0;
		pexnidi.prevTzogosFilo = [];
		for (var i = 0; i < 12; i++) {
			if ((i in Dodekada.klidomeno) && (Dodekada.klidomeno[i])) {
				if (isTzogadoros()) {
					pexnidi.prevTzogosFilo[itzogos++] = fila[i];
				}
			}
			else {
				neaFila += fila[i];
			}
		}

		Pexnidi.agoraData.xroma = dxb.substr(1, 1);
		Pexnidi.agoraData.bazes = dxb.substr(2, 1);
		Pexnidi.agoraData.asoi = Pexnidi.isAsoi();
		Pexnidi.agoraData.neaFila = neaFila;
		Pexnidi.agoraData.div = div;
		this.confirmAgora();
	};

	this.axioprepesSolo = function() {
		Sizitisi.sxolioFocus();
		Pexnidi.anamoniEpilogis(Pexnidi.agoraData.div);
		Pexnidi.addKinisi('ΣΟΛΟ', Pexnidi.agoraData.xroma + Pexnidi.agoraData.bazes);
		Pexnidi.clearAgora();
	};

	this.confirmSolo = function() {
		Pexnidi.agoraData.agora = 'N' + Pexnidi.agoraData.xroma +
			Pexnidi.agoraData.bazes;

		var html = '';
		html += '<div>Θέλετε, πράγματι, να τα γράψετε σόλο ' +
			(Pexnidi.agoraData.xroma == 'H' ? 'στις' : 'στα') +
			' <span style="font-weight: bold; white-space: nowrap;">' +
			Tools.decodeAgora(Pexnidi.agoraData.agora, true) +
			';</span></div><br />';
		html += '<div class="dialogosYesNo" onclick="Pexnidi.axioprepesSolo();" ' +
			'onmouseover="this.style.backgroundColor=\'#FFFF33\';" ' +
			'onmouseout="this.style.backgroundColor=\'#FFFF99\';">ΝΑΙ</div>';
		html += '<div class="dialogosYesNo" onclick="Pexnidi.akiriAgora();" ' +
			'onmouseover="this.style.backgroundColor=\'#FFFF33\';" ' +
			'onmouseout="this.style.backgroundColor=\'#FFFF99\';">ΑΚΥΡΟ</div>';

		Tools.dialogos(html, '4.8cm');
	};

	this.epilogiSolo = function(div, dxb) {
		Sizitisi.sxolioFocus();
		if (dxb == 'DTG') { dxb = 'DS6'; }

		Pexnidi.agoraData.xroma = dxb.substr(1, 1);
		Pexnidi.agoraData.bazes = dxb.substr(2, 1);
		Pexnidi.agoraData.solo = true;
		Pexnidi.agoraData.div = div;
		this.confirmSolo();
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

	this.bamBoum = function(ixos, idx, kinisi) {
		if (idx in Spot.spotList) { return; }
		Spot.spotListPush(idx);
		pexnidi.mesaKinisi = kinisi;
		pexnidi.mesaIxos = ixos;
	};
};

var ProcessFasi = new function() {
	this.pasoPasoPaso = function() {
		if (pexnidi.dealer != 1) { return; }
		if (isTheatis()) { return; }
		if (pexnidi.akirosi != 0) { return; }
		if (isPasoPasoPaso()) {
			Pexnidi.addKinisi('ΑΓΟΡΑ', 'NNN', 0);
		}
		else {
			setTimeout(Pexnidi.dianomi, Pexnidi.delay['tzogos']);
		}
	};

	this.tzogos = function() {
		if (pexnidi.dealer != 1) { return; }
		if (isTheatis()) { return; }
		if (pexnidi.akirosi != 0) { return; }
		Pexnidi.addKinisi('ΤΖΟΓΟΣ', '', pexnidi.tzogadoros);
	};

	this.baza = function(delay) {
		if (pexnidi.epomenos != 1) { return; }
		if (isTheatis()) { return; }
		if (pexnidi.akirosi != 0) { return; }
		mainFyi('Μπάζα');
		Pexnidi.addKinisi('ΜΠΑΖΑ', '', pexnidi.epomenos);
	};

	this.pliromi = function() {
		if (pexnidi.akirosi != 0) { return; }
		pexnidi.ixeIpolipo = (pexnidi.ipolipo > 0);
		if (pexnidi.dealer != 1) { return; }
		if (isTheatis()) { return; }
		Pliromi.pliromi();
	};

	this.dianomi = function() {
		if (pexnidi.dealer != 1) { return; }
		if (isTheatis()) { return; }
		if (pexnidi.akirosi != 0) { return; }
		Pexnidi.dianomi();
	};
};

var ProcessKinisi = new function() {
	this.dianomi = function(thesi, data) {
		var x = data.split(':');
		for (var i = 1; i <= 3; i++) {
			pexnidi.fila[i] = Pexnidi.spaseFila(x[partida.map[i]]);
		}
		pexnidi.fasi = 'ΔΗΛΩΣΗ';
		pexnidi.dealer = thesi;
		Pexnidi.setEpomenos(thesi);
	};

	this.dilosi = function(thesi, data) {
		pexnidi.dilosiCount++;
		if (data.match(/^P/)) {
			ProcessKinisi.dilosiPaso(thesi, data);
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
			if ((pexnidi.dilosi[i] == 'DTG') && (!pexnidi.paso[i])) {
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

	this.dilosiPaso = function(thesi, data) {
		pexnidi.paso[thesi] = true;
		pexnidi.pasoCount++;
		if (pexnidi.pasoCount >= 3) {
			pexnidi.fasi = 'ΠΑΣΟ ΠΑΣΟ ΠΑΣΟ';
			pexnidi.epomenos = 0;
			var x = data.split(':');
			pexnidi.tzogos = x.length > 1 ? x[1] : 'RVRV';
			return;
		}
		else if ((pexnidi.pasoCount >= 2) && (pexnidi.curdil == 'DTG')) {
			pexnidi.curdil = 'DS6';
		}
		else if ((pexnidi.pasoCount == 1) && (pexnidi.dilosiCount == 3) &&
			(pexnidi.curdil == 'DD6')) { pexnidi.curdil = 'EC6'; }

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
		pexnidi.tzogadoros = thesi;
		var fila = Pexnidi.deseFila(pexnidi.fila[thesi]) + data;
		pexnidi.fila[thesi] = Pexnidi.spaseFila(fila);
		pexnidi.fasi = 'ΑΛΛΑΓΗ';
		pexnidi.epomenos = thesi;
	};

	this.agora = function(thesi, data) {
		pexnidi.tzogadoros = thesi;
		var x = data.split(':');
		pexnidi.agora = x[0];
		pexnidi.agoraXroma = x[0].substr(1, 1);
		pexnidi.agoraBazes = Tools.bazesDecode(x[0].substr(2, 1));
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

	this.simetoxi = function(thesi, data, ik) {
		var errmsg = 'ProcessKinisi::simetoxi: ';

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
					pexnidi.baza[pexnidi.tzogadoros] = 10;
					pexnidi.bazaCount = 10;
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
					ProcessKinisi.setBoithao(i, ik);
				}
			}
			pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
			Pexnidi.setEpomenos(pexnidi.dealer);
			break;
		default:
			mainFyi(errmsg + data + ': invalid data');
			break;
		}

		if (pexnidi.fasi == 'ΠΑΙΧΝΙΔΙ') {
			Pliromi.setPrepiBazes();
		}
	};

	this.setBoithao = function(thesi, ik) {
		pexnidi.simetoxi[thesi] = 'ΒΟΗΘΑΩ';

		// Δίνουμε ηχητικό σήμα σε περίπτωση που ο παίκτης
		// είναι αυτός που καλείται να παίξει μαζί.
		if (thesi != 1) { return; }
		if (ik != (kinisi.length - 1)) { return; }
		if (isTheatis()) { return; }

		var idx = 'mazi';
		if (idx in Spot.spotList) { return; }

		playSound('bikebell');
		Spot.spotListPush(idx);
	};

	this.filo = function(thesi, data) {
		pexnidi.bazaFilo.push(data);
		pexnidi.bazaPektis.push(thesi);

		var fila = Pexnidi.deseFila(pexnidi.fila[thesi]);
		if ((thesi == 1) && (fila.substr(1, 1) == 'V')) { fila = fila.substr(2); }
		else { fila = fila.replace(data, ''); }
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

	this.baza = function(thesi, kodikos) {
		Pexnidi.resetBaza();
		pexnidi.bazaCount++;
		pexnidi.baza[thesi]++;
		pexnidi.epomenos = thesi;
		Pliromi.checkMesa(kodikos);
		if (pexnidi.bazaCount < 10) {
			pexnidi.fasi = 'ΠΑΙΧΝΙΔΙ';
		}
		else {
			pexnidi.fasi = 'ΠΛΗΡΩΜΗ';
		}
	};

	this.akirosi = function(thesi) {
		pexnidi.akirosi = thesi in partida.pektis ? thesi : 0;
		Pexnidi.filoSeKinisi = 0;
		Pexnidi.bazaSeKinisi = 0;
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
				pexnidi.bazaCount = 10;
			}
			return;
		}

		pexnidi.claim = [];
		pexnidi.fila[thesi] = Pexnidi.spaseFila(data);
		pexnidi.fasi = 'CLAIM';
	};

	this.solo = function(thesi, kodikos, data) {
		var errmsg = 'ProcessKinisi::solo: ';

		// Η κίνηση τύπου "ΣΟΛΟ" περιέχει ως data την
		// αγορά π.χ. S6, D7 κλπ. Επειδή ο τζογαδόρος
		// δεν δήλωσε αγορά, τίθενται τώρα τα στοιχεία
		// της αγοράς, ώστε να μπορέσει να γίνει η
		// πληρωμή.
		pexnidi.agora = 'N' + data;
		pexnidi.agoraXroma = data.substr(0, 1);
		pexnidi.agoraBazes = data.substr(1, 1);

		switch (pexnidi.tzogadoros) {
		case 1: var ena = 2; var dio = 3; break;
		case 2: ena = 3; dio = 1; break;
		case 3: ena = 1; dio = 2; break;
		default:
			mainFyi(errmsg + 'ακαθόριστη θέση τζογαδόρου');
			return;
		}

		// Βαράω τώρα το κανόνι, διότι αν το αφήσω στην πληρωμή
		// (όπως βαράει κανονικά), ακούγεται λίγο ετεροχρονισμένα.
		Pexnidi.bamBoum('kanoni', 'ts', kodikos);

		var xroma = data.substr(0, 1);
		var bazes = data.substr(1, 1);
		switch (bazes) {
		case 7:
			pexnidi.baza[pexnidi.tzogadoros] = 5;
			pexnidi.baza[ena] = 3;
			pexnidi.baza[dio] = 2;
			break;
		case 8:
			pexnidi.baza[pexnidi.tzogadoros] = 6;
			pexnidi.baza[ena] = 2;
			pexnidi.baza[dio] = 2;
			break;
		case 9:
			pexnidi.baza[pexnidi.tzogadoros] = 7;
			pexnidi.baza[ena] = 2;
			pexnidi.baza[dio] = 1;
			break;
		case 'T':
			pexnidi.baza[pexnidi.tzogadoros] = 8;
			pexnidi.baza[ena] = 1;
			pexnidi.baza[dio] = 1;
			break;
		default:
			pexnidi.baza[pexnidi.tzogadoros] = 4;
			pexnidi.baza[ena] = 3;
			pexnidi.baza[dio] = 3;
			break;
		}

		pexnidi.epomenos = 0;
		pexnidi.fasi = 'ΣΟΛΟ';
		pexnidi.fila = [ [], [], [], [] ];
		pexnidi.bazaCount = 10;
	};

	this.pliromi = function(kinisi) {
		Pliromi.checkMesa(kinisi);
		controlPanel.refreshKitapi();
		pexnidi.fasi = 'ΔΙΑΝΟΜΗ';
		Pexnidi.setEpomenos(pexnidi.dealer);
		Pexnidi.filoSeKinisi = 0;
		Pexnidi.bazaSeKinisi = 0;
	};
};

var Xipnitiri = new function() {
	var timer = null;
	var ixos = [
		{t: 10000, s: 'kanarini' },
		{t: 15000, s: 'clocktickfast', i: 'Είναι η σειρά σας…' },
		{t: 10000, s: 'kabanaki' },
		{t: 10000, s: 'sfirixtra' },
		{t: 15000, s: 'korna2' },
		{t: 20000, s: 'korna3' },
		{t: 20000, s: 'dalika', i: 'Οι συμπαίκτες σας περιμένουν…' }
	];

	this.vale = function(skala) {
		if (isSet(timer)) { clearTimeout(timer); }
		timer = null;
		if (skala < ixos.length) {
			timer = setTimeout(function() {
				Xipnitiri.vara(skala);
			}, ixos[skala].t);
		}
	};

	this.vgale = function() {
		if (isSet(timer)) { clearTimeout(timer); }
		timer = null;
	};

	this.vara = function(skala) {
		if (notTheatis()) {
			playSound(ixos[skala].s);
			if (isSet(ixos[skala].i)) { warningBottom(ixos[skala].i); }
		}
		Xipnitiri.vale(skala + 1);
	};
};
