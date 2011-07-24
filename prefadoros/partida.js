var Partida = new function() {
	this.processDedomena = function(dedomena) {
		if (dedomena.partida === 'same') { return; }
		partida = dedomena.partida;
		Partida.updateHTML();
	};

	this.updateHTML = function() {
		return;
	};
};
