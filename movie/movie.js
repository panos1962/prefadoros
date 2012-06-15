if (notSet(window.Movie)) { var Movie = {}; }null;
var pexnidi = {};

function isPektis() {
	return(isSet(window.pektis) && isSet(pektis.login));
}

Movie.alagiThesis = function(thesi) {
	Movie.thesi = thesi;
	var d = Movie.dianomi;
	Movie.dianomi = null;
	Movie.selectDianomi(d);
};

Movie.nextFrame = null;

Movie.clearNextFrame = function() {
	if (isSet(Movie.nextFrame)) {
		clearTimeout(Movie.nextFrame);
	}
	Movie.nextFrame = null;
	Movie.playing(false);
};

Movie.selectDianomi = function(d) {
	Movie.clearNextFrame();
	if (notSet(Movie.trapezi)) { return; }
	if (isSet(Movie.dianomi) && isSet(d) && (Movie.dianomi == d)) {
		Movie.pexeDianomi();
		return;
	}

	var href = globals.server + 'movie/index.php?trapezi=' + uri(Movie.trapezi);
	if (Movie.dbg) { href += '&debug=yes'; }
	if (isSet(d)) {
		if (d > 0) { href += '&dianomi=' + uri(d); }
		else { href += '&enarxi=yes'; }
	}
	href += '&thesi=' + Movie.thesi;
	window.location.href = href;
};

Movie.pexeDianomi = function() {
	if (notSet(Movie.dianomi)) { return; }
	Movie.Controls.play();
};

Movie.tzogosDefault = true;

Movie.tzogosDefaultOnOff = function(img) {
	Movie.tzogosDefault = !Movie.tzogosDefault;
	Movie.showTzogosDefault(img);
	Movie.keepMovieSettings();
};

Movie.showTzogosDefault = function(img) {
	if (notSet(img)) { img = getelid('tzogosDflt'); }
	if (notSet(img)) { return; }
	img.style.display = 'inline';
	if (Movie.tzogosDefault) {
		img.src = globals.server + 'images/movie/tzogosKlistos.png';
		img.title = 'Τζόγος κλειστός';
	}
	else {
		img.src = globals.server + 'images/movie/tzogosAniktos.png';
		img.title = 'Τζόγος ανοικτός';
	}
};

Movie.tzogosAniktos = null;

Movie.tzogosOnOff = function(div, fila) {
	if (notSet(div)) { return; }
	if (notSet(Movie.tzogosAniktos)) { return; }
	if (isSet(fila)) {
		div.filaHTML = Movie.tzogosHTML(fila);
	}
	if (Movie.tzogosAniktos) {
		var html = div.filaHTML;
		div.title = 'Κλείσιμο τζόγου';
	}
	else {
		html = '<img class="movieTzogosIcon" src="' + globals.server +
			'images/trapoula/tzogos.png" alt="" />';
		div.title = 'Άνοιγμα τζόγου';
	}
	div.innerHTML = html;
	div.style.display = Movie.tzogosAniktos ? 'inline' : 'none';
	Movie.tzogosAniktos = !Movie.tzogosAniktos;
};

Movie.tzogosHTML = function(fila) {
	var html = '';
	html += '<img class="movieFilaSiraIcon" src="' + globals.server +
		'images/trapoula/' + fila.substr(0, 2) + '.png" alt="" ' +
		'style="left: 2.1cm; top: 0.5cm;" />';
	html += '<img class="movieFilaSiraIcon" src="' + globals.server +
		'images/trapoula/' + fila.substr(2, 2) + '.png" alt="" ' +
		'style="left: 4.2cm; top: 0.5cm; padding-left: 0.2cm;" />';
	return html;
};

