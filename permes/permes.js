var Permes = new function() {
	this.apostoli = function(paraliptis) {
		var x = getelid('permesInput');
		if (notSet(x) || notSet(x.value) || ((x.value = x.value.trim()) == '')) {
			alert('Δεν υπάρχει μήνυμα για αποστολή');
			x.value = '';
			x.focus();
			return false;
		}
		if (notSet(Permes.paraliptis)) {
			alert('Ακαθόριστος παραλήπτης');
			x.focus();
			return false;
		}

		var req = new Request('permes/apostoli');
		req.xhr.onreadystatechange = function() {
			apostoliCheck(req, x);
		};

		var params = 'pros=' + uri(Permes.paraliptis) +
			'&minima=' + uri(x.value);
		req.send(params);
	};

	function apostoliCheck(req, msg) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		if (rsp) {
			mainFyi(rsp);
			formaFyi('Απέτυχε η αποστολή του μηνύματος');
		}
		else {
			formaFyi('Το μήνυμά σας έχει αποσταλεί');
		}

		msg.value = '';
		msg.focus();
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

	this.cancel = function() {
		var x = getelid('permesInput');
		if (notSet(x) || notSet(x.value) || (x.value.trim() == '')) {
			return exitChild();
		}
		if (!confirm('Το μήνυμά σας δεν έχει αποσταλεί. Θέλετε ' +
			'πράγμαται να εξέλθετε από τη φόρμα αποστολής ' +
			'προσωπικών μηνυμάτων;')) {
			x.focus();
			return false;
		}
		return exitChild();
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
			refreshCheck(req, x);
		};

		req.send(params);
	};

	function refreshCheck(req, x) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		x.innerHTML = rsp;
		return false;
	};
};

window.onload = function() {
	init();
	var x = getelid('permesInput');
	if (isSet(x)) {
		x.value = '';
		x.focus();
	}

	var x = getelid('minimata');
	if (isSet(x)) {
		Permes.refresh();
	}
};
