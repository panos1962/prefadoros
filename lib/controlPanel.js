var controlPanel = new function() {
	var curSet = 'default';
	var funchatWindow = null;
	this.kitapiWindow = null;
	this.tetralatWindow = null;

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
		if (notSet(x)) { return; }

		var html = '';
		if (curSet != 'default') { html += controlPanel.defaultPanelHTML(); }
		html += eval('controlPanel.' + curSet + 'Display()');
		if (curSet != 'default') { html += controlPanel.defaultPanelHTML(true); }
		x.innerHTML = html;
	};

	this.defaultDisplay = function() {
		var html = '';
		html += controlPanel.emoticonsHTML();
		html += controlPanel.kafedakiHTML();
		html += controlPanel.activeRadioHTML();
		if (Trapezi.galleryProipothesi()) {
			html += controlPanel.galleryHTML();
		}
		if (isPartida()) {
			if (notTheatis() && notDianomi()) {
				if (isKeniThesi()) {
					html += controlPanel.alagiThesisHTML();
				}
				if (dikeomaRithmisis()) {
					html += controlPanel.diataxiHTML();
					html += controlPanel.kasaHTML();
				}
				html += controlPanel.apodoxiHTML();
			}
			if (isTheatis()) {
				html += controlPanel.exodosHTML();
			}
			else {
				if (pexnidi.ipolipo <= 0) {
					html += controlPanel.exodosHTML(true, true);
				}
				html += controlPanel.kornaHTML();
			}
			if (isDianomi()) {
				if (notTheatis()) {
					html += controlPanel.claimHTML();
				}
				html += controlPanel.kitapiHTML();
				if (notTheatis()) {
					html += controlPanel.akirosiKinisisHTML();
				}
			}
		}
		else {
			html += controlPanel.tetralatHTML();
		}
		html += controlPanel.refreshHTML();
		html += controlPanel.bugFixHTML();
		if (isDianomi()) {
			html += controlPanel.xanaBazaHTML();
		}
		if (isTheatis() || notPartida()) {
			html += controlPanel.lampTipHTML();
		}
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
				if (notDianomi() && dikeomaRithmisis()) {
					html += controlPanel.triaPasoHTML();
					html += controlPanel.asoiKolosHTML();
				}
			}
		}
		html += controlPanel.apasxolimenosHTML();
		html += controlPanel.chatModeHTML();
		html += controlPanel.blockImageHTML();
		html += controlPanel.filoPaletaHTML();
		if (isPartida() && notTheatis()) {
			html += controlPanel.misoLeptoHTML();
		}
		return html;
	};

	this.toolsDisplay = function() {
		var html = '';
		html += controlPanel.funchatHTML();
		if (isPartida()) {
			html += controlPanel.kapikiaHTML();
			if (notTheatis() && dikeomaRithmisis()) {
				// html += controlPanel.neaPartidaHTML();
				if (notDianomi()) {
					html += controlPanel.postelHTML();
				}
				html += controlPanel.idioktisiaHTML();
				html += controlPanel.idiotikotitaHTML();
				html += controlPanel.prosvasiHTML();
			}
		}
		html += controlPanel.paraskinioHTML();
		html += controlPanel.mobileHTML();
		html += controlPanel.entasiHTML();
		return html;
	};

	this.adminDisplay = function() {
		var html = '';
		if (isPartida()) {
			if (notTheatis() && dikeomaRithmisis()) {
				html += controlPanel.idioktisiaHTML();
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
		var src = globals.server + 'images/controlPanel/kafedaki.png';
		return '<img src="' + src + '" class="controlPanelIcon" alt="" title="Καφεδάκι" ' +
			controlPanel.mesaExoHTML() + 'onclick="controlPanel.kafedaki(event, this, \'' +
			src + '\');" />';
	};

	this.kafedaki = function(e, ico, src, arxio) {
		Sizitisi.sxolioFocus();
		ico.src = globals.server + 'images/working.gif';
		var req = new Request('motto/getMotto');
		req.xhr.onreadystatechange = function() {
			controlPanel.getMottoCheck(req, ico, src);
		};
		var params = '';
		if (isSet(arxio)) { params += '&arxio=' + uri(arxio); }
		req.send(params);
	};

	this.getMottoCheck = function(req, ico, src) {
		if (req.xhr.readyState != 4) { return; }
		try { ico.src = src; } catch(e) {}
		var rsp = req.getResponse();
		try {
			var motto = eval('(' + rsp + ')');
			Motto.dixe(motto);
		} catch(e) {
			mainFyi(rsp);
			errorIcon(ico);
			playSound('beep');
		}
	};

	this.lampTipHTML = function() {
		var src = globals.server + 'images/controlPanel/lampTip.png';
		return '<img src="' + src + '" class="controlPanelIcon" alt="" title="Αυτό το ξέρατε;" ' +
			controlPanel.mesaExoHTML() + 'onclick="controlPanel.kafedaki(event, this, \'' +
			src + '\', \'../misc/lampTip.txt\');" />';
	};

	this.galleryHTML = function() {
		switch (Trapezi.galleryMode) {
		case 'random':
			var mode = 'ordered';
			var src = 'ordered.png';
			var tit = 'Φωτογραφίες με τη σειρά';
			break;
		case 'ordered':
			mode = 'none';
			src = 'none.png';
			tit = 'Απενεργοποίηση παρουσίασης φωτογραφιών';
			break;
		default:
			mode = 'random';
			src = 'random.png';
			tit = 'Φωτογραφίες με τυχαία σειρά';
			break;
		}

		return '<img src="' + globals.server + 'images/controlPanel/gallery/' +
			src + '" class="controlPanelIcon" alt="" title="' +
			tit + '" ' + controlPanel.mesaExoHTML() +
			' onclick="controlPanel.gallery(\'' + mode + '\');" />';
	};

	this.gallery = function(mode) {
		Trapezi.galleryMode = mode;
		if (Trapezi.galleryProipothesi()) {
			Trapezi.updateHTML();
			if (Prefadoros.show === 'kafenio') {
				Prefadoros.showKafenio();
			}
		}
		controlPanel.display();
	};

	this.tetralatHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/tetralat.png" ' +
			'class="controlPanelIcon" alt="" title="Λατινικά τετράγωνα" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.tetralat(event, this);" />';
	};

	this.tetralat = function(e, ico) {
		Sizitisi.sxolioFocus();
		if (notSet(this.tetralatWindow) || this.tetralatWindow.closed) {
			this.tetralatWindow = window.open('http://www.tetralat.orgfree.com', "TetraLat");
		}
		try { this.tetralatWindow.focus(); } catch(e) {};
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

		var icon = pektis.available ? 'busy' : 'available';
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

		if (notSet(pektis.available) || (pektis.available !== true)) {
			pektis.available = false;
		}
		var nea = pektis.available ? 'BUSY' : 'AVAILABLE';
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

		pektis.available = (nea != 'BUSY');
		var icon = pektis.available ? 'busy' : 'available';
		ico.src = globals.server + 'images/controlPanel/' + icon + '.png';
		ico.title = controlPanel.apasxolimenosTitle();
	};

	this.blockImageHTML = function() {
		if (!isPektis()) { return ''; }
		if (notSet(pektis.blockImage) || (pektis.blockImage !== true)) {
			pektis.blockImage = false;
		}

		return '<img src="' + globals.server + 'images/controlPanel/' +
			(pektis.blockImage ? 'free' : 'block') +
			'Image.png" class="controlPanelIcon" ' +
			'title="' + (pektis.blockImage ? 'Άνοιγμα' : 'Αποκλεισμός') +
			' εικόνων" alt="" ' + controlPanel.mesaExoHTML() +
			'onclick="controlPanel.blockImage(this);" />';
	};

	this.blockImage = function(ico) {
		Sizitisi.sxolioFocus();
		if (!isPektis()) { return; }

		if (notSet(pektis.blockImage) || (pektis.blockImage !== true)) {
			pektis.blockImage = false;
		}
		var nea = pektis.blockImage ? 'NO' : 'YES';
		mainFyi(nea == 'YES' ? 'Αποκλεισμός εικόνων' : 'Απελευθέρωση εικόνων');
		var curSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		var req = new Request('account/blockImage');
		req.xhr.onreadystatechange = function() {
			controlPanel.blockImageCheck(req, ico, curSrc, nea);
		};
		req.send('block=' + uri(nea));
		controlPanel.display('default');
	};

	this.blockImageCheck = function(req, ico, curSrc, nea) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		mainFyi(rsp);
		if (rsp) {
			ico.src = curSrc;
			errorIcon(ico, '0.75cm');
			playSound('beep');
			return;
		}

		if (nea == 'YES') {
			pektis.blockImage = true;
			ico.src = globals.server + 'images/controlPanel/freeImage.png';
			ico.title = 'Άνοιγμα εικόνων';
		}
		else {
			pektis.blockImage = false;
			ico.src = globals.server + 'images/controlPanel/blockImage.png';
			ico.title = 'Αποκλεισμός εικόνων';
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

		return '<img id="funchatIcon" src="' + globals.server +
			'images/emoticons/set1/' + icon +
			'.png" class="controlPanelIcon" title="' +
			title + ' funchat panel" alt="" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.funchat(this);" />';
	};

	this.filoPaletaHTML = function() {
		return '<img class="controlPanelIcon" src="' + globals.server +
			'images/trapoula/xromaS.png" alt="" ' +
			'title="Παλέτα χρωμάτων και φύλλων" ' +
			'onclick="FiloPaleta.onOff(event);" />';
	};

	this.activeRadioHTML = function() {
		var attrs = ActiveRadio.attributes();
		return '<img id="activeRadioIcon" class="' + attrs.cl + '" src="' +
			globals.server + 'images/controlPanel/activeRadio.png" alt="" ' +
			'title="' + attrs.ti + '" onclick="ActiveRadio.showRadio();" />';
	};

	this.misoLeptoHTML = function() {
		if (!isPektis()) { return ''; }
		return '<img class="controlPanelIcon" src="' + globals.server +
			'images/controlPanel/misoLepto.gif" alt="" ' +
			'title="Θα λείψω για λίγο…" onclick="controlPanel.misoLepto();" />';
	};

	this.misoLepto = function() {
		if (notSet(window.Sizitisi)) { return; }
		var f = getelid('sxolioInputHidden');
		if (notSet(f)) { return; }

		if (isSet(Prefadoros) && (Prefadoros.show == 'kafenio')) {
			f.value = 'Μισό…';
			Sizitisi.apostoli(f, null, 'kafenio');
		}
		else {
			f.value = '@FC@misoLepto.gif@3.2@@Μισό…';
			Sizitisi.apostoli(f, null, 'partida');
		}
		controlPanel.display('default');
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

	this.paraskinioHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/paraskinio.png" ' +
			'class="controlPanelIcon" alt="" title="Αλλαγή παρασκηνίου" ' +
			'style="border-style: dotted;" ' +
			'onmouseover="controlPanel.mesaExo(this, true);" ' +
			'onmouseout="controlPanel.mesaExo(this, false);" ' +
			'onclick="controlPanel.paraskinio();" />';
	};

	var paraskinioIndex = -1;

	var paraskinioPattern = [
		'standard.gif',
		'nifada.jpg',
		'stars.gif',
		'serpadina.gif',
		'tenies.gif',
		'katifes.jpg',
		'makaroni.jpg',
		'sinefa.jpg',
		'arxaiko.jpg',
		'edelweiss.jpg',
		'bilies.jpg',
		'tetragona.jpg',
		'trifili.jpg',
		'platani.gif',
		'elia.gif',
		'kanavi.gif',
		'plakaki.jpg',
		'asteria.jpg',
		'astrakia.gif',
		'asterakia.gif'
	];

	this.paraskinio = function() {
		Sizitisi.sxolioFocus();
		paraskinioIndex++;
		paraskinioIndex %= paraskinioPattern.length;
		document.body.style.backgroundImage = 'url(' + globals.server +
			'images/background/' + paraskinioPattern[paraskinioIndex] + ')';

		var req = new Request('account/paraskinio');
		req.send('paraskinio=' + paraskinioPattern[paraskinioIndex]);
	};

	this.mobileHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/mobile.png" ' +
			'class="controlPanelIcon" alt="" title="' + (globals.mobile ?
			'Επανεμφάνιση' : 'Απόκρυψη') + ' πληκτρολογίου οθόνης συσκευής κινητού" ' +
			'style="border-style: dotted;" ' +
			'onmouseover="controlPanel.mobileOnmouseover(this);" ' +
			'onmouseout="controlPanel.mesaExo(this, false); mainFyi();" ' +
			'onclick="controlPanel.mobile(this);" />';
	};

	this.mobile = function(ico) {
		// Sizitisi.sxolioFocus();
		var req = new Request('account/mobile');
		if (isSet(ico)) {
			ico.prevSrc = ico.src;
			ico.src = globals.server + 'images/working.gif';
		}
		req.xhr.onreadystatechange = function() {
			controlPanel.mobileCheck(req, ico);
		};

		req.send();
	};

	this.mobileCheck = function(req, ico) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (isSet(ico)) { ico.src = ico.prevSrc; }
		switch (rsp) {
		case 'ON':
			globals.mobile = true;
			mainFyi('Άρση εμφάνισης πληκτρολογίου οθόνης συσκευής κινητού');
			break;
		case 'OFF':
			globals.mobile = false;
			mainFyi('Επανεμφάνιση πληκτρολογίου οθόνης συσκευής κινητού');
			break;
		default:
			mainFyi(rsp);
			if (isSet(ico)) { errorIcon(ico); }
			playSound('beep');
			return;
		}

		Partida.updateHTML();
		if (Prefadoros.show == 'partida') { Prefadoros.display(); }
		if (notSet(ico)) { controlPanel.display(); }
	};

	this.mobileOnmouseover = function(ico) {
		controlPanel.mesaExo(this, true);
		mainFyi((globals.mobile ? 'Απενεργοποιημένο' : 'Ενεργοποιημένο') +
			' πληκτρολόγιο οθόνης συσκευής κινητού');
	};

	this.bugFixHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/bugFix.png" ' +
			'class="controlPanelIcon" alt="" title="Επιδιόρθωση προβλημάτων" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.bugFix(this);" />';
	};

	this.bugFix = function(img) {
		Sizitisi.sxolioFocus();
		img.src = globals.server + 'images/working.gif';
		mainFyi('Επιδιόρθωση προβλημάτων. Παρακαλώ περιμένετε…');
		if (isSet(Pexnidi)) { Pexnidi.clearAgora(); }
		if (isSet(controlPanel)) { controlPanel.claimConfirmation = false; }
		Dedomena.schedule(true);
	};

	this.defaultPanelHTML = function(rev) {
		var html = '';
		html += '<img src="' + globals.server + 'images/controlPanel/default.png" ' +
			'class="controlPanelIcon" alt="" title="Βασικά εργαλεία" ' +
			'onclick="controlPanel.display(\'default\');" ';
		if (notSet(rev)) { rev = false; }
		if (rev) {
			var rot = 'transform: rotate(180deg);';
			html += 'style="' + rot + '-moz-' + rot + '-webkit-' +
				rot + '-o-' + rot + '-ms-' + rot + '"';
		}
		html += '/>';
		return html;
	};

	this.xanaBazaOn = false;

	this.xanaBazaHTML = function() {
		var html = '';
		html += '<div id="telefteaBazaIcon">';
		html += controlPanel.xanaBazaInnerHTML();
		html += '</div>';
		return html;
	};

	this.xanaBazaInnerHTML = function() {
		if (controlPanel.xanaBazaOn) {
			return '<img src="' + globals.server + 'images/controlPanel/trexousaBaza.gif" ' +
				'class="controlPanelIcon" alt="" title="Απόκρυψη τελευταίας μπάζας/τζόγου" ' +
				controlPanel.mesaExoHTML() + 'onclick="controlPanel.trexousaBaza();" />';
		}
		else {
			return '<img src="' + globals.server + 'images/controlPanel/xanaBaza.gif" ' +
				'class="controlPanelIcon" title="Επανεμφάνιση τελευταίας μπάζας/τζόγου" ' +
				controlPanel.mesaExoHTML() + 'alt="" onclick="controlPanel.xanaBaza();" />';
		}
	};

	this.xanaBaza = function() {
		Sizitisi.sxolioFocus();
		var x = getelid('telefteaBaza');
		if (notSet(x)) { return; }

		if (pexnidi.prevBazaFilo.length > 0) {
			mainFyi('Επανεμφάνιση τελευταίας μπάζας');
		}
		else if (pexnidi.prevTzogosFilo.length > 0) {
			mainFyi('Επανεμφάνιση τζόγου τελευταίας διανομής');
		}
		else {
			mainFyi('Δεν υπάρχουν στοιχεία τελευταίας μπάζας');
		}

		x.innerHTML = Gipedo.telefteaBazaHTML(true);
		x.style.zIndex = 10;
		controlPanel.xanaBazaOn = true;

		x = getelid('telefteaBazaIcon');
		if (notSet(x)) { return; }
		x.innerHTML = controlPanel.xanaBazaInnerHTML();
	};

	this.trexousaBaza = function() {
		Sizitisi.sxolioFocus();
		var x = getelid('telefteaBaza');
		if (notSet(x)) { return; }

		mainFyi('Απόκρυψη τελευταίας μπάζας');
		x.style.zIndex = -1;
		controlPanel.xanaBazaOn = false;

		x = getelid('telefteaBazaIcon');
		if (notSet(x)) { return; }
		x.innerHTML = controlPanel.xanaBazaInnerHTML();
	};

	this.refreshHTML = function() {
		return '<img src="' + globals.server + 'images/controlPanel/refresh.png" ' +
			'class="controlPanelIcon" alt="" title="Επαναφόρτωση της σελίδας" ' +
			controlPanel.mesaExoHTML() + 'onclick="controlPanel.refreshPage();" />';
	};

	this.refreshPage = function() {
		Sizitisi.sxolioFocus();
		location.href = globals.server + 'index.php?motd=no&diafimisi=no';
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
		Sizitisi.sxolioFocus();
		if (isSet(this.kitapiWindow) && (!this.kitapiWindow.closed)) {
			try {
				this.kitapiWindow.focus();
				return;
			} catch(e) {
				try { kitapiWindow.close(); } catch(e) {};
				this.kitapiWindow = null;
			}
		}

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
		this.kitapiWindow.focus();
	};

	this.refreshKitapi = function() {
		if (notSet(this.kitapiWindow)) { return; }
		// Στον Opera όταν κλείνει το παράθυρο του κιταπιού, δεν ενημερώενεται
		// το παρόν πρόγραμμα. Επομένως, παραμένει μη null η "kitapiWindow"
		// με αποτέλεσμα να χτυπάει σε επόμενες πληρωμές. Γιαυτό το λόγο
		// ελέγχω αν "χτυπάει" η ενημέρωση του κιταπιού και αν χτυπήσει
		// κλείνω το κιτάπι (που μάλλον είναι έτσι κι αλλιώς κλειστό).
		try {
			this.kitapiWindow.location.href = this.kitapiWindow.location.href;
		} catch(e) {
			try { this.kitapiWindow.close(); } catch(e) {};
			this.kitapiWindow = null;
		}
	};

	this.kitapiClose = function() {
		if (isSet(this.kitapiWindow)) {
			this.kitapiWindow.close();
			this.kitapiWindow = null;
		}
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
				'onclick="controlPanel.confirmClaim(this);"';
		}
		else { html += ' axno"'; }
		html += ' title="Δεν δίνω άλλη μπάζα!" />';
		return html;
	};

	this.claimConfirmation = false;

	this.processClaim = function() {
		Sizitisi.sxolioFocus();
		Pexnidi.addKinisi('CLAIM', Pexnidi.deseFila(pexnidi.fila[1]));
		Tools.dialogos('Παρακαλώ περιμένετε την απάντηση των αμυνομένων…');
		controlPanel.claimConfirmation = false;
	};

	this.akiroClaim = function() {
		Sizitisi.sxolioFocus();
		Tools.dialogosClear();
		controlPanel.claimConfirmation = false;
	};

	this.confirmClaim = function() {
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		if (isTheatis()) { return; }
		if (pexnidi.tzogadoros != 1) { return; }
		if (pexnidi.epomenos != 1) {
			controlPanel.claimConfirmation = false;
			return;
		}

		var html = '';
		html += '<table><tr style="vertical-align: top;"><td>';
		html += '<div style="width: 7.0cm; padding-right: 0.4cm;">' +
			'Τα φύλλα σας θα φανερωθούν και θα απαιτήσετε όλες ' +
			'τις υπόλοιπες μπάζες. Αυτό θέλετε, πράγματι;</div>';
		html += '</td><td style="text-align: right;">';
		html += '<div class="dialogosYesNo" onclick="controlPanel.processClaim();" ' +
			'onmouseover="this.style.backgroundColor=\'#FFFF33\';" ' +
			'onmouseout="this.style.backgroundColor=\'#FFFF99\';" ' +
			'style="margin-right: 0px; padding-left: 0px; padding-right: 0px;">';
		html += '<div style="display: inline-block; width: 2.4cm; text-align: center;' +
			'margin-bottom: 0.6cm;">ΝΑΙ</div></div>';
		html += '<div class="dialogosYesNo" onclick="controlPanel.akiroClaim();" ' +
			'onmouseover="this.style.backgroundColor=\'#FFFF33\';" ' +
			'onmouseout="this.style.backgroundColor=\'#FFFF99\';" ' +
			'style="margin-right: 0px; padding-left: 0px; padding-right: 0px;">';
		html += '<div style="display: inline-block; width: 2.4cm; text-align: center;">' +
			'ΑΚΥΡΟ</div></div>';
		html += '</td></tr></table>';

		Tools.dialogos(html, '4.2cm', '2.0cm');
		controlPanel.claimConfirmation = true;
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
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		if (isTheatis()) { return; }

		if (globals.server != 'http://127.0.0.1/prefadoros/') {
			mainFyi('<span class="lathos">' +
				'Η επανεκκίνηση παρτίδας έχει απενεργοποιηθεί</span>');
			playSound('sfirixtra');
			return;
		}

		if (isDianomi() && (!confirm('Όλες οι διανομές της παρτίδας θα ' +
			'διαγραφούν. Είστε σίγουρος;'))) { return; }

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/neaPartida');
		req.xhr.onreadystatechange = function() {
			controlPanel.energiaCheck(req, ico);
		};

		req.send();
	};

	this.energiaCheck = function(req, ico) {
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
			controlPanel.energiaCheck(req, ico);
		};

		req.send(params);
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
			controlPanel.energiaCheck(req, ico);
		};

		req.send();
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
			controlPanel.energiaCheck(req, ico);
		};

		req.send();
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
			controlPanel.energiaCheck(req, ico);
		};

		req.send();
	};

	this.postelHTML = function() {
		return Trattr.postelIconHTML('controlPanelIcon', controlPanel.mesaExoHTML() +
			'onclick="controlPanel.postel(this);"');
	};

	this.postel = function(ico) {
		Sizitisi.sxolioFocus();
		if (notPartida()) { return; }
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		mainFyi('Αλλαγή πληρωμής τελευταίας αγοράς');

		var req = new Request('trapezi/postel');
		req.xhr.onreadystatechange = function() {
			controlPanel.energiaCheck(req, ico);
		};

		req.send();
	};

	this.exodosHTML = function(id, dp) {
		if (notSet(dp)) { dp = false; }
		var html = '<img ';
		if (id) { html += 'id="pliktroExodos" '; }
		html += 'src="' + globals.server + 'images/controlPanel/exodos.png" ' +
			'class="controlPanelIcon" alt="" title="Έξοδος από το τραπέζι" ' +
			controlPanel.mesaExoHTML() + 'onclick="controlPanel.exodos(this, ' +
			dp + ');" />';
		return html;
	};

	this.exodos = function(ico, dp) {
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

		var req = new Request('trapezi/exodos', false);
		var params = '';
		if (isSet(dp) && dp) { params += 'deleteProsklisi=yes'; }
		req.send(params);

		var rsp = req.getResponse();
		// ico.src = ico.prevSrc;
		mainFyi(rsp);
		if (rsp) {
			errorIcon(ico);
			playSound('beep');
			return;
		}

		if (isSet(Prefadoros)) {
			Prefadoros.egineExodos = true;
			curSet = 'default';
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
			controlPanel.energiaCheck(req, ico);
		};

		params = 'apodoxi=' + (apodoxi ? 'YES' : 'NO');
		params += '&thesi=' + partida.thesi;
		req.send(params);
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
		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';
		mainFyi('Εναλλαγή παίκτη/θεατή σε εξέλιξη. Παρακαλώ περιμένετε…');
		var req = new Request('pektis/pektisTheatis');
		req.xhr.onreadystatechange = function() {
			controlPanel.energiaCheck(req, ico);
		};

		req.send();
	};

	this.idioktisiaHTML = function() {
		if (notPartida()) { return ''; }
		if (partida.thesi != 1) { return ''; }
		return '<img src="' + globals.server + 'images/controlPanel/' +
			(isIdioktito() ? 'elefthero' : 'idioktito') + '.png" title="' +
			controlPanel.idioktisiaTitle() +
			'" class="controlPanelIcon" alt="" ' +
			controlPanel.mesaExoHTML() +
			'onclick="controlPanel.idioktisia(this);" />';
	};

	this.idioktisiaTitle = function() {
		if (isIdioktito()) {
			var tora = 'ΙΔΙΟΚΤΗΤΟ';
			var alagi = 'ΕΛΕΥΘΕΡΟ';
		}
		else {
			tora = 'ΕΛΕΥΘΕΡΟ';
			alagi = 'ΙΔΙΟΚΤΗΤΟ';
		}

		return 'Το τραπέζι είναι ' + tora + '. Κλικ για αλλαγή σε ' + alagi;
	}

	this.idioktisia = function(ico) {
		Sizitisi.sxolioFocus();
		if (!isPartida()) { return; }

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/idioktisia');
		req.xhr.onreadystatechange = function() {
			controlPanel.energiaCheck(req, ico);
		};

		req.send('idioktisia=' + uri(isIdioktito() ? 'ΕΛΕΥΘΕΡΟ' : 'ΙΔΙΟΚΤΗΤΟ'));
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

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/idiotikotita');
		req.xhr.onreadystatechange = function() {
			controlPanel.energiaCheck(req, ico);
		};

		req.send('idiotikotita=' + uri(isPrive() ? 'ΔΗΜΟΣΙΟ' : 'ΠΡΙΒΕ'));
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

		ico.prevSrc = ico.src;
		ico.src = globals.server + 'images/working.gif';

		var req = new Request('trapezi/prosvasi');
		req.xhr.onreadystatechange = function() {
			controlPanel.energiaCheck(req, ico);
		};

		req.send('prosvasi=' + uri(isKlisto() ? 'ΑΝΟΙΚΤΟ' : 'ΚΛΕΙΣΤΟ'));
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
		controlPanel.display('default');
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

var ActiveRadio = new function() {
	var slist = {
		AR:	{
			url: 'http://activeradio.gr:8000/activemp3.m3u',
			tit: 'ActiveRadio'
		},
		DP:	{
			url: 'http://tvradio.ert.gr/radio/liveradio/asx/net.asx',
			tit: 'Δεύτερο πρόγραμμα'
		},
		TP:	{
			url: 'http://tvradio.ert.gr/radio/liveradio/asx/trito.asx',
			tit: 'Τρίτο πρόγραμμα'
		},
		KOSMOS:	{
			url: 'http://tvradio.ert.gr/radio/liveradio/asx/kosmos.asx',
			tit: 'KOSMOS 93.6'
		},
		IFTE:	{
			url: 'http://tvradio.ert.gr/radio/liveradio/asx/era5.asx',
			tit: 'Η φωνή της Ελλάδας'
		},
		REAL:	{
			url: 'http://realfm.live24.gr/realfm',
			tit: 'RealFM'
		},
		BEST:	{
			url: 'http://best.live24.gr/best1222',
			tit: 'Best FM'
		},
		R9:	{
			url: 'http://194.219.46.2:8080/live',
			tit: 'Radio 9'
		},
		KRT:	{
			url: 'http://s1.onweb.gr:8852',
			tit: 'Κρητικός FM 88.7'
		},
		ERTKRT:	{
			url: 'http://www.easyradio.gr/erotokritos/erotokritos.asx',
			tit: 'Ερωτόκριτος FM 87.9'
		},
		AJMM:	{
			url: 'http://player.slipstreamradio.com/player/slipstream/' +
				'accujazz/?channel=Channel9&sub=SubModernJazz',
			tit: 'Modern Mainstream (Jazz)',
			ext: true
		},
		AJSA:	{
			url: 'http://player.slipstreamradio.com/player/slipstream/' +
				'accujazz/?channel=Channel9&sub=SubStraightAhead',
			tit: 'Straight Ahead (Jazz)',
			ext: true
		},
		FMSC:	{
			url: 'http://filtermusic.net/swiss-classic',
			tit: 'Swiss Classic',
			ext: true
		}
	};
	var cur = '';
	var tora = '';
	var ext = null;

	this.attributes = function(div) {
		var attrs = {
			cl: 'controlPanelIcon',
			ti: ('ActiveRadio, live!' + tora)
		};

		if (notSet(div)) { div = getelid('activeRadio'); }
		if (notSet(div)) { return attrs; }
		if (notSet(div.style)) { return attrs; }
		if (notSet(div.style.visibility)) { return attrs; }

		if (div.style.visibility == 'visible') {
			attrs.cl += ' controlPanelPatimeno';
			attrs.ti = 'Απόκρυψη ραδιοφώνου' + tora;
		}
		else if (div.style.visibility == 'hidden') {
			attrs.ti = 'Εμφάνιση ραδιοφώνου' + tora;
		}

		return attrs;
	};

	this.setAttributes = function(div) {
		var p = getelid('activeRadioIcon');
		if (notSet(p)) { return; }

		if (notSet(div)) { div = getelid('activeRadio'); }
		if (notSet(div)) { return; }

		var attrs = this.attributes(div);
		p.setAttribute('class', attrs.cl);
		p.setAttribute('title', attrs.ti);
	};

	this.showRadio = function(station) {
		var x = getelid('activeRadio');
		if (notSet(x)) { return; }

		if (notSet(station)) { station = 'AR'; }
		if (x.innerHTML == '') {
			this.setStation(x, station);
			x.style.visibility = 'visible';
		}
		else if (x.style.visibility != 'visible') { x.style.visibility = 'visible'; }
		else { x.style.visibility = 'hidden'; }

		this.setAttributes(x);
	};

	this.setStation = function(div, station) {
		if (isSet(ext)) {
			try { ext.close(); } catch(e) {};
			ext = null;
		}

		var html = '';
		if (slist.hasOwnProperty(station)) {
			if (notSet(slist[station].ext)) {
				html = '<embed id="activeRadioMediaPlayer" ' +
					'type="application/x-mplayer2" ' +
					'name="activeRadioMediaPlayer" ' +
					'pluginspage="http://www.microsoft.com/Windows/Downloads/' +
					'Contents/Products/MediaPlayer/" src="' +
					slist[station].url + '" ' +
					'transparentatstart="1" autostart="1" ' +
					'animationatstart="0" ' +
					'showcontrols="true" showaudiocontrols="1" ' +
					'showpositioncontrols="0" autosize="1" ' +
					'showstatusbar="1" displaysize="false" ' +
					'title="' + slist[station].tit + '" ' +
					'style="width: 6.8cm; height: 2.0cm;" />';
			}
			else {
				ext = window.open(slist[station].url, '_blank');
				if (isSet(ext)) { ext.focus(); }
			}
		}

		html += this.epilogiHTML('AR');
		html += this.epilogiHTML('DP');
		html += this.epilogiHTML('TP');
		html += this.epilogiHTML('KOSMOS');
		html += this.epilogiHTML('IFTE');
		html += this.epilogiHTML('REAL');
		html += this.epilogiHTML('BEST');
		html += this.epilogiHTML('R9');
		html += this.epilogiHTML('KRT');
		html += this.epilogiHTML('ERTKRT');
		html += this.epilogiHTML('AJMM');
		html += this.epilogiHTML('AJSA');
		html += this.epilogiHTML('FMSC');
		div.innerHTML = html;

		tora = ' (συντονισμένο στο «' + slist[station].tit + '»)';
		cur = station;
	};

	this.epilogiHTML = function(station) {
		if (!slist.hasOwnProperty(station)) { return ''; }
		var html = '';
		html = '<div class="activeRadioStation';
		if (isSet(slist[station].ext)) { html += ' activeRadioStationExternal'; }
		html += '" onclick="ActiveRadio.epilogi(\'' +
			station + '\');" title="Συντονιστείτε στο «' +
			slist[station].tit + '»">' + slist[station].tit + '</div>';
		return html;
	};

	this.epilogi = function(station) {
		var x = getelid('activeRadio');
		if (notSet(x)) { return; }

		if (cur == station) {
			if (!slist.hasOwnProperty(station)) { return; }
			if (notSet(slist[station].ext)) { return; }
			try { ext.focus(); return; } catch(e) {};
		}

		if (!slist.hasOwnProperty(station)) { return; }

		this.setStation(x, station);
		this.setAttributes(x);
	};
};
