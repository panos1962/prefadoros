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

		var html = '<span title="Συνεδρία" class="monitorSinedria">' +
			sinedria.kodikos + '</span>';
		html += '#<span title="Ενημέρωση" class="monitorId">' + sinedria.id + '</span>';
		if (monitor.errorCount) {
			html += '#<span title="Λανθασμένες ενημερώσεις" style="color: ' +
				globals.color.error + ';">' + monitor.errorCount + '</span>';
		}
		x.innerHTML =  monitor.dotsHTML + html;
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
			var html = strTime(d, true) +
				' [' + d.getMilliseconds() + ']<br />' + rsp + '<hr />';
			p.innerHTML = html;

			var eod = wdump.document.getElementById('EOD');
			if (isSet(eod)) {
				wdump.document.body.insertBefore(p, eod);
				scrollBottom(wdump.document.body);
			}
		} catch(e) { Dumprsp.reset };
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

		div.prevFC = div.style.color;
		div.style.color = '#001429';

		div.prevFW = div.style.fontWeight;
		div.style.fontWeight = 'bold';
	};

	this. epilogiXefotise = function(div) {
		div.style.borderStyle = 'solid';
		div.style.backgroundColor = div.prevBC;
		div.style.color = div.prevFC;
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
			if (isSet(neo) && neo) { img.src = neo; }
			else { img.parentNode.removeChild(img); }
		}, xronos);
	};

	this.decodeAgora = function(xb) {
		var s = '';
		var asoi = xb.substr(0, 1);
		var xroma = xb.substr(1, 1);
		var bazes = xb.substr(2, 1);

		if (bazes in globals.bazesDesc) { s += globals.bazesDesc[bazes]; }
		else { s += '?'; }
		s += ' ';
		if (xroma in globals.xromaDesc) { s += globals.xromaDesc[xroma]; }
		else { s += '?'; }
		if (asoi == 'Y') { s += ' και οι άσοι'; }
		return s;
	}
}
