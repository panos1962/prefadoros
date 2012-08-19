var Kinisi = new function() {
	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.k)) {
			kinisi = dedomena.k;
			return;
		}

		var kinisi1 = [];

		for (var i = 0; i < kinisi.length; i++) {
			var idx = 'k' + kinisi[i].k;
			if (isSet(dedomena.kd) && (idx in dedomena.kd)) {
				continue;
			}

			if (isSet(dedomena.km) && (idx in dedomena.km)) {
				kinisi1[kinisi1.length] = dedomena.km[idx];
				continue;
			}

			kinisi1.push(kinisi[i]);
		}

		if (isSet(dedomena.kn)) {
			for (var i = 0; i < dedomena.kn.length; i++) {
				kinisi1.push(dedomena.kn[i]);
			}
		}

		kinisi = kinisi1;
	};
};
