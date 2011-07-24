var Emoticons = new function() {
	this.curSet = 0;

	this.setup = function() {
		Emoticons.display();
	};

	this.enalagi = function() {
		Emoticons.curSet++;
		Emoticons.curSet %= 5;
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
		'giali.png',
		'bineliki.png',
		'thimos.png',
		'lipi.png',
		'dropi.png',
		'ekplixi.png',
		'tromos.png',
		'mati.png',
		'gelio.png',
		'love.png'
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

	this.display = function() {
		var x = getelid('emoticons');
		if (notSet(x)) { return; }
		x.innerHTML = eval('Emoticons.setDisplay(Emoticons.set' +
			Emoticons.curSet + ', ' + Emoticons.curSet + ')');
	};

	this.setDisplay = function(eset, idx) {
		var html = '';
		for (var i = 0; i < eset.length; i++) {
			html += '<img src="' + globals.server + 'images/emoticons/set' +
				idx + '/' + eset[i] + '" class="emoticonsIcon" />';
		}

		return html;
	};
};
