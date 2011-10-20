var Sizitisi = new function() {
	var sizitisi = null;
	var telos = null;
	this.zebraColor = [
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

	var telefteaEpafi = currentTimestamp();

	this.sxolioAdd = function(s) {
		var p = document.createElement('div');
		if (notSet(p)) {
			mainFyi('cannot create "sizitisiSxolio" element');
			return;
		}

		p.setAttribute('class', 'sizitisiSxolio');
		p.setAttribute('id', 'st_' + s.k);
		p.onmouseover = function() {
			var x = getelid('sxp_' + s.k);
			if (notSet(x)) { return; }
			if (notSet(x.style)) { return; }
			x.style.maxWidth = 'none';
			x.style.visibility = 'visible';
		};
		p.onmouseout = function() {
			var x = getelid('sxp_' + s.k);
			if (notSet(x)) { return; }
			if (notSet(x.style)) { return; }
			x.style.maxWidth = '0';
			x.style.visibility = 'hidden';
		};

		p.innerHTML = Sizitisi.HTML(s);
		sizitisi.insertBefore(p, telos);

		var tora = currentTimestamp();
		var notice = (s.s).match('^@[WK][PKN]@$');
		if ((s.p != pektis.login) &&
			(!notice) && ((tora - telefteaEpafi) > 60000)) {
			playSound('hiThere');
		}
		if (!notice) { telefteaEpafi = tora; }
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
		var sxolio = Sizitisi.decode(s);
		var html = '';
		if (isPektis() && (s.p == pektis.login)) {
			var color = Sizitisi.zebraColor[0];
		}
		else if (s.p in pektisColor) {
			color = pektisColor[s.p];
		}
		else {
			color = (pektisColor[s.p] = Sizitisi.zebraColor[zebraLast]);
			zebraLast++;
			if (zebraLast >= Sizitisi.zebraColor.length) { zebraLast = 1; }
		}
		html += '<div class="sizitisiPektis" style="color: #' +
			color + ';">' + s.p + '</div>';
		html += sxolio;
		html += Sizitisi.oraSxoliou(s.k, s.w);
		return html;
	};

	var epexeIxos = [];

	this.decode = function(s) {
		if (s.s == "@WP@") {
			return '<img class="moliviPartida" src="' + globals.server +
				'images/moliviPartida.gif" alt="" />';
		}
		if (s.s == "@WK@") {
			return '<img class="moliviKafenio" src="' + globals.server +
				'images/moliviKafenio.gif" alt="" />';
		}
		if (s.s == "@KN@") {
			if (isSet(s.w)) {
				var t = s.w * 1000;
				var k = 'k' + s.k;
				if ((!epexeIxos.hasOwnProperty(k)) &&
					((currentTimestamp() - t) < 3000)) {
					controlPanel.korna();
					epexeIxos[k] = true;
				}
			}
			return '<img style="width: 0.8cm;" src="' + globals.server +
				'images/controlPanel/korna.png" alt="" />';
		}

		if ((s.s).match(/^@FC@/)) {
			return Sizitisi.funchatDecode(s);
		}

		return Sizitisi.textDecode(s.s);
	};

	this.funchatDecode = function(s) {
		var x = (s.s).split('@');
		if (x.length < 6) { return Sizitisi.textDecode(s.s); }

		var html = '';
		html += '<img src="' + globals.funchatServer + x[2] +
			'" class="sizitisiFunchatImage" alt="" ';
		if (x[3]) { html += 'style="width: ' + x[3] + 'cm;" '; }
		html += '/>';
		var titlos = x[5];
		for (var i = 6; i < x.length; i++) { titlos += x[i]; }
		if (titlos != '') { html += '<div>' + titlos + '</div>'; }

		var k = 'k' + s.k;
		if (x[4] && (!epexeIxos.hasOwnProperty(k)) && isSet(s.w) &&
			((currentTimestamp() - (s.w * 1000)) < 5000)) {
			playSound(x[4]);
			epexeIxos[k] = true;
		}

		return html;
	};

	this.textDecode = function(s) {
		var fs = '^';
		var tmima = s.split(fs);
		if (tmima.length < 2) { return s; }

		s = '';
		var fsok = true;
		for (var i = 0; i < tmima.length; i++) {
			if (tmima[i].match(/^E:[0-9]+:[0-9]+$/)) {
				var x = tmima[i].split(':');
				var eset = eval('Emoticons.set' + x[1]);
				if (notSet(eset) || (x[2] >= eset.length)) {
					s += fs + tmima[i];
					continue;
				}
				s += '<img class="sizitisiEmoticon" alt="" src="' + globals.server +
					'images/emoticons/set' + x[1] + '/' + eset[x[2]] + '" />';
				fsok = false;
				continue;
			}

			if ((i > 0) && fsok) { s += fs; }
			s += tmima[i];
			fsok = true;
		}

		return s;
	};

	this.oraSxoliou = function(k, t) {
		if (t == 0) { return ''; }

		var tora = new Date();
		var pote = new Date(t * 1000);

		var html = '<div id="sxp_' + k + '" class="sizitisiOra">';
		if (pote.getDate() != tora.getDate()) {
			html += pote.getDate() + '/' + (pote.getMonth() + 1) + ', ';
		}

		var lepta = pote.getMinutes();
		if (lepta < 10) {
			lepta = '0' + lepta;
		}
		html += pote.getHours() + ':' + lepta;
		html += '</div>';
		return html;
	};

	this.scrollBottomDisabled = false;

	this.scrollBottomOnOff = function() {
		this.scrollBottomDisabled = !this.scrollBottomDisabled;
		var x = getelid('sizitisiArea');
		if (this.scrollBottomDisabled) {
			var bi = [
				'brick023.jpg',
				'brick045.gif',
				'brick051.jpg',
				'brick054.jpg',
				'brick056.jpg',
				'brick069.jpg',
				'brick070.jpg',
				'brick075.gif'
			];
			if (isSet(x)) {
				x.title = 'Κλικ για αυτόματο ρολάρισμα του κειμένου';
				x.style.backgroundImage = 'url(' + globals.server +
					'images/anagnosi/' +
					bi[Math.floor(Math.random() * bi.length)] + ')';
				mainFyi(x.style.backgroundImage);
			}
		}
		else {
			if (isSet(x)) {
				x.title = 'Κλικ για απρόσκοπτη ανάγνωση του κειμένου';
				x.style.backgroundImage = '';
			}
			Sizitisi.scrollBottom();
			Sizitisi.sxolioFocus();
		}
	};

	var scrollBottomTimer = null;

	this.scrollBottom = function() {
		if (this.scrollBottomDisabled) { return; }
		if (isSet(scrollBottomTimer)) { return; }
		var x = getelid('sizitisiArea');
		if (notSet(x)) { return; }
		scrollBottomTimer = setTimeout(function() {
			try { x.scrollTop = x.scrollHeight; } catch(e) {};
			scrollBottomTimer = null;
		}, 300);
	};

	this.keyCheck = function(e, fld) {
		if (window.event) { var key = e.keyCode; }
		else if (e.which) { key = e.which; }
		else { key = false; }

		if (Prefadoros.show == 'partida') {
			telefteaEpafi = currentTimestamp();
		}

		if (key) {
			if (fld.value == '') {
				fld.style.backgroundImage = "url('" + globals.server +
					"images/sxesiPrompt.png')";
			}
			else {
				fld.style.backgroundImage = '';
			}

			switch(key) {
			case 13:	// Enter key
				Sizitisi.apostoli(fld);
				return;
			case 27:	// Esc key
				fld.value = '';
				break;
			}
		}

		Sizitisi.parousiasi(fld);
	};

	this.parousiasi = function(fld) {
		var preview = getelid('sxolioPreview');
		Sizitisi.checkWriting(fld);
		if (fld.value != '') {
			fld.style.backgroundImage = 'none';
			if (isSet(preview)) {
				var html = '';
				html += '<div class="sizitisiPreviewLine"></div>';
				html += '<div class="sizitisiSxolio sizitisiPreview">';
				html += '<div class="sizitisiPektis" style="color: #' +
					Sizitisi.zebraColor[0] + ';">' + pektis.login + '</div>';
				html += Sizitisi.textDecode(fld.value);
				html += '</div>';
				preview.innerHTML = html;
				Sizitisi.scrollBottom();
			}
		}
		else {
			Sizitisi.resetSxolioInput(fld, preview);
		}
	};

	var writing = '';
	var neoWriting = '';

	this.checkWriting = function(fld) {
		var neoWriting = '';
		if ((fld.value != '') && (Prefadoros.show == 'partida') &&
			isPartida()) { neoWriting = 'P'; }
		if ((fld.value != '') && (Prefadoros.show == 'kafenio')) { neoWriting = 'K'; }
		if (neoWriting == writing) { return; }
		writing = neoWriting;

		var req = new Request('sizitisi/writing');
		req.xhr.onreadystatechange = function() {
			Sizitisi.setWritingCheck(req);
		};
		var params = 'pk=' + writing;
		req.send(params);
	};

	this.setWritingCheck = function(req) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
		}
	};

	this.resetSxolioInput = function(fld, preview) {
		if (notSet(preview)) {
			preview = getelid('sxolioPreview');
		}
		if (notSet(fld)) {
			fld = getelid('sxolioInput');
			if (notSet(fld)) { return; }
		}
		fld.value = '';
		fld.style.backgroundImage = "url('" + globals.server +
			"images/sizitisiPrompt.png')";
		if (isSet(preview)) { preview.innerHTML = ''; }
		fld.focus();
	};

	this.apostoli = function(fld, ico, pk) {
		if (notSet(fld)) {
			var fld = getelid('sxolioInput');
			if (notSet(fld)) { return; }
		}
		var sxolio = fld.value;

		sxolio = sxolio.trim();
		if (sxolio == '') { return; }

		if (notSet(pk)) { pk = Prefadoros.show; }
		switch (pk) {
		case 'partida':
			var pk = 'P';
			break;
		case 'kafenio':
			pk = 'K';
			break;
		default:
			mainFyi('Ακαθόριστη συζήτηση (παρτίδα/καφενείο)');
			return;
		}

		if (notSet(ico)) { ico = getelid('sxolioApostoli'); }
		if (notSet(ico)) { return; }
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('sizitisi/apostoli');
		req.xhr.onreadystatechange = function() {
			Sizitisi.apostoliCheck(req, fld, ico);
		};

		var params = 'pk=' + pk;
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
			writing = '';
			neoWriting = '';
			if (isSet(fld.id) && (fld.id == 'sxolioInput')) {
				Sizitisi.resetSxolioInput(fld);
			}
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
	};
	

	this.sxolioFocus = function() {
		var x = getelid('sxolioInput');
		if (isSet(x.disabled) && x.disabled) { return; }
		if (isSet(x)) { x.focus(); }
	};

	this.controlsHTML = function(fs) {
		var s = getelid('sxolioInput');
		if (notSet(s)) { return ''; }

		var html = '';
		if ((Prefadoros.show == 'kafenio') ||
			(isPartida() && (notTheatis() || isProsklisi())) ||
			(pektis.login == 'panos')) {
			s.disabled = false;
			if (notSet(fs)) { Sizitisi.sxolioFocus() };
			html += '<img id="sxolioApostoli" src="' + globals.server +
				'images/controlPanel/talk.png" class="pssIcon" ' +
				'title="Αποστολή σχολίου" alt="" ' +
				'onclick="Sizitisi.apostoli(null, this);" />';
		}
		else {
			s.disabled = true;
		}
		if (isPartida() && (Prefadoros.show == 'partida') &&
			(notTheatis() || isProsklisi())) {
			html += '<img id="sxolioDiagrafi" src="' + globals.server +
				'images/Xred.png" class="pssIcon" ' +
				'title="Διαγραφή σχολίων" alt="" ' +
				'onclick="Sizitisi.diagrafi(this);" />';
		}
		return html;
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

		// Αν έχει επιστραφεί καρφωτός πίνακας δημόσιας συζήτησης (ΔΣ),
		// κρατάμε τον κωδικό του παλαιοτέρου σχολίου για να τον
		// στέλνουμε στον server, ώστε να εντοπίζει τις επόμενες
		// έρευνες σε σχόλια της ΔΣ νεότερα από αυτό, συμπεριλαμβανομένου
		// και αυτού του σχολίου (βλέπε "prefadoros/dedomena.js").
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
		p.onmouseover = function() {
			var x = getelid('sxp_' + s.k);
			if (notSet(x)) { return; }
			if (notSet(x.style)) { return; }
			x.style.maxWidth = 'none';
			x.style.visibility = 'visible';
		};
		p.onmouseout = function() {
			var x = getelid('sxp_' + s.k);
			if (notSet(x)) { return; }
			if (notSet(x.style)) { return; }
			x.style.maxWidth = '0';
			x.style.visibility = 'hidden';
		};

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
