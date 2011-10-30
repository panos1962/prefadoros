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

		var x = getelid('dataArea');
		if (notSet(x)) { return; }

		var h = (wh.h - 180) + 'px';
		x.style.height = h;
		x.style.maxHeight =h;
	};

	var protiFora = true;

	this.getData = function() {
		var pektis = getelid('pektis');
		if (notSet(pektis)) {
			mainFyi('pektis: misssing input field');
			return false;
		}

		var apo = getelid('apo');
		if (notSet(apo)) {
			mainFyi('apo: misssing input field');
			return false;
		}

		var eos = getelid('eos');
		if (notSet(eos)) {
			mainFyi('eos: misssing input field');
			return false;
		}

		var partida = getelid('partida');
		if (notSet(partida)) {
			mainFyi('partida: misssing input field');
			return false;
		}

		var ico = getelid('searchIcon');
		if (ico) { ico.style.visibility = 'visible'; }

		var req = new Request('astra/getData');
		req.xhr.onreadystatechange = function() {
			getDataCheck(req, ico);
		};

		var params = '';
		if (protiFora) {
			protiFora = false;
		}
		else {
			params +=  'pektis=' + uri(pektis.value.trim());
			params +=  '&apo=' + uri(apo.value.trim());
			params +=  '&eos=' + uri(eos.value.trim());
			params +=  '&partida=' + uri(partida.value.trim());
		}

		req.send(params);
		return false;
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

		if (notSet(dedomena) || notSet(dedomena.ok) ||
			notSet(dedomena.partida) || isSet(dedomena.error)) {
			if (isSet(dedomena) && isSet(dedomena.error)) { rsp = dedomena.error; }
			mainFyi('Λανθασμένα δεδομένα: ' + rsp);
			return;
		}

		var html = '';
		for (var i = 0; i < dedomena.partida.length; i++) {
			html += Astra.partidaHTML(dedomena.partida[i], i);
		}

		var x = getelid('dataArea');
		if (notSet(x)) { return; }
		x.innerHTML = html;
	};

	this.pektisHTML = function(pektis, kapikia) {
		var html = '<div class="astraPartidaPektis">';
		html += '<div class="astraOnoma">';
		html += (pektis != '' ? pektis : '&#8203;');
		html += '</div>';
		html += '<div class="astraKapikia';
		if (kapikia < 0) { html += ' astraMion'; }
		html += '">';
		html += (kapikia != 0 ? kapikia : '&#8203;');
		html += '</div>';
		html += '</div>';
		return html;
	};

	this.xronosHTML = function(xronos) {
		var html = '<div class="astraPartidaXronos">';
		html += xronos;
		html += '</div>';
		return html;
	};

	this.partidaHTML = function(partida, i) {
		var html = '';
		html += '<div class="astraPartida zebra' + (i % 2) +
			'" onclick="Astra.dianomiOnOff(' + partida.t + ');" ' +
			'title="Κλικ για εμφάνιση/απόκρυψη διανομών" ' +
			'onmouseover="Astra.epilogiPartidas(this);" ' +
			'onmouseout="Astra.apoepilogiPartidas(this);">';
		html += '<div class="astraPartidaKodikos">' + partida.t + '</div>'
		html += Astra.pektisHTML(partida.p1, partida.k1);
		html += Astra.pektisHTML(partida.p2, partida.k2);
		html += Astra.pektisHTML(partida.p3, partida.k3);
		html += Astra.xronosHTML(partida.x);
		html += '</div>';
		html += '<div id="t' + partida.t + '"></div>';
		return html;
	};

	this.epilogiPartidas = function(div) {
		div.OBC = div.style.backgroundColor;
		div.style.backgroundColor = '#FFFF33';
		div.style.fontWeight = 'bold';
	};

	this.apoepilogiPartidas = function(div) {
		div.style.backgroundColor = div.OBC;
		div.style.fontWeight = 'normal';
	};

	this.dianomiOnOff = function(trapezi) {
		var x = getelid('t' + trapezi);
		if (notSet(x)) { return; }

		if (x.innerHTML != '') {
			x.innerHTML = '';
			return;
		}

		var ico = getelid('searchIcon');
		if (ico) { ico.style.visibility = 'visible'; }

		var req = new Request('astra/getDianomi');
		req.xhr.onreadystatechange = function() {
			getDianomiCheck(req, ico, x);
		};

		var params = 'trapezi=' + uri(trapezi);
		req.send(params);
		return false;
	};

	function getDianomiCheck(req, ico, div) {
		if (req.xhr.readyState != 4) { return; }

		ico.style.visibility = 'hidden';
		rsp = req.getResponse();
		try {
			var dedomena = eval('(' + rsp + ')');
		} catch(e) {
			mainFyi(rsp);
		}

		if (notSet(dedomena) || notSet(dedomena.ok) ||
			notSet(dedomena.dianomi) || isSet(dedomena.error)) {
			if (isSet(dedomena) && isSet(dedomena.error)) { rsp = dedomena.error; }
			mainFyi('Λανθασμένα δεδομένα: ' + rsp);
			return;
		}

		var html = '';
		for (var i = 0; i < dedomena.dianomi.length; i++) {
			html += Astra.dianomiHTML(dedomena.dianomi[i], i);
		}

		div.innerHTML = html;
	};

	this.dianomiHTML = function(dianomi, i) {
		var html = '';
		html += '<div class="astraPartida astraDianomiZebra' + (i % 2) +
			'" onclick="Astra.kinisiOnOff(' + dianomi.d + ');" ' +
			'title="Κλικ για εμφάνιση/απόκρυψη κινήσεων" ' +
			'onmouseover="Astra.epilogiDianomis(this);" ' +
			'onmouseout="Astra.apoepilogiDianomis(this);">';
		html += '<div>' + dianomi.d + '</div>'
		html += '</div>';
		html += '<div id="d' + dianomi.d + '"></div>';
		return html;
	};

	this.epilogiDianomis = function(div) {
		div.OBC = div.style.backgroundColor;
		div.style.backgroundColor = '#FF3385';
		div.style.fontWeight = 'bold';
	};

	this.apoepilogiDianomis = function(div) {
		div.style.backgroundColor = div.OBC;
		div.style.fontWeight = 'normal';
	};

	this.kinisiOnOff = function(dianomi) {
		alert(dianomi);
	};
};

window.onload = function() {
	init();
	Astra.setHeight();
	Astra.getData();
};
