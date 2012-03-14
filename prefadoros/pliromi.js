// Οι πληρωμές γίνονται με βάση την παρακάτω λογική:
// 
// Οι κινήσεις που αφορούν στην κάσα γίνονται πάντα μόνο από τον τζογαδόρο για
// λόγους απλότητας, όπως, εξάλλου, συμβαίνει και με το κιτάπι της "ζωντανής"
// πρέφας, καθώς με τον τρόπο αυτό οι κινήσεις της κάσας γίνονται πάντα κατά το
// αντίτιμο 10 μπαζών. Όταν, λοιπόν, "βγει" η αγορά, αντί να πληρωθούν οι παίκτες
// (και ο τζογαδόρος) απευθείας τις μπάζες τους από την κάσα, ο τζογαδόρος "σηκώνει"
// το αντίτιμο των 10 μπαζών από την κάσα και πληρώνει στους αντιπάλους τις μπάζες
// που τους αναλογούν.
// 
// Όταν ο τζογαδόρος δεν καταφέρει να "βγάλει" την αγορά, τότε, έτσι κι αλλιώς,
// καταθέτει το αντίτιμο των 10 μπαζών στην κασά και πληρώνει από την τσέπη του
// τις μπάζες των αντιπάλων. Αν ένας ή και οι δύο συμπαίκτες μπουν μέσα, τότε οι
// μπάζες του τζογαδόρου και του παίκτη που έχει "βγει" πληρώνονται απευθείας από
// τον παίκτη που "μπήκε μέσα". Αν ο τζογαδόρος "βάλει μέσα" και τους δύο αντιπάλους,
// τότε πληρώνεται τις μπάζες του και από τους δύο αντιπάλους.
//
// Για την υλοποίηση των παραπάνω χρησιμοποιούνται μέθοδοι από την κλάση που
// ακολουθεί ("Pliromi"). Αφού γίνουν οι υπολογισμοί και ετοιμαστούν τα
// ποσά (arrays "kasa" και "kapikia"), καλείται η μέθοδος "kataxorisi" που
// εφαρμόζει τις κινήσεις στην database. Όλες οι πληρωμές καταγράφονται στο
// record της διανομής.

