var monitor = new function() {
	this.count = 0
	this.errorCount = 0;
	this.successiveErrors = 0;
	this.dotsHTML = '';

	this.updateHTML = function(title, color) {
		var x = getelid('monitorArea');
		if (notSet(x)) { return; }

		monitor.count++;
		if ((monitor.count % 10) == 1) { monitor.dotsHTML = ''; }
		monitor.dotsHTML = '<span title="' + title + '" style="color: ' +
			color + ';">&bull;</span>' + monitor.dotsHTML;

		var html = '<span class="monitorStats" id="monitorStats">' +
			this.statsHTML() + '</span>';
		html += monitor.dotsHTML;
		html += '<span title="Συνεδρία" class="monitorSinedria">' +
			sinedria.kodikos + '</span>';
		html += '#<span title="Ενημέρωση" class="monitorId">' + sinedria.id + '</span>';
		if (monitor.errorCount) {
			html += '#<span title="Λανθασμένες ενημερώσεις" style="color: ' +
				globals.color.error + ';">' + monitor.errorCount + '</span>';
		}

		x.innerHTML = html;
	};

	this.ignore = function() {
		monitor.successiveErrors = 0;
		monitor.updateHTML('Αγνοήθηκαν δεδομένα', '#FFA500');
	};

	this.idia = function() {
		monitor.successiveErrors = 0;
		monitor.updateHTML('Χωρίς αλλαγή', '#85A366');
	};

	this.freska = function() {
		monitor.successiveErrors = 0;
		monitor.updateHTML('Νέα δεδομένα', '#006600');
	};

	this.lathos = function() {
		monitor.errorCount++;
		monitor.successiveErrors++;
		if (monitor.successiveErrors > 3) {
			monitor.successiveErrors = 0;
			alert('too many successive errors');
			location.href = globals.server + 'error.php?minima=' +
				uri('Παρουσιάστηκαν πολλά διαδοχικά σφάλματα ενημέρωσης');
			return;
		}

		monitor.updateHTML('Λανθασμένα δεδομένα', globals.color.error);
	};

	this.statsHTML = function() {
		var nt = 0;
		var np = 0;

		if (isSet(window.trapezi)) {
			for (var i = 0; i < trapezi.length; i++) {
				nt++;
				if (trapezi[i].p1 && isSet(trapezi[i].o1)) { np++; }
				if (trapezi[i].p2 && isSet(trapezi[i].o2)) { np++; }
				if (trapezi[i].p3 && isSet(trapezi[i].o3)) { np++; }
			}
		}

		if (isSet(window.rebelos)) {
			np += rebelos.length;
		}

		html = '';
		if (nt > 0) { html += '<span class="monitorStatsData" title="Τραπέζια">' + nt + '</span>'; }
		if (np > 0) { html += '#<span class="monitorStatsData" title="Παίκτες">' + np + '</span>'; }
		if (isSet(sinedria.load)) {
			html += '#<span class="monitorStatsData';
			if (sinedria.load > 80) {
				html += ' fortos80';
			}
			else if (sinedria.load > 60) {
				html += ' fortos60';
			}
			else if (sinedria.load > 40) {
				html += ' fortos40';
			}
			html += '" title="Φόρτος">' + sinedria.load + '%</span>';
		}
		return html;
	};

	this.displayStats = function() {
		var x = getelid('monitorStats');
		if (notSet(x)) { return; }

		x.innerHTML = this.statsHTML();
	};
};

