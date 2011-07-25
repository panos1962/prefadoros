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
		Partida.html = '<div class="partida"></div>';
	};
};

Partida.noPartida();
