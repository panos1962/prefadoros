var Permes = new function() {
	this.apostoli = function(fixed) {
		var msg = getelid('permesInput');
		if (notSet(msg) || notSet(msg.value) || ((msg.value = msg.value.trim()) == '')) {
			alert('Δεν υπάρχει μήνυμα για αποστολή');
			msg.value = '';
			msg.focus();
			return false;
		}
		var pros = getelid('paraliptis');
		if (notSet(pros) || notSet(pros.value) || ((pros.value = pros.value.trim()) == '')) {
			alert('Ακαθόριστος παραλήπτης');
			msg.focus();
			return false;
		}

		var req = new Request('permes/apostoli');
		req.xhr.onreadystatechange = function() {
			apostoliCheck(req, msg, pros);
		};

		var params = 'pros=' + uri(pros.value) + '&minima=' + uri(msg.value);
		req.send(params);
	};

	function apostoliCheck(req, msg, pros) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		if (rsp) {
			formaFyi('Απέτυχε η αποστολή του μηνύματος');
		}
		else {
			formaFyi('Το μήνυμά σας έχει αποσταλεί');
			Permes.refresh();
			pros.value = '';
		}

		pros.focus();
		return false;
	};

	this.reset = function() {
		var x = getelid('permesInput');
		if (notSet(x) || notSet(x.value) || (x.value.trim() == '')) {
			x.value = '';
			x.focus();
			return false;
		}
		if (!confirm('Το μήνυμά σας δεν έχει αποσταλεί. ' +
			'Θέλετε πράγματι να το διαγράψετε;')) {
			x.focus();
			return false;
		}
		x.value = '';
		x.focus();
		return false;
	};

	this.cancel = function(fixed) {
		if (notSet(fixed)) { fixed = false; }
		if (fixed) { return exitChild(); }

		var x = getelid('formaApostolis');
		if (isSet(x) && isSet(x.style)) {
			x.style.display = 'none';
		}
		return false;
	};

	this.refresh = function(ie) {
		var x = getelid('minimata');
		if (notSet(x)) { return; }

		x.innerHTML = '<img src="' + globals.server + 'images/working.gif" ' +
			'alt="" />';

		var exer = getelid('exer');
		if (notSet(exer)) { return; }

		var iser = getelid('iser');
		if (notSet(iser)) { return; }

		if ((!exer.checked) && (!iser.checked)) {
			if (ie == 'iser') {
				exer.checked = true;
			}
			else {
				iser.checked = true;
			}
		}

		var params = 'dummy=yes';
		if (exer.checked) { params += '&exer=yes'; }
		if (iser.checked) { params += '&iser=yes'; }

		var req = new Request('permes/refresh');
		req.xhr.onreadystatechange = function() {
			Permes.refreshCheck(req, x);
		};

		req.send(params);
	};

	this.refreshCheck = function(req, x) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		x.innerHTML = rsp;
		return false;
	};

	this.sinthesi = function(paraliptis) {
		var x = getelid('formaApostolis');
		if (isSet(x) && isSet(x.style)) {
			x.style.display = 'block';
		}

		var p = getelid('paraliptis');
		if (notSet(p)) { return false; }
		var m = getelid('permesInput');
		if (notSet(m)) { return false; }
		if (isSet(paraliptis)) {
			p.value = paraliptis;
			m.focus();
		}
		else {
			p.focus();
		}
	};

	this.diagrafi = function(img, minima) {
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('permes/diagrafi');
		req.xhr.onreadystatechange = function() {
			Permes.diagrafiCheck(req, img, minima);
		};

		req.send('minima=' + uri(minima));
	};

	this.diagrafiCheck = function(req, img, minima) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
			img.src = globals.server + 'images/X.png';
			playSound('beep');
			setTimeout(function() { img.src = img.prevSrc; }, 1000);
		}
		else {
			var x = getelid('minima' + minima);
			if (isSet(x)) { sviseNode(x); }
			img.src = img.prevSrc;
		}
	};

	this.katastasi = function(img, minima, nea) {
		img.prevSrc = img.src;
		img.src = globals.server + 'images/working.gif';
		var req = new Request('permes/katastasi');
		req.xhr.onreadystatechange = function() {
			Permes.katastasiCheck(req, img, minima, nea);
		};

		req.send('minima=' + uri(minima) + '&katastasi=' + uri(nea));
	};

	this.katastasiCheck = function(req, img, minima, nea) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
			img.src = globals.server + 'images/X.png';
			playSound('beep');
			setTimeout(function() { img.src = img.prevSrc; }, 1000);
		}
		else {
			var t = getelid('text' + minima);
			if (isSet(t)) {
				if (nea == 'ΝΕΟ') {
					t.setAttribute('class', '');
					img.src = globals.server + 'images/important.png';
					img.onclick = function() {
						Permes.katastasi(img, minima, 'ΔΙΑΒΑΣΜΕΝΟ');
					};
					img.title = 'Νέο!';

				}
				else {
					t.setAttribute('class', 'permesDiavasmeno');
					img.src = globals.server + 'images/controlPanel/check.png';
					img.onclick = function() {
						Permes.katastasi(img, minima, 'ΝΕΟ');
					};
					img.title = 'Διαβάστηκε';
				}
			}
		}
	};
};

window.onload = function() {
	init();
	var x = getelid('permesInput');
	if (isSet(x)) {
		x.value = '';
		try { x.focus(); } catch(e) {};
	}

	var x = getelid('minimata');
	if (isSet(x)) {
		Permes.refresh();
	}
};
