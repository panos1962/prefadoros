var funchat = {};

window.onload = function() {
	init();
};

window.onbeforeunload = function() {
	var w = window.opener;
	if (notSet(w) || notSet(w.document)) {
		return;
	}

	if (isSet(w.controlPanel)) {
		w.controlPanel.funchatClose();
	}
};
