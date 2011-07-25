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
		var xroma = ['S', 'D', 'C', 'H'];
		var rank = ['7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
		for (var i = 0; i < 4; i++) {
			Partida.html += '<div style="margin-top: 0.84cm;">';
			for (var j = 0; j < 8; j++) {
				Partida.html += '<img src="' + globals.server +
					'images/trapoula/' + xroma[i] + rank[j] +
					'.png" style="margin-left: 0.08cm; width: 1.6cm;" alt ="" />';
			}
			Partida.html += '<div>';
		}
		Partida.html += '</div>';
	};
};

Partida.noPartida();
