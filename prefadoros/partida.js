var Partida = new function() {
	this.html = '';

	// Έχουμε πάντα επιστροφή πεδίο "partida" το οποίο είναι
	// είτε "same", εφόσον δεν παρουσιάστηκαν μεταβολές στα
	// στοιχεία της παρτίδας, είτε είναι το νέο object της
	// παρτίδας, ακόμη και αν αυτό είναι κενό.

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.pardtida) || (dedomena.partida === 'same')) {
			return;
		}

		partida = dedomena.partida;
		Partida.html = 'Δεν υφίσταται παρτίδα';
		if (!isPartida()) {
			return;
		}

		Partida.html = '<div class="partida';
		if (!partida.t) { Partida.html += ' partidaTheatis'; }
		Partida.html += '">' + 'ΠΑΡΤΙΔΑ ' + partida.k + ', ' +
			partida.t + ', ΘΕΣΗ ' + partida.h + '</div>';
	};

	this.noPartida = function() {
		Partida.html = '<div class="partida">';
		Partida.html += '<div class="partidaMinima" style="margin-top: 1.8cm;">';
		Partida.html += '<div style="padding: 0.6cm;">' + Tools.xromataHTML('1.2cm') + '</div>';
		Partida.html += Tools.miaPrefaHTML();
		Partida.html += '<div style="width: 80%; margin-left: auto; ' +
			'margin-right: auto; margin-top: 0.6cm;">';
		Partida.html += 'Μπορείτε να παραγγείλετε μια πρέφα ' +
			'και μετά να καλέσετε τους φίλους σας στο τραπέζι. ' +
			'Καλή διασκέδαση!';
		Partida.html += '</div>';
		Partida.html += '</div>';
		Partida.html += '</div>';
	};

	this.neaPartida = function() {
		mainFyi('νέα παρτίδα: δεν έχει γίνει ακόμη');
	};
};

Partida.noPartida();
