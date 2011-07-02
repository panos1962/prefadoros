function Request(page, asynch) {
	this.xhr = new XMLHttpRequest();
	if (notSet(this.xhr)) {
		this.xhr = new ActiveXObject("Msxml2.XMLHTTP");
		if (notSet(this.xhr)) {
			this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
			if (notSet(this.xhr)) {
				window.location = globals.server + 'error.php?message=' +
					uri('new Request: failed');
			}
		}
	}

	if (notSet(asynch)) {
		asynch = true;
	}

	this.page = page;
	this.xhr.open('POST', globals.server + page + '.php', asynch);

	this.send = function(data) {
		if (notSet(this.xhr)) {
			return 'undefined Ajax request';
		}

		if (notSet(data)) {
			data = '';
		}
		else if (data != '') {
			data += '&';
		}
		data += 'avoidCache=' + globals.avoidCache.base + ':' + globals.avoidCache.dif++;

		this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		this.xhr.send(data);
	};

	this.getResponse = function() {
		if (notSet(this.xhr)) {
			return 'undefined Ajax request';
		}

		if (notSet(this.xhr.status)) {
			return 'undefined Ajax returned status';
		}

		if (this.xhr.status != 200) {
			return this.page + ' (status = ' + this.xhr.status + ')';
		}

		if (notSet(this.xhr.responseText)) {
			return this.page + ': undefined Ajax response';
		}

		return this.xhr.responseText;
	};
}

function sviseNode(x) {
	if (isSet(x)) {
		x.parentNode.removeChild(x);
	}
}

function isSet(x) {
	if (x === undefined) {
		return false;
	}

	if (x === null) {
		return false;
	}

	return true;
}

function notSet(x) {
	return(!isSet(x));
}

function getelid(id) {
	return(document.getElementById(id));
}

function uri(s) {
	return(encodeURIComponent(s));
}

function isNum(x) {
	return (x.match(/^[0-9]+$/));
}

function fatalError(msg) {
	location.href = globals.server + 'error.php?minima=' +
		uri(isSet(msg) ? msg : 'Άγνωστο σφάλμα');
}

function init() {
	globals.avoidCache = {
		"base":		(new Date).getTime(),
		"dif":		0
	};

	globals.fyiDuration = {
		"forma":	3000,
		"ligo":		2000,
		"main":		5000
	};

	globals.timeDif -= parseInt((new Date).getTime() / 1000);
}

window.onload = function() {
	init();
}
