var emoticons = {};

emoticons.onload = function() {
	this.curSet = 1;
	this.enalagi = function() {
		switch (emoticons.curSet) {
		case 1:
			emoticons.curSet = 2;
			break;
		case 2:
			emoticons.curSet = 1;
			break;
		}
		emoticons.display();
	};

	this.set1 = [
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

	this.set2 = [
		'kardia.png',
		'xara.png',
		'tomata.png',
		'gelaki.png',
		'kamenos.png',
		'mati.png',
		'glosa.png',
		'keratas.png',
		'sori.png',
		'devil.png'
	];

	this.display = function() {
		var x = getelid('emoticons');
		if (notSet(x)) {
			return;
		}

		switch (emoticons.curSet) {
		case 1:
			x.innerHTML = emoticons.setDisplay(emoticons.set1);
			break;
		case 2:
			x.innerHTML = emoticons.setDisplay(emoticons.set2);
			break;
		default:
			x.innerHTML = '';
			break;
		}
	};

	this.setDisplay = function(eset) {
		var html = '';
		for (var i = 0; i < eset.length; i++) {
			html += '<img src="' + globals.server + 'images/emoticons/' +
				eset[i] + '" class="emoticonsIcon" />';
		}

		return html;
	};

	this.display();
};
