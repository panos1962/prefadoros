var Kafenio = new function() {
	// Η μέθοδος "processDedomena" καλείται κατά την επιστροφή δεδομένων
	// και σκοπό έχει τον έλεγχο της συζήτησης του καφενείου και την επαναδιαμόρφωση
	// του σχετικού εδαφίου της οθόνης. Ως μοναδική παράμετρο δέχεται τα
	// δεδομένα που επεστράφησαν από τον server.

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.kafenio) && notSet(dedomena.kafenioNew) &&
			notSet(dedomena.kafenioMod) && notSet(dedomena.kafenioDel)) {
			return;
		}

		if (isSet(dedomena.kafenio)) {
			kafenio = dedomena.kafenio;
			Kafenio.updateHTML();
			return;
		}

		// Δεν έχει επιστραφεί πεδίο "kafenio", οπότε πιθανόν να έχουν επιστραφεί
		// πεδία "kafenioNew", "kafenioMod" και "kafenioDel" που περιέχουν νέα
		// σχόλια, τροποποιημένες εγγραφές και εγγραφές που πρέπει να
		// διαγραφούν αντίστοιχα. Κατασκευάζω, λοιπόν, νέο local array,
		// το αντιγράφω στο global array "kafenio" και επαναδιαμορφώνω το
		// σχετικό εδάφιο της οθόνης.
		var kafenio1 = [];

		// Διατρέχω το παλιό array "kafenio" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν τροποποιηθεί ή διαγραφεί. Για τις εγγραφές
		// που εμφανίζονται να έχουν τροποποιηθεί (array "kafenioMod") περνάω
		// στο νέο array τα νέα δεδομένα, ενώ τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί τις αγνοώ· τις υπόλοιπες εγγραφές απλώς τις
		// αντιγράφω στο νέο array.
		for (var i = 0; i < kafenio.length; i++) {
			if (isSet(dedomena.kafenioDel) &&
				(('_' + kafenio[i].k) in dedomena.kafenioDel)) {
				continue;
			}

			if (isSet(dedomena.kafenioMod) &&
				(('_' + kafenio[i].k) in dedomena.kafenioMod)) {
				kafenio1[kafenio1.length] = dedomena.kafenioMod['_' + kafenio[i].k];
				continue;
			}

			kafenio1[kafenio1.length] = kafenio[i];
		}

		// Αν έχει επιστραφεί array "kafenioNew", τότε πρόκειται για νέες
		// εγγραφές τις οποίες θα εμφανίσω τελευταίες.
		if (isSet(dedomena.kafenioNew)) {
			for (var i = 0; i < dedomena.kafenioNew.length; i++) {
				kafenio1[kafenio1.length] = dedomena.kafenioNew[i];
			}
		}

		kafenio = kafenio1;
		delete kafenio1;
		Kafenio.updateHTML();
	};

	this.updateHTML = function() {
		var x = getelid('sizitisiKafenio');
		if (notSet(x)) { return; }

		var html = '';
		if (isSet(kafenio)) {
			for (var i = 0; i < kafenio.length; i++) {
				html += Kafenio.HTML(i);
			}
		}
		x.innerHTML = html;
	};

	this.HTML = function(i) {
		var html = '';
		html += '<div class="sizitisiLine">';
		html += '<div id="sk_' + kafenio[i].k + '">';
		html += kafenio[i].p + ': ' + kafenio[i].s;
		html += '</div>'

		return html;
	};
};
