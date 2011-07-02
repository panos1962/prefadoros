function formaFyi(msg, id) {
	if (notSet(id)) {
		id = 'formaFyi';
	}
	var fyi = getelid(id);
	if (notSet(fyi)) {
		return;
	}

	if (isSet(fyi.clearTimer)) {
		clearTimeout(fyi.clearTimer);
	}

	if (notSet(msg) || (!msg)) {
		var visibility = 'hidden';
		msg = '';
	}
	else {
		visibility = 'visible';
	}

	fyi.innerHTML = msg;
	fyi.style.visibility = visibility;
	fyi.clearTimer = setTimeout(function() {
		clearFyi(fyi);
	}, globals.fyiDuration.forma);
}

function clearFyi(fyi) {
	fyi.innerHTML = '&nbsp;';
	fyi.style.visibility = 'hidden';
}
