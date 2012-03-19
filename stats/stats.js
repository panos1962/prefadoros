var Stats = {};
Stats.pedi = '';

Stats.reload = function(fld) {
	window.location = globals.server + 'stats/index.php?pektis=' +
		uri(fld.value) + Stats.pedi + '#pkspot';
};

Stats.setSort = function(scol) {
	var sok = { dianomi:null, bathmos:null };
	if (notSet(scol)) { scol = ''; }
	else {
		if (!sok.hasOwnProperty(scol)) { return; }
		scol = '&sort=' + scol;
	}

	window.location = globals.server + 'stats/index.php?dummy=yes' +
		Stats.pedi + scol;
};

window.onload = function() {
	init();
	var x = getelid('pektis');
	x.select();
};
