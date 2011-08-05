var Trapezi = new function() {
	this.HTML = '';

	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.trapezi)) {
			trapezi = dedomena.trapezi;
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

		if (notSet(ixos) && isSet(dedomena.trapeziDel)) {
			ixos = 'blioup';
		}
		if (isSet(ixos) && (Prefadoros.show == 'kafenio')) { playSound(ixos); }
	};

	this.updateHTML = function() {
		Trapezi.HTML = '<div class="kafenio">';
		if (notPartida()) { Trapezi.HTML += Tools.miaPrefaHTML(true); }
		if (rebelos.length > 0) {
			Trapezi.HTML += '<div class="kafenioRebels">';
			for (var i = 0; i < rebelos.length; i++) {
				if (notSet(rebelos[i].t)) {
					Trapezi.HTML += Trapezi.rebelosHTML(rebelos[i].l);
				}
			}
			Trapezi.HTML += '</div>';
		}

		for (var i = 0; i < trapezi.length; i++) {
			Trapezi.HTML += Trapezi.trapeziHTML(trapezi[i]);
			var protos = '<div class="kafenioRebels" style="margin-top: 0.2cm;">';
			for (var j = 0; j < rebelos.length; j++) {
				if (isSet(rebelos[j].t) && (rebelos[j].t == trapezi[i].k)) {
					Trapezi.HTML += protos;
					protos = '';
					Trapezi.HTML += Trapezi.rebelosHTML(rebelos[j].l, true);
				}
			}
			if (protos === '') { Trapezi.HTML += '</div>'; }
		}
		Trapezi.HTML += '</div>';
	};

	this.trapeziHTML = function(t) {
		var theatis = (isTheatis() && (t.k == partida.k));
		var html = '';
		html += '<hr class="kafenioTrapeziLine" />';
		html += '<div class="kafenioTrapezi';
		if (t.r) { html += ' kafenioTrapeziPrive'; }
		if (theatis) { html += ' kafenioTrapeziTheatis'; }
		html += '">';
		if (isSet(t.b) && (t.b == 1)) {
			html += '<img class="kafenioTrapeziKlisto" alt="" src="' + globals.server +
				'images/controlPanel/klisto.png" title="Κλειστό τραπέζι" />';
		}
		html += '<div class="kafenioTrapeziInfo';
		if (theatis) { html += ' kafenioTrapeziInfoTheatis'; }
		html += '"';
		if (isSet(t.k) && isSet(t.s)) {
			html += ' onmouseover="Trapezi.fotise(this);"';
			html += ' onmouseout="Trapezi.xefotise(this);"';
			html += ' style="cursor: pointer;"';
			html += ' title="';
			if (theatis) {
				html += 'Αποχώρηση ως θεατής από το τραπέζι ' + t.k;
			}
			else {
				html += 'Θεατής στο τραπέζι ' + t.k;
			}
			html += '"';
			html += ' onclick="Trapezi.theatis(' + t.k + ');"';
		}
		html += '>';
		if (isSet(t.k) && isSet(t.s)) {
			html += (t.k + '#' + t.s);
		}
		else {
			html += Tools.xromataHTML('0.5cm');
		}
		html += '</div>';
		for (var i = 1; i <= 3; i++) {
			var p = eval('t.p' + i);
			html += '<div class="kafenioPektis';
			if (theatis) { html += ' theatis'; }
			if (p == '') {
				html += ' keniThesi';
			}
			else {
				if (notSet(eval('t.o' + i))) { html += ' offline'; }
				html += ' ' + ((isSet(eval('t.a' + i)) && (eval('t.a' + i) != 1)) ?
					'oxiApodoxi' : 'apodoxi');
				if (isPektis() && (p == pektis.login)) { html += ' ego'; }
			}
			html += '"';
			if (p) { html += Trapezi.permesHTML(p); }
			html += '>';
			html += '<div class="kafenioPektisName">' + (p == '' ? '&nbsp;' : p) + '</div>';
				if (partida.k == t.k) { html += Trapezi.miposBikeTora(p); }
			html += '</div>';
		}
		html += '</div>';
		return html;
	};

	this.miposBikeTora = function(pektis) {
		if (Prefadoros.show != 'kafenio') { return ''; }
		for (var i = 1; i <= 3; i++) {
			if ((partida['p' + i] == pektis) && (('n' + i) in partida)) {
				break;
			}
		}
		if (i > 3) { return ''; }

		html = '<img src="' + globals.server + 'images/hi.png" alt="" ' +
			'style="position: absolute; width: 0.8cm; top: -0.4cm; right: -0.2cm;" ' +
			'onload="Prefadoros.sviseBikeTora(this);" />';
		return html;
	};

	this.permesHTML = function(p, msg) {
		if (notSet(msg)) { msg = 'Γεια χαρά!'; }
		var html = '';
		html += ' onmouseover="Trapezi.fotise(this);"';
		html += ' onmouseout="Trapezi.xefotise(this);"';
		html += ' onclick="Sxesi.permesWindow(\'' + p + '\', \'' + msg + '\');"';
		html += ' title="Πρόσκληση, ή προσωπικό μήνυμα προς το χρήστη &quot;' +
			p + '&quot;"';
		html += ' style="cursor: pointer;"';
		return html;
	};

	this.fotise = function(div) {
		if (notSet(div)) { return; }
		div.oldClass = div.getAttribute('class');
		if (notSet(div.oldClass)) { return; }
		div.setAttribute('class', div.oldClass + ' kafenioFotismeno');
	};

	this.xefotise = function(div) {
		if (notSet(div) || notSet(div.oldClass)) { return; }
		div.setAttribute('class', div.oldClass);
	};

	this.theatis = function(t) {
		var ico = getelid('controlPanelIcon');
		if (notSet(ico)) { return; }
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/theatis');
		req.xhr.onreadystatechange = function() {
			Trapezi.theatisCheck(req, ico);
		};

		req.send('trapezi=' + t);
	};

	this.theatisCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		ico.src = globals.server + 'images/controlPanel/4Balls.png';
		var rsp = req.getResponse();
		if (rsp == 'partida') {
			Prefadoros.showPartida();
		}
		else if (rsp) {
			mainFyi(rsp);
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.rebelosHTML = function(t, theatis) {
		var html = '<div class="kafenioPektis rebelos';
		if (isSet(theatis)) { html += ' theatis'; }
		if (isPektis() && (t == pektis.login)) { html += ' ego'; }
		html += '"';
		html += Trapezi.permesHTML(t);
		html += '>';
		html += t;
		html += '</div>';
		return html;
	};

	this.adio = function() {
		Trapezi.HTML = '<div class="kafenio">';
		Trapezi.HTML += '<div style="padding: 0.4cm;">' +
			Tools.miaPrefaHTML() + '</div>';
		var trapezi = {k:null,s:null,p1:null,p2:null,p3:null};
		for (var i = 0; i < 6; i++) {
			Trapezi.HTML += Trapezi.trapeziHTML(trapezi);
		}
		Trapezi.HTML += '</div>';
	};
};

