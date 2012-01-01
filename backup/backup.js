var Backup = {};

Backup.pinakas = function(pinakas) {
	var xs = getelid(pinakas + 'Status');
	if (notSet(xs)) { return false; }
	xs.innerHTML = '<img src="' + globals.server + 'images/that.gif" ' +
		'style="width: 0.6cm;" alt="" />';

	var xp = getelid(pinakas);
	if (notSet(xp)) { return false; }
	xp.style.fontWeight = 'bold';

	Backup.exec(pinakas)
};

Backup.exec = function(pinakas, offset) {
	var req = new Request('backup/exec');
	req.xhr.onreadystatechange = function() {
		Backup.execCheck(pinakas, req);
	};

	if (notSet(offset)) { offset = 0; }

	var params = 'pinakas=' + uri(pinakas);
	params += '&offset=' + offset;
	req.send(params);
};

Backup.execCheck = function(pinakas, req) {
	if (req.xhr.readyState != 4) { return; }
	var rsp = req.getResponse();
	var x = rsp.split(':');
	if ((x.length != 5) || (x[4] != 'ok')) {
		alert(rsp);
		return;
	}

	var xc = getelid(pinakas + 'Count');
	if (notSet(xc)) { return; }

	var offset = parseInt(x[0]);
	var limit = parseInt(x[1]);
	var count = parseInt(x[2]);
	var rows = offset + count;
	xc.innerHTML = '<span class="data">' + rows + '</span>';

	if (limit <= count) {
		xc.innerHTML += '#<span class="data">' + x[3] + '</span>';
		Backup.exec(pinakas, rows);
		return;
	}

	xc.innerHTML = '<span class="data">' + rows + '</span>';
	xc = getelid(pinakas + 'Status');
	if (notSet(xc)) { return; }

	xc.innerHTML = '';
	switch (pinakas) {
	case 'pektis':
		Backup.pinakas('sxesi');
		break;
	case 'sxesi':
		Backup.pinakas('minima');
		break;
	case 'minima':
		Backup.pinakas('trapezi');
		break;
	case 'trapezi':
		Backup.pinakas('dianomi');
		break;
	case 'dianomi':
		Backup.pinakas('kinisi');
		break;
	case 'kinisi':
		Backup.pinakas('sinedria');
		break;
	default:
		break;
	}
};

window.onload = function() {
	init();
};
