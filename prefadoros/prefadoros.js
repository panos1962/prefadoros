var enimerosi = {
	id:	0,	// id ενημέρωσης
	sxesi:		{		// χαρακτηριστικά αναζήτησης παικτών
		spat:	'',		// pattern αναζήτησης παικτών
		skat:	'',		// κατάσταση (all, online, available)
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

var Sxesi = new function() {
	this.updateHTML = function(sxesi) {
		var x = getelid('sxesiArea');
		if (notSet(x)) { return; }

		var html = '';
		for (var i = 0; i < sxesi.length; i++) {
			html += Sxesi.HTML(sxesi, i);
		}
		x.innerHTML = html;
	};

	this.HTML = function(sxesi, i) {
		html = '<div class="sxesiLine zebra' + (i % 2) + '"' +
			emfanesAfanesHTML(this) + '>';
		html += '<div class="sxesiData">' +
			sxesi[i].n + '</div>&nbsp;[<div class="sxesiData sxesi';
		switch (sxesi[i].s) {
		case 'ΦΙΛΟΣ':		html += 'Filos'; break;
		case 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ':	html += 'Apoklismenos'; break;
		default:		html += 'Asxetos'; break;
		}
		html += '">' + sxesi[i].l + '</div>]</div>';
		return html;
	};

}

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
	setTimeout(testConnect, 10);
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

	var req = new Request('prefadoros/dedomena');
	req.xhr.onreadystatechange = function() {
		neaDedomenaCheck(req);
	};

	enimerosi.id++;
	var params = 'login=' + uri(pektis.login) + '&id=' + enimerosi.id;
	if (freska) {
		params += '&freska=yes';
	}

	for (var i in enimerosi.apopio) {
		params += '&' + i + '=' + enimerosi.apopio[i];
	}

	if (enimerosi.sxesi.spat != '') {
		params += '&spat=' + uri(enimerosi.sxesi.pattern);
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
		mainFyi('Παρελήφθησαν λανθασμένα δεδομένα (' + rsp + ')');
		setTimeout(function() { neaDedomena(); }, 100);
		return;
	}

	rsp = rsp.replace(/@OK$/, '');
	try {
		var dedomena = eval('({' + rsp + '})');
	} catch(e) {
		monitor.lathos();
		mainFyi(rsp + ': λανθασμένα δεδομένα (' + e + ')');
alert(rsp + ': λανθασμένα δεδομένα (' + e + ')');
		setTimeout(function() { neaDedomena(); }, 100);
		return;
	}

	if (dedomena.data.id < enimerosi.id) {
		monitor.ignore();
		return;
	}

	if (isSet(dedomena.data.same)) {
		monitor.idia();
	}
	else {
		monitor.freska();
	}
mainFyi('@@@@@@' + dedomena.data.id);

	if (dedomena.sxesi !== 'same') {
		Sxesi.updateHTML(dedomena.sxesi);
	}

/*
	if (dedomena.trapezi !== 'same') {
		Trapezi.updateHTML(dedomena.sxesi);
	}
*/

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

function infoStripShow(div) {
	if (div.innerHTML != '') {
		div.innerHTML = '';
		div.style.cursor = 'pointer';
		return;
	}

permes = [
	"asdasdasd",
	"JGAJGAJSAGJSGAJ",
	"asdasd asdasd"
];
	if (notSet(permes) || (permes.length < 1)) {
		mesg = 'Δεν υπάρχουν νέα μηνύματα';
		var mrq1 = '';
		var mrq2 = '';
	}
	else {
		div.style.cursor = 'crosshair';
		mrq1 = '<marquee loop=10000 behavior=slide scrollamount=6>';
		mrq2 = '</marquee>';
		var mesg = '';
		for (var i = 0; i < permes.length; i++) {
			mesg += '<span class="info' + (i % 2) + '">' +
				permes[i] + '</span>';
		}
	}

	div.innerHTML = '<div class="infoData">' + mrq1 + mesg + mrq2 + '</div>';
}
