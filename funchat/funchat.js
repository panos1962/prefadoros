var funchat = {};

window.onload = function() {
	init();

	funchat.checkAlive = function() {
		var x = window.opener;
		if (notSet(x) || notSet(x.document)) {
			window.close();
			return;
		}
		x = x.document.getElementById('prefadoros');
		if (notSet(x)) {
			window.close();
			return;
		}

		setTimeout(funchat.checkAlive, 1500);
	};
	funchat.checkAlive();
};

window.onbeforeunload = function() {
	var w = window.opener;
	if (notSet(w) || notSet(w.document)) {
		return;
	}

	var ico = w.document.getElementById('funchatIcon');
	if (notSet(ico)) {
		return;
	}

	w.controlPanel.funchatResetIcon(ico);
};