var Pliromi = new function() {
	this.setPrepiBazes = function() {
		pexnidi.prepiBazes = [ 0, 0, 0, 0 ];
		if (pexnidi.agoraBazes <= 0) { return; }

		switch (pexnidi.tzogadoros) {
		case 1: var ena = 2; var dio = 3; break;
		case 2: ena = 3; dio = 1; break;
		case 3: ena = 1; dio = 2; break;
		default: return;
		}

		if (pexnidi.simetoxi[ena] == 'ΠΑΣΟ') {
			if (pexnidi.simetoxi[dio] == 'ΠΑΣΟ') { return; }
			ena = dio;
			dio = 0;
		}
		else if (pexnidi.simetoxi[dio] == 'ΠΑΣΟ') { dio = 0; }

		switch (pexnidi.agoraBazes) {
		case 6:
			pexnidi.prepiBazes[ena] = 2;
			pexnidi.prepiBazes[dio] = 2;
			break;
		case 7:
			pexnidi.prepiBazes[ena] = 2;
			pexnidi.prepiBazes[dio] = 1;
			break;
		case 8:
			pexnidi.prepiBazes[ena] = 1;
			pexnidi.prepiBazes[dio] = 1;
			break;
		case 9:
			pexnidi.prepiBazes[ena] = 1;
			break;
		}
	};

	// Η μέθοδος "checkMesa" δέχεται ως παράμετρο τον κωδικό της
	// τελευταίας (τρέχουσας) κίνησης και ελέγχει αν κάποιος πάει
	// μέσα με μοναδικό σκοπό να βαρέσει τα κανόνια.
	this.checkMesa = function(kinisi) {
		var menoun = 10 - pexnidi.bazaCount;
		var dif = pexnidi.agoraBazes - (pexnidi.baza[pexnidi.tzogadoros] + menoun);
		if (dif > 0) {
			switch (dif) {
			case 1: var ixos = 'kanoni'; var spot = 'ta'; break;
			case 2: ixos = 'kanoni'; spot = 'ts'; break;
			default: ixos = 'tzamia'; spot = 'tt'; break;
			}
			Pexnidi.bamBoum(ixos, spot, kinisi);
			return;
		}

		var amina = 0;
		var prepi = 0;
		for (var i = 1; i <= 3; i++) {
			amina += pexnidi.baza[i];
			prepi += pexnidi.prepiBazes[i];
		}
		amina -= pexnidi.baza[pexnidi.tzogadoros];
		amina += menoun;
		dif = prepi - amina;

		if (dif > 0) {
			switch (dif) {
			case 1: ixos = 'balothia'; spot = 'aa'; break;
			case 2: ixos = 'pistolia'; spot = 'as'; break;
			default: ixos = 'balothia,polivolo:500,pistolia:2000'; spot = 'at'; break;
			}
			Pexnidi.bamBoum(ixos, spot, kinisi);
		}
	};

	// Η παρακάτω μέθοδος καλείται πριν από κάθε πληρωμή και σκοπό
	// έχει να "καθαρίσει" το τεφτέρι των υπολογισμών. Το τεφτέρι
	// αποτελείται από δύο arrays που δεικτοδοτούνται με τις θέσεις
	// των παικτών. Το πρώτο array ("kasa") αφορά στα ποσά που "σηκώνει"
	// ή καταθέτει ο τζογαδόρος στην κάσα και εφόσον κινηθεί περιέχει
	// πάντα μόνο ένα ποσό που αφορά στον τζογαδόρο. Εφόσον το ποσό
	// είναι θετικό, η αγορά έχει "βγει" και τα καπίκια αφαιρούνται
	// από την κάσα, ενώ αν είναι αρνητικό, σημαίνει ότι ο τζογαδόρος
	// "έβαλε μέσα" την αγορά και τα καπίκια προστίθενται στην κάσα.
	// Το δεύτερο array ("kapikia") περιέχει τα πάρε δώσε μεταξύ των
	// παικτών. Αν π.χ. ο παίκτης 1 πρέπει να δώσει 15 καπίκια στον
	// παίκτη 3, τότε αφαιρούμε 15 από τη θέση 1 και προσθέτουμε 15
	// στη θέση 3. Θα κλείσουμε με μερικά παραδείγματα:
	//
	// Ας υποθέσουμε ότι η αγορά ήταν 6 κούπες από τον παίκτη 2 και οι
	// παίκτες 3 και 1 έκαναν 1 και 3 μπάζες αντίστοιχα. Η κατάσταση
	// στο τεφτέρι θα διαμορφωθεί ως εξής:
	//
	//	kasa = [ null, 0, 30, 0 ]
	//	kapikia = [ null, 15, -20, 5 ]
	//
	// δηλαδή ο παίκτης 2 "σηκώνει" 30 καπίκια από την κάσα και πληρώνει
	// συνολικά 20 καπίκια στους άλλους δύο, 15 στον παίκτη 1 και 5 στον
	// παίκτη 3.
	//
	// Η αγορά ήταν 6 κούπες από τον παίκτη 3 και οι παίκτες 2 και 1
	// έκαναν 3 και 2 μπάζες αντίστοιχα:
	//
	//	kasa = [ null, 0, 0, -30 ]
	//	kapikia = [ null, 10, 15, -25 ]
	//
	// δηλαδή ο παίκτης 3 καταθέτει 30 καπίκια στην κάσα και πληρώνει
	// άλλα 25 καπίκια στους άλλους δύο, 10 καπίκια στον παίκτη 1 και
	// 15 καπίκια στον παίκτη 2.
	//
	// Η αγορά ήταν 6 κούπες από τον παίκτη 1 και οι παίκτες 2 και 3
	// έκαναν 1 και 2 μπάζες αντίστοιχα:
	//
	//	kasa = [ null, 0, 0, 0 ]
	//	kapikia = [ null, 35, -45, 10 ]
	//
	// δηλαδή δεν έχουμε καμία κίνηση στην κάσα, ενώ όλες οι μπάζες
	// πληρώνονται από τον παίκτη 2, ήτοι 7Χ5=35 καπίκια στον παίκτη 1
	// και 2Χ5=10 καπίκια στον παίκτη 3.
	//
	// Η μέθοδος "reset" υπολογίζει και την αξία των μπαζών σύμφωνα με
	// την αγορά που έχει γίνει, π.χ. 5 καπίκια για τις 6 κούπες, 8 καπίκια
	// για τα 7 αχρωμάτιστα κλπ.

	this.pliromi = function() {
		var errmsg = 'Pliromi::pliromi(): ';

		this.kasa = [ null, 0, 0, 0 ];
		this.kapikia = [ null, 0, 0, 0 ];
		this.taPoulia = [ null, 0, 0, 0 ];

		if (pexnidi.agora == 'NNN') {
			this.pasoPasoPaso();
			return;
		}

		if (pexnidi.agoraBazes < 7) {
			this.axiaTaPoulia = 25;
			this.axiaBazas = globals.rankXroma[pexnidi.agoraXroma];
			
		}
		else {
			this.axiaTaPoulia = 50;
			this.axiaBazas = pexnidi.agoraBazes;
			if ((pexnidi.agoraXroma == 'N') && (pexnidi.agoraBazes < 10)) {
				this.axiaBazas++;
			}
		}

		// Εφόσον το υπόλοιπο της κάσας επαρκεί, η αγορά πληρώνεται
		// κανονικά. Αν το υπόλοιπο της κάσας δεν επαρκεί, τότε για
		// μεν τις βγαλμένες αγορές η πληρωμή γίνεται με βάση το
		// υπόλοιπο της κάσας, για δε τις αγορές που είναι μέσα
		// η πληρωμή γίνεται κανονικά, με βάση την πραγματική αξία
		// της αγοράς.

		this.axiaBazasMesa = this.axiaBazas;
		if ((pexnidi.ipolipo > 0) && (this.axiaBazas > pexnidi.ipolipo)) {
			this.axiaBazas = pexnidi.ipolipo;
		}

		// Αν δεν μετράνε οι άσοι μηδενίζω την αξία των άσων.
		if (notAsoiKolos()) { this.axiaTaPoulia = 0; }

		// Πρέπει, οπωσδήποτε, να γνωρίζουμε ποιος από τους δύο αντιπάλους
		// είναι ο πρώτος μετά τον τζογαδόρο και ποιος ο δεύτερος. Αυτό
		// χρειάζεται στην περίπτωση των "μονών" αγορών, όπου ο πρώτος
		// παίκτης μετά τον τζογαδόρο έχει αυξημένες "υποχρεώσεις".
		// Θυμίζω ότι οι παίκτες αριθμούνται δεξιόστροφα 1, 2, 3 έχοντας
		// στην οθόνη τον παίκτη 1 στην κάτω θέση, τον παίκτη 2 επάνω δεξιά
		// και τον παίκτη 3 επάνω αριστερά.

		switch (pexnidi.tzogadoros) {
		case 1:
			this.protos = 2
			this.defteros = 3;
			break;
		case 2:
			this.protos = 3;
			this.defteros = 1;
			break;
		case 3:
			this.protos = 1;
			this.defteros = 2;
			break;
		default:
			mainFyi(errmsg + 'ακαθόριστη θέση τζογαδόρου');
			return;
		}

		if (pexnidi.simetoxi[this.protos] == 'ΠΑΣΟ') {
			this.protos = this.defteros;
			this.defteros = null;
			if (pexnidi.simetoxi[this.protos] == 'ΠΑΣΟ') {
				this.protos = null;
				Pliromi.partaOla();
				return;
			}
		}

		this.pliromiBazon();
	};

	// Η παρακάτω μέθοδος καλείται κατά τη φάση των δηλώσεων συμετοχής
	// τη στιγμή που και ο δεύτερος παίκτης δηλώνει πάσο. Πράγματι, σε
	// αυτήν την περίπτωση γίνεται νέα διανομή χωρίς να περάσουμε από
	// την κλασική διαδικασία του κλεισίματος της τελευαταίας μπάζας,
	// εφόσον δεν θα παιχτεί το παιχνίδι. Ο τζογαδόρος "σηκώνει" όλο
	// το ποσό από την κάσα και δεν πληρώνει κανέναν.
	
	this.partaOla = function() {
		this.kasa[pexnidi.tzogadoros] = 10 * this.axiaBazas;
		this.pareTaPoulia();
		this.kataxorisi();
	};

	this.pasoPasoPaso = function() {
		var minBazes = 10;
		for (var i = 1; i <= 3; i++) {
			if (pexnidi.baza[i] < minBazes) { minBazes = pexnidi.baza[i]; }
		}

		for (i = 1; i <= 3; i++) {
			this.kasa[i] = (minBazes - pexnidi.baza[i]) * 10;
		}

		this.kataxorisi();
	}

	this.pliromiBazon = function() {
		if (pexnidi.baza[pexnidi.tzogadoros] < pexnidi.agoraBazes) {
			this.mesaTzogadoros();
		}
		else if (this.isPexanOloi()) {
			this.pareTaPoulia();
			if (pexnidi.baza[pexnidi.tzogadoros] > pexnidi.agoraBazes) {
				this.mesaPektes();
			}
			else {
				this.vgikanOloi();
			}
		}
		else {
			this.pareTaPoulia();
			this.epexeEnas();
		}
		this.kataxorisi();
	}

	this.mesaTzogadoros = function() {
		// Αν ο τζογαδόρος "μπήκε μέσα" παραπάνω από 1 μπάζα, τότε
		// θα τα πληρώσει όλα διπλά (σόλο).
		if (pexnidi.agoraBazes - pexnidi.baza[pexnidi.tzogadoros] > 1) {
			this.axiaBazasMesa *= 2;
			this.doseTaPoulia(2);
		}
		else {
			this.doseTaPoulia(1);
		}

		this.kasa[pexnidi.tzogadoros] -= 10 * this.axiaBazasMesa;
		for (var i = 1; i <= 3; i++) {
			if (i != pexnidi.tzogadoros) {
				var poso = pexnidi.baza[i] * this.axiaBazasMesa;
				this.kapikia[pexnidi.tzogadoros] -= poso;
				this.kapikia[i] += poso;
			}
		}
	};

	// Αν έχουν παίξει όλοι και ένας ή και οι δύο αντίπαλοι "μπήκαν μέσα",
	// τότε οι πληρωμές γίνονται από τον παίκτη ή τους παίκτες που "μπήκαν
	// μέσα".

	this.mesaPektes = function() {
		var errmsg = 'Pliromi::mesaPektes(): ';

		switch (pexnidi.agoraBazes) {
		case 6: this.mesa6(this.protos, this.defteros); break;
		case 7: this.mesa7(this.protos, this.defteros); break;
		case 8: this.mesa8(this.protos, this.defteros); break;
		case 9: this.mesa9(this.protos); break;
		default:
			mainFyi(errmsg + 'λάθος αριθμός μπαζών τζογαδόρου');
			return;
		}
	};

	this.mesa9 = function(pektis) {
		var poso = 10 * this.axiaBazasMesa;
		this.kapikia[pektis] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;
	};

	this.mesa8 = function(protos, defteros) {
		switch (pexnidi.baza[pexnidi.tzogadoros]) {
		case 9:
			switch (pexnidi.baza[protos]) {
			case 0: this.mesa8_9_0_1(protos, defteros); break;
			case 1: this.mesa8_9_1_0(protos, defteros); break;
			}
			break;
		case 10:
			var poso = 10 * this.axiaBazasMesa;
			this.kapikia[protos] -= poso;
			this.kapikia[pexnidi.tzogadoros] += poso;

			this.kapikia[defteros] -= poso;
			this.kapikia[pexnidi.tzogadoros] += poso;
			break;
		}
	};

	this.mesa8_9_0_1 = function(protos, defteros) {
		var poso = 9 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 1 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[defteros] += poso;
	};

	this.mesa8_9_1_0 = function(protos, defteros) {
		var poso = 9 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 1 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[protos] += poso;
	};

	this.mesa7 = function(protos, defteros) {
		switch (pexnidi.baza[pexnidi.tzogadoros]) {
		case 8:
			switch (pexnidi.baza[protos]) {
			case 0: this.mesa7_8_0_2(protos, defteros); break;
			case 1: this.mesa7_8_1_1(protos, defteros); break;
			case 2: this.mesa7_8_2_0(protos, defteros); break;
			}
			break;
		case 9:
			switch (pexnidi.baza[protos]) {
			case 0: this.mesa7_9_0_1(protos, defteros); break;
			case 1: this.mesa7_9_1_0(protos, defteros); break;
			}
			break;
		case 10:
			var poso = 10 * this.axiaBazasMesa;
			this.kapikia[defteros] -= poso;
			this.kapikia[pexnidi.tzogadoros] += poso;

			poso *= 2;
			this.kapikia[protos] -= poso;
			this.kapikia[pexnidi.tzogadoros] += poso;
			break;
		}
	};

	this.mesa7_8_0_2 = function(protos, defteros) {
		var poso = 8 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 2 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[defteros] += poso;
	};

	this.mesa7_8_1_1 = function(protos, defteros) {
		var poso = 8 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 1 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[defteros] += poso;
	};

	this.mesa7_8_2_0 = function(protos, defteros) {
		var poso = 8 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 2 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[protos] += poso;
	};

	this.mesa7_9_0_1 = function(protos, defteros) {
		var poso = (9 * this.axiaBazasMesa) * 2;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		var poso = 1 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[defteros] += poso;
	};

	this.mesa7_9_1_0 = function(protos, defteros) {
		var poso = 9 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;
	};

	this.mesa6 = function(protos, defteros) {
		switch (pexnidi.baza[pexnidi.tzogadoros]) {
		case 7:
			switch (pexnidi.baza[protos]) {
			case 0: this.mesa6_7_0_3(protos, defteros); break;
			case 1: this.mesa6_7_1_2(protos, defteros); break;
			case 2: this.mesa6_7_2_1(protos, defteros); break;
			case 3: this.mesa6_7_3_0(protos, defteros); break;
			}
			break;
		case 8:
			switch (pexnidi.baza[protos]) {
			case 0: this.mesa6_8_0_2(protos, defteros); break;
			case 1: this.mesa6_8_1_1(protos, defteros); break;
			case 2: this.mesa6_8_2_0(protos, defteros); break;
			}
			break;
		case 9:
			switch (pexnidi.baza[protos]) {
			case 0: this.mesa6_9_0_1(protos, defteros); break;
			case 1: this.mesa6_9_1_0(protos, defteros); break;
			}
			break;
		case 10:
			var poso = (10 * this.axiaBazasMesa) * 2;
			this.kapikia[protos] -= poso;
			this.kapikia[pexnidi.tzogadoros] += poso;

			this.kapikia[defteros] -= poso;
			this.kapikia[pexnidi.tzogadoros] += poso;
			break;
		}
	};

	this.mesa6_7_0_3 = function(protos, defteros) {
		var poso = 7 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 3 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[defteros] += poso;
	};

	this.mesa6_7_1_2 = function(protos, defteros) {
		var poso = 7 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 2 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[defteros] += poso;
	};

	this.mesa6_7_2_1 = function(protos, defteros) {
		var poso = 7 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 2 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[protos] += poso;
	};

	this.mesa6_7_3_0 = function(protos, defteros) {
		var poso = 7 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 3 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[protos] += poso;
	};

	this.mesa6_8_0_2 = function(protos, defteros) {
		var poso = (8 * this.axiaBazasMesa) * 2;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		// Εδώ υπάρχει ένσταση για το αν ο συμπαίκτης θα
		// πληρωθεί σόλο. Διαφωνώ!
		poso = 2 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[defteros] += poso;
	};

	this.mesa6_8_1_1 = function(protos, defteros) {
		var poso = 8 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;
	};

	this.mesa6_8_2_0 = function(protos, defteros) {
		var poso = (8 * this.axiaBazasMesa) * 2;
		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso = 2 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[protos] += poso;
	};

	this.mesa6_9_0_1 = function(protos, defteros) {
		var poso = 9 * this.axiaBazasMesa;
		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso *= 2;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;
	};

	this.mesa6_9_1_0 = function(protos, defteros) {
		var poso = 9 * this.axiaBazasMesa;
		this.kapikia[protos] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;

		poso *= 2;
		this.kapikia[defteros] -= poso;
		this.kapikia[pexnidi.tzogadoros] += poso;
	};

	// Στη μέθοδο που ακολουθεί η αγορά έχει βγει κανονικά και
	// πληρώνονται όλοι από την κάσα. Ο τζογαδόρος "σηκώνει"
	// όλο το ποσό από την κάσα και πληρώνει στους αντιπάλους
	// τις μπάζες τους.

	this.vgikanOloi = function() {
		this.kasa[pexnidi.tzogadoros] += this.axiaBazas * 10;
		for (var i = 1; i <= 3; i++) {
			if (i != pexnidi.tzogadoros) {
				poso = pexnidi.baza[i] * this.axiaBazas;
				this.kapikia[pexnidi.tzogadoros] -= poso;
				this.kapikia[i] += poso;
			}
		}
	};

	this.epexeEnas = function() {
		// Αρχικά εντοπίζω τον παίκτη που έπαιξε.
		for (var i = 1; i <= 3; i++) {
			if ((i != pexnidi.tzogadoros) &&
				(pexnidi.simetoxi[i] != 'ΠΑΣΟ')) {
				var pektis = i;
				break;
			}
		}

		switch (pexnidi.agoraBazes) {
		case 6:
			switch (pexnidi.baza[pektis]) {
			case 0:
				var poso = (10 * this.axiaBazasMesa) * 2;
				this.kapikia[pexnidi.tzogadoros] +=  poso;
				this.kapikia[pektis] -=  poso;
				break;
			case 1:
				poso = 9 * this.axiaBazasMesa;
				this.kapikia[pexnidi.tzogadoros] +=  poso;
				this.kapikia[pektis] -=  poso;
				break;
			case 2:
			case 3:
			case 4:
				this.kasa[pexnidi.tzogadoros] += 10 * this.axiaBazas;
				poso = pexnidi.baza[pektis] * this.axiaBazas;
				this.kapikia[pexnidi.tzogadoros] -=  poso;
				this.kapikia[pektis] +=  poso;
				break;
			}
			break;
		case 7:
			switch (pexnidi.baza[pektis]) {
			case 0:
				poso = (10 * this.axiaBazasMesa) * 2;
				this.kapikia[pexnidi.tzogadoros] +=  poso;
				this.kapikia[pektis] -=  poso;
				break;
			case 1:
				poso = 9 * this.axiaBazasMesa;
				this.kapikia[pexnidi.tzogadoros] +=  poso;
				this.kapikia[pektis] -=  poso;
				break;
			case 2:
			case 3:
				this.kasa[pexnidi.tzogadoros] += 10 * this.axiaBazas;
				poso = pexnidi.baza[pektis] * this.axiaBazas;
				this.kapikia[pexnidi.tzogadoros] -=  poso;
				this.kapikia[pektis] +=  poso;
				break;
			}
			break;
		case 8:
			switch (pexnidi.baza[pektis]) {
			case 0:
				poso = 10 * this.axiaBazasMesa;
				this.kapikia[pexnidi.tzogadoros] +=  poso;
				this.kapikia[pektis] -=  poso;
				break;
			case 1:
			case 2:
				this.kasa[pexnidi.tzogadoros] += 10 * this.axiaBazas;
				poso = pexnidi.baza[pektis] * this.axiaBazas;
				this.kapikia[pexnidi.tzogadoros] -=  poso;
				this.kapikia[pektis] +=  poso;
				break;
			}
			break;
		case 9:
			switch (pexnidi.baza[pektis]) {
			case 0:
				poso = 10 * this.axiaBazasMesa;
				this.kapikia[pexnidi.tzogadoros] +=  poso;
				this.kapikia[pektis] -=  poso;
				break;
			case 1:
				this.kasa[pexnidi.tzogadoros] += 10 * this.axiaBazas;
				poso = 1 * this.axiaBazas;
				this.kapikia[pexnidi.tzogadoros] -=  poso;
				this.kapikia[pektis] +=  poso;
				break;
			}
			break;
		case 10:
			this.kasa[pexnidi.tzogadoros] += 10 * this.axiaBazas;
			break;
		}
	};

	this.kataxorisi = function() {
		this.fixMazi();
		this.fixTaPoulia();
		var data = '';
		for (var i = 1; i <= 3; i++) {
			data += ':' + this.kasa[partida.pam[i]] +
				':' + this.kapikia[partida.pam[i]];
		}

		Pexnidi.addKinisi('ΠΛΗΡΩΜΗ', data);
	};

	// Η μέθοδος "fixMazi" καλείται ακριβώς πριν την καταχώρηση των
	// ποσών και έχει να κάνει με το αν ένας από τους δύο αντιπάλους
	// έχει "πάρει" τον άλλον. Σε αυτήν την περίπτωση όποιο ποσό
	// έχει προκύψει για τον βοηθητικό παίκτη μεταφέρεται στον
	// βασικό πρωταγωνιστή.

	this.fixMazi = function() {
		var errmsg = 'Pliromi::fixMazi(): ';
		var mazi = null;
		var alos = null;

		for (var i = 1; i <= 3; i++) {
			if (i == pexnidi.tzogadoros) { continue; }
			else if (pexnidi.simetoxi[i] == 'ΜΑΖΙ') { mazi = i; }
			else { alos = i; }
		}

		if (isSet(mazi) && isSet(alos)) {
			this.kapikia[mazi] += this.kapikia[alos];
			this.kapikia[alos] = 0;
		}
	};

	this.fixTaPoulia = function() {
		if (pexnidi.asoi) {
			for (var i = 1; i <= 3; i++) {
				this.kapikia[i] += this.taPoulia[i];
			}
		}
	};

	this.pareTaPoulia = function() {
		for (var i = 1; i <= 3; i++) {
			if (i == pexnidi.tzogadoros) {
				this.taPoulia[i] += 2 * this.axiaTaPoulia;
			}
			else {
				this.taPoulia[i] -= this.axiaTaPoulia;
			}
		}
	};

	this.doseTaPoulia = function(aplaSolo) {
		aplaSolo = 1;	// μάλλον αυτό είναι το σωστό.
		for (var i = 1; i <= 3; i++) {
			if (i == pexnidi.tzogadoros) {
				this.taPoulia[i] -= aplaSolo * 2 * this.axiaTaPoulia;
			}
			else {
				this.taPoulia[i] += aplaSolo * this.axiaTaPoulia;
			}
		}
	};

	// Η μέθοδος "isPexanOloi" απαντά στο ερώτημα αν έπαιξαν όλοι ή αν
	// ένας ή δύο από τους αντιπάλους δήλωσαν πάσο στη συμμετοχή και
	// παρέμειναν πάσο (δεν τους "πήρε" ο άλλος).

	this.isPexanOloi = function() {
		for (var i = 1; i <= 3; i++) {
			if ((i != pexnidi.tzogadoros) &&
				(pexnidi.simetoxi[i] == 'ΠΑΣΟ')) {
				return false;
			}
		}

		return true;
	};
}
