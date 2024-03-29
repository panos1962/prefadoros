var Trapezi = new function() {
	this.HTML = '';

	this.processDedomena = function(dedomena) {
		if (isSet(dedomena.t)) {
			trapezi = dedomena.t;
			return;
		}

		var trapezi1 = [];
		var ixos = null;

		// Αν έχει επιστραφεί array "trapeziNew", τότε πρόκειται για νέες
		// εγγραφές τις οποίες θα εμφανίσω πρώτες.
		if (isSet(dedomena.tn)) {
			ixos = 'pop';
			for (var i = 0; i < dedomena.tn.length; i++) {
				trapezi1.push(dedomena.tn[i]);
			}
		}

		// Διατρέχω το παλιό array "trapezi" και ελέγχω αν κάποιες από τις
		// εγγραφές του έχουν τροποποιηθεί ή διαγραφεί. Για τις εγγραφές
		// που εμφανίζονται να έχουν τροποποιηθεί (array "trapeziMod") περνάω
		// στο νέο array τα νέα δεδομένα, ενώ τις εγγραφές που εμφανίζονται
		// να έχουν διαγραφεί (array "trapeziDel") τις αγνοώ· τις υπόλοιπες
		// εγγραφές απλώς τις αντιγράφω στο νέο array.
		for (var i = 0; i < trapezi.length; i++) {
			var idx = 't' + trapezi[i].k;
			if (isSet(dedomena.td) && (idx in dedomena.td)) {
				continue;
			}

			if (isSet(dedomena.tm) && (idx in dedomena.tm)) {
				trapezi1.push(dedomena.tm[idx]);
				continue;
			}

			trapezi1.push(trapezi[i]);
		}

		trapezi = trapezi1;

		if (notSet(ixos) && isSet(dedomena.td)) {
			ixos = 'blioup';
		}
		if (isSet(ixos) && (Prefadoros.show == 'kafenio')) { playSound(ixos); }
	};

	var photoGallery = null;
	var currentPhotoIndex = -1;
	var currentPhoto = null;
	this.galleryMode = 'random';

	this.randomPhoto = function() {
		if (notSet(photoGallery)) {
			var req = new Request('trapezi/photoGallery', false);
			req.send();
			try { eval('photoGallery = [' + req.getResponse() + '];'); }
			catch(e) { photoGallery = []; }
			if (photoGallery.length <= 0) { photoGallery = [ 'kafenio.jpg' ]; }
		}

		switch (this.galleryMode) {
		case 'random':
			currentPhotoIndex = parseInt(Math.random() * photoGallery.length);
			break;
		default:
			currentPhotoIndex++;
			break;
		}

		if (currentPhotoIndex >= photoGallery.length) { currentPhotoIndex = 0; }
		currentPhoto = photoGallery[currentPhotoIndex];
		return currentPhoto;
	};

	this.alaxePhoto = function(img) {
		$(img).before(Trapezi.galleryPhotoHTML());
		$(img).prev().delay(300).animate({left: '0.6cm'}, 400);
		$(img).fadeOut(600, function() { sviseNode(this); });
	};

	this.galleryProipothesi = function() {
		return((trapezi.length <= 0) && (rebelos.length <= 8));
	};

	this.updateHTML = function() {
		var peknpat = getelid('peknpat');
		peknpat = (isSet(peknpat) && isSet(peknpat.value)) ? peknpat.value : '';
		Trapezi.HTML = '<div class="kafenio">';
		if (notPartida()) { Trapezi.HTML += Tools.miaPrefaHTML(true); }
		if (rebelos.length > 0) {
			Trapezi.HTML += '<div class="kafenioRebels">';
			for (var i = 0; i < rebelos.length; i++) {
				if (notSet(rebelos[i].t)) {
					Trapezi.HTML += Trapezi.rebelosHTML(rebelos[i], false, peknpat);
				}
			}
			Trapezi.HTML += '</div>';
		}

		if (this.galleryProipothesi() && (this.galleryMode != 'none')) {
			Trapezi.HTML += Trapezi.galleryPhotoHTML(true);
		}

		for (var i = 0; i < trapezi.length; i++) {
			Trapezi.HTML += Trapezi.trapeziHTML(trapezi[i], peknpat);
			var protos = '<div class="kafenioRebels" style="margin-top: 0.2cm;">';
			for (var j = 0; j < rebelos.length; j++) {
				if (isSet(rebelos[j].t) && (rebelos[j].t == trapezi[i].k)) {
					Trapezi.HTML += protos;
					protos = '';
					Trapezi.HTML += Trapezi.rebelosHTML(rebelos[j], true, peknpat);
				}
			}
			if (protos === '') { Trapezi.HTML += '</div>'; }
		}
		Trapezi.HTML += '</div>';
	};

	this.galleryPhotoHTML = function(proti) {
		Trapezi.randomPhoto();
		var html = '<img class="galleryPhoto" src="' + globals.server +
			'images/gallery/' + currentPhoto + '" alt="" ';
		if (isSet(proti)) {
			html += 'style="display: none; left: 0.6cm;" ';
			html += 'onload="$(this).fadeIn(2000);" ';
		}
		html += 'title="Αλλαγή εικόνας" onclick="Trapezi.alaxePhoto(this);" />';
		return html;
	};

	this.loginMatch = function(login, peknpat) {
		if (notSet(peknpat)) { return false; }
		var l = login.toUpperCase();
		var p = peknpat.toUpperCase();
		if (l == p) { return true; }
		if (p.length < 3) { return false; }
		return l.match(p);
	};

	this.trapeziHTML = function(t, peknpat) {
		var theatis = (isTheatis() && (t.k == partida.k));
		var html = '';
		html += '<hr class="kafenioTrapeziLine" />';
		html += '<div class="kafenioTrapezi';
		if (t.r) { html += ' kafenioTrapeziPrive'; }
		if (theatis) { html += ' kafenioTrapeziTheatis'; }
		html += '">';
		if (isSet(t.i) && (t.i <= 0)) { html += Trapezi.telosHTML(); }
		html += '<div class="kafenioBox kafenioTrapeziInfo';
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
			html += '&#13;&#10;(υπόλοιπο κάσας ' + (t.i * 10) + ' καπίκια)"';
			html += ' onclick="Trapezi.theatis(' + t.k + ');"';
		}
		html += '>';
		html += '<div class="kafenioBoxData">';
		if (isSet(t.k) && isSet(t.i)) {
			html += (t.k + '#' + t.i);
		}
		else {
			html += Tools.xromataHTML('0.5cm');
		}
		html += '</div>';
		html += '</div>';
		var giortes = Partida.giortesHTML('kafenioTrapeziAttrIcon');
		if ((isSet(t.d) && (t.d == 1)) || (isSet(t.b) && (t.b == 1)) ||
			(isSet(t.ppp) && (t.ppp == 1)) || (notSet(t.asoi) || (t.asoi == 0)) ||
			giortes || (isSet(t.postel) && (t.postel != 0)) ||
			(isSet(t.learner) && (t.learner == 1))) {
			html += '<div class="kafenioTrapeziAttrArea">';
			html += giortes;
			if (isSet(t.d) && (t.d == 1)) {
				html += Trattr.idioktitoHTML('kafenioTrapeziAttrIcon');
			}
			if (isSet(t.b) && (t.b == 1)) {
				html += Trattr.klistoHTML('kafenioTrapeziAttrIcon');
			}
			if (isSet(t.ppp) && (t.ppp == 1)) {
				html += Trattr.pasoPasoPasoHTML('kafenioTrapeziAttrIcon');
			}
			if (notSet(t.asoi) || (t.asoi == 0)) {
				html += Trattr.oxiAsoiHTML('kafenioTrapeziAttrIcon');
			}
			if (isSet(t.postel) && (t.postel != 0)) {
				html += Trattr.postelIconHTML('kafenioTrapeziAttrIcon', null, t.postel);
			}
			if (isSet(t.learner) && (t.learner == 1)) {
				html += Trattr.learnerIconHTML('kafenioTrapeziAttrIcon');
			}
			html += '</div>';
		}
		for (var i = 1; i <= 3; i++) {
			var p = eval('t.p' + i);
			html += '<div class="kafenioBox kafenioPektis';
			if (theatis) { html += ' theatis'; }
			if (notSet(p)) { p = ''; }
			if (p == '') {
				html += ' keniThesi';
			}
			else {
				if (notSet(eval('t.o' + i))) { html += ' offline'; }
				html += ' ' + ((isSet(eval('t.a' + i)) && (eval('t.a' + i) != 1)) ?
					'oxiApodoxi' : 'apodoxi');
				if (isPektis() && (p == pektis.login)) { html += ' ego'; }
				else if (Trapezi.loginMatch(p, peknpat)) { html += ' katazitoumenos'; }
				else if (Trapezi.isFilos(p)) { html += ' kafenioFilos'; }
				else if (Trapezi.isFilos(p, 'B')) { html += ' sxesiApoklismenos'; }
			}
			html += ' noshadow"';
			if (p) { html += Trapezi.permesHTML(p, null, t.k); }
			html += '>';
			html += '<div class="kafenioBoxData">' + (p == '' ? '&nbsp;' : p) + '</div>';
			if (partida.k == t.k) { html += Trapezi.miposBikeTora(p); }
			html += this.profinfoHTML(p, t.k);
			html += '</div>';
		}
		if (isSet(t.e)) { html += this.efeHTML(t.e); }
		html += '</div>';
		return html;
	};

	this.telosHTML = function() {
		var html = '';
		html += '<div class="telosArea telosAreaKafenio">';
		html += '<img alt=" title="Η παρτίδα έχει τελειώσει"" src="' +
			globals.server + 'images/telos.png" style="width: 1.0cm;" />';
		html += '</div>';
		return html;
	};

	this.efeHTML = function(efe) {
		var html = '';
		switch (efe) {
		case 'ΓΙΡΛΑΝΤΑ':
			html += '<img src="images/giortes/girlanta.png" title="Επετειακή παρτίδα" ' +
				'style="position: absolute; top: -0.6cm; left: -0.4cm; ' +
				'width: 1.8cm;" alt="" />';
			break;
		case 'ROSES':
			html += '<img src="images/giortes/roses.png" title="Επετειακή παρτίδα" ' +
				'style="position: absolute; top: -0.4cm; left: -0.2cm; ' +
				'width: 1.0cm;" alt="" />';
			break;
		case 'ΜΠΑΛΟΝΙΑ':
			html += '<img src="images/giortes/balonia.png" title="Επετειακή παρτίδα" ' +
				'style="position: absolute; top: -0.4cm; left: -0.4cm; ' +
				'width: 1.2cm;" alt="" />';
			break;
		case 'ΜΑΡΤΙΝΙ':
			html += '<img src="images/giortes/martini.png" title="Στην υγειά μας!" ' +
				'style="position: absolute; top: 0.1cm; left: -0.4cm; ' +
				'width: 1.0cm;" alt="" />';
			break;
		}
		return html;
	};

	// Δημιουργεί το εικονίδιο προφίλ (γαλάζιο συννεφάκι) για τον παίκτη.
	// Το εικονίδιο φέρει id που εμπεριέχει το όνομα του παίκτη. Σε περίπτωση
	// που η συγκεκριμένη εμφάνιση είναι μέσα σε κάποιο τραπέζι, τότε στο
	// id εμφυτεύεται και ο κωδικός τραπεζιού, καθώς ο παίκτης μπορεί να
	// εμφανίζεται ως παίκτης σε περισσότερα από ένα τραπέζια, ενώ έξω
	// ο παίκτης εμφανίζεται μια φορά είτε ως ρέμπελος, είτε ως θεατής.

	this.profinfoHTML = function(pektis, trapezi) {
		var html = '';
		html = '<img id="profinfo:' + pektis;
		if (isSet(trapezi)) { html += ':' + trapezi; }
		html += '" class="profinfoIcon" src="' + globals.server +
			'images/profinfo.png" title="Προφίλ παίκτη" alt="" ' +
			'onclick="Profinfo.dixe(event, \'' + pektis + '\', null, this);" ' +
			'onmouseover="Profinfo.omo(\'' + pektis + '\', null, true, this);" ' +
			'onmouseout="Profinfo.omo(\'' + pektis + '\', null, false, this);" ' +
			'style="width: 0.6cm; top: -0.1cm; left: -0.4cm;" />';
		return html;
	};

	var filosList = null;

	this.isFilos = function(p, fb) {
		if (p == '') { return false; }
		if (notSet(sxesi)) { return false; }
		if (notSet(fb)) { fb = 'F'; }
		if (notSet(filosList)) {
			filosList = {};
			for (var i = 0; i < sxesi.length; i++) {
				filosList[sxesi[i].l] = sxesi[i].s;
			}
		}

		return (filosList.hasOwnProperty(p) && (filosList[p] == fb));
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
			'style="position: absolute; width: 0.9cm; top: -0.6cm; right: -0.2cm;" ' +
			'onload="Prefadoros.sviseBikeTora(this);" />';
		return html;
	};

	this.permesHTML = function(p, msg, trapezi) {
		if (notSet(msg)) { msg = ''; }
		var html = '';
		html += ' onmouseover="Trapezi.fotise(this, \'' + p + '\'';
		if (isSet(trapezi)) { html += ', ' + trapezi; }
		html += ');"';
		html += ' onmouseout="Trapezi.xefotise(this, \'' + p + '\'';
		if (isSet(trapezi)) { html += ', ' + trapezi; }
		html += ');"';
		html += ' onclick="Sxesi.permesWindow(\'' + p + '\', \'' + msg + '\');"';
		html += ' title="';
		html += isPartida() ? 'Πρόσκληση, ή προσωπικό μήνυμα' : 'Προσωπικό μήνυμα';
		html += ' προς τον παίκτη &quot;' + p + '&quot;"';
		html += ' style="cursor: pointer;"';
		return html;
	};

	// Η function "fotise" κάνει εμφανές το περιεχόμενο του div που της
	// περνάμε ως πρώτη παράμετρο. Πρόκειται για τον κωδικό τραπεζιού,
	// ή για παίκτη, εφόσον έχει περαστεί και όνομα παίκτη. Αν πρόκειται
	// για παίκτη, τότε εμφανίζεται και το συννεφάκι του προφίλ. Σ' αυτή
	// την περίπτωση ελέγχουμε αν έχει περαστεί και κωδικός τραπεζιού
	// καθώς ο παίκτης μπορεί να εμφανίζεται ως παίκτης σε περισσότερα
	// από ένα τραπέζια. Για ρέμπελους ή θεατές δεν μπαίνει τέτοιο θέμα.

	this.fotise = function(div, pektis, trapezi) {
		if (notSet(div)) { return; }
		div.oldClass = div.getAttribute('class');
		if (notSet(div.oldClass)) { return; }
		div.setAttribute('class', div.oldClass + ' kafenioFotismeno');

		if (!pektis) { return; }
		var id = 'profinfo:' + pektis;
		if (isSet(trapezi)) { id += ':' + trapezi; }
		var x = getelid(id);
		if (notSet(x)) { return; }
		x.style.display = 'inline';
	};

	this.xefotise = function(div, pektis, trapezi) {
		if (notSet(div) || notSet(div.oldClass)) { return; }
		div.setAttribute('class', div.oldClass);

		if (!pektis) { return; }
		var id = 'profinfo:' + pektis;
		if (isSet(trapezi)) { id += ':' + trapezi; }
		var x = getelid(id);
		if (notSet(x)) { return; }
		x.style.display = 'none';
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

	this.rebelosHTML = function(r, theatis, peknpat) {
		var html = '<div class="kafenioBox kafenioPektis rebelos';
		if (theatis) { html += ' theatis'; }
		if (Trapezi.isFilos(r.l)) { html += ' kafenioFilos'; }
		else if (Trapezi.isFilos(r.l, 'B')) { html += ' sxesiApoklismenos'; }
		if (isPektis() && (r.l == pektis.login)) { html += ' ego'; }
		else if (Trapezi.loginMatch(r.l, peknpat)) { html += ' katazitoumenos'; }
		if (isSet(r.b)) { html += ' apasxolimenos'; }
		html += '"';
		html += Trapezi.permesHTML(r.l);
		html += '>';
		html += this.profinfoHTML(r.l);
		html += '<div class="kafenioBoxData">' + r.l + '</div>';
		html += '</div>';
		return html;
	};

	this.adio = function() {
		Trapezi.HTML = '<div class="kafenio">';
		Trapezi.HTML += '<div style="padding: 0.4cm;">' +
			Tools.miaPrefaHTML() + '</div>';
		var trapezi = {k:null,s:null,p1:null,p2:null,p3:null};
		for (var i = 0; i < 6; i++) {
			Trapezi.HTML += Trapezi.trapeziHTML(trapezi, '');
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
				rebelos1.push(dedomena.rebelosNew[i]);
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
				rebelos1.push(dedomena.rebelosMod[rebelos[i].l]);
				continue;
			}

			rebelos1.push(rebelos[i]);
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
