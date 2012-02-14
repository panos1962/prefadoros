var Prosklisi = new function() {
	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.prosklisi) && notSet(dedomena.prosklisiNew) &&
			notSet(dedomena.prosklisiDel)) {
			return;
		}

		if (isSet(dedomena.prosklisi)) {
			if (notFreska(dedomena) && isDiathesimos()) {
				Prosklisi.ixitikoSima(dedomena);
			}
			prosklisi = dedomena.prosklisi;
			Prosklisi.updateHTML();
			return;
		}

		// Δεν έχει επιστραφεί πεδίο "prosklisi", οπότε πιθανόν να έχουν επιστραφεί
		// πεδία "prosklisiNew" και "prosklisiDel" που περιέχουν νέες προσκλήσεις
		// και προσκλήσεις που πρέπει να διαγραφούν αντίστοιχα. Κατσκευάζω, λοιπόν,
		// νέο local array, το αντιγράφω στο global array "prosklisi" και επαναδιαμορφώνω
		// το σχετικό εδάφιο της οθόνης.
		var prosklisi1 = [];
		var nea = false;

		// Αν έχει επιστραφεί array "prosklisiNew", τότε πρόκειται για νέες
		// εγγραφές τις οποίες θα εμφανίσω πρώτες.
		if (isSet(dedomena.prosklisiNew)) {
			for (var i = 0; i < dedomena.prosklisiNew.length; i++) {
				if ((dedomena.prosklisiNew[i].a != pektis.login) &&
					(dedomena.prosklisiNew[i].a != globals.systemAccount)) {
					nea = true;
				}
				prosklisi1.push(dedomena.prosklisiNew[i]);
			}
			if (nea && notFreska(dedomena) && isDiathesimos()) { playSound('sfirigma'); }
		}

		// Διατρέχω το παλιό array "prosklisi" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν διαγραφεί. Τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί τις αγνοώ.
		for (var i = 0; i < prosklisi.length; i++) {
			if (notSet(dedomena.prosklisiDel) ||
				(!(('p' + prosklisi[i].k) in dedomena.prosklisiDel))) {
				prosklisi1.push(prosklisi[i]);
			}
		}

		prosklisi = prosklisi1;
		Prosklisi.updateHTML();
	};

	this.ixitikoSima = function(dedomena) {
		var palia = {};
		for (var i = 0; i < prosklisi.length; i++) {
			if (prosklisi[i].a != pektis.login) {
				palia[prosklisi[i].a] = true;
			}
		}

		for (var i = 0; i < dedomena.prosklisi.length; i++) {
			if ((dedomena.prosklisi[i].a != pektis.login) &&
				(!(dedomena.prosklisi[i].a in palia)) &&
				(dedomena.prosklisi[i].a != globals.systemAccount)) {
				playSound('sfirigma');
				return;
			}
		}
	};

	this.updateHTML = function() {
		var x = getelid('prosklisiArea');
		if (notSet(x)) { return; }

		var html = '';
		if (isSet(prosklisi)) {
			for (var i = 0; i < prosklisi.length; i++) {
				html += Prosklisi.HTML(i);
			}
		}
		x.innerHTML = html;
	};

	this.HTML = function(i) {
		var apoMena = (prosklisi[i].p != pektis.login);
		var estali = ' (εστάλη ' + strPote(prosklisi[i].s) + ')';
		var html = '';
		html += '<div class="prosklisiLine zebra' + (i % 2);
		if (apoMena) { html += ' prosklisiApo'; }
		html += '" onmouseover="emfanesAfanes(this, true);" ';
		html += 'onmouseout="emfanesAfanes(this, false);">';
		html += '<div>';
		if (apoMena) {
			html += '<img class="prosklisiIcon" src="' + globals.server +
				'images/apoMena.png" style="cursor: default;" alt="" />';
			html += '<img class="prosklisiIcon" src="' + globals.server +
				'images/Xgreen.png" onclick="Prosklisi.skisimo(this, ' +
				prosklisi[i].k + ');" title="Ανάκληση πρόσκλησης" alt="" />';
			html += '<span title="Πρόσκληση προς &quot;' + prosklisi[i].p +
				'&quot; για το τραπέζι ' + prosklisi[i].t + estali +
				'">προς <div class="prosklisiData">' + prosklisi[i].p + '</div>';
		}
		else {
			var apodoxi = ' title="Αποδοχή πρόσκλησης από &quot;' +
				prosklisi[i].a + '&quot; για το τραπέζι ' + prosklisi[i].t + estali +
				'" onclick="Prosklisi.apodoxi(' + prosklisi[i].k + ');" ';
			html += '<img id="ap_' + prosklisi[i].k + '" class="prosklisiIcon" ' +
				'src="' + globals.server + 'images/prosEmena.png"' + apodoxi + 'alt="" />';
			html += '<img class="prosklisiIcon" src="' + globals.server +
				'images/Xred.png" onclick="Prosklisi.skisimo(this, ' +
				prosklisi[i].k + ', true);" title="Απόρριψη πρόσκλησης" alt="" />';
			html += '<span' + apodoxi + 'style="cursor: pointer;">' +
				'από <div class="prosklisiData">' + prosklisi[i].a + '</div>';
		}
		html += ', τραπέζι <div class="prosklisiData">' + prosklisi[i].t + '</div>';
		html += '</span></div>';
		html += '</div>';

		return html;
	};

	this.apodoxi = function(k) {
		Sizitisi.sxolioFocus();
		mainFyi('αποδοχή πρόσκλησης ' + k);
		var img = getelid('ap_' + k);
		if (notSet(img)) { return; }
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('prosklisi/apodoxi');
		req.xhr.onreadystatechange = function() {
			apodoxiCheck(req, img);
		};

		params = 'prosklisi=' + uri(k);
		req.send(params);
	};

	function apodoxiCheck(req, img) {
		if (req.xhr.readyState != 4) { return; }
		img.src = img.prevSrc;
		rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			errorIcon(img);
			playSound('beep');
		}
	};

	this.skisimo = function(img, k, cfrm) {
		Sizitisi.sxolioFocus();
		if (isSet(cfrm) && cfrm &&
			(!confirm('Θέλετε πράγματι να απορρίψετε την πρόσκληση;'))) {
			return;
		}

		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('prosklisi/delProsklisi');
		req.xhr.onreadystatechange = function() {
			skisimoCheck(req, img);
		};

		params = 'kodikos=' + uri(k);
		req.send(params);
	};

	function skisimoCheck(req, img) {
		if (req.xhr.readyState != 4) { return; }
		rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			playSound('beep');
			img.src = globals.server + 'images/X.png';
			setTimeout(function() {
				try { img.src = img.prevSrc; } catch(e) {};
			}, globals.duration.errorIcon);
		}
		else {
			playSound('skisimo');
			try { img.src = img.prevSrc; } catch(e) {};
		}
	};

	this.diagrafiOlon = function(img) {
		Sizitisi.sxolioFocus();
		if (!confirm('Θέλετε πράγματι να διαγράψετε ΟΛΕΣ τις προσκλήσεις;')) { return; }

		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('prosklisi/delProsklisi');
		req.xhr.onreadystatechange = function() {
			skisimoCheck(req, img);
		};

		params = 'oles=yes';
		req.send(params);
	};

	this.theates = function(img) {
		Sizitisi.sxolioFocus();
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('prosklisi/theates');
		req.xhr.onreadystatechange = function() {
			theatesCheck(req, img);
		};

		req.send();
	};

	function theatesCheck(req, img) {
		if (req.xhr.readyState != 4) { return; }
		img.src = img.prevSrc;
		rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			errorIcon(img);
			playSound('beep');
		}
	};

	this.controlsHTML = function() {
		var html = '';
		if (isPartida() && notTheatis()) {
			html += '<img class="pssIcon" src="' + globals.server +
				'images/controlPanel/theatis.png" ' +
				'title="Προσκαλέστε όλους τους θεατές" ' +
				'alt="" onclick="Prosklisi.theates(this);" />';
		}
		html += '<img class="pssIcon" src="' + globals.server + 'images/Xred.png" ' +
			'title="Διαγραφή όλων των προσκλήσεων που σας αφορρούν" ' +
			'alt="" onclick="Prosklisi.diagrafiOlon(this);" />';
		return html;
	};
};
