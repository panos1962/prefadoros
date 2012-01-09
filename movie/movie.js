Movie = {};

Movie.resize = function() {
	var x = getelid('trapezi');
	if (notSet(x)) { return; }
	var w = parseInt(x.offsetWidth * 1.1);
	var h = parseInt(x.offsetHeight * 1.2);

	window.resizeTo(w, h);
};

window.onload = function() {
	init();
	Movie.resize();
};
