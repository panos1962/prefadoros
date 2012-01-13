if (notSet(window.Movie)) { var Movie = {}; }null;
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
	if (isSet(d)) {
		if (d > 0) { href += '&dianomi=' + uri(d); }
		else { href += '&enarxi=yes'; }
	}
	window.location.href = href;
};

Movie.pexeDianomi = function() {
	if (notSet(Movie.dianomi)) { return; }
	mainFyi(Movie.dianomi);
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