Movie.miraseFila = function() {
	Movie.cursor = null;
	Movie.reset();
	Movie.resetGipedo();
	if (notSet(Movie.kinisi)) { return; }
	if (Movie.kinisi.length <= 0) { return; }
	if (Movie.kinisi[0].idos != 'ΔΙΑΝΟΜΗ') { return; }
	var fila = Movie.kinisi[0].data.split(':');
	if (fila.length != 4) {
		mainFyi(Movie.kinisi[0].data + ': λανθασμένα στοιχεία διανομής');
		return;
	}

	for (var i = 1; i <= 3; i++) {
		var p = getelid('filaArea' + i);
		if (isSet(p)) {
			var html = Movie.filaHTML(i, Pexnidi.spaseFila(fila[i]));
			p.innerHTML = html;
		}
		p = getelid('dilosi' + i);
		if (isSet(p)) { p.innerHTML = ''; }
		p = getelid('simetoxi' + i);
		if (isSet(p)) { p.innerHTML = ''; }
		Movie.displayKapikia(i);
	}

	Movie.tzogosAniktos = !Movie.tzogosDefault;
	Movie.tzogosOnOff(getelid('tzogos'), fila[0]);

	Movie.cursor = 0;
	Movie.displayEpomenos();
	Movie.displayIpolipo();
};

Movie.filaHTML = function(thesi, fila) {
	var html = '';
	if (fila.length <= 0) { return html; }

	html = '<div class="movieFilaXeri';
	switch (Movie.Partida.simetoxi[thesi]) {
	case 'ΠΑΣΟ':
		html += ' movieFilaPaso';
		break;
	case 'ΒΟΗΘΑΩ':
		html += ' movieFilaVoithao';
		break;
	}
	html += '">';
	var tzogos = (fila.length > 10);
	var proto = ' style="margin-left: 0px;"';
	var prevXroma = '';
	var prevMavroKokino = '';
	for (var i = 0; i < fila.length; i++) {
		html += '<div class="movieFilaSira';
		if (tzogos) { html += ' movieFilaSiraSteno movieFiloSteno'; }
		html += '"' + proto + '>';
		proto = '';
		html += '<img class="movieFilaSiraIcon';
		if (tzogos) { html += ' movieFiloSteno'; }
		if (i > 0) { html += ' movieFiloSkia'; }
		var curXroma = fila[i].substr(0, 1);
		if (curXroma != prevXroma) {
			prevXroma = curXroma;
			var curMavroKokino = Pexnidi.mavroKokino[curXroma];
			if (curMavroKokino == prevMavroKokino) {
				html += ' movieFiloDiaxor' + curMavroKokino;
			}
			else {
				prevMavroKokino = curMavroKokino;
			}
		}
		html += '" src="' + globals.server + 'images/trapoula/' +
			fila[i] + '.png" alt="" />';
		html += '</div>';
	}
	html += '</div>';
	return html;
};

Movie.ipopsifiaDianomi = function(div, nai) {
	if (nai) {
		div.prevWeight = div.style.fontWeight;
		div.style.fontWeight = 'bold';
	}
	else {
		try {
			div.style.fontWeight = div.prevWeight;
		} catch (e) {
			div.style.fontWeight = 'normal';
		}
	}
};

Movie.realTime = true;
Movie.timeScale = 1000;

Movie.setRealTime = function(yes) {
	Movie.realTime = yes;
	Movie.timeScale = 1000;
	Movie.showTimeSettings();
	Movie.keepMovieSettings();
Movie.debug((Movie.realTime ? 'Real time' : 'Fixed time') + ', step = ' + Movie.timeScale);
};

Movie.calcTimeStep = function() {
	if (Movie.timeScale > 2000) { return 500; }
	if (Movie.timeScale > 1000) { return 200; }
	if (Movie.timeScale > 500) { return 100; }
	return 50;
};

Movie.slower = function() {
	if ((Movie.timeScale += Movie.calcTimeStep()) >= 3000) {
		Movie.timeScale = 3000;
	}
	Movie.showTimeSettings();
	Movie.keepMovieSettings();
Movie.debug((Movie.realTime ? 'Real time' : 'Fixed time') + ', step = ' + Movie.timeScale);
};