var Dumprsp = new function() {
	var wdump = null;

	this.onOff = function() {
		isSet(wdump) ? Dumprsp.close() : Dumprsp.open();
	};

	this.setup = function() {
		if (sinedria.dumprsp) { Dumprsp.open(); }
	};

	this.open = function(rsp) {
		if (notSet(wdump)) {
			wdump = window.open(globals.server +
				'lib/dumprsp.php', '_blank',
				'location=0,status=0,titlebar=0,menubar=0,scrollbars=1,' +
				'resizable=0,width=600,height=500,left=200,top=100');
			if (notSet(wdump)) {
				mainFyi('dumprsp: cannot open window');
				return;
			}
		}
	};

	var id = 0;

	this.dump = function(rsp) {
		if (notSet(wdump)) { return; }

		try {
			var p = wdump.document.createElement('div');
			id++;
			p.setAttribute('id', id);
			var d = new Date;
			var html = strTime(d, true) + ' [' + d.getMilliseconds() +
				']<br />' + akirosiScript(rsp) + '<hr />';
			p.innerHTML = html;

			var eod = wdump.document.getElementById('EOD');
			if (isSet(eod)) {
				wdump.document.body.insertBefore(p, eod);
				scrollBottom(wdump.document.body);
			}
		} catch(e) { Dumprsp.reset(); };
	};

	this.lathos = function() {
		if (notSet(wdump)) { return; }
		var p = wdump.document.getElementById(id);
		if (notSet(p)) {
			wdump.document.writeln('Dumprsp.lathos: ' + id + ': id not found');
		}
		else {
			p.style.color = '#FF0000';
		}
	};

	this.ignore = function() {
		if (notSet(wdump)) { return; }
		var p = wdump.document.getElementById(id);
		if (notSet(p)) {
			wdump.document.writeln('Dumprsp.ignore: ' + id + ': id not found');
		}
		else {
			p.style.color = '#668566';
		}
	};

	this.close = function() {
		if (isSet(wdump)) {
			wdump.close();
		}
		Dumprsp.reset();
	};

	this.reset = function() {
		wdump = null;
	};
};

var Tools = new function() {
	this.epilogiHTML = function(msg, onclick, title, cls) {
		var html = '<div class="epilogi';
		if (cls) { html += ' ' + cls; }
		html += '" onmouseover="Tools.epilogiFotise(this);" ' +
			'onmouseout="Tools.epilogiXefotise(this);"';
		if (isSet(title) && title) {
			html += ' title="' + title + '"';
		}
		if (isSet(onclick) && onclick) {
			html += ' onclick="' + onclick + ';"';
		}
		html += '>' + msg + '</div>';
		return html;
	};

	this.epilogiFotise = function(div) {
		div.style.borderStyle = 'outset';

		div.prevBC = div.style.backgroundColor;
		div.style.backgroundColor = '#FFFF00';

		div.prevFW = div.style.fontWeight;
		div.style.fontWeight = 'bold';
	};

	this. epilogiXefotise = function(div) {
		div.style.borderStyle = 'solid';
		div.style.backgroundColor = div.prevBC;
		div.style.fontWeight = div.prevFW;
	};

	this.xromataHTML = function(w) {
		if (notSet(w)) { w = '0.5cm'; }
		var html = '';
		var beg = '<img style="width:' + w + ';" src="' +
			globals.server + 'images/trapoula/xroma';
		var end = '.png" alt="" />';

		html += beg + 'S' + end;
		html += beg + 'D' + end;
		html += beg + 'C' + end;
		html += beg + 'H' + end;

		return html;
	};

	this.miaPrefaHTML = function(space) {
		if (isSet(pektis) && isSet(pektis.system) && pektis.system) { return ''; }
		var html = '<div style="text-align: center; margin-top: 0.2cm;';
		if (isSet(space)) { html += 'padding-bottom: 0.2cm;'; }
		html += '">';
		html += Tools.epilogiHTML('ΜΙΑ ΠΡΕΦΑ ΠΑΡΑΚΑΛΩ!', 'Partida.neoTrapezi();',
			'Στήστε ένα τραπέζι για να παίξετε μια νέα παρτίδα') + '</div>';
		return html;
	};

	this.metalagi = function(img, neo, xronos) {
		if (notSet(xronos)) { xronos = 1500; }
		setTimeout(function() {
			if (notSet(img)) { return; }
			try { img.onload = ''; } catch(e) {};
			if (isSet(neo) && neo) {
				try { img.src = neo; } catch(e) {};
			}
			else {
				try { img.parentNode.removeChild(img); } catch(e) {};
			}
		}, xronos);
	};

	this.decodeAgora = function(xb, apla) {
		var s = '';
		var asoi = xb.substr(0, 1);
		var xroma = xb.substr(1, 1);
		var bazes = xb.substr(2, 1);

		if (isSet(apla) && (bazes < 7)) {
			s += (xroma == 'H' ? 'απλές' : 'απλά');
		}
		else if (bazes in globals.bazesDesc) { s += globals.bazesDesc[bazes]; }
		else { s += '?'; }
		s += ' ';
		if (xroma in globals.xromaDesc) { s += globals.xromaDesc[xroma]; }
		else { s += '?'; }
		if (asoi == 'Y') { s += ' και οι άσοι'; }
		return s;
	}

	this.bazesDecode = function(s) {
		return s == 'T' ? 10 : parseInt(s);
	};

	this.bazesEncode = function(b) {
		return b == 10 ? 'T' : b;
	};

	this.dialogos = function(msg, y, x) {
		var d = getelid('dialogos');
		if (notSet(d)) { return; }

		if (notSet(msg)) {
			msg = 'Το αίτημά σας έχει υποβληθεί.<br />Παρακαλώ περιμένετε…';
		}

		d.innerHTML = msg;
		d.style.display = 'inline';
		if (isSet(y)) { d.style.top = y; }
		if (isSet(x)) { d.style.left = x; }
		d.zIndex = 1;
	};

	this.dialogosClear = function() {
		var x = getelid('dialogos');
		if (notSet(x)) { return; }

		x.style.display = 'none';
		x.style.top = '5.5cm';
		x.zIndex = 0;
	};
};

