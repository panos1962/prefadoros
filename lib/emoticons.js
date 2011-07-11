var emoticons = {};

emoticons.onload = function() {
	this.curSet = 0;
	this.enalagi = function() {
		switch (emoticons.curSet) {
		case 0:
			emoticons.curSet = 1;
			break;
		case 1:
			emoticons.curSet = 2;
			break;
		case 2:
			emoticons.curSet = 0;
			break;
		}
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
		'set1/kardia.png',
		'set1/xara.png',
		'set1/tomata.png',
		'set1/gelaki.png',
		'set1/kamenos.png',
		'set1/mati.png',
		'set1/glosa.png',
		'set1/keratas.png',
		'set1/sori.png',
		'set1/devil.png'
	];

	this.set2 = [
		'set2/giali.png',
		'set2/bineliki.png',
		'set2/thimos.png',
		'set2/lipi.png',
		'set2/dropi.png',
		'set2/ekplixi.png',
		'set2/tromos.png',
		'set2/mati.png',
		'set2/gelio.png',
		'set2/love.png'
	];

	this.display = function() {
		var x = getelid('emoticons');
		if (notSet(x)) {
			return;
		}

		switch (emoticons.curSet) {
		case 0:
			x.innerHTML = emoticons.setDisplay(emoticons.set0);
			break;
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
