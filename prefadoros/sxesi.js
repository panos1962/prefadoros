var Sxesi = new function() {
	// Η μέθοδος "processDedomena" καλείται κατά την επιστροφή δεδομένων
	// και σκοπό έχει τον έλεγχο των παικτών/σχέσεων και την επαναδιαμόρφωση
	// του σχετικού εδαφίου της οθόνης. Ως μοναδική παράμετρο δέχεται τα
	// δεδομένα που επετράφησαν από τον server.

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.sxesi) && notSet(dedomena.sxesiNew) &&
			notSet(dedomena.sxesiMod) && notSet(dedomena.sxesiDel)) {
			return;
		}

		if (isSet(dedomena.sxesi)) {
			sxesi = dedomena.sxesi;
			Sxesi.updateHTML();
			return;
		}

		// Δεν έχει επιστραφεί πεδίο "sxesi", οπότε πιθανόν να έχουν επιστραφεί
		// πεδία "sxesiNew", "sxesiMod" και "sxesiDel" που περιέχουν νέους
		// παίκτες, τροποποιημένες εγγραφές και εγγραφές που πρέπει να
		// διαγραφούν αντίστοιχα. Κατσκευάζω, λοιπόν, νέο local array,
		// το αντιγράφω στο global array "sxesi" και επαναδιαμορφώνω το
		// σχετικό εδάφιο της οθόνης.
		var sxesi1 = [];

		// Αν έχει επιστραφεί array "sxesiNew", τότε πρόκειται για νέες
		// εγγραφές τις οποίες θα εμφανίσω πρώτες.
		if (isSet(dedomena.sxesiNew)) {
			for (var i = 0; i < dedomena.sxesiNew.length; i++) {
				sxesi1.push(dedomena.sxesiNew[i]);
			}
		}

		// Διατρέχω το παλιό array "sxesi" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν τροποποιηθεί ή διαγραφεί. Για τις εγγραφές
		// που εμφανίζονται να έχουν τροποποιηθεί (array "sxesiMod") περνάω
		// στο νέο array τα νέα δεδομένα, ενώ τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί τις αγνοώ· τις υπόλοιπες εγγραφές απλώς τις
		// αντιγράφω στο νέο array.
		for (var i = 0; i < sxesi.length; i++) {
			if (isSet(dedomena.sxesiDel) && (sxesi[i].l in dedomena.sxesiDel)) {
				continue;
			}

			if (isSet(dedomena.sxesiMod) && (sxesi[i].l in dedomena.sxesiMod)) {
				sxesi1.push(dedomena.sxesiMod[sxesi[i].l]);
				continue;
			}

			sxesi1.push(sxesi[i]);
		}

		sxesi = sxesi1;
		Sxesi.updateHTML();
	};

	this.updateHTML = function() {
		var x = getelid('sxesiArea');
		if (notSet(x)) { return; }

		var html = '';
		if (isSet(sxesi)) {
			for (var i = 0; i < sxesi.length; i++) {
				html += Sxesi.HTML(i);
			}
		}
		x.innerHTML = html;
	};

	this.HTML = function(i) {
		var html = '';
		html += '<div class="sxesiLine zebra' + (i % 2);
		if (sxesi[i].o < 1) { html += ' sxesiOffline'; }
		html += '" onmouseover="emfanesAfanes(this, true);" ';
		html += 'onmouseout="emfanesAfanes(this, false);">';
		switch (sxesi[i].o) {
		case 1:
			var ball = 'green';
			var title = 'Online, διαθέσιμος';
			break;
		case 2:
			var ball = 'orange';
			var title = 'Online, απασχολημένος';
			break;
		default:
			var ball = 'blue';
			var title = 'Offline';
			break;
		}
		html += '<div onmouseover="Sxesi.panel(\'' + sxesi[i].l + '\', \'inline-block\');" ' +
			'onmouseout="Sxesi.panel(\'' + sxesi[i].l + '\', \'none\');" ' +
			'onclick="Sxesi.panel(\'' + sxesi[i].l + '\');" ' +
			'style="display: inline-block;">';
		html += '<img id="sxi_' + sxesi[i].l + '" class="sxesiDiathesimotita" alt="" src="' +
			globals.server + 'images/' + ball + 'Ball.png" title="' + title + '" />';
		html += '<div id="sx_' + sxesi[i].l + '" style="display: none;">';
		switch (sxesi[i].s) {
		case 'F':
			html += Sxesi.apoklismosHTML(sxesi[i].l);
			html += Sxesi.aposisxetisiHTML(sxesi[i]);
			break;
		case 'B':
			html += Sxesi.addFilosHTML(sxesi[i].l);
			html += Sxesi.aposisxetisiHTML(sxesi[i]);
			break;
		default:
			html += Sxesi.addFilosHTML(sxesi[i].l);
			html += Sxesi.apoklismosHTML(sxesi[i].l);
			break;
		}
		html += Sxesi.permesHTML(sxesi[i]);
		html += Sxesi.profinfoHTML(sxesi[i]);
		if (isPektis() && isSet(pektis.superuser) && pektis.superuser) {
			html += Sxesi.dixeTopoHTML(sxesi[i].l);
		}
		html += '</div>';
		html += '</div>';
		html += '<div style="display: inline-block;';
		if (dikeomaProsklisis()) {
			html += ' cursor: pointer;" title="Πρόσκληση"' +
			' onclick="Sxesi.addProsklisi(\'' + sxesi[i].l + '\');';
		}
		html += '">';
		html += '<div class="sxesiData">' + sxesi[i].n + '</div>';
		html += '&nbsp;[&nbsp;<div class="sxesiData sxesi';
		switch (sxesi[i].s) {
		case 'F':	html += 'Filos'; break;
		case 'B':	html += 'Apoklismenos'; break;
		default:	html += 'Asxetos'; break;
		}
		html += '">' + sxesi[i].l + '</div>&nbsp;]</div>';
		html += '</div>'

		return html;
	};

	this.panel = function(login, display) {
		var x = getelid('sx_' + login);
		if (notSet(x)) { return; }
		if (notSet(x.style)) { return; }

		if (notSet(display)) {
			switch (x.style.display) {
			case 'inline-block':
				display = 'none';
				break;
			default:
				display = 'inline-block';
				break;
			}
		}
		x.style.display = display;
	};

	// Η παράμετρος "post" είναι κάποια προαιρετική function η οποία θα κληθεί
	// μετά την επιτυχή ένταξη του παίκτη στους φίλους, με παράμετρο το όνομα
	// του παίκτη.

	this.addFilosHTML = function(pektis, post) {
		var html = '<img alt="" title="Ένταξη στους φίλους" class="sxesiIcon" src="' +
			globals.server + 'images/addFriend.png" ' +
			'onclick="Sxesi.addFilos(this, \'' + pektis + '\'';
		if (isSet(post)) { html += ', ' + post; }
		html += ');" />';
		return html;
	};

	this.addFilos = function(img, pektis, post) {
		if (isSet(window.Sizitisi)) { Sizitisi.sxolioFocus(); }
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('sxesi/addFilos');
		req.xhr.onreadystatechange = function() {
			addFilosCheck(req, img, pektis, post);
		};

		req.send('pektis=' + uri(pektis));
	};

	function addFilosCheck(req, img, pektis, post) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp) {
			playSound('beep');
			mainFyi(rsp);
			img.src = globals.server + 'images/X.png';
			setTimeout(function() {
				try { img.src = img.prevSrc; } catch(e) {};
			}, globals.duration.errorIcon);
		}
		else {
			try { img.src = img.prevSrc; } catch(e) {};
			if (isSet(post)) { post(pektis); }
			mainFyi('Ο παίκτης "' + pektis + '" εντάχθηκε στους φίλους');
		}
		return false;
	};

	// Η παράμετρος "post" είναι κάποια προαιρετική function η οποία θα κληθεί
	// μετά τον επιτυχή αποκλεισμό του παίκτη, με παράμετρο το όνομα του παίκτη.

	this.apoklismosHTML = function(pektis, post) {
		var html = '<img alt="" title="Αποκλεισμός παίκτη" class="sxesiIcon" src="' +
			globals.server + 'images/blockPektis.png" ' +
			'onclick="Sxesi.apoklismos(this, \'' + pektis + '\'';
		if (isSet(post)) { html += ', ' + post; }
		html += ');" />';
		return html;
	};

	this.apoklismos = function(img, pektis, post) {
		if (isSet(window.Sizitisi)) { Sizitisi.sxolioFocus(); }
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('sxesi/apoklismos');
		req.xhr.onreadystatechange = function() {
			apoklismosCheck(req, img, pektis, post);
		};

		req.send('pektis=' + uri(pektis));
	};

	function apoklismosCheck(req, img, pektis, post) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp) {
			playSound('beep');
			mainFyi(rsp);
			img.src = globals.server + 'images/X.png';
			setTimeout(function() {
				try { img.src = img.prevSrc; } catch(e) {};
			}, globals.duration.errorIcon);
		}
		else {
			try { img.src = img.prevSrc; } catch(e) {};
			if (isSet(post)) { post(pektis); }
			mainFyi('Ο παίκτης "' + pektis + '" έχει αποκλειστεί');
		}
		return false;
	};

	// Η παράμετρος "post" είναι κάποια προαιρετική function η οποία θα κληθεί
	// μετά την επιτυχή αποσυσχέτιση του παίκτη, με παράμετρο το όνομα του παίκτη.

	this.aposisxetisiHTML = function(sxesi, post) {
		var html = '<img alt="" title="Αποσυσχέτιση" class="sxesiIcon" src="' +
			globals.server + 'images/X' + (sxesi.s == 'F' ? 'green' : 'red') + '.png" ' +
			'onclick="Sxesi.aposisxetisi(this, \'' + sxesi.l + '\'';
		if (isSet(post)) { html += ', ' + post; }
		html += ');" />';
		return html;
	};

	this.aposisxetisi = function(img, pektis, post) {
		if (isSet(window.Sizitisi)) { Sizitisi.sxolioFocus(); }
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('sxesi/aposisxetisi');
		req.xhr.onreadystatechange = function() {
			aposisxetisiCheck(req, img, pektis, post);
		};

		req.send('pektis=' + uri(pektis));
	};

	function aposisxetisiCheck(req, img, pektis, post) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp) {
			playSound('beep');
			mainFyi(rsp);
			img.src = globals.server + 'images/X.png';
			setTimeout(function() {
				img.src = img.prevSrc;
			}, globals.duration.errorIcon);
		}
		else {
			try { img.src = img.prevSrc; } catch(e) {};
			if (isSet(post)) { post(pektis); }
			mainFyi('Αποσυσχετίστηκε ο παίκτης "' + pektis + '"');
		}
		return false;
	};

	this.permesHTML = function(s) {
		var html = '<img alt="" title="Προσωπικό μήνυμα" class="sxesiIcon" src="' +
			globals.server + 'images/permes.png" ' +
			'onclick="Sxesi.permesWindow(\'' + s.l + '\');" />';
		return html;
	};

	this.permesWindow = function(login, msg) {
		msg = isSet(msg) ? '&minima=' + uri(msg) : '';
		var w = window.open(globals.server + 'permes/index.php?' +
			'pedi=yes&pros=' + uri(login) + msg);
	};

	this.profinfoHTML = function(s) {
		var html = '<img alt="" title="Προφίλ παίκτη" class="sxesiIcon" src="' +
			globals.server + 'images/profinfo.png" ' +
			'onclick="Profinfo.dixe(event, \'' + s.l + '\', null, this);" ' +
			'onmouseover="Profinfo.omo(\'' + s.l + '\', null, true);" ' +
			'onmouseout="Profinfo.omo(\'' + s.l + '\', null, false);" />';
		return html;
	};

	this.dixeTopoHTML = function(pektis) {
		var html = '<img alt="" title="Εντοπισμός παίκτη" class="sxesiIcon" src="' +
			globals.server + 'images/iplocator.png" onclick="Sxesi.dixeTopo(event, this, \'' +
			pektis + '\');" />';
		return html;
	};

	this.dixeTopo = function(e, img, pektis) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		if (isSet(window.Sizitisi)) { Sizitisi.sxolioFocus(); }
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('account/getIpAddress');
		req.xhr.onreadystatechange = function() {
			dixeTopoCheck(req, img, pektis);
		};

		req.send('pektis=' + uri(pektis));
	};

	var wiplocator = null;

	function dixeTopoCheck(req, img, pektis) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp.match(/^OK@/)) {
			try { img.src = img.prevSrc; } catch(e) {};
			var href = 'http://www.infosniper.net?ip_address=' + rsp.replace(/^OK@/, '') +
				'&map_source=1&overview_map=1&lang=1&map_type=1&zoom_level=7';
			if (isSet(wiplocator)) { wiplocator.close(); }
			wiplocator = window.open(href);
		}
		else {
			playSound('beep');
			mainFyi(rsp);
			try {
				try { img.src = globals.server + 'images/X.png'; } catch(e) {
					return;
				}
				setTimeout(function() {
					try { img.src = img.prevSrc; } catch(e) {};
				}, globals.duration.errorIcon);
			} catch(e) {};
		}
	};

	this.addProsklisi = function(pektis, img, checkTheatis, checkIdioktito) {
		if (isSet(window.Sizitisi)) { Sizitisi.sxolioFocus(); }
		if (notSet(checkTheatis)) { checkTheatis = true; }
		if (checkTheatis && isTheatis()) {
			playSound('beep');
			mainFyi('Δεν μπορείτε να αποστείλετε πρόσκληση ως θεατής');
			return;
		}
		if (notSet(checkIdioktito)) { checkIdioktito = true; }
		if (checkIdioktito && (!dikeomaRithmisis())) {
			playSound('beep');
			mainFyi('Μόνο ο δημιουργός του τραπεζιού μπορεί να αποστείλει προσκλήσεις');
			return;
		}
		if (notSet(img)) { img = getelid('sxi_' + pektis); }
		if (isSet(img)) {
			img.prevSrc = img.src;
			img.src = globals.server + 'images/working.gif';
		}
		var req = new Request('sxesi/addProsklisi');
		req.xhr.onreadystatechange = function() {
			addProsklisiCheck(req, img, pektis);
		};

		params = 'pion=' + uri(pektis);
		req.send(params);
	};

	function addProsklisiCheck(req, img, pektis) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp.match(/^OK@/)) {
			playSound('pop');
			mainFyi('Έχει αποσταλεί πρόσκληση στον παίκτη "' + pektis +
				'" για το τραπέζι ' + rsp.replace(/^OK@/, ''));
			if (notSet(img)) { return; }

			try { img.src = img.prevSrc; } catch(e) {}
			return;
		}

		if (!rsp) { return; }

		playSound('beep');
		mainFyi(rsp);
		if (notSet(img)) { return; }

		try { img.src = globals.server + 'images/X.png'; } catch(e) {}
		setTimeout(function() {
			try { img.src = img.prevSrc; } catch(e) {};
		}, globals.duration.errorIcon);
	};

	var searchPektisTimer = null;
	var peknpatPrev = '';

	this.patchange = function(e, fld) {
		fld.style.backgroundImage = '';
		if (window.event) { var key = e.keyCode; }
		else if (e.which) { key = e.which; }
		else { key = false; }

		if (key) {
			switch(key) {
			case 27:	// Esc key
				fld.value = '';
				break;
			}
			if (fld.value == '') {
				fld.style.backgroundImage = 'url(' +globals.server +
					'images/sxesiPrompt.png)';
			}
			else {
				fld.style.backgroundImage = '';
			}
		}

		if (fld.value == peknpatPrev) { return; }
		peknpatPrev = fld.value;
		Trapezi.updateHTML();
		if (Prefadoros.show == 'kafenio') {
			var x = getelid('prefadoros');
			if (x.innerHTML != Trapezi.HTML) {
				x.innerHTML = Trapezi.HTML;
			}
		}

		switch (fld.value.length) {
		case 0:		var delay = 10; break;
		case 1:		delay = 1000; break;
		case 2:		delay = 500; break;
		case 3:		delay = 300; break;
		default:	delay = 200; break;
		}

		if (isSet(searchPektisTimer)) {
			clearTimeout(searchPektisTimer);
			searchPektisTimer = null;
		}

		searchPektisTimer = setTimeout(function() {
			Sxesi.peknpat(fld.value);
		}, delay);
	};

	this.sxetizomenoi = function(img) {
		if (isSet(window.Sizitisi)) { Sizitisi.sxolioFocus(); }
		if (isSet(searchPektisTimer)) {
			clearTimeout(searchPektisTimer);
			searchPektisTimer = null;
		}

		var x = getelid('peknpat');
		if (isSet(x)) {
			x.value = '';
			peknpatPrev = '';
			if (isSet(x.style)) {
				x.style.backgroundImage = 'url(' +globals.server +
					'images/sxesiPrompt.png)';
			}
		}

		var x = getelid('pekstat');
		if (isSet(x)) {
			x.src = globals.server + 'images/blueBall.png';
			x.title = 'Ασχέτως κατάστασης';
		}

		Sxesi.peknpat('', 'ΟΛΟΙ');
		var x = getelid('mesg');
		if (isSet(x)) { x.focus(); }
	};

	this.peknpat = function(pat, stat) {
		var ico = getelid('sxetikosIcon');
		ico.src = globals.server + 'images/working.gif';
		var req = new Request('sxesi/peknpat');
		req.xhr.onreadystatechange = function() {
			peknpatCheck(req, ico);
		};

		params = 'sinedria=' + sinedria.kodikos;
		params += '&peknpat=' + uri(pat);
		if (isSet(stat)) {
			params += '&pekstat=' + uri(stat);
		}
		req.send(params);
	};

	function peknpatCheck(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp) {
			playSound('beep');
			mainFyi(rsp);
			try { ico.src = globals.server + 'images/X.png'; } catch(e) {};
			setTimeout(function() {
				try { ico.src = globals.server + 'images/sxetikos.png'; }
					catch(e) {};
			}, globals.duration.errorIcon);
		}
		else {
			try { ico.src = globals.server + 'images/sxetikos.png'; }
				catch(e) {};
		}
		return false;
	};

	this.pekstat = function(img) {
		if (isSet(window.Sizitisi)) { Sizitisi.sxolioFocus(); }
		var x = img.src.split('/');
		if (x.length < 1) { return; }

		switch (x[x.length - 1]) {
		case 'greenBall.png':	var stat = 'ONLINE'; break
		case 'orangeBall.png':	var stat = 'ΟΛΟΙ'; break
		case 'blueBall.png':	var stat = 'ΔΙΑΘΕΣΙΜΟΙ'; break;
		default: return;
		}

		var oldImg = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('sxesi/pekstat');
		req.xhr.onreadystatechange = function() {
			Sxesi.pekstatCheck(req, img, stat, oldImg);
		};

		params = 'sinedria=' + sinedria.kodikos;
		params += '&pekstat=' + uri(stat);
		req.send(params);

		var x = getelid('mesg');
		if (isSet(x)) { x.focus(); }
	};

	this.pekstatCheck = function(req, ico, stat, oldIco) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp) {
			playSound('beep');
			mainFyi(rsp);
			ico.src = globals.server + 'images/X.png';
			setTimeout(function() {
				try { ico.src = oldIco; } catch(e) {};
			}, globals.duration.errorIcon);
		}
		else {
			switch (stat) {
			case 'ΔΙΑΘΕΣΙΜΟΙ':
				ico.src = globals.server + 'images/greenBall.png';
				ico.title = 'Βλέπετε διαθέσιμους παίκτες. ' +
					'Κλικ για online παίκτες';
				break
			case 'ONLINE':
				ico.src = globals.server + 'images/orangeBall.png';
				ico.title = 'Βλέπετε online παίκτες. ' +
					'Κλικ για παίκτες ασχέτως κατάστασης';
				break
			case 'ΟΛΟΙ':
				ico.src = globals.server + 'images/blueBall.png';
				ico.title = 'Βλέπετε παίκτες ασχέτως κατάστασης. ' +
					'Κλικ για διαθέσιμους παίκτες';
				break
			}
		}

		var x = getelid('mesg');
		if (isSet(x)) { x.focus(); }
	};
};
