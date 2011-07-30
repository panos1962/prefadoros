var Partida = new function() {
	this.html = '';

	// Έχουμε πάντα επιστροφή πεδίο "partida" το οποίο είναι
	// είτε "same", εφόσον δεν παρουσιάστηκαν μεταβολές στα
	// στοιχεία της παρτίδας, είτε είναι το νέο object της
	// παρτίδας, ακόμη και αν αυτό είναι κενό.

	this.processDedomena = function(dedomena) {
		if (notSet(dedomena.partida)) {
			return;
		}

		partida = dedomena.partida;
		if (notPartida()) {
			Partida.noPartida();
			return;
		}

		Partida.html = '<div class="partida';
		if (partida.t) { Partida.html += ' partidaTheatis'; }
		Partida.html += '">' + 'ΠΑΡΤΙΔΑ ' + partida.k +
			', ΘΕΣΗ ' + partida.h + '</div>';
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

	this.neoTrapezi = function() {
		if (isPartida()) { return; }

		var ico = getelid('controlPanelIcon');
		if (notSet(ico)) { return; }
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/neoTrapezi');
		req.xhr.onreadystatechange = function() {
			Partida.neoTrapeziCheck(req, ico);
		};

		req.send();
	};

	this.neoTrapeziCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		ico.src = globals.server + 'images/controlPanel/4Balls.png';
		if (rsp) {
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.neaPartida = function() {
		mainFyi('νέα παρτίδα: δεν έχει γίνει ακόμη');
	};
};

Partida.noPartida();
