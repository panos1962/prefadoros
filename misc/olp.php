<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Prefadoros::set_pektis();
Page::head();
?>
<style type="text/css">
.olpPektis {
	position: relative;
	margin-bottom: 2px;
	font-size: 0.4cm;
	font-weight: bold;
	color: #193A59;
}

.olpBusy {
	opacity: 0.6;
	filter: alpha(opacity=60);
}

.olpFilos {
	color: #007700;
}

.olpBlock {
	color: #990000;
}

.olpOnoma {
	margin-left: 0.4cm;
	color: #333333;
	font-style: italic;
}

.olpMatch {
	background-color: #FFFF66;
	border-style: solid;
	border-width: 0 0 1px 0;
	border-color: #336600;
	margin-bottom: 1px;
}

#olpCount {
	font-size: 0.4cm;
	margin: 0.2cm 0 0.2cm 0;
}

.olpCountData {
	font-weight: bold;
	color: #193A59;
}

#refresh {
	position: absolute;
	top: 0px;
	left: 4.6cm;
	width: 0.6cm;
}

#loginArea {
	position: absolute;
	right: 0px;
	top: 0px;
}

.olpButton {
	margin-right: 0.4cm;
}
</style>
<script type="text/javascript">
//<![CDATA[
var OLP = {};
OLP.pektis = <?php print ($globals->is_pektis() ?
	"'" . Globals::asfales_json($globals->pektis->login) . "'" : "null"); ?>;

window.onload = function() {
	init();
	OLP.refreshReset();
	var x = getelid('onoma');
	if (isSet(x)) {
		x.select();
		x.focus();
	}
	OLP.loginArea();
	setTimeout(OLP.olpData, 10);
};

OLP.refreshReset = function(x) {
	if (notSet(x)) { x = getelid('refresh'); }
	if (notSet(x)) { return; }
	x.title = 'Ανανέωση πληροφοριών'
	x.src = '../images/controlPanel/refresh.png';
};

OLP.olpData = function(xeri) {
	var x = getelid('olp');
	if (notSet(x)) { return; }

	if (notSet(xeri)) { xeri = false; }

	var rfr = getelid('refresh');
	rfr.src = '../images/working.gif';
	rfr.title = 'Ανανέωση πληροφοριών σε εξέλιξη…';

	var req = new Request('misc/olpData');
	req.xhr.onreadystatechange = function() {
		OLP.olpDataCheck(req, x, rfr, xeri);
	};

	req.send();
};

OLP.sxesi = {
	"f":	"olpFilos",
	"b":	"olpBlock"
};

OLP.cur = {};
OLP.cl0 = {};
OLP.onoma = [];

OLP.olpDataCheck = function(req, div, rfr, xeri) {
	if (req.xhr.readyState != 4) { return; }
	var rsp = req.getResponse();
	try {
		var dedomena = eval('({' + rsp + '})');
	} catch(e) {
		rfr.src = '../images/Xred.png';
		rfr.title = 'Πρόβλημα στην αναζήτηση πληροφοριών';
		return;
	}

	OLP.loginArea();
	setTimeout(function() {
		OLP.refreshReset(rfr);
	}, 100);

	var html = '';
	var ok = {};
	var filos = false;
	var found = false;

	for (var i = 0; i < dedomena.olp.length; i++) {
		var id = 'l:' + dedomena.olp[i].l;
		ok[id] = true;
		OLP.cur[id] = dedomena.olp[i].l + dedomena.olp[i].o;
		var cl = 'olpPektis';
		if (isSet(dedomena.olp[i].s)) { cl += ' ' + OLP.sxesi[dedomena.olp[i].s]; }
		if (isSet(dedomena.olp[i].b)) { cl += ' olpBusy'; }
		OLP.cl0[id] = cl;

		matched = OLP.matchEnaOnoma(OLP.cur[id]);
		if (matched) { cl += ' olpMatch'; }

		var x = getelid(id);
		if (isSet(x)) {
			x.setAttribute('class', cl);
			if (notSet(OLP.pektis)) {
				x.style.cursor = 'auto';
				x.title = '';
			}
			else {
				x.style.cursor = 'pointer';
				x.title = 'Μήνυμα προς τον παίκτη "' +
					dedomena.olp[i].l + '"';
			}
			continue;
		}

		html += '<div id="' + id + '" class="' + cl + '" onclick="if (isSet(OLP.pektis)) ' +
			'{ Sxesi.permesWindow(\'' + dedomena.olp[i].l + '\'); }" ' +
			'onmouseover="OLP.fotise(this);" onmouseout="OLP.xefotise(this);"';
		if (isSet(OLP.pektis)) {
			html += ' title="Μήνυμα προς τον παίκτη &quot;' +
				dedomena.olp[i].l + '&quot;" style="cursor: pointer;"';
		}
		html += '>';
		html += '<span>' + dedomena.olp[i].l + '</span>';
		html += '<span class="olpOnoma">' + dedomena.olp[i].o + '</span>';
		html += '</div>';

		if (isSet(dedomena.olp[i].s) && (dedomena.olp[i].s == 'f')) { filos = true; }
		if (matched) { found = true; }
	}

	x = getelid('olpCount');
	if (isSet(x)) { x.innerHTML = OLP.onlineHTML(dedomena); }

	div.innerHTML = html + div.innerHTML;
	for (id in OLP.cur) {
		x = getelid(id);
		if (!isSet(x)) { continue; }
		if (ok.hasOwnProperty(id)) { continue; }
		sviseNode(x);
		delete OLP.cur[i];
	}

	if (found) { playSound('hiThere'); }
	else if (filos) { playSound('tic'); }

	if (!xeri) {
		setTimeout(OLP.olpData, 10000);
	}
};

