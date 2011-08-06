var Sizitisi = new function() {
	var sizitisi = null;
	var telos = null;
	var zebraColor = [
		'556B2F',	// That's for me!
		'8A0808',
		'006600',
		'084B8A',
		'CD5C5C',
		'663300',
		'FF3300',
		'666699',
		'B45F04',
		'B4045F'
	];
	var zebraLast = 1;
	var pektisColor = [];

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.sizitisi) && notSet(dedomena.sizitisiNew) &&
			notSet(dedomena.sizitisiMod) && notSet(dedomena.sizitisiDel)) {
			return;
		}

		sizitisi = getelid('sizitisiTrapezi');
		if (notSet(sizitisi)) {
			mainFyi('sizitisiTrapezi: node not found');
			return;
		}
		if (isSet(dedomena.sizitisi)) {
			sizitisi.innerHTML = '<div id="st_end"></div>';
		}
		telos = getelid('st_end');
		if (notSet(telos)) {
			mainFyi('st_end: node not found');
			return;
		}

		if (isSet(dedomena.sizitisi)) {
			for (var i = 0; i < dedomena.sizitisi.length; i++) {
				Sizitisi.sxolioAdd(dedomena.sizitisi[i]);
			}
			Sizitisi.scrollBottom();
			return;
		}

		if (isSet(dedomena.sizitisiDel)) {
			for (var i = 0; i < dedomena.sizitisiDel.length; i++) {
				Sizitisi.sxolioDel(dedomena.sizitisiDel[i]);
			}
		}

		if (isSet(dedomena.sizitisiMod)) {
			for (var i = 0; i < dedomena.sizitisiMod.length; i++) {
				Sizitisi.sxolioMod(dedomena.sizitisiMod[i]);
			}
		}

		if (isSet(dedomena.sizitisiNew)) {
			for (var i = 0; i < dedomena.sizitisiNew.length; i++) {
				Sizitisi.sxolioAdd(dedomena.sizitisiNew[i]);
			}
			Sizitisi.scrollBottom();
		}
	};

	this.sxolioAdd = function(s) {
		var p = document.createElement('div');
		if (notSet(p)) {
			mainFyi('cannot create "sizitisiSxolio" element');
			return;
		}

		p.setAttribute('class', 'sizitisiSxolio');
		p.setAttribute('id', 'st_' + s.k);
		p.innerHTML = Sizitisi.HTML(s);
		sizitisi.insertBefore(p, telos);
	};

	this.sxolioDel = function(s) {
		var id = 'st' + s;
		var p = getelid(id);
		if (notSet(p)) {
			mainFyi('sxolioDel: ' + id + ': node not found');
			return;
		}
		sviseNode(p);
	};

	this.sxolioMod = function(s) {
		var id = 'st_' + s.k;
		var p = getelid(id);
		if (notSet(p)) {
			mainFyi('sxolioMod: ' + id + ': node not found');
			return;
		}
		p.innerHTML = Sizitisi.HTML(s);
	};

	this.HTML = function(s) {
		var html = '';
		if (isPektis() && (s.p == pektis.login)) {
			var color = zebraColor[0];
		}
		else if (s.p in pektisColor) {
			color = pektisColor[s.p];
		}
		else {
			color = (pektisColor[s.p] = zebraColor[zebraLast]);
			zebraLast++;
			if (zebraLast >= zebraColor.length) { zebraLast = 1; }
		}
		html += '<div class="sizitisiPektis" style="color: #' +
			color + ';">' + s.p + '</div>';
		switch (s.s) {
		case '@WT@':
			s.s = '<img class="moliviPartida" src="' + globals.server +
				'images/moliviPartida.gif" alt="" />';
			break;
		case '@WK@':
			s.s = '<img class="moliviKafenio" src="' + globals.server +
				'images/moliviKafenio.gif" alt="" />';
			break;
		}
		html += s.s;
		return html;
	};

	this.scrollBottom = function() {
		var x = getelid('sizitisiArea');
		if (notSet(x)) { return; }
		setTimeout(function() {
			x.scrollTop = x.scrollHeight;
		}, 100);
	};

	this.keyCheck = function(e, fld) {
		var preview = getelid('sxolioPreview');
		if (notSet(preview)) {
			alert('sxolioPreview: node not found');
			return;
		}

		if (window.event) { var key = e.keyCode; }
		else if (e.which) { key = e.which; }
		else { key = false; }

		if (key) {
			if (fld.value == '') {
				fld.style.backgroundImage = globals.server +
					'images/sxesiPrompt.png';
			}
			else {
				fld.style.backgroundImage = '';
			}

			switch(key) {
			case 13:	// Enter key
				Sizitisi.apostoli(fld);
				break;
			case 27:	// Esc key
				fld.value = '';
				break;
			}
		}

		Sizitisi.checkWriting(fld);
		if (fld.value != '') {
			fld.style.backgroundImage = 'none';
			preview.innerHTML = '<hr />';
			preview.innerHTML += '<div class="sizitisiSxolio">' + fld.value + '</div>';
			Sizitisi.scrollBottom();
		}
		else {
			Sizitisi.resetSxolioInput(fld, preview);
		}
	};

	var moliviTimer = null;
	var writing = '';

	this.checkWriting = function(fld) {
		if ((fld.value != '') && (Prefadoros.show == 'partida') &&
			(writing == 'partida')) { return; }
		if ((fld.value != '') && (Prefadoros.show == 'kafenio') &&
			(writing == 'kafenio')) { return; }
		if ((fld.value == '') && (writing == '')) { return; }

		if (isSet(moliviTimer)) { clearTimeout(moliviTimer); }
		moliviTimer = setTimeout(function() {
			if (fld.value == '') { Sizitisi.setWriting(); }
			else { Sizitisi.setWriting(Prefadoros.show); }
		}, 1000);
	};

	this.setWriting = function(tk) {
		if (notSet(tk)) { tk = ''; }
		var req = new Request('sizitisi/writing');
		req.xhr.onreadystatechange = function() {
			Sizitisi.setWritingCheck(req, tk);
		};
		var params = 'tk=' + uri(tk);
		req.send(params);
	};

	this.setWritingCheck = function(req, tk) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
		}
		else {
			writing = tk;
		}
	};

	this.resetSxolioInput = function(fld, preview) {
		if (notSet(preview)) {
			preview = getelid('sxolioPreview');
			if (notSet(preview)) { return; }
		}
		if (notSet(fld)) {
			fld = getelid('sxolioInput');
			if (notSet(fld)) { return; }
		}
		fld.value = '';
		fld.style.backgroundImage = "url('" + globals.server +
			"images/sizitisiPrompt.png')";
		preview.innerHTML = '';
		fld.focus();
	};

	this.apostoli = function(fld, ico) {
		if (notSet(fld)) {
			var fld = getelid('sxolioInput');
			if (notSet(fld)) { return; }
		}
		var sxolio = fld.value;

		sxolio = sxolio.trim();
		if (sxolio == '') { return; }

		if (notSet(ico)) { ico = getelid('sxolioApostoli'); }
		if (notSet(ico)) { return; }
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('sizitisi/apostoli');
		req.xhr.onreadystatechange = function() {
			Sizitisi.apostoliCheck(req, fld, ico);
		};

		var params = 'tk=' + uri(Prefadoros.show);
		params += '&sxolio=' + uri(sxolio);
		req.send(params);
	};

	this.apostoliCheck = function(req, fld, ico) {
		if (req.xhr.readyState != 4) { return; }
		ico.src = globals.server + 'images/controlPanel/talk.png';
		var rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
			errorIcon(ico);
			playSound('beep');
		}
		else {
			Sizitisi.resetSxolioInput(fld);
			writing = '';
		}
	};

	var diagrafiCount = 0;
	var diagrafiCountReset = null;

	this.diagrafi = function(ico) {
		Sizitisi.sxolioFocus();
		if (notSet(ico)) { ico = getelid('sxolioDiagrafi'); }
		if (notSet(ico)) { return; }
		if (Prefadoros.show != 'partida') {
			playSound('beep');
			errorIcon(ico);
			mainFyi('Δεν μπορείτε να παρέμβετε στη δημόσια συζήτηση');
			return;
		}
		var params = 'dummy=1';
		if (isSet(diagrafiCountReset)) { clearTimeout(diagrafiCountReset); }
		
		diagrafiCount++;
		if (diagrafiCount > 3) {
			diagrafiCount = 0;
			if (confirm('Θέλετε να διαγράψετε όλη τη συζήτηση;')) {
				params += '&delall=yes';
			}
		}
		else {
			diagrafiCountReset = setTimeout(function() {
				diagrafiCount = 0;
			}, 1000);
		}

		if (notSet(ico)) { ico = getelid('sxolioDiagrafi'); }
		if (notSet(ico)) { return; }
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('sizitisi/diagrafi');
		req.xhr.onreadystatechange = function() {
			Sizitisi.diagrafiCheck(req, ico);
		};

		req.send(params);
	};

	this.diagrafiCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		ico.src = globals.server + 'images/Xred.png';
		var rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
			errorIcon(ico);
			playSound('beep');
		}
		else {
			Sizitisi.resetSxolioInput();
		}
	};
	

	this.sxolioFocus = function() {
		var x = getelid('sxolioInput');
		if (isSet(x)) { x.focus(); }
	};
};

