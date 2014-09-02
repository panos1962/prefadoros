var Partida = new function() {
	this.HTML = '';

	// Συνήθως το ρολογάκι εμφανίζεται μετά από 1-2 περιστροφές του
	// μεταλλικού περιστρεφόμενου άστρου. Σε κάποιες περιπτώσεις,
	// όμως, αυτό είναι πολύ φορτωμένο, π.χ. όταν ο τζογαδόρος
	// παραλαμβάνει τον τζόγο. Θέτοντας false τη flag "rologakiRoll"
	// μπορούμε να εμφανίσουμε το ρολογάκι χωρίς φιοριτούρες.
	var rologakiRoll = true;

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
			'd', 's', 'p', 'b',
			'ppp', 'asoi', 'postel', 'learner',
			'h', 't'
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
		partida.idioktito = (partida.d == 1);
		partida.kasa = parseInt(partida.s);
		partida.ppp = (partida.ppp == 1);
		partida.asoi = (partida.asoi == 1);
		if (notSet(partida.postel)) { partida.postel = 0; }
		switch (partida.postel) {
		case 1:
		case 2:
			break;
		default:
			partida.postel = 0;
			break;
		}
		partida.learner = (partida.learner == 1);
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
		html += '<div id="dialogos" class="dialogos"></div>';

		if (pexnidi.ipolipo <= 0) {
			html += Partida.telosHTML();
			if (isSet(pexnidi.ixeIpolipo) && pexnidi.ixeIpolipo) {
				pexnidi.ixeIpolipo = false;
				playSound('applause');
			}
		}

		html += Partida.panoInfoHTML();

		html += Partida.pektis3HTML();
		html += Partida.pektis2HTML();
		html += Partida.pektis1HTML();

		html += Partida.theatisHTML();
		html += Partida.gipedoHTML();

		html += Partida.katoInfoHTML();

		html += '</div>';
		Partida.HTML = html;
	};

	this.telosHTML = function() {
		var html = '';
		html += '<div class="telosArea" onclick="sviseNode(this);">';
		html += '<img alt=" title="Η παρτίδα έχει τελειώσει"" src="' +
			globals.server + 'images/telos.png" style="width: 5cm;" />';
		html += '</div>';
		return html;
	};

	this.giortesMusic = function(img) {
		var x = getelid('giortes');
		if (notSet(x)) { return; }
		if (x.innerHTML != '') {
			x.innerHTML = '';
			return;
		}

		var songs = [];
		switch (img) {
		case 'xmas.png':
			songs = [ 'TeNJmOsBS94', 'DW5bIN4h6O4', 'sbbQwecCzo8' ];
			break;
		case 'neoEtos.png':
			songs = [ '_6xNuUEnh2g', 'EmKlGcAK8DE', 'X0oFJXa26vY', 'Nho5Zl_IrrE' ];
			break;
		}

		if (songs.length <= 0) { return; }
		var i = Math.floor(Math.random() * songs.length);
		x.innerHTML = '<iframe width="420" height="315" ' +
			'src="http://www.youtube.com/embed/' + songs[i] +
			'?autoplay=1" frameborder="0" allowfullscreen></iframe>';
	};

	this.giortesHTML = function(cls) {
		var x = new Date();
		var m = x.getMonth() + 1;
		var d = x.getDate();

		var img = null;
		var tit = '';
		if ((m == 12) && (d > 18)) {
			img = 'xmas.png';
			tit = 'Καλά Χριστούγεννα!';
		}
		else if ((m == 1) && (d < 7)) {
			img = 'neoEtos.png';
			tit = 'Καλή χρονιά!';
		}

		if (notSet(img)) { return ''; }
		return '<img class="' + (isSet(cls) ? cls : 'partidaAttrIcon') +
			'" alt="" src="' + globals.server + '/images/giortes/' + img +
			'" title="' + tit + '" onclick="Partida.giortesMusic(\'' +
			img + '\');" style="cursor: pointer;" />';
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
		if (notTheatis() && dikeomaRithmisis()) {
			html += '<img id="pliktroPanoKasa" class="kasaPanoKato' + tbc + '" alt="" src="' +
				globals.server + 'images/panoKasa.png" ' +
				'title="Αύξηση κάσας κατά 300 καπίκια" ' +
				'onclick="Partida.kasaPanoKato(10, this);" />';
			html += '<img class="kasaPanoKato' + tbc + '" alt="" src="' + globals.server +
				'images/katoKasa.png" title="Μείωση κάσας κατά 300 καπίκια" ' +
				'onclick="Partida.kasaPanoKato(-10, this);" />';
		}
		else {
			html += '#';
		}
		html += '&nbsp;<span title="Υπόλοιπο κάσας" class="partidaInfoData' + tbc + '">';
		html += pexnidi.ipolipo + '</span>';
		html += '</div>';
		var giortes = Partida.giortesHTML();
		if (giortes || isIdioktito() || isKlisto() || isPasoPasoPaso() ||
			notAsoiKolos() || globals.mobile || isPostel() || isLearner()) {
			html += '<div class="partidaAttrArea">';
			if (globals.mobile) {
				html += '<img class="partidaAttrIcon" alt="" src="' + globals.server +
					'images/controlPanel/mobile.png" title="Επανεμφάνιση ' +
					'πληκτρολογίου οθόνης συσκευής κινητού" style="cursor: pointer;" ' +
					'onclick="controlPanel.mobile();" />';
			}
			if (isIdioktito()) { html += Trattr.idioktitoHTML('partidaAttrIcon'); }
			if (isKlisto()) { html += Trattr.klistoHTML('partidaAttrIcon'); }
			if (isPasoPasoPaso()) { html += Trattr.pasoPasoPasoHTML('partidaAttrIcon'); }
			if (notAsoiKolos()) { html += Trattr.oxiAsoiHTML('partidaAttrIcon'); }
			if (isPostel()) { html += Trattr.postelIconHTML('partidaAttrIcon'); }
			if (isLearner()) { html += Trattr.learnerIconHTML('partidaAttrIcon'); }
			html += giortes;
			html += '</div>';
		}

		if (isSet(partida.e)) { html += this.efeHTML(partida.e); }
		return html;
	};

	this.efeHTML = function(efe) {
		var html = '';
		switch (efe) {
		case 'ΓΙΡΛΑΝΤΑ':
			html += '<img src="images/giortes/girlanta.png" title="Επετειακή παρτίδα" ' +
				'style="position: absolute; top: -0.85cm; left: -0.5cm; ' +
				'width: 2.4cm;" alt="" />';
			break;
		case 'ROSES':
			html += '<img src="images/giortes/roses.png" title="Επετειακή παρτίδα" ' +
				'style="position: absolute; top: 4.8cm; left: 5.0cm; ' +
				'width: 3.8cm; opacity: 0.5; filter: alpha(opacity=50);" alt="" />';
			break;
		case 'ΜΠΑΛΟΝΙΑ':
			html += '<img src="images/giortes/balonia.png" title="Επετειακή παρτίδα" ' +
				'style="position: absolute; top: -0.9cm; left: -0.58cm; ' +
				'width: 1.8cm;" alt="" />';
			break;
		case 'ΜΑΡΤΙΝΙ':
			html += '<img src="images/giortes/martini.png" title="Στην υγειά μας!" ' +
				'style="position: absolute; top: 5.2cm; left: 6.0cm; ' +
				'width: 2.2cm;" alt="" />';
			break;
		}
		return html;
	};

	this.katoInfoHTML = function() {
		html = '';
		html += '<div id="infoBottom" class="partidaInfo partidaInfoBottom';
		if ((pexnidi.akirosi in partida.pektis) && (pexnidi.akirosi > 0)) {
			var pektis = partida.pektis[pexnidi.akirosi];
			if (pektis == '') { pektis = 'στη θέση ' + pexnidi.akirosi; }
			else { pektis = '"' + partida.pektis[pexnidi.akirosi] + '"'; }
			html += ' partidaInfoSimantiko">';
			html += 'Ο παίκτης ' + pektis + ' ακυρώνει κινήσεις';
		}
		else {
			html += '">';
			// Information area
		}
		html += '</div>';
		return html;
	};

	this.pektis3HTML = function() {
		var html = '';
		html += '<div class="pektis pektis3';
		if (isTheatis()) { html += ' theatis'; }
		html += '"';
		html += Partida.thesiTheasisHTML(3);
		html += Partida.profinfoHTML(3);
		html += '>';
		html += '<div class="pektisMain';
		html += Partida.pektisMainHTML(3);
		html += '">';
		html += Partida.pektisInfoHTML(3);
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
		html += '<div class="pektis pektis2';
		if (isTheatis()) { html += ' theatis'; }
		html += '"';
		html += Partida.thesiTheasisHTML(2);
		html += Partida.profinfoHTML(2);
		html += '>';
		html += '<div class="pektisMain';
		html += Partida.pektisMainHTML(2);
		html += '">';
		html += Partida.pektisInfoHTML(2);
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
		html += '<div class="pektis pektis1';
		if (isDianomi()) { html += ' pektis1akri'; }
		if (isTheatis()) { html += ' theatis'; }
		html += '"';
		html += Partida.profinfoHTML(1);
		html += '>';
		html += Partida.pasoSimetoxiHTML(1);
		html += '<div class="pektisMain pektis1Main';
		if (isDianomi()) { html += ' pektis1MainAkri'; }
		html += Partida.pektisMainHTML(1);
		html += '">';
		html += Partida.pektisInfoHTML(1);
		html += Partida.dpmHTML(1);
		html += Partida.onomaPektiHTML(1);
		html += Partida.kapikiaHTML(1);
		html += Partida.dilosiAgoraHTML(1);
		html += Partida.rologakiHTML(1);
		html += '</div>';
		html += '</div>';
		html += '<div class="fila1Area">';
		if ((pexnidi.fasi != 'CLAIM') || (pexnidi.tzogadoros != 1)) {
			html += Partida.filaHTML(pexnidi.fila[1]);
		}
		html += '</div>';
		return html;
	};

	var mavroKokino = {
		'S':	'M',
		'C':	'M',
		'D':	'K',
		'H':	'K'
	};

	this.filaHTML = function(fila) {
		var html = '';
		if (fila.length <= 0) { return html; }

		var tzogos = ((pexnidi.fasi == 'ΑΛΛΑΓΗ') && isTzogadoros());
		var pezon = ((pexnidi.fasi == 'ΠΑΙΧΝΙΔΙ') && isEpomenos());
		if (pezon) { Dekada.setEpitrepto(fila); }

		Dekada.resetControls(fila.length);
		var proto = ' style="margin-left: 0px;"';
		var prevXroma = '';
		var prevMavroKokino = '';
		for (var i = 0; i < fila.length; i++) {
			html += '<div class="filaSira';
			if (tzogos) { html += ' filaSiraSteno filoSteno'; }
			html += '"' + proto + '>';
			proto = '';
			html += '<img id="filo_' + i + '" class="filaSiraIcon';
			if (tzogos) { html += ' filoSteno'; }
			if (i > 0) { html += ' filoSkia'; }
			var curXroma = fila[i].substr(0, 1);
			if (curXroma != prevXroma) {
				prevXroma = curXroma;
				var curMavroKokino = mavroKokino[curXroma];
				if (curMavroKokino == prevMavroKokino) {
					html += ' filoDiaxor' + curMavroKokino;
				}
				else {
					prevMavroKokino = curMavroKokino;
				}
			}
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
			var spotIdx = '';
			for (var i = kinisi.length - 1; i > 0; i--) {
				if (kinisi[i].i == 'ΑΓΟΡΑ') {
					spotIdx = 'a' + kinisi[i].k;
					break;
				}
			}
			if (spotIdx in Spot.spotList) { spot = false; }
			else {
				spot = true;
				Spot.spotListPush(spotIdx);
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
			if (spotIdx in Spot.spotList) { spot = false; }
			else if (spot) { Spot.spotListPush(spotIdx); }
			html1 += Pexnidi.xromaBazesHTML(pexnidi.dilosi[thesi], null, null, spot);
			html1 += '</div>';
			if (isTzogadoros(thesi)) {
				if (pexnidi.fasi == 'ΤΖΟΓΟΣ') {
					html1 += '<img class="anamoniTzogosIcon" src="' +
						globals.server + 'images/fotorithmiko.gif"';
				}
				else {
					html1 += '<img class="pektisTzogosIcon" src="' + globals.server;
					var spotIdx = 'z' + telkin.k;
					if (spotIdx in Spot.spotList) {
						html1 += 'images/trapoula/tzogos.png"';
					}
					else {
						rologakiRoll = false;
						Spot.spotListPush(spotIdx);
						html1 += 'images/asteraki.gif" onload="Tools.metalagi' +
							'(this, \'' + globals.server +
							'images/trapoula/tzogos.png\', 700);"';
					}
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
			html += Partida.simetoxiHTML(thesi);
			break;
		case 'ΣΟΛΟ':
		case 'ΠΑΣΟ ΠΑΣΟ':
		case 'ΠΑΙΧΝΙΔΙ':
		case 'ΜΠΑΖΑ':
			if (pexnidi.bazaCount < 1) { html += Partida.simetoxiHTML(thesi); }
			else { html += Partida.pektisBazesHTML(thesi); }
			html += Partida.velosHTML(thesi);
			break;
		case 'ΠΛΗΡΩΜΗ':
		case 'CLAIM':
			if (pexnidi.bazaCount < 1) { html += Partida.simetoxiHTML(thesi); }
			else { html += Partida.pektisBazesHTML(thesi); }
			break;
		}
		return html;
	};

	this.velosHTML = function(thesi) {
		var html = '';
		for (var i = 0; i < pexnidi.bazaPektis.length; i++) {
			if (pexnidi.bazaPektis[i] == thesi) {
				html += '<img class="velos' + thesi + '" src="' +
					globals.server + 'images/velos' + thesi;
				if ((pexnidi.fasi == 'ΜΠΑΖΑ') && (thesi == pexnidi.epomenos)) {
					html += 'pare';
				}
				html += '.png" alt="" />';
				break;
			}
		}
		return html;
	}

	this.pektisBazesHTML = function(thesi) {
		var plati = [
			'R', 'R', 'R',
			'B', 'B', 'B',
			'R', 'R', 'R', 
			'B', 'B', 'B',
			'R'
		];

		if ((thesi == pexnidi.epomenos) && (pexnidi.fasi == 'ΜΠΑΖΑ')) {
			var spot = '<img class="pektisBazaIcon" src="' + globals.server +
				'images/baza.gif" alt="" />';
		}
		else { spot = ''; }

		var html = '';
		html += '<div class="pasoSimetoxi pasoSimetoxi' + thesi + '">';
		html += '<div class="pektisBazaArea pektisBazaArea' + thesi + '">';
		if (thesi == 2) {
			html += spot;
			for (var i = pexnidi.baza[thesi] - 1; i >= 0; i--) {
				html += '<img class="pektisBazaIcon" src="' + globals.server +
					'images/trapoula/' + plati[i] + 'V.png" alt="" ' +
					'style="margin-left: 0.1cm;" />';
			}
		}
		else if (thesi == 3) {
			for (var i = 0; i < pexnidi.baza[thesi]; i++) {
				html += '<img class="pektisBazaIcon" src="' + globals.server +
					'images/trapoula/' + plati[i] + 'V.png" alt="" ' +
					'style="margin-right: 0.1cm;" />';
			}
			html += spot;
		}
		else {
			for (var i = 0; i < pexnidi.baza[thesi]; i++) {
				html += '<img class="pektisBazaIcon" src="' + globals.server +
					'images/trapoula/' + plati[i] + 'V.png" alt="" ' +
					'style="margin-right: 0.1cm; width: 0.34cm;" />';
			}
			html += spot;
		}
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.simetoxiHTML = function(thesi) {
		var html = '';
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
		return html;
	};

	this.pektisMainHTML = function(thesi) {
		var html = '';
		rologakiRoll = true;
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

	var infoShowStatus = {};

	this.pektisInfoHTML = function(thesi) {
		var html = '';
		var pektis = partida.pektis[thesi];
		if (pektis == '') { return html; }

		html += '<div class="pektisInfo" title="Κλικ για πληροφορίες" ' +
			'onmouseover="Partida.pektisInfoShow(event, \'' + pektis + '\');" ' +
			'onmouseout="Partida.pektisInfoHide(\'' + pektis + '\');" ' +
			'onclick="Partida.pektisInfoShow(event, \'' + pektis + '\', true);">';
		var grama = pektis.substr(0, 1);
		grama = grama.toLowerCase();
		html += '<div id="pektisPhoto:' + pektis + '" class="pektisPhotoContainer"';
		if (infoShowStatus.hasOwnProperty(pektis) && infoShowStatus[pektis] != 0) {
			html += 'style="display: inline;" ';
		}
		html += '>';
		html += '<img class="pektisPhoto" src="' +
			globals.server + 'photo/' + grama + '/' + pektis +
			'.jpg" alt="" onerror="return Partida.pektisNoPhoto(this);" ';
		html += 'onmouseover="diafaniaSet(this);" ';
		html += 'onmouseout="diafaniaSet(this, 50);" ';
		html += '/>';
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.pektisNoPhoto = function(img) {
		img.src = globals.server + 'images/nophoto.png';
		return false;
	};

	this.pektisInfoShow = function(e, pektis, keep) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		
		var x = getelid('pektisPhoto:' + pektis);
		if (notSet(x)) { return false; }

		if (notSet(keep)) { keep = false; }
		if (!infoShowStatus.hasOwnProperty(pektis)) { infoShowStatus[pektis] = 0; }
		if (keep) {
			if (infoShowStatus[pektis] == 2) {
				x.style.display = 'none';
				infoShowStatus[pektis] = 0;
			}
			else {
				x.style.display = 'inline';
				infoShowStatus[pektis] = 2;
				x.title = 'Κλικ για απόκρυψη';
			}
		}
		else if (infoShowStatus[pektis] != 2) {
			x.style.display = 'inline';
			infoShowStatus[pektis] = 1;
			x.title = 'Κλικ για μόνιμη εμφάνιση';
		}
		return false;
	};

	this.pektisInfoHide = function(pektis) {
		if (!infoShowStatus.hasOwnProperty(pektis)) { return false; }
		var x = getelid('pektisPhoto:' + pektis);
		if (notSet(x)) { return false; }

		if (infoShowStatus[pektis] != 2) {
			x.style.display = 'none';
			infoShowStatus[pektis] = 0;
		}
		return false;
	};

	this.rologakiHTML = function(thesi) {
		var html = '';

		var spot = true;
		if (isKinisi()) {
			var telkin = kinisi[kinisi.length - 1];
			var spotIdx = 'r' + telkin.k + ':' + thesi;
			if (spotIdx in Spot.spotList) { var spot = false; }
			else { Spot.spotListPush(spotIdx); }
		}
		if (thesi == pexnidi.epomenos) {
			var ikona = 'rologaki.gif';
			if (pexnidi.epomenos != 1) {
				switch (pexnidi.fasi) {
				case 'ΠΑΙΧΝΙΔΙ': ikona = 'balitsa.gif'; rologakiRoll = false; break;
				case 'ΣΥΜΜΕΤΟΧΗ': ikona = 'erotimatiko.gif'; break;
				case 'ΜΠΑΖΑ': ikona = 'rollStar.gif'; rologakiRoll = false; break;
				}
			}
			else {
				switch (pexnidi.fasi) {
				case 'ΜΠΑΖΑ': ikona = 'rollStar.gif'; rologakiRoll = false; break;
				}
			}
			html += '<img class="rologakiIcon" alt="" src="' + globals.server;
			if (spot && rologakiRoll) {
				html += 'images/rollStar.gif" onload="Tools.metalagi(this, \'' +
					globals.server + 'images/' + ikona + '\');"';
			}
			else {
				html += 'images/' + ikona + '"';
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

		var katoFree = true;

		if (pexnidi.simetoxi[thesi] == 'ΜΑΖΙ') {
			katoFree = false;
			html += '<img class="maziIcon" src="' + globals.server +
				'images/mazi.png" title="Μαζί" alt="" />';
		}

		if (pexnidi.claim[thesi]) {
			katoFree = false;
			html += '<img class="claimIcon" alt="" src="' + globals.server +
				'images/controlPanel/claim.png" title="Τις δίνω όλες…" />';
		}

		if (pexnidi.ipolipo <= 0) {
			katoFree = false;
		}

		if (partida.pektis[thesi]) {
			html += '<img id="profinfo' + thesi + '" class="profinfoIcon" src="' +
				globals.server + 'images/' + (katoFree ? 'profinfo' : 'ofniforp') +
				'.png" title="Προφίλ παίκτη" alt="" ' +
				'onclick="Profinfo.dixe(event, \'' + partida.pektis[thesi] +
				'\', ' + thesi + ', this);" onmouseover="Profinfo.omo(\'' +
				partida.pektis[thesi] + '\', ' + thesi + ', true, this);" ' +
				'onmouseout="Profinfo.omo(\'' + partida.pektis[thesi] +
				'\', ' + thesi + ', false, this);" style="' + (katoFree ?
				'left' : 'right') + ': -0.55cm;" />';
		}

		return html;
	}

	this.thesiTheasisHTML = function(thesi) {
		var html = '';
		if (notTheatis()) { return html; }
		html += ' onclick="Partida.thesiTheasis(' + thesi + ');"';
		html += ' style="cursor: crosshair;"';
		html += ' title="Αλλαγή παρακολουθούμενου παίκτη"';
		return html;
	};

	this.profinfoHTML = function(thesi) {
		var html = '';
		html += ' onmouseover="Partida.profinfoShow(' + thesi + ', true);"';
		html += ' onmouseout="Partida.profinfoShow(' + thesi + ', false);"';
		return html;
	};

	this.profinfoShow = function(thesi, dixe) {
		var x = getelid('profinfo' + thesi);
		if (notSet(x)) { return; }
		x.style.display = dixe ? 'inline' : 'none';
	};

	this.thesiTheasis = function(thesi, ico) {
		if (notSet(ico)) { ico = getelid('controlPanelIcon'); }
		if (notSet(ico)) { return; }
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		Tools.dialogos('Αλλάζετε θέση θέασης.<br />Παρακαλώ περιμένετε…');
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
		if (globals.server.match(/http:\/\/127/)) {
			html += '<div style="color: red; background-color: yellow;">' +
				pexnidi.fasi + '</div>';
		}

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
			html += Gipedo.tzogosHTML();
			break;
		case 'ΑΛΛΑΓΗ':
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
		case 'ΠΛΗΡΩΜΗ':
			html += Gipedo.pliromiHTML();
			break;
		case 'CLAIM':
			html += Gipedo.claimHTML();
			break;
		case 'ΣΟΛΟ':
			html += Gipedo.soloHTML();
			break;
		default:
			html += Gipedo.agnostiFasiHTML();
			break;
		}

		html += '</div>';
		html += '<div id="telefteaBaza" class="telefteaBaza" title="Προηγούμενη μπάζα/τζόγος" ';
		html += 'onclick="Gipedo.switchAnadromi(this);"';
		if (controlPanel.xanaBazaOn) {
			html += ' style="z-index: 10;">';
			html += Gipedo.telefteaBazaHTML();
		}
		else {
			html += '">';
		}
		html += '</div>';
		return html ;
	};

	var protosTheatis = 0;

	this.theatisHTML = function() {
		var html = '';
		if (notSet(rebelos)) { return html; }

		var protos = '<div class="theatisArea">';
		var count = 0;
		var more = 0;
		if (protosTheatis >= rebelos.length) { protosTheatis = 0; }
		var mexri = protosTheatis + rebelos.length;
		for (var i = protosTheatis; i < mexri; i++) {
			j = i % rebelos.length;
			if (isSet(rebelos[j].t) && (rebelos[j].t == partida.kodikos) &&
				(rebelos[j].l != pektis.login)) {
				if (count > 5) {
					if (more <= 0) {
						var moreProtos = rebelos[j].l;
						var moreOnomata = rebelos[j].l;
					}
					else {
						moreOnomata += ', ' + rebelos[j].l;
					}
					more++;
					continue;
				}
				html += protos;
				protos = '';
				html += Partida.theatisItemHTML(rebelos[j].l);
				count++;
			}
		}
		if (more == 1) {
			html += Partida.theatisItemHTML(moreProtos);
		}
		else if (more > 0) {
			html += '<div title="' + moreOnomata +'" ' +
				'onclick="Partida.moreTheatis();" ' +
				'style="cursor: pointer;">και άλλοι ' + more + '</div>';
		}

		if (protos == '') { html += '</div>'; }
		return html;
	};

	this.moreTheatis = function() {
		protosTheatis++;
		Partida.updateHTML();
		Prefadoros.display();
	};

	this.theatisItemHTML = function(pektis) {
		var html = '';
		html += '<div class="theatisData"';
		html += Trapezi.permesHTML(pektis);
		html += '>';
		html += '<div style="overflow: hidden;">' + pektis + '</div>';
		html += Trapezi.profinfoHTML(pektis);
		if (Partida.proskeklimenos(pektis)) {
			html += '<img class="theatisProsklisi" src="' + globals.server +
				'images/controlPanel/check.png" alt="" />';
		}
		html += '</div>';
		return html;
	};

	// Η function "proskeklimenos" δείχνει ένα τσεκ στον θεατή, εφόσον
	// τον έχουμε ήδη προσκαλέσει. Δεν μας δείχνει, όμως, αν ο θεατής
	// έχει πρόσκληση από άλλον παίκτη του τραπεζιού. Θα μπορούσε να
	// γίνει και αυτό, αλλά υπάρχει κόστος.

	this.proskeklimenos = function(pektis) {
		if (notSet(window.prosklisi)) { return false; }
		for (var i = 0; i < prosklisi.length; i++) {
			if (prosklisi[i].p != pektis) { continue; }
			if (prosklisi[i].t != partida.kodikos) { continue; }
			return true;
		}
		return false;
	};

	this.noPartidaHTML = function() {
		Partida.HTML = '<div class="partida">';
		Partida.HTML += '<div class="partidaMinima" style="margin-top: 1.8cm;">';
		Partida.HTML += '<div style="padding: 0.4cm;">' + Tools.xromataHTML('1.2cm') + '</div>';
		var giortes = Partida.giortesHTML();
		if (giortes) {
			Partida.HTML += '<div class="partidaAttrArea">' + giortes + '</div>';
		}
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
/*
var html = '';
html += '<div style="width: 880px; text-align: justify; font-size: 16px;">';
html += '<p>';
html += 'Φίλοι πρεφαδόροι,';
html += '</p>';
html += '<p>';
html += 'Ζητώ συγγνώμην για την αναστάτωση, αλλά πρέπει να κάνω κάποιες δοκιμές στο νέο ';
html += 'πρόγραμμα το οποίο ετοιμάζω και χρειάζομαι τη βοήθειά σας. ';
html += 'Αν, λοιπόν, θέλετε να παίξετε ή να παρακολουθήσετε κάποια παρτίδα πρέφας, ';
html += 'θα πρέπει να εισέλθετε στον νέο «Πρεφαδόρο» προκειμένου να ελέγξω τη συμπεριφορά ';
html += 'των προγραμμάτων με ικανό αριθμό τραπεζιών και online παικτών.';
html += '</p>';
html += '<p>';
html += 'Οι παρτίδες τις οποίες θα παίξετε στον νέο «Πρεφαδόρο» δεν θα αρχειοθετηθούν, ούτε ';
html += 'θα επηρεάσουν τη βαθμολογία σας. Αυτό θα διαρκέσει για λίγες ημέρες, ανάλογα με ';
html += 'τη συμπεριφορά των προγραμμάτων τα οποία πρέπει να μελετήσω και μέχρι να συλλέξω ';
html += 'ικανό όγκο χρήσιμων δεδομένων από τις παρτίδες τις οποίες θα παίξετε.';
html += '</p>';
html += '<p>';
html += 'Για να μεταβείτε στο νέο πρόγραμμα μπορείτε να κάνετε κλικ στον σύνδεσμο ';
html += '<a target="_blank" href="http://www.opasopa.net/prefatria/" ' +
	'style="font-family: sans-serif; color: blue; background-color: yellow; ' +
	'font-style: normal; font-weight: bold; padding: 2px;">ΝΕΟ!</a> ';
html += 'στο κάτω μέρος της σελίδας, ή στο σχετικό κουμπάκι που ακολουθεί. ';
html += 'Για να εισέλθετε ΔΕΝ ΧΡΕΙΑΖΕΤΑΙ ΕΓΓΡΑΦΗ, αλλά θα πρέπει να πραγματοποίησετε ' +
	'ΕΙΣΟΔΟ ΜΕ ΤΑ ΙΔΙΑ ΣΤΟΙΧΕΙΑ ΕΙΣΟΔΟΥ, ενώ θα στερηθείτε ';
html += 'τα προσωπικά μηνύματα και τις πληροφορίες προφίλ, καθώς αυτά δεν τα έχω ετοιμάσει ';
html += 'ακόμη. ';
html += 'Αν και δεν είναι απαραίτητο, είναι καλό να εξέλθετε από το υπάρχον (παλαιό) ';
html += 'πρόγραμμα, καθώς αυτό δεσμεύει δικτυακούς και άλλους πόρους από τον υπολογιστή σας.';
html += '</p>';
html += '</div>';
html += '<button onclick="Tools.dialogosClear(\'dialogosExo\');" style="cursor: pointer; ' +
	'margin-right: 20px;">Όχι τώρα</button>';
html += '<button onclick="location=\'http://www.opasopa.net/prefatria/\';" style="cursor: pointer;">' +
	'Νέος «Πρεφαδόρος»</button>';
Tools.dialogos(html, '3.2cm', '1.2cm', 'dialogosExo');
return;
*/

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
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
		else {
			controlPanel.refreshKitapi();
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

	this.reset = function() {
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
	this.reset = function() {
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
		if (pexnidi.agoraXroma == 'N') { return; }

		// Υπάρχουν ατού και δεν έχουν βρεθεί φύλλα στο χρώμα
		// που παίχτηκε. Επομένως, επιτρεπτά είναι μόνο τα ατού.
		for (var i = 0; i < fila.length; i++) {
			if (fila[i].match('^' + pexnidi.agoraXroma)) {
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

//========================== setControls();
	var controls = [];
	var bikeFilo = false;

	this.resetControls = function(n) {
		bikeFilo = false;
		for (var i = 0; i < n; i++) {
			controls[i] = '';
		}
	};

	this.setControls = function() {
		for (var i = 0; i < controls.length; i++) {
			if (controls[i] == '') { continue; }
			var x = getelid('filo_' + i);
			if (notSet(x)) { continue; }

			x.onmouseover = new Function('Dekada.sikose(this, ' + i + ', true);');
			x.onmouseout = new Function('Dekada.sikose(this, ' + i + ', false);');
			x.onclick = new Function('Dekada.valeFilo(this, ' + i +
				', \'' + controls[i] + '\');');
		}
	};

	this.dekadaHTML = function(xa, i) {
		if (pexnidi.akirosi != 0) { return ''; }
		if (pexnidi.anamoniKinisis) { return ''; }
		if (!Dekada.isEpitrepto(i)) { return ''; }

		controls[i] = xa;
		var html = '';
		if (epitrepto.length > 0) { html += 'style="bottom: 0.4cm; "'; }
		return html;
	};

	this.sikose = function(img, i, pano) {
		if (bikeFilo) { return; }
		if (pexnidi.akirosi != 0) { return; }
		if (pexnidi.anamoniKinisis) { return; }

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
		if (bikeFilo) { return; }
		if (pexnidi.akirosi != 0) { return; }
		if (pexnidi.anamoniKinisis) { return; }

		bikeFilo = true;
		Sizitisi.sxolioFocus();
		var x = getelid('bazaFilo1');
		if (notSet(x)) { fatalError('Dekada.valeFilo: bazaFilo1: not found'); }

		var from_tl = $(img).offset();
		var arxi_tl = $(img).position();

		// Το φύλλο τοποθετείται εξ αρχής στη θέση του στην μπάζα (θέση 1)
		// και ακολουθεί animation, στη λήξη του οποίου θα επανεμφανιστεί.
		x.style.visibility = 'hidden';
		x.innerHTML = '<img class="bazaFilo bazaFilo1 bazaFiloSkia" src="' + globals.server +
			'images/trapoula/' + xa + '.png" alt="" style="z-index: 3;" />';
		var to_tl = $(x).find('img').offset();

		// Το φύλλο πρέπει να εμφανιστεί πάνω από τα υπόλοιπα φύλλα της μπάζας,
		// αλλά αυτά ήδη έχουν ανεβάσει το index. Δεν μπορώ να ανεβάσω μόνο το
		// παιζόμενο, καθώς αυτό το βάζει απευθείας πάνω από τα υπόλοιπα και
		// δημιουργεί τρεμοπαίξιμο. Επομένως, τα ανεβάζω όλα και σε λίγο που
		// θα γίνει επαναδημιουργία του HTML θα έρθουν πάλι στα φυσιολογικά τους.
		var re = new RegExp(xa + '.png$');
		var zi = 19;
		$('.fila1Area img').each(function() {
			if (this.src.match(re)) {
				this.style.zIndex = 20;
				img.style.zIndex = 20;
				zi = 21;
			}
			else {
				this.style.zIndex = zi;
				this.style.bottom = 0;
			}
		});

		img.setAttribute('class', 'filaSiraIcon filoSkia');
		img.style.top = arxi_tl.top;
		img.style.left = arxi_tl.left;

		$(img).animate({
			top: arxi_tl.top + to_tl.top - from_tl.top,
			left: arxi_tl.left + to_tl.left - from_tl.left,
			height: '2.80cm'
		}, Pexnidi.delay['filo'], function() {
			x.style.visibility = 'visible';
			img.style.display = 'none';
			Pexnidi.addKinisi('ΦΥΛΛΟ', xa);
		});
	};
};

var Spot = new function() {
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
	// ανεπιθύμητες επαναλήψεις. Το array δεικτοδοτείται με
	// tags που εμπεριέχουν τους κωδικούς των σχετικών
	// κινήσεων και "καθαρίζει" σε κάθε νέα διανομή.

	this.spotList = [];
	var spotListDianomi = 0;

	this.spotListPush = function(idx) {
		if (notDianomi()) { return; }
		var d = dianomi[dianomi.length - 1].k;
		if (d != spotListDianomi) {
			Spot.spotList = [];
			spotListDianomi = d;
		}
		Spot.spotList[idx] = true;
	};
};
