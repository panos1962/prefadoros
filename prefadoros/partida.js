var Partida = new function() {
	this.HTML = '';

	this.processDedomena = function(dedomena) {
		// Αν δεν υπάρχει πεδίο παρτίδας στα επιστρεφόμενα
		// δεδομένα, σημαίνει ότι δεν έχει αλλάξει κάτι.
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
				if (Partida.bikeNeos(dedomena.partida)) {
					playSound('doorBell');
				}
				else if (dedomena.partida != partida) {
					playSound('blioup');
				}
			}
		}

		partida = dedomena.partida;
	};

	this.bikeNeos = function(nea) {
		var neos = false;
		for (var i = 1; i <= 3; i++) {
			var proin = eval('partida.p' + i);
			var nin = eval('nea.p' + i);
			if (proin == nin) { continue; }
			if (nin == '') { continue; }
			if (nin == pektis.login) { continue; }

			for (j = 1; j <= 3; j++) {
				var proin = eval('partida.p' + j);
				if (nin == proin) { break; }
			}
			if (j > 3) {
				neos = true;
				nea['n' + i] = true;
			}
		}

		return neos;
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

		var tbc = isTheatis() ? ' theatis' : '';
		html += '<div class="partidaInfo partidaInfoTop">';
		html += 'τραπέζι: <span class="partidaInfoData' + tbc + '">';
		html += partida.k + '</span>';
		html += ', κάσα: <span class="partidaInfoData' + tbc + '">';
		html += partida.s + '</span>';
		if (notTheatis()) {
			html += '<img class="kasaPanoKato' + tbc + '" alt="" src="' + globals.server +
				'images/panoKasa.png" title="Αύξηση κάσας κατά 300 καπίκια" ' +
				'onclick="Partida.kasaPanoKato(10, this);" />';
			html += '<img class="kasaPanoKato' + tbc + '" alt="" src="' + globals.server +
				'images/katoKasa.png" title="Μείωση κάσας κατά 300 καπίκια" ' +
				'onclick="Partida.kasaPanoKato(-10, this);" />';
		}
		html += ', υπόλοιπο: <span class="partidaInfoData' + tbc + '">';
		html += pexnidi.ipolipo + '</span>';
		if (isDianomi()) {
			html += ', διανομή: <span class="partidaInfoData' + tbc + '">';
			html += dianomi[dianomi.length - 1].k + '</span>';
		}
		html += '</div>';
		if (isKlisto()) {
			html += '<img class="partidaKlisto" alt="" src="' + globals.server +
				'images/controlPanel/klisto.png" title="Κλειστό τραπέζι" />';
		}

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
		html += Partida.pektisMainHTML(3);
		html += '">';
		html += Partida.onomaPektiHTML(3);
		html += Partida.kapikiaHTML(3);
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
		html += Partida.pektisMainHTML(2);
		html += '">';
		html += Partida.onomaPektiHTML(2);
		html += Partida.kapikiaHTML(2);
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.pektis1HTML = function() {
		var html = '';
		html += '<div class="pektis1';
		if (isDianomi()) { html += ' pektis1akri'; }
		html += '">';
		html += '<div class="pektisMain pektis1Main';
		if (isDianomi()) { html += ' pektis1MainAkri'; }
		html += Partida.pektisMainHTML(1);
		html += '">';
		html += Partida.onomaPektiHTML(1);
		html += Partida.kapikiaHTML(1);
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.onomaPektiHTML = function(thesi) {
		var html = '';
		if (isDianomi() && (pexnidi.pektis[thesi] == '')) {
			html += '<img src="' + globals.server + 'images/gone.png" ' +
				'class="pektisGone" alt="" />';
		}
		else {
			html += '<div class="pektisName">' + pexnidi.pektis[thesi] + '</div>';
			html += Partida.miposBikeTora(thesi);
		}
		return html;
	}

	this.miposBikeTora = function(thesi) {
		if (Prefadoros.show != 'partida') { return ''; }
		if (!(('n' + thesi) in partida)) { return ''; }
		return '<img src="' + globals.server + 'images/hi.png" ' +
			'style="position: absolute; width: 1.6cm; top: -0.8cm; right: -0.1cm;" ' +
			'alt="" onload="Prefadoros.sviseBikeTora(this);" />';
	};

	this.kapikiaHTML = function(thesi) {
		var html = '';
		if (notDianomi()) { return html; }

		html += '<div class="kapikiaArea">';
		if (pexnidi.kapikia[thesi] != 0) {
 			html += '<span class="kapikia">καπίκια:</span>';
 			html += '<span class="kapikia' +
				(pexnidi.kapikia[thesi] > 0 ? 'Sin' : 'Mion') + '">';
			html += pexnidi.kapikia[thesi];
 			html += '</span>';
		}
		else {
 			html += '<img class="kapikiaIcon" src="' + globals.server +
				'images/pare.png" alt="" />';
 			html += '<img class="kapikiaIcon" src="' + globals.server +
				'images/controlPanel/kapikia.png" alt="" />';
 			html += '<img class="kapikiaIcon" src="' + globals.server +
				'images/dose.png" alt="" />';
		}
		html += '</div>';
		return html;
	};

	this.pektisMainHTML = function(thesi) {
		var html = '';
		var pektis = eval('partida.p' + thesi);
		var apodoxi = eval('partida.a' + thesi);
		var online = eval('partida.o' + thesi);
		if (isTheatis()) { html += ' theatis'; }
		if (pektis != '') {
			html += ' ' + ((isSet(apodoxi) && (apodoxi == 0)) ? 'oxiApodoxi' : 'apodoxi');
			if (notSet(online) || (online == 0)) { html += ' offline'; }
		}
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

	this.thesiTheasis = function(thesi, ico) {
		if (notSet(ico)) { ico = getelid('controlPanelIcon'); }
		if (notSet(ico)) { return; }
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		mainFyi('Αλλαγή παρακολουθούμενου παίκτη');

		var req = new Request('trapezi/thesiTheasis');
		req.xhr.onreadystatechange = function() {
			Partida.thesiTheasisCheck(req, ico);
		};

		var params = 'thesi=' + uri(mapThesi(thesi));
		req.send(params);
	};

	this.thesiTheasisCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		ico.src = ico.prevSrc;
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
		Partida.HTML += '<div style="padding: 0.4cm;">' + Tools.xromataHTML('1.2cm') + '</div>';
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
		else {
			controlPanel.display('default');
		}
	};

	this.neaPartida = function() {
		mainFyi('νέα παρτίδα: δεν έχει γίνει ακόμη');
	};

	this.kasaPanoKato = function(dif, ico) {
		if (!isPartida()) { return; }
		if (isTheatis()) { return; }

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working' +
			(dif > 0 ? 'Bilies' : 'Red') + '.gif';

		var req = new Request('trapezi/kasaPanoKato');
		req.xhr.onreadystatechange = function() {
			Partida.kasaPanosKatoCheck(req, ico);
		};

		req.send('dif=' + uri(dif));
	};

	this.kasaPanosKatoCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		ico.src = ico.prevSrc;
		if (rsp) {
			errorIcon(ico);
			playSound('beep');
		}
	};
		
};

Partida.noPartidaHTML();
