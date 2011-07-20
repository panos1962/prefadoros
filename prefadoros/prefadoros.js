var enimerosi = {
	id:	0,	// id ενημέρωσης
	sxesi:	{			// χαρακτηριστικά αναζήτησης παικτών
		spat:	'',		// pattern αναζήτησης παικτών
		skat:	'',		// κατάσταση (all, online, available)
	}
};

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

var monitor = new function() {
	this.count = 0;
	this.errorCount = 0;
	this.successiveErrors = 0;

	this.updateCount = function() {
		monitor.count++;
		if ((monitor.count % 10) == 0) {
			getelid('monitorDots').innerHTML = '';
		}

		var html = monitor.count;
		if (monitor.errorCount) {
			html += ' <span style="color: ' +
				globals.color.error + ';">' +
				monitor.errorCount + '</span>';
		}

		getelid('monitorCount').innerHTML = html;
	};

	this.ignore = function() {
		monitor.successiveErrors = 0;
		monitor.updateCount();
		var x = getelid('monitorDots');
		var html = '<span style="color: #FFA500;">&bull;</span>' + x.innerHTML;
		x.innerHTML = html;
	};

	this.idia = function() {
		monitor.successiveErrors = 0;
		monitor.updateCount();
		var x = getelid('monitorDots');
		var html = '<span style="color: #85A366;">&bull;</span>' + x.innerHTML;
		x.innerHTML = html;
	};

	this.freska = function() {
		monitor.successiveErrors = 0;
		monitor.updateCount();
		var x = getelid('monitorDots');
		var html = '&bull;' + x.innerHTML;
		x.innerHTML = html;
	};

	this.lathos = function() {
		monitor.errorCount++;
		monitor.successiveErrors++;
		monitor.updateCount();
		var x = getelid('monitorDots');
		var html = '<span style="color: ' + globals.color.error +
			';">&bull;</span>' + x.innerHTML;
		x.innerHTML = html;
		if (monitor.successiveErrors > 3) {
			monitor.successiveErrors = 0;
			alert('too many successive errors');
			location.href = globals.server + 'error.php?minima=' +
				uri('Παρουσιάστηκαν πολλά διαδοχικά σφάλματα ενημέρωσης');
			return;
		}
	};
}

var kafenio = new function() {
	this.trapeziHTML = function(t) {
		var html = '<hr class="kafenioTrapeziLine" />';
		html += '<div class="kafenioTrapezi">';
		html += '<div class="kafenioTrapeziInfo">1282#30</div>';
		html += '<div class="kafenioPektis">panos</div>';
		html += '<div class="kafenioPektis">maria</div>';
		html += '<div class="kafenioPektis">zoi</div>';
		html += '</div>';
		return html;
	};

	this.rebelosHTML = function(t) {
		var html = '<div class="kafenioPektis">';
		html += t;
		html += '</div>';
		return html;
	};
}

window.onload = function() {
	init();
	emoticons.display();
	//setTimeout(testConnect, 10);
	setTimeout(function() { neaDedomena(true); }, 100);
//setTimeout(showKafenio, 1000);
}

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

	enimerosi.id++;
	var params = 'login=' + uri(pektis.login) + '&id=' + enimerosi.id;
	if (freska) {
		params += '&freska=yes';
	}

	if (enimerosi.sxesi.spat != '') {
		params += '&spat=' + uri(enimerosi.sxesi.spat);
	}
	if (enimerosi.sxesi.skat != '') {
		params += '&skat=' + enimerosi.sxesi.katastasi;
	}

	req.send(params);
}

function neaDedomenaCheck(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	rsp = req.getResponse();
	if (!rsp.match(/@OK$/)) {
		monitor.lathos();
//alert('Παρελήφθησαν λανθασμένα δεδομένα (' + rsp + ')');
		mainFyi('Παρελήφθησαν λανθασμένα δεδομένα (' + rsp + ')');
		setTimeout(function() { neaDedomena(); }, 100);
		return;
	}

	rsp = rsp.replace(/@OK$/, '');
//alert(rsp);
	try {
		var dedomena = eval('({' + rsp + '})');
	} catch(e) {
		monitor.lathos();
//alert(rsp + ': λανθασμένα δεδομένα (' + e + ')');
		mainFyi(rsp + ': λανθασμένα δεδομένα (' + e + ')');
		setTimeout(function() { neaDedomena(); }, 100);
		return;
	}

	if (dedomena.data.id < enimerosi.id) {
		monitor.ignore();
		return;
	}

mainFyi('@@@@@@' + dedomena.data.id);
	if (isSet(dedomena.data.same)) {
		monitor.idia();
	}
	else {
		monitor.freska();
		if (dedomena.sxesi !== 'same') {
			sxesi = dedomena.sxesi;
			Sxesi.updateHTML();
		}
		if (dedomena.permes !== 'same') {
			var neaPermes = false;
			if (isSet(dedomena.permesNew)) {
				neaPermes = true;
				for (var i = 0; i < dedomena.permesNew.length; i++) {
					permes[permes.length] = dedomena.permesNew[i];
				}
			}
			else {
				if (permes.length <= 0) {
					if (dedomena.permes.length > 0) {
						neaPermes = true;
					}
				}
				else if ((dedomena.permes.length > 0) &&
					(dedomena.permes[dedomena.permes.length - 1].k >
						permes[permes.length - 1].k)) {
						neaPermes = true;
				}
				permes = dedomena.permes;
			}

			var x = getelid('permesArea');
			if (isSet(x)) {Permes.stripShow(x, true); }
			x = getelid('permesLink');
			if (isSet(x) && isSet(x.style)) {
				if (neaPermes) {
					x.style.color = '#990000';
				}
				else if (permes.length <= 0) {
					x.style.color = '';
				}
			}
		}
	}

	setTimeout(function() { neaDedomena(); }, 100);
}

function showKafenio() {
	var x = getelid('prefadoros');
	if (notSet(x)) {
		return;
	}

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

window.onbeforeunload = function() {
	if (isSet(controlPanel)) {
		controlPanel.funchatClose();
	}
};
