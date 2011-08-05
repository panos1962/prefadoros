var Sizitisi = new function() {
	// Η μέθοδος "processDedomena" καλείται κατά την επιστροφή δεδομένων
	// και σκοπό έχει τον έλεγχο της συζήτησης τραπεζιού και την επαναδιαμόρφωση
	// του σχετικού εδαφίου της οθόνης. Ως μοναδική παράμετρο δέχεται τα
	// δεδομένα που επετράφησαν από τον server.

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.sizitisi) && notSet(dedomena.sizitisiNew)) {
			return;
		}

		if (isSet(dedomena.sizitisi)) {
			sizitisi = dedomena.sizitisi;
			Sizitisi.updateHTML();
			return;
		}

		// Δεν έχει επιστραφεί πεδίο "sizitisi", οπότε πιθανόν να έχει επιστραφεί
		// πεδίο "sizitisiNew", που περιέχει νέα σχόλια.
		if (isSet(dedomena.sizitisiNew)) {
			for (var i = 0; i < dedomena.sizitisiNew.length; i++) {
				sizitisi[sizitisi.length] = dedomena.sizitisiNew[i];
			}
		}
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
		html += '<div class="sizitisiSxolio">';
		html += sizitisi[i].p;
		html += ': ' + sizitisi[i].s;
		html += '</div>'

		return html;
	};
};
