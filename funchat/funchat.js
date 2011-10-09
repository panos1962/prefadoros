funchat = {};

funchat.whltSaveTimer = null;

funchat.whltSave = function() {
	if (isSet(funchat.whltSaveBlocked) && funchat.whltBlocked) {
		return;
	}

	var x = window.opener;
	if (notSet(x)) {
		return;
	}

	if (isSet(window.screenLeft)) {
		var l = window.screenLeft;
	}
	else if (isSet(window.screenX)) {
		l = window.screenX;
	}
	else {
		return;
	}

	if (isSet(window.screenTop)) {
		var t = window.screenTop;
	}
	else if (isSet(window.screenY)) {
		t = window.screenY;
	}
	else {
		return;
	}

	if (isSet(window.outerWidth)) {
		var w = window.outerWidth;
	}
	else if (isSet(document) && isSet(document.body) && isSet(document.body.clientWidth)) {
		w = document.body.clientWidth;
	}
	else {
		return;
	}

	if (isSet(window.outerHeight)) {
		var h = window.outerHeight;
	}
	else if (isSet(screen) && isSet(screen.availHeight)) {
		h = screen.availHeight - 50;
	}
	else {
		return;
	}

	if (isSet(funchat.whltSaveTimer)) {
		clearTimeout(funchat.whltSaveTimer);
	}

	funchat.whltSaveTimer = setTimeout(function() {
		x.globals.funchatWhlt = w + ':' + h + ':' + l + ':' + t;
		var req = new Request('funchat/whltSave', false);
		req.send('whlt=' + x.globals.funchatWhlt);
		var rsp = req.getResponse();
		if (rsp) {
			x.mainFyi('funchat/whltSave.php: ' + rsp);
		}
		else {
			x.mainFyi('saved funchat panel position &amp; size', 500);
		}
	}, 5000);
}

window.onload = function() {
	init();
};

window.onbeforeunload = function() {
	var w = window.opener;
	if (notSet(w) || notSet(w.document)) {
		return;
	}

	if (isSet(w.controlPanel)) {
		w.controlPanel.funchatClose();
	}
};

var Funchat = new function() {
	this.ikona = null;
	this.titlos = null;
	this.zoom = null;
	this.sound = null;

	this.stile = function(div, ikona, titlos, zoom, sound) {
		var p = self.opener;
		if (notSet(p)) { return; }
		if (notSet(p.document)) { return; }
		if (notSet(p.Sizitisi)) { return; }
		var f = p.document.getElementById('sxolioInputHidden');
		if (notSet(f)) { return; }

		var sxolioArea = getelid('inputSxolioArea');
		if (notSet(sxolioArea)) { return; }

		var sxolio = getelid('inputSxolio');
		if (notSet(sxolio)) { return; }

		this.ikona = ikona;
		this.titlos = titlos;
		this.zoom = zoom;
		this.sound = sound;
		sxolio.value = '';

alert(div);
		sxolioArea.style.top = div.style.top;
		sxolioArea.style.visibility = 'visible';
	};

	this.keyCheck = function(e, fld) {
		if (window.event) { var key = e.keyCode; }
		else if (e.which) { key = e.which; }
		else { key = false; }

		if (key !== false) {
			switch(key) {
			case 13:	// Enter key
				break;
			case 27:	// Esc key();
				alert('Cancel');
				break;
			default:
				return;
			}
		}

		var p = self.opener;
		if (notSet(p)) { return; }
		if (notSet(p.document)) { return; }
		if (notSet(p.Sizitisi)) { return; }
		var f = p.document.getElementById('sxolioInputHidden');
		if (notSet(f)) { return; }

		f.value = '@FC';
		f.value += '@' + this.ikona;
		f.value += '@' + this.zoom;
		f.value += '@' + this.sound;
		f.value += '@' + fld.value;
		p.Sizitisi.apostoli(f);
	};
};

var Ikona = new function() {
	this.keyCheck = function(e, fld) {
		var w = self.opener;
		if (notSet(w)) { return; }
		if (notSet(w.Sizitisi)) { return; }

		var preview = w.getelid('sxolioPreview');
		if (notSet(preview)) { return; }

		if (window.event) { var key = e.keyCode; }
		else if (e.which) { key = e.which; }
		else { key = false; }

		if (key !== false) {
			switch(key) {
			case 13:	// Enter key
				Ikona.stile();
			case 27:	// Esc key();
				fld.value = '';
			default:
				Ikona.preview();
			}
		}
	};

	this.akiro = function() {
		var w = self.opener;
		if (notSet(w)) { return; }
		if (notSet(w.Sizitisi)) { return; }

		var preview = w.getelid('sxolioPreview');
		if (notSet(preview)) { return; }

		var img = getelid('inputURL');
		if (notSet(img)) { return; }
		if (img.value == '') { return; }

		var txt = getelid('inputLezanta');
		if (notSet(txt)) { return; }

		var fld = getelid('ikonaData');
		if (notSet(fld)) { return; }

		fld.value = '';
		img.value = '';
		txt.value = '';
		preview.innerHTML = '';
	};

	var width = 4;

	this.preview = function(dw) {
		var w = self.opener;
		if (notSet(w)) { return; }
		if (notSet(w.Sizitisi)) { return; }

		var preview = w.getelid('sxolioPreview');
		if (notSet(preview)) { return; }

		var img = getelid('inputURL');
		if (notSet(img)) { return; }
		if (img.value == '') { return; }

		var txt = getelid('inputLezanta');
		if (notSet(txt)) { return; }

		if (isSet(dw)) { width += dw; }

		var html = '';
		html += '<div class="sizitisiPreviewLine"></div>';
		html += '<div class="sizitisiSxolio sizitisiPreview">';
		html += '<div class="sizitisiPektis" style="color: #' +
			w.Sizitisi.zebraColor[0] + ';">' + pektis.login + '</div>';
		html += Ikona.HTML(img, txt);
		html += '</div>';
		preview.innerHTML = html;
		w.Sizitisi.scrollBottom();
	};

	this.stile = function() {
		var w = self.opener;
		if (notSet(w)) { return; }
		if (notSet(w.Sizitisi)) { return; }

		var preview = w.getelid('sxolioPreview');
		if (notSet(preview)) { return; }

		var img = getelid('inputURL');
		if (notSet(img)) { return; }
		if (img.value == '') { return; }

		var txt = getelid('inputLezanta');
		if (notSet(txt)) { return; }

		var fld = getelid('ikonaData');
		if (notSet(fld)) { return; }

		fld.value = Ikona.HTML(img, txt);
		w.Sizitisi.apostoli(fld);

		fld.value = '';
		img.value = '';
		txt.value = '';
		preview.innerHTML = '';
	};

	this.HTML = function(img, txt) {
		html = '';
		html += '<img src="' + img.value + '" style="width: ' + width + 'cm;" alt="" />';
		if (txt.value != '') { html += '<br />' + txt.value; }
		return html;
	};
};
