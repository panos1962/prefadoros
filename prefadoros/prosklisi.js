var Prosklisi = new function() {
	// Η μέθοδος "processDedomena" καλείται κατά την επιστροφή δεδομένων
	// και σκοπό έχει τον έλεγχο των παικτών/σχέσεων και την επαναδιαμόρφωση
	// του σχετικού εδαφίου της οθόνης. Ως μοναδική παράμετρο δέχεται τα
	// δεδομένα που επετράφησαν από τον server.

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.prosklisi) && notSet(dedomena.prosklisiNew) &&
			notSet(dedomena.prosklisiDel)) {
			return;
		}

		if (isSet(dedomena.prosklisi)) {
			if (dedomena.prosklisi.length < prosklisi.length) {
				playSound('skisimo');
			}
			else if (dedomena.prosklisi.length > prosklisi.length) {
				playSound('sfirigma');
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

		// Αν έχει επιστραφεί array "prosklisiNew", τότε πρόκειται για νέες
		// εγγραφές τις οποίες θα εμφανίσω πρώτες.
		if (isSet(dedomena.prosklisiNew)) {
			playSound('sfirigma');
			for (var i = 0; i < dedomena.prosklisiNew.length; i++) {
				prosklisi1[prosklisi1.length] = dedomena.prosklisiNew[i];
			}
		}

		// Διατρέχω το παλιό array "prosklisi" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν διαγραφεί. Τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί τις αγνοώ.
		if (isSet(dedomena.prosklisiDel)) { playSound('skisimo'); }
		for (var i = 0; i < prosklisi.length; i++) {
			if (isSet(dedomena.prosklisiDel) &&
				(('p' + prosklisi[i].k) in dedomena.prosklisiDel)) {
				continue;
			}

			prosklisi1[prosklisi1.length] = prosklisi[i];
		}

		prosklisi = prosklisi1;
		delete prosklisi1;
		Prosklisi.updateHTML();
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
		html += '';
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
			html += '<img class="prosklisiIcon" src="' + globals.server +
				'images/prosEmena.png"' + apodoxi + 'alt="" />';
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
		mainFyi('αποδοχή πρόσκλησης ' + k);
	};

	this.skisimo = function(img, k, cfrm) {
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
				img.src = img.prevSrc;
			}, globals.duration.errorIcon);
		}
		else {
			img.src = img.prevSrc;
		}
	};
};
