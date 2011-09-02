controlPanel = new function() {
	var curSet = 'default';
	var funchatWindow = null;
	this.kitapiWindow = null;

	this.enalagi = function() {
		switch (curSet) {
		case 'default':
			curSet = 'partida';
			break;
		case 'partida':
			curSet = 'tools';
			break;
		case 'tools':
			curSet = globals.administrator ? 'admin' : 'default';
			break;
		case 'admin':
			curSet = 'default';
			break;
		}
		controlPanel.display();
	};

	this.display = function(set) {
		if (isSet(set)) { curSet = set; }
		var x = getelid('controlPanel');
		if (isSet(x)) {
			eval('x.innerHTML = controlPanel.' + curSet + 'Display();');
		}
	};

	this.defaultDisplay = function() {
		var html = '';
		html += controlPanel.emoticonsHTML();
		html += controlPanel.kafedakiHTML();
		html += controlPanel.chatModeHTML();
		if (isPartida()) {
			if (notTheatis() && notDianomi()) {
				if (isKeniThesi()) {
					html += controlPanel.alagiThesisHTML();
				}
				html += controlPanel.diataxiHTML();
				html += controlPanel.kasaHTML();
				html += controlPanel.apodoxiHTML();
			}
			if (isTheatis()) {
				html += controlPanel.exodosHTML();
			}
			else {
				html += controlPanel.kornaHTML();
			}
			if (isDianomi()) {
				html += controlPanel.claimHTML();
				html += controlPanel.kitapiHTML();
				if (notTheatis()) {
					html += controlPanel.akirosiKinisisHTML();
				}
			}
		}
		html += controlPanel.refreshHTML();
		html += controlPanel.bugFixHTML();
		return html;
	};

	this.partidaDisplay = function() {
		var html = '';
		if (isPartida()) {
			html += controlPanel.theatisHTML();
			if (isTheatis()) {
				html += controlPanel.alagiThesisHTML();
			}
			if (notTheatis()) {
				html += controlPanel.exodosHTML();
				if (notDianomi()) {
					html += controlPanel.triaPasoHTML();
					html += controlPanel.asoiKolosHTML();
				}
			}
		}
		html += controlPanel.apasxolimenosHTML();
		return html;
	};

	this.toolsDisplay = function() {
		var html = '';
		html += controlPanel.funchatHTML();
		if (isPartida()) {
			html += controlPanel.kapikiaHTML();
			if (notTheatis()) {
				html += controlPanel.neaPartidaHTML();
				html += controlPanel.idiotikotitaHTML();
				html += controlPanel.prosvasiHTML();
			}
		}
		html += controlPanel.entasiHTML();
		return html;
	};

	this.adminDisplay = function() {
		var html = '';
		if (isPartida()) {
			if (notTheatis()) {
				html += controlPanel.idiotikotitaHTML();
				html += controlPanel.prosvasiHTML();
			}
		}
		html += controlPanel.apasxolimenosHTML();
		html += controlPanel.dumprspHTML();
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
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.emoticons(this);" />';
	};

	this.mesaExoHTML = function() {
		var html = '';
		html += 'onmouseover="controlPanel.mesaExo(this, true);" ';
		html += 'onmouseout="controlPanel.mesaExo(this, false);" ';
		html += 'style="border-style: dotted;" ';
		return html;
	}

	this.mesaExo = function(img, exo) {
		if (notSet(img)) { return; }
		if (notSet(img.style)) { return; }
		img.style.borderStyle = exo ? 'outset' : 'dotted';
	};

	this.emoticons = function(ico) {
		Sizitisi.sxolioFocus();
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

	this.kafedakiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/kafedaki.png" ' +
			'class="controlPanelIcon" alt="" title="Καφεδάκι" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.kafedaki(event, this);" />';
	};

	var kafedakiCleanup = null;

	this.kafedaki = function(e, ico) {
		Sizitisi.sxolioFocus();
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
		alert(msg[i]);
		kafedakiCleanup = setTimeout(function() {
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

		return '<img src="' + globals.server + 'images/controlPanel/' + ikona +
			'.png" class="controlPanelIcon" alt="" title="' + titlos + '" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.chatMode(this);" />';
	};

	this.chatMode = function(ico) {
		Sizitisi.sxolioFocus();
		var pc = getelid('prefadoros');
		var ps = getelid('pss');
		if (notSet(pc) || notSet(ps)) {
			return;
		}

		chatMode = !chatMode;
		if (chatMode) {
			ico.title = 'Εμφάνιση καφενείου/τραπεζιού';
			ico.src = globals.server + 'images/controlPanel/prefadoros.png';
			pc.setAttribute('class', 'prefadoros prefadorosSteno');
			ps.setAttribute('class', 'pss pssFardi');
			pss.zoomChat(true);
		}
		else {
			ico.title = 'Απόκρυψη καφενείου/τραπεζιού';
			ico.src = globals.server + 'images/controlPanel/talk.png';
			pc.setAttribute('class', 'prefadoros');
			ps.setAttribute('class', 'pss');
			pss.zoomChat(false);
		}
	};

	this.apasxolimenosHTML = function() {
		if (!isPektis()) { return ''; }
		if (notSet(pektis.available)) { return ''; }

		var icon = pektis.available ? 'available' : 'busy';
		return '<img src="' + globals.server + 'images/controlPanel/' +
			icon + '.png" class="controlPanelIcon" ' + 'title="' +
			controlPanel.apasxolimenosTitle() + '" alt="" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.apasxolimenos(this);" />';
	};

	this.apasxolimenosTitle = function() {
		if (pektis.available) {
			var tora = 'ΔΙΑΘΕΣΙΜΟΣ';
			var alagi = 'ΑΠΑΣΧΟΛΗΜΕΝΟΣ';
		}
		else {
			tora = 'ΑΠΑΣΧΟΛΗΜΕΝΟΣ';
			alagi = 'ΔΙΑΘΕΣΙΜΟΣ';
		}

		return 'Φαίνεστε ' + tora + '. Κλικ για αλλαγή σε ' + alagi;
	}

	this.apasxolimenos = function(ico) {
		Sizitisi.sxolioFocus();
		if (!isPektis()) { return; }

		var nea = (isSet(pektis.available) && pektis.available) ? 'BUSY' : 'AVAILABLE';
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
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = curSrc;
			errorIcon(ico, '0.75cm');
			playSound('beep');
			return;
		}

		pektis.available = !pektis.available;
		var icon = pektis.available ? 'available' : 'busy';
		ico.src = globals.server + 'images/controlPanel/' + icon + '.png';
		ico.title = controlPanel.apasxolimenosTitle();
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
			'.png" class="controlPanelIcon" title="' +
			title + ' funchat panel" alt="" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.funchat(this);" />';
	};

	this.kornaHTML = function() {
		return '<img id="korna" src="' + globals.server +
			'images/controlPanel/korna.png" ' +
			'class="controlPanelIcon" alt="" title="Κόρνα" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.korna(this, true);" />';
	};

	this.korna = function(ico, ego) {
		if (isSet(ego) && ego) {
			Sizitisi.sxolioFocus();
			var x = getelid('sxolioInputHidden');
			if (notSet(x)) { return; }
			x.value = '@KN@';
			Sizitisi.apostoli(x, null, 'partida');
		}

		playSound('korna', 20);
		var megalo = '0.90cm';
		var mikro = '0.80cm';
		if (isSet(ico)) { ico.style.width = megalo; }
		setTimeout(function() {
			// Λόγω ασυγχρόνου, υπάρχει περίπτωση το προηγούμενο
			// εικονίδιο της κόρνας να έχει χαθεί.
			if (notSet(ico)) {
				ico = getelid('korna');
				if (notSet(ico)) { return; }
				ico.style.width = megalo;
			}
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
	};

	this.entasiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/entasi.png" ' +
			'class="controlPanelIcon" alt="" title="Αυξομείωση έντασης ήχου" ' +
			'style="border-style: dotted;" ' +
			'onmouseover="controlPanel.entasiDisplay(this);" ' +
			'onmouseout="controlPanel.mesaExo(this, false); mainFyi();" ' +
			'onclick="controlPanel.entasi();" />';
	};

	var entasiDecode = [
		'Σιωπηλό',
		'Χαμηλή',
		'Κανονική',
		'Δυνατή'
	];

	this.entasi = function() {
		Sizitisi.sxolioFocus();
		if (notSet(window.soundManager)) {
			mainFyi('Το σύστημά σας δεν υποστηρίζει ήχο');
			return;
		}

		if (notSet(soundManager.prefaVolume)) {
			soundManager.prefaVolume = 2;
		}
		else {
			soundManager.prefaVolume++;
			if (soundManager.prefaVolume >= entasiDecode.length) {
				soundManager.prefaVolume = 0;
			}
		}

		controlPanel.entasiDisplay();
		playSound('beep');
	};

	this.entasiDisplay = function(img) {
		controlPanel.mesaExo(img, true);
		if (notSet(soundManager.prefaVolume)) { return; }
		var msg = '';
		if (soundManager.prefaVolume > 0) { msg += 'Ένταση ήχου: '; }
		msg += entasiDecode[soundManager.prefaVolume];
		mainFyi(msg);
	};

	this.bugFixHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/bugFix.png" ' +
			'class="controlPanelIcon" alt="" title="Επιδιόρθωση προβλημάτων" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.bugFix(this);" />';
	};

	this.bugFix = function(img) {
		img.src = globals.server + 'images/working.gif';
		mainFyi('Επιδιόρθωση προβλημάτων. Παρακαλώ περιμένετε…');
		Dedomena.schedule(true);
	};

	this.refreshHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/refresh.png" ' +
			'class="controlPanelIcon" alt="" title="Επαναφόρτωση της σελίδας" ' +
			controlPanel.mesaExoHTML() +
			'onclick="location.href=globals.server;" />';
	};

	this.dumprspHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/dumprsp.png" ' +
			'class="controlPanelIcon" alt="" title="Παρακολούθηση δεδομένων" ' +
			controlPanel.mesaExoHTML() +
			'onclick="Dumprsp.onOff();" />';
	};

	this.kitapiHTML = function() {
		if (notPartida()) { return ''; }
		return '<img src="' + globals.server + 'images/controlPanel/kitapi.png" ' +
			'class="controlPanelIcon" alt="" title="Κιτάπι" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.kitapi(this);" />';
	};

	this.kitapi = function() {
		var t = getelid('prefadoros');
		if (notSet(t)) {
			mainFyi('prefadoros: div not found');
			return;
		}

		if (notSet(t.clientHeight)) {
			mainFyi('prefadoros.innerHeight: undefined property');
			return;
		}

		var h = parseInt(t.clientHeight * 1.3);
		var w = parseInt(h * 0.74);
		var l = parseInt(w * 1.48);
		var t = parseInt(h / 30);
		this.kitapiWindow = window.open(globals.server + 'kitapi/index.php?height=' + h,
			"kitapi", 'location=0,status=0,titlebar=0,menubar=0,scrollbars=1,resizable=1,' +
			'width=' + w + ',height=' + h + ',left=' + l + ',top=' + t);
	};

	this.refreshKitapi = function() {
		if (notSet(this.kitapiWindow)) { return; }
		this.kitapiWindow.location.href = this.kitapiWindow.location.href;
	};

	this.kliseKitapi = function() {
		this.kitapiWindow = null;
	};

	this.claimHTML = function() {
		if (notPartida()) { return ''; }
		if (pexnidi.tzogadoros != 1) { return ''; }

		var energo = true;
		if (pexnidi.epomenos != 1) { energo = false; }
		if (pexnidi.fasi != 'ΠΑΙΧΝΙΔΙ') { energo = false; }
		if (pexnidi.bazaFilo.length != 0) { energo = false; }
		if (pexnidi.bazaCount >= 9) { energo = false; }

		html = '';
		html += '<img src="' + globals.server + 'images/controlPanel/claim.png" ' +
			'alt="" class="controlPanelIcon';
		if (energo) {
			html += '" ' + controlPanel.mesaExoHTML() +
				'onclick="controlPanel.claim(this);"';
		}
		else { html += ' axno"'; }
		html += ' title="Δεν δίνω άλλη μπάζα!" />';
		return html;
	};

	this.claim = function() {
		if (notPartida()) { return; }
		if (pexnidi.tzogadoros != 1) { return; }
		if (confirm('Τα φύλλα σας θα φανερωθούν και θα απαιτήσετε ' +
			'όλες τις υπόλοιπες μπάζες. Αυτό θέλετε, πράγματι;')) {
			Pexnidi.addKinisi('CLAIM', Pexnidi.deseFila(pexnidi.fila[1]));
		}
	};

	this.kapikiaHTML = function() {
		if (!isPektis()) { return ''; }
		if (notSet(pektis.kapikia)) { return ''; }

		return '<img src="' + globals.server + 'images/controlPanel/kapikia.png" ' +
			'class="controlPanelIcon" alt="" title="Εμφάνιση/απόκρυψη καπικιών" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.douneLavin(this);" />';
	};

	this.neaPartidaHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/neaPartida.png" ' +
			'class="controlPanelIcon" alt="" title="Νέα παρτίδα" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.neaPartida(this);" />';
	};

	this.neaPartida = function(ico) {
		if (notPartida()) { return; }
		if (isTheatis()) { return; }

		if (isDianomi() && (!confirm('Όλες οι διανομές της παρτίδας θα ' +
			'διαγραφούν. Είστε σίγουρος;'))) { return; }

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/neaPartida');
		req.xhr.onreadystatechange = function() {
			controlPanel.neaPartidaCheck(req, ico);
		};

		req.send();
	};

	this.neaPartidaCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		ico.src = ico.prevSrc;
		mainFyi(rsp);
		if (rsp) {
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.alagiThesisHTML = function() {
		html = '<img src="' + globals.server + 'images/controlPanel/alagiThesis.png" ' +
			'class="controlPanelIcon" alt="" title="Αλλαγή θέσης';
		if (isTheatis()) { html += ' θέασης'; }
		html += '" ' + controlPanel.mesaExoHTML() +
			'onclick="controlPanel.diataxi(this, true);" />';
		return html;
	};

	this.diataxiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/diataxi.png" ' +
			'class="controlPanelIcon" alt="" title="Αλλαγή διάταξης παικτών" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.diataxi(this);" />';
	};

	this.diataxi = function(ico, alagi) {
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		if (isTheatis()) {
			Partida.thesiTheasis(2, ico);
			return;
		}

		if (notSet(alagi)) { alagi = false; }

		if (alagi) {
			mainFyi('Αλλαγή θέσης');
			params = 'alagi=yes';
		}
		else {
			mainFyi('Αλλαγή διάταξης των παικτών');
			params = '';
		}

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/diataxi');
		req.xhr.onreadystatechange = function() {
			controlPanel.diataxiCheck(req, ico);
		};

		req.send(params);
	};

	this.diataxiCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.kasaHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/kasa.png" ' +
			'class="controlPanelIcon" alt="" title="Αλλαγή κάσας (50/30)" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.kasa(this);" />';
	};

	this.kasa = function(ico) {
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		mainFyi('Αλλαγή κάσας (50/30)');

		var req = new Request('trapezi/kasa');
		req.xhr.onreadystatechange = function() {
			controlPanel.kasaCheck(req, ico);
		};

		req.send();
	};

	this.kasaCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.triaPasoHTML = function() {
		if (isPasoPasoPaso()) {
			var ico = 'pppOff';
			var title = 'Χωρίς πάσο, πάσο, πάσο';
		}
		else {
			ico = 'ppp';
			title = 'Να παίζεται το πάσο, πάσο, πάσο';
		}
		return '<img src="' + globals.server + 'images/controlPanel/' + ico + '.png" ' +
			'class="controlPanelIcon" alt="" title="' + title + '" ' +
			controlPanel.mesaExoHTML() + 'onclick="controlPanel.triaPaso(this);" />';
	};

	this.triaPaso = function(ico) {
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		mainFyi('Αλλαγή του πάσο, πάσο, πάσο');

		var req = new Request('trapezi/triaPaso');
		req.xhr.onreadystatechange = function() {
			controlPanel.kasaCheck(req, ico);
		};

		req.send();
	};

	this.triaPasoCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.asoiKolosHTML = function() {
		if (isAsoiKolos()) {
			var ico = 'controlPanel/asoiOff';
			var title = 'Να μη μετράνε οι άσοι';
		}
		else {
			ico = 'trapoula/asoi';
			title = 'Να μετράνε οι άσοι';
		}
		return '<img src="' + globals.server + 'images/' + ico + '.png" ' +
			'class="controlPanelIcon" alt="" title="' + title + '" ' +
			controlPanel.mesaExoHTML() + 'onclick="controlPanel.asoiKolos(this);" />';
	};

	this.asoiKolos = function(ico) {
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		mainFyi('Αλλαγή πληρωμής των άσων');

		var req = new Request('trapezi/asoiKolos');
		req.xhr.onreadystatechange = function() {
			controlPanel.kasaCheck(req, ico);
		};

		req.send();
	};

	this.asoiKolosCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.exodosHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/exodos.png" ' +
			'class="controlPanelIcon" alt="" title="Έξοδος από το τραπέζι" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.exodos(this);" />';
	};

	this.exodos = function(ico) {
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		if (notProsklisi() && notTheatis() &&
			(!confirm('Υπάρχει περίπτωση να μην ' +
			'μπορείτε να επανέλθετε στο τραπέζι. Θέλετε, πράγματι, ' +
			'να εξέλθετε από το τραπέζι;'))) {
			return;
		}

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/exodos');
		req.xhr.onreadystatechange = function() {
			controlPanel.exodosCheck(req, ico);
		};

		req.send();
	};

	this.exodosCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.apodoxiHTML = function() {
		html = '';
		if (notPartida()) { return html; }
		if (isDianomi()) { return html; }

		if (notApodoxi(1)) {
			if (isApodoxi(2) && isApodoxi(3)) {
				var ico = 'go.jpg';
				var msg = 'Μοίρασε!';
				var apodoxi = 'true';
			}
			else {
				ico = 'check.png';
				msg = 'Αποδοχή κάσας και διάταξης παικτών';
				apodoxi = 'true';
			}
		}
		else {
			ico = 'uncheck.png';
			msg = 'Επαναδιαπραγμάτευση κάσας και διάταξης παικτών';
			apodoxi = 'false';
		}

		return '<img src="' + globals.server + 'images/controlPanel/' + ico + '" ' +
			'class="controlPanelIcon" alt="" title="' + msg + '" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.apodoxi(this, ' + apodoxi + ', \'' + msg + '\');" />';
	};

	this.apodoxi = function(ico, apodoxi, msg) {
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		mainFyi(msg);

		var req = new Request('trapezi/apodoxi');
		req.xhr.onreadystatechange = function() {
			controlPanel.apodoxiCheck(req, ico);
		};

		params = 'apodoxi=' + (apodoxi ? 'YES' : 'NO');
		params += '&thesi=' + partida.thesi;
		req.send(params);
	};

	this.apodoxiCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.theatisHTML = function() {
		return '<img id="theatisIcon" src="' + globals.server +
			'images/controlPanel/theatis.png" ' +
			'class="controlPanelIcon" alt="" title="' +
			(isTheatis() ? 'Συμμετοχή στο παιχνίδι' : 'Γίνετε θεατής') +
			'" ' + controlPanel.mesaExoHTML() +
			'onclick="controlPanel.pektisTheatis(this);" />';
	};

	this.pektisTheatis = function(ico) {
		Sizitisi.sxolioFocus();
		if (notSet(ico)) {
			ico = getelid('theatisIcon');
			if (notSet(ico)) { return; }
		}
		if (notPektis()) { return; }
		ico.src = globals.server + 'images/working.gif';
		mainFyi('Εναλλαγή παίκτη/θεατή σε εξέλιξη. Παρακαλώ περιμένετε…');
		var req = new Request('pektis/pektisTheatis');
		req.xhr.onreadystatechange = function() {
			controlPanel.pektisTheatisCheck(req, ico);
		};

		req.send();
	};

	this.pektisTheatisCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = globals.server + 'images/controlPanel/theatis.png';
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.idiotikotitaHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/' +
			(isPrive() ? 'public' : 'prive') + '.png" title="' +
			controlPanel.idiotikotitaTitle() +
			'" class="controlPanelIcon" alt="" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.idiotikotita(this);" />';
	};

	this.idiotikotitaTitle = function() {
		if (isPrive()) {
			var tora = 'ΠΡΙΒΕ';
			var alagi = 'ΔΗΜΟΣΙΟ';
		}
		else {
			tora = 'ΔΗΜΟΣΙΟ';
			alagi = 'ΠΡΙΒΕ';
		}

		return 'Το τραπέζι είναι ' + tora + '. Κλικ για αλλαγή σε ' + alagi;
	}

	this.idiotikotita = function(ico) {
		Sizitisi.sxolioFocus();
		if (!isPartida()) { return; }
		if (!confirm('Προτίθεστε να αλλάξετε την ιδιωτικότητα ' +
			'του τραπεζιού. Πράγματι, αυτό θέλετε να κάνετε;')) {
			return;
		}

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/idiotikotita');
		req.xhr.onreadystatechange = function() {
			controlPanel.idiotikotitaCheck(req, ico);
		};

		req.send('idiotikotita=' + uri(isPrive() ? 'ΔΗΜΟΣΙΟ' : 'ΠΡΙΒΕ'));
	};

	this.idiotikotitaCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.prosvasiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/' +
			(isKlisto() ? 'anikto' : 'klisto') + '.png" title="' +
			controlPanel.prosvasiTitle() +
			'" class="controlPanelIcon" alt="" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.prosvasi(this);" />';
	};

	this.prosvasiTitle = function() {
		if (isKlisto()) {
			var tora = 'ΚΛΕΙΣΤΟ';
			var alagi = 'ΑΝΟΙΚΤΟ';
		}
		else {
			tora = 'ΑΝΟΙΚΤΟ';
			alagi = 'ΚΛΕΙΣΤΟ';
		}

		return 'Το τραπέζι είναι ' + tora + '. Κλικ για αλλαγή σε ' + alagi;
	}

	this.prosvasi = function(ico) {
		Sizitisi.sxolioFocus();
		if (!isPartida()) { return; }
		var msg = isKlisto() ?
			'Αν "ανοίξετε" το τραπέζι, οι θεατές θα ' +
				'μπορούν να βλέπουν τα φύλλα των παικτών'
		:
			'Αν "κλείσετε" το τραπέζι, οι θεατές δεν θα ' +
				'μπορούν να βλέπουν τα φύλλα των παικτών'
		;
		
		if (!confirm(msg + '. Πράγματι, αυτό θέλετε να κάνετε;')) {
			return;
		}

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/prosvasi');
		req.xhr.onreadystatechange = function() {
			controlPanel.prosvasiCheck(req, ico);
		};

		req.send('prosvasi=' + uri(isKlisto() ? 'ΑΝΟΙΚΤΟ' : 'ΚΛΕΙΣΤΟ'));
	};

	this.prosvasiCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = ico.prevSrc;
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.akirosiKinisisHTML = function() {
		var html = '';
		if (pexnidi.akirosi <= 1) {
			html += '<img class="controlPanelIcon" alt="" ' + controlPanel.mesaExoHTML() +
				' src="' + globals.server + 'images/controlPanel/akirosiKinisis.png" ' +
				'title="Ακύρωση κινήσεων" onclick="controlPanel.akirosiKinisis(this);" />';
		}
		if (pexnidi.akirosi != 0) {
			html += '<img class="controlPanelIcon" alt="" ' + controlPanel.mesaExoHTML() +
				' src="' + globals.server + 'images/controlPanel/anamoniAkirosis.png" ' +
				'title="Λήξη ακύρωσης κινήσεων" ' +
				'onclick="controlPanel.lixiAkirosis(this);" />';
		}
		return html;
	};

	this.akirosiKinisis = function(img) {
		Sizitisi.sxolioFocus();
		if (!isPektis()) { return; }
		if (isTheatis()) { return; }

		mainFyi('Ακύρωση κινήσεων');
		img.src = globals.server + 'images/working.gif';
		var req = new Request('pexnidi/akirosiKinisis');
		req.xhr.onreadystatechange = function() {
			controlPanel.akirosiKinisisCheck(req, img);
		};

		req.send();
	};

	this.akirosiKinisisCheck = function(req, img) {
		if (req.xhr.readyState != 4) { return; }
		img.src = globals.server + 'images/controlPanel/akirosiKinisis.png';
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			errorIcon(img, '0.8cm');
			mainFyi(rsp);
			playSound('beep');
		}
	};

	this.lixiAkirosis = function(img) {
		Sizitisi.sxolioFocus();
		if (!isPektis()) { return; }
		if (isTheatis()) { return; }

		mainFyi('Λήξη ακύρωσης κινήσεων');
		img.src = globals.server + 'images/working.gif';
		var req = new Request('pexnidi/lixiAkirosis');
		req.xhr.onreadystatechange = function() {
			controlPanel.lixiAkirosisCheck(req, img);
		};

		req.send();
	};

	this.lixiAkirosisCheck = function(req, img) {
		if (req.xhr.readyState != 4) { return; }
		img.src = globals.server + 'images/controlPanel/anamoniAkirosis.png';
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			errorIcon(img, '0.8cm');
			mainFyi(rsp);
			playSound('beep');
		}
	};

	this.funchatResetIcon = function(ico) {
		ico.title = 'Εμφάνιση στήλης funchat';
		ico.src = globals.server + 'images/emoticons/set1/xara.png';
	};

	this.funchat = function(ico) {
		Sizitisi.sxolioFocus();
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

	this.douneLavin = function(img) {
		Sizitisi.sxolioFocus();
		if (!isPektis()) { return; }

		mainFyi('Εμφάνιση/απόκρυψη καπικιών');
		img.src = globals.server + 'images/working.gif';
		var req = new Request('account/douneLavin');
		req.xhr.onreadystatechange = function() {
			controlPanel.douneLavinCheck(req, img);
		};

		if (notSet(pektis.kapikia)) { pektis.kapikia = true; }
		var kapikia = pektis.kapikia ? 'NO' : 'YES';
		req.send('kapikia=' + kapikia);
	};

	this.douneLavinCheck = function(req, img) {
		if (req.xhr.readyState != 4) { return; }
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
			Partida.updateHTML();
			if (Prefadoros.show == 'partida') { Prefadoros.display(); }
		}
	};
};
