// Όλη η διαδικασία του παιχνιδιού κυριαρχείται από τα αντικείμενα "pexnidi",
// "dianomi" και "kinisi".

var Pexnidi = new function() {
	// Η function "setData" καλείται κάθε φορά που έχουμε νέα δεδομένα
	// και σκοπό έχει να θέσει τα στοιχεία του παιχνιδιού στα νέα
	// δεδομένα.

	this.setData = function() {
		pexnidi.ipolipo = 0;
		pexnidi.pektis = [ '', '', '', '' ];
		pexnidi.kapikia = [ 0, 0, 0, 0 ];
		pexnidi.fila = [ [], [], [], [] ];
		pexnidi.mazi = [ false, false, false, false ];
		pexnidi.elima = 0;
		pexnidi.fasi = '';
		pexnidi.dealer = 0;
		pexnidi.epomenos = 0;
		pexnidi.curdil = '';
		pexnidi.dilosi = [ '', '', '', '' ];
		pexnidi.paso = [ false, false, false, false ];
		if (notPartida()) { return;}

		switch (partida.h) {
		case 1:
			var map = [ 0, 1, 2, 3 ];
			var pam = [ 0, 1, 2, 3 ];
			break;
		case 2:
			map = [ 0, 2, 3, 1 ];
			pam = [ 0, 3, 1, 2 ];
			break;
		case 3:
			map = [ 0, 3, 1, 2 ];
			pam = [ 0, 2, 3, 1 ];
			break;
		default:
			alert('pexnidi.setData: λάθος θέση παίκτη');
			map = [ 0, 1, 2, 3 ];
			pam = [ 0, 1, 2, 3 ];
			break;
		}

		Pexnidi.dianomiMap(map, pam);
		Pexnidi.kinisiMap(map, pam);

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

		var x = pexnidi.kapikia[pam[2]] + pexnidi.kapikia[pam[3]];
		pexnidi.elima = pexnidi.kapikia[pam[1]] + x;
		pexnidi.kapikia[pam[1]] = -x;

		for (var i = 0; i < kinisi.length; i++) {
			switch (kinisi[i].i) {
			case 'ΔΙΑΝΟΜΗ':
				pexnidi.fasi = 'ΔΗΛΩΣΗ';
				Pexnidi.setEpomenos(kinisi[i].pektis);
				pexnidi.curdil = 'TG';
				break;
			}
		}
	};

	this.setEpomenos = function(thesi) {
		if (notSet(thesi)) { thesi = pexnidi.epomenos; }
		if (thesi) {
			pexnidi.epomenos = thesi + 1;
			if (pexnidi.epomenos > 3) { pexnidi.epomenos = 1; }
		}
		else {
			pexnidi.epomenos = 0;
		}
	};

	this.dianomiMap = function(map, pam) {
		for (var i = 0; i < dianomi.length; i++) {
			dianomi[i].dealer = pam[dianomi[i].d];
			dianomi[i].kasa = [ 0,
				eval('dianomi[' + i + '].k' + map[1]),
				eval('dianomi[' + i + '].k' + map[2]),
				eval('dianomi[' + i + '].k' + map[3])
			];
			dianomi[i].kapikia = [ 0,
				eval('dianomi[' + i + '].m' + map[1]),
				eval('dianomi[' + i + '].m' + map[2]),
				eval('dianomi[' + i + '].m' + map[3])
			];
		}
	};

	this.kinisiMap = function(map, pam) {
		for (var i = 0; i < kinisi.length; i++) {
			kinisi[i].pektis = pam[kinisi[i].p];
			if (kinisi[i].i == 'ΔΙΑΝΟΜΗ') {
				var x = kinisi[i].d.split(':');
				for (var j = 1; j <= 3; j++) {
					pexnidi.fila[j] = Pexnidi.spaseFila(x[map[j]]);
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
			html += 'Ελέγξτε την ' + Pexnidi.lexiIconHTML('κάσα', 'controlPanel/kasa.png') +
				' και τη ' + Pexnidi.lexiIconHTML('διάταξη', 'controlPanel/diataxi.png') +
				' των παικτών χρησιμοποιώντας τα σχετικά εργαλεία του control panel. ';
			html += 'Τέλος, πατήστε το πλήκτρο αποδοχής όρων του ' +
				Pexnidi.lexiIconHTML('παιχνιδιού', 'controlPanel/check.png') +
				' ή το πλήκτρο ' + Pexnidi.lexiIconHTML('εκκίνησης',
				'controlPanel/go.jpg') + ' για να ξεκινήσετε την παρτίδα.';
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
				'ή αποσύρονται δηλώνοντας "πάσο". Παρακαλώ περιμένετε…';
			html += '</div>';
		}
		if (pexnidi.epomenos == 1) {
			html += '<div class="dilosiArea">';
			if (pexnidi.curdil == 'TG') {
				html += Tools.epilogiHTML('Άμα μείνουν',
					'Pexnidi.epilogiDilosisi()', '', 'dilosi');
				html += Tools.epilogiHTML('ΠΡΩΤΑ',
					'Pexnidi.epilogiDilosisi(\'S6\')', '', 'dilosi');
			}
			else {
				html += Tools.epilogiHTML(pexnidi.dilosi,
					'Pexnidi.epilogiDilosis()', '', 'dilosi');
			}
			html += Tools.epilogiHTML('ΠΑΣΟ',
				'Pexnidi.dilosiPaso()', '', 'dilosi');
			html += '</div>';
		}
		else if (!pexnidi.paso[1]) {
			html += '<div style="position: absolute; z-index: 1;">';
			html += 'Πλειοδοτήστε για την αγορά, ή αποσυρθείτε ' +
				'δηλώνοντας "πάσο". Περιμένετε τη σειρά σας…';
			html += '</div>';
		}
		html += '</div>';
		return html;
	};

	this.epilogiDilosis = function(dilosi) {
		if (notSet(dilosi)) { dilosi = pexnidi.curdil; }
	};

	this.dilosiPaso = function() {
	};

	this.dianomiHTML = function() {
		return 'ΔΙΑΝΟΜΗ';
	};

	this.lexiIconHTML = function(lexi, src, paren) {
		if (notSet(paren)) { paren = true; }
		var html = '';

		html += '<span class="nobr">' + lexi + ' ';
		if (paren) { html += '('; }
		html += Pexnidi.textIcon(src);
		html += '</span>';
		if (paren) { html += ')'; }
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
			'την παρούσα φάση του παιχνιδιού. Παρακαλώ ειδοποιήστε τον ' +
			'προγραμματιστή.';
		html += '</div>';
		return html;
	}
}
