var Stats = {};
Stats.pedi = false;
Stats.onoma = null;
Stats.sort = null;

Stats.setOnoma = function(fld, spot) {
	var onoma = fld.value;
	Stats.onoma = isSet(onoma) ? onoma : null;
	Stats.reload(spot);
};

Stats.setSort = function(scol) {
	Stats.sort = isSet(scol) ? scol : null;
	Stats.reload();
};

Stats.reload = function(spot) {
	var loc = globals.server + 'stats/index.php?dummy=yes';
	if (Stats.pedi) { loc += '&pedi=yes'; }
	if (Stats.sort) { loc += '&sort=' + uri(Stats.sort); }
	if (Stats.onoma) { loc += '&pektis=' + uri(Stats.onoma); }
	if (isSet(spot)) { loc += '#pkspot'; }
	window.location = loc;
};

window.onload = function() {
	init();
	var x = getelid('pektis');
	x.select();
};