OLP.fotise = function(div) {
	if (notSet(div.oriBC)) { div.oriBC = div.style.backgroundColor; }
	div.style.backgroundColor = '#FFFFCC';
};

OLP.xefotise = function(div) {
	if (isSet(div.oriBC)) {
		div.style.backgroundColor = div.oriBC;
	}
};

OLP.onlineHTML = function(x) {
	var html = '';
	html += x.olp.length > 0 ? 'Παίκτες online: <span class="olpCountData">' +
		x.olp.length + '</span>' : 'Δεν υπάρχουν online παίκτες';
	if (x.tc > 0) { html += ', τραπέζια: <span class="olpCountData">' + x.tc + '</span>'; }
	return html;
};

OLP.matchOnoma = function(e, fld) {
	if (notSet(fld)) {
		fld = getelid('onoma');
		if (notSet(fld)) { return; }
	}
	else {
		if (window.event) { var key = e.keyCode; }
		else if (e.which) { key = e.which; }
		else { key = -1; }

		switch(key) {
		case 27:	// Esc key
			fld.value = '';
			break;
		}
	}

	OLP.onoma = fld.value.split(',');
	for (var i = 0; i < OLP.onoma.length; i++) {
		OLP.onoma[i] = OLP.onoma[i].trim();
	}

	for (var id in OLP.cur) {
		var x = getelid(id);
		if (notSet(x)) { continue; }

		x.setAttribute('class', OLP.cl0[id]);
		if (OLP.matchEnaOnoma(OLP.cur[id])) {
			x.setAttribute('class', OLP.cl0[id] + ' olpMatch');
		}
	}
};

OLP.matchEnaOnoma = function(s) {
	for (var i = 0; i < OLP.onoma.length; i++) {
		if (OLP.onoma[i] == '') { continue; }
		if (OLP.onoma[i].length < 3) { continue; }
		if (s.match(new RegExp(OLP.onoma[i], 'i'))) {
			return true;
		}
	}
	return false;
};

OLP.loginCheck = function() {
	var x = getelid('login');
	if (notSet(x)) { return false; }
	var login = (x.value = x.value.trim());
	if (login === '') { return false; }

	x = getelid('kodikos');
	if (notSet(x)) { return false; }
	var kodikos = x.value;

	var req = new Request('account/loginCheck', false);
	params = 'login=' + uri(login) + '&password=' + uri(kodikos);
	req.send(params);
	var rsp = req.getResponse();
	if (rsp) {
		OLP.pektis = null;
		alert(rsp);
	}
	else {
		OLP.pektis = login;
		OLP.olpData(true);
	}
	return false;
};

OLP.eponima = true;

OLP.loginArea = function() {
	var x = getelid('loginArea');
	if (notSet(x)) { return; }

	var html = '';
	if (isSet(OLP.pektis)) {
		OLP.eponima = true;
		html += '<button class="olpButton"><a target="_blank" href="' + globals.server +
			'permes/index.php" style="text-decoration: none;">' +
			'Αλληλογραφία</a></button>';
		html += '<input type="button" value="Έξοδος" class="olpButton" ' +
			'onclick="return OLP.logout();" />';
		html += '<div class="login" title="Επώνυμη χρήση" ' +
			'style="display: inline-block;">' +
			OLP.pektis + '</span>';
	}
	else if (OLP.eponima) {
		OLP.eponima = false;
		html += '<form>Login <input id="login" type="text" ' +
			'style="width: 3.0cm; font-size: 0.4cm;" /> ' +
			'Password <input id="kodikos" type="password" ' +
			'style="width: 3.0cm; font-size: 0.4cm; margin" /> ' +
			'<input type="submit" onclick="return OLP.loginCheck();" ' +
			'value="Είσοδος" /></form>';
	}
	else {
		return;
	}

	x.innerHTML = html;
};

OLP.logout = function() {
	var req = new Request('account/logout');
	req.xhr.onreadystatechange = function() {
		OLP.logoutCheck(req);
	};

	req.send();
	return false;
};

OLP.logoutCheck = function(req) {
	if (req.xhr.readyState != 4) { return; }
	var rsp = req.getResponse();
	if (rsp) {
		alert(rsp);
	}
	else {
		OLP.pektis = null;
		OLP.olpData(true);
	}
};
//]]>
</script>
<?php
Page::javascript('prefadoros/sxesi');
Page::javascript('lib/soundmanager');
?>
</head>
<body>
<div>
	<div style="position: relative;">
		<input id="onoma" type="text" autocomplete="off" style="position: absolute; left: 0px;
			top: 0px; width: 4.0cm; font-size: 0.4cm;" onkeyup="OLP.matchOnoma(event, this);"
			title="Αναζήτηση παικτών" />
		<img id="refresh" src="../images/controlPanel/refresh.png" alt=""
			onclick="OLP.olpData(true);" />
		<div id="loginArea"></div>
	</div>
	<br />
</div>
<div id="olpCount"></div>
<div id="olp"></div>

</body>
</html>
<?php
$globals->klise_fige();
