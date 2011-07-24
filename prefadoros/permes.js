var Permes = new function() {
	this.processDedomena = function(dedomena) {
		if (dedomena.permes === 'same') {
			return;
		}

		var neaPermes = false;
		if (isSet(dedomena.permesNew)) {
			neaPermes = true;
			for (var i = 0; i < dedomena.permesNew.length; i++) {
				permes[permes.length] = dedomena.permesNew[i];
			}
		}
		else {
			if (permes.length <= 0) {
				if (dedomena.permes.length > 0) {
					neaPermes = true;
				}
			}
			else if ((dedomena.permes.length > 0) &&
				(dedomena.permes[dedomena.permes.length - 1].k >
					permes[permes.length - 1].k)) {
					neaPermes = true;
			}
			permes = dedomena.permes;
		}

		var x = getelid('permesArea');
		if (isSet(x)) {Permes.stripShow(x, true); }

		var x = getelid('permesLink');
		if (isSet(x) && isSet(x.style)) {
			if (neaPermes) {
				x.style.color = '#990000';
			}
			else if (permes.length <= 0) {
				x.style.color = '';
			}
		}
	};

	this.stripShow = function(div, auto) {
		if (auto) {
			if (notSet(permes) || (permes.length < 1)) {
				div.innerHTML = '';
				div.style.cursor = 'pointer';
				return;
			}
			playSound('minima', 20);
		}
		else {
			if (div.style.cursor !== 'pointer') {
				div.innerHTML = '';
				div.style.cursor = 'pointer';
				return;
			}

			div.style.cursor = 'crosshair';
			if (notSet(permes) || (permes.length < 1)) {
				mesg = 'Δεν υπάρχουν νέα μηνύματα';
				div.innerHTML = '<div class="permesData">' + mesg + '</div>';
				return;
			}
		}

		div.style.cursor = 'crosshair';
		var mesg = '';
		for (var i = permes.length - 1; i >= 0; i--) {
			var zebra = i % 2;
			mesg += '<span class="permes' + zebra + '">';
			mesg += '<span class="permesPektis permesPektis' + zebra + '">' +
				permes[i].a + '</span>';
			if (permes[i].m.length > 40) {
				mesg += permes[i].m.substr(0, 40) + '&hellip;';
			}
			else {
				mesg += permes[i].m;
			}
			mesg += '<span class="permesDate">[' + strPote(permes[i].d) + ']</span>';
			mesg += '</span>';
		}

		div.innerHTML = '<div class="permesData">' +
			'<marquee loop=10000 behavior=scroll scrollamount=6>' +
			mesg + '</marquee></div>';
	};
};
