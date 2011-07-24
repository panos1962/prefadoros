var Dumprsp = new function() {
	var wdump = null;

	this.onOff = function() {
		isSet(wdump) ? Dumprsp.close() : Dumprsp.open();
	};

	this.setup = function() {
		if (sinedria.dumprsp) { Dumprsp.open(); }
	};

	this.open = function(rsp) {
		if (notSet(wdump)) {
			wdump = window.open(globals.server +
				'lib/dumprsp.php', '_blank',
				'location=0,status=0,titlebar=0,menubar=0,scrollbars=1,' +
				'resizable=0,width=600,height=500,left=200,top=100');
			if (notSet(wdump)) {
				mainFyi('dumprsp: cannot open window');
				return;
			}
		}
	};

	this.dump = function(rsp) {
		if (notSet(wdump)) { return; }

		try {
			var p = wdump.document.createElement('div');
			var d = new Date;
			var html = strTime(d, true) +
				' [' + d.getMilliseconds() + ']<br />' + rsp + '<hr />';
			p.innerHTML = html;

			var eod = wdump.document.getElementById('EOD');
			if (isSet(eod)) {
				wdump.document.body.insertBefore(p, eod);
				scrollBottom(wdump.document.body);
			}
		} catch(e) { Dumprsp.reset };
	};

	this.close = function() {
		if (isSet(wdump)) {
			wdump.close();
		}
		Dumprsp.reset();
	};

	this.reset = function() {
		wdump = null;
	};
};
