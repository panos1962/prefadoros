window.onload = function() {
	init();
	pektisData();
};

function pektisData() {
	var x = getelid('pektis');
	if (notSet(x)) { return; }

	var req = new Request('misc/pektisData');
	req.xhr.onreadystatechange = function() {
		pektisDataCheck(req, x);
	};

	req.send();
}

var sxesi = {
	"f":	"filos",
	"b":	"block"
};

var cur = {};

function pektisDataCheck(req, div) {
	if (req.xhr.readyState != 4) { return; }
	var rsp = req.getResponse();
	try {
		var pektis = eval('[' + rsp + ']');
	} catch(e) {
		return;
	}

	var html = '';
	var ok = {};
	var filos = false;
	for (var i = 0; i < pektis.length; i++) {
		ok[id] = true;
		var cl = 'pektis';
		if (isSet(pektis[i].s)) { cl += ' ' + sxesi[pektis[i].s]; }
		if (isSet(pektis[i].b)) { cl += ' busy'; }

		var id = 'l:' + pektis[i].l;
		var x = getelid(id);
		if (isSet(x)) {
			x.setAttribute('class', cl);
			continue;
		}

		html += '<div id="' + id + '" class="' + cl + '">';
		html += '<span>' + pektis[i].l + '</span>';
		html += '<span class="onoma">' + pektis[i].o + '</span>';
		html += '</div>';
		cur[id] = true;

		if (isSet(pektis[i].s) && (pektis[i].s == 'f')) { filos = true; }
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
	setTimeout(pektisData, 5000);
}
