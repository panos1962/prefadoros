var pss = {
	prosklisi:	{
		size:		1
	},
	sxesi:	{
		size:		1
	},
	sizitisi:	{
		size:		1
	}
};

pss.onload = function() {
	this.prosklisi.afxisi = function(ico) {
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
	pss.prosklisi.miosi = function(ico) {
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
	pss.sxesi.afxisi = function(ico) {
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
	pss.sxesi.miosi = function(ico) {
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
	pss.sizitisi.afxisi = function(ico) {
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
	pss.sizitisi.miosi = function(ico) {
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
	pss.resize = function() {
		switch (pss.prosklisi.size) {
		case 0:
			pss.prosklisi.height = 0;
			break;
		case 1:
			pss.prosklisi.height = 3;
			break;
		case 2:
			pss.prosklisi.height = 7;
			break;
		case 3:
			pss.prosklisi.height = 11;
			break;
		}
		switch (pss.sxesi.size) {
		case 0:
			pss.sxesi.height = 0;
			break;
		case 1:
			pss.sxesi.height = 4;
			break;
		case 2:
			if (pss.prosklisi.size < 1) {
				pss.sxesi.height = 7;
			}
			else {
				pss.sxesi.height = 8;
			}
			break;
		case 3:
			pss.sxesi.height = 11;
			break;
		}
		switch (pss.sizitisi.size) {
		case 0:
			pss.sizitisi.height = 0;
			break;
		case 1:
			pss.sizitisi.height = 4;
			break;
		case 2:
			if (pss.prosklisi.size < 1) {
				pss.sizitisi.height = 7;
			}
			else {
				pss.sizitisi.height = 8;
			}
			break;
		case 3:
			pss.sizitisi.height = 11;
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
};
