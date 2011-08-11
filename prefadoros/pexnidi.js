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
		pexnidi.elima = 0;
		pexnidi.dealer = 0;
		if (notPartida()) { return;}

		for (var i = 1; i <= 3; i++) {
			pexnidi.pektis[i] = eval('partida.p' + i);
			pexnidi.kapikia[i] = -(partida.s * 10);
		}

		pexnidi.ipolipo = 30 * partida.s;
		for (var i = 0; i < dianomi.length; i++) {
			pexnidi.dealer = dianomi[i].dealer;
			for (var j = 1; j <= 3; j++) {
				pexnidi.ipolipo -= eval('dianomi[i].k' + j);
				pexnidi.kapikia[j] += eval('dianomi[i].m' + j);
				pexnidi.kapikia[j] += eval('dianomi[i].k' + j);
			}
		}

		// Τα καπίκια κάθε παίκτη πρέπει να ισούνται με το
		// αλγεβρικό άθροισμα των καπικιών των άλλων δύο παικτών.
		// Υπάρχει περίπτωση αυτά να μην διαιρούνται ακριβώς με
		// το 3, επομένως μπορεί να δημιουργηθεί κάποιο έλλειμμα
		// ενός καπικίου. Αν θέλω μπορώ αργότερα να το τυπώσω.
		// Για να βλέπουν όλοι οι παίκτες τα ίδια καπίκια αποφασίζω
		// να «πειράξω» μόνο τα καπίκια του παίκτη που βρίσκεται
		// στην πραγματική πρώτη θέση του τραπεζιού. Με βάση τη
		// θέση στην οποία αντιστοιχεί ο παίκτης που εμφανίζεται
		// στο νότο (θέση 1 στον client) ονοματίζω τους παίκτες
		// με τις πραγματικές τους θέσεις στο τραπέζι και πειράζω
		// τον παίκτη στην πραγματική θέση ένα.

		switch (mapThesi(1)) {
		case 2:	// είμαι στη θέση 2, άρα ο 1 βρίσκεται στη δύση (3)
			ena = 3;
			dio = 1;
			tria = 2;
			break;
		case 3:	// είμαι στη θέση 3, άρα ο 1 βρίσκεται στην ανατολή (2)
			ena = 2;
			dio = 3;
			tria = 1;
			break;
		default:
			ena = 1;
			dio = 2;
			tria = 3;
			break;
		}

		var x = pexnidi.ipolipo / 3;
		pexnidi.ipolipo = parseInt(pexnidi.ipolipo / 10);

		pexnidi.kapikia[ena] = parseInt(pexnidi.kapikia[ena] + x);
		pexnidi.kapikia[dio] = parseInt(pexnidi.kapikia[dio] + x);
		pexnidi.kapikia[tria] = parseInt(pexnidi.kapikia[tria] + x);

		var x = pexnidi.kapikia[dio] + pexnidi.kapikia[tria];
		pexnidi.elima = pexnidi.kapikia[ena] + x;

		// Θέτω τα καπίκα του πρώτου παίκτη να ισούνται με το
		// αλγεβρικό άθροισμα των άλλων δύο.
		pexnidi.kapikia[ena] = -x;
	};
}
