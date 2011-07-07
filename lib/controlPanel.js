var controlPanel = {};

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
		if (notSet(x)) {
			return;
		}

		switch (curSet) {
		case 'prefa':
			x.innerHTML = controlPanel.prefaDisplay();
			break;
		case 'tools':
			x.innerHTML = controlPanel.toolsDisplay();
			break;
		default:
			x.innerHTML = '';
			break;
		}
	};

	this.prefaDisplay = function() {
		var html = '';
		html += controlPanel.emoticonsHTML();
		html += controlPanel.funchatHTML();
		html += controlPanel.ikonomiaHTML();
		html += controlPanel.kafedakiHTML();
		if (isTrapezi()) {
			if (!isDianomi()) {
				html += controlPanel.kasaHTML();
				html += controlPanel.diataxiHTML();
			}
			html += controlPanel.kitapiHTML();
			if (isSet(globals.pektis)) {
				html += controlPanel.kapikiaHTML();
			}
			if (isDianomi()) {
				html += controlPanel.akirosiKinisisHTML();
			}
			html += controlPanel.kornaHTML();
		}
		return html;
	};

	this.toolsDisplay = function() {
		var html = '';
		html += controlPanel.emoticonsHTML();
		html += controlPanel.funchatHTML();
		html += controlPanel.ikonomiaHTML();
		if (isTrapezi()) {
			html += controlPanel.neaPartidaHTML();
		}
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

		return '<img src="' + globals.server + 'images/emoticons/' + icon +
			'.png" class="controlPanelIcon" alt="" ' +
			'title="' + title + ' στήλης emoticons" ' +
			'onclick="controlPanel.emoticons(this);" />';
	};

	this.kafedakiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/kafedaki.png" ' +
			'class="controlPanelIcon" alt="" title="Καφεδάκι" ' +
			'onclick="controlPanel.kafedaki(this);" />';
	};

	this.kafedakiCleanup = null;

	this.kafedaki = function(ico) {
		if (isSet(controlPanel.kafedakiCleanup)) {
			clearTimeout(controlPanel.kafedakiCleanup);
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

		ico.src = globals.server + 'images/controlPanel/kafetzis.png';
		dialogos('<div class="kafedaki">' + msg[i] + '</div>', '4.0cm', '6.0cm');
		controlPanel.kafedakiCleanup = setTimeout(function() {
			dialogosOff();
			ico.src = globals.server + 'images/controlPanel/kafedaki.png';
		}, t);
	};

	var ikonomiko = false;

	this.ikonomiaHTML = function() {
		if (ikonomiko) {
			var titlos = 'Εμφάνιση καφενείου/τραπεζιού';
			var ikona = 'prefadoros';
		}
		else {
			titlos = 'Απόκρυψη καφενείου/τραπεζιού';
			ikona = 'talk';
		}

		return '<img src="' + globals.server + 'images/controlPanel/' +
			ikona + '.png" class="controlPanelIcon" alt="" title="' +
			titlos + '" onclick="controlPanel.ikonomia(this);" />';
	};

	this.ikonomia = function(ico) {
		var x = getelid('prefadorosColumn');
		if (notSet(x)) {
			return;
		}

		ikonomiko = !ikonomiko;
		if (ikonomiko) {
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

	this.funchatHTML = function() {
		if (notSet(funchatWindow)) {
			var icon = 'xara';
			var title = 'Εμφάνιση';
		}
		else {
			icon = 'glosa';
			title = 'Απόκρυψη';
		}

		return '<img id="funchatIcon" src="' + globals.server + 'images/emoticons/' +
			icon + '.png" class="controlPanelIcon" title="' + title +
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
		playSound('korna', 10);
	};

	this.entasiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/entasi.png" ' +
			'class="controlPanelIcon" alt="" title="Αυξομείωση έντασης ήχου" ' +
			'onclick="controlPanel.entasi();" />';
	};

	this.kitapiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/kitapi.png" ' +
			'class="controlPanelIcon" alt="" title="Κιτάπι" ' +
			'onclick="controlPanel.kitapi(this);" />';
	};

	this.kapikiaHTML = function() {
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
			ico.src = globals.server + 'images/emoticons/alien.png';
		}
		else {
			x.emfanisi = false;
			x.style.display = 'none';
			ico.title = 'Εμφάνιση στήλης emoticons';
			ico.src = globals.server + 'images/emoticons/xamogelo.png';
		}
	};

	this.funchatResetIcon = function(ico) {
		ico.title = 'Εμφάνιση στήλης funchat';
		ico.src = globals.server + 'images/emoticons/xara.png';
	};

	this.funchat = function(ico) {
		if (notSet(funchatWindow)) {
			var x = getelid('prefadoros');
			if (notSet(x) || notSet(x.clientHeight) || notSet(x.clientWidth)) {
				return;
			}

			if (isSet(globals.funchatWhlt)) {
				var whlt = globals.funchatWhlt.split(':');
				if (whlt.length == 4) {
					var w = whlt[0];
					var h = whlt[1];
					var l = whlt[2];
					var t = whlt[3];
				}
				else {
					w = 800;
					h = 600;
					l = 200;
					t = 100;
				}
			}
			else if (ikonomiko) {
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
			ico.src = globals.server + 'images/emoticons/glosa.png';
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
		if (notSet(globals.pektis)) {
			return;
		}

		mainFyi('Εμφάνιση/απόκρυψη καπικιών');
		img.src = globals.server + 'images/working.gif';
		var req = new Request('account/douneLavin');
		req.xhr.onreadystatechange = function() {
			controlPanel.douneLavinCheck(req, img);
		};

		if (notSet(globals.pektis.kapikia)) {
			var emfanisi = 'YES';
		}
		else if (globals.pektis.kapikia) {
			emfanisi = 'NO';
		}
		else {
			emfanisi = 'YES';
		}
		var params = 'emfanisi=' + emfanisi;
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
			playSound('beep');
		}
	};

	setTimeout(function() {
		controlPanel.display();
	}, 10);
};
