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
	Emoticons.setup();
	motdSetup();
	diafimisiSetup();
	Dumprsp.setup();
	Dedomena.setup();
};

window.onunload = function() {
	try { controlPanel.funchatClose(); } catch(e) {};
	try { Dumprsp.close(); } catch(e) {};
};

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

function isPartida() {
	return(isSet(partida) && isSet(partida.k));
}

var Prefadoros = new function() {
	var show = null;

	this.display = function() {
		if (notSet(show)) {
			show = isPartida() ? 'partida' : 'kafenio';
		}

		if (show === 'partida') {
			Prefadoros.showPartida();
		}
		else {
			Prefadoros.showKafenio();
		}
	};

	this.showPartida = function() {
		show = 'partida';
		var x = getelid('prefadoros');
		if (notSet(x)) { return false; }

		x.style.overflowY = 'hidden';
		x.innerHTML = Partida.html;

		x = getelid('partidaKafenio');
		if (notSet(x)) {return false; }

		x.innerHTML = '[&nbsp;<a href="#" onclick="return Prefadoros.showKafenio();" ' +
			'class="data" title ="Εμφάνιση τραπεζιού">Καφενείο</a>&nbsp;]';
		return false;
	};

	this.showKafenio = function() {
		show = 'kafenio';
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
				html += Kafenio.rebelosHTML(pektes[i]);
			}
			html += '</div>';
		}

		for (var i = 0; i < trapezia.length; i++) {
			html += Kafenio.trapeziHTML(trapezia[i]);
		}

		html += '</div>';
		x.style.overflowY = 'auto';
		x.innerHTML = html;

		x = getelid('partidaKafenio');
		if (notSet(x)) {return false; }

		x.innerHTML = '[&nbsp;<a href="#" onclick="return Prefadoros.showPartida();" ' +
			'class="data" title="Εμφάνιση καφενείου">Τραπέζι</a>&nbsp;]';
		return false;
	};
}
