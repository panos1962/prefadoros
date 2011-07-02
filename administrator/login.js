window.onload = function() {
	init();
	getelid('password').focus();
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

	return true;
}