Movie.faster = function() {
	if ((Movie.timeScale -= Movie.calcTimeStep()) < 50) {
		Movie.timeScale = 50;
	}
	Movie.showTimeSettings();
	Movie.keepMovieSettings();
Movie.debug((Movie.realTime ? 'Real time' : 'Fixed time') + ', step = ' + Movie.timeScale);
};

Movie.keepMovieSettings = function() {
	var req = new Request('pektis/setMovie');
	req.xhr.onreadystatechange = function() {
		Movie.keepMovieSettingsCheck(req);
	};
	var params = 'time=' + (Movie.realTime ? 'REAL' : 'METRONOME');
	params += '&scale=' + Movie.timeScale;
	params += '&tzogos=' + (Movie.tzogosDefault ? 'CLOSED' : 'OPEN');
	req.send(params);
};

Movie.keepMovieSettingsCheck = function(req) {
	if (req.xhr.readyState != 4) { return; }
	var rsp = req.getResponse();
	mainFyi(rsp);
};

Movie.getMovieSettings = function() {
	var req = new Request('pektis/getMovie', false);
	req.send();
	if (req.xhr.readyState != 4) { return; }
	var rsp = req.getResponse();
	try {
		eval(rsp);
		Movie.showTimeSettings();
		Movie.showTzogosDefault();
	} catch (e) {
		mainFyi(rsp);
	}
};

Movie.entopiseDianomi = function() {
	for (var i = 0; i < Movie.dianomes.length; i++) {
		if (Movie.dianomi == Movie.dianomes[i]) {
			return(i);
		}
	}
	return null;
};

Movie.debug = function(s, newline) {
	var x = getelid('debugArea');
	if (notSet(x)) { return; }
	if (notSet(newline)) { newline = true; }
	var y = document.createElement(newline ? 'div' : 'span');
	y.innerHTML = s;
	x.appendChild(y);
	if (isSet(x.scrollHeight)) { x.scrollTop = x.scrollHeight; }
};

Movie.playing = function(yes) {
	var x = getelid('playing');
	if (notSet(x) || notSet(x.style) || notSet(x.style.display)) { return; }
	if (yes) {
		x.style.display = 'inline';
	}
	else {
		x.style.display = 'none';
	}
};

Movie.showTimeSettings = function() {
	if (Movie.realTime) {
		var on = getelid('roloi');
		var off = getelid('metronomos');
	}
	else {
		off = getelid('roloi');
		on = getelid('metronomos');
	}
	if (isSet(on)) { on.style.borderColor = '#FF6666'; }
	if (isSet(off)) { off.style.borderColor = '#8CAA88'; }

	off = getelid('slow');
	if (isSet(off)) { off.style.borderColor = '#8CAA88'; }
	off = getelid('fast');
	if (isSet(off)) { off.style.borderColor = '#8CAA88'; }
	if (Movie.timeScale < 350) {
		on = getelid('fast');
		var color = '#FFFF33';
	}
	else if (Movie.timeScale < 550) {
		on = getelid('fast');
		color = '#FF6666';
	}
	else if (Movie.timeScale < 950) {
		on = getelid('fast');
		color = '#335C33';
	}
	else if (Movie.timeScale > 2250) {
		on = getelid('slow');
		color = '#FFFF33';
	}
	else if (Movie.timeScale > 1550) {
		on = getelid('slow');
		color = '#FF6666';
	}
	else if (Movie.timeScale > 1050) {
		on = getelid('slow');
		color = '#335C33';
	}
	else {
		on = null;
	}
	if (isSet(on)) { on.style.borderColor = color; }
};

Movie.Controls = {};

