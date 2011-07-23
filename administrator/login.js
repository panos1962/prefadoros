window.onload = function() {
	init();
	getelid('password').focus();
	// Ο κώδικας που ακολουθεί αφορά σε bug του Safari.
	// Πράγματι, επειδή το πεδίο του login είναι disabled
	// ο Safari δεν προτείνει την τιμή που έχω καθορίσει
	// στο value, αλλά κάποια άλλη τιμή από τις αποθηκευμένες.
	setTimeout(function() {
		getelid('login').value = 'Administrator';
	}, 1000);
}

function loginCheck(form) {
	var req = new Request('administrator/loginCheck', false);
	params = 'password=' + uri(form.password.value);
	req.send(params);
	var rsp = req.getResponse();
	if (rsp) {
		formaFyi(rsp);
		return false;
	}

	var w = window.opener;
	if (isSet(w) && isSet(w.document)) {
		var x = w.getelid('administratorLabel');
		if (isSet(x)) {
			x.setAttribute('class', 'data administrator');
			w.globals.administrator = true;
		}
	}
	return true;
}
