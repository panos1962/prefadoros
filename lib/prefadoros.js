var trapezi = null;	// το τραπέζι στο οποίο συμμετέχει ο παίκτης
var dianomi = null;	// οι διανομές του τραπεζιού
var kinisi = null;	// οι κινήσεις της διανομής
var sizitisi = null;	// τα σχόλια του τραπεζιού
var kafenio = null;	// τα ενεργά τραπέζια
var forum = null;	// η δημόσια συζήτηση

window.onload = function() {
	init();
	controlPanel.onload();
	pss.onload();
	emoticons.onload();
trapezi = {};
trapezi.kodikos = 1;
}

window.onbeforeunload = function() {
	if (isSet(controlPanel)) {
		controlPanel.funchatClose();
	}
};

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
