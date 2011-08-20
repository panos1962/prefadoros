var Gipedo = new function() {
	this.stisimoHTML = function() {
		var html = '';
		if (isTheatis()) {
			html += Gipedo.anamoniHTML();
			html += 'Καθορίζεται το ύψος της κάσας και η διάταξη των παικτών ' +
				'στο τραπέζι. Παρακαλώ περιμένετε…';
		}
		else {
			html += 'Ελέγξτε την ' + Gipedo.lexiIconHTML('κάσα (',
				'controlPanel/kasa.png', ')') + ' και τη ' +
				Gipedo.lexiIconHTML('διάταξη (', 'controlPanel/diataxi.png', ')') +
				' των παικτών χρησιμοποιώντας τα σχετικά εργαλεία του control panel. ';
			html += 'Τέλος, πατήστε το πλήκτρο αποδοχής όρων του ' +
				Gipedo.lexiIconHTML('παιχνιδιού (', 'controlPanel/check.png', '),') +
				' ή το πλήκτρο ' + Gipedo.lexiIconHTML('εκκίνησης (',
				'controlPanel/go.jpg', ')') + ' για να ξεκινήσετε την παρτίδα.';
		}
		return html;
	};

	this.dianomiHTML = function() {
		var html = '';
		if (pexnidi.dealer == 1) { html += Gipedo.anamoniDianomiHTML(); }
		else { html += Gipedo.anamoniHTML(); }
		if (isTheatis()) {
			html += 'Και οι τρεις παίκτες δήλωσαν «πάσο». Θα γίνει νέα διανομή. ';
			html += Pexnidi.piosPektis(pexnidi.dealer) + 'μοιράζει φύλλα. ';
		}
		else {
			html += 'Και οι τρεις παίκτες δηλώσατε «πάσο». ';
			html += Pexnidi.piosPektis(pexnidi.dealer, 'Μοιράζετε', 'μοιράζει') + 'φύλλα. ';
		}
		html += 'Παρακαλώ περιμένετε…';
		return html;
	};

	this.dilosiHTML = function() {
		var html = '';
		html += '<img class="tzogosIcon" src="' + globals.server +
			'images/trapoula/tzogos.png" title="Τζόγος" alt="" />';
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

	this.pasoPasoPasoHTML = function() {
		if (!isPPP()) { return Gipedo.dianomiHTML(); };
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

	this.pasoPasoHTML = function() {
		var html = '';
		if (pexnidi.dealer == 3) { html += Gipedo.anamoniDianomiHTML(); }
		else { html += Gipedo.anamoniHTML(); }
		if (isTheatis()) {
			html += 'Οι αμυνόμενοι δεν θα διεκδικήσουν τις μπάζες τους.';
		}
		else {
			html += 'Εσείς και ο συμπαίκτης σας δηλώσατε «πάσο».';
		}
		html += ' Ο τζογαδόρος θα πληρωθεί και θα γίνει νέα διανομή. ' +
				'Παρακαλώ περιμένετε…';
		return html;
	};

	this.alagiTzogouHTML = function() {
		var msg = 'πλειοδότησε και έχει «σηκώσει» τα φύλλα του τζόγου. ' +
			'Παρακαλώ περιμένετε την αγορά του…';
		var html = '';
		if (isTheatis()) {
			if (pexnidi.tzogadoros != 1) { html += Gipedo.anamoniNevrikosHTML(); }
			else { html += Gipedo.anamoniBaresHTML(); }
			html += Pexnidi.piosPektis(pexnidi.tzogadoros) + msg;
		}
		else {
			if (pexnidi.tzogadoros != 1) { html += Gipedo.anamoniNevrikosHTML(); }
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

	this.simetoxiHTML = function() {
		var msg = 'σκέφτεται αν και με ποιο τρόπο θα διεκδικήσει τις ' +
			'μπάζες που του αναλογούν. Παρακαλώ περιμένετε…';
		var html = '';
		if (isTheatis()) {
			if (pexnidi.epomenos == 1) { html += Gipedo.anamoniBaresHTML(); }
			else { html += Gipedo.anamoniNevrikosHTML(); }
			html += Pexnidi.piosPektis(pexnidi.epomenos) + msg;
		}
		else {
			if (pexnidi.tzogadoros == 1) {
				html += Gipedo.anamoniNevrikosHTML();
				html += Pexnidi.piosPektis(pexnidi.epomenos) + msg;
			}
			else if (pexnidi.epomenos == 1) {
				html += 'Αποφασίστε αν και με ποιο τρόπο θα διεκδικήσετε ' +
					'τις μπάζες σας στο παιχνίδι.';
				html += Gipedo.simetoxiEpilogiHTML();
			}
			else {
				html += Gipedo.anamoniNevrikosHTML();
				html += 'Ο συμπαίκτης σας ' + msg;
			}
		}
		return html;
	};

	this.simetoxiEpilogiHTML = function() {
		var html = '';
		var html = '<div class="simetoxiArea">';

		var pasoCount = 0;
		for (var i = 1; i <= 3; i++) {
			if (pexnidi.simetoxi[i] == 'ΠΑΣΟ') { pasoCount++; }
		}

		if (pexnidi.simetoxi[1] == '') {
			if (pasoCount > 0) {
				html += Tools.epilogiHTML('ΠΑΙΖΩ',
					'Pexnidi.epilogiSimetoxi(this, \'ΠΑΙΖΩ\')',
					'Θα διεκδικήσετε τις μπάζες που σας αναλογούν',
					'simetoxiEpilogi');
				html += Tools.epilogiHTML('ΜΑΖΙ',
					'Pexnidi.epilogiSimetoxi(this, \'ΜΑΖΙ\')',
					'Πάμε μαζί!', 'simetoxiEpilogi');
			}
			else {
				html += Tools.epilogiHTML('ΠΑΙΖΩ',
					'Pexnidi.epilogiSimetoxi(this, \'ΠΑΙΖΩ\')',
					'Θα διεκδικήσετε τις μπάζες που σας αναλογούν',
					'simetoxiEpilogi');
			}
			html += Tools.epilogiHTML('ΠΑΣΟ',
				'Pexnidi.epilogiSimetoxi(this, \'ΠΑΣΟ\')',
				'Πάσο', 'simetoxiEpilogi');
		}
		else {
			html += Tools.epilogiHTML('ΜΑΖΙ', 'Pexnidi.epilogiSimetoxi(this, \'ΜΑΖΙ\')',
				'Πάμε μαζί!', 'simetoxiEpilogi');
			if (pexnidi.simetoxi[1] == 'ΠΑΣΟ') {
				html += Tools.epilogiHTML('ΠΑΣΟ',
					'Pexnidi.epilogiSimetoxi(this, \'ΠΑΣΟ\')',
					'Πάσο', 'simetoxiEpilogi');
			}
			else {
				html += Tools.epilogiHTML('ΜΟΝΟΣ',
					'Pexnidi.epilogiSimetoxi(this, \'ΜΟΝΟΣ\')',
					'Θα διεκδικήσετε μόνος τις μπάζες που σας αναλογούν',
					'simetoxiEpilogi');
			}
		}
	
		html += '</div>';
		return html;
	};

	this.pexnidiHTML = function() {
		if (denPezoun()) { return Gipedo.denPezounHTML(); }
		var html = '';
		if (pexnidi.lastBazaFilo.length > 0) {
			html += Gipedo.dixeBazaHTML(pexnidi.lastBazaFilo, pexnidi.lastBazaPektis);
		}
		else {
			html += Gipedo.dixeBazaHTML(pexnidi.bazaFilo, pexnidi.bazaPektis);
		}
		return html;
	};

	this.dixeBazaHTML = function(filo, pektis) {
		var html = '';
		for (var i = 1; i <= 3; i++) {
			html += '<div id="bazaFilo' + i + '">';
			for (var j = 0; j < pektis.length; j++) {
				if (pektis[j] == i) {
					html += '<img class="bazaFilo bazaFilo' + i + '" src="' +
						globals.server + 'images/trapoula/' +
						filo[j] + '.png" alt="" ' +
						'style="z-index: ' + j + ';" />';
					break;
				}
			}
			html += '</div>';
		}
		return html;
	};

	this.denPezounHTML = function() {
		var html = '';
		if (pexnidi.dealer == 3) { html += Gipedo.anamoniDianomiHTML(); }
		else { html += Gipedo.anamoniHTML(); }
		if (pexnidi.tzogadoros == 1) {
			if (isTheatis()) {
				html += 'Οι αμυνόμενοι επέλεξαν να μην διεκδικήσουν τις ' +
					'μπάζες τους σ\' αυτό το παιχνίδι. Ο παίκτης ' +
					'που παρακολουθείτε θα πληρωθεί και θα ακολουθήσει ' +
					'νέα διανομή. Παρακαλώ περιμένετε…';
			}
			else {
				html += 'Οι αμυνόμενοι επέλεξαν να μην διεκδικήσουν τις ' +
					'μπάζες τους σ\' αυτό το παιχνίδι. Θα πληρωθείτε ' +
					'και θα ακολουθήσει νέα διανομή. Παρακαλώ περιμένετε…';
			}
		}
		else if (isTheatis()) {
			html += 'Ο παίκτης που παρακολουθείτε και ο ευμπαίκτης του ' +
				'επέλεξαν να μην διεκδικήσουν τις μπάζες τους σ\' αυτό ' +
				'το παιχνίδι. Ο τζογαδόρος θα πληρωθεί και θα ακολουθήσει ' +
				'νέα διανομή. Παρακλώ περιμένετε…';
		}
		else {
			html += 'Εσείς και ο ευμπαίκτης σας επιλέξατε να μην διεκδικήσετε ' +
				'τις μπάζες σας σ\' αυτό το παιχνίδι. Ο τζογαδόρος θα πληρωθεί ' +
				'και θα ακολουθήσει νέα διανομή. Παρακλώ περιμένετε…';
		}
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
	};

	this.lexiIconHTML = function(prin, src, meta) {
		var html = '';
		html += '<span class="nobr">' + prin;
		html += '<img src="' + globals.server + 'images/' + src + '" ' +
			'class="gipedoTextIcon" alt="" />';
		if (isSet(meta)) { html += meta; }
		html += '</span>';
		return html;
	};

	this.anamoniRigesHTML = function() {
		return Gipedo.anamoniHTML('riges.gif', 'width: 1.8cm;');
	};

	this.anamoniBaresHTML = function() {
		return Gipedo.anamoniHTML('bares.gif', 'width: 0.4cm; height: 0.3cm;');
	};

	this.anamoniDianomiHTML = function() {
		return Gipedo.anamoniHTML('dianomi.gif', 'width: 2.0cm;');
	};

	this.anamoniNevrikosHTML = function() {
		return Gipedo.anamoniHTML('nevrikos.gif', 'width: 1.2cm;');
	};

	this.anamoniHTML = function(img, style) {
		var html = '';
		if (notSet(img)) { img = 'riges.gif'; }
		if (notSet(style)) { style="width: 1.8cm;" }
		html += '<div>';
		html += '<img src="' + globals.server + 'images/' + img + '" ';
		if (isSet(style)) { html += 'style="' + style + '" '; }
		html += 'alt="" />';
		html += '</div>';
		return html;
	};
};
