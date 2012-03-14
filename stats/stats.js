var Stats = {};
Stats.pedi = '';
Stats.reload = function(fld) {
	window.location = globals.server + 'stats/index.php?pektis=' +
		uri(fld.value) + Stats.pedi + '#pkspot';
};

window.onload = function() {
	init();
	var x = getelid('pektis');
	x.select();
};
