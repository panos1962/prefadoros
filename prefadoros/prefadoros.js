var sinedria = {};	// η συνεδρία που αφορά στην επίσκεψη του παίκτη
var sxesi = [];		// οι σχετιζόμενοι και οι αναζητούμενοι
var permes = [];	// τα PMs του χρήστη
var prosklisi = [];	// οι προσκλήσεις που αφορούν στον χρήστη
var partida = {};	// το τραπέζι στο οποίο συμμετέχει ο παίκτης
var dianomi = [];	// οι διανομές του τραπεζιού
var kinisi = [];	// οι κινήσεις της διανομής
var sizitisi = [];	// τα σχόλια του τραπεζιού
var trapezi = [];	// τα ενεργά τραπέζια
var rebelos = [];	// περιφερόμενοι παίκτες
var forum = [];		// η δημόσια συζήτηση

window.onload = function() {
	init();
	emoticons.display();
DUMPRSP.open();
	setTimeout(function() { neaDedomena(true); }, 100);
setTimeout(showKafenio, 500);
};

window.onunload = function() {
	try { controlPanel.funchatClose(); } catch(e) {};
	try { DUMPRSP.close(); } catch(e) {};
};

function testConnect() {
	var req = new Request('prefadoros/testConnect');
	req.xhr.onreadystatechange = function() {
		testConnectCheck(req);
	};

	req.send();
}

function testConnectCheck(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	rsp = req.getResponse();
	mainFyi(rsp);
	setTimeout(testConnect, 1000);
}

function neaDedomena(freska) {
	if (notSet(freska)) {
		freska = false;
	}

	var req = new Request('prefadoros/neaDedomena');
	req.xhr.onreadystatechange = function() {
		neaDedomenaCheck(req);
	};

	var params = 'login=' + pektis.login;

	sinedria.id++;
	params += '&sinedria=' + sinedria.kodikos;
	params += '&id=' + sinedria.id;

	if (freska) {
		params += '&freska=yes';
	}

	req.send(params);
}

var DUMPRSP = new function() {
	var wdump = null;

	this.open = function(rsp) {
		if (notSet(wdump)) {
			wdump = window.open(globals.server +
				'lib/dumprsp.php', '_blank',
				'location=1,status=1,titlebar=1,menubar=1,scrollbars=1,' +
				'resizable=1,width=600,height=500,left=200,top=100');
			if (notSet(wdump)) {
				mainFyi('DUMPRSP: cannot open window');
				return;
			}
		}
	};

	this.dump = function(rsp) {
		if (notSet(wdump)) { return; }

		try {
			var p = wdump.document.createElement('div');
			var d = new Date;
			var html = strTime(d, true) +
				' [' + d.getMilliseconds() + ']<br />' + rsp + '<hr />';
			p.innerHTML = html;

			var eod = wdump.document.getElementById('EOD');
			if (isSet(eod)) {
				wdump.document.body.insertBefore(p, eod);
				scrollBottom(wdump.document.body);
			}
		} catch(e) {};
	};

	this.close = function() {
		if (isSet(wdump)) {
			wdump.close();
		}
		DUMPRSP.reset();
	};

	this.reset = function() {
		wdump = null;
	};
};

function neaDedomenaCheck(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	var tic = 100;
	rsp = req.getResponse();
DUMPRSP.dump(rsp);
	try {
		var dedomena = eval('({' + rsp + '})');
	} catch(e) {
		monitor.lathos();
		mainFyi(rsp + ': λανθασμένα δεδομένα (' + e + ')');
		setTimeout(function() { neaDedomena(); }, tic);
		return;
	}

	if ((dedomena.sinedria.k < sinedria.kodikos) || (dedomena.sinedria.i < sinedria.id)) {
		monitor.ignore();
		return;
	}

	if (isSet(dedomena.sinedria.same)) {
		monitor.idia();
	}
	else {
		monitor.freska();
		Sxesi.processDedomena(dedomena);
		Permes.processDedomena(dedomena);
	}

	setTimeout(function() { neaDedomena(); }, tic);
}

function showKafenio() {
	var x = getelid('prefadoros');
	if (notSet(x)) { return; }

	pektes = [
		"panos",
		"maria",
		"zoi",
		"akis",
		"nikos",
		"makis"
	];

	trapezia = [
		"asdjasd",
		"askdhasjkdhad asd",
		"sdasd asd",
		"asjdgghasdhjgj",
		"sd sdfsdf",
		"asdjasd",
		"askdhasjkdhad asd",
		"sdasd asd",
		"asjdgghasdhjgj",
		"sd sdfsdf"
	];

	var html = '<div class="kafenio">';

	if (isSet(pektes) && (pektes.length > 0)) {
		html += '<div class="kafenioRebels">';
		for (var i = 0; i < pektes.length; i++) {
			html += kafenio.rebelosHTML(pektes[i]);
		}
		html += '</div>';
	}

	for (var i = 0; i < trapezia.length; i++) {
		html += kafenio.trapeziHTML(trapezia[i]);
	}

	html += '</div>';
	x.innerHTML = html;
}

var monitor = new function() {
	this.count = 0
	this.errorCount = 0;
	this.successiveErrors = 0;
	this.dotsHTML = '';

	this.updateHTML = function(title, color) {
		var x = getelid('monitorArea');
		if (notSet(x)) { return; }

		monitor.count++;
		if ((monitor.count % 10) == 1) { monitor.dotsHTML = ''; }
		monitor.dotsHTML = '<span totle="' + title + '" style="color: ' +
			color + ';">&bull;</span>' + monitor.dotsHTML;

		var html = '<span title="Συνεδρία" class="monitorSinedria">' +
			sinedria.kodikos + '</span>';
		html += '#<span title="Ενημέρωση" class="monitorId">' + sinedria.id + '</span>';
		if (monitor.errorCount) {
			html += '#<span title="Λανθασμένες ενημερώσεις" style="color: ' +
				globals.color.error + ';">' + monitor.errorCount + '</span>';
		}
		x.innerHTML =  monitor.dotsHTML + html;
	};

	this.ignore = function() {
		monitor.successiveErrors = 0;
		monitor.updateHTML('Αγνοήθηκαν δεδομένα', '#FFA500');
	};

	this.idia = function() {
		monitor.successiveErrors = 0;
		monitor.updateHTML('Χωρίς αλλαγή', '#85A366');
	};

	this.freska = function() {
		monitor.successiveErrors = 0;
		monitor.updateHTML('Νέα δεδομένα', '#006600');
	};

	this.lathos = function() {
		monitor.errorCount++;
		monitor.successiveErrors++;
		if (monitor.successiveErrors > 3) {
			monitor.successiveErrors = 0;
			alert('too many successive errors');
			location.href = globals.server + 'error.php?minima=' +
				uri('Παρουσιάστηκαν πολλά διαδοχικά σφάλματα ενημέρωσης');
			return;
		}

		monitor.updateHTML('Λανθασμένα δεδομένα', globals.color.error);
	};
};
