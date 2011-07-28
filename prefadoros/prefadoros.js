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
		controlPanel.display();
	};

	this.showPartida = function() {
		show = 'partida';
		var x = getelid('prefadoros');
		if (notSet(x)) { return false; }

		x.style.overflowY = 'hidden';
		x.innerHTML = Partida.html;

		x = getelid('partidaKafenio');
		if (isSet(x)) {
			x.innerHTML = '[&nbsp;<a href="#" ' +
				'onclick="return Prefadoros.showKafenio();" ' +
				'class="data" title ="Εμφάνιση τραπεζιού">' +
				'Καφενείο</a>&nbsp;]';
		}
		return false;
	};

	this.showKafenio = function() {
		show = 'kafenio';
		var x = getelid('prefadoros');
		if (notSet(x)) { return false; }

		x.style.overflowY = 'auto';
		x.innerHTML = Kafenio.html;

		x = getelid('partidaKafenio');
		if (isSet(x)) {
			x.innerHTML = '[&nbsp;<a href="#" ' +
				'onclick="return Prefadoros.showPartida();" ' +
				'class="data" title="Εμφάνιση καφενείου">' +
				'Τραπέζι</a>&nbsp;]';
		}
		return false;
	};
}

function isPektis() {
	return(isSet(pektis) && isSet(pektis.login));
}

function isPartida() {
	return(isSet(partida) && isSet(partida.k));
}

function isPrive() {
	return(isSet(partida) && isSet(partida.p) && (partida.p == 1));
}

function isDianomi() {
	return(isSet(dianomi) && isSet(dianomi.length) && (dianomi.length > 0));
}
