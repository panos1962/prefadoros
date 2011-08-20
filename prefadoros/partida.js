var Partida = new function() {
	this.HTML = '';

	this.processDedomena = function(dedomena) {
		// Αν δεν υπάρχει πεδίο παρτίδας στα επιστρεφόμενα
		// δεδομένα, σημαίνει ότι δεν έχει αλλάξει κάτι.
		if (notSet(dedomena.partida)) { return; }

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
				else if (Partida.iparxiAlagi(dedomena.partida, partida)) {
					Partida.ixosAlagis(dedomena.partida);
				}
				else {
					return;
				}
			}
		}

		partida = dedomena.partida;
		Partida.setData();
	};

	// Ελέγχω για τυχόν διαφορές στα πρωτογενή δεδομένα μεταξύ
	// νέας και τρέχουσας παρτίδας.

	this.iparxiAlagi = function(nea, cur) {
		// Ακολουθεί λίστα με τα πρωτογενή δεδομένα της παρτίδας,
		// δηλαδή τα πεδία τα οποία επιστρέφονται από τον server,
		// τα οποία φροντίζω να μην πειράξω, ούτε να αντιστοιχίσω
		// στις θέσεις που εμφανίζονται στον client.
		var attr = [
			'p1', 'a1', 'o1',
			'p2', 'a2', 'o2',
			'p3', 'a3', 'o3',
			's', 'p', 'b',
			'ppp', 'h', 't'
		];

		for (var i in attr) {
			if (isSet(nea[attr[i]]) && notSet(cur[attr[i]])) { return true; }
			if (notSet(nea[attr[i]]) && isSet(cur[attr[i]])) { return true; }
			if (isSet(nea[attr[i]]) && isSet(cur[attr[i]]) &&
				(nea[attr[i]] != cur[attr[i]])) { return true; }
		}

		return false;
	};

	// Θέτω όλα τα δευτερογενή πεδία της παρτίδας λαμβάνοντας υπόψη τη
	// θέση του παίκτη/θεατή στο τραπέζι και κάνοντας τις κατάλληλες
	// αντιστοιχίσεις. Δεν πειράζω, όμως, τα πρωτογενή δεδομένα.

	this.setData = function() {
		if (notSet(partida.k)) { return; }
		if (notSet(partida.h)) { return fatalError('Partida.setData: ακαθόριστη θέση παίκτη'); }

		partida.kodikos = parseInt(partida.k);
		partida.kasa = parseInt(partida.s);
		partida.ppp = (partida.ppp == 1);
		partida.prive = (partida.p == 1);
		partida.klisto = (partida.b == 1);
		partida.theatis = (partida.t == 1);

		switch (partida.thesi = parseInt(partida.h)) {
		case 1:
			partida.map = [ 0, 1, 2, 3 ];
			partida.pam = [ 0, 1, 2, 3 ];
			break;
		case 2:
			partida.map = [ 0, 2, 3, 1 ];
			partida.pam = [ 0, 3, 1, 2 ];
			break;
		case 3:
			partida.map = [ 0, 3, 1, 2 ];
			partida.pam = [ 0, 2, 3, 1 ];
			break;
		default:
			return fatalError('partida.setMapPam: λάθος θέση παίκτη');
		}

		partida.pektis = [ '', '', '', '' ];
		partida.apodoxi = [ false, false, false, false ];
		partida.online = [ false, false, false, false ];
		partida.molisBike = [ false, false, false, false ];
		for (var i = 1; i <= 3; i++) {
			partida.pektis[i] = eval('partida.p' + partida.map[i]);
			partida.apodoxi[i] = (eval('partida.a' + partida.map[i]) == 1);
			partida.online[i] = (eval('partida.o' + partida.map[i]) == 1);
			if (('n' + partida.map[i]) in partida) { partida.molisBike[i] = true; }
		}
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

	// Εδώ κάνουμε τον κόπο να δούμε τι έχει αλλάξει στην παρτίδα και
	// να παράξουμε τους ανάλογους ήχους. Η είσοδος νέου παίκτη έχει
	// ήδη ελεχθεί παραπάνω.

	this.ixosAlagis = function(neaPartida) {
		if (notSet(window.partida)) { return playSound('pop'); }
		if (notSet(neaPartida)) { return playSound('blioup'); }

		var alagi = false;
		for (var i = 1; i <= 3; i++) {
			var n = eval('neaPartida.p' + i);
			var p = eval('partida.p' + i);
			if (n == p) { continue; }
			if (n != '') { return playSound('tap', 10); }
			alagi = true;
		}
		if (alagi) { return playSound('blioup'); }

		if (neaPartida.s != partida.s) { return playSound('blioup'); }
		for (var i = 1; i <= 3; i++) {
			var n = eval('neaPartida.a' + i);
			var p = eval('partida.a' + i);
			if (n == p) { continue; }
			if (n) { return playSound('pop'); }
			return playSound('blioup');
		}

		for (var i = 1; i <= 3; i++) {
			var n = eval('neaPartida.o' + i);
			var p = eval('partida.o' + i);
			if (n == p) { continue; }
			if (n) { return playSound('pop'); }
			return playSound('blioup');
		}

		playSound('tic');
	};

	this.updateHTML = function() {
		if (notPartida()) {
			Partida.noPartidaHTML();
			return;
		}

		var html = '';
		html = '<div class="partida';
		if (partida.theatis) { html += ' partidaTheatis'; }
		if (partida.prive) { html += ' partidaPrive'; }
		html += '">';

		html += Partida.panoInfoHTML();

		html += Partida.pektis3HTML();
		html += Partida.pektis2HTML();
		html += Partida.pektis1HTML();

		html += Partida.theatisHTML();
		html += Partida.gipedoHTML();

		html += '<div class="partidaInfo partidaInfoBottom">';
		html += 'Information area';
		html += '</div>';

		html += '</div>';
		Partida.HTML = html;
	};

	this.panoInfoHTML = function() {
		var html = '';
		var tbc = isTheatis() ? ' theatis' : '';
		html += '<div class="partidaInfo partidaInfoTop">';
		html += '[&nbsp;<span title="Κωδικός τραπεζιού" class="partidaInfoData' + tbc + '">';
		html += partida.kodikos + '</span>';
		if (isDianomi()) {
			html += '#<span title="Κωδικός διανομής" class="partidaInfoData' + tbc + '">';
			html += dianomi[dianomi.length - 1].k + '</span>';
		}
		html += '&nbsp;]&nbsp;<span title="Αρχική κάσα" class="partidaInfoData' + tbc + '">';
		html += partida.kasa + '</span>';
		if (notTheatis()) {
			html += '<img class="kasaPanoKato' + tbc + '" alt="" src="' + globals.server +
				'images/panoKasa.png" title="Αύξηση κάσας κατά 300 καπίκια" ' +
				'onclick="Partida.kasaPanoKato(10, this);" />';
			html += '<img class="kasaPanoKato' + tbc + '" alt="" src="' + globals.server +
				'images/katoKasa.png" title="Μείωση κάσας κατά 300 καπίκια" ' +
				'onclick="Partida.kasaPanoKato(-10, this);" />';
		}
		html += '&nbsp;<span title="Υπόλοιπο κάσας" class="partidaInfoData' + tbc + '">';
		html += pexnidi.ipolipo + '</span>';
		html += '</div>';
		if (isKlisto() || isPPP()) {
			html += '<div class="partidaAttrArea">';
			if (isKlisto()) {
				html += '<img class="partidaAttrIcon" alt="" src="' + globals.server +
					'images/controlPanel/klisto.png" title="Κλειστό τραπέζι" />';
			}
			if (isPPP()) {
				html += '<img class="partidaAttrIcon" alt="" src="' + globals.server +
					'images/controlPanel/ppp.png" title="Παίζεται το πάσο, πάσο, πάσο" />';
			}
			html += '</div>';
		}
		return html;
	};

	this.pektis3HTML = function() {
		var html = '';
		html += '<div class="pektis3';
		if (isTheatis()) { html += ' theatis'; }
		html += '"';
		html += Partida.thesiTheasisHTML(3);
		html += '>';
		html += '<div class="pektisMain';
		html += Partida.pektisMainHTML(3);
		html += '">';
		html += Partida.dpmHTML(3);
		html += Partida.onomaPektiHTML(3);
		html += Partida.kapikiaHTML(3);
		html += Partida.dilosiAgoraHTML(3);
		html += Partida.rologakiHTML(3);
		html += '</div>';
		html += Partida.pasoSimetoxiHTML(3);
		html += '</div>';
		return html;
	};

	this.pektis2HTML = function() {
		var html = '';
		html += '<div class="pektis2';
		if (isTheatis()) { html += ' theatis'; }
		html += '"';
		html += Partida.thesiTheasisHTML(2);
		html += '>';
		html += '<div class="pektisMain';
		html += Partida.pektisMainHTML(2);
		html += '">';
		html += Partida.dpmHTML(2);
		html += Partida.onomaPektiHTML(2);
		html += Partida.kapikiaHTML(2);
		html += Partida.dilosiAgoraHTML(2);
		html += Partida.rologakiHTML(2);
		html += '</div>';
		html += Partida.pasoSimetoxiHTML(2);
		html += '</div>';
		return html;
	};

	this.pektis1HTML = function() {
		var html = '';
		html += '<div class="pektis1';
		if (isDianomi()) { html += ' pektis1akri'; }
		if (isTheatis()) { html += ' theatis'; }
		html += '">';
		html += Partida.pasoSimetoxiHTML(1);
		html += '<div class="pektisMain pektis1Main';
		if (isDianomi()) { html += ' pektis1MainAkri'; }
		html += Partida.pektisMainHTML(1);
		html += '">';
		html += Partida.dpmHTML(1);
		html += Partida.onomaPektiHTML(1);
		html += Partida.kapikiaHTML(1);
		html += Partida.dilosiAgoraHTML(1);
		html += Partida.rologakiHTML(1);
		html += '</div>';
		html += '</div>';
		html += '<div class="fila1Area">';
		html += Partida.filaHTML(pexnidi.fila[1]);
		html += '</div>';
		return html;
	};

	this.filaHTML = function(fila) {
		var html = '';
		if (fila.length <= 0) { return html; }

		var tzogos = ((pexnidi.fasi == 'ΤΖΟΓΟΣ') && isTzogadoros());
		var pezon = ((pexnidi.fasi == 'ΠΑΙΧΝΙΔΙ') && isEpomenos());
		if (pezon) { Dekada.setEpitrepto(fila); }

		var proto = ' style="margin-left: 0px;"';
		for (var i = 0; i < fila.length; i++) {
			html += '<div class="filaSira';
			if (tzogos) { html += ' filaSiraSteno filoSteno'; }
			html += '"' + proto + '>';
			proto = '';
			html += '<img class="filaSiraIcon';
			if (tzogos) { html += ' filoSteno'; }
			html += '" src="' + globals.server + 'images/trapoula/' +
				fila[i] + '.png" alt="" ';
			if (tzogos && notTheatis()) { html += Dodekada.dodekadaHTML(i); }
			else if (pezon && notTheatis()) { html += Dekada.dekadaHTML(fila[i], i); }
			html += ' />';
			html += '</div>';
		}
		return html;
	};

	this.onomaPektiHTML = function(thesi) {
		var html = '';
		if (isDianomi() && (partida.pektis[thesi] == '')) {
			html += '<img src="' + globals.server + 'images/gone.png" ' +
				'class="pektisGone" alt="" />';
		}
		else {
			html += '<div class="pektisName">' + partida.pektis[thesi] + '</div>';
			html += Partida.miposBikeTora(thesi);
		}
		return html;
	}

	this.miposBikeTora = function(thesi) {
		if (Prefadoros.show != 'partida') { return ''; }
		if (!partida.molisBike[thesi]) { return ''; }
		partida.molisBike[thesi] = false;
		return '<img src="' + globals.server + 'images/hi.png" ' +
			'style="position: absolute; width: 1.6cm; top: -0.8cm; right: -0.1cm;" ' +
			'alt="" onload="Prefadoros.sviseBikeTora(this);" />';
	};

	this.kapikiaHTML = function(thesi) {
		var html = '';
		if (notDianomi()) { return html; }

		html += '<div class="kapikiaArea">';
		if (isSet(pektis.kapikia) && pektis.kapikia && (pexnidi.kapikia[thesi] != 0)) {
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

	this.dilosiAgoraHTML = function(thesi) {
		var html1 = '';
		if (isTzogadoros(thesi) && (pexnidi.agora != '')) {
			// Είμαστε στη θέση του τζογαδόρου και έχει δηλωθεί η αγορά.
			html1 += '<div class="dilosiPekti">';
			var telkin = kinisi[kinisi.length - 1];
			var spotIdx = 'a' + telkin.k;
			if (spotIdx in Pexnidi.spotList) { spot = false; }
			else {
				spot = true;
				Pexnidi.spotListPush(spotIdx);
			}

			html1 += Pexnidi.xromaBazesHTML(pexnidi.agora, null, null, spot);
			html1 += '</div>';
		}
		else if (pexnidi.dilosi[thesi]) {
			// Είμαστε σε θέση όπου έχει γίνει κάποια δήλωση. Εδώ
			// θα εμφανιστεί η δήλωση και θα είναι είτε με κανονική
			// γραφή, είτε αχνή εφόσον ο παίκτης πήγε αργότερα πάσο.
			var telkin = kinisi[kinisi.length - 1];
			html1 += '<div class="dilosiPekti';
			if (pexnidi.paso[thesi]) { html1 += ' dilosiPaso'; }
			html1 += '">';
			var spot = (notTzogadoros(thesi) && isSet(telkin) && (telkin.thesi == thesi) &&
				(telkin.i == 'ΔΗΛΩΣΗ') && (telkin.d == pexnidi.dilosi[thesi]));
			var spotIdx = 'k' + telkin.k;
			if (spotIdx in Pexnidi.spotList) { spot = false; }
			else if (spot) { Pexnidi.spotListPush(spotIdx); }
			html1 += Pexnidi.xromaBazesHTML(pexnidi.dilosi[thesi], null, null, spot);
			html1 += '</div>';
			if (isTzogadoros(thesi)) {
				html1 += '<img class="pektisTzogosIcon" src="' + globals.server;
				var spotIdx = 'z' + telkin.k;
				if (spotIdx in Pexnidi.spotList) {
					html1 += 'images/trapoula/tzogos.png"';
				}
				else {
					Pexnidi.spotListPush(spotIdx);
					html1 += 'images/asteraki.gif" onload="Tools.metalagi(this, \'' +
						globals.server + 'images/trapoula/tzogos.png\', 700);"';
				}
				html1 += ' alt="" />';
			}
		}
		else if (pexnidi.paso[thesi]) {
			// Δεν έχω δήλωση, αλλά έχει πάει πάσο.
			html1 += '<div class="dilosiPekti dilosiPaso">';
			html1 += 'ΠΑΣΟ';
			html1 += '</div>';
		}

		var html = '';
		if (html1) {
			html = '<div class="dilosiArea';
			if (isTzogadoros(thesi)) { html += ' dilosiAgora'; }
			html += '">' + html1 + '</div>';
		}
		return html;
	};

	this.pasoSimetoxiHTML = function(thesi) {
		var html = '';
		switch (pexnidi.fasi) {
		case 'ΔΗΛΩΣΗ':
			if (pexnidi.paso[thesi]) {
				html += '<div class="pasoSimetoxi pasoSimetoxi' + thesi +
					' simetoxiPaso">';
				html += 'ΠΑΣΟ';
				html += '</div>';
			}
			else if (thesi == pexnidi.epomenos) {
				html += '<div class="pasoSimetoxi pasoSimetoxi' + thesi +
					' simetoxiDilosi">';
				html += '<div style="display: inline-block;">';
				html += '&hellip;';
				html += '</div>';
				html += Pexnidi.xromaBazesHTML(pexnidi.curdil, 'skepsiBazes',
					'skepsiXroma');
				html += '</div>';
			}
			break;
		case 'ΣΥΜΜΕΤΟΧΗ':
		case 'ΠΑΙΧΝΙΔΙ':
			switch (pexnidi.simetoxi[thesi]) {
			case 'ΠΑΙΖΩ':
				html += '<div class="pasoSimetoxi pasoSimetoxi' + thesi +
					' simetoxi simetoxiPezo">';
				html += 'ΠΑΙΖΩ';
				html += '</div>';
				break;
			case 'ΠΑΣΟ':
				html += '<div class="pasoSimetoxi pasoSimetoxi' + thesi +
					' simetoxi simetoxiPaso">';
				html += 'ΠΑΣΟ';
				html += '</div>';
				break;
			case 'ΜΑΖΙ':
				html += '<div class="pasoSimetoxi pasoSimetoxi' + thesi +
					' simetoxi simetoxiMazi">';
				html += 'ΜΑΖΙ';
				html += '</div>';
				break;
			case 'ΜΟΝΟΣ':
				html += '<div class="pasoSimetoxi pasoSimetoxi' + thesi +
					' simetoxi simetoxiMonos">';
				html += 'ΜΟΝΟΣ';
				html += '</div>';
				break;
			case 'ΒΟΗΘΑΩ':
				html += '<div class="pasoSimetoxi pasoSimetoxi' + thesi +
					' simetoxi simetoxiVoithao">';
				html += 'ΒΟΗΘΑΩ';
				html += '</div>';
				break;
			}
			break;
		}
		return html;
	};

	this.pektisMainHTML = function(thesi) {
		var html = '';
		if (isTheatis()) { html += ' theatis'; }
		if (denPezi(thesi)) {
			html += ' paso';
			if (isTheatis()) { html += ' pasoTheatis'; }
		}
		else if (isVoithao(thesi)) { html += ' voithao'; }
		if (partida.pektis[thesi] != '') {
			html += ' ' + (partida.apodoxi[thesi] ? 'apodoxi' : 'oxiApodoxi');
			if (!partida.online[thesi]) { html += ' offline'; }
			if (thesi == pexnidi.epomenos) { html += ' epomenos'; }
		}
		return html;
	};

	this.rologakiHTML = function(thesi) {
		var html = '';

		var spot = true;
		if (isKinisi()) {
			var telkin = kinisi[kinisi.length - 1];
			var spotIdx = 'r' + telkin.k + ':' + thesi;
			if (spotIdx in Pexnidi.spotList) { var spot = false; }
			else { Pexnidi.spotListPush(spotIdx); }
		}
		if (thesi == pexnidi.epomenos) {
			html += '<img class="rologakiIcon" alt="" src="' + globals.server;
			if (spot) {
				html += 'images/rollStar.gif" onload="Tools.metalagi(this, \'' +
					globals.server + 'images/rologaki.gif\');"' ;
			}
			else {
				html += 'images/rologaki.gif"';
			}
			html += ' />';
		}
		return html;
	};

	this.dpmHTML = function(thesi) {
		var html = '';

		if (thesi == pexnidi.dealer) {
			html += '<img class="dealerIcon" src="' + globals.server +
				'images/dealer.png" title="Dealer" alt="" />';
		}

		if (pexnidi.dealer) {
			var protos = pexnidi.dealer + 1;
			if (protos > 3) { protos = 1; }
			if (thesi == protos) {
				html += '<img class="protosIcon" src="' + globals.server +
					'images/protos.png" title="Πρώτος" alt="" />';
			}
		}

		if (pexnidi.simetoxi[thesi] == 'ΜΑΖΙ') {
			html += '<img class="maziIcon" src="' + globals.server +
				'images/mazi.png" title="Μαζί" alt="" />';
		}

		return html;
	}

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

		var params = 'thesi=' + partida.map[thesi];
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

	this.gipedoHTML = function() {
		var html = '<div id="gipedo" class="gipedo">';

		switch (pexnidi.fasi) {
		case 'ΣΤΗΣΙΜΟ':
			html += Gipedo.stisimoHTML();
			break;
		case 'ΔΙΑΝΟΜΗ':
			html += Gipedo.dianomiHTML();
			break;
		case 'ΔΗΛΩΣΗ':
			html += Gipedo.dilosiHTML();
			break;
		case 'ΠΑΣΟ ΠΑΣΟ ΠΑΣΟ':
			html += Gipedo.pasoPasoPasoHTML();
			break;
		case 'ΤΖΟΓΟΣ':
			html += (notTheatis() && Dodekada.klidomenaCount == 2) ?
				Gipedo.dixeAgoresHTML() : Gipedo.alagiTzogouHTML();
				break;
		case 'ΣΥΜΜΕΤΟΧΗ':
			html += Gipedo.simetoxiHTML();
			break;
		case 'ΠΑΣΟ ΠΑΣΟ':
			html += Gipedo.pasoPasoHTML();
			break;
		case 'ΠΑΙΧΝΙΔΙ':
			html += Gipedo.pexnidiHTML();
			break;
		case 'ΜΠΑΖΑ':
			html += Gipedo.pexnidiHTML();
			break;
		default:
			html += Gipedo.agnostiFasiHTML();
			break;
		}

		html += '</div>';
		return html ;
	};

	this.theatisHTML = function() {
		var html = '';
		if (notSet(rebelos)) { return html; }

		var protos = '<div class="theatisArea">';
		var count = 0;
		var more = 0;
		for (var i = 0; i < rebelos.length; i++) {
			if (isSet(rebelos[i].t) && (rebelos[i].t == partida.kodikos) &&
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

// Ακολουθούν εργαλεία χειρισμού των 12 φύλλων του τζογαδόρου
// στη φάση της αλλαγής του τζόγου και της επιλογής αγοράς.

var Dodekada = new function() {
	// Επειδή οι χειρισμοί του τζογαδόρου μέχρι να δηλώσει
	// την αγορά του δεν περνάνε στον server, υπάρχει θέμα
	// επανασχεδίασης της οθόνης όσο ο τζογαδόρος κάνει
	// τους χειρισμούς του. Π.χ. μπορεί ο τζογαδόρος να
	// έχει σηκώσει 2 φύλλα και να προσπαθεί να επιλέξει
	// την αγορά του και να έρθει ένα σχόλιο συζήτσης
	// που θα προκαλέσει επανασχδίαση της οθόνης.
	// Οι παρακάτω μεταβλητές και ιδιότητες χρησιμεύουν
	// ως ένα μέσο αποθήκευσης των τοπικών χειρισμών
	// του τζογαδόρου, ώστε με τα την πιθανή επανασχεδίαση
	// της οθόνης, αυτοί οι χειρισμοί να εφαρμοστούν
	// στη νέα κατάσταση.

	var teldian = 0;	// κωδικός τελευταίας διανομής
	var telkin = 0;		// κωδικός τελευταίας κίνησης
	var sikomeno = [];	// σηκωμένα φύλλα
	this.klidomeno = [];	// επιλεγμένα φύλλα
	this.klidomenaCount = 0;

	this.dodekadaHTML = function(i) {
		var html = '';
		html += ' onmouseover="Dodekada.sikose(this, ' + i + ', true);" ';
		html += ' onmouseout="Dodekada.sikose(this, ' + i + ', false);" ';
		html += ' onclick="Dodekada.klidose(this, ' + i + ');" ';
		if (i in sikomeno) { html += 'style="bottom: ' + sikomeno[i] + '; "'; }
		return html;
	};

	this.sikose = function(img, i, pano) {
		if (notSet(img)) { return; }
		if ((i in Dodekada.klidomeno) && Dodekada.klidomeno[i]) { return; }
		if (notSet(img.style)) { return; }
		if (notSet(img.style.bottom)) { return; }

		if (pano) {
			img.style.bottom = '0.6cm';
			img.title = 'Κλικ για επιλογή φύλλου'
		}
		else {
			img.style.bottom = '0px';
			img.title = '';
		}

		sikomeno[i] = img.style.bottom;
	};

	this.resetDodekada = function() {
		if (isDianomi() && isKinisi() &&
			(dianomi[dianomi.length - 1].k == teldian) &&
			(kinisi[kinisi.length - 1].k == telkin)) { return; }

		teldian = isDianomi() ? dianomi[dianomi.length - 1].k : 0;
		telkin = isKinisi() ? kinisi[kinisi.length - 1].k : 0;
		sikomeno = [];
		Dodekada.klidomeno = [];
		Dodekada.klidomenaCount = 0;
	}

	this.klidose = function(img, i) {
		if (notSet(img)) { return; }
		var tora = ((i in Dodekada.klidomeno) && Dodekada.klidomeno[i]);
		var meta = !tora;

		Dodekada.klidomeno[i] = false;
		Dodekada.sikose(img, i, meta);
		Dodekada.klidomenaCount += (meta ? 1 : -1);
		if (Dodekada.klidomenaCount == 2) {
			Dodekada.dixeAgores();
		}
		else {
			Dodekada.kripseAgores();
		}

		if (Dodekada.klidomeno[i] = meta) {
			img.title = 'Κλικ για επαναφορά του φύλλου';
		}
		else {
			img.title = '';
		}
	};

	this.dixeAgores = function() {
		var x = getelid('gipedo');
		if (notSet(x)) { return; }
		x.innerHTML = Gipedo.dixeAgoresHTML();
	};

	this.kripseAgores = function() {
		var x = getelid('gipedo');
		if (notSet(x)) { return; }
		x.innerHTML = Gipedo.alagiTzogouHTML();
	};
};

var Dekada = new function() {
	this.resetDekada = function() {
	};

	var epitrepto = [];

	this.setEpitrepto = function(fila) {
		epitrepto = [];

		// Αν είναι το πρώτο φύλλο της μπάζας, τότε μπορεί
		// να παιχτεί οποιοδήποτε φύλλο.
		if (pexnidi.bazaFilo.length <= 0) { return; }

		// Έχουν παιχτεί φύλλα στην μπάζα, επομένως θα μας
		// χρειαστεί το χρώμα του πρώτου φύλλο της μπάζας.
		var xroma = pexnidi.bazaFilo[0].substr(0, 1);

		// Αν ο παίκτης έχει φύλλα σ'αυτό το χρώμα, τότε
		// τα μαρκάρουμε ως επιτρεπτά.
		for (var i = 0; i < fila.length; i++) {
			if (fila[i].match('^' + xroma)) {
				Dekada.setEpitreptoFilo(i);
			}
		}

		// Αν βρέθηκαν φύλλα στο χρώμα που παίχτηκε, τότε
		// αυτά και μόνον αυτά είναι τα επιτρεπτά.
		if (epitrepto.length > 0) { return Dekada.fixEpitrepto(fila); }

		// Δεν έχουν βρεθεί φύλλα στο χρώμα που παίχτηκε.
		// Αν η αγορά είναι αχρωμάτιστη, τότε μπορεί να
		// παιχτεί οποιοδήποτε φύλλο.
		if (pexnidi.xromaAgoras == 'N') { return; }

		// Υπάρχουν ατού και δεν έχουν βρεθεί φύλλα στο χρώμα
		// που παίχτηκε. Επομένως, επιτρεπτά είναι μόνο τα ατού.
		for (var i = 0; i < fila.length; i++) {
			if (fila[i].match('^' + pexnidi.xromaAgoras)) {
				Dekada.setEpitreptoFilo(i);
			}
		}
		Dekada.fixEpitrepto(fila);
	};

	this.setEpitreptoFilo = function(i) {
		epitrepto[i] = true;
	};

	this.fixEpitrepto = function(fila) {
		var n = 0;
		for (var i = 0; i < epitrepto.length; i++) {
			if (epitrepto[i] === true) { n++; }
		}
		if (n >= fila.length) { epitrepto = []; }
	};

	this.isEpitrepto = function(i) {
		if (epitrepto.length <= 0) { return true; }
		return ((i in epitrepto) && (epitrepto[i] === true));
	};

	this.dekadaHTML = function(xa, i) {
		var html = '';
		if (Dekada.isEpitrepto(i)) {
			html += ' onmouseover="Dekada.sikose(this, ' + i + ', true);" ';
			html += ' onmouseout="Dekada.sikose(this, ' + i + ', false);" ';
			html += ' onclick="Dekada.valeFilo(this, ' + i + ', \'' + xa + '\');" ';
			if (epitrepto.length > 0) { html += 'style="bottom: 0.4cm; "'; }
		}
		return html;
	};

	this.sikose = function(img, i, pano) {
		if (pano) {
			if (epitrepto.length > 0) {
				img.style.bottom = '0.8cm';
			}
			else {
				img.style.bottom = '0.4cm';
			}
		}
		else {
			if (epitrepto.length > 0) {
				img.style.bottom = '0.4cm';
			}
			else {
				img.style.bottom = '0px';
			}
		}
	};

	this.valeFilo = function(img, i, xa) {
		var x = getelid('bazaFilo1');
		if (notSet(x)) { fatalError('Dekada.valeFilo: bazaFilo1: not found'); }
		x.innerHTML = '<img class="bazaFilo bazaFilo1" src="' +
			img.src + '" alt="" style="z-index: 3;" />';
		sviseNode(img, 400);
		Pexnidi.addKinisi('ΦΥΛΛΟ', xa);
	};
};
