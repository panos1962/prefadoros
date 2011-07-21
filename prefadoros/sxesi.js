var Sxesi = new function() {
	// Η μέθοδος "processDedomena" καλείται κατά την επιστροφή δεδομένων
	// και σκοπό έχει τον έλεγχο των παικτών/σχέσεων και την επαναδιαμόρφωση
	// του σχετικού εδαφίου της οθόνης. Ως μοναδική παράμετρο δέχεται τα
	// δεδομένα που επετράφησαν από τον server.

	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.sxesi)) {
			// Αν στο πεδίο "sxesi" έχουμε τιμή το string "same", τότε
			// σημαίνει ότι δεν έχει αλλάξει κάτι.
			if (dedomena.sxesi === 'same') {
				return;
			}

			// Αλλιώς στο πεδίο "sxesi" έχει επιστραφεί το array των δεδομένων
			// παικτών/σχέσεων, οπότε το βάζουμε στο σχετικό global array
			// και επαναδιαμορφώνουμε το σχετικό εδάφιο της οθόνης.
			sxesi = dedomena.sxesi;
			Sxesi.updateHTML();
			return;
		}

		// Δεν έχει επιστραφεί πεδίο "sxesi", οπότε πιθανόν να έχεουν επιστραφεί
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
				sxesi1[sxesi1.length] = dedomena.sxesiNew[i];
			}
		}

		// Διατρέχω το παλιό array "sxesi" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν τροποποιηθεί ή διαγραφεί. Για τις εγγραφές
		// που εμφανίζονται να έχουν τροποποιηθεί (array "sxesiMoid") περνάω
		// στο νέο array τα νέα δεδομένα, ενώ τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί τις αγνοώ· τις υπόλοιπες εγγραφές απλώς τις
		// αντιγράφω στο νέο array.
		for (var i = 0; i < sxesi.length; i++) {
			if (isSet(dedomena.sxesiDel) && (sxesi[i].l in dedomena.sxesiDel)) {
				continue;
			}

			if (isSet(dedomena.sxesiMod) && (sxesi[i].l in dedomena.sxesiMod)) {
				sxesi1[sxesi1.length] = dedomena.sxesiMod[sxesi[i].l];
				continue;
			}

			sxesi1[sxesi1.length] = sxesi[i];
		}

		sxesi = sxesi1;
		delete sxesi1;
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
		html += '';
		x.innerHTML = html;
	};

	this.HTML = function(i) {
		var html = '';
		html += '<div class="sxesiLine zebra' + (i % 2);
		sxesi[i].o  = 0;
		if (sxesi[i].o < 1) {
			html += ' sxesiOffline';
		}
		html += '" onmouseover="emfanesAfanes(this, true);" ';
		html += 'onmouseout="emfanesAfanes(this, false);">';
		switch (sxesi[i].o) {
		case 1:
			var ball = 'orangeBall';
			var title = 'Online, απασχολημένος';
			break;
		case 2:
			ball = 'greenBall';
			title = 'Online, διαθέσιμος';
			break;
		default:
			ball = 'fouxBall';
			title = 'Offline';
			break;
		}
		html += '<img alt="" class="sxesiDiathesimotita" src="' +
			globals.server + 'images/' + ball + '.png" ' +
			'title="' + title + '. Κλικ για εργαλεία" ' +
			'onclick="Sxesi.panel(\'' + sxesi[i].l + '\');" />';
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
		html += '</div>';
		html += '<div style="display: inline-block; cursor: pointer;" title="Πρόσκληση">';
		html += '<div class="sxesiData">' + sxesi[i].n + '</div>';
		html += '&nbsp;[&nbsp;<div class="sxesiData sxesi';
		switch (sxesi[i].s) {
		case 'F':		html += 'Filos'; break;
		case 'B':		html += 'Apoklismenos'; break;
		default:		html += 'Asxetos'; break;
		}
		html += '">' + sxesi[i].l + '</div>&nbsp;]</div>';
		html += '</div>'

		return html;
	};

	this.panel = function(login, attr) {
		var x = getelid('sx_' + login);
		if (isSet(x) && isSet(x.style) && isSet(x.style.display)) {
			if (isSet(attr)) {
				x.style.display = attr;
			}
			else {
				switch (x.style.display) {
				case 'inline-block':
					x.style.display = 'none';
					break;
				default:
					x.style.display = 'inline-block';
					break;
				}
			}
		}
	};

	this.addFilosHTML = function(pektis) {
		var html = '<img alt="" title="Ένταξη στους φίλους" class="sxesiIcon" src="' +
			globals.server + 'images/addFriend.png" ' +
			'onclick="Sxesi.addFilos(this, \'' + pektis + '\');" />';
		return html;
	};

	this.addFilos = function(img, pektis) {
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('sxesi/addFilos');
		req.xhr.onreadystatechange = function() {
			addFilosCheck(req, img, pektis);
		};

		req.send('pektis=' + uri(pektis));
	};

	function addFilosCheck(req, img, pektis) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		if (rsp) {
			playSound('beep');
			mainFyi(rsp);
			img.src = globals.server + 'images/X.png';
			setTimeout(function() {
				img.src = img.prevSrc;
			}, globals.duration.errorIcon);
		}
		else {
			img.src = img.prevSrc;
			mainFyi('Ο παίκτης "' + pektis + '" εντάχθηκε στους φίλους');
		}
		return false;
	};

	this.apoklismosHTML = function(pektis) {
		var html = '<img alt="" title="Αποκλεισμός παίκτη" class="sxesiIcon" src="' +
			globals.server + 'images/blockPektis.png" ' +
			'onclick="Sxesi.apoklismos(this, \'' + pektis + '\');" />';
		return html;
	};

	this.apoklismos = function(img, pektis) {
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('sxesi/apoklismos');
		req.xhr.onreadystatechange = function() {
			apoklismosCheck(req, img, pektis);
		};

		req.send('pektis=' + uri(pektis));
	};

	function apoklismosCheck(req, img, pektis) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		if (rsp) {
			playSound('beep');
			mainFyi(rsp);
			img.src = globals.server + 'images/X.png';
			setTimeout(function() {
				img.src = img.prevSrc;
			}, globals.duration.errorIcon);
		}
		else {
			img.src = img.prevSrc;
			mainFyi('Ο παίκτης "' + pektis + '" έχει αποκλειστεί');
		}
		return false;
	};

	this.aposisxetisiHTML = function(sxesi) {
		var html = '<img alt="" title="Αποσυσχέτιση" class="sxesiIcon" src="' +
			globals.server + 'images/X' + (sxesi.s == 'F' ? 'green' : 'red') + '.png" ' +
			'onclick="Sxesi.aposisxetisi(this, \'' + sxesi.l + '\');" />';
		return html;
	};

	this.aposisxetisi = function(img, pektis) {
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('sxesi/aposisxetisi');
		req.xhr.onreadystatechange = function() {
			aposisxetisiCheck(req, img, pektis);
		};

		req.send('pektis=' + uri(pektis));
	};

	function aposisxetisiCheck(req, img, pektis) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		if (rsp) {
			playSound('beep');
			mainFyi(rsp);
			img.src = globals.server + 'images/X.png';
			setTimeout(function() {
				img.src = img.prevSrc;
			}, globals.duration.errorIcon);
		}
		else {
			img.src = img.prevSrc;
			mainFyi('Αποσυσχετίστηκε Ο παίκτης "' + pektis + '"');
		}
		return false;
	};

	this.permesHTML = function(s) {
		var html = '<img alt="" title="Προσωπικό μήνυμα" class="sxesiIcon" src="' +
			globals.server + 'images/permes.png" ' +
			'onclick="Sxesi.permesWindow(\'' + s.l + '\');" />';
		return html;
	};

	this.permesWindow = function(login) {
		var w = window.open(globals.server + 'permes/index.php?' +
			'pedi=yes&pros=' + uri(login));
	};

	var searchPektisTimer = null;

	this.patchange = function(e, fld) {
		if (searchPektisTimer) {
			clearTimeout(searchPektisTimer);
		}

		fld.style.backgroundImage = '';
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
			case 27:	// Esc key
				fld.value = '';
				break;
			}
		}

		var wk = globals.server + 'images/working.gif';
		var si = getelid('sxetikosIcon');
		if (isSet(si) && (si.src != wk)) {
			si.src = globals.server + 'images/working.gif';
		}

		switch (fld.value.length) {
		case 0:		var delay = 10; break;
		case 1:		delay = 1000; break;
		case 2:		delay = 500; break;
		case 3:		delay = 300; break;
		default:	delay = 200; break;
		}

		searchPektisTimer = setTimeout(function() {
			Sxesi.patsend(fld.value);
		}, delay);
	};

	this.patsend = function(pat) {
		mainFyi(pat);
	};
};
