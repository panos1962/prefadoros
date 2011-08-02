var Partida = new function() {
	this.HTML = '';

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

			if (dedomena.partida.k == partida.k) {
				Partida.ixosIsodosExodos(dedomena.partida);
			}
		}

		partida = dedomena.partida;
	};

	this.ixosIsodosExodos = function(nea) {
		var alagi = false;
		for (var i = 1; i <= 3; i++) {
			var proin = eval('partida.p' + i);
			var nin = eval('nea.p' + i);
			if (proin == nin) { continue; }

			if ((nin == '') || (nin == pektis.login)) {
				var neos = false;
			}
			else {
				var neos = true;
				for (j = 1; j <= 3; j++) {
					var proin = eval('partida.p' + j);
					if (nin == proin) {
						neos = false;
						break;
					}
				}
			}

			if (neos) {
				playSound('doorBell');
				alagi = false;
				break;
			}
			var alagi = true;
		}
		if (alagi) { playSound('blioup'); }
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
		html += 'τραπέζι: <span class="partidaInfoData">' + partida.k + '</span>';
		html += '</div>';

		html += Partida.pektis3HTML();
		html += Partida.pektis2HTML();
		html += Partida.pektis1HTML();

		html += Partida.theatisHTML();

		html += '<div class="partidaInfo partidaInfoBottom">';
		html += 'Information area';
		html += '</div>';

		html += '</div>';
		Partida.HTML = html;
	};

	this.pektis3HTML = function() {
		var html = '';
		html += '<div class="pektis3"';
		html += Partida.thesiTheasisHTML(3);
		html += '>';
		html += '<div class="pektisMain';
		if (isTheatis()) { html += ' theatis'; }
		if (isSet(partida.a3) && (partida.a3 == 0)) { html += ' oxiApodoxi'; }
		if (notSet(partida.o3) || (partida.o3 == 0)) { html += ' offline'; }
		html += '">';
		html += '<div class="pektisData">';
		html += '<div class="pektisName">' + partida.p3 + '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.pektis2HTML = function() {
		var html = '';
		html += '<div class="pektis2"';
		html += Partida.thesiTheasisHTML(2);
		html += '>';
		html += '<div class="pektisMain';
		if (isTheatis()) { html += ' theatis'; }
		if (isSet(partida.a2) && (partida.a2 == 0)) { html += ' oxiApodoxi'; }
		if (notSet(partida.o2) || (partida.o2 == 0)) { html += ' offline'; }
		html += '">';
		html += '<div class="pektisName">' + partida.p2 + '</div>';
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.pektis1HTML = function() {
dianomi = [ true ];
dianomi = [];
		var html = '';
		html += '<div class="pektis1';
		if (isDianomi()) { html += ' pektis1akri'; }
		html += '">';
		html += '<div class="pektisMain pektis1Main';
		if (isDianomi()) { html += ' pektis1MainAkri'; }
		if (isTheatis()) { html += ' theatis'; }
		if (isSet(partida.a1) && (partida.a1 == 0)) { html += ' oxiApodoxi'; }
		if (notSet(partida.o1) || (partida.o1 == 0)) { html += ' offline'; }
		html += '">';
		html += '<div class="pektisName">' + partida.p1 + '</div>';
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.thesiTheasisHTML = function(thesi) {
		var html = '';
		if (notTheatis()) { return html; }
		html += ' onclick="Partida.thesiTheasis(' + thesi + ');"';
		html += ' style="cursor: pointer;"';
		html += ' title="Αλλαγή παρακολουθούμενου παίκτη"';
		return html;
	};

	this.thesiTheasis = function(thesi) {
		var ico = getelid('controlPanelIcon');
		if (notSet(ico)) { return; }
		ico.src = globals.server + 'images/working.gif';
		mainFyi('Αλλαγή παρακολουθούμενου παίκτη');

		var req = new Request('trapezi/thesiTheasis');
		req.xhr.onreadystatechange = function() {
			Partida.thesiTheasisCheck(req, ico);
		};

		var params = 'thesi=' + uri(mapThesi(partida.h, thesi));
		req.send(params);
	};

	this.thesiTheasisCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		ico.src = globals.server + 'images/controlPanel/4Balls.png';
		if (rsp) {
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.theatisHTML = function() {
		var html = '';
		if (notSet(rebelos)) { return html; }

		var protos = '<div class="theatisArea">';
		var count = 0;
		var more = 0;
/*
rebelos = [
	{t:2217,l:'takis'},
	{t:2217,l:'panos1962@gmail.com'},
	{t:2217,l:'hshshs'},
	{t:2217,l:'bolek'},
	{t:2217,l:'panos1962@gmail.com'},
	{t:2217,l:'lolek'},
	{t:2217,l:'sakis'},
	{t:2217,l:'hshshs'}
];
*/
		for (var i = 0; i < rebelos.length; i++) {
			if (isSet(rebelos[i].t) && (rebelos[i].t == partida.k) &&
				(rebelos[i].l != pektis.login)) {
				if (count > 5) {
					if (more <= 0) { var moreProtos = rebelos[i].l; }
					more++;
					continue;
				}
				html += protos;
				protos = '';
				html += Partida.theatisItemHTML(rebelos[i].l);
				count++;
			}
		}
		if (more == 1) { html += Partida.theatisItemHTML(moreProtos); }
		else if (more > 0) { html += '<div>και άλλοι ' + more + '</div>'; }

		if (protos == '') { html += '</div>'; }
		return html;
	};

	this.theatisItemHTML = function(pektis) {
		var html = '';
		html += '<div class="theatisData"';
		html += Trapezi.permesHTML(pektis);
		html += '>';
		html += pektis;
		html += '</div>';
		return html;
	};

	this.noPartidaHTML = function() {
		Partida.HTML = '<div class="partida">';
		Partida.HTML += '<div class="partidaMinima" style="margin-top: 1.8cm;">';
		Partida.HTML += '<div style="padding: 0.6cm;">' + Tools.xromataHTML('1.2cm') + '</div>';
		Partida.HTML += Tools.miaPrefaHTML();
		Partida.HTML += '<div style="width: 80%; margin-left: auto; ' +
			'margin-right: auto; margin-top: 0.6cm;">';
		Partida.HTML += 'Μπορείτε να παραγγείλετε μια πρέφα ' +
			'και μετά να καλέσετε τους φίλους σας στο τραπέζι. ' +
			'Καλή διασκέδαση!';
		Partida.HTML += '</div>';
		Partida.HTML += '</div>';
		Partida.HTML += '</div>';
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
