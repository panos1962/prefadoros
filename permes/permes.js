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
			formaFyi('Το μήνυμά σας έχει σταλεί');
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
		if (!confirm('Το κείμενο που έχετε γράψει θα καθαριστεί. ' +
			'Είστε σίγουρος ότι αυτό θέλετε να κάνετε;')) {
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
		if (!confirm('Προτίθεστε να εξέλθετε από τη φόρμα αποστολής ' +
			'προσωπικών μηνυμάτων. Είστε σίγουρος ότι αυτό θέλετε ' +
			'να κάνετε;')) {
			x.focus();
			return false;
		}
		return exitChild();
	};
};

window.onload = function() {
	init();
	var x = getelid('permesInput');
	if (isSet(x)) {
		x.focus();
	}
};