Movie.Controls.play = function(vima) {
	Movie.clearNextFrame();
	if (notSet(Movie.dianomi)) {
		Movie.Controls.dianomi(1);
		return;
	}

	if (notSet(Movie.cursor)) {
		Movie.miraseFila();
		return;
	}

	if (notSet(vima)) {
		vima = 1;
		var auto = true;
	}
	else {
		auto = false;
	}

	while (true) {
		Movie.cursor += vima;
		if (Movie.cursor >= Movie.kinisi.length) {
			Movie.Controls.dianomi(1);
			return;
		}

		if (Movie.cursor < 0) {
			Movie.Controls.dianomi(-1);
			return;
		}

		if (auto) { break; }
		if (Movie.kinisi[Movie.cursor].idos != 'DELAY') { break; }
	}

	Movie.display();

	if (Movie.cursor >= Movie.kinisi.length - 1) {
		return;
	}

	var pause = Movie.showEpomeno();
	if (notSet(auto)) { auto = true; }
	if (auto) {
		Movie.nextFrame = setTimeout(function() {
			Movie.Controls.play();
		}, pause);
		Movie.playing(true);
	}
};

Movie.display = function() {
	Movie.reset();
	for (var i = 0; i <= Movie.cursor; i++) {
		var thesi = Movie.kinisi[i].pektis;
		var idos = Movie.kinisi[i].idos;
		var data = Movie.kinisi[i].data;
		Movie.debugKinisi(i, idos, thesi, data);
		switch (Movie.kinisi[i].idos) {
		case 'ΔΙΑΝΟΜΗ':
			Movie.processDianomi(i, thesi, data);
			break;
		case 'ΔΗΛΩΣΗ':
			Movie.processDilosi(i, thesi, data);
			break;
		case 'ΤΖΟΓΟΣ':
			Movie.processTzogos(i, thesi, data);
			break;
		case 'BEFORE_AGORA':
			Movie.processBeforeAgora(i, thesi, data);
			break;
		case 'ΑΓΟΡΑ':
			Movie.processAgora(i, thesi, data);
			break;
		case 'ΣΥΜΜΕΤΟΧΗ':
			Movie.processSimetoxi(i, thesi, data);
			break;
		case 'ΦΥΛΛΟ':
			Movie.processFilo(i, thesi, data);
			break;
		case 'ΜΠΑΖΑ':
			Movie.processBaza(i, thesi, data);
			break;
		case 'AFTER_BAZA':
			Movie.processAfterBaza(i, thesi, data);
			break;
		case 'CLAIM':
			Movie.processClaim(i, thesi, data);
			break;
		case 'ΠΛΗΡΩΜΗ':
			Movie.processPliromi(i, thesi, data);
			break;
		}
	}

	Movie.displayTzogos();
	for (i = 1; i <= 3; i++) {
		Movie.displayPektis(i);
	}
	Movie.displayIpolipo();
	Movie.displayEpomenos();
	Movie.displayBaza();
};

Movie.displayPektis = function(thesi) {
	Movie.displayKapikia(thesi);
	Movie.displayFila(thesi);
	if (thesi == Movie.Partida.tzogadoros) {
		Movie.displayAgora(thesi);
	}
	else {
		Movie.displayDilosi(thesi);
		Movie.displaySimetoxi(thesi);
	}
	Movie.displayBazes(thesi);
};

Movie.displayFila = function(thesi) {
	var x = getelid('filaArea' + thesi);
	if (notSet(x)) { return; }
	var html = Movie.filaHTML(thesi, Pexnidi.spaseFila(Movie.Partida.fila[thesi]));
	x.innerHTML = html;
};

Movie.displayAgora = function(thesi) {
	x = getelid('dilosi' + thesi);
	if (notSet(x)) { return; }
	x.setAttribute('class', x.getAttribute('class') + ' dilosiAgora');
	var html = Pexnidi.xromaBazesHTML(Movie.Partida.agora);
	x.innerHTML = html;
};

Movie.displayDilosi = function(thesi) {
	x = getelid('dilosi' + thesi);
	if (notSet(x)) { return; }

	var html = '';
	var klasi = 'movieDilosi movieDilosi' + thesi;
	if (Movie.Partida.paso[thesi] != '') {
		klasi += ' protasiAgoraOxi';
		html = Movie.Partida.paso[thesi];
	}
	if (Movie.Partida.dilosi[thesi] != '') {
		if (Movie.Partida.dilosi[thesi] == Movie.Partida.dilosi[0]) {
			klasi += ' movieDilosiLast';
		}
		html = Pexnidi.xromaBazesHTML(Movie.Partida.dilosi[thesi]);
	}

	x.setAttribute('class', klasi);
	x.innerHTML = html;
};

