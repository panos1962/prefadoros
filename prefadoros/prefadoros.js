var trapezi = null;	// το τραπέζι στο οποίο συμμετέχει ο παίκτης
var dianomi = null;	// οι διανομές του τραπεζιού
var kinisi = null;	// οι κινήσεις της διανομής
var sizitisi = null;	// τα σχόλια του τραπεζιού
var trapezia = null;	// τα ενεργά τραπέζια
var rebels = null;	// περιφερόμενοι παίκτες
var forum = null;	// η δημόσια συζήτηση

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

	this.rebelHTML = function(t) {
		var html = '<div class="kafenioPektis">';
		html += t;
		html += '</div>';
		return html;
	};
}

window.onload = function() {
	init();
	emoticons.display();
setTimeout(showKafenio, 1000);
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
			html += kafenio.rebelHTML(pektes[i]);
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

function neaDedomena() {
	var req = new Request('lib/neaDedomena');
	req.xhr.onreadystatechange = function() {
		neaDedomenaCheck(req);
	};

	req.send();
}

function neaDedomenaCheck(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	rsp = req.setResponse();
	if (rsp) {
		alert(rsp);
	}
	getelid('info').innerHTML += '<br />@' + parseInt((new Date).getTime() / 1000) + '@';
	setTimeout(neaDedomena, 100);
}

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
