var Kinisi = new function() {
	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.kinisi)) {
			kinisi = dedomena.kinisi;
			return;
		}

		var kinisi1 = [];

		for (var i = 0; i < kinisi.length; i++) {
			var idx = 'k' + kinisi[i].k;
			if (isSet(dedomena.kinisiDel) && (idx in dedomena.kinisiDel)) {
				continue;
			}

			if (isSet(dedomena.kinisiMod) && (idx in dedomena.kinisiMod)) {
				kinisi1[kinisi1.length] = dedomena.kinisiMod[idx];
				continue;
			}

			kinisi1.push(kinisi[i]);
		}

		if (isSet(dedomena.kinisiNew)) {
			for (var i = 0; i < dedomena.kinisiNew.length; i++) {
				kinisi1.push(dedomena.kinisiNew[i]);
			}
		}

		kinisi = kinisi1;
	};
};
