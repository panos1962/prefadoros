var emoticons = {};

emoticons.onload = function() {
	this.curSet = 0;
	this.enalagi = function() {
		emoticons.curSet++;
		emoticons.curSet %= 4;
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
		'set1/beated.png',
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

	this.set3 = [
		'set3/boss.png',
		'set3/smile.png',
		'set3/look.png',
		'set3/haha.png',
		'set3/ops.png',
		'set3/misdoubt.png',
		'set3/doubt.png',
		'set3/pudency.png',
		'set3/sad.png',
		'set3/ah.png'
	];

	this.display = function() {
		var x = getelid('emoticons');
		if (isSet(x)) {
			x.innerHTML = eval('emoticons.setDisplay(emoticons.set' +
				emoticons.curSet + ')');
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
