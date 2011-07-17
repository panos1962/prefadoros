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
		html += '<div class="sxesiLine zebra' + (i % 2) + '"' +
			emfanesAfanesHTML(this) + '>';
		switch (sxesi[i].s) {
		case 'F':	html += Sxesi.filosHTML(sxesi[i]); break;
		case 'B':	html += Sxesi.apoklismenosHTML(sxesi[i]); break;
		default:	html += Sxesi.asxetosHTML(sxesi[i]); break;
		}
		html += '<img alt="" class="sxesiIcon" src="' +
			globals.server + 'images/' + 'permes' + '.png" /></td>';
		switch (sxesi[i].o) {
		case 1:		var ball = 'greenBall'; break;
		case 2:		ball = 'orangeBall'; break;
		default:	ball = false;
		}
		if (ball) {
			html += '<img alt="" class="sxesiDiathesimotita" src="' +
				globals.server + 'images/' + ball + '.png" /></td>';
		}

		html += '<div class="sxesiData">' + sxesi[i].n + '</div>';
		html += '&nbsp;[&nbsp;<div class="sxesiData sxesi';
		switch (sxesi[i].s) {
		case 'F':		html += 'Filos'; break;
		case 'B':		html += 'Apoklismenos'; break;
		default:		html += 'Asxetos'; break;
		}
		html += '">' + sxesi[i].l + '</div>&nbsp;]</div>';
		return html;
	};

	this.filosHTML = function(s) {
		var html = '';
		html += '<img alt="" class="sxesiIcon" src="' +
			globals.server + 'images/blockPektis.png" /></td>';
		html += '<img alt="" class="sxesiIcon" src="' +
			globals.server + 'images/Xgreen.png" /></td>';
		return html;
	};

	this.apoklismenosHTML = function(s) {
		var html = '';
		html += '<img alt="" class="sxesiIcon" src="' +
			globals.server + 'images/addFriend.png" /></td>';
		html += '<img alt="" class="sxesiIcon" src="' +
			globals.server + 'images/Xred.png" /></td>';
		return html;
	};

	this.asxetosHTML = function(s) {
		var html = '';
		html += '<img alt="" class="sxesiIcon" src="' +
			globals.server + 'images/addFriend' + '.png" /></td>';
		html += '<img alt="" class="sxesiIcon" src="' +
			globals.server + 'images/blockPektis.png" /></td>';
		return html;
	};
}
