var emoticons = new function() {
	this.curSet = 0;
	this.enalagi = function() {
		emoticons.curSet++;
		emoticons.curSet %= 5;
		emoticons.display();
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
		if (isSet(x)) {
			x.innerHTML = eval('emoticons.setDisplay(emoticons.set' +
				emoticons.curSet + ', ' + emoticons.curSet + ')');
		}
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
