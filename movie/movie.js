if (notSet(window.Movie)) { var Movie = {}; }null;
var pexnidi = {};

function isPektis() {
	return(isSet(window.pektis) && isSet(pektis.login));
}

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
	if (Movie.debugger) { href += '&debug=yes'; }
	if (isSet(d)) {
		if (d > 0) { href += '&dianomi=' + uri(d); }
		else { href += '&enarxi=yes'; }
	}
	window.location.href = href;
};

Movie.pexeDianomi = function() {
	if (notSet(Movie.dianomi)) { return; }
	Movie.Controls.play();
};

Movie.tzogosAniktos = null;

Movie.tzogosOnOff = function(div, fila) {
	if (notSet(div)) { return; }
	if (notSet(Movie.tzogosAniktos)) { return; }
	if (isSet(fila)) {
		div.filaHTML = '<img class="movieFilaSiraIcon" src="' + globals.server +
			'images/trapoula/' + fila.substr(0, 2) + '.png" alt="" ' +
			'style="left: 2.1cm; top: 0.5cm;" />' +
			'<img class="movieFilaSiraIcon" src="' + globals.server +
			'images/trapoula/' + fila.substr(2, 2) + '.png" alt="" ' +
			'style="left: 4.2cm; top: 0.5cm; padding-left: 0.2cm;" />';
	}
	if (Movie.tzogosAniktos) {
		var html = '<img class="movieTzogosIcon" src="' + globals.server +
			'images/trapoula/tzogos.png" alt="" />';
		div.title = 'Άνοιγμα τζόγου';
	}
	else {
		html = div.filaHTML;
		div.title = 'Κλείσιμο τζόγου';
	}
	div.innerHTML = html;
	Movie.tzogosAniktos = !Movie.tzogosAniktos;
};

Movie.dioxeTzogo = function() {
	sviseNode(getelid('tzogos'));
	Movie.tzogosAniktos = null;
};

Movie.miraseFila = function() {
	Movie.cursor = null;
	if (notSet(Movie.kinisi)) { return; }
	if (Movie.kinisi.length <= 0) { return; }
	if (Movie.kinisi[0].idos != 'ΔΙΑΝΟΜΗ') { return; }
	var x = Movie.kinisi[0].data.split(':');
	if (x.length != 4) {
		mainFyi(Movie.kinisi[0].data + ': λανθασμένα στοιχεία διανομής');
		return;
	}

	for (var i = 1; i <= 3; i++) {
		var p = getelid('filaArea' + i);
		if (notSet(p)) { continue; }
		var html = Movie.filaHTML(Pexnidi.spaseFila(x[i]));
		p.innerHTML = html;
	}

	Movie.tzogosAniktos = true;
	Movie.tzogosOnOff(getelid('tzogos'), x[0]);

	Movie.cursor = 0;
};

Movie.mavroKokino = {
	'S':	'M',
	'C':	'M',
	'D':	'K',
	'H':	'K'
};

Movie.filaHTML = function(fila) {
	var html = '';
	if (fila.length <= 0) { return html; }

	html = '<div class="movieFilaXeri">';
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
		var curXroma = fila[i].substr(0, 1);
		if (curXroma != prevXroma) {
			prevXroma = curXroma;
			var curMavroKokino = Movie.mavroKokino[curXroma];
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
Movie.debug((Movie.realTime ? 'Real time' : 'Fixed time') + ', step = ' + Movie.timeScale);
};

Movie.faster = function() {
	if ((Movie.timeScale -= Movie.calcTimeStep()) < 50) {
		Movie.timeScale = 50;
	}
Movie.debug((Movie.realTime ? 'Real time' : 'Fixed time') + ', step = ' + Movie.timeScale);
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

Movie.Controls = {};

Movie.Controls.play = function(step) {
	Movie.clearNextFrame();
	if (notSet(Movie.dianomi)) {
		Movie.Controls.dianomi(1);
		return;
	}

	if (notSet(Movie.cursor)) {
		Movie.miraseFila();
		return;
	}

	if (notSet(step)) {
		step = 1;
		var auto = true;
	}
	else {
		auto = false;
	}

	Movie.cursor += step;
	if (Movie.cursor >= Movie.kinisi.length) {
		Movie.Controls.dianomi(1);
		return;
	}
	if (Movie.cursor < 0) {
		Movie.Controls.dianomi(-1);
		return;
	}

Movie.debug(Movie.kinisi[Movie.cursor].idos);
	if (Movie.cursor == Movie.kinisi.length - 1) {
		return;
	}

	if (Movie.realTime) {
		var pause = (Movie.kinisi[Movie.cursor + 1].pote -
			Movie.kinisi[Movie.cursor].pote) * Movie.timeScale;
	}
	else {
		pause = Movie.timeScale;
	}
Movie.debug(pause);

	if (notSet(auto)) { auto = true; }
	if (auto) {
		Movie.nextFrame = setTimeout(Movie.Controls.play, pause);
		Movie.playing(true);
	}
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
};

Movie.Controls.dianomi = function(step) {
	if (Movie.dianomes.length <= 0) {
		mainFyi('Δεν υπάρχουν διανομές!');
		return;
	}

	if (notSet(Movie.dianomi)) {
		if (step > 0) {
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

	if (step > 0) {
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

window.onload = function() {
	init();
	if (isSet(Movie.dianomiSpot)) {
		window.location.hash = '#dianomi' + Movie.dianomiSpot;
	}

	if (isSet(Movie.dianomi)) {
		Movie.miraseFila();
	}

	for (var i = 1; i <= 3; i++) {
		var x = getelid('pektis' + i);
		if (isSet(x)) {
			x.title = "Αλλαγή θέσης"
		}
	}
};
