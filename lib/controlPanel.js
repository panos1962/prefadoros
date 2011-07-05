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
		html += controlPanel.kafedakiHTML();
		if (isTrapezi()) {
			if (!isDianomi()) {
				html += controlPanel.kasaHTML();
				html += controlPanel.diataxiHTML();
			}
			html += controlPanel.kitapiHTML();
			html += controlPanel.kapikiaHTML();
			if (isDianomi()) {
				html += controlPanel.akirosiKinisisHTML();
			}
		}
		return html;
	};

	this.toolsDisplay = function() {
		var html = '';
		if (isTrapezi()) {
			html += controlPanel.neaPartidaHTML();
		}
		html += controlPanel.entasiHTML();
		return html;
	};

	this.emoticonsHTML = function() {
		var x = getelid('emoticonsColumn');
		return '<img src="' + globals.server + 'images/emoticons/' +
			((notSet(x) || notSet(x.emfanisi) || (!x.emfanisi)) ? 'xamogelo' : 'alien') +
			'.png" class="controlPanelIcon" alt="" ' +
			'title="Εμφάνιση στήλης emoticons" ' +
			'onclick="controlPanel.emoticons(this);" />';
	};

	this.kafedakiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/kafedaki.png" ' +
			'class="controlPanelIcon" alt="" title="Καφεδάκι" ' +
			'onclick="controlPanel.kafedaki(this);" />';
	};

	this.funchatHTML = function() {
		return '<img id="funchatIcon" src="' + globals.server +
			'images/emoticons/' + (notSet(funchatWindow) ? 'xara' : 'arax') +
			'.png" class="controlPanelIcon" title="Εμφάνιση funchat panel" ' +
			'alt="" onclick="controlPanel.funchat(this);" />';
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
			'onclick="controlPanel.kapikia(this);" />';
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

	this.funchatResetIcon = function(ico) {
		funchatWindow = null;
		ico.title = 'Εμφάνιση στήλης funchat';
		ico.src = globals.server + 'images/emoticons/xara.png';
	};

	this.funchat = function(ico) {
		if (notSet(funchatWindow)) {
			var t = getelid('prefadoros');
			if (notSet(t) || notSet(t.clientHeight) || notSet(t.clientWidth)) {
				return;
			}

			var h = parseInt(t.clientHeight * 1.3);
			var w = parseInt(t.clientWidth * 1.5);
			var l = parseInt(w * 0.84);
			t = parseInt(h / 30);
			funchatWindow = window.open(globals.server +
				'funchat/index.php', "funchat",
				'location=0,status=0,titlebar=0,menubar=0,scrollbars=1,' +
				'resizable=1,width=' + w + ',height=' + h + ',left=' + l + ',top=' + t);
			if (notSet(funchatWindow)) {
				return;
			}

			ico.title = 'Απόκρυψη funchat panel';
			ico.src = globals.server + 'images/emoticons/arax.png';
		}
		else {
			funchatWindow.close();
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

	setTimeout(function() {
		controlPanel.display();
	}, 10);
};