var Kafenio = new function() {
	var sizitisi = null;
	var telos = null;

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.kafenio) && notSet(dedomena.kafenioNew) &&
			notSet(dedomena.kafenioMod) && notSet(dedomena.kafenioDel)) {
			return;
		}

		sizitisi = getelid('sizitisiKafenio');
		if (notSet(sizitisi)) {
			mainFyi('sizitisiKafenio: node not found');
			return;
		}
		if (isSet(dedomena.kafenio)) {
			sizitisi.innerHTML = '<div id="sk_end"></div>';
			Dedomena.kafenioApo = dedomena.kafenio.length > 0 ?
				dedomena.kafenio[0].k : 1;
		}
		telos = getelid('sk_end');
		if (notSet(telos)) {
			mainFyi('sk_end: node not found');
			return;
		}

		if (isSet(dedomena.kafenio)) {
			for (var i = 0; i < dedomena.kafenio.length; i++) {
				Kafenio.sxolioAdd(dedomena.kafenio[i]);
			}
			Sizitisi.scrollBottom();
			return;
		}

		if (isSet(dedomena.kafenioDel)) {
			for (var i = 0; i < dedomena.kafenioDel.length; i++) {
				Kafenio.sxolioDel(dedomena.kafenioDel[i]);
			}
		}

		if (isSet(dedomena.kafenioMod)) {
			for (var i = 0; i < dedomena.kafenioMod.length; i++) {
				Kafenio.sxolioMod(dedomena.kafenioMod[i]);
			}
		}

		if (isSet(dedomena.kafenioNew)) {
			for (var i = 0; i < dedomena.kafenioNew.length; i++) {
				Kafenio.sxolioAdd(dedomena.kafenioNew[i]);
			}
			Sizitisi.scrollBottom();
		}
	};

	this.sxolioAdd = function(s) {
		var p = document.createElement('div');
		if (notSet(p)) {
			mainFyi('cannot create "sizitisiSxolio" element');
			return;
		}

		p.setAttribute('class', 'sizitisiSxolio');
		p.setAttribute('id', 'sk_' + s.k);
		p.innerHTML = Sizitisi.HTML(s);
		sizitisi.insertBefore(p, telos);
	};

	this.sxolioDel = function(s) {
		var id = 'sk' + s;
		var p = getelid(id);
		if (notSet(p)) {
			mainFyi('sxolioDel: ' + id + ': node not found');
			return;
		}
		sviseNode(p);
	};

	this.sxolioMod = function(s) {
		var id = 'sk_' + s.k;
		var p = getelid(id);
		if (notSet(p)) {
			mainFyi('sxolioMod: ' + id + ': node not found');
			return;
		}
		p.innerHTML = Sizitisi.HTML(s);
	};
};
