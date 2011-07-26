var Kafenio = new function() {
	this.html = '';

	this.processDedomena = function(dedomena) {
		Kafenio.html = '<div class="kafenio">';
		if (rebelos.length > 0) {
			Kafenio.html += '<div class="kafenioRebels">';
			for (var i = 0; i < rebelos.length; i++) {
				Kafenio.html += Kafenio.rebelosHTML(rebelos[i]);
			}
			Kafenio.html += '</div>';
		}
		for (var i = 0; i < trapezi.length; i++) {
			Kafenio.html += Kafenio.trapeziHTML(trapezi[i]);
		}
		Kafenio.html += '</div>';
	};

	this.trapeziHTML = function(t) {
		var html = '<hr class="kafenioTrapeziLine" />';
		html += '<div class="kafenioTrapezi">';
		html += '<div class="kafenioTrapeziInfo">';
		if (isSet(t.k) && isSet(t.s)) {
			html += (t.k + '#' + t.s);
		}
		else {
			html += Tools.xromataHTML('0.5cm');
		}
		html += '</div>';
		html += '<div class="kafenioPektis">' +
			(isSet(t.p1) ? t.p1 : '&nbsp;') + '</div>';
		html += '<div class="kafenioPektis">' +
			(isSet(t.p2) ? t.p2 : '&nbsp;') + '</div>';
		html += '<div class="kafenioPektis">' +
			(isSet(t.p3) ? t.p3 : '&nbsp;') + '</div>';
		html += '</div>';
		return html;
	};

	this.rebelosHTML = function(t) {
		var html = '<div class="kafenioPektis">';
		html += t;
		html += '</div>';
		return html;
	};

	this.adio = function() {
		Kafenio.html = '<div class="kafenio">';
		Kafenio.html += '<div style="margin-bottom: 0.4cm;">' +
			Tools.miaPrefaHTML() + '</div>';
		var trapezi = {k:null,s:null,p1:null,p2:null,p3:null};
		for (var i = 0; i < 6; i++) {
			Kafenio.html += Kafenio.trapeziHTML(trapezi);
		}
		Kafenio.html += '</div>';
	};
};

Kafenio.adio();
