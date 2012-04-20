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
</style>
<script type="text/javascript">
//<![CDATA[
window.onload = function() {
	init();
	olpData();
};

function olpData() {
	var x = getelid('olp');
	if (notSet(x)) { return; }

	var req = new Request('misc/olpData');
	req.xhr.onreadystatechange = function() {
		olpDataCheck(req, x);
	};

	req.send();
}

var sxesi = {
	"f":	"olpFilos",
	"b":	"olpBlock"
};

var cur = {};

function olpDataCheck(req, div) {
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
		ok[id] = true;
		var cl = 'olpPektis';
		if (isSet(olp[i].s)) { cl += ' ' + sxesi[olp[i].s]; }
		if (isSet(olp[i].b)) { cl += ' olpBusy'; }

		var id = 'l:' + olp[i].l;
		var x = getelid(id);
		if (isSet(x)) {
			x.setAttribute('class', cl);
			continue;
		}

		html += '<div id="' + id + '" class="' + cl + '">';
		html += '<span>' + olp[i].l + '</span>';
		html += '<span class="olpOnoma">' + olp[i].o + '</span>';
		html += '</div>';
		cur[id] = true;

		if (isSet(olp[i].s) && (olp[i].s == 'f')) { filos = true; }
	}

	div.innerHTML = html + div.innerHTML;
	for (id in cur) {
		x = getelid(id);
		if (!isSet(x)) { continue; }
		if (ok.hasOwnProperty(id)) { continue; }
		sviseNode(x);
		delete cur[i];
	}
	if (filos) { playSound('tic'); }
	setTimeout(olpData, 10000);
}
//]]>
</script>
<?php
Page::javascript('lib/soundmanager');
?>
</head>
<body>
<div>
<input type="text" style="width: 10.0cm;" />
</div>
<div id="olp">
</div>
</body>
</html>
<?php
$globals->klise_fige();
