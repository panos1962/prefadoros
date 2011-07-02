function exitAdministrator() {
	var req = new Request('administrator/exitAdministrator', false);
	req.send();
	var rsp = req.getResponse();
	if (rsp) {
		mainFyi(rsp);
	}
	else {
		window.close();
	}
	return false;
}