Movie.displaySimetoxi = function(thesi) {
	x = getelid('simetoxi' + thesi);
	if (notSet(x)) { return; }

	if (Movie.Partida.bazesOles > 0) {
		var html = '';
		var klasi = 'movieDilosi movieSimetoxi' + thesi;
	}
	else {
		html = Movie.Partida.simetoxi[thesi];
		klasi = 'movieDilosi movieSimetoxi' + thesi + ' simetoxi';
		switch (Movie.Partida.simetoxi[thesi]) {
		case 'ΠΑΙΖΩ':
			klasi += ' simetoxiPezo'
			break;
		case 'ΠΑΣΟ':
			klasi += ' simetoxiPaso'
			break;
		case 'ΜΟΝΟΣ':
			klasi += ' simetoxiMonos'
			break;
		case 'ΜΑΖΙ':
			klasi += ' simetoxiMazi'
			var m = getelid('mazi' + thesi);
			if (isSet(m)) { m.style.display = 'inline'; }
			break;
		case 'ΒΟΗΘΑΩ':
			klasi += ' simetoxiVoithao'
			break;
		}
	}

	x.setAttribute('class', klasi);
	x.innerHTML = html;
};

Movie.plati = [
	'B', 'B', 'B',
	'R', 'R', 'R',
	'B', 'B', 'B',
	'R', 'R', 'R', 
	'B'
];

Movie.displayBazes = function(thesi) {
	if (Movie.Partida.bazesOles <= 0) { return; }
	x = getelid('simetoxi' + thesi);
	if (notSet(x)) { return; }

	var html = '';
	for (var i = 0; i < Movie.Partida.bazes[thesi]; i++) {
		html += '<img class="movieBazaIcon" src="' + globals.server +
			'images/trapoula/' + Movie.plati[i] + 'V.png" alt="" />';
	}

	x.setAttribute('class', 'movieDilosi movieSimetoxi' + thesi);
	x.innerHTML = html;
};

Movie.displayTzogos = function() {
	var x = getelid('tzogos');
	if (notSet(x)) { return; }
	if (Movie.Partida.tzogos) {
		x.style.display = 'inline';
	}
	else {
		x.style.display = 'none';
	}
};

Movie.displayIpolipo = function() {
	var x = getelid('ipolipo');
	if (notSet(x)) { return; }
	x.innerHTML = Movie.ipolipo - (Movie.Partida.ipolipo / 10);
};

Movie.displayEpomenos = function() {
	for (var i = 1; i <= 3; i++) {
		var x = getelid('pektisMain' + i);
		if (notSet(x)) { continue; }
		x.setAttribute('class', 'moviePektisMain moviePektisMain' + i);
	}

	var epomenos = null;
	for (i = Movie.cursor + 1; i < Movie.kinisi.length; i++) {
		switch (Movie.kinisi[i].idos) {
		case 'ΔΗΛΩΣΗ':
		case 'ΣΥΜΜΕΤΟΧΗ':
		case 'ΦΥΛΛΟ':
		case 'ΤΖΟΓΟΣ':
		case 'ΑΓΟΡΑ':
		case 'ΜΠΑΖΑ':
		case 'AFTER_BAZA':
		case 'AFTER_TZOGOS':
		case 'CLAIM':
			epomenos = Movie.kinisi[i].pektis;
			break;
		}
		if (isSet(epomenos)) {
			break;
		}
	}
	if (notSet(epomenos)) { return;}
	var x = getelid('pektisMain' + epomenos);
	if (notSet(x)) { return; }
	x.setAttribute('class', 'moviePektisMain moviePektisMain' + epomenos + ' epomenos');
};

