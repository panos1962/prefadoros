var funchat = {};

window.onload = function() {
	init();
	funchat.checkAlive = function() {
		var x = window.opener;
		if (notSet(x) || notSet(x.document)) {
			window.close();
			return;
		}
		x = x.document.getElementById('prefadoros');
		if (notSet(x)) {
			window.close();
			return;
		}

		setTimeout(funchat.checkAlive, 1000);
	};
	funchat.checkAlive();
};
