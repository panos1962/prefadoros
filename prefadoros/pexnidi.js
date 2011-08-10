// Όλη η διαδικασία του παιχνιδιού κυριαρχείται από τα αντικείμενα "pexnidi",
// "dianomi" και "kinisi".

var Pexnidi = new function() {

dianomi = [ true ];
dianomi = [];
pexnidi.kapikia = [ 0, 111, -21, -90 ];
pexnidi.kapikia = [ 0, 0, 0, 0 ];

	// Η function "setPartida" καλείται κάθε φορά που έχουμε αλλαγή δεδομένων
	// παρτίδας και σκοπό έχει να θέσει τα στοιχεία του παιχνιδιού στα νέα
	// δεδομένα.

	this.setPartida = function() {
		pexnidi.kasa = 0;
		pexnidi.ipolipo = 0;
		pexnidi.pektis = [ '', '', '', '' ];
		pexnidi.kapikia = [ 0, 0, 0, 0 ];
		if (notPartida()) { return;}

		pexnidi.kasa = partida.s;
		pexnidi.ipolipo = 30 * pexnidi.kasa;
		for (var i = 1; i <= 3; i++) {
			pexnidi.pektis[i] = eval('partida.p' + i);
		}
	};
}
