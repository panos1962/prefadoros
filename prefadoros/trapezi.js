var Trapezi = new function() {
	this.html = '';

	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.trapezi)) {
			trapezi = dedomena.trapezi;
			Trapezi.updateHTML();
			return;
		}

		var trapezi1 = [];
		var ixos = null;

		// Αν έχει επιστραφεί array "trapeziNew", τότε πρόκειται για νέες
		// εγγραφές τις οποίες θα εμφανίσω πρώτες.
		if (isSet(dedomena.trapeziNew)) {
			ixos = 'pop';
			for (var i = 0; i < dedomena.trapeziNew.length; i++) {
				trapezi1[trapezi1.length] = dedomena.trapeziNew[i];
			}
		}

		// Διατρέχω το παλιό array "trapezi" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν τροποποιηθεί ή διαγραφεί. Για τις εγγραφές
		// που εμφανίζονται να έχουν τροποποιηθεί (array "trapeziMod") περνάω
		// στο νέο array τα νέα δεδομένα, ενώ τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί τις αγνοώ· τις υπόλοιπες εγγραφές απλώς τις
		// αντιγράφω στο νέο array.
		for (var i = 0; i < trapezi.length; i++) {
			if (isSet(dedomena.trapeziDel) &&
				(('t' + trapezi[i].k) in dedomena.trapeziDel)) {
				continue;
			}

			if (isSet(dedomena.trapeziMod) &&
				(('t' + trapezi[i].k) in dedomena.trapeziMod)) {
				trapezi1[trapezi1.length] = dedomena.trapeziMod['t' + trapezi[i].k];
				continue;
			}

			trapezi1[trapezi1.length] = trapezi[i];
		}

		trapezi = trapezi1;
		delete trapezi1;
		Trapezi.updateHTML();
		if (notSet(ixos) && isSet(dedomena.trapeziDel)) {
			ixos = 'blioup';
		}
		if (isSet(ixos)) { playSound(ixos); }
	};

	this.updateHTML = function() {
		Trapezi.html = '<div class="kafenio">';
		if (notPartida()) { Trapezi.html += Tools.miaPrefaHTML(true); }
		if (rebelos.length > 0) {
			Trapezi.html += '<div class="kafenioRebels">';
			for (var i = 0; i < rebelos.length; i++) {
				Trapezi.html += Trapezi.rebelosHTML(rebelos[i]);
			}
			Trapezi.html += '</div>';
		}

		for (var i = 0; i < trapezi.length; i++) {
			Trapezi.html += Trapezi.trapeziHTML(trapezi[i]);
		}
		Trapezi.html += '</div>';
	};

	this.trapeziHTML = function(t) {
		var theatis = (isTheatis() && (t.k == partida.k));
		var html = '';
		html += '<hr class="kafenioTrapeziLine" />';
		html += '<div class="kafenioTrapezi';
		if (t.r) { html += ' kafenioTrapeziPrive'; }
		if (theatis) { html += ' kafenioTrapeziTheatis'; }
		html += '">';
		html += '<div class="kafenioTrapeziInfo';
		if (theatis) { html += ' kafenioTrapeziInfoTheatis'; }
		html += '">';
		if (isSet(t.k) && isSet(t.s)) {
			html += (t.k + '#' + t.s);
		}
		else {
			html += Tools.xromataHTML('0.5cm');
		}
		html += '</div>';
		html += '<div class="kafenioPektis';
		if (theatis) { html += ' kafenioPektisTheatis'; }
		html += '">' + (t.p1 ? t.p1 : '&nbsp;') + '</div>';
		html += '<div class="kafenioPektis';
		if (theatis) { html += ' kafenioPektisTheatis'; }
		html += '">' + (t.p2 ? t.p2 : '&nbsp;') + '</div>';
		html += '<div class="kafenioPektis';
		if (theatis) { html += ' kafenioPektisTheatis'; }
		html += '">' + (t.p3 ? t.p3 : '&nbsp;') + '</div>';
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
		Trapezi.html = '<div class="kafenio">';
		Trapezi.html += '<div style="padding: 0.4cm;">' +
			Tools.miaPrefaHTML() + '</div>';
		var trapezi = {k:null,s:null,p1:null,p2:null,p3:null};
		for (var i = 0; i < 6; i++) {
			Trapezi.html += Trapezi.trapeziHTML(trapezi);
		}
		Trapezi.html += '</div>';
	};
};

Trapezi.adio();
