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
	left: 6.6cm;
	width: 0.6cm;
}

#loginArea {
	position: absolute;
	right: 0px;
	top: 0px;
}
</style>
<script type="text/javascript">
//<![CDATA[
window.onload = function() {
	init();
	OLP.refreshReset();
	var x = getelid('onoma');
	if (isSet(x)) {
		x.select();
		x.focus();
	}
	OLP.loginArea(<?php
	if ($globals->is_pektis()) {
		print "'" . Globals::asfales_json($globals->pektis->login) . "'";
	}
	?>);
	setTimeout(OLP.olpData, 10);
};

var OLP = {};

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

	OLP.loginArea(dedomena.login);
	setTimeout(function() {
		OLP.refreshReset(rfr);
	}, 100);

	var html = '';
	var ok = {};
	var filos = false;

	for (var i = 0; i < dedomena.olp.length; i++) {
		var id = 'l:' + dedomena.olp[i].l;
		ok[id] = true;
		var cl = 'olpPektis';
		if (isSet(dedomena.olp[i].s)) { cl += ' ' + OLP.sxesi[dedomena.olp[i].s]; }
		if (isSet(dedomena.olp[i].b)) { cl += ' olpBusy'; }
		OLP.cl0[id] = cl;

		var x = getelid(id);
		if (isSet(x)) {
			x.setAttribute('class', cl);
			continue;
		}

		html += '<div id="' + id + '" class="' + cl + '">';
		html += '<span>' + dedomena.olp[i].l + '</span>';
		html += '<span class="olpOnoma">' + dedomena.olp[i].o + '</span>';
		html += '</div>';
		OLP.cur[id] = dedomena.olp[i].l + dedomena.olp[i].o;

		if (isSet(dedomena.olp[i].s) && (dedomena.olp[i].s == 'f')) { filos = true; }
	}

	x = getelid('olpCount');
	if (isSet(x)) {
		x.innerHTML = dedomena.olp.length > 0 ? 'Παίκτες online: <span class="olpCountData">' +
			dedomena.olp.length + '</span>' : 'Δεν υπάρχουν online παίκτες';
	}

	div.innerHTML = html + div.innerHTML;
	for (id in OLP.cur) {
		x = getelid(id);
		if (!isSet(x)) { continue; }
		if (ok.hasOwnProperty(id)) { continue; }
		sviseNode(x);
		delete OLP.cur[i];
	}
	if (filos) { playSound('tic'); }
	OLP.matchOnoma();
	if (!xeri) {
		setTimeout(OLP.olpData, 10000);
	}
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

	var o = fld.value.split(',');
	for (var id in OLP.cur) {
		var x = getelid(id);
		if (notSet(x)) { continue; }

		x.setAttribute('class', OLP.cl0[id]);
		for (var i = 0; i < o.length; i++) {
			o[i] = o[i].trim();
			if (o[i] == '') { continue; }
			if (o[i].length < 3) { continue; }
			if (OLP.cur[id].match(new RegExp(o[i], 'i'))) {
				x.setAttribute('class', OLP.cl0[id] + ' olpMatch');
				break;
			}
		}
	}
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
	if (rsp) { alert(rsp); }
	else { OLP.olpData(true); }
	return false;
};

OLP.pektis = null;

OLP.loginArea = function(pektis) {
	if ((arguments.length == 1) && (OLP.pektis === pektis)) { return; }
	OLP.pektis = pektis;
	var x = getelid('loginArea');
	if (notSet(x)) { return; }

	var html = '';
	if (isSet(pektis)) {
		html += '<div class="login">' + pektis + '</span>';
	}
	else {
		html += '<form>Login <input id="login" type="text" ' +
			'style="width: 4.0cm; font-size: 0.4cm;" /> ' +
			'Password <input id="kodikos" type="password" ' +
			'style="width: 4.0cm; font-size: 0.4cm; margin" /> ' +
			'<input type="submit" onclick="return OLP.loginCheck();" ' +
			'value="Είσοδος" /></form>';
	}

	x.innerHTML = html;
};
//]]>
</script>
<?php
Page::javascript('lib/soundmanager');
?>
</head>
<body>
<div>
	<div style="position: relative;">
		<input id="onoma" type="text" autocomplete="off" style="position: absolute; left: 0px;
			top: 0px; width: 6.0cm; font-size: 0.4cm;" onkeyup="OLP.matchOnoma(event, this);" />
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
