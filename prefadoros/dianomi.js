var Dianomi = new function() {
	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.dianomi)) {
			dianomi = dedomena.dianomi;
			return;
		}

		var dianomi1 = [];

		for (var i = 0; i < dianomi.length; i++) {
			var idx = 'd' + dianomi[i].k;
			if (isSet(dedomena.dianomiDel) && (idx in dedomena.dianomiDel)) {
				continue;
			}

			if (isSet(dedomena.dianomiMod) && (idx in dedomena.dianomiMod)) {
				dianomi1.push(dedomena.dianomiMod[idx]);
				continue;
			}

			dianomi1[dianomi1.length] = dianomi[i];
		}

		if (isSet(dedomena.dianomiNew)) {
			for (var i = 0; i < dedomena.dianomiNew.length; i++) {
				dianomi1.push(dedomena.dianomiNew[i]);
			}
		}

		dianomi = dianomi1;
	};
};
