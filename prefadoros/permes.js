var Permes = new function() {
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
			mesg += permes[i].m;
			mesg += '<span class="permesDate">[' + Permes.xronos(permes[i].d) + ']</span>';
			mesg += '</span>';
		}

		div.innerHTML = '<div class="permesData">' +
			'<marquee loop=10000 behavior=scroll scrollamount=6>' +
			mesg + '</marquee></div>';
	};

	this.xronos = function(d) {
		var tora = parseInt(currentTimestamp() / 1000);
		var dif = tora - d + globals.timeDif;
		if (dif < 60) {
			return 'τώρα';
		}
		if (dif < 3600) {
			var x = parseInt(dif / 60);
			return 'πριν ' + x + ' λεπτ' + (x < 2 ? 'ό' : 'ά');
		}
		if (dif < 86400) {
			var x = parseInt(dif / 3600);
			return 'πριν ' + x + ' ώρ' + (x < 2 ? 'α' : 'ες');
		}
		
		d = new Date(d * 1000);
		return strDate(d) + ', ' + strTime(d);
	};
};
