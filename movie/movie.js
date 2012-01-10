Movie = {};

Movie.resize = function() {
	var x = getelid('main');
	if (notSet(x)) { return; }

	var w = x.offsetWidth - x.offsetLeft;
	var h = x.offsetHeight - x.offsetTop;
alert(x.offsetWidth);

	window.resizeTo(w, h);
};

window.onload = function() {
	init();
	Movie.resize();
};
