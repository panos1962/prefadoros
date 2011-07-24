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
var lastData = false;	// το timestamp της τελευταίας επιστροφής

window.onload = function() {
	init();
	emoticons.display();
	motdSetup();
	diafimisiSetup();
	if (sinedria.dumprsp) { dumprsp.open(); }
	setTimeout(function() { neaDedomena(true); }, 100);
	setTimeout(checkAlive, 700);
	setTimeout(showKafenio, 500);
};

window.onunload = function() {
	try { controlPanel.funchatClose(); } catch(e) {};
	try { dumprsp.close(); } catch(e) {};
};

function checkAlive() {
	var tora = currentTimestamp();
	if ((lastData > 0) && ((tora - lastData) > xronos.dedomena.namax)) {
		monitor.lathos();
		mainFyi('regular polling cycle recycled');
		setTimeout(function() { neaDedomena(true); }, 100);
	}
	setTimeout(checkAlive, 1000);
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

function neaDedomenaCheck(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	var tic = 100;
	rsp = req.getResponse();
	dumprsp.dump(rsp);
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

	lastData = currentTimestamp();
	if (isSet(dedomena.sinedria.same)) {
		monitor.idia();
		setTimeout(function() { neaDedomena(); }, tic);
		return;
	}

	monitor.freska();
	Partida.processDedomena(dedomena);
	Sxesi.processDedomena(dedomena);
	Permes.processDedomena(dedomena);

	setTimeout(function() { neaDedomena(); }, tic);
}

function showPartida() {
	var x = getelid('prefadoros');
	if (notSet(x)) { return false; }

	x.innerHTML = 'ΠΑΡΤΙΔΑ';

	x = getelid('partidaKafenio');
	if (notSet(x)) {return false; }

	x.innerHTML = '[&nbsp;<a href="#" onclick="return showKafenio();" ' +
		'class="data" title ="Εμφάνιση τραπεζιού">Καφενείο</a>&nbsp;]';
	return false;
}

function showKafenio() {
	var x = getelid('prefadoros');
	if (notSet(x)) { return false; }

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

	x = getelid('partidaKafenio');
	if (notSet(x)) {return false; }

	x.innerHTML = '[&nbsp;<a href="#" onclick="return showPartida();" ' +
		'class="data" title="Εμφάνιση καφενείου">Τραπέζι</a>&nbsp;]';
	return false;
}

function motdSetup() {
	setTimeout(function() {
		var x = getelid('motd');
		if (notSet(x)) { return; }
		if (isSet(x.pineza) && x.pineza) {return; }
		sviseNode(x, 1200);
	}, globals.duration.motd);
}

function diafimisiSetup() {
	setTimeout(function() {
		var x = getelid('diafimisi');
		if (notSet(x)) { return; }
		if (isSet(x.pineza) && x.pineza) {return; }
		sviseNode(x, 1200);
	}, globals.duration.diafimisi);
}