Movie.displayBaza = function() {
	var x = getelid('baza');
	if (notSet(x)) { return; }

	var html = '';
	if (Movie.Partida.claim) {
		html += '<img class="movieClaimIcon" src="' + globals.server +
			'images/controlPanel/claim.png" alt="" />';
	}
	else if (Movie.Partida.alagi != '') {
		html += '<div class="movieAlagi" title="Σκάρτα">' +
			Movie.tzogosHTML(Movie.Partida.alagi) + '</div>';
	}
	else {
		for (var i = 0; i < Movie.Partida.bazaFilo.length; i++) {
			html += '<img class="movieBazaFilo movieBazaFilo' +
				Movie.Partida.bazaFilo[i].pektis;
			if (i > 0) { html += ' bazaFiloSkia'; }
			html += '" src="' + globals.server + 'images/trapoula/' +
				Movie.Partida.bazaFilo[i].filo +
				'.png" alt="" style="z-index: ' + (10 + i) + ';" />';
			html += '<img class="movieBazaVelos movieBazaVelos' +
				Movie.Partida.bazaFilo[i].pektis + '" src="' +
				globals.server + 'images/';
			if (Movie.Partida.bazaPektis == Movie.Partida.bazaFilo[i].pektis) {
				html += 'baza.gif" onload="Movie.pareBaza(this, ' +
					 Movie.Partida.bazaFilo[i].pektis + ');"';
			}
			else {
				html += 'velos' + Movie.Partida.bazaFilo[i].pektis + '.png"'
			}
			html += ' alt="" />';
		}
	}
	x.innerHTML = html;
};

Movie.pareBaza = function(img, thesi) {
	setTimeout(function() {
		try {
			img.src = globals.server + 'images/velos' + thesi + 'pare.png';
		} catch (e) {};
	}, 200);
};

Movie.reset = function() {
	Movie.Partida = {};
	Movie.Partida.agora = null;
	Movie.Partida.tzogadoros = 0;
	Movie.Partida.fila = [];
	Movie.Partida.tzogos = true;
	Movie.Partida.alagi = '';
	Movie.Partida.dilosi = ['', '', '', ''];
	Movie.Partida.paso = ['', '', '', ''];
	Movie.Partida.simetoxi = ['', '', '', ''];
	Movie.Partida.bazes = [0, 0, 0, 0];
	Movie.Partida.pliromi = [0, 0, 0, 0];
	Movie.Partida.ipolipo = 0;
	Movie.Partida.bazesOles = 0;
	Movie.resetBaza();

	Movie.debug('<hr />');
	for (var i = 0; i <= 3; i++) {
		var p = getelid('dilosi' + i);
		if (isSet(p)) {
			p.setAttribute('class', 'movieDilosi movieDilosi' + i);
			p.innerHTML = '';
		}
		p = getelid('mazi' + i);
		if (isSet(p)) { p.style.display = 'none'; }
	}
};

Movie.resetBaza = function() {
	Movie.Partida.bazaFilo = [];
	Movie.Partida.bazaPektis = 0;
	Movie.Partida.claim = false;
};

Movie.debugKinisi = function(i, idos, thesi, data) {
	Movie.debug(i + '. ' + idos + ': Θέση: ' + thesi +
		'<div class="movieDebugData">' + data + '</div>');
};

Movie.processDianomi = function(i, thesi, data) {
	var fila = data.split(':');
	for (var i = 1; i <= 3; i++) {
		Movie.Partida.fila[i] = fila[i];
	}
};

Movie.processDilosi = function(i, thesi, data) {
	if (data.match(/^P/)) {
		Movie.Partida.paso[thesi] = 'ΠΑΣΟ';
		return;
	}

	Movie.Partida.dilosi[thesi] = data;
	Movie.Partida.dilosi[0] = data;
	for (var i = 1; i <= 3; i++) {
		if ((i != thesi) && (Movie.Partida.dilosi[i] == 'DTG')) {
			Movie.Partida.paso[i] = 'ΠΑΣΟ';
		}
	}
};

Movie.processTzogos = function(i, thesi, data) {
	Movie.Partida.fila[thesi] += data;
	Movie.Partida.tzogos = false;
	Movie.Partida.alagi = '';
};

