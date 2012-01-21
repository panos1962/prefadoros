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
			errorFyi(rsp);
			fld.style.color = globals.color.error;
		}
		else {
			mainFyi();
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
			errorFyi(rsp);
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
			errorFyi('Το login name είναι υποχρεωτικό');
			return false;
		}

		if (!fld.value.match(/^[a-zA-Z][a-zA-Z0-9_!@#=.:+-]*$/)) {
			fld.style.color = globals.color.error;
			errorFyi('Το login name δεν είναι δεκτό');
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

		errorFyi('Το email δεν είναι σωστό');
		fld.style.color = globals.color.error;
		return false;
	};

	this.addPektis = function(form) {
		if (!account.checkLoginValue(form.login)) {
			form.login.focus();
			return false;
		}

		if (notSet(form.onoma.value) || (form.onoma.value === '')) {
			errorFyi('Το όνομα είναι υποχρεωτικό');
			form.onoma.focus();
			return false;
		}

		if (!account.checkEmailValue(form.email)) {
			form.email.focus();
			return false;
		}

		if (notSet(form.password1.value) || (form.password1.value === '')) {
			errorFyi('Το password είναι υποχρεωτικό');
			form.password1.focus();
			return false;
		}

		if (notSet(form.password2.value) || (form.password2.value === '')) {
			errorFyi('Πρέπει να επαναλάβετε το password');
			form.password2.focus();
			return false;
		}

		if (form.password2.value != form.password1.value) {
			errorFyi('Τα δύο passwords είναι διαφορετικά');
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
			errorFyi(rsp);
			return false;
		}

		if (form.goURL.value != '') {
			window.location.href = form.goURL.value;
		}
		else {
			window.location.href = globals.server + 'index.php';
		}
		return false;
	};

	this.updatePektis = function(form) {
		if (notSet(form.onoma.value) || (form.onoma.value === '')) {
			errorFyi('Το όνομα είναι υποχρεωτικό');
			form.onoma.focus();
			return false;
		}

		if (!account.checkEmailValue(form.email)) {
			form.email.focus();
			return false;
		}

		if (notSet(form.password.value) || (form.password.value === '')) {
			errorFyi('Δεν δόθηκε password');
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
			errorFyi('Τα δύο passwords είναι διαφορετικά');
			form.password1.focus();
			return false;
		}

		var req = new Request('account/updatePektis', false);
		params = 'onoma=' + uri(form.onoma.value) +
			'&email=' + uri(form.email.value) +
			'&plati=' + uri(form.plati.value) +
			'&enalagi=' + uri(form.enalagi.value) +
			'&password=' + uri(form.password.value) +
			'&password1=' + uri(form.password1.value) +
			'&photoEnergia=' + uri(form.photoEnergia.value);
		req.send(params);
		var rsp = req.getResponse();
		if (rsp && (rsp != 'NO_CHANGE')) {
			errorFyi(rsp);
			return false;
		}

		if (account.uploadPhoto(form)) {
			return true;
		}

		if (rsp) {
			errorFyi('Δεν έγιναν αλλαγές στα στοιχεία του λογαριασμού');
			return false;
		}

		exitChild();
		return false;
	};

	this.uploadPhoto = function(form) {
		if (notSet(form.photoFile)) { return false; }
		if (notSet(form.photoFile.value)) { return false; }
		form.photoFile.value = form.photoFile.value.trim();
		return (form.photoFile.value != '');
	};

	this.selectPhoto = function() {
		var x = getelid('photoEnergia');
		if (isSet(x)) { x.value = ''; }

		getelid('uploadPhotoButton').click();
	};

	this.deletePhoto = function() {
		var energia = getelid('photoEnergia');
		if (notSet(energia)) { return; }

		if (energia.value != '') {
			photo.src = photo.arxikoSrc;
			energia.value = '';
		}
		else {
			photo.arxikoSrc = photo.src;
			photo.src = globals.server + 'images/missingPhoto.png';
			energia.value = 'delete';
		}
	};

	this.restorePhoto = function() {
		if (notSet(pektis) || notSet(pektis.login)) { return; }

		var energia = getelid('photoEnergia');
		if (notSet(energia)) { return; }

		var photo = getelid('photo');
		if (notSet(photo)) { return; }

		var x = getelid('uploadPhotoButton');
		if (isSet(x)) { x.value = ''; }

		if (energia.value != '') {
			photo.src = photo.arxikoSrc;
			energia.value = '';
		}
		else {
			photo.arxikoSrc = photo.src;
			photo.src = globals.server + 'photo/' + pektis.login.substr(0, 1) +
				'/' + pektis.login + '~.jpg';
			energia.value = 'restore';
		}
	};

	this.alagiKodikouPrompt = function() {
		var x = getelid('neosKodikos');
		if (notSet(x)) { return; }
		if (x.style.visibility != 'hidden') { return; }

		var html = '<td class="formaPrompt tbldbg">';
		html += '<a href="#" onclick="return account.alagiKodikou();">Αλλαγή κωδικού</a>';
		html += '</td>';
		html += '<td class="tbldbg">';
		html += '<input name="password1" type="password" maxlength="50" size="16" ';
		html += 'value="" class="formaField" onfocus="formaFyi();" ';
		html += 'style="visibility: hidden;" />';
		html += '</td>';
		x.innerHTML = html;
		x.style.visibility = 'visible';
	}

	this.alagiKodikou = function() {
		var x = getelid('neosKodikos');
		if (notSet(x)) { return false; }

		var html = '<td class="formaPrompt tbldbg">';
		html += 'Νέος κωδικός';
		html += '</td>';
		html += '<td class="tbldbg">';
		html += '<input name="password1" type="password" maxlength="50" size="16" ';
		html += 'value="" class="formaField" onfocus="formaFyi();" />';
		html += '</td>';
		x.innerHTML = html;

		x = getelid('neosKodikos2');
		if (notSet(x)) { return false; }
		x.style.visibility = 'visible';
	};
};

window.onload = function() {
	init();
	account.onload();
	account.alagiKodikouPrompt();
	var x = getelid('login');
	if (x.disabled) {
		x = getelid('onoma');
	}
	x.focus();
}
