var funchat = {};

funchat.resize = function() {
	var x = window.opener;
	if (notSet(x) || notSet(x.globals)) {
		return;
	}

	x.globals.funchatWhlt = window.innerWidth + ':' + window.innerHeight + ':' +
		window.screenLeft + ':' + window.screenTop;

	if (isSet(funchat.whltSaver)) {
		clearTimeout(funchat.whltSaver);
	}
	funchat.whltSaver = setTimeout(function() {
		if (isSet(x.globals.funchatWhlt)) {
			var req = new Request('funchat/whltSave');
			req.send('whlt=' + x.globals.funchatWhlt);
		}
	}, 1000);
};

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