Movie.processBeforeAgora = function(i, thesi, data) {
	var x = data.split(':');
	if (x.length != 2) { return; }
	var fila10 = x[1];
	var fila12 = Movie.Partida.fila[thesi];
	for (var i = 0; i < 20; i += 2) {
		var filo = fila10.substr(i, 2);
		var pat = new RegExp(filo, '');
		fila12 = fila12.replace(pat, '');
	}
	Movie.Partida.fila[thesi] = fila10;
	Movie.Partida.alagi = fila12;
};

Movie.processAgora = function(i, thesi, data) {
	var x = data.split(':');
	if (x.length != 2) { return; }
	Movie.Partida.tzogadoros = thesi;
	Movie.Partida.agora = x[0];
	Movie.Partida.fila[thesi] = x[1];
	Movie.Partida.alagi = '';
};

Movie.processSimetoxi = function(i, thesi, data) {
	Movie.Partida.simetoxi[thesi] = data;
	if (data == 'ΜΑΖΙ') {
		var x = getelid('mazi' + thesi);
		if (isSet(x)) { x.style.display = 'inline'; }
		for (var i = 1; i <= 3; i++) {
			if (Movie.Partida.simetoxi[i] == 'ΠΑΣΟ') {
				Movie.Partida.simetoxi[i] = 'ΒΟΗΘΑΩ';
			}
		}
	}
};

Movie.processFilo = function(i, thesi, data) {
	if (Movie.Partida.bazaPektis != 0) { Movie.resetBaza(); }
	var pat = new RegExp(data);
	Movie.Partida.fila[thesi] = Movie.Partida.fila[thesi].replace(pat, '');
	Movie.Partida.bazaFilo[Movie.Partida.bazaFilo.length] = {
		"pektis":	thesi,
		"filo":		data
	};
};

Movie.processBaza = function(i, thesi, data) {
	Movie.Partida.bazes[thesi]++;
	Movie.Partida.bazesOles++;
	Movie.Partida.bazaPektis = thesi;
};

Movie.processAfterBaza = function(i, thesi, data) {
	Movie.resetBaza();
};

Movie.processClaim = function(i, thesi, data) {
	Movie.resetBaza();
	Movie.Partida.claim = thesi;
};

Movie.processPliromi = function(i, thesi, data) {
	Movie.resetBaza();
	var x = data.split(':');
	if (x.length != 7) { return; }

	for (var i = 1; i <= 3; i++) {
		var kasa = parseInt(x[(2 * i) - 1]);
		var kapikia = parseInt(x[2 * i]);
		if (kasa != 0) {
			Movie.Partida.ipolipo += kasa;
			kasa = parseInt(kasa / 3);
			Movie.Partida.pliromi[i] += kasa * 2;
			for (var j = 1; j <= 3; j++) {
				if (j != i) {
					Movie.Partida.pliromi[j] -= kasa;
				}
			}
		}
		Movie.Partida.pliromi[i] += parseInt(kapikia);
	}
};

Movie.displayKapikia = function(thesi) {
	var x = getelid('kapikia' + thesi);
	if (notSet(x)) { return; }

	var kapikia = Movie.kapikia[thesi] + Movie.Partida.pliromi[thesi];
	var cl = 'movieKapikia movieKapikia' + thesi;
	if (kapikia < 0) {
		x.setAttribute('class', cl + ' kapikiaMion');
		x.innerHTML = kapikia;
	}
	else if (kapikia > 0) {
		x.setAttribute('class', cl + ' kapikiaSin');
		x.innerHTML = '+' + kapikia;
	}
	else {
		x.setAttribute('class', cl);
		x.innerHTML = '';
	}
};

