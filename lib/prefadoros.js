prefadoros = {
	trapezi:	{},	// το τραπέζι στο οποίο συμμετέχει ο παίκτης
	dianomi:	[],	// οι διανομές του τραπεζιού
	kinisi:		[],	// οι κινήσεις της διανομής
	sizitisi:	[],	// τα σχόλια του τραπεζιού
	kafenio:	[],	// τα ενεργά τραπέζια
	forum:		[]	// η δημόσια συζήτηση
};

window.onload = function() {
	init();
	controlPanel.onload();
	pss.onload();
	emoticons.onload();
prefadoros.trapezi.kodikos = 1;
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
