var data = {
	sxesi:		{		// χαρακτηριστικά αναζήτησης παικτών
		spat:	'',		// pattern αναζήτησης παικτών
		skat:	'',		// κατάσταση (online, available)
		sxet:	true		// μόνο σχετιζόμενοι παίκτες
	},
	apopio:		{		// κωδικοί τελευταίας λήψης
		prosklisi:	0,
		sxesi:		0,
		permes:		0,
		dianomi:	0,
		kinisi:		0,
		sizitisi:	0,
		trapezi:	0
	}
};
var prosklisi = [];	// οι προσκλήσεις που αφορούν στον χρήστη
var sxesi = [];		// οι σχετιζόμενοι και οι αναζητούμενοι
var permes = [];	// τα PMs του χρήστη
var partida = {};	// το τραπέζι στο οποίο συμμετέχει ο παίκτης
var dianomi = [];	// οι διανομές του τραπεζιού
var kinisi = [];	// οι κινήσεις της διανομής
var sizitisi = [];	// τα σχόλια του τραπεζιού
var trapezi = [];	// τα ενεργά τραπέζια
var rebelos = [];	// περιφερόμενοι παίκτες
var forum = [];		// η δημόσια συζήτηση

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
	setTimeout(testConnect, 10);
	setTimeout(neaDedomena, 100);
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

function neaDedomena() {
	var req = new Request('prefadoros/dedomena');
	req.xhr.onreadystatechange = function() {
		neaDedomenaCheck(req);
	};

	var params = 'login=' + uri(pektis.login);
	for (var i in data.apopio) {
		params += '&' + i + '=' + data.apopio[i];
	}

	if (data.sxesi.spat != '') {
		params += '&spat=' + uri(data.sxesi.pattern);
	}

	if (data.sxesi.skat != '') {
		params += '&skat=' + data.sxesi.katastasi;
	}

	if (data.sxesi.sxet) {
		params += '&sxet=yes';
	}

	req.send(params);
}

function neaDedomenaCheck(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	rsp = req.getResponse();
	if (!rsp.match(/@OK$/)) {
		alert('Παρελήφθησαν λανθασμένα δεδομένα (' + rsp + ')');
		return;
	}

	rsp = rsp.replace(/@OK$/, '');
	try {
		var dedomena = eval('({' + rsp + '})');
	} catch(e) {
		mainFyi(rsp + ': λανθασμένα δεδομένα (' + e + ')');
		return;
	}

mainFyi(dedomena.data.prosklisi + '@@@@@@' + dedomena.data.pektis);
data.apopio.prosklisi++;
	setTimeout(neaDedomena, 100);
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

function infoStripShow(div) {
	if (div.innerHTML != '') {
		div.innerHTML = '';
		div.style.cursor = 'pointer';
		return;
	}

prefadoros.pmList = [
	"asdasdasd",
	"JGAJGAJSAGJSGAJ",
	"asdasd asdasd"
];
	if (notSet(prefadoros.pmList) || (prefadoros.pmList.length < 1)) {
		mesg = 'Δεν υπάρχουν νέα μηνύματα';
		var mrq1 = '';
		var mrq2 = '';
	}
	else {
		div.style.cursor = 'crosshair';
		mrq1 = '<marquee loop=10000 behavior=slide scrollamount=6>';
		mrq2 = '</marquee>';
		var mesg = '';
		for (var i = 0; i < prefadoros.pmList.length; i++) {
			mesg += '<span class="info' + (i % 2) + '">' +
				prefadoros.pmList[i] + '</span>';
		}
	}

	div.innerHTML = '<div class="infoData">' + mrq1 + mesg + mrq2 + '</div>';
}
