var Partida = new function() {
	this.html = '';

	this.processDedomena = function(dedomena) {
		// Αν δεν υπάρχει πεδίο παρτίδας στα επιστρεφόμενα
		// δεδομένα, σημαίνιε ότι δεν έχει αλλάξει κάτι.
		if (notSet(dedomena.partida)) {
			return;
		}

		// Έχει επιστραφεί παρτίδα και θα ελεγθεί με την τρέχουσα.
		// Δεν παράγω ήχους εμφάνισης ή εξαφάνισης της παρτίδας,
		// διότι θα παραχθούν από τα τραπέζια του καφενείου.

		if (isPartida()) {
			if (notSet(dedomena.partida.k)) {
				partida = {};
				return;
			}

			for (var i = 1; i <= 3; i++) {
				var proin = eval('partida.p' + i);
				var nin = eval('dedomena.partida.p' + i);
				if (proin == nin) { continue; }

				if ((proin == '') && (nin != pektis.login)) {
					playSound('doorBell');
					break;
				}

				if ((nin == '') && (proin != pektis.login)) {
					playSound('blioup');
					break;
				}
			}
		}

		partida = dedomena.partida;
	};

	this.updateHTML = function() {
		if (notPartida()) {
			Partida.noPartidaHTML();
			return;
		}

		var html = '';
		html = '<div class="partida';
		if (partida.t) { html += ' partidaTheatis'; }
		if (partida.p) { html += ' partidaPrive'; }
		html += '">';
		html += '<div class="partidaInfo partidaInfoTop">';
		html += 'AAA';
		html += '</div>';
		html += Partida.pektis3html();
		html += Partida.pektis2html();
		html += Partida.pektis1html();
		html += '<div class="partidaInfo partidaInfoBottom">';
		html += 'BBB';
		html += '</div>';
		html += '</div>';
		Partida.html = html;
	};

	this.pektis3html = function() {
		var html = '';
		html += '<div class="pektis3">';
		html += '<div class="pektisMain';
		if (isTheatis()) { html += ' theatis'; }
		if (isSet(partida.a3) && (partida.a3 == 0)) { html += ' oxiApodoxi'; }
		html += '">';
		html += '<div class="pektisData">';
		html += '<div class="pektisName">' + partida.p3 + '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.pektis2html = function() {
		var html = '';
		html += '<div class="pektis2">';
		html += '<div class="pektisMain';
		if (isTheatis()) { html += ' theatis'; }
		if (isSet(partida.a2) && (partida.a2 == 0)) { html += ' oxiApodoxi'; }
		html += '">';
		html += '<div class="pektisName">' + partida.p2 + '</div>';
		html += partida.p2;
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.pektis1html = function() {
		var html = '';
		html += '<div class="pektis1';
		if (isDianomi()) { html += ' pektis1akri'; }
		html += '">';
		html += '<div class="pektisMain';
		if (isDianomi()) { html += ' pektis1MainAkri'; }
		if (isTheatis()) { html += ' theatis'; }
		if (isSet(partida.a1) && (partida.a1 == 0)) { html += ' oxiApodoxi'; }
		html += '">';
		html += '<div class="pektisName">' + partida.p1 + '</div>';
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.noPartidaHTML = function() {
		Partida.html = '<div class="partida">';
		Partida.html += '<div class="partidaMinima" style="margin-top: 1.8cm;">';
		Partida.html += '<div style="padding: 0.6cm;">' + Tools.xromataHTML('1.2cm') + '</div>';
		Partida.html += Tools.miaPrefaHTML();
		Partida.html += '<div style="width: 80%; margin-left: auto; ' +
			'margin-right: auto; margin-top: 0.6cm;">';
		Partida.html += 'Μπορείτε να παραγγείλετε μια πρέφα ' +
			'και μετά να καλέσετε τους φίλους σας στο τραπέζι. ' +
			'Καλή διασκέδαση!';
		Partida.html += '</div>';
		Partida.html += '</div>';
		Partida.html += '</div>';
	};

	this.neoTrapezi = function() {
		if (isPartida()) { return; }

		var ico = getelid('controlPanelIcon');
		if (notSet(ico)) { return; }
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/neoTrapezi');
		req.xhr.onreadystatechange = function() {
			Partida.neoTrapeziCheck(req, ico);
		};

		req.send();
	};

	this.neoTrapeziCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		ico.src = globals.server + 'images/controlPanel/4Balls.png';
		if (rsp) {
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.neaPartida = function() {
		mainFyi('νέα παρτίδα: δεν έχει γίνει ακόμη');
	};
};

Partida.noPartidaHTML();
