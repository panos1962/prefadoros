var Astra = new function() {
	this.setHeight = function() {
		var wh = diathesimosXoros();
		if ((typeof(wh.h) != 'number') || (wh.h < 600)) {
			wh.h = 600;
		}

		var x = getelid('astraArea');
		if (notSet(x)) { return; }

		var h = (wh.h - 130) + 'px';
		x.style.height = h;
		x.style.minHeight = h;
		x.style.maxHeight =h;

		var x = getelid('dataArea');
		if (notSet(x)) { return; }

		var h = (wh.h - 180) + 'px';
		x.style.height = h;
		x.style.maxHeight =h;
	};

	// Μπαίνοντας στη σελίδα γίνεται αυτόματη αναζήτηση των
	// πρόσφατων παρτίδων. Μετά εντοπίζονται παρτίδες με
	// τα κριτήρια αναζήτησης.

	var protiFora = true;

	this.getData = function() {
		var pektis = getelid('pektis');
		if (notSet(pektis)) {
			mainFyi('pektis: misssing input field');
			return false;
		}

		var apo = getelid('apo');
		if (notSet(apo)) {
			mainFyi('apo: misssing input field');
			return false;
		}

		var eos = getelid('eos');
		if (notSet(eos)) {
			mainFyi('eos: misssing input field');
			return false;
		}

		var partida = getelid('partida');
		if (notSet(partida)) {
			mainFyi('partida: misssing input field');
			return false;
		}

		var ico = getelid('searchIcon');
		if (ico) { ico.style.visibility = 'visible'; }

		// Κατά την παρουσίαση θα χρειαστούμε τα κριτήρια
		// αναζήτησης παικτών για να χρωματίσουμε κατάλληλα
		// τους παίκτες που πληρούν αυτά τα κριτήρια.

		var plist = pektis.value.split(/[,+]/);
		for (var i = 0; i < plist.length; i++) {
			plist[i] = plist[i].trim();
			plist[i] = plist[i].replace(/\./g, '\\.');
			plist[i] = plist[i].replace(/_/, '.');
			plist[i] = plist[i].replace(/%/, '.*');
		}

		var req = new Request('astra/getData');
		req.xhr.onreadystatechange = function() {
			getDataCheck(req, ico, plist);
		};

		var params = '';
		if (protiFora) {
			protiFora = false;
		}
		else {
			partida.value = partida.value.trim();
			params +=  'partida=' + uri(partida.value);
			if (!partida.value.match(/^[0-9]+/)) {
				params +=  '&pektis=' + uri(pektis.value.trim());
				params +=  '&apo=' + uri(apo.value.trim());
				params +=  '&eos=' + uri(eos.value.trim());
			}
		}

		req.send(params);
		return false;
	};

	function getDataCheck(req, ico, plist) {
		if (req.xhr.readyState != 4) { return; }

		ico.style.visibility = 'hidden';
		rsp = req.getResponse();
		try {
			var dedomena = eval('(' + rsp + ')');
		} catch(e) {
			mainFyi(rsp + ': invalid response data');
			return;
		}

		if (notSet(dedomena) || notSet(dedomena.ok) ||
			notSet(dedomena.partida) || isSet(dedomena.error)) {
			if (isSet(dedomena) && isSet(dedomena.error)) { rsp = dedomena.error; }
			mainFyi('Λανθασμένα δεδομένα: ' + rsp);
			return;
		}

		var html = '';
		for (var i = 0; i < dedomena.partida.length; i++) {
			html += Astra.partidaHTML(dedomena.partida[i], i, plist);
		}

		var x = getelid('dataArea');
		if (notSet(x)) { return; }
		x.innerHTML = html;
		if (dedomena.partida.length == 1) {
			Astra.dianomiOnOff(dedomena.partida[0].t);
		}
	};

	this.pektisHTML = function(pektis, kapikia, plist) {
		var pektisMatch = false;
		if (pektis != '') {
			for (var i = 0; i < plist.length; i++) {
				if (pektis.match('^' + plist[i] + '$')) {
					pektisMatch = true;
					break;
				}
			}
		}
		else {
			pektis = '&#8203;';
		}

		var html = '<div class="astraPartidaPektis';
		if (pektisMatch) {
			if (kapikia > 0) { html += ' astraThetikos'; }
			else if (kapikia < 0) { html += ' astraArnitikos'; }
		}
		html += '">';
		html += '<div class="astraOnoma';
		if (pektisMatch) { html += ' astraOnoma' + (i % 3); }
		html += '">';
		html += pektis;
		html += '</div>';
		html += '<div class="astraKapikia';
		if (kapikia < 0) { html += ' astraMion'; }
		html += '">';
		html += (kapikia != 0 ? kapikia : '&#8203;');
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.xronosHTML = function(xronos) {
		var html = '<div class="astraPartidaXronos">';
		html += xronos;
		html += '</div>';
		return html;
	};

	this.partidaHTML = function(partida, i, plist) {
		var html = '';
		html += '<div class="astraPartida zebra' + (i % 2) +
			'" onclick="Astra.dianomiOnOff(' + partida.t + ');" ' +
			'title="Κλικ για εμφάνιση/απόκρυψη διανομών" ' +
			'onmouseover="Astra.epilogiPartidas(this);" ' +
			'onmouseout="Astra.apoepilogiPartidas(this);">';
		html += '<div class="astraPartidaKodikos">';
		if (isSet(partida.a)) { html += '[' + partida.t + ']'; }
		else { html += partida.t; }
		html += '</div>';
		html += Astra.pektisHTML(partida.p1, partida.k1, plist);
		html += Astra.pektisHTML(partida.p2, partida.k2, plist);
		html += Astra.pektisHTML(partida.p3, partida.k3, plist);
		html += Astra.xronosHTML(partida.x);
		html += '</div>';
		html += '<div id="t' + partida.t + '"></div>';
		return html;
	};

	this.epilogiPartidas = function(div) {
		div.OBC = div.style.backgroundColor;
		div.style.backgroundColor = '#FFFF33';
		div.style.fontWeight = 'bold';
	};

	this.apoepilogiPartidas = function(div) {
		div.style.backgroundColor = div.OBC;
		div.style.fontWeight = 'normal';
	};

	this.dianomiOnOff = function(trapezi) {
		var x = getelid('t' + trapezi);
		if (notSet(x)) { return; }

		if (x.innerHTML != '') {
			x.innerHTML = '';
			return;
		}

		var ico = getelid('searchIcon');
		if (ico) { ico.style.visibility = 'visible'; }

		var req = new Request('astra/getDianomi');
		req.xhr.onreadystatechange = function() {
			getDianomiCheck(req, ico, x, trapezi);
		};

		var params = 'trapezi=' + uri(trapezi);
		req.send(params);
		return false;
	};

	function getDianomiCheck(req, ico, div, trapezi) {
		if (req.xhr.readyState != 4) { return; }

		ico.style.visibility = 'hidden';
		rsp = req.getResponse();
		try {
			var dedomena = eval('(' + rsp + ')');
		} catch(e) {
			mainFyi(rsp);
		}

		if (notSet(dedomena) || notSet(dedomena.ok) ||
			notSet(dedomena.dianomi) || isSet(dedomena.error)) {
			if (isSet(dedomena) && isSet(dedomena.error)) { rsp = dedomena.error; }
			mainFyi('Λανθασμένα δεδομένα: ' + rsp);
			return;
		}

		var html = '';
		for (var i = 0; i < dedomena.dianomi.length; i++) {
			html += Astra.dianomiHTML(dedomena.dianomi[i], i);
		}
		html += '<div class="astraDianomi">';
		html += '<div class="astraKlisimo" ' +
			'onmouseover="Astra.epilogiKlisimo(this);" ' +
			'onmouseout="Astra.apoepilogiKlisimo(this);" ' +
			'onclick="Astra.dianomiOnOff(' + trapezi + ');">';
		html += 'Κλείσιμο';
		html += '</div>';
		html += '</div>';

		div.innerHTML = html;
	};

	this.epilogiKlisimo = function(div) {
		div.OBC = div.style.backgroundColor;
		div.style.backgroundColor = '#94704D';
		div.style.fontWeight = 'bold';
	};

	this.apoepilogiKlisimo = function(div) {
		div.style.backgroundColor = div.OBC;
		div.style.fontWeight = 'normal';
	};

	this.agoraHTML = function(axb, ekane) {
		var asoi = axb.substr(0,1);
		var xroma = axb.substr(1,1);
		var bazes = axb.substr(2,1);

		var klasi = 'astraAgora';
		var mesa = bazes - ekane;
		if (mesa > 1) { klasi += ' astraSolo'; }
		else if (mesa > 0) { klasi += ' astraMesa'; }
		else if (ekane > 10) { klasi += ' astraKinisiAgora'; }

		var html = '';
		html += '<div class="' + klasi + '">';
		html += '<span class="astraAgoraBazes">' + bazes + '</span>';
		html += '<img class="astraAgoraXroma" src= "' + globals.server +
			'images/trapoula/xroma' + xroma + '.png" alt="" />';
		if (asoi == 'Y') {
			html += '&nbsp;+&nbsp;';
			html += '<img class="astraAgoraAsoi" src= "' + globals.server +
			'images/trapoula/asoi.png" title="Και οι άσοι!" alt="" />';
		}
		html += '</div>';
		return html;
	};

	this.dilosiHTML = function(dilosi, mesa) {
		var html = '';
		html += '<div class="astraDilosi';
		if (mesa > 1) { html += ' astraSolo'; }
		else if (mesa > 0) { html += ' astraMesa'; }
		else if (mesa < 0) { html += ' astraKinisiDilosi'; }
		html += '">';
		if (dilosi == 'DTG') {
			html += 'Άμα μείνουν';
		}
		else if (dilosi != '') {
			var exo = dilosi.substr(0, 1);
			var xroma = dilosi.substr(1, 1);
			var bazes = dilosi.substr(2, 1);
			if (exo == 'E') { html += 'Έχω '; }
			html += bazes;
			html += '<img class="astraDilosiXroma" src= "' + globals.server +
				'images/trapoula/xroma' + xroma + '.png" alt="" />';
		}
		else {
			html += '&nbsp;';
		}
		html += '</div>';
		return html;
	};

	var simetoxiDecode = {
		'P':	'ΠΑΙΖΩ',
		'S':	'ΠΑΣΟ',
		'M':	'ΜΑΖΙ',
		'N':	'ΜΟΝΟΣ',
		'V':	'ΒΟΗΘΑΩ',
		'?':	'????'
	};

	this.simetoxiHTML = function(simetoxi, kinisi) {
		var html = '';
		html += '<div class="astraSimetoxi astraSimetoxi' + simetoxi;
		if (simetoxi == 'S') { html += ' astraPaso'; }
		if (isSet(kinisi)) { html += ' astraKinisiSimetoxi'; }
		html += '">';
		html += simetoxiDecode.hasOwnProperty(simetoxi) ?
			simetoxiDecode[simetoxi] : simetoxi;
		html += '</div>';
		return html;
	};

	var RB = [ 'R', 'R', 'R', 'B', 'B' , 'B', 'R', 'R', 'R', 'B' ];

	this.bazesHTML = function(bazes) {
		var html = '';
		if (bazes <= 0) { return html; }

		html += '<div class="astraBazes">';
		for (var i = 0; i < bazes; i++) {
			html += '<img class="astraBazaIcon" src="' + globals.server +
				'images/trapoula/' + RB[i] + 'V.png" alt="" />';
		}
		html += '</div>';
		return html;
	};

	// Εδώ θα δημιουργήσουμε array "mesa" στο object "dianomi" με
	// στοιχεία που αφορούν στην κατάσταση των αμυνομένων και
	// αντιστοιχούν στις θέσεις των παικτών (1-based) όπου:
	//
	//	0	σημαίνει βγήκε ή πάσο
	//	1	μέσα απλά
	//	>1	μέσα σόλο

	this.mesaExo = function(dianomi) {
		dianomi.mesa = [ 0, 0, 0, 0 ];
		if (notSet(dianomi.a) || notSet(dianomi.t) ||
			notSet(dianomi.s) || notSet(dianomi.b)) {
			return;
		}

		var tzogadoros = dianomi.t;
		switch (tzogadoros) {
		case 1:
			var protos = 2;
			var defteros = 3;
			break;
		case 2:
			protos = 3;
			defteros = 1;
			break;
		case 3:
			protos = 1;
			defteros = 2;
			break;
		default:
			return;
		}

		// Αν και οι δύο αμυνόμενοι δήλωσαν πάσο, επιστρέφουμε άμεσα.
		if ((dianomi.s[protos] == 'S') && (dianomi.s[defteros] == 'S')) {
			return;
		}

		switch (parseInt(dianomi.a.substr(2,1))) {
		case 6:
			var protosPrepi = 2;
			var defterosPrepi = 2;
			break;
		case 7:
			protosPrepi = 2;
			defterosPrepi = 1;
			break;
		case 8:
			protosPrepi = 1;
			defterosPrepi = 1;
			break;
		case 9:
			protosPrepi = 1;
			defterosPrepi = 0;
			break;
		default:
			return;
		}

		// Αν κάποιος από τους αμυνόμενους πήγε πάσο
		// τον μηδενίζω και αλλάζω τον πρώτο.

		if (dianomi.s[protos] == 'S') {
			protos = defteros;
			defteros = 0;
		}

		if (dianomi.s[defteros] == 'S') {
			defteros = 0;
		}

		var aminaPrepi = 0;
		if (protos != 0) { aminaPrepi += protosPrepi; }
		if (defteros != 0) { aminaPrepi += defterosPrepi; }
		var piran = 10 - dianomi.b[tzogadoros];
		if (piran >= aminaPrepi) { return; }

		// Χρησιμοποιώ ένα τοπικό array με τις μπάζες των
		// αμυνομένων, στο οποίο όμως επιχειρώ ένα "ζύγισμα"
		// των μπαζών, δηλαδή τυχόν πλεόνασμα από τον έναν
		// αμυνόμενο το μεταφέρω στον άλλο.

		bazes = [ 0, 0, 0, 0 ]
		bazes[protos] = dianomi.b[protos];
		bazes[defteros] = dianomi.b[defteros];

		if ((protos != 0) && (defteros != 0)) {
			var dif = bazes[protos] - protosPrepi;
			if (dif > 0) {
				bazes[protos] -= dif;
				bazes[defteros] += dif;
			}

			dif = bazes[defteros] - defterosPrepi;
			if (dif > 0) {
				bazes[defteros] -= dif;
				bazes[protos] += dif;
			}
		}

		if (protos != 0) {
			var dif = protosPrepi - bazes[protos];
			if (dif > 1) { dianomi.mesa[protos] = 2; }
			else if (dif > 0) { dianomi.mesa[protos] = 1; }
		}

		if (defteros != 0) {
			dif = defterosPrepi - bazes[defteros];
			if (dif > 1) { dianomi.mesa[defteros] = 2; }
			else if (dif > 0) { dianomi.mesa[defteros] = 1; }
		}

		// Εφόσον ένας από τους δύο παίκτες είναι βοηθητικός,
		// σημαίνει ότι "τον πήρε" ο άλλος, ο οποίος πρέπει
		// να επιβαρυνθεί τη χασούρα.

		if (dianomi.s[protos] == 'V') {
			dianomi.mesa[defteros] += dianomi.mesa[protos];
			dianomi.mesa[protos] = 0;
		}

		if (dianomi.s[defteros] == 'V') {
			dianomi.mesa[protos] += dianomi.mesa[defteros];
			dianomi.mesa[defteros] = 0;
		}
	};

	this.dianomiPektisHTML = function(thesi, dianomi) {
		var paso = (notSet(dianomi.a) || notSet(dianomi.t));
		Astra.mesaExo(dianomi);

		var html = '';
		var klasi = 'astraDianomiPektis';
		if (paso) { klasi += ' astraPaso'; }
		html += '<div class="' + klasi + '" style="text-align: center;">';

		if (paso) {
			html += 'ΠΑΣΟ';
		}
		else {
			if (thesi == dianomi.t) {
				var bazes = isSet(dianomi.b) ? dianomi.b[dianomi.t] : 10;
				html += Astra.agoraHTML(dianomi.a, bazes);
			}
			else {
				html += Astra.dilosiHTML(dianomi.o[thesi], dianomi.mesa[thesi]);
				html += Astra.simetoxiHTML(dianomi.s[thesi]);
			}
		}

		if (thesi == dianomi.l) {
			html += '<img class="astraDealer" src= "' + globals.server +
				'images/dealer.png" title="Dealer" alt="" />';
		}

		if (isSet(dianomi.b)) {
			html += Astra.bazesHTML(dianomi.b[thesi]);
		}

		html += '</div>';
		return html;
	};

	this.dianomiHTML = function(dianomi, i) {
		var html = '';
		html += '<div class="astraDianomi astraDianomiZebra' + (i % 2) +
			'" onclick="Astra.kinisiOnOff(' + dianomi.d + ');" ' +
			'title="Κλικ για εμφάνιση/απόκρυψη κινήσεων" ' +
			'onmouseover="Astra.epilogiDianomis(this);" ' +
			'onmouseout="Astra.apoepilogiDianomis(this);">';
		for (var j = 1; j <= 3; j++) {
			html += Astra.dianomiPektisHTML(j, dianomi);
		}
		html += '</div>';
		html += '<div id="d' + dianomi.d + '"></div>';
		return html;
	};

	this.epilogiDianomis = function(div) {
		div.OBC = div.style.backgroundColor;
		div.style.backgroundColor = '#FF99C2';
	};

	this.apoepilogiDianomis = function(div) {
		div.style.backgroundColor = div.OBC;
	};

	this.kinisiOnOff = function(dianomi) {
		var x = getelid('d' + dianomi);
		if (notSet(x)) { return; }

		if (x.innerHTML != '') {
			x.innerHTML = '';
			return;
		}

		var ico = getelid('searchIcon');
		if (ico) { ico.style.visibility = 'visible'; }

		var req = new Request('astra/getKinisi');
		req.xhr.onreadystatechange = function() {
			getKinisiCheck(req, ico, x, dianomi);
		};

		var params = 'dianomi=' + uri(dianomi);
		req.send(params);
		return false;
	};

	var claim = '';

	function getKinisiCheck(req, ico, div, dianomi) {
		if (req.xhr.readyState != 4) { return; }

		ico.style.visibility = 'hidden';
		rsp = req.getResponse();
		try {
			var dedomena = eval('(' + rsp + ')');
		} catch(e) {
			mainFyi(rsp);
		}

		if (notSet(dedomena) || notSet(dedomena.ok) ||
			notSet(dedomena.kinisi) || isSet(dedomena.error)) {
			if (isSet(dedomena) && isSet(dedomena.error)) { rsp = dedomena.error; }
			mainFyi('Λανθασμένα δεδομένα: ' + rsp);
			return;
		}

		var html = '';
		claim = '';
		for (var i = 0; i < dedomena.kinisi.length; i++) {
			html += Astra.kinisiHTML(dedomena.kinisi[i], i, dianomi);
		}
		html += '<div class="astraKinisi">';
		html += '<div class="astraKlisimo" ' +
			'onmouseover="Astra.epilogiKlisimo(this);" ' +
			'onmouseout="Astra.apoepilogiKlisimo(this);" ' +
			'onclick="Astra.kinisiOnOff(' + dianomi + ');">';
		html += 'Κλείσιμο';
		html += '</div>';
		html += '</div>';

		div.innerHTML = html;
	};

	this.kinisiHTML = function(kinisi, i, dianomi) {
		var html = '';
		html += '<div class="astraKinisi astraKinisiZebra' + (i % 2) +
			'" onclick="Astra.kinisiOnOff(' + dianomi + ');" ' +
			'title="Κλικ για απόκρυψη κινήσεων" ' +
			'onmouseover="Astra.epilogiKinisis(this);" ' +
			'onmouseout="Astra.apoepilogiKinisis(this);">';
		html += '<div class="astraKinisiPektis astraKinisi' + kinisi.p + '">';
		switch (kinisi.i) {
		case 'ΔΗΛΩΣΗ':
			if (kinisi.d.match(/^P/)) { html += 'ΠΑΣΟ'; }
			else {
				html += Astra.dilosiHTML(kinisi.d, -1);
				html += kinisi.d;
			}
			break;
		case 'ΑΓΟΡΑ':
			html += Astra.agoraHTML(kinisi.d, 11);
			break;
		case 'ΣΥΜΜΕΤΟΧΗ':
			html += Astra.simetoxiHTML(kinisi.d, true);
			break;
		case 'ΦΥΛΛΟ':
			html += kinisi.d.substr(1, 1) + '<img class="astraKinisiXroma" src="' +
				globals.server + 'images/trapoula/xroma' + kinisi.d.substr(0, 1) +
				'.png" alt="" />';
			break;
		case 'ΜΠΑΖΑ':
			html += '<div class="astraKinisiBaza">ΜΠΑΖΑ</div>';
			break;
		case 'CLAIM':
			html += '<div class="astraKinisiClaim' + claim + '">' +
				(claim == '' ? 'CLAIM' : 'Ok!') + '</div>';
			claim = 'Ok';
			break;
		default:
			html += kinisi.i;
			break;
		}
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.epilogiKinisis = function(div) {
		div.OBC = div.style.backgroundColor;
		div.style.backgroundColor = '#80CCCC';
	};

	this.apoepilogiKinisis = function(div) {
		div.style.backgroundColor = div.OBC;
	};
};

window.onload = function() {
	init();
	Astra.setHeight();
	Astra.getData();
};
