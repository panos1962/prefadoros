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
	margin-bottom: 0.1cm;
	max-width: 16.0cm;
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
}

.olpCount {
	font-size: 0.4cm;
	margin-bottom: 0.2cm;
}

.olpCountData {
	font-weight: bold;
	color: #193A59;
}
</style>
<script type="text/javascript">
//<![CDATA[
window.onload = function() {
	init();
	OLP.olpData();
	var x = getelid('onoma');
	if (isSet(x)) {
		x.select();
		x.focus();
	}
};

var OLP = {};

OLP.olpData = function() {
	var x = getelid('olp');
	if (notSet(x)) { return; }

	var req = new Request('misc/olpData');
	req.xhr.onreadystatechange = function() {
		OLP.olpDataCheck(req, x);
	};

	req.send();
};

OLP.sxesi = {
	"f":	"olpFilos",
	"b":	"olpBlock"
};

OLP.cur = {};
OLP.cl0 = {};

OLP.olpDataCheck = function(req, div) {
	if (req.xhr.readyState != 4) { return; }
	var rsp = req.getResponse();
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
	setTimeout(OLP.olpData, 10000);
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
<input id="onoma" type="text" autocomplete="off"
	style="width: 6.0cm; font-size: 0.4cm;" onkeyup="OLP.matchOnoma(event, this);" />
<div id="olpCount" class="olpCount"></div>
</div>
<div id="olp">
</div>
</body>
</html>
<?php
$globals->klise_fige();
