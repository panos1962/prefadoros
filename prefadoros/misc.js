var monitor = new function() {
	this.count = 0
	this.errorCount = 0;
	this.successiveErrors = 0;
	this.dotsHTML = '';

	this.updateHTML = function(title, color) {
		var x = getelid('monitorArea');
		if (notSet(x)) { return; }

		var statsHTML = '<span class="monitorStats" id="monitorStats"></span>';

		monitor.count++;
		if ((monitor.count % 10) == 1) { monitor.dotsHTML = ''; }
		monitor.dotsHTML = '<span title="' + title + '" style="color: ' +
			color + ';">&bull;</span>' + monitor.dotsHTML;

		var html = '<span title="Συνεδρία" class="monitorSinedria">' +
			sinedria.kodikos + '</span>';
		html += '#<span title="Ενημέρωση" class="monitorId">' + sinedria.id + '</span>';
		if (monitor.errorCount) {
			html += '#<span title="Λανθασμένες ενημερώσεις" style="color: ' +
				globals.color.error + ';">' + monitor.errorCount + '</span>';
		}

		x.innerHTML =  statsHTML + monitor.dotsHTML + html;
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

	this.displayStats = function() {
		var x = getelid('monitorStats');
		if (notSet(x)) { return; }

		var html = '';
		var nt = 0;
		var np = 0;

		if (isSet(window.trapezi)) {
			for (var i = 0; i < trapezi.length; i++) {
				nt++;
				if (isSet(trapezi[i].p1)) { np++; }
				if (isSet(trapezi[i].p2)) { np++; }
				if (isSet(trapezi[i].p3)) { np++; }
			}
		}

		if (isSet(window.rebelos)) {
			np += rebelos.length;
		}

		x.innerHTML = '<span class="monitorStatsData" title="Τραπέζια">' + nt +
			'</span>#<span class="monitorStatsData" title="Παίκτες">' + np + '</span>';
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
}
