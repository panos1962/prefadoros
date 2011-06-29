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

function init() {
	globals.avoidCache = {
		"base":		currentTimestamp(),
		"dif":		0
	};

	globals.timeDif -= parseInt((new Date).getTime() / 1000);
}

window.onload = function() {
	init();
	setTimeout(function() {
		var req = new Request('test/test1');
		req.xhr.onreadystatechange = function() {
			test1Check(req);
		};

		req.send();
	}, 10);
	setTimeout(function() {
		var req = new Request('test/test2');
		req.xhr.onreadystatechange = function() {
			test2Check(req);
		};

		req.send();
	}, 10);
}

function test1Check(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	rsp = req.setResponse();
	if (rsp) {
		alert(rsp);
	}
	document.write('<br />Ok1');
}

function test2Check(req) {
	if (req.xhr.readyState != 4) {
		return;
	}

	rsp = req.setResponse();
	if (rsp) {
		alert(rsp);
	}
	document.write('<br />Ok2');
}

function Request(page, asynch) {
	this.xhr = new XMLHttpRequest();
	if (notSet(this.xhr)) {
		this.xhr = new ActiveXObject("Msxml2.XMLHTTP");
		if (notSet(this.xhr)) {
			this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
			if (notSet(this.xhr)) {
				alert('newRequest: failed');
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

	this.setResponse = function() {
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

function currentTimestamp(db) {
	var x = new Date();
	if (isSet(db)) {
		 x = (x.getFullYear() * 10000000000) +
			((x.getMonth() + 1) * 100000000) +
			(x.getDate() * 1000000) +
			(x.getHours() * 10000) +
			(x.getMinutes() * 100) +
			x.getSeconds();
	}
	else {
		x = x.getTime();
	}

	return x;
}
