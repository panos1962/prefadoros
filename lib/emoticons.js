var Emoticons = new function() {
	var sira = [ 0, 5, 3, 2, 1, 4 ];
	var aris = 0;
	var curSet = sira[aris];

	this.setup = function() {
		Emoticons.display();
	};

	this.enalagi = function() {
		Sizitisi.sxolioFocus();
		aris++;
		if (aris >= sira.length) { aris = 0; }
		curSet = sira[aris];
		Emoticons.display();
	};

	this.set0 = [
		'apogoitefsi.png',
		'klaps.png',
		'klama.png',
		'tromos.png',
		'thimos.png',
		'ekplixi.png',
		'klinoMati.png',
		'xamogelo.png',
		'sardonio.png',
		'kardoules.png'
	];

	this.set1 = [
		'kardia.png',
		'xara.png',
		'tomata.png',
		'gelaki.png',
		'kamenos.png',
		'mati.png',
		'glosa.png',
		'keratas.png',
		'beated.png',
		'devil.png'
	];

	this.set2 = [
		'boss.png',
		'smile.png',
		'look.png',
		'haha.png',
		'ops.png',
		'misdoubt.png',
		'doubt.png',
		'pudency.png',
		'sad.png',
		'ah.png'
	];

	this.set3 = [
		'angry.png',
		'ft.png',
		'eek.png',
		'razz.png',
		'shame.png',
		'lovely.png',
		'sad.png',
		'smile.png',
		'lol.png',
		'shuai.png'
	];

	this.set4 = [
		'matia.gif',
		'binelikia.gif',
		'kapikia.gif',
		'mati.gif',
		'bouketo.gif',
		'kakos.gif',
		'plastis.gif',
		'gelio.gif',
		'zalada.gif',
		'oxi.gif',
		'tromos.gif'
	];

	this.set5 = [
		'hi.gif',
		'koroidia.gif',
		'matakia.gif',
		'toulipa.gif',
		'ipopto.gif',
		'les.gif',
		'klaps.gif',
		'ekplixi.gif',
		'tromos.gif',
		'binelikia.gif',
		'ipnos.gif'
	];

	this.display = function() {
		var x = getelid('emoticons');
		if (notSet(x)) { return; }
		x.innerHTML = eval('Emoticons.setDisplay(Emoticons.set' + curSet + ', ' + curSet + ')');
	};

	this.setDisplay = function(eset, idx) {
		var html = '';
		for (var i = 0; i < eset.length; i++) {
			html += '<img src="' + globals.server + 'images/emoticons/set' +
				idx + '/' + eset[i] + '" class="emoticonsIcon" ' +
				'onclick="Emoticons.ensomatosi(' + idx + ', ' + i + ');" />';
		}

		return html;
	};

	this.ensomatosi = function(eset, idx) {
		// mainFyi('eset = ' + eset + ', idx = ' + idx);
		var x = getelid('sxolioInput');
		if (notSet(x)) { return; }
		x.value += '^E:' + eset + ':' + idx + '^';
		Sizitisi.parousiasi(x);
		x.focus();
	};
};
