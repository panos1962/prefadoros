var Kafenio = new function() {
	// Η μέθοδος "processDedomena" καλείται κατά την επιστροφή δεδομένων
	// και σκοπό έχει τον έλεγχο της συζήτησης καφενείου και την επαναδιαμόρφωση
	// του σχετικού εδαφίου της οθόνης. Ως μοναδική παράμετρο δέχεται τα
	// δεδομένα που επετράφησαν από τον server.

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.kafenio) && notSet(dedomena.kafenioNew)) {
			return;
		}

		if (isSet(dedomena.kafenio)) {
			kafenio = dedomena.kafenio;
			Kafenio.updateHTML();
			return;
		}

		// Δεν έχει επιστραφεί πεδίο "kafenio", οπότε πιθανόν να έχει επιστραφεί
		// πεδίο "kafenioNew", που περιέχει νέα σχόλια.
		if (isSet(dedomena.kafenioNew)) {
			for (var i = 0; i < dedomena.kafenioNew.length; i++) {
				kafenio[kafenio.length] = dedomena.kafenioNew[i];
			}
		}
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
		html += '<div class="kafenioSxolio">';
		html += kafenio[i].p;
		html += ': ' + kafenio[i].s;
		html += '</div>'

		return html;
	};
};
