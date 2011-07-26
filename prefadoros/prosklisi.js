var Prosklisi = new function() {
	// Η μέθοδος "processDedomena" καλείται κατά την επιστροφή δεδομένων
	// και σκοπό έχει τον έλεγχο των παικτών/σχέσεων και την επαναδιαμόρφωση
	// του σχετικού εδαφίου της οθόνης. Ως μοναδική παράμετρο δέχεται τα
	// δεδομένα που επετράφησαν από τον server.

	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.prosklisi)) {
			// Αν στο πεδίο "prosklisi" έχουμε τιμή το string "same", τότε
			// σημαίνει ότι δεν έχει αλλάξει κάτι.
			if (dedomena.prosklisi === 'same') {
				return;
			}

			// Αλλιώς στο πεδίο "prosklisi" έχει επιστραφεί το array των δεδομένων
			// προσκλήσεων οπότε το βάζουμε στο σχετικό global array
			// και επαναδιαμορφώνουμε το σχετικό εδάφιο της οθόνης.
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
					(('p_' + prosklisi[i].k) in dedomena.prosklisiDel)) {
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
				'images/Xred.png" onclick="Prosklisi.skisimo(' +
				prosklisi[i].k + ');" title="Ανάκληση πρόσκλησης" alt="" />';
			html += '<span>προς <div class="prosklisiData">' + prosklisi[i].p + '</div>';
		}
		else {
			var apodoxi = ' title="Αποδοχή πρόσκλησης" onclick="Prosklisi.apodoxi(' +
				prosklisi[i].k + ');" ';
			html += '<img class="prosklisiIcon" src="' + globals.server +
				'images/prosEmena.png"' + apodoxi + 'alt="" />';
			html += '<img class="prosklisiIcon" src="' + globals.server +
				'images/Xred.png" onclick="Prosklisi.skisimo(' +
				prosklisi[i].k + ');" title="Απόρριψη πρόσκλησης" alt="" />';
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

	this.skisimo = function(k) {
		mainFyi('σκίσιμο πρόσκλησης ' + k);
	};
};
