window.onload = function() {
	init();
	pss.onload();
}

function neaDedomena() {
	var req = new Request('lib/neaDedomena');
	req.xhr.onreadystatechange = function() {
		neaDedomenaCheck(req);
	};

	req.send();
}

function neaDedomenaCheck(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	rsp = req.setResponse();
	if (rsp) {
		alert(rsp);
	}
	getelid('info').innerHTML += '<br />@' + parseInt((new Date).getTime() / 1000) + '@';
	setTimeout(neaDedomena, 100);
}
