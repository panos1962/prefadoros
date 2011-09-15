var Dedomena = new function() {
	var lastDataTS = 0;
	var sessionAliveTS = 0;
	var galleryPhotoTS = 0;
	var polivoloTS1 = 0;
	var polivolo1 = 0;
	var polivoloTS2 = 0;
	var polivolo2 = 0;
	var reschedule = true;

	this.kafenioApo = 0;

	this.setup = function() {
		lastDataTS = currentTimestamp();
		sessionAliveTS = lastDataTS;
		galleryPhotoTS = lastDataTS;
		setTimeout(function() { Dedomena.neaDedomena(true); }, 200);
		setTimeout(Dedomena.checkAlive, 5000);
		Dedomena.kafenioApo = 0;
	};

	this.schedule = function(freska) {
		if (!reschedule) { return; }
		if (notSet(freska)) { freska = false; }
		// setTimeout(function() { Dedomena.neaDedomena(freska); }, 1000);
		setTimeout(function() { Dedomena.neaDedomena(freska); }, 500);
	};

	// Η μέθοδος "keepAlive" τρέχει σε τακτά χρονικά διαστήματα και ελέγχει
	// αν η επικοινωνία μας με τον server είναι ζωντανή. Πράγματι, κάθε φορά
	// που επιστρέφονται δεδομένα από τον server κρατάμε το χρόνο στη
	// μεταβλητή "lastDataTS" (σε milliseconds). Η "keepAlive" ελέγχει αν
	// ο χρόνος που έχει παρέλθει από την τελευταία παραλαβή, έχει υπερβεί
	// τον μέγιστο επιτρεπτό χρόνο απραξίας ("parameters.noAnswerMax"), και
	// αν όντως έχει συμβεί αυτό, επαναδρομολογεί νέο αίτημα ενημέρωσης.
	// Παράλληλα, ανανεώνεται το session, καθώς μπορεί ο χρήστης μπορεί
	// να μην έχει επικοινωνία με τον server για μεγάλα χρονικά διαστήματα,
	// με αποτέλεσμα να απενεργοποιείται το session, εφόσον τα αιτήματα
	// ενημέρωσης λειτουργούν εκτός session.

	this.checkAlive = function() {
		var tora = currentTimestamp();
		var elapsed = tora - lastDataTS;
		if (elapsed > parameters.noAnswerMax) {
			monitor.lathos();
			mainFyi('regular polling cycle recycled');
			Dedomena.schedule(true);
		}
		var epomeno = parameters.noAnswerMax - elapsed;
		if (epomeno < 1000) { epomeno = 1000 }
		setTimeout(Dedomena.checkAlive, epomeno);

		// Κάθε 5 λεπτά, ανανεώνουμε το session.
		if ((tora - sessionAliveTS) > 300000) {
			Dedomena.sessionAlive();
			sessionAliveTS = tora;
		}

		// Κάθε 10 δευτερόλεπτα, ανανεώνουμε τη φωτογραφία
		// του καφενείου. Ο χρόνος δεν είναι ασφαλής, καθώς
		// ο κύκλος ελέγχου μπορεί να είναι μεγαλύτερος.
		if ((tora - galleryPhotoTS) > 10000) {
			Trapezi.randomPhoto();
			galleryPhotoTS = tora;
		}
	};

	this.neaDedomena = function(freska) {
		if (notSet(freska)) { freska = false; }
		var req = new Request('prefadoros/neaDedomena');
		req.xhr.onreadystatechange = function() {
			Dedomena.neaDedomenaCheck(req);
		};

		var params = 'login=' + pektis.login;

		sinedria.id++;
		params += '&sinedria=' + sinedria.kodikos;
		params += '&id=' + sinedria.id;

		if (freska) {
			Dedomena.kafenioApo = 0;
			params += '&freska=yes';
		}

		if (notSet(Dedomena.kafenioApo)) { Dedomena.kafenioApo = 0; }
		params += '&kafenioApo=' + uri(Dedomena.kafenioApo);

		req.send(params);
	};

	var refreshErrorCount = 0;

	this.neaDedomenaCheck = function(req) {
		if (req.xhr.readyState != 4) { return; }
		rsp = req.getResponse();
		Dumprsp.dump(rsp);
		try {
			var dedomena = eval('({' + rsp + '})');
			if (notSet(dedomena.sinedria) || isSet(dedomena.sinedria.fatalError)) {
				reschedule = false;
				mainFyi(dedomena.sinedria.fatalError, -1);
				playSound('beep');
				return;
			}
		} catch(e) {
			monitor.lathos();
			Dumprsp.lathos();

			// Κατά την έξοδο, ή κατά το refresh παραλαμβάνονται ελλιπή
			// δεδομένα. Αυτά δεν πρέπει να τα δείξω στον παίκτη, εκτός
			// και αν επεναληφθούν.
			var refreshError = (rsp == 'prefadoros/neaDedomena (status = 0)');
			if (!refreshError) { var showError = true; }
			else if (refreshErrorCount++ > 0) { showError = true; }
			else { showError = false; }

			if (showError) {
				mainFyi(rsp + ': λανθασμένα δεδομένα (' + e + ')');
			}
			Dedomena.schedule(true);
			return;
		}

		if ((dedomena.sinedria.k < sinedria.kodikos) ||
			(dedomena.sinedria.i < sinedria.id)) {
			monitor.ignore();
			Dumprsp.ignore();
			return;
		}

		var tora = currentTimestamp();
		lastDataTS = tora;

		if (polivoloTS1 == 0) {
			polivoloTS1 = tora;
		}
		else if ((tora - polivoloTS1) < parameters.xronosPolivolo1) {
			if (polivolo1++ > parameters.maxPolivolo1) {
				if (!confirm('ΠΡΟΣΟΧΗ: επαναλαμβανόμενες κλήσεις. ' +
					'Να συνεχίσω τις προσπάθειες;')) {
					location.href = globals.server + 'error.php?minima=' +
						uri('Επαναλαμβανόμενες κλήσεις!');
					return;
				}
				polivoloTS1 = currentTimestamp();
				polivolo1 = 0;
				
			}
		}
		else {
			polivoloTS1 = tora;
			polivolo1 = 0;
		}

		if (polivoloTS2 == 0) {
			polivoloTS2 = tora;
		}
		else if ((tora - polivoloTS2) < parameters.xronosPolivolo2) {
			if (polivolo2++ > parameters.maxPolivolo2) {
				if (!confirm('ΠΡΟΣΟΧΗ: επαναλαμβανόμενες κλήσεις σε ευρύτερο ' +
					'διάστημα. Να συνεχίσω τις προσπάθειες;')) {
					location.href = globals.server + 'error.php?minima=' +
						uri('Επαναλαμβανόμενες κλήσεις σε ευρύτερο διάστημα!');
					return;
				}
				polivoloTS2 = currentTimestamp();
				polivolo2 = 0;
				
			}
		}
		else {
			polivoloTS2 = tora;
			polivolo2 = 0;
		}

		if (isSet(dedomena) && isSet(dedomena.sinedria)) {
			pektis.kapikia = (!(isSet(dedomena.sinedria.p) && (dedomena.sinedria.p == 0)));
			pektis.available = (!(isSet(dedomena.sinedria.b) && (dedomena.sinedria.b == 0)));
		}

		if (isSet(dedomena.sinedria.s)) {
			monitor.idia();
			Dedomena.schedule();
			return;
		}

		if (!Dedomena.checkPartidaPektis(dedomena)) {
			monitor.lathos();
			Dedomena.schedule(true);
			return;
		}

		monitor.freska();
		Partida.processDedomena(dedomena);
		Dianomi.processDedomena(dedomena);
		Kinisi.processDedomena(dedomena);
		Prosklisi.processDedomena(dedomena);
		Sxesi.processDedomena(dedomena);
		Permes.processDedomena(dedomena);
		Rebelos.processDedomena(dedomena);
		Trapezi.processDedomena(dedomena);
		Sizitisi.processDedomena(dedomena);
		Kafenio.processDedomena(dedomena);

		Pexnidi.processDedomena();
		Partida.updateHTML();
		Trapezi.updateHTML();
		Prefadoros.display();

		Pexnidi.processFasi();
		Dedomena.schedule();
	};

	this.checkPartidaPektis = function(dedomena) {
		if (notSet(dedomena.partida)) { return true; }
		if (notSet(dedomena.partida.k)) { return true; }
		if (notPektis()) {
			mainFyi('Επεστράφη παρτίδα, ενώ ο παίκτης είναι ακαθόριστος');
			return false;
		}

		// Αν ο παίκτης συμμετέχει ως θεατής, τότε δεν πειράζει
		// τυχόν λάθος θέση.
		if (isSet(dedomena.partida.t) && (dedomena.partida.t != 0)) {
			return true;
		}

		if (notSet(dedomena.partida.h) ||
			(eval('dedomena.partida.p' + dedomena.partida.h) != pektis.login)) {
			mainFyi('Ο παίκτης δεν βρίσκεται στην πρώτη θέση');
			return false;
		}

		return true;
	};

	this.sessionAlive = function() {
		var req = new Request('prefadoros/sessionAlive');
		req.send();
		mainFyi('session recharged');
	};
};

function isFreska(dedomena) {
	return(isSet(dedomena) && isSet(dedomena.sinedria) &&
		isSet(dedomena.sinedria.f) && (dedomena.sinedria.f == 1));
}

function notFreska(dedomena) {
	return(!isFreska(dedomena));
}
