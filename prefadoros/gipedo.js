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
		var dealer = pexnidi.dealer + 1;
		if (dealer > 3) { dealer = 1; }
		if (dealer == 1) { html += Gipedo.anamoniDianomiHTML(); }
		else { html += Gipedo.anamoniHTML(); }
		if (pexnidi.fasi == 'ΠΑΣΟ ΠΑΣΟ ΠΑΣΟ') {
			if (isTheatis()) {
				html += 'Και οι τρεις παίκτες δήλωσαν «πάσο». Θα γίνει νέα διανομή. ';
				html += Gipedo.piosPektis(dealer) + 'μοιράζει φύλλα. ';
			}
			else {
				html += 'Και οι τρεις παίκτες δηλώσατε «πάσο». ';
				html += Gipedo.piosPektis(dealer, 'Μοιράζετε', 'μοιράζει') + 'φύλλα. ';
			}
		}
		else {
			if (isTheatis()) {
				html += 'Γίνεται νέα διανομή. ';
				html += Gipedo.piosPektis(dealer) + 'μοιράζει φύλλα. ';
			}
			else {
				html += Gipedo.piosPektis(dealer, 'Μοιράζετε', 'μοιράζει') + 'φύλλα. ';
			}
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
				html += Tools.epilogiHTML(Gipedo.dilosiPerigrafiHTML('DTG'),
					'Pexnidi.epilogiDilosis(this)', '', 'protasi');
				html += Tools.epilogiHTML(Gipedo.dilosiPerigrafiHTML('DS6'),
					'Pexnidi.epilogiDilosis(this, \'DS6\')', '', 'protasi');
			}
			else {
				html += '<div class="protasiKeno">&#8203;</div>';
				html += Tools.epilogiHTML(Gipedo.dilosiPerigrafiHTML(pexnidi.curdil),
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
		if (notTheatis() && (pexnidi.ipolipo <= 0)) {
			html += '<div class="telosAlert" onclick="Gipedo.kliseAlert(event, this);" ' +
				'title="Κλικ για να αποκρύψετε αυτήν την ειδοποίηση">';
			html += 'Η κάσα έχει τελειώσει. Αν θέλετε να συνεχίσετε την ' +
				'παρτίδα, είναι καλό να προσθέσετε κάσα χρησιμοποιώντας ' +
				'το πλήκτρο ';
			html += '<img src="' + globals.server + 'images/panoKasa.png" alt="" ' +
				'style="width: 0.4cm; height: 0.4cm;" />, ';
			html += 'που βρίσκεται στο επάνω αριστερό μέρος του τραπεζιού.';
			html += '<br />';
			html += 'Αν η παρτίδα έχει τελειώσει, τότε θα πρέπει και οι τρεις ' +
				'παίκτες να πατήσετε το πλήκτρο εξόδου ';
			html += '<img src="' + globals.server + 'images/controlPanel/exodos.png" ' +
				'style="width: 0.5cm; height: 0.5cm;" alt="" />, ';
			html += 'που βρίσκεται στο ' +
				'control panel, προκειμένου να αρχειοθετηθεί κανονικά η ' +
				'παρτίδα. Οποιοσδήποτε άλλος τρόπος εξόδου πιθανόν να ' +
				'προκαλέσει απώλεια των δεδομένων της συγκεκριμένης παρτίδας.';
			html += '</div>';
		}
		return html;
	};

	this.kliseAlert = function(e, div) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		div.style.display = 'none';
		return false;
	};

	this.dilosiPerigrafiHTML = function(dilosi) {
		switch (dilosi) {
		case 'DTG': return 'Άμα μείνουν';
		case 'DS6': return 'Πρώτα';
		case 'DC6': return 'Δεύτερα';
		case 'DD6': return 'Τρίτα';
		default: return Pexnidi.xromaBazesHTML(dilosi);
		}
	};

	this.pasoPasoPasoHTML = function() {
		var html = '';
		if (notPasoPasoPaso()) {
			html += '<div>';
			html += Gipedo.dianomiHTML();
			html += '</div>';
			html += '<div class="dixeTzogo">';
			html += '<img class="dixeTzogoIcon" src="' + globals.server +
				'images/trapoula/' + pexnidi.tzogos.substr(0, 2) + '.png" alt="" />';
			html += '<img class="dixeTzogoIcon" src="' + globals.server +
				'images/trapoula/' + pexnidi.tzogos.substr(2, 2) + '.png" alt="" />';
			html += '</div>';
			return html;
		}

		if (isTheatis()) {
			html += 'Και οι τρεις παίκτες δήλωσαν «πάσο». ' +
				'Η διανομή θα παιχτεί και οι παίκτες θα προσπαθήσουν ' +
				'να κάνουν όσο το δυνατόν λιγότερες μπάζες. ' +
				'Παρακαλώ περιμένετε…';
			return html;
		}

		html += 'Και οι τρεις παίκτες δηλώσατε «πάσο». ' +
			'Θα παίξετε τη διανομή προσπαθώντας να κάνετε όσο το ' +
			'δυνατόν λιγότερες μπάζες. Περιμένετε τη σειρά σας…';
		return html;
	};

	this.tzogosHTML = function() {
		var msg = 'πλειοδότησε και έχει «κερδίσει» τα φύλλα του τζόγου. ' +
			'Παρακαλώ περιμένετε…';
		var html = '';
		html += '<img class="tzogosIcon" src="' + globals.server +
			'images/trapoula/tzogos.png" title="Τζόγος" alt="" />';
		html += '<div style="position: absolute; z-index: 1;">';
		if (isTheatis()) {
			if (pexnidi.tzogadoros != 1) { html += Gipedo.anamoniNevrikosHTML(); }
			else { html += Gipedo.anamoniBaresHTML(); }
			html += Gipedo.piosPektis(pexnidi.tzogadoros) + msg;
		}
		else if (pexnidi.tzogadoros == 1) {
			html += Gipedo.anamoniBaresHTML();
			html += 'Πλειοδοτήσατε και έχετε «κερδίσει» τα φύλλα του τζόγου ' +
				'τα οποία θα παραλάβετε σύντομα. Παρακαλώ περιμένετε…';
		}
		else {
			html += Gipedo.anamoniNevrikosHTML();
			html += Gipedo.piosPektis(pexnidi.tzogadoros) + msg;
		}
		html += '</div>';
		return html;
	};

	this.alagiTzogouHTML = function() {
		var msg = 'πλειοδότησε και έχει «σηκώσει» τα φύλλα του τζόγου. ' +
			'Παρακαλώ περιμένετε την αγορά του…';
		var html = '';
		if (isTheatis()) {
			if (pexnidi.tzogadoros != 1) { html += Gipedo.anamoniNevrikosHTML(); }
			else { html += Gipedo.anamoniBaresHTML(); }
			html += Gipedo.piosPektis(pexnidi.tzogadoros) + msg;
		}
		else {
			if (pexnidi.tzogadoros != 1) { html += Gipedo.anamoniNevrikosHTML(); }
			html += Gipedo.piosPektis(pexnidi.tzogadoros,
				'Πλειοδοτήσατε και έχετε ήδη «σηκώσει» τα φύλλα του τζόγου. ' +
				'Ξεσκαρτάρετε δύο φύλλα και επιλέξτε την αγορά σας.', msg);
		}
		return html;
	};

	this.dixeAgoresHTML = function() {
		var dilosi = pexnidi.dilosi[pexnidi.tzogadoros];
		var xromaAgoras = dilosi.substr(1, 1);
		var bazesAgoras = Tools.bazesDecode(dilosi.substr(2, 1));
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
					'Pexnidi.epilogiSolo(this, \'' + dilosi + '\')',
					'Σολάρετε αξιοπρεπώς!', 'protasiAgora');
				html += '</td>';
			}
			html += '</tr>';
		}
		html += '</table>';

		if (Pexnidi.isAsoi()) {
			html += '<img class="spotAsoi" src="' + globals.server;
			if ('4A' in Spot.spotList) {
				html += 'images/trapoula/asoi.png"';
			}
			else {
				Spot.spotListPush('4A');
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
			html += Gipedo.piosPektis(pexnidi.epomenos) + msg;
		}
		else {
			if (pexnidi.tzogadoros == 1) {
				html += Gipedo.anamoniNevrikosHTML();
				html += Gipedo.piosPektis(pexnidi.epomenos) + msg;
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

	this.pasoPasoHTML = function() {
		var html = '';
		if (pexnidi.dealer == 3) { html += Gipedo.anamoniDianomiHTML(); }
		else { html += Gipedo.anamoniHTML(); }
		if (isTheatis() || (pexnidi.tzogadoros == 1)) {
			html += 'Οι αμυνόμενοι δεν θα διεκδικήσουν τις μπάζες τους.';
		}
		else {
			html += 'Εσείς και ο συμπαίκτης σας δηλώσατε «πάσο».';
		}
		html += ' Ο τζογαδόρος θα πληρωθεί και θα γίνει νέα διανομή. ' +
				'Παρακαλώ περιμένετε…';
		return html;
	};

	this.pexnidiHTML = function() {
		if (denPezoun()) { return Gipedo.denPezounHTML(); }
		var html = '';
		if (pexnidi.bazaFilo.length <= 0) {
			if (notTheatis() && (pexnidi.epomenos == 1)) {
				html += 'Παίξτε ένα φύλλο…';
			}
		}
		html += Gipedo.dixeBazaHTML(pexnidi.bazaFilo, pexnidi.bazaPektis);
		return html;
	};

	this.pliromiHTML = function() {
		var html = '';
		var dealer = pexnidi.dealer + 1;
		if (dealer > 3) { dealer = 1; }
		if (dealer == 1) { html += Gipedo.anamoniDianomiHTML(); }
		else { html += Gipedo.anamoniHTML(); }
		html += 'Γίνεται πληρωμή και θα ακολουθήσει νέα διανομή. ';
		if (isTheatis()) {
			html += Gipedo.piosPektis(dealer) + 'μοιράζει φύλλα.';
		}
		else {
			html += Gipedo.piosPektis(dealer, 'Μοιράζετε', 'μοιράζει') + 'φύλλα.';
		}
		html += ' Παρακαλώ περιμένετε…';
		return html;
	};

	this.dixeBazaHTML = function(filo, pektis) {
		var html = '';
		html += '<div id="baza" class="baza">';
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
		html += '</div>';
		return html;
	};

	this.telefteaBazaHTML = function() {
		var html = '';
		if (pexnidi.prevBazaFilo.length <= 0) { return html; }
		for (var i = 1; i <= 3; i++) {
			html += '<div>';
			for (var j = 0; j < pexnidi.prevBazaFilo.length; j++) {
				if (pexnidi.prevBazaPektis[j] == i) {
					html += '<img class="bazaFilo telefteaBazaFilo' + i + '" src="' +
						globals.server + 'images/trapoula/' +
						pexnidi.prevBazaFilo[j] + '.png" alt="" ' +
						'style="z-index: 1' + j + ';" />';
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

	this.claimHTML = function() {
		var html = '';
		html += '<div>';
		if (isTheatis()) {
			html += 'Ο τζογαδόρος ισχυρίζεται ότι δεν χάνει άλλη μπάζα.';
		}
		else if (pexnidi.tzogadoros == 1) {
			html += 'Ζητώ τις υπόλοιπες μπάζες…';
		}
		else {
			html += 'Δεν δίνω άλλη μπάζα!'
		}
		html += '</div>';
		html += '<div style="position: relative;">';
		html += Partida.filaHTML(pexnidi.fila[pexnidi.tzogadoros]);
		if (notTheatis() && (pexnidi.tzogadoros != 1) && (pexnidi.epomenos == 1)) {
			html += Tools.epilogiHTML('ΝΑΙ', 'Pexnidi.claim(this, true)',
				'Συμφωνώ, τις δίνω όλες…', 'claim claimYes');
			html += Tools.epilogiHTML('ΟΧΙ', 'Pexnidi.claim(this, false)',
				'Διαφωνώ. Μάζεψε τα φύλλα σου!', 'claim claimNo');
		}
		html += '</div>';
		return html;
	};

	this.soloHTML = function() {
		var html = '';
		if (notTheatis() && (pexnidi.tzogadoros == 1)) {
			if (notTheatis()) { html += Gipedo.anamoniBaresHTML(); }
			else { html += Gipedo.anamoniHTML(); }
			html += 'Σολάρατε αξιοπρεπώς.';
		}
		else {
			html += Gipedo.anamoniHTML();
			html += 'Ο τζογαδόρος σολάρισε με αξιοπρέπεια.';
		}
		html += ' Γίνεται πληρωμή. Παρακαλώ περιμένετε…';
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

		mainFyi('Αδυναμία προσανατολισμού (ακαθόριστη θέση)');
		return 'Κάποιος παίκτης ';
	};
};
