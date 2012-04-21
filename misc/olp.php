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

.olpCount {
	font-size: 0.4cm;
	margin-bottom: 0.2cm;
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
	setTimeout(function() {
		OLP.refreshReset(rfr);
	}, 100);
	try {
		var olp = eval('[' + rsp + ']');
	} catch(e) {
		return;
	}

	var html = '';
	var ok = {};
	var filos = false;

	for (var i = 0; i < olp.length; i++) {
		var id = 'l:' + olp[i].l;
		ok[id] = true;
		var cl = 'olpPektis';
		if (isSet(olp[i].s)) { cl += ' ' + OLP.sxesi[olp[i].s]; }
		if (isSet(olp[i].b)) { cl += ' olpBusy'; }
		OLP.cl0[id] = cl;

		var x = getelid(id);
		if (isSet(x)) {
			x.setAttribute('class', cl);
			continue;
		}

		html += '<div id="' + id + '" class="' + cl + '">';
		html += '<span>' + olp[i].l + '</span>';
		html += '<span class="olpOnoma">' + olp[i].o + '</span>';
		html += '</div>';
		OLP.cur[id] = olp[i].l + olp[i].o;

		if (isSet(olp[i].s) && (olp[i].s == 'f')) { filos = true; }
	}

	x = getelid('olpCount');
	if (isSet(x)) {
		x.innerHTML = olp.length > 0 ? 'Παίκτες online: <span class="olpCountData">' +
			olp.length + '</span>' : 'Δεν υπάρχουν online παίκτες';
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
</div>
<div id="olpCount" class="olpCount"></div>
</div>
<div id="olp">
</div>
</body>
</html>
<?php
$globals->klise_fige();
