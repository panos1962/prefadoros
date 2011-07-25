var Partida = new function() {
	this.html = '';

	this.processDedomena = function(dedomena) {
		if (dedomena.partida === 'same') { return false; }
		partida = dedomena.partida;
		Partida.html = '';
		if (!isPartida()) { return true; };

		Partida.html = '<div class="partida';
		if (!partida.t) { Partida.html += ' partidaTheatis'; }
		Partida.html += '">' + 'ΠΑΡΤΙΔΑ ' + partida.k + ', ' +
			partida.t + ', ΘΕΣΗ ' + partida.h + '</div>';
		return true;
	};
};
