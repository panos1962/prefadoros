var Dedomena = new function() {
	var lastDataTS = 0;
	var sessionAliveTS = 0;

	this.setup = function() {
		sessionAliveTS = (lastDataTS = currentTimestamp());
		setTimeout(function() { Dedomena.neaDedomena(true); }, 200);
		setTimeout(Dedomena.checkAlive, 1000);
	}

	this.schedule = function(freska) {
		if (notSet(freska)) { freska = false; }
		setTimeout(function() { Dedomena.neaDedomena(freska); }, 100);
	};

	// Η μέθοδος "keepAlive" τρέχει σε τακτά χρονικά διαστήματα και ελέγχει
	// αν η επικοινωνία μας με τον server είναι ζωντανή. Πράγματι, κάθε φορά
	// που επιστρέφονται δεδομένα από τον server καρατάμε το χρόνο στη
	// μεταβλητή "lastDataTS" (σε milliseconds). Η "keepAlive" ελέγχει αν
	// ο χρόνος που έχει παρέλθει από την τελευταία παραλαβή, έχει υπερβεί
	// τον μέγιστο επιτρεπτό χρόνο απραξίας ("xronos.dedomena.namax"), και
	// αν όντως έχει συμβεί αυτό, επαναδρομολογεί νέο αίτημα ενημέρωσης.
	// Παράλληλα, ανανεώνεται το session, καθώς μπορεί ο χρήστης μπορεί
	// να μην έχει επικοινωνία με τον server για μεγάλα χρονικά διαστήματα,
	// με αποτέλεσμα να απενεργοποιείται το session, εφόσον τα αιτήματα
	// ενημέρωσης λειτουργούν εκτός session.

	this.checkAlive = function() {
		var tora = currentTimestamp();
		var elapsed = tora - lastDataTS;
		if (elapsed > xronos.dedomena.namax) {
			monitor.lathos();
			mainFyi('regular polling cycle recycled');
			Dedomena.schedule(true);
		}
		var epomeno = xronos.dedomena.namax - elapsed;
		if (epomeno < 1000) { epomeno = 1000 }
		setTimeout(Dedomena.checkAlive, epomeno);

		// Κάθε 5 λεπτά, ανανεώνουμε το session.
		if ((tora - sessionAliveTS) > 300000) {
			Dedomena.sessionAlive();
			sessionAliveTS = tora;
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
			params += '&freska=yes';
		}

		req.send(params);
	};

	this.neaDedomenaCheck = function(req) {
		if (req.xhr.readyState != 4) { return; }
		rsp = req.getResponse();
		Dumprsp.dump(rsp);
		try {
			var dedomena = eval('({' + rsp + '})');
		} catch(e) {
			monitor.lathos();
			mainFyi(rsp + ': λανθασμένα δεδομένα (' + e + ')');
			Dedomena.schedule();
			return;
		}

		if ((dedomena.sinedria.k < sinedria.kodikos) ||
			(dedomena.sinedria.i < sinedria.id)) {
			monitor.ignore();
			return;
		}

		lastDataTS = currentTimestamp();
		if (isSet(dedomena.sinedria.same)) {
			monitor.idia();
			Dedomena.schedule();
			return;
		}

		monitor.freska();
alert(dedomena.sinedria.f);
		Partida.processDedomena(dedomena);
		Prosklisi.processDedomena(dedomena);
		Sxesi.processDedomena(dedomena);
		Permes.processDedomena(dedomena);
		Prefadoros.display();
		Dedomena.schedule();
	};

	this.sessionAlive = function() {
		var req = new Request('prefadoros/sessionAlive');
		req.send();
		mainFyi('session recharged');
	};
};