Movie.showEpomeno = function() {
	if (notSet(Movie.cursor) || (Movie.cursor >= (Movie.kinisi.length - 1))) {
		return 100;
	}

	var xronos = Movie.kinisi[Movie.cursor + 1].pote - Movie.kinisi[Movie.cursor].pote;
	if (Movie.realTime) {
		var pause = xronos * Movie.timeScale;
	}
	else {
		pause = Movie.timeScale;
	}

	var x = getelid('epomeno');
	if (notSet(x)) { return pause; }

	var n = Movie.kinisi.length - 2;
	while (n < 0) { n++; }

	var html = '';
	if (isSet(Movie.cursor) && (Movie.cursor > 0)) {
		html += '<span class="partidaInfoData" title="Τρέχουσα κίνηση">' +
			Movie.cursor + '</span> # ';
	}
	html += '<span class="partidaInfoData" title="Πλήθος κινήσεων">' + n + '</span>, ' +
		'<span class="partidaInfoData" title="Πραγματικός επόμενης κίνησης">' +
			xronos + '</span> ~ ' +
		'<span class="partidaInfoData" title="Χρόνος επόμενου frame">' +
			(pause / 1000) + '</span> sec';
	x.innerHTML = html;
	return pause;
};

Movie.Controls.pause = function() {
	if (isSet(Movie.nextFrame)) {
		Movie.clearNextFrame();
	}
	else {
		Movie.Controls.play();
	}
};

Movie.Controls.stop = function() {
	Movie.clearNextFrame();
};

Movie.Controls.prevDianomi = function() {
	Movie.clearNextFrame();
	if (isSet(Movie.cursor) && (Movie.cursor > 0)) {
		Movie.miraseFila();
	}
	else {
		Movie.Controls.dianomi(-1);
	}
	Movie.showEpomeno();
};

Movie.Controls.nextDianomi = function() {
	Movie.clearNextFrame();
	if (isSet(Movie.cursor) && (Movie.cursor > 0) &&
		(Movie.cursor < (Movie.kinisi.length -1))) {
		Movie.cursor = Movie.kinisi.length - 2;
		if (Movie.cursor > 0) { Movie.Controls.play(); }
		else { Movie.miraseFila(); }
	}
	else {
		Movie.Controls.dianomi(1);
	}
	Movie.showEpomeno();
};

Movie.Controls.dianomi = function(vima) {
	if (Movie.dianomes.length <= 0) {
		mainFyi('Δεν υπάρχουν διανομές!');
		return;
	}

	if (notSet(Movie.dianomi)) {
		if (isSet(vima) && (vima > 0)) {
			if (Movie.enarxi) {
				Movie.selectDianomi(Movie.dianomes[0]);
			}
			else {
				Movie.selectDianomi(0);
			}
		}
		else if (Movie.enarxi) {
			Movie.selectDianomi();
		}
		else {
			Movie.selectDianomi(Movie.dianomes[Movie.dianomes.length - 1]);
		}
		return;
	}

	var i = Movie.entopiseDianomi();
	if (notSet(i)) {
		mainFyi('Ακαθόριστη διανομή!');
		return;
	}

	if (isSet(vima) && (vima > 0)) {
		i++;
		if (i >= Movie.dianomes.length) {
			Movie.selectDianomi();
			return;
		}
	}
	else {
		i--;
		if (i < 0) {
			Movie.selectDianomi(0);
			return;
		}
	}
	Movie.selectDianomi(Movie.dianomes[i]);
};

Movie.resetGipedo = function() {
	var x = getelid('gipedo');
	if (notSet(x)) { return; }

	var html = '<div id="tzogos" title="Άνοιγμα τζόγου" style="cursor: pointer;" ' +
		'onclick="Movie.tzogosOnOff(this);"></div><div id="baza"></div>';
	x.innerHTML = html;
};

window.onload = function() {
	init();
	if (isSet(Movie.dianomiSpot)) {
		window.location.hash = '#dianomi' + Movie.dianomiSpot;
	}

	Movie.resetGipedo();
	Movie.getMovieSettings();
	if (isSet(Movie.dianomi)) {
		Movie.miraseFila();
	}

	Movie.showEpomeno();
	if (Movie.autoplay) {
		Movie.pexeDianomi();
	}
};
