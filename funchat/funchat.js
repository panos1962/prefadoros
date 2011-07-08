funchat = {};

funchat.whltSaveTimer = null;

funchat.whltSave = function() {
	if (notSet(funchat.whltSaveUnblocked)) {
		return;
	}

	var x = window.opener;
	if (notSet(x)) {
		return;
	}

	if (isSet(window.screenLeft)) {
		var l = window.screenLeft;
	}
	else if (isSet(window.screenX)) {
		l = window.screenX;
	}
	else {
		return;
	}

	if (isSet(window.screenTop)) {
		var t = window.screenTop;
	}
	else if (isSet(window.screenY)) {
		t = window.screenY;
	}
	else {
		return;
	}

	if (isSet(window.outerWidth)) {
		var w = window.outerWidth;
	}
	else if (isSet(document) && isSet(document.body) && isSet(document.body.clientWidth)) {
		w = document.body.clientWidth;
	}
	else {
		return;
	}

	if (isSet(window.outerHeight)) {
		var h = window.outerHeight;
	}
	else if (isSet(screen) && isSet(screen.availHeight)) {
		h = screen.availHeight;
	}
	else {
		return;
	}

	if (isSet(funchat.whltSaveTimer)) {
		clearTimeout(funchat.whltSaveTimer);
	}

	funchat.whltSaveTimer = setTimeout(function() {
		x.globals.funchatWhlt = w + ':' + h + ':' + l + ':' + t;
		var req = new Request('funchat/whltSave', false);
		req.send('whlt=' + x.globals.funchatWhlt);
		var rsp = req.getResponse();
		if (rsp) {
			x.mainFyi('funchat/whltSave.php: ' + rsp);
		}
		else {
			x.mainFyi('saved funchat panel position &amp; size', 500);
		}
	}, 5000);
}

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
