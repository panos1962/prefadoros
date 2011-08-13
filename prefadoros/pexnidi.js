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

	this.resetData = function() {
		pexnidi.pektis = [ '', '', '', '' ];
		pexnidi.kasa = 0;

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

		pexnidi.mazi = [ false, false, false, false ];
	};

	// Η function "setData" καλείται κάθε φορά που έχουμε νέα δεδομένα
	// και σκοπό έχει να θέσει τα στοιχεία του παιχνιδιού στα νέα
	// δεδομένα.

	this.setData = function() {
		Pexnidi.resetData();
		if (notPartida()) { return;}

		pexnidi.fasi = 'ΣΤΗΣΙΜΟ';

		Pexnidi.setMapPam();
		Pexnidi.dianomiMap();
		Pexnidi.kinisiMap();

		pexnidi.kasa = partida.s;
		for (var i = 1; i <= 3; i++) {
			pexnidi.pektis[i] = eval('partida.p' + i);
			pexnidi.kapikia[i] = -(pexnidi.kasa * 10);
		}

		pexnidi.ipolipo = 30 * pexnidi.kasa;
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

		var x = pexnidi.kapikia[pexnidi.pam[2]] + pexnidi.kapikia[pexnidi.pam[3]];
		pexnidi.elima = pexnidi.kapikia[pexnidi.pam[1]] + x;
		pexnidi.kapikia[pexnidi.pam[1]] = -x;

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
				Pexnidi.processKinisiDilosi(kinisi[i].thesi,
					kinisi[i].i, kinisi[i].d);
				break;
			}
		}
	};

	this.setMapPam = function() {
		switch (partida.h) {
		case 1:
			pexnidi.map = [ 0, 1, 2, 3 ];
			pexnidi.pam = [ 0, 1, 2, 3 ];
			break;
		case 2:
			pexnidi.map = [ 0, 2, 3, 1 ];
			pexnidi.pam = [ 0, 3, 1, 2 ];
			break;
		case 3:
			pexnidi.map = [ 0, 3, 1, 2 ];
			pexnidi.pam = [ 0, 2, 3, 1 ];
			break;
		default:
			alert('pexnidi.setData: λάθος θέση παίκτη');
			pexnidi.map = [ 0, 1, 2, 3 ];
			pexnidi.pam = [ 0, 1, 2, 3 ];
			break;
		}
	};

	this.processKinisiDilosi = function(thesi, idos, data) {
		pexnidi.dilosiCount++;
		pexnidi.dilosi[thesi] = data;
		pexnidi.fasi = 'ΔΗΛΩΣΗ';
		Pexnidi.setEpomenos(thesi);
		if (data.match(/^P/)) {
			pexnidi.paso[thesi] = true;
			pexnidi.dilosiPaso[thesi] = data.substr(1, 2);
			return;
		}

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
		else {
			pexnidi.epomenos = 0;
		}
	};

	this.dianomiMap = function() {
		for (var i = 0; i < dianomi.length; i++) {
			dianomi[i].dealer = pexnidi.pam[dianomi[i].d];
			dianomi[i].kasa = [ 0,
				eval('dianomi[' + i + '].k' + pexnidi.map[1]),
				eval('dianomi[' + i + '].k' + pexnidi.map[2]),
				eval('dianomi[' + i + '].k' + pexnidi.map[3])
			];
			dianomi[i].kapikia = [ 0,
				eval('dianomi[' + i + '].m' + pexnidi.map[1]),
				eval('dianomi[' + i + '].m' + pexnidi.map[2]),
				eval('dianomi[' + i + '].m' + pexnidi.map[3])
			];
		}
	};

	this.kinisiMap = function() {
		for (var i = 0; i < kinisi.length; i++) {
			kinisi[i].thesi = pexnidi.pam[kinisi[i].p];
			if (kinisi[i].i == 'ΔΙΑΝΟΜΗ') {
				var x = kinisi[i].d.split(':');
				for (var j = 1; j <= 3; j++) {
					pexnidi.fila[j] = Pexnidi.spaseFila(x[pexnidi.map[j]]);
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

		var n = parseInt(s.length / 2)
		for (var i = 0; i < n; i++) {
			var l = i * 2;
			alif[i] = s.substring(l, l + 2);
			if (alif[i].match(/^S/)) { pikes++; }
			else if (alif[i].match(/^D/)) { kara++; }
			else if (alif[i].match(/^C/)) { spathia++; }
			else if (alif[i].match(/^H/)) { koupes++; }
		}

		if (pikes > 0) {
			if (spathia == 0) { var sira = [ 'D', 'S', 'H' ]; }
			else if (kara > 0) { sira = [ 'S', 'D', 'C', 'H' ]; }
			else { sira = [ 'S', 'H', 'C' ]; }
		}
		else if (spathia > 0) { var sira = [ 'D', 'C', 'H' ]; }
		else { var sira = [ 'D', 'H' ]; }

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
		var html = '<div style="padding: 0.2cm;">';
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
		html += '</div>';
		return html;
	};

	this.xromaBazesHTML = function(dilosi) {
mainFyi(dilosi);
		var html = '';
		var de = dilosi.substr(0, 1);
		var xroma = dilosi.substr(1, 1);
		var bazes = Pexnidi.bazesDecode(dilosi.substr(2, 1));

		html += '<div>';
		html += '<div class="protasiBazes">';
		if (de == 'E') { html += 'Έχω '; }
		html += bazes;
		html += '</div>';
		html += '<img class="protasiXroma" src="' + globals.server +
			'images/trapoula/xroma' + xroma + '.png" alt="" />';
		html += '</div>';
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

		var params = 'thesi=' + uri(pexnidi.map[1]);
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
		return 'ΔΙΑΝΟΜΗ';
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

	this.anamoniHTML = function() {
		var html = '';
		html = '<img src="' + globals.server + 'images/wormspin.gif" ' +
			'class="gipedoAnamoni" alt="" />';
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
}
