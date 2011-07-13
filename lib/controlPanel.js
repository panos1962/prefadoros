var controlPanel = {};
var trapezi = {};
trapezi.kodikos = 1711;
trapezi.prive = true;
pektis.katastasi = 'BUSY';

controlPanel.onload = function() {
	var curSet = 'prefa';
	var funchatWindow = null;

	this.enalagi = function() {
		switch (curSet) {
		case 'prefa':
			curSet = 'tools';
			break;
		case 'tools':
			curSet = 'prefa';
			break;
		}
		controlPanel.display();
	};

	this.display = function() {
		var x = getelid('controlPanel');
		if (isSet(x)) {
			eval('x.innerHTML = controlPanel.' + curSet + 'Display();');
		}
	};

	this.prefaDisplay = function() {
		var html = '';
		html += controlPanel.emoticonsHTML();
		html += controlPanel.funchatHTML();
		html += controlPanel.chatModeHTML();
		html += controlPanel.kafedakiHTML();
		if (isTrapezi()) {
			if (!isDianomi()) {
				html += controlPanel.kasaHTML();
				html += controlPanel.diataxiHTML();
			}
			html += controlPanel.kitapiHTML();
			if (isDianomi()) {
				html += controlPanel.akirosiKinisisHTML();
			}
		}
		html += controlPanel.apasxolimenosHTML();
		if (isTrapezi()) {
			html += controlPanel.kornaHTML();
		}
		return html;
	};

	this.toolsDisplay = function() {
		var html = '';
		html += controlPanel.emoticonsHTML();
		html += controlPanel.funchatHTML();
		html += controlPanel.chatModeHTML();
		if (isTrapezi()) {
			html += controlPanel.neaPartidaHTML();
			html += controlPanel.kapikiaHTML();
			html += controlPanel.idiotikotitaHTML();
		}
		html += controlPanel.apasxolimenosHTML();
		html += controlPanel.entasiHTML();
		return html;
	};

	this.emoticonsHTML = function() {
		var x = getelid('emoticonsColumn');
		if (notSet(x) || notSet(x.emfanisi) || (!x.emfanisi)) {
			var icon = 'xamogelo';
			var title = 'Εμφάνιση';
		}
		else {
			icon = 'alien';
			title = 'Απόκρυψη';
		}

		return '<img src="' + globals.server + 'images/emoticons/set0/' + icon +
			'.png" class="controlPanelIcon" alt="" ' +
			'title="' + title + ' στήλης emoticons" ' +
			'onclick="controlPanel.emoticons(this);" />';
	};

	this.kafedakiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/kafedaki.png" ' +
			'class="controlPanelIcon" alt="" title="Καφεδάκι" ' +
			'onclick="controlPanel.kafedaki(event, this);" />';
	};

	var kafedakiCleanup = null;

	this.kafedaki = function(e, ico) {
		if (isSet(kafedakiCleanup)) {
			clearTimeout(kafedakiCleanup);
		}

		var msg = [
			'Άντε ρε, που μου θες και καφεδάκι!',
			'Καφέ στο σπίτι σου!',
			'Να σηκωθείς να κάνεις!',
			'Ρε δε μας παρατάς που θες και καφέ!',
			'Ο καφές μας τελείωσε. Καλομάθατε εδώ μέσα, μου φαίνεται…',
			'Για πάνε στη γωνία να δεις αν έρχομαι…',
			'Καφενείο το κάναμε εδώ μέσα μου φαίνεται…',
			'Παίξε πρέφα, ρε, κι άσε τα καφεδάκια!',
			'Με κοιτάς που σε κοιτάω;',
			'Ρε άντε κάνε καμιά δουλειά, λέω εγώ…',
			'Πώς ακριβώς τον πίνεις;',
			'Τον πούλο!'
		];
		var ora = new Date();
		ora = ora.getHours();
		if (ora < 5) {
			msg.push(
				'Άντε σπίτια σας, ρε, μου θέλετε και καφεδάκι τέτοια ώρα!',
				'Ξεκουμπίδια, να κλείσω. Δεν θα ξενυχτάω να ψήνω \n' +
					'καφεδάκια στη αφεντιά σας'
			);
		}
		else if (ora < 8) {
			msg.push(
				'Ρε, στον ύπνο σου με είδες; Άντε από \'δω πρωί πρωί!',
				'Άντε ρε που μου ήρθατε από τα χαράματα στο καφενείο, \n' +
					'θέλετε και καφεδάκι!'
			);
		}
		else if (ora < 10) {
			msg.push(
				'Δε μας παρατάς, πρωί πρωί, λέω εγώ;',
				'Δεν κάνεις καμιά δουλειά, πρωινιάτικα;'
			);
		}
		else if (ora < 14) {
			msg.push(
				'Ο καφές μας τελείωσε!',
				'Καφές τέλος!'
			);
		}
		else if (ora < 17) {
			msg.push(
				'Δε μας παρατάς, μεσημεριάτικα;',
				'Καφές μετά τις πέντε!'
			);
		}
		else if (ora < 20) {
			msg.push(
				'Βαριέμαι τώρα. Να παρήγγελνες νωρίτερα…'
			);
		}
		else if (ora < 24) {
			msg.push(
				'Σιγά μην ψήνω καφέδες βραδιάτικα!',
				'Ρε άντε που μου θες και καφεδάκι βραδιάτικα!',
				'Τέτοια ώρα, τέτοια λόγια…'
			);
		}

		var i = Math.floor(Math.random() * msg.length);
		var t = (msg[i].length * 50);
		if (t < 900) {
			t = 900;
		}

		if (notSet(e)) {
			e = window.event;
		}

		ico.src = globals.server + 'images/controlPanel/kafetzis.png';
		dialogos.display(e, '<div class="kafedaki">' + msg[i] +
			'</div>', 'offset', -300, -100);
		kafedakiCleanup = setTimeout(function() {
			dialogos.hide();
			ico.src = globals.server + 'images/controlPanel/kafedaki.png';
		}, t);
	};

	var chatMode = false;

	this.chatModeHTML = function() {
		if (chatMode) {
			var titlos = 'Εμφάνιση καφενείου/τραπεζιού';
			var ikona = 'prefadoros';
		}
		else {
			titlos = 'Απόκρυψη καφενείου/τραπεζιού';
			ikona = 'talk';
		}

		return '<img src="' + globals.server + 'images/controlPanel/' +
			ikona + '.png" class="controlPanelIcon" alt="" title="' +
			titlos + '" onclick="controlPanel.chatMode(this);" />';
	};

	this.chatMode = function(ico) {
		var x = getelid('prefadorosColumn');
		if (notSet(x)) {
			return;
		}

		chatMode = !chatMode;
		if (chatMode) {
			ico.title = 'Εμφάνιση καφενείου/τραπεζιού';
			ico.src = globals.server + 'images/controlPanel/prefadoros.png';
			x.platos = x.style.width;
			x.style.width = '0px';
			x.style.display = 'none';
			pss.zoomChat(true);
		}
		else {
			ico.title = 'Απόκρυψη καφενείου/τραπεζιού';
			ico.src = globals.server + 'images/controlPanel/talk.png';
			x.style.width = x.platos;
			x.style.display = 'table-cell';
			pss.zoomChat(false);
		}
	};

	this.apasxolimenosHTML = function() {
		if (!isPektis()) {
			return '';
		}

		if (notSet(pektis.katastasi)) {
			return '';
		}

		if (pektis.katastasi != 'AVAILABLE') {
			var icon = 'busy';
			var title = 'ΔΙΑΘΕΣΙΜΟΣ';
		}
		else {
			icon = 'available';
			title = 'ΑΠΑΣΧΟΛΗΜΕΝΟΣ';
		}

		return '<img src="' + globals.server + 'images/controlPanel/' +
			icon + '.png" class="controlPanelIcon" ' +
			'title="Αλλαγή κατάστασης σε ' + title +
			'" alt="" onclick="controlPanel.apasxolimenos(this);" />';
	};

	this.apasxolimenos = function(ico) {
		if (!isPektis()) {
			return;
		}

		if (isSet(pektis.katastasi) && (pektis.katastasi != 'AVAILABLE')) {
			var nea = 'AVAILABLE';
		}
		else {
			nea = 'BUSY';
		}

		mainFyi('Αλλαγή κατάστασης παίκτη');
		var curSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		var req = new Request('account/apasxolimenos');
		req.xhr.onreadystatechange = function() {
			controlPanel.apasxolimenosCheck(req, ico, curSrc, nea);
		};
		req.send('katastasi=' + uri(nea));
	};

	this.apasxolimenosCheck = function(req, ico, curSrc, nea) {
		if (req.xhr.readyState != 4) {
			return;
		}

		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = curSrc;
			errorIcon(ico, '0.75cm');
			playSound('beep');
			return;
		}

		pektis.katastasi = nea;
		if (pektis.katastasi == 'AVAILABLE') {
			var icon = 'available';
			var title = 'ΑΠΑΣΧΟΛΗΜΕΝΟΣ';
		}
		else {
			icon = 'busy';
			title = 'ΔΙΑΘΕΣΙΜΟΣ';
		}

		ico.src = globals.server + 'images/controlPanel/' + icon + '.png';
		ico.title = 'Αλλαγή κατάστασης σε ' + title;
	};

	this.funchatHTML = function() {
		if (notSet(funchatWindow)) {
			var icon = 'xara';
			var title = 'Εμφάνιση';
		}
		else {
			icon = 'glosa';
			title = 'Απόκρυψη';
		}

		return '<img id="funchatIcon" src="' + globals.server +
			'images/emoticons/set1/' + icon +
			'.png" class="controlPanelIcon" title="' + title +
			' funchat panel" alt="" onclick="controlPanel.funchat(this);" />';
	};

	this.kornaHTML = function() {
		return '<img id="korna" src="' + globals.server +
			'images/controlPanel/korna.png" ' +
			'class="controlPanelIcon" alt="" title="Κόρνα" ' +
			'onclick="controlPanel.korna(this);" />';
	};

	this.korna = function(ico) {
		var megalo = '0.90cm';
		var mikro = '0.80cm';
		ico.style.width = megalo;
		setTimeout(function() {
			ico.style.width = mikro;
			setTimeout(function() {
				ico.style.width = megalo;
				setTimeout(function() {
					ico.style.width = mikro;
					setTimeout(function() {
						ico.style.width = megalo;
						setTimeout(function() {
							ico.style.width = mikro;
						}, 950);
					}, 200);
				}, 200);
			}, 200);
		}, 200);
		playSound('korna', 20);
	};

	this.entasiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/entasi.png" ' +
			'class="controlPanelIcon" alt="" title="Αυξομείωση έντασης ήχου" ' +
			'onclick="controlPanel.entasi();" />';
	};

	this.kitapiHTML = function() {
		if (!isTrapezi()) {
			return '';
		}

		return '<img src="' + globals.server + 'images/controlPanel/kitapi.png" ' +
			'class="controlPanelIcon" alt="" title="Κιτάπι" ' +
			'onclick="controlPanel.kitapi(this);" />';
	};

	this.kapikiaHTML = function() {
		if (!isPektis()) {
			return '';
		}

		if (notSet(pektis.kapikia)) {
			return '';
		}

		return '<img src="' + globals.server + 'images/controlPanel/kapikia.png" ' +
			'class="controlPanelIcon" alt="" title="Εμφάνιση/απόκρυψη καπικιών" ' +
			'onclick="controlPanel.douneLavin(this);" />';
	};

	this.neaPartidaHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/neaPartida.png" ' +
			'class="controlPanelIcon" alt="" title="Νέα παρτίδα" ' +
			'onclick="controlPanel.neaPartida(this);" />';
	};

	this.diataxiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/diataxi.png" ' +
			'class="controlPanelIcon" alt="" title="Αλλαγή διάταξης παικτών" ' +
			'onclick="controlPanel.diataxi(this);" />';
	};

	this.idiotikotitaHTML = function() {
		if (!isTrapezi()) {
			return '';
		}

		if (notSet(trapezi.prive)) {
			return '';
		}

		if (trapezi.prive) {
			var ico = 'prive';
			var tit = 'ΠΡΙΒΕ';
		}
		else {
			ico = 'public';
			tit = 'ΔΗΜΟΣΙΟ';
		}

		return '<img id="idiotikotitaIcon" src="' + globals.server + 'images/controlPanel/' +
			ico + '.png" title="' + tit + '" class="controlPanelIcon" ' +
			'alt="" onclick="controlPanel.idiotikotita(event, this);" />';
	};

	this.idiotikotita = function(e, ico) {
		if (isTrapezi()) {
			if (notSet(e)) {
				e = window.event;
			}

			dialogos.yesNo(e, 'Προτίθεστε να αλλάξετε την ιδιωτικότητα ' +
				'του τραπεζιού. Πράγματι, αυτό θέλετε να κάνετε;',
				'controlPanel.idiotikotitaDo()', 'offset', -50, -200);
		}
	};

	this.idiotikotitaDo = function() {
		if (!isTrapezi()) {
			return;
		}

		var ico = getelid('idiotikotitaIcon');
		if (notSet(ico)) {
			return;
		}

		if (isSet(trapezi.prive) && trapezi.prive) {
			var nea = 'ΔΗΜΟΣΙΟ';
		}
		else {
			nea = 'ΠΡΙΒΕ';
		}

		mainFyi('Αλλαγή ιδιωτικότητας τραπεζιού');
		var curSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		var req = new Request('trapezi/idiotikotita');
		req.xhr.onreadystatechange = function() {
			controlPanel.idiotikotitaCheck(req, ico, curSrc, nea);
		};
		req.send('idiotikotita=' + uri(nea));
	};

	this.idiotikotitaCheck = function(req, ico, curSrc, nea) {
		if (req.xhr.readyState != 4) {
			return;
		}

		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = curSrc;
			errorIcon(ico);
			playSound('beep');
			return;
		}

		trapezi.prive = (nea == 'ΠΡΙΒΕ');
		if (trapezi.prive) {
			var icon = 'prive';
			var title = 'ΠΡΙΒΕ';
		}
		else {
			icon = 'public';
			title = 'ΔΗΜΟΣΙΟ';
		}

		ico.src = globals.server + 'images/controlPanel/' + icon + '.png';
		ico.title = title;
	};

	this.akirosiKinisisHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/akirosiKinisis.png" ' +
			'class="controlPanelIcon" alt="" title="Ακύρωση κίνησης" ' +
			'onclick="controlPanel.akirosiKinisis(this);" />';
	};

	this.kasaHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/kasa.png" ' +
			'class="controlPanelIcon" alt="" title="Αλλαγή κάσας (50/30)" ' +
			'onclick="controlPanel.kasa(this);" />';
	};

	this.emoticons = function(ico) {
		var x = getelid('emoticonsColumn');
		if (notSet(x)) {
			return;
		}

		if (notSet(x.emfanisi) || (!x.emfanisi)) {
			x.emfanisi = true;
			x.style.display = 'table-cell';
			ico.title = 'Απόκρυψη στήλης emoticons';
			ico.src = globals.server + 'images/emoticons/set0/alien.png';
		}
		else {
			x.emfanisi = false;
			x.style.display = 'none';
			ico.title = 'Εμφάνιση στήλης emoticons';
			ico.src = globals.server + 'images/emoticons/set0/xamogelo.png';
		}
	};

	this.funchatResetIcon = function(ico) {
		ico.title = 'Εμφάνιση στήλης funchat';
		ico.src = globals.server + 'images/emoticons/set1/xara.png';
	};

	this.funchat = function(ico) {
		if (notSet(funchatWindow)) {
			var x = getelid('prefadoros');
			if (notSet(x) || notSet(x.clientHeight) || notSet(x.clientWidth)) {
				return;
			}

			if (isSet(globals) && isSet(globals.funchatWhlt)) {
				var whlt = globals.funchatWhlt.split(':');
				var w = whlt[0];
				var h = whlt[1];
				var l = whlt[2];
				var t = whlt[3];
			}
			else if (chatMode) {
				w = 800;
				h = 600;
				l = 200;
				t = 100;
			}
			else {
				w = parseInt(x.clientWidth * 1.5);
				h = parseInt(x.clientHeight * 1.3);
				l = parseInt(w * 0.84);
				t = parseInt(h / 30);
			}

			funchatWindow = window.open(globals.server +
				'funchat/index.php', "funchat",
				'location=0,status=0,titlebar=0,menubar=0,scrollbars=1,' +
				'resizable=1,width=' + w + ',height=' + h + ',left=' + l + ',top=' + t);
			if (notSet(funchatWindow)) {
				return;
			}

			ico.title = 'Απόκρυψη funchat panel';
			ico.src = globals.server + 'images/emoticons/set1/glosa.png';
		}
		else {
			funchatWindow.close();
			funchatWindow = null;
			controlPanel.funchatResetIcon(ico);
		}
	};

	this.funchatClose = function() {
		if (isSet(funchatWindow)) {
			funchatWindow.close();
			funchatWindow = null;
		}

		var ico = getelid('funchatIcon');
		if (isSet(ico)) {
			controlPanel.funchatResetIcon(ico);
		}
	};

	this.entasi = function() {
		if (notSet(soundManager)) {
			mainFyi('Το σύστημά σας δεν υποστηρίζει ήχο');
			return;
		}

		switch (soundManager.prefaVolume) {
		case 0:
			soundManager.prefaVolume = 1;
			var entasi = 'Χαμηλή';
			break;
		case 1:
			soundManager.prefaVolume = 2;
			entasi = 'Κανονική';
			break;
		case 2:
			soundManager.prefaVolume = 3;
			entasi = 'Δυνατή';
			break;
		default:
			soundManager.prefaVolume = 0;
			mainFyi('Σιωπηλό');
			return;
		}

		mainFyi('Ένταση ήχου: ' + entasi);
		playSound('beep');
	};

	this.douneLavin = function(img) {
		if (!isPektis()) {
			return;
		}

		mainFyi('Εμφάνιση/απόκρυψη καπικιών');
		img.src = globals.server + 'images/working.gif';
		var req = new Request('account/douneLavin');
		req.xhr.onreadystatechange = function() {
			controlPanel.douneLavinCheck(req, img);
		};

		if (notSet(pektis.kapikia)) {
			pektis.kapikia = false;
		}

		if (pektis.kapikia) {
			kapikia = 'NO';
		}
		else {
			kapikia = 'YES';
		}
		var params = 'kapikia=' + kapikia;
		req.send(params);
	};

	this.douneLavinCheck = function(req, img) {
		if (req.xhr.readyState != 4) {
			return;
		}

		img.src = globals.server + 'images/controlPanel/kapikia.png';
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			errorIcon(img, '0.8cm');
			mainFyi(rsp);
			playSound('beep');
		}
		else {
			pektis.kapikia = !pektis.kapikia;
		}
	};

	setTimeout(function() {
		controlPanel.display();
	}, 10);
};
