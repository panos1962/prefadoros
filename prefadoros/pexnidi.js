// Όλη η διαδικασία του παιχνιδιού κυριαρχείται από τα αντικείμενα "pexnidi",
// "dianomi" και "kinisi".

var Pexnidi = new function() {
	// Η function "setData" καλείται κάθε φορά που έχουμε νέα δεδομένα
	// και σκοπό έχει να θέσει τα στοιχεία του παιχνιδιού στα νέα
	// δεδομένα.

	this.setData = function() {
		pexnidi.ipolipo = 0;
		pexnidi.pektis = [ '', '', '', '' ];
		pexnidi.kapikia = [ 0, 0, 0, 0 ];
		pexnidi.fila = [ [], [], [], [] ];
		pexnidi.elima = 0;
		pexnidi.dealer = 0;
		if (notPartida()) { return;}

		switch (partida.h) {
		case 1:
			var map = [ 0, 1, 2, 3 ];
			var pam = [ 0, 1, 2, 3 ];
			break;
		case 2:
			map = [ 0, 2, 3, 1 ];
			pam = [ 0, 3, 1, 2 ];
			break;
		case 3:
			map = [ 0, 3, 1, 2 ];
			pam = [ 0, 2, 3, 1 ];
			break;
		default:
			alert('pexnidi.setData: λάθος θέση παίκτη');
			map = [ 0, 1, 2, 3 ];
			pam = [ 0, 1, 2, 3 ];
			break;
		}

		Pexnidi.dianomiMap(map, pam);
		Pexnidi.kinisiMap(map, pam);

		pexnidi.kasa = partida.s;
		for (var i = 1; i <= 3; i++) {
			pexnidi.pektis[i] = eval('partida.p' + i);
			pexnidi.kapikia[i] = -(pexnidi.kasa * 10);
		}

		pexnidi.ipolipo = 30 * pexnidi.kasa;
		for (var i = 0; i < dianomi.length; i++) {
			pexnidi.dealer = dianomi[i].dealer;
			for (var j = 1; j <= 3; j++) {
				pexnidi.ipolipo -= dianomi[i].kasa[j];
				pexnidi.kapikia[j] += dianomi[i].kasa[j];
				pexnidi.kapikia[j] += dianomi[i].kapikia[j];
			}
		}

		var x = pexnidi.ipolipo / 3;
		pexnidi.ipolipo = parseInt(pexnidi.ipolipo / 10);

		for (var i = 1; i <= 3; i++) {
			pexnidi.kapikia[i] = parseInt(pexnidi.kapikia[i] + x);
		}

		var x = pexnidi.kapikia[pam[2]] + pexnidi.kapikia[pam[3]];
		pexnidi.elima = pexnidi.kapikia[pam[1]] + x;
		pexnidi.kapikia[pam[1]] = -x;
	};

	this.dianomiMap = function(map, pam) {
		for (var i = 0; i < dianomi.length; i++) {
			dianomi[i].dealer = pam[dianomi[i].d];
			dianomi[i].kasa = [ 0,
				eval('dianomi[' + i + '].k' + map[1]),
				eval('dianomi[' + i + '].k' + map[2]),
				eval('dianomi[' + i + '].k' + map[3])
			];
			dianomi[i].kapikia = [ 0,
				eval('dianomi[' + i + '].m' + map[1]),
				eval('dianomi[' + i + '].m' + map[2]),
				eval('dianomi[' + i + '].m' + map[3])
			];
		}
	};

	this.kinisiMap = function(map, pam) {
		for (var i = 0; i < kinisi.length; i++) {
			kinisi[i].pektis = pam[kinisi[i].p];
			if (kinisi[i].i == 'ΔΙΑΝΟΜΗ') {
				var x = kinisi[i].d.split(':');
				for (var j = 1; j <= 3; j++) {
					pexnidi.fila[j] = Pexnidi.spaseFila(x[map[j]]);
				}
			}
		}
	};

	this.spaseFila = function(s) {
		var fila = [];
		if (notSet(s) || (s.length < 2)) { return fila; }

		var alif = [];

		var pikes = 0;
		var kara = 0;
		var spathia = 0;
		var koupes = 0;

		var n = parseInt(s.length / 2)
		for (var i = 0; i < n; i++) {
			var l = i * 2;
			alif[i] = s.substring(l, l + 2);
			if (alif[i].match(/^S/)) { pikes++; }
			else if (alif[i].match(/^D/)) { kara++; }
			else if (alif[i].match(/^C/)) { spathia++; }
			else if (alif[i].match(/^H/)) { koupes++; }
		}

		if (pikes > 0) {
			if (spathia == 0) { var sira = [ 'D', 'S', 'H' ]; }
			else if (kara > 0) { sira = [ 'S', 'D', 'C', 'H' ]; }
			else { sira = [ 'S', 'H', 'C' ]; }
		}
		else if (spathia > 0) { var sira = [ 'D', 'C', 'H' ]; }
		else { var sira = [ 'D', 'H' ]; }

		var idx = 0;

		for (var i = 0; i < sira.length; i++) {
			for (var j = 0; j < alif.length; j++) {
				if (alif[j].match('^' + sira[i])) {
					fila[idx++] = alif[j];
				}
			}
		}

		var more = false;
		do {
			more = false;
			for (var i = 1; i < fila.length; i++) {
				if (fila[i].substr(0, 1) == fila[i - 1].substr(0, 1)) {
					var f1 = fila[i - 1].substr(1, 1);
					var f2 = fila[i].substr(1, 1);
					if (globals.rankFila[f1] > globals.rankFila[f2]) {
						var t = fila[i];
						fila[i] = fila[i - 1];
						fila[i - 1] = t;
						more = true;
					}
				}
			}
		} while (more);

		return fila;
	};
}
