var Sxesi = new function() {
	this.updateHTML = function(sxesi) {
		var x = getelid('sxesiArea');
		if (notSet(x)) { return; }

		var html = '';
		if (isSet(sxesi)) {
			for (var i = 0; i < sxesi.length; i++) {
				html += Sxesi.HTML(sxesi, i);
			}
		}
		html += '';
		x.innerHTML = html;
	};

	this.HTML = function(sxesi, i) {
		var html = '';
		html += '<div class="sxesiLine zebra' + (i % 2);
		sxesi[i].o  = 0;
		if (sxesi[i].o < 1) {
			html += ' sxesiOffline';
		}
		html += '" onmouseover="emfanesAfanes(this, true);" ';
		html += 'onmouseout="emfanesAfanes(this, false);">';
		switch (sxesi[i].o) {
		case 1:
			var ball = 'orangeBall';
			var title = 'Online, απασχολημένος';
			break;
		case 2:
			ball = 'greenBall';
			title = 'Online, διαθέσιμος';
			break;
		default:
			ball = 'fouxBall';
			title = 'Offline';
			break;
		}
		html += '<img alt="" class="sxesiDiathesimotita" src="' +
			globals.server + 'images/' + ball + '.png" ' +
			'title="' + title + '. Κλικ για εργαλεία" ' +
			'onclick="Sxesi.panel(\'' + sxesi[i].l + '\');" />';
		html += '<div id="sx_' + sxesi[i].l + '" style="display: none;">';
		switch (sxesi[i].s) {
		case 'F':
			html += Sxesi.apoklismosHTML(sxesi[i]);
			html += Sxesi.aposisxetisiHTML(sxesi[i]);
			break;
		case 'B':
			html += Sxesi.addFilosHTML(sxesi[i]);
			html += Sxesi.aposisxetisiHTML(sxesi[i]);
			break;
		default:
			html += Sxesi.addFilosHTML(sxesi[i]);
			html += Sxesi.apoklismosHTML(sxesi[i]);
			break;
		}
		html += Sxesi.permesHTML(sxesi[i]);
		html += '</div>';
		html += '<div style="display: inline-block; cursor: pointer;" title="Πρόσκληση">';
		html += '<div class="sxesiData">' + sxesi[i].n + '</div>';
		html += '&nbsp;[&nbsp;<div class="sxesiData sxesi';
		switch (sxesi[i].s) {
		case 'F':		html += 'Filos'; break;
		case 'B':		html += 'Apoklismenos'; break;
		default:		html += 'Asxetos'; break;
		}
		html += '">' + sxesi[i].l + '</div>&nbsp;]</div>';
		html += '</div>'

		return html;
	};

	this.panel = function(login, attr) {
		var x = getelid('sx_' + login);
		if (isSet(x) && isSet(x.style) && isSet(x.style.display)) {
			if (isSet(attr)) {
				x.style.display = attr;
			}
			else {
				switch (x.style.display) {
				case 'inline-block':
					x.style.display = 'none';
					break;
				default:
					x.style.display = 'inline-block';
					break;
				}
			}
		}
	};

	this.addFilosHTML = function(s) {
		var html = '<img alt="" title="Ένταξη στους φίλους" class="sxesiIcon" src="' +
			globals.server + 'images/addFriend.png" />';
		return html;
	};

	this.apoklismosHTML = function(s) {
		var html = '<img alt="" title="Αποκλεισμός παίκτη" class="sxesiIcon" src="' +
			globals.server + 'images/blockPektis.png" />';
		return html;
	};

	this.aposisxetisiHTML = function(s) {
		var html = '<img alt="" title="Αποσυσχέτιση" class="sxesiIcon" src="' +
			globals.server + 'images/X' + (s.s == 'F' ? 'green' : 'red') +
			'.png" />';
		return html;
	};

	this.permesHTML = function(s) {
		var html = '<img alt="" title="Προσωπικό μήνυμα" class="sxesiIcon" src="' +
			globals.server + 'images/permes.png" />';
		return html;
	}
}
