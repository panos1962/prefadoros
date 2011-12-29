var Stats = {};
Stats.reload = function(fld) {
	window.location = globals.server + 'stats/index.php?pektis=' +
		uri(fld.value) + '#pkspot';
};

window.onload = function() {
	init();
	var x = getelid('pektis');
	x.select();
};
