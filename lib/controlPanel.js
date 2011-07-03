var controlPanel = {};

controlPanel.onload = function() {
	this.curSet = 'prefa';
	globals.duration.kafetzis = 1000;
	this.enalagi = function() {
		switch (controlPanel.curSet) {
		case 'prefa':
			controlPanel.curSet = 'tools';
			break;
		case 'tools':
			controlPanel.curSet = 'prefa';
			break;
		}
		controlPanel.display();
	};

	this.display = function() {
		var x = getelid('controlPanel');
		if (notSet(x)) {
			return;
		}

		switch (controlPanel.curSet) {
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
		return html;
	};

	this.toolsDisplay = function() {
		var html = '';
		html += controlPanel.emoticonsHTML();
		html += controlPanel.kafedakiHTML();
		html += controlPanel.entasiHTML();
		return html;
	};

	this.emoticonsHTML = function() {
		return '<img src="' + globals.server + 'images/emoticons/alien.png" ' +
			'class="controlPanelIcon" alt="" title="Emoticons" ' +
			'onclick="controlPanel.emoticons();" />';
	};

	this.entasiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/entasi.png" ' +
			'class="controlPanelIcon" alt="" title="Αυξομείωση έντασης ήχου" ' +
			'onclick="controlPanel.entasi();" />';
	};

	this.kafedakiHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/kafedaki.png" ' +
			'class="controlPanelIcon" alt="" title="Καφεδάκι" ' +
			'onclick="controlPanel.kafedaki(this);" />';
	};

	this.emoticons = function() {
		var x = getelid('emoticonsColumn');
		if (notSet(x)) {
			return;
		}

		switch (x.style.display) {
		case '':
			x.style.display = 'none';
			break;
		default:
			x.style.display = '';
			break;
		}
	};

	this.kafedaki = function(ico) {
		var msg = [
			'Άντε ρε, που μου θες και καφεδάκι!',
			'Καφέ στο σπίτι σου!',
			'Να σηκωθείς να κάνεις!',
			'Ρε δε μας παρατάς που θες και καφέ!',
			'Ο καφές μας τελείωσε. Καλομάθατε μου φαίνεται εδώ μέσα…',
			'Για πάνε στη γωνία να δεις αν έρχομαι…',
			'Καφενείο το κάναμε εδώ μέσα μου φαίνεται…',
			'Παίζε τώρα και άσε τα καφεδάκια!',
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

		alert(msg[Math.floor(Math.random() * msg.length)]);
		setTimeout(function() {
			ico.src = globals.server + 'images/controlPanel/kafetzis.png';
			setTimeout(function() {
				ico.src = globals.server + 'images/controlPanel/kafedaki.png';
			}, globals.duration.kafetzis);
		}, 10);
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

	this.display();
};
