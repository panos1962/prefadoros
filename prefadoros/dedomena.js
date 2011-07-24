var Dedomena = new function() {
	var lastDataTS = 0;
	var sessionAliveTS = 0;

	this.setup = function() {
		setTimeout(function() {
			Dedomena.neaDedomena(true);
		}, 200);
		setTimeout(Dedomena.checkAlive, 700);
		sessionAliveTS = currentTimestamp();
	}

	this.schedule = function(freska) {
		if (notSet(freska)) { freska = false; }
		setTimeout(function() { Dedomena.neaDedomena(freska); }, 100);
	};

	this.checkAlive = function() {
		var tora = currentTimestamp();
		if ((lastDataTS > 0) && ((tora - lastDataTS) > xronos.dedomena.namax)) {
			monitor.lathos();
			mainFyi('regular polling cycle recycled');
			Dedomena.schedule(true);
		}
		setTimeout(Dedomena.checkAlive, 1000);

		if ((sessionAliveTS > 0) && ((tora - sessionAliveTS) > 300)) {
			Dedomena.sessionAlive();
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

		if ((dedomena.sinedria.k < sinedria.kodikos) || (dedomena.sinedria.i < sinedria.id)) {
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
		Partida.processDedomena(dedomena);
		Sxesi.processDedomena(dedomena);
		Permes.processDedomena(dedomena);
		Dedomena.schedule();
	};

	this.sessionAlive = function() {
		var req = new Request('prefadoros/sessionAlive');
		req.send();
	};
};
