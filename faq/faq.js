var faq = {};

window.onload = function() {
	init();
	if (isSet(faq.spot)) { faq.anixeKlise(faq.spot); }
};

faq.anixeKlise = function(id) {
	var x = getelid(id);
	if (isSet(x)) {
		if (x.style.display == 'none') {
			x.style.display = 'inline';
		}
		else {
			x.style.display = 'none';
		}
	}
	return false;
}

faq.klise = function(div) {
	div = div.parentNode;
	if (notSet(div)) {
		return false;
	}

	div = div.parentNode;
	if (notSet(div)) {
		return false;
	}

	if (isSet(div)) {
		div.style.display = 'none';
	}

	return false;
}
