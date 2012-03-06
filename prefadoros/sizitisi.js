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

	this.sxolioAdd = function(s, proxiro) {
		var p = getelid('st_' + s.k);
		if (isSet(p)) { try { p.parentNode.removeChild(p); } catch(e) {}; }

		p = document.createElement('div');
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

		if (notSet(proxiro)) { proxiro = false; }
		p.innerHTML = Sizitisi.HTML(s, proxiro);
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

	this.HTML = function(s, proxiro) {
		var sxolio = Sizitisi.decode(s);
		var html = '';
		if (s.p == globals.systemAccount) {
			html += '<img src="' + globals.server + 'images/warning.png" ' +
				'alt="" style="width: 0.6cm; margin-left: -0.5cm; ' +
				'margin-bottom: -0.14cm;" />';
		}
		else {
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
			html += '<div class="sizitisiPektis';
			if (proxiro == true) { html += ' sizitisiPektisProxiro'; }
			html += '" style="color: #' + color + ';">' + s.p + '</div>';
		}

		html += sxolio;
		html += Sizitisi.oraSxoliou(s.k, s.w);
		return html;
	};

	var epexeIxos = [];

	this.decode = function(s) {
		s.s = akirosiScript(s.s);
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

	this.clickLink = function(e) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		return true;
	}
		

	this.funchatDecode = function(s) {
		var x = (s.s).split('@');
		if (x.length < 6) { return Sizitisi.textDecode(s.s); }

		var ikona = '';
		var video = '';
		if (x[2] != '') {
			var ikona = '<img src="' + globals.funchatServer + x[2] +
				'" class="sizitisiFunchatImage" alt="" ';
			if (x[3]) { ikona += 'style="width: ' + x[3] + 'cm;" '; }
			ikona += '/>';
		}

		var k = 'k' + s.k;
		if (x[4] && (!epexeIxos.hasOwnProperty(k)) && isSet(s.w) &&
			((currentTimestamp() - (s.w * 1000)) < 5000)) {
			video = Sizitisi.pexeIxoVideo(x[4]);
			epexeIxos[k] = true;
			// if (video != '') { ikona = ''; }
		}

		var titlos = x[5];
		for (var i = 6; i < x.length; i++) { titlos += x[i]; }
		if (titlos != '') { titlos = '<div>' + akirosiScript(titlos) + '</div>'; }

		return ikona + video + titlos;
	};

	// Τα βίντεο που φορτώνονται σε iframes αποκτούν id της μορφής "videoNNN",
	// όπου "NNN" είναι κάποιος αύξων αριθμός. Αυτά τα id χρησιμοποιούνται κατά
	// τη διαγραφή για να γίνει ουσιαστικά διακοπή του βίντεο, εφόσον αυτό
	// ενοχλεί. Θυμίζω ότι τα βίντεο φορτώνονται σε iframes μόνο για τον ήχο.

	var vdid = 0;

	this.videoId = function() {
		vdid++;
		return ' id="video' + vdid + '" ';
	};

	this.sigasiVideo = function() {
		var video = false;
		while (vdid > 0) {
			sviseNode(getelid('video' + vdid));
			vdid--;
			video = true;
		}
		return video;
	};

	this.pexeIxoVideo = function(iv) {
		var html = '';
		if (iv.match(/^https?:\/\/youtu\.be\//)) {
			html += '<iframe width="300" height="203"' + Sizitisi.videoId();
			html += 'src="http://www.youtube.com/embed/';
			html += iv.replace(/^https?:\/\/youtu\.be\//, '');
			html += html.match(/\?start=[0-9]+/) ? '&' : '?';
			html += 'autoplay=1&rel=0&controls=0&showinfo=0" ';
			html += 'frameborder="0" style="display: none;"></iframe>';
		}
		else if (iv.match(/^https?:\/\/splicd\.com\//)) {
			html += '<iframe width="300" height="203"';
			html += Sizitisi.videoId() + 'src="' + iv;
			html += '" frameborder="0" style="display: none;"></iframe>';
		}
		else {
			iv = iv.split(':');
			if ((iv.length > 1) && (iv[1] > 0)) {
				setTimeout(function() {
					playSound(iv[0], iv[2]);
				}, iv[1]);
			}
			else {
				playSound(iv[0], iv[2]);
			}
		}
		return html;
	};

	this.textDecode = function(s) {
		var dfltw = 82;		// default πλάτος σε χιλιοστά

		// Αν δώσουμε short link από το YouTube, π.χ. "http://youtu.be/6KUJE2xs-RE"
		// μας δίνει το βιντεάκι σε iframe. Το short link εμφανίζεται σε κουτάκι
		// που επιγράφεται "Σύνδεσμος σε αυτό το βίντεο", όταν πατάμε "Αποστολή".
		// Αν συμπληρώσουμε με +/- τότε αλλάζουμε το μέγεθος κατά το δοκούν, π.χ.
		//
		//	http://youtu.be/MeuyES_FJY8--+
		//
		// είναι το βίντεό μας αρκετά στενότερο. Μπορούμε να βάλουμε και το "="
		// για επαναφορά στο default μέγεθος.

		if (s.match(/^http:\/\/youtu\.be\//)) {
			var tmima = s.split("/");
			s = tmima[tmima.length - 1];		// το τελευταίο τμήμα του URL
			var url = s.replace(/[-+=]*$/, '');	// αποκόπτουμε τυχόν +/- από το τέλος
			var w = dfltw;

			// Εφόσον υπήρχαν +/- αυξομειώνουμε το πλάτος.
			if (url != s) {
				var sp = s.replace(url, '');
				sp = sp.split('');
				for (var i = 0; i < sp.length; i++) {
					dw = w / 2.0;
					switch (sp[i]) {
					case '+':
						w += dw;
						break;
					case '-':
						w -= dw;
						break;
					case '=':
						w = dfltw;
						break;
					}
				}
			}

			// Το πλάτος είναι σε χιλιοστά και πρέπει να έχει αναλογία 4:3 με το ύψος.
			return '<iframe style="width: ' + Math.round(w) + 'mm; height: ' +
				Math.round(w / 1.33) + 'mm;" src="http://www.youtube.com/embed/' +
				url + '" frameborder="0" allowfullscreen></iframe>';
		}

		// Αν δώσουμε URL εικόνας, τότε εμφανίζεται η εικόνα σε διάσταση τέτοια
		// που να χωράει στο χώρο συζήτησης κατά πλάτος. Αν συμπληρώσουμε με +/-
		// τότε αλλάζουμε το μέγεθος κατά το δοκούν.
		//
		//	http://pineza.info/images/face.png--+
		//
		// είναι η εικόνα μας αρκετά στενότερη.

		if (s.match(/^https?:\/\/.*\.(jpe?g|png|gif|bmp)[-+=]*$/i)) {
			var url = s.replace(/[-+=]*$/, '');
			var w = dfltw;
			if (url != s) {
				var sp = s.replace(url, '');
				sp = sp.split('');
				for (var i = 0; i < sp.length; i++) {
					dw = w / 2.0;
					switch (sp[i]) {
					case '+':
						w += dw;
						break;
					case '-':
						w -= dw;
						break;
					case '=':
						w = dfltw;
						break;
					}
				}
			}

			return '<img src="' + url + '" style="width: ' +
				Math.round(w) + 'mm;" alt="" />';
		}

		if (s.match(/^https?:\/\//i)) {
			return '<a target="_blank" href="' + s +
				'" onclick="return Sizitisi.clickLink(event);">' +
				'<img src="' + globals.server + 'images/link.png" ' +
				'style="width: 3.0cm; cursor: pointer; border-style: solid;' +
				'border-width: 2px;" title="Κλικ για μετάβαση στο σύνδεσμο ' +
				s + '" alt="" /></a>';
		}

		// Έχουμε εξαντλήσει τις περιπτώσεις εξωτερικών συνδέσμων και
		// μένει να ελέγξουμε για την ύπαρξη εμφυτευμένων emoticons.

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
				'brick056.jpg',
				'brick070.jpg'
			];
			if (isSet(x)) {
				x.title = 'Κλικ για αυτόματο ρολάρισμα του κειμένου';
				x.style.backgroundImage = 'url(' + globals.server +
					'images/anagnosi/' +
					bi[Math.floor(Math.random() * bi.length)] + ')';
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
			Sizitisi.apostoliCheck(req, fld, pk, sxolio, ico);
		};

		var params = 'pk=' + pk;
		params += '&sxolio=' + uri(sxolio);
		req.send(params);
	};

	this.apostoliCheck = function(req, fld, pk, sxolio, ico) {
		if (req.xhr.readyState != 4) { return; }
		ico.src = globals.server + 'images/controlPanel/talk.png';
		var rsp = req.getResponse();
		if (rsp.match(/@OK$/)) {
			var s = {
				k:	rsp.replace(/@OK$/, ''),
				p:	pektis.login,
				s:	sxolio,
				w:	parseInt((new Date).getTime() / 1000)
			};
			if (pk == 'K') { Kafenio.sxolioAdd(s, true); }
			else { Sizitisi.sxolioAdd(s, true); }
			writing = '';
			neoWriting = '';
			if (isSet(fld.id) && (fld.id == 'sxolioInput')) {
				Sizitisi.resetSxolioInput(fld);
			}
		}
		else {
			mainFyi(rsp);
			errorIcon(ico);
			playSound('beep');
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
		if (isPektis() && pektis.system) {
			s.disabled = true;
		}
		else if ((Prefadoros.show == 'kafenio') ||
			(isPartida() && (notTheatis() || isProsklisi())) ||
			(isPektis() && (pektis.login == 'panos'))) {
			s.disabled = false;
			if (notSet(fs)) { Sizitisi.sxolioFocus() };
			html += '<img id="sxolioApostoli" src="' + globals.server +
				'images/controlPanel/talk.png" class="pssIcon pssSizitisiIcon" alt="" ' +
				'title="Αποστολή σχολίου" onclick="Sizitisi.apostoli(null, this);" />';
			html += '<img id="sxolioErase" src="' + globals.server +
				'images/skoupaki.png" class="pssIcon pssSizitisiIcon" alt="" ' +
				'title="Καθαρισμός πεδίου" onclick="Sizitisi.resetSxolioInput();" />';
		}
		else {
			s.disabled = true;
		}
		if (isPartida() && (Prefadoros.show == 'partida') &&
			(notTheatis() || isProsklisi())) {
			html += '<img id="sxolioDiagrafi" src="' + globals.server +
				'images/Xred.png" class="pssIcon pssSizitisiIcon" alt="" ' +
				'title="Διαγραφή σχολίων" onclick="Sizitisi.diagrafi(this);" />';
		}
		html += '<img id="sxolioDiagrafi" src="' + globals.server +
			'images/sigasiVideo.png" class="pssIcon pssSizitisiIcon" alt="" ' +
			'title="Σίγαση funchat video" onclick="Sizitisi.sigasiVideo(this);" />';
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

	this.sxolioAdd = function(s, proxiro) {
		var p = getelid('sk_' + s.k);
		if (isSet(p)) { try { p.parentNode.removeChild(p); } catch(e) {}; }

		p = document.createElement('div');
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

		if (notSet(proxiro)) { proxiro = false; }
		p.innerHTML = Sizitisi.HTML(s, proxiro);
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
