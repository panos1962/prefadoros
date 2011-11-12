var account = {};

account.onload = function() {
	var CLOTimer = null;

	this.checkLoginOnline = function(fld) {
		if (isSet(CLOTimer)) {
			clearTimeout(CLOTimer);
		}

		CLOTimer = setTimeout(function() {
			account.loginAvailable(fld);
		}, 200);
	};

	this.loginAvailable = function(fld) {
		if (!account.checkLoginValue(fld)) {
			fld.style.color = globals.color.ok;
			return;
		}

		var req = new Request('account/loginAvailable');
		req.xhr.onreadystatechange = function() {
			account.loginAvailableCheck(req, fld);
		};

		var params = 'login=' + uri(fld.value);
		req.send(params);
	};

	this.loginAvailableCheck = function(req, fld) {
		if (req.xhr.readyState != 4) {
			return;
		}

		rsp = req.getResponse();
		if (rsp) {
			formaFyi(rsp);
			fld.style.color = globals.color.error;
		}
		else {
			formaFyi();
			fld.style.color = globals.color.ok;
		}
	};

	this.loginCheck = function(form) {
		var req = new Request('account/loginCheck', false);
		params = 'login=' + uri(form.login.value) +
			'&password=' + uri(form.password.value);
		req.send(params);
		var rsp = req.getResponse();
		if (rsp) {
			formaFyi(rsp);
			return false;
		}

		return true;
	};

	this.checkLoginValue = function(fld) {
		if (isSet(fld)) {
			fld.value = fld.value.trim();
		}
		else {
			fld.value = '';
		}

		if (fld.value === '') {
			fld.style.color = globals.color.error;
			formaFyi('Το login name είναι υποχρεωτικό');
			return false;
		}

		if (!fld.value.match(/^[a-zA-Z][a-zA-Z0-9_!@#=.:+-]*$/)) {
			fld.style.color = globals.color.error;
			formaFyi('Το login name δεν είναι δεκτό');
			return false;
		}

		fld.style.color = globals.color.ok;
		return true;
	};

	this.checkEmailValue = function(fld) {
		if (isSet(fld)) {
			fld.value = fld.value.trim();
		}
		else {
			fld.value = '';
		}

		if ((fld.value === '') || validEmail(fld.value)) {
			fld.style.color = globals.color.ok;
			return true;
		}

		formaFyi('Το email δεν είναι σωστό');
		fld.style.color = globals.color.error;
		return false;
	};

	this.addPektis = function(form) {
		if (!account.checkLoginValue(form.login)) {
			form.login.focus();
			return false;
		}

		if (notSet(form.onoma.value) || (form.onoma.value === '')) {
			formaFyi('Το όνομα είναι υποχρεωτικό');
			form.onoma.focus();
			return false;
		}

		if (!account.checkEmailValue(form.email)) {
			form.email.focus();
			return false;
		}

		if (notSet(form.password1.value) || (form.password1.value === '')) {
			formaFyi('Το password είναι υποχρεωτικό');
			form.password1.focus();
			return false;
		}

		if (notSet(form.password2.value) || (form.password2.value === '')) {
			formaFyi('Πρέπει να επαναλάβετε το password');
			form.password2.focus();
			return false;
		}

		if (form.password2.value != form.password1.value) {
			formaFyi('Τα δύο passwords είναι διαφορετικά');
			form.password1.focus();
			return false;
		}

		var req = new Request('account/addPektis', false);
		params = 'login=' + uri(form.login.value) +
			'&onoma=' + uri(form.onoma.value) +
			'&email=' + uri(form.email.value) +
			'&plati=' + uri(form.plati.value) +
			'&enalagi=' + uri(form.enalagi.value) +
			'&password=' + uri(form.password1.value);
		req.send(params);
		var rsp = req.getResponse();
		if (rsp) {
			formaFyi(rsp);
			return false;
		}

		location.href = globals.server;
	};

	this.updatePektis = function(form) {
		if (notSet(form.onoma.value) || (form.onoma.value === '')) {
			formaFyi('Το όνομα είναι υποχρεωτικό');
			form.onoma.focus();
			return false;
		}

		if (!account.checkEmailValue(form.email)) {
			form.email.focus();
			return false;
		}

		if (notSet(form.password.value) || (form.password.value === '')) {
			formaFyi('Δεν δόθηκε password');
			form.password.focus();
			return false;
		}

		if (notSet(form.password1.value)) {
			form.password1.value = '';
		}

		if (notSet(form.password2.value)) {
			form.password2.value = '';
		}

		if (form.password2.value != form.password1.value) {
			formaFyi('Τα δύο passwords είναι διαφορετικά');
			form.password1.focus();
			return false;
		}

		var req = new Request('account/updatePektis', false);
		params = 'onoma=' + uri(form.onoma.value) +
			'&email=' + uri(form.email.value) +
			'&plati=' + uri(form.plati.value) +
			'&enalagi=' + uri(form.enalagi.value) +
			'&password=' + uri(form.password.value) +
			'&password1=' + uri(form.password1.value);
		req.send(params);
		var rsp = req.getResponse();
		if (rsp) {
			formaFyi(rsp);
			return false;
		}

		exitChild();
		return false;
	};

	this.alagiPhoto = function(fld) {
		var x = getelid('photo');
		if (notSet(x)) { return; }
	};
}

window.onload = function() {
	init();
	account.onload();
	var x = getelid('login');
	if (x.disabled) {
		x = getelid('onoma');
	}
	x.focus();
}