// Ακολουθούν μέθοδοι και πεδία σχετικά με το προφίλ των παικτών.
// Το προφίλ του παίκτη είναι ένα σύνολο πληροφοριών που έχει
// εισαγάγει ο παίκτης και επιθυμεί να γνωρίζουμε. Μπορεί, π.χ.
// να μας εξηγεί πώς παίζει, τι συμβάσεις ακολουθεί κλπ.
// Κάνοντας κλικ στο σχετικό εικονίδιο, μπορούμε να διαβάσουμε
// τις πληροφορίες αυτές. Μπορούμε, ακόμη, να προσθέσουμε
// δικές μας, προσωπικές, πληροφορίες σχετικές με τον συγκεκριμένο
// παίκτη, π.χ. το τι πρέπει να προσέχουμε, κάποιον αριθμό
// τηλεφώνου κλπ. Αυτές οι προσωπικές πληροφορίες δεν δημοσιοποιούνται.

var Profinfo = new function() {
	// Η παρακάτω μεταβλητή κρατάει τον παίκτη του οποίου το προφίλ
	// είναι ανοικτό την οποιαδήποτε χρονική στιγμή.

	var curPektis = null;

	// Η μέθοδος που ακολουθεί καλείται όταν κάνουμε κλικ στο
	// εικονίδιο εμφάνισης/διαχείρισης προφίλ παίκτη.

	this.dixe = function(e, login, thesi, img) {
		stopProp(e);

		var fyi = 'παίκτης: ' + login;
		if (isSet(thesi)) { fyi += ', θέση: ' + thesi; }
		mainFyi(fyi);

		var x = getelid('profinfo');
		if (notSet(x)) { return; }

		// Αν ήδη το προφίλ του παίκτη είναι ανοικτό, τότε
		// το κλείνουμε.

		if (curPektis == login) {
			this.klise(x);
			return;
		}

		var src = img.src;
		img.src = globals.server + 'images/working.gif';

		var req = new Request('profinfo/getInfo');
		req.xhr.onreadystatechange = function() {
			Profinfo.getInfoCheck(req, login, x, img, src);
		};

		var params = 'pektis=' + uri(login);
		req.send(params);
	};

	this.getInfoCheck = function(req, login, div, img, src) {
		if (req.xhr.readyState != 4) { return; }
		img.src = src;
		var rsp = req.getResponse();

		// Η πληροφορία που μας έχει επιστραφεί πρέπει να έχει την
		// εξής μορφή:
		//
		//	login tab name tab status tab mine tab pektis tab
		//
		// όπου "login" είναι το login name του παίκτη, name είναι το
		// όνομα του παίκτη, "status" είναι η σχέση μας με τον παίκτη
		// "mine" είναι κείμενο δικό μας για τον παίκτη, "pektis" είναι
		// το προφίλ του παίκτη και tab είναι ο χαρακτήρας tab.

		var x = rsp.split('\t');
		if (x.length != 8) {
			errorIcon(img);
			return;
		}

		// Εφόσον όλα πήγαν καλά, εμφανίζω το προφίλ του παίκτη με
		// όλα τα σχετικά εργαλεία και κρατώ το όνομά του.

		div.innerHTML = this.HTML(login, x[0], x[1], x[2], x[3], x[4], x[5], x[6]);
		div.style.display = 'inline';
		curPektis = login;
	};

	// Η επόμενη μέθοδος καλείται όταν βάζουμε ή βγάζουμε το ποντίκι μας
	// στο εικονίδιο πληροφοριών προφίλ του παίκτη. Βάζοντας το ποντίκι
	// επάνω στο σχετικό εικονίδιο, εμφανίζεται περίληψη του προφίλ στο
	// fyi πεδίο στο επάνω μέρος της οθόνης, ενώ βγάζοντας το ποντίκι μας
	// από την εν λόγω περιοχή, καθαρίζει το fyi πεδίο. Ως παρενέργεια
	// μεταβάλλεται και ο βαθμός διαφάνειας του εικονιδίου, αλλά μόνον
	// εφόσον έχει περαστεί το εικονίδιο.

	this.omo = function(login, thesi, dixe, img) {
		if (dixe) {
			if (isSet(img)) {
				try { img.style.opacity = 1.0; } catch(e) {};
				try { img.filters.alpha.opacity = 100; } catch(e) { };
			}

			var fyi = 'παίκτης: ' + login;
			if (isSet(thesi)) { fyi += ', θέση: ' + thesi; }
			mainFyi(fyi);
		}
		else {
			if (isSet(img)) {
				try { img.style.opacity = 0.6; } catch(e) {};
				try { img.filters.alpha.opacity = 60; } catch(e) { };
			}
			mainFyi();
		}
	};

	// Η μέθοδος που ακολουθεί επιστρέφει HTML κώδικα για το προφίλ του παίκτη.
	// Στον κώδικα περιέχεται πλήκτρο κλεισίματος, επικεφαλίδα, το δικό μας
	// κείμενο, το κείμενο του παίκτη και τα πλήκτρα διαχείρισης.

	this.HTML = function(login, onoma, dianomes, moros, rank, filos, mine, pektis) {
		var html = '';
		html += '<img class="profinfoClose" src="' + globals.server + 'images/Xgrey.png" ' +
			'title="Κλείσιμο" alt="" onclick="Profinfo.klise(this.parentNode);" />';
		html += '<img id="profinfoPhoto" class="profinfoPhoto" src="' + globals.server +
			'photo/' + (login.substr(0, 1)).toLowerCase() + '/' + login + '.jpg" ' +
			'alt="" />';

		html += '<div class="profinfoHeader" title="Μετακίνηση φόρμας" ' +
			'onmousedown="Profinfo.grab(event, this);">';
		html += 'Παίκτης: <span class="profinfoHeaderData';
		switch (filos) {
		case 'ΦΙΛΟΣ':
			html += ' sxesiFilos';
			break;
		case 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ':
			html += ' sxesiApoklismenos';
		default:
			html += ' sxesiAsxestos';
			break;
		}
		html += '" onmouseover="Profinfo.photo(true);" ' +
			'onmouseout="Profinfo.photo(false);">' + login + '</span>';
		html += ' [ <span class="profinfoHeaderData" style="color: #003366;">' + onoma + '</span> ]';
		if (dianomes) {
			html += '<div class="profinfoStats" title="Στατιστικά στοιχεία">[ ' +
				'<span class="profinfoHeaderData" title="Πλήθος παιγμένων διανομών" ' +
				'style="color: #003366;">' + dianomes + '</span>#' +
				'<span title="Μουαγέν σε καπίκια">' + moros + '</span>';
			if (rank) {
				html += '#<span class="profinfoHeaderData" title="Βαθμολογία"' +
					'style="color: ' + (rank > 0 ? 'green' : 'red') + ';">' +
					rank + '</span>';
			}
			html += ' ]</div>';
		}
		html += '</div>';

		html += '<div id="profinfoInput" class="profinfoInput">';
		html += '<textarea id="profinfoInputText" style="width: 16.1cm; height: 4.8cm;">';
		html += mine;
		html += '</textarea>';
		html += '</div>';

		html += '<div id="profinfoArea" class="profinfoArea">';
		html += '<div id="profinfoMine" class="profinfoMine">';
		html += this.mineHTML(mine);
		html += '</div>';
		html += '<div class="profinfoPektis">' + this.decode(pektis) + '</div>';
		html += '</div>';

		html += '<div id="profinfoButtonArea" class="profinfoButtonArea">';
		html += this.editHTML(login, mine);
		html += '</div>';

		return html;
	};

	this.photo = function(dixe) {
		var x = getelid('profinfoPhoto');
		if (notSet(x)) { return; }
		setOpacity(x, dixe ? 100 : 0);
	};

	var profinfoDiv = null;
	var profinfoArea = null;
	var x0 = 0;
	var y0 = 0;
	var l0 = 0;
	var t0 = 0;

	this.grab = function(e, div) {
		if (notSet(e)) { e = window.event; }
		stopProp(e);

		// Κατά το άφημα της φόρμας δεν περνάμε division

		if (notSet(div)) {
			document.onselectstart = null;
			document.onmousemove = null;
			document.onmouseup = null;
			x0 = 0;
			y0 = 0;
			l0 = 0;
			t0 = 0;
			profinfoDiv = null;
			if (isSet(profinfoArea)) {
				try { profinfoArea.setAttribute('class', 'profinfoArea'); }
					catch(e) {};
				profinfoArea = null;
			}
			return;
		}

		// Έχει περαστεί division, επομένως είμαστε στη φάση που έχουμε
		// πατήσει το ποντίκι στην περιοχή επικεφαλίδας για μετακίνηση
		// της φόρμας πληροφοριών προφίλ.

		document.onselectstart = function() { return false; };
		profinfoDiv = div.parentNode;
		profinfoDiv.style.top = (t0 = profinfoDiv.offsetTop) + 'px';
		profinfoDiv.style.left = (l0 = profinfoDiv.offsetLeft) + 'px';
		x0 = e.clientX;
		y0 = e.clientY;
		profinfoArea = getelid('profinfoArea');
		if (isSet(profinfoArea)) {
			profinfoArea.setAttribute('class', 'profinfoArea selectOff');
		}
		document.onmousemove = function(e) {
			Profinfo.move(e);
		};
		document.onmouseup = function(e) {
			Profinfo.grab(e);
		};
	};

	this.move = function(e) {
		if (notSet(e)) { e = window.event; }
		stopProp(e);

		if (notSet(profinfoDiv)) { return; }

		profinfoDiv.style.top = (t0 + e.clientY - y0) + 'px';
		profinfoDiv.style.left = (l0 + e.clientX - x0) + 'px';
	};

	this.mineHTML = function(txt) {
		if (!txt) {
			return '<div class="profinfoHelp">' +
				'Συμπληρώσετε τις προσωπικές σας παρατηρήσεις</div>';
		}
		return this.decode(txt);
	};

	this.decode = function(s) {
		return s.replace(/(\r\n|\n|\r)/gm, '<br />');
	};

	this.editHTML = function(login, mine) {
		var html = '';
		html += '<button type="button" onclick="Profinfo.edit(\'' +
			login + '\');">' + (mine ? 'Διόρθωση' : 'Σχόλια') + '</button>';
		if (login != pektis.login) {
			html += '<button type="button" onclick="Sxesi.permesWindow(\'' +
				login + '\');">Μήνυμα</button>';
			try {
				if (dikeomaProsklisis()) {
					html += '<button type="button" onclick="Sxesi.addProsklisi(\'' +
						login + '\');">Πρόσκληση</button>';
				}
			} catch(e) {}
		}
		html += '<button type="button" onclick="Profinfo.klise(this.parentNode.' +
			'parentNode);">Άκυρο</button>';
		return html;
	};

	this.edit = function(login) {
		var x = getelid('profinfoArea');
		if (notSet(x)) { return; }
		var y = getelid('profinfoInput');
		if (notSet(y)) { return; }
		var t = getelid('profinfoInputText');
		if (notSet(t)) { return; }
		var z = getelid('profinfoButtonArea');
		if (notSet(z)) { return; }

		// Εδώ μειώνουμε το χώρο εμφάνισης και εμφανίζουμε το πεδίο
		// εισαγωγής/διόρθωσης των προσωπικών μας παρατηρήσεων.

		x.style.height = '4.0cm';
		x.style.top = '5.8cm';
		y.style.height = '5.0cm';
		y.style.display = 'inline';

		var html = '<button type="button" onclick="Profinfo.save(\'' +
			login + '\');">Αποθήκευση</button>';
		html += '<button type="button" onclick="Profinfo.cancel(\'' +
			login + '\');">Άκυρο</button>';
		z.innerHTML = html;
		t.focus();
	};

	this.save = function(login) {
		var x = getelid('profinfoInputText');
		if (notSet(x)) { return; }

		x.value = x.value.trim();
		var req = new Request('profinfo/setInfo');
		req.xhr.onreadystatechange = function() {
			Profinfo.setInfoCheck(req, login, x.value);
		};

		var params = 'pektis=' + uri(login) + '&kimeno=' + uri(x.value);
		req.send(params);
	};

	this.setInfoCheck = function(req, login, txt) {
		if (req.xhr.readyState != 4) { return; }
		var rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
			playSound('beep');
			return;
		}

		var x = getelid('profinfoMine');
		if (notSet(x)) { return; }

		x.innerHTML = this.mineHTML(txt);
		this.cancel(login, txt);
	};

	this.cancel = function(login, txt) {
		var x = getelid('profinfoArea');
		if (notSet(x)) { return; }
		var y = getelid('profinfoInput');
		if (notSet(y)) { return; }
		var z = getelid('profinfoButtonArea');
		if (notSet(z)) { return; }

		x.style.height = '9.0cm';
		x.style.top = '0.8cm';
		y.style.display = 'none';
		y.style.height = '0px';

		z.innerHTML = this.editHTML(login, txt);
	};

	this.klise = function(div) {
		div.style.display = 'none';
		curPektis = null;
	};
};

