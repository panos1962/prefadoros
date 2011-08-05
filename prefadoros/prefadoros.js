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
	try { offline(); } catch(e) {};
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
		Prefadoros.clearBikeNeos();
		controlPanel.display();
	};

	this.clearBikeNeos = function() {
		if (notSet(partida)) { return; }
		for (i = 1; i <= 3; i++) {
			var n = 'n' + i;
			if (n in partida) { delete partida[n]; }
		}
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

	this.sviseBikeTora = function(img) {
		setTimeout(function() {
			Prefadoros.sviseBikeTora2(img);
		}, 3000);
	};

	this.sviseBikeTora2 = function(img) {
		var x = parseFloat(img.style.width);
		if (x < 0.4) {
			img.parentNode.removeChild(img);
			return;
		}

		img.style.width = (x - 0.2) + 'cm';

		x = parseFloat(img.style.top);
		img.style.top = (x + 0.1) + 'cm';

		x = parseFloat(img.style.right);
		img.style.right = (x + 0.2) + 'cm';
		setTimeout(function() {
			Prefadoros.sviseBikeTora2(img);
		}, 50);
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

function isKlisto() {
	return(isSet(partida) && isSet(partida.b) && (partida.b == 1));
}

function isAnikto() {
	return(!isKlisto());
}

function isDianomi() {
	return(isSet(dianomi) && isSet(dianomi.length) && (dianomi.length > 0));
}

function notDianomi() {
	return(!isDianomi());
}

function isApodoxi(thesi) {
	if (notSet(partida)) { return false; }
	var apodoxi = eval('partida.a' + thesi);
	if (notSet(apodoxi)) { return true; }
	return(apodoxi != 0);
}

function notApodoxi(thesi) {
	return(!isApodoxi(thesi));
}

function isKeniThesi() {
	if (isSet(partida)) {
		for (var i = 1; i <= 3; i++) {
			if (eval('partida.p' + i) == '') {
				return true;
			}
		}
	}
	return false;
}

function notKeniThesi() {
	return(!isKeniThesi());
}

// Δέχεται μια θέση όπως εμφανίζεται στον client και επιστρέφει την
// πραγματική θέση. Η αντιστοίχιση γίνεται με βάση τη θέση του παίκτη
// (partida.h) ή με βάση τη θέση που περνάμε ως δεύτερη παράμετρο.
// Δηλαδή, ως δεύτερη παράμετρο, μπορούμε να περάσουμε έναν αριθμό
// θέσης που εμφανίζεται ως 1 (νότος) στον client.

function mapThesi(thesi, ena) {
	if (notSet(ena)) {
		if (notPartida()) {
			alert('mapThesi: ακαθόριστη παρτίδα');
			ena = 1;
		}
		else {
			ena = partida.h;
		}
	}
			
	switch (ena) {
	case 1:		break;
	case 2:		thesi += 1; break;
	case 3:		thesi += 2; break;
	default:
		alert('mapThesi: ακαθόριστη θέση');
		return 1;
	}

	while (thesi > 3) { thesi -= 3; }
	return thesi;
}
