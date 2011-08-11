// Όλη η διαδικασία του παιχνιδιού κυριαρχείται από τα αντικείμενα "pexnidi",
// "dianomi" και "kinisi".

var Pexnidi = new function() {
	// Η function "setData" καλείται κάθε φορά που έχουμε νέα δεδομένα
	// και σκοπό έχει να θέσει τα στοιχεία του παιχνιδιού στα νέα
	// δεδομένα.

	this.setData = function() {
		pexnidi.kasa = 0;
		pexnidi.ipolipo = 0;
		pexnidi.pektis = [ '', '', '', '' ];
		pexnidi.kapikia = [ 0, 0, 0, 0 ];
		if (notPartida()) { return;}

		for (var i = 1; i <= 3; i++) {
			pexnidi.pektis[i] = eval('partida.p' + i);
		}

		pexnidi.kasa = partida.s;
		pexnidi.ipolipo = 30 * pexnidi.kasa;
		for (var i = 0; i < dianomi.length; i++) {
			pexnidi.ipolipo -= dianomi[i].k1;
			pexnidi.ipolipo -= dianomi[i].k2;
			pexnidi.ipolipo -= dianomi[i].k3;
		}

		pexnidi.ipolipo = parseInt(pexnidi.ipolipo / 10);
	};
}
