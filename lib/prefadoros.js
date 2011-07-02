var PSS = {
	prosklisi:	{
		size:		1,
		curSize:	1
		
	},
	sxesi:	{
		size:		1,
		curSize:	1
	},
	sizitisi:	{
		size:		1,
		curSize:	1
	}
};

window.onload = function() {
	init();
	PSS.prosklisi.afxisi = function() {
		if (PSS.prosklisi.size < 3) {
			PSS.prosklisi.size++;
		}
		alert(PSS.prosklisi.size);
	}
	PSS.prosklisi.miosi = function() {
		if (PSS.prosklisi.size > 0) {
			PSS.prosklisi.size--;
		}
		alert(PSS.prosklisi.size);
	}
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
