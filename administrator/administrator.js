function exitAdministrator() {
	var req = new Request('administrator/exitAdministrator', false);
	req.send();
	var rsp = req.getResponse();
	if (rsp) {
		mainFyi(rsp);
	}
	else {
		var w = window.opener;
		if (isSet(w) && isSet(w.document)) {
			var x = w.getelid('administratorLabel');
			if (isSet(x)) {
				x.setAttribute('class', 'data');
				w.globals.administrator = false;
			}
		}
		window.close();
	}
	return false;
}
