var Sizitisi = new function() {
	// Η μέθοδος "processDedomena" καλείται κατά την επιστροφή δεδομένων
	// και σκοπό έχει τον έλεγχο της συζήτησης του τραπεζιού και την επαναδιαμόρφωση
	// του σχετικού εδαφίου της οθόνης. Ως μοναδική παράμετρο δέχεται τα
	// δεδομένα που επεστράφησαν από τον server.

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.sizitisi) && notSet(dedomena.sizitisiNew) &&
			notSet(dedomena.sizitisiMod) && notSet(dedomena.sizitisiDel)) {
			return;
		}

		if (isSet(dedomena.sizitisi)) {
			sizitisi = dedomena.sizitisi;
			Sizitisi.updateHTML();
			return;
		}

		// Δεν έχει επιστραφεί πεδίο "sizitisi", οπότε πιθανόν να έχουν επιστραφεί
		// πεδία "sizitisiNew", "sizitisiMod" και "sizitisiDel" που περιέχουν νέα
		// σχόλια, τροποποιημένες εγγραφές και εγγραφές που πρέπει να
		// διαγραφούν αντίστοιχα. Κατασκευάζω, λοιπόν, νέο local array,
		// το αντιγράφω στο global array "sizitisi" και επαναδιαμορφώνω το
		// σχετικό εδάφιο της οθόνης.
		var sizitisi1 = [];

		// Διατρέχω το παλιό array "sizitisi" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν τροποποιηθεί ή διαγραφεί. Για τις εγγραφές
		// που εμφανίζονται να έχουν τροποποιηθεί (array "sizitisiMod") περνάω
		// στο νέο array τα νέα δεδομένα, ενώ τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί τις αγνοώ· τις υπόλοιπες εγγραφές απλώς τις
		// αντιγράφω στο νέο array.
		for (var i = 0; i < sizitisi.length; i++) {
			if (isSet(dedomena.sizitisiDel) &&
				(('_' + sizitisi[i].k) in dedomena.sizitisiDel)) {
				continue;
			}

			if (isSet(dedomena.sizitisiMod) &&
				(('_' + sizitisi[i].k) in dedomena.sizitisiMod)) {
				sizitisi1[sizitisi1.length] = dedomena.sizitisiMod['_' + sizitisi[i].k];
				continue;
			}

			sizitisi1[sizitisi1.length] = sizitisi[i];
		}

		// Αν έχει επιστραφεί array "sizitisiNew", τότε πρόκειται για νέες
		// εγγραφές τις οποίες θα εμφανίσω τελευταίες.
		if (isSet(dedomena.sizitisiNew)) {
			for (var i = 0; i < dedomena.sizitisiNew.length; i++) {
				sizitisi1[sizitisi1.length] = dedomena.sizitisiNew[i];
			}
		}

		sizitisi = sizitisi1;
		delete sizitisi1;
		Sizitisi.updateHTML();
	};

	this.updateHTML = function() {
		var x = getelid('sizitisiTrapezi');
		if (notSet(x)) { return; }

		var html = '';
		if (isSet(sizitisi)) {
			for (var i = 0; i < sizitisi.length; i++) {
				html += Sizitisi.HTML(i);
			}
		}
		x.innerHTML = html;
	};

	this.HTML = function(i) {
		var html = '';
		html += '<div class="sizitisiLine">';
		html += '<div id="st_' + sizitisi[i].k + '">';
		html += sizitisi[i].p + ': ' + sizitisi[i].s;
		html += '</div>'

		return html;
	};
};
