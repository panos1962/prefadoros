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
var kafenio = [];	// η δημόσια συζήτηση

sizitisi = [
	{k: 123456, p:'panos', s:'asjdgjsd gas djs dgsa dhjas djas djasj'},
	{k: 123457, p:'maria', s:'SGHDFDH HGSGDF DGSFGD Hhjas djas djasj'},
	{k: 123457, p:'zoi', s:'asd asdas dasd asd asdas dasd asd asdj'}
];

kafenio = [
	{k: 123446, p:'panos', s:'kaf kaf kaf kafs dgsa dhjas djas djasj'},
	{k: 123447, p:'sakis', s:'KAF KAF KAF KAF GSFGD Hhjas djas djasj'},
	{k: 123447, p:'WOLF', s:'kaf kaf s dasd asd asdas dasd asd asdj'},
	{k: 123447, p:'makis', s:'kaf kaf s dasd S DSD SD SD SD SD SDSdj'}
];

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
	this.show = null;

	this.display = function() {
		if (notSet(this.show)) {
			this.show = isPartida() ? 'partida' : 'kafenio';
		}

		if (this.show === 'partida') {
			Prefadoros.showPartida();
		}
		else {
			Prefadoros.showKafenio();
		}
		controlPanel.display();
	};

	this.showPartida = function() {
		var x = getelid('prefadoros');
		if (notSet(x)) { return false; }

		this.show = 'partida';
		x.style.overflowY = 'hidden';
		x.innerHTML = Partida.HTML;

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
		var x = getelid('prefadoros');
		if (notSet(x)) { return false; }

		this.show = 'kafenio';
		x.style.overflowY = 'auto';
		x.innerHTML = Trapezi.HTML;

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

function notPektis() {
	return(!isPektis());
}

function isTheatis() {
	return(isSet(partida) && isSet(partida.t) && (partida.t == 1));
}

function notTheatis() {
	return(!isTheatis());
}

function isPartida() {
	return(isSet(partida) && isSet(partida.k));
}

function notPartida() {
	return(!isPartida());
}

function isPrive() {
	return(isSet(partida) && isSet(partida.p) && (partida.p == 1));
}

function isPublic() {
	return(!isPrive());
}

function isDianomi() {
	return(isSet(dianomi) && isSet(dianomi.length) && (dianomi.length > 0));
}

function notDianomi() {
	return(!isDianomi());
}

function mapThesi(ena, thesi) {
	switch (ena) {
	case 2:		thesi += 1; break;
	case 3:		thesi += 2; break;
	}

	while (thesi > 3) { thesi -= 3; }
	return thesi;
}
