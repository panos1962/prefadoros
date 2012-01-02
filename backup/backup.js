var Backup = {};

Backup.ekinisi = function() {
	var x = getelid('ekinisi');
	if (notSet(x)) { return false; }
	x.innerHTML = '<img src="' + globals.server +
		'images/elika.gif" class="backupButton" alt="" />';

	Backup.pinakas('pektis');
	return false;
};

Backup.pinakas = function(pinakas) {
	var xs = getelid(pinakas + 'Status');
	if (notSet(xs)) { return; }
	xs.innerHTML = '<img src="' + globals.server + 'images/that.gif" ' +
		'style="width: 0.6cm;" alt="" />';

	var xp = getelid(pinakas);
	if (notSet(xp)) { return; }
	xp.style.fontWeight = 'bold';

	Backup.exec(pinakas)
};

Backup.exec = function(pinakas) {
	var req = new Request('backup/exec');
	req.xhr.onreadystatechange = function() {
		Backup.execCheck(pinakas, req);
	};

	var params = 'pinakas=' + uri(pinakas);
	req.send(params);

	var x = getelid(pinakas + 'Count');
	if (notSet(x)) { return; }
	x.innerHTML = '<img style="width: 2.2cm;" src="' + globals.server +
		'images/riges.gif" alt="" />';
};

Backup.execCheck = function(pinakas, req) {
	if (req.xhr.readyState != 4) { return; }
	var rsp = req.getResponse();
	var x = rsp.split(':');
	if ((x.length != 2) || (x[1] != 'ok')) {
		alert(rsp);
		return;
	}
	var count = parseInt(x[0]);

	var x = getelid(pinakas + 'Count');
	if (notSet(x)) { return; }
	x.innerHTML = '<span class="data">' + count + '</span>';

	x = getelid(pinakas + 'Status');
	if (notSet(x)) { return; }
	x.innerHTML = '<img class="backupDone" src="' + globals.server +
		'images/controlPanel/check.png" alt="" />';

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
		var x = getelid('ekinisi');
		if (notSet(x)) { return false; }
		x.innerHTML = '<button class="backupButton" type="button" ' +
			'onclick="return Backup.ekinisi();">Restart backup</button>';
		break;
	}
};

window.onload = function() {
	init();
};
