var trapezi = {};

controlPanel = new function() {
	var curSet = 'prefa';
	var funchatWindow = null;

	this.enalagi = function() {
		switch (curSet) {
		case 'prefa':
			curSet = 'partida';
			break;
		case 'partida':
			curSet = 'tools';
			break;
		case 'tools':
			curSet = globals.administrator ? 'admin' : 'prefa';
			break;
		case 'admin':
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
		html += controlPanel.chatModeHTML();
		html += controlPanel.kafedakiHTML();
		if (isPartida()) {
			if (notTheatis() && notDianomi()) {
				html += controlPanel.apodoxiHTML();
			}
			html += controlPanel.theatisHTML();
			if (isTheatis()) {
				html += controlPanel.exodosHTML();
			}
			if (isDianomi()) {
				html += controlPanel.kitapiHTML();
				html += controlPanel.akirosiKinisisHTML();
			}
		}
		html += controlPanel.apasxolimenosHTML();
		if (isPartida()) {
			html += controlPanel.kornaHTML();
		}
		return html;
	};

	this.partidaDisplay = function() {
		var html = '';
		if (isPartida()) {
			if (!isDianomi()) {
				html += controlPanel.kasaHTML();
				html += controlPanel.diataxiHTML();
			}
			html += controlPanel.exodosHTML();
			html += controlPanel.theatisHTML();
		}
		return html;
	};

	this.toolsDisplay = function() {
		var html = '';
		html += controlPanel.emoticonsHTML();
		html += controlPanel.funchatHTML();
		html += controlPanel.chatModeHTML();
		if (isPartida()) {
			html += controlPanel.neaPartidaHTML();
			html += controlPanel.exodosHTML();
			html += controlPanel.theatisHTML();
			html += controlPanel.kapikiaHTML();
			html += controlPanel.idiotikotitaHTML();
		}
		html += controlPanel.apasxolimenosHTML();
		html += controlPanel.entasiHTML();
		return html;
	};

	this.adminDisplay = function() {
		var html = '';
		html += controlPanel.chatModeHTML();
		if (isPartida()) {
			html += controlPanel.idiotikotitaHTML();
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
			'onclick="controlPanel.emoticons(this);" />';
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

		return '<img src="' + globals.server + 'images/controlPanel/' +
			ikona + '.png" class="controlPanelIcon" alt="" title="' +
			titlos + '" onclick="controlPanel.chatMode(this);" />';
	};

	this.chatMode = function(ico) {
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
			icon + '.png" class="controlPanelIcon" ' +
			'title="' + controlPanel.apasxolimenosTitle() +
			'" alt="" onclick="controlPanel.apasxolimenos(this);" />';
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

	this.dumprspHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/dumprsp.png" ' +
			'class="controlPanelIcon" alt="" title="Παρακολούθηση δεδομένων" ' +
			'onclick="Dumprsp.onOff();" />';
	};

	this.kitapiHTML = function() {
		if (!isPartida()) {
			return '';
		}

		return '<img src="' + globals.server + 'images/controlPanel/kitapi.png" ' +
			'class="controlPanelIcon" alt="" title="Κιτάπι" ' +
			'onclick="controlPanel.kitapi(this);" />';
	};

	this.kapikiaHTML = function() {
		if (!isPektis()) { return ''; }
		if (notSet(pektis.kapikia)) { return ''; }

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

	this.exodosHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/exodos.png" ' +
			'class="controlPanelIcon" alt="" title="Έξοδος από το τραπέζι" ' +
			'onclick="controlPanel.exodos(this);" />';
	};

	this.exodos = function(ico) {
		if (notPartida()) { return; }
		if (!confirm('Υπάρχει περίπτωση να μην μπορείτε να επανέλθετε ' +
			'στο τραπέζι. Θέλετε, πράγματι, να εξέλθετε από το τραπέζι;')) {
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
			'onclick="controlPanel.apodoxi(this, ' + apodoxi + ', \'' + msg + '\');" />';
	};

	this.apodoxi = function(ico, apodoxi, msg) {
		if (notPartida()) { return; }
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		mainFyi(msg);

		var req = new Request('trapezi/apodoxi');
		req.xhr.onreadystatechange = function() {
			controlPanel.apodoxiCheck(req, ico);
		};

		params = 'apodoxi=' + (apodoxi ? 'YES' : 'NO');
		params += '&thesi=' + partida.h;
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
			'" onclick="controlPanel.pektisTheatis(this);" />';
	};

	this.pektisTheatis = function(ico) {
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
			(isPrive() ? 'prive' : 'public') + '.png" title="' +
			controlPanel.idiotikotitaTitle() +
			'" class="controlPanelIcon" alt="" ' +
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
		}
	};
};