var Rebelos = new function() {
	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.rebelos)) {
			rebelos = dedomena.rebelos;
			return;
		}

		var rebelos1 = [];
		var ixos = null;

		// Αν έχει επιστραφεί array "rebelosNew", τότε πρόκειται για νέες
		// εγγραφές τις οποίες θα εμφανίσω πρώτες.
		if (isSet(dedomena.rebelosNew)) {
			ixos = 'pop';
			for (var i = 0; i < dedomena.rebelosNew.length; i++) {
				rebelos1[rebelos1.length] = dedomena.rebelosNew[i];
			}
		}

		// Διατρέχω το παλιό array "rebelos" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν τροποποιηθεί ή διαγραφεί. Για τις εγγραφές
		// που εμφανίζονται να έχουν τροποποιηθεί (array "rebelosMod") περνάω
		// στο νέο array τα νέα δεδομένα, ενώ τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί τις αγνοώ· τις υπόλοιπες εγγραφές απλώς τις
		// αντιγράφω στο νέο array.
		for (var i = 0; i < rebelos.length; i++) {
			if (isSet(dedomena.rebelosDel) &&
				(rebelos[i].l in dedomena.rebelosDel)) {
				continue;
			}

			if (isSet(dedomena.rebelosMod) &&
				(rebelos[i].l in dedomena.rebelosMod)) {
				rebelos1[rebelos1.length] = dedomena.rebelosMod[rebelos[i].l];
				continue;
			}

			rebelos1[rebelos1.length] = rebelos[i];
		}

		rebelos = rebelos1;
		delete rebelos1;

		if (notSet(ixos) && isSet(dedomena.rebelosDel)) {
			ixos = 'blioup';
		}
		if (isSet(ixos) && (Prefadoros.show == 'kafenio')) { playSound(ixos); }
	};
};

Trapezi.adio();
