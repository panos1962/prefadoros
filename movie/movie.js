if (notSet(window.Movie)) { var Movie = {}; }
var pexnidi = {};

function isPektis() {
	return(isSet(window.pektis) && isSet(pektis.login));
}

Movie.selectDianomi = function(d) {
	if (notSet(Movie.trapezi)) { return; }
	if (isSet(Movie.dianomi) && (Movie.dianomi == d)) {
		Movie.pexeDianomi();
		return;
	}

	var href = globals.server + 'movie/index.php?trapezi=' + uri(Movie.trapezi);
	if (isSet(d)) { href += '&dianomi=' + uri(d); }
	window.location.href = href;
};

Movie.pexeDianomi = function() {
	if (notSet(Movie.dianomi)) { return; }
	mainFyi(Movie.dianomi);
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

window.onload = function() {
	init();
	if (isSet(Movie.dianomiSpot)) {
		window.location.hash = '#dianomi' + Movie.dianomiSpot;
	}

	if (isSet(Movie.dianomi)) {
		Movie.miraseFila();
	}
};
