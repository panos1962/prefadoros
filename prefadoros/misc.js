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

Profinfo = new function() {
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
		if (x.length != 5) {
			errorIcon(img);
			return;
		}

		// Εφόσον όλα πήγαν καλά, εμφανίζω το προφίλ του παίκτη με
		// όλα τα σχετικά εργαλεία και κρατώ το όνομά του.

		div.innerHTML = this.HTML(login, x[0], x[1], x[2], x[3]);
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

	this.HTML = function(login, onoma, filos, mine, pektis) {
		var html = '<img class="profinfoClose" src="' + globals.server + 'images/Xgrey.png" ' +
			'title="Κλείσιμο" alt="" onclick="Profinfo.klise(this.parentNode);" />';

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
		html += '">' + login + '</span>';
		html += ' [ <span class="profinfoHeaderData" style="color: #003366;">' + onoma + '</span> ]';
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
			window.document.body.onmousemove = null;
			window.document.body.onmouseup = null;
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

		profinfoDiv = div.parentNode;
		profinfoDiv.style.top = (t0 = profinfoDiv.offsetTop) + 'px';
		profinfoDiv.style.left = (l0 = profinfoDiv.offsetLeft) + 'px';
		x0 = e.clientX;
		y0 = e.clientY;
		profinfoArea = getelid('profinfoArea');
		if (isSet(profinfoArea)) {
			profinfoArea.setAttribute('class', 'profinfoArea profinfoAreaSelectOff');
		}
		window.document.body.onmousemove = function(e) {
			Profinfo.move(e);
		};
		window.document.body.onmouseup = function(e) {
			Profinfo.grab(e);
		};
	};

	this.move = function(e) {
		if (notSet(e)) { e = window.event; }
		stopProp(e);

		if (notSet(profinfoDiv)) {
			mainFyi('asdad');
			return;
		}

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
			login + '\');">' + (mine ? 'Διόρθωση' : 'Εισαγωγή') + '</button>';
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
