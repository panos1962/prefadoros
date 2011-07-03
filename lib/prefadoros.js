var pss = {
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
	pss.prosklisi.afxisi = function(ico) {
		if (pss.prosklisi.size < 3) {
			pss.prosklisi.size++;
			if (pss.sxesi.size > pss.sizitisi.size) {
				pss.sxesi.size--;
			}
			else if (pss.sizitisi.size > pss.sxesi.size) {
				pss.sizitisi.size--;
			}
			else if (pss.sxesi.size > 0) {
				pss.sxesi.size--;
			}
			else if (pss.sizitisi.size > 0) {
				pss.sizitisi.size--;
			}
		}
		else {
			playSound('beep');
			errorIcon(ico);
		}
		pss.resize();
	};
	pss.prosklisi.miosi = function(ico) {
		if (pss.prosklisi.size > 0) {
			pss.prosklisi.size--;
			if (pss.sxesi.size < pss.sizitisi.size) {
				pss.sxesi.size++;
			}
			else if (pss.sizitisi.size < pss.sxesi.size) {
				pss.sizitisi.size++;
			}
			else if (pss.sxesi.size < 3) {
				pss.sxesi.size++;
			}
			else if (pss.sizitisi.size < 3) {
				pss.sizitisi.size++;
			}
		}
		else {
			playSound('beep');
			errorIcon(ico);
		}
		pss.resize();
	};
	pss.resize = function() {
		if (pss.prosklisi.size > pss.prosklisi.curSize) {
			if (pss.sxesi.size) {
				pss.sxesi.size--;
			}
		}
	};
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