var FiloPaleta = new function() {
	var piasmeno = false;

	this.onOff = function(e, dixe) {
		stopProp(e);
		piasmeno = false;
		Sizitisi.sxolioFocus();
		var x = getelid('filoPaleta');
		if (notSet(x)) { return; }

		if (!x.innerHTML) { x.innerHTML = this.HTML(); }
		if (isSet(dixe)) { x.style.display = dixe ? 'inline' : 'none'; }
		else { x.style.display = x.style.display == 'inline' ? 'none' : 'inline'; }
	};

	this.HTML = function() {
		var html = '';
		var xroma = [ 'N', 'H', 'D', 'C', 'S' ];
		var axia = [ '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];

		for (var i = 1; i < xroma.length; i++) {
			html += '<div class="filoPaletaFili">';
			for (var j = 0; j < axia.length; j++) {
				html += '<img class="filoPaletaIcon" alt="" src="' +
					globals.server + 'images/trapoula/' + xroma[i] + axia[j] +
					'.png" ' + 'onmousedown="FiloPaleta.sizitisi(event, \'' +
					xroma[i] + '\', \'' + axia[j] + '\');" title="" />';
			}
			html += '</div>';
		}

		html += '<div class="filoPaletaFili">';
		for (i = xroma.length - 1; i >= 0; i--) {
			html += '<img class="filoPaletaIcon" alt="" src="' + globals.server +
				'images/trapoula/xroma' + xroma[i] + '.png" title="" ' +
				'onmousedown="FiloPaleta.sizitisi(event, \'' + xroma[i] + '\');" />';
		}
		html += '<img class="filoPaletaIcon" alt="" src="' + globals.server +
			'images/lineBreak.png" title="Αλλαγή γραμμής" ' +
			'onmousedown="FiloPaleta.sizitisi(event, \'~\');" />';
		html += '</div>';

		html += '<img src="' + globals.server + 'images/Xgrey.png" alt="" ' +
			'title="Απόκρυψη παλέτας χρωμάτων και φύλλων" ' +
			'onmousedown="FiloPaleta.onOff(event, false);" ' +
			'style="position: absolute; bottom: 0.2cm; left: 0.2cm; ' +
			'width: 0.6cm; cursor: pointer;" />';

		return html;
	};

	this.sizitisi = function(e, xroma, axia) {
		if (notSet(e)) { e = window.event; }
		stopProp(e);
		piasmeno = false;

		var x = getelid('sxolioInput');
		if (notSet(x)) { return; }

		x.value += '^';
		if (isSet(axia)) { x.value += axia; }
		x.value += xroma + '^';
		Sizitisi.parousiasi(x);
		setTimeout(function() { try { x.focus(); } catch(e) {} }, 10);
	};

	var mx0 = 0;
	var my0 = 0;
	var x0 = 0;
	var y0 = 0;

	this.piase = function(e) {
		if (notSet(e)) { e = window.event; }
		stopProp(e);
		piasmeno = true;
		var x = getelid('filoPaleta');
		if (notSet(x)) { return; }

		document.onselectstart = function() { return false; };
		document.onmouseup = function(e) { FiloPaleta.ase(e, x); };
		document.onmousemove = function(e) { FiloPaleta.move(e, x); };

		mx0 = e.clientX;
		my0 = e.clientY;
		x0 = x.offsetLeft;
		y0 = x.offsetTop;

		x.style.left = x0 + 'px';
		x.style.top = y0 + 'px';
		x.style.bottom = 'auto';
	};

	this.move = function(e, div) {
		if (notSet(e)) { e = window.event; }
		try {
			div.style.left = (x0 + e.clientX - mx0) + 'px';
			div.style.top = (y0 + e.clientY - my0) + 'px';
		} catch(e) {}
	};

	this.ase = function(e, div) {
		if (notSet(e)) { e = window.event; }
		stopProp(e);
		document.onselectstart = null;
		document.onmouseup = null;
		document.onmousemove = null;
		Sizitisi.sxolioFocus();
		if (!piasmeno) { return; }
		try {
			div.style.borderWidth = '2px 1px 1px 2px';
		} catch(e) {}
	};
};

var Motto = new function() {
	var mottoDiv = null;
	var lcur = null;
	var tcur = null;
	var bi = [
		"bez.jpg",
		"marmaro.jpg",
		"prasino.jpg",
		"gramatosimo.jpg",
		"pergamini.jpg",
		"xartoni.jpg"
	];

	var antigrafi = false;
	var copybuf = false;

	this.dixe = function(motto) {
		antigrafi = false;
		copybuf = false;
		mottoDiv = getelid('motto');
		if (notSet(mottoDiv)) { return; }

		var html = '';
		html += '<div>';
		html += motto.text;
		html += '</div>';
		html += '<div class="mottoAuthor">';
		html += motto.author;
		html += '</div>';
		html += '<div class="mottoCopy" title="Κλικ για δυνατότητα αντιγραφής κειμένου" ' +
			'onmouseover="Motto.copy(this, true);" onmouseout="Motto.copy(this, false);" ' +
			'onclick="Motto.copyData(event, this);">';
		html += 'Αντιγραφή';
		html += '</div>';
		html += '<textarea id="mottoBuffer" class="mottoBuffer" title="Copy motto">' +
			motto.buffer + '</textarea>';

		mottoDiv.innerHTML = html;
		mottoDiv.style.backgroundImage = 'url(' + globals.server + 'images/motto/' +
			bi[Math.floor(Math.random() * bi.length)] + ')';
		mottoDiv.style.left = isSet(lcur) ? lcur + 'px' : ((Math.random() * 4) + 0.5) + 'cm';
		mottoDiv.style.top = isSet(tcur) ? tcur + 'px' : ((Math.random() * 4) + 5) + 'cm';
		mottoDiv.style.display = 'inline';
		mottoDiv.onmousedown = function(e) {
			if (notSet(e)) { e = window.event; }
			Motto.piase(e);
		};
		mottoDiv.onmouseup = function(e) {
			if (notSet(e)) { e = window.event; }
			Motto.ase(e);
		};
		document.onmousemove = function(e) {
			if (notSet(e)) { e = window.event; }
			Motto.move(e);
		};
	};

	this.copy = function(div, dixe) {
		if (dixe) {
			setOpacity(div, 70);
			antigrafi = true;
		}
		else {
			setOpacity(div, 0);
			antigrafi = false;
		}
	};

	this.copyData = function(e, div) {
		stopProp(e);
		this.copy(div, false);
		copybuf = !copybuf;

		var x = getelid('mottoBuffer');
		if (notSet(x)) { return; }

		if (copybuf) {
			x.style.display = 'inline';
			x.select();
		}
		else {
			x.style.display = 'none';
		}
	};

	var ts = null;
	var l0 = 0;
	var t0 = 0;
	var x0 = 0;
	var y0 = 0;

	this.piase = function(e) {
		if (antigrafi) { return; }
		if (copybuf) { return; }
		document.onselectstart = function() { return false; };
		mottoDiv.style.cursor = 'move';
		mottoDiv.setAttribute('class', 'motto selectOff');
		mottoDiv.style.display = 'inline';
		mottoDiv.style.top = (t0 = mottoDiv.offsetTop) + 'px';
		mottoDiv.style.left = (l0 = mottoDiv.offsetLeft) + 'px';
		ts = (new Date()).getTime();
		x0 = e.clientX;
		y0 = e.clientY;
	};

	this.ase = function(e) {
		if (antigrafi) { return; }
		if (copybuf) { return; }
		document.onselectstart = null;
		mottoDiv.style.cursor = 'pointer';
		var klise = false;
		if (isSet(ts)) {
			if (((new Date()).getTime() - ts) < 200) {
				klise = true;
			}
			ts = null;
		}

		if (klise) { this.klise(); }
	};

	this.move = function(e) {
		if (notSet(ts)) { return; }
		if (notSet(e)) { e = window.event; }

		if (notSet(mottoDiv)) { return; }

		mottoDiv.style.top = (tcur = (t0 + e.clientY - y0)) + 'px';
		mottoDiv.style.left = (lcur = (l0 + e.clientX - x0)) + 'px';
	};

	this.klise = function() {
		try { mottoDiv.style.display = 'none'; } catch(e) { return; }
		document.onselectstart = null;
		document.onmousemove = null;
		document.onmouseup = null;
		ts = null;
	};
};
