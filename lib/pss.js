var pss = new function() {
	this.prosklisi = { size: 1 };
	this.sxesi = { size: 1 };
	this.sizitisi = { size: 1 };

	this.prosklisi.afxisi = function(ico) {
		Sizitisi.sxolioFocus();
		if (pss.prosklisi.size < 3) {
			pss.prosklisi.size++;
			if (pss.sxesi.size > pss.sizitisi.size) {
				pss.sxesi.size--;
			}
			else if (pss.sizitisi.size > pss.sxesi.size) {
				pss.sizitisi.size--;
			}
			else if (pss.sxesi.size > 0) {
				pss.sxesi.size--;
			}
			else if (pss.sizitisi.size > 0) {
				pss.sizitisi.size--;
			}
			pss.resize();
		}
		else {
			playSound('beep');
			errorIcon(ico);
		}
	};

	this.prosklisi.miosi = function(ico) {
		Sizitisi.sxolioFocus();
		if (pss.prosklisi.size > 0) {
			pss.prosklisi.size--;
			if (pss.sxesi.size < pss.sizitisi.size) {
				pss.sxesi.size++;
			}
			else if (pss.sizitisi.size < pss.sxesi.size) {
				pss.sizitisi.size++;
			}
			else if (pss.sizitisi.size < 3) {
				pss.sizitisi.size++;
			}
			else if (pss.sxesi.size < 3) {
				pss.sxesi.size++;
			}
			pss.resize();
		}
		else {
			playSound('beep');
			errorIcon(ico);
		}
	};

	this.sxesi.afxisi = function(ico) {
		Sizitisi.sxolioFocus();
		if (pss.sxesi.size < 3) {
			pss.sxesi.size++;
			if (pss.prosklisi.size > pss.sizitisi.size) {
				pss.prosklisi.size--;
			}
			else if (pss.sizitisi.size > pss.prosklisi.size) {
				pss.sizitisi.size--;
			}
			else if (pss.prosklisi.size > 0) {
				pss.prosklisi.size--;
			}
			else if (pss.sizitisi.size > 0) {
				pss.sizitisi.size--;
			}
			pss.resize();
		}
		else {
			playSound('beep');
			errorIcon(ico);
		}
	};

	this.sxesi.miosi = function(ico) {
		Sizitisi.sxolioFocus();
		if (pss.sxesi.size > 0) {
			pss.sxesi.size--;
			if (pss.prosklisi.size < pss.sizitisi.size) {
				pss.prosklisi.size++;
			}
			else if (pss.sizitisi.size < pss.prosklisi.size) {
				pss.sizitisi.size++;
			}
			else if (pss.sizitisi.size < 3) {
				pss.sizitisi.size++;
			}
			else if (pss.prosklisi.size < 3) {
				pss.prosklisi.size++;
			}
			pss.resize();
		}
		else {
			playSound('beep');
			errorIcon(ico);
		}
	};

	this.sizitisi.afxisi = function(ico) {
		Sizitisi.sxolioFocus();
		if (pss.sizitisi.size < 3) {
			pss.sizitisi.size++;
			if (pss.prosklisi.size > pss.sxesi.size) {
				pss.prosklisi.size--;
			}
			else if (pss.sxesi.size > pss.prosklisi.size) {
				pss.sxesi.size--;
			}
			else if (pss.prosklisi.size > 0) {
				pss.prosklisi.size--;
			}
			else if (pss.sxesi.size > 0) {
				pss.sxesi.size--;
			}
			pss.resize();
		}
		else {
			playSound('beep');
			errorIcon(ico);
		}
	};

	this.sizitisi.miosi = function(ico) {
		Sizitisi.sxolioFocus();
		if (pss.sizitisi.size > 0) {
			pss.sizitisi.size--;
			if (pss.prosklisi.size < pss.sxesi.size) {
				pss.sxesi.size++;
			}
			else if (pss.sxesi.size < pss.prosklisi.size) {
				pss.sxesi.size++;
			}
			else if (pss.sxesi.size < 3) {
				pss.sxesi.size++;
			}
			else if (pss.prosklisi.size < 3) {
				pss.prosklisi.size++;
			}
			pss.resize();
		}
		else {
			playSound('beep');
			errorIcon(ico);
		}
	};

	this.resize = function(noKeep) {
		if (notSet(noKeep)) {
			pss.prosklisi.curSize = pss.prosklisi.size;
			pss.sxesi.curSize = pss.sxesi.size;
			pss.sizitisi.curSize = pss.sizitisi.size;
		}

		switch (pss.prosklisi.size) {
		case 0:
			pss.prosklisi.height = 0;
			break;
		case 1:
			pss.prosklisi.height = 3;
			break;
		case 2:
			pss.prosklisi.height = 6.3
			break;
		case 3:
			pss.prosklisi.height = 11;
			break;
		}
		switch (pss.sizitisi.size) {
		case 0:
			pss.sizitisi.height = 0;
			break;
		case 1:
			pss.sizitisi.height = 4.7;
			break;
		case 2:
			pss.sizitisi.height = 8;
			break;
		case 3:
			pss.sizitisi.height = 11;
			break;
		}
		switch (pss.sxesi.size) {
		case 0:
			pss.sxesi.height = 0;
			break;
		case 1:
			pss.sxesi.height = 3.3;
			break;
		case 2:
			pss.sxesi.height = 11 - pss.prosklisi.height - pss.sizitisi.height;
			break;
		case 3:
			pss.sxesi.height = 11;
			break;
		}
		var x = getelid('prosklisiArea');
		if (isSet(x)) {
			x.style.height = pss.prosklisi.height + 'cm';
			x.style.maxHeight = pss.prosklisi.height + 'cm';
		}
		x = getelid('sxesiArea');
		if (isSet(x)) {
			x.style.height = pss.sxesi.height + 'cm';
			x.style.maxHeight = pss.sxesi.height + 'cm';
		}
		x = getelid('sizitisiArea');
		if (isSet(x)) {
			x.style.height = pss.sizitisi.height + 'cm';
			x.style.maxHeight = pss.sizitisi.height + 'cm';
		}
	};

	this.zoomChat = function(on) {
		if (on) {
			pss.prosklisi.curSize = pss.prosklisi.size;
			pss.prosklisi.size = 0;
			pss.sxesi.curSize = pss.sxesi.size;
			pss.sxesi.size = 0;
			pss.sizitisi.curSize = pss.sizitisi.size;
			pss.sizitisi.size = 3;
		}
		else {
			pss.prosklisi.size = pss.prosklisi.curSize;
			pss.sxesi.size = pss.sxesi.curSize;
			pss.sizitisi.size = pss.sizitisi.curSize;
		}
		pss.resize(true);
	};
};
