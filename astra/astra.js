var Astra = new function() {
	this.setHeight = function() {
		var wh = diathesimosXoros();
		if ((typeof(wh.h) != 'number') || (wh.h < 600)) { return; }

		var x = getelid('astraArea');
		if (notSet(x)) { return; }

		var h = (wh.h - 130) + 'px';
		x.style.height = h;
		x.style.minHeight = h;
		x.style.maxHeight =h;
	};

	this.getData = function() {
		var partida = getelid('partida');
		if (notSet(partida)) { return mainFyi('partida: misssing input field'); }

		var ico = getelid('searchIcon');
		if (ico) { ico.style.visibility = 'visible'; }

		var req = new Request('astra/getData');
		req.xhr.onreadystatechange = function() {
			getDataCheck(req, ico);
		};

		var params = '';
		params +=  'partida=' + uri(partida.value.trim());
		req.send(params);
	};

	function getDataCheck(req, ico) {
		if (req.xhr.readyState != 4) { return; }

		ico.style.visibility = 'hidden';
		rsp = req.getResponse();
		try {
			var dedomena = eval('(' + rsp + ')');
		} catch(e) {
			mainFyi(rsp);
		}

		if (notSet(dedomena) || notSet(dedomena.ok)) {
			mainFyi('Λανθασμένα δεδομένα' + rsp);
		}
	};
};

window.onload = function() {
	init();
	Astra.setHeight();
	Astra.getData();
};
