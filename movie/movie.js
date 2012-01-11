if (notSet(window.Movie)) { Movie = {}; }

Movie.selectDianomi = function(d) {
	if (notSet(Movie) || notSet(Movie.trapezi)) { return; }
	var href = globals.server + 'movie/index.php?trapezi=' + uri(Movie.trapezi);
	if (isSet(d)) { href += '&dianomi=' + uri(d); }
	window.location.href = href;
}

window.onload = function() {
	init();
	if (isSet(Movie.dianomiSpot)) {
		window.location.hash = '#dianomi' + Movie.dianomiSpot;
	}
};
