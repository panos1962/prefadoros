window.onload = function() {
	stixisi();
}

window.onunload = function() {
	var w = window.opener;
	if (notSet(w)) { return; }
	if (notSet(w.controlPanel)) { return; }
	w.controlPanel.kliseKitapi();
}

// Μετά την εμφάνιση του φύλλου αγώνα, υπάρχει περίπτωση σε κάποια
// από τις στήλες καπικιών 3-1 (πάνω αριστερά) και 2-1 (πάνω δεξιά)
// που αφορούν τις δοσοληψίες των παικτών 3 και 1, και 2 και 1 από
// την πλευρά των παικτών 3 και 2 αντίστοιχα να έχουν αποκτήσει μεγάλο
// ύψος εξαιτίας μεγάλου πλήθους δοσοληψιών. Σε αυτήν την περίπτωση
// και εφόσον το ύψος αυτό υπερβαίνει το default ύψος των στηλών αυτών,
// θα πρέπει να το αυξήσουμε ώστε να γίνει σωστά το bottom vertical
// alignment, καθώς οι στήλες αυτές πρέπει να στοιχίζονται προς τα κάτω
// και να "ακουμπούν" στην οριζόντια διαχωριστική γραμμή. Για το σκοπό,
// "μετράμε" το ύψος των στηλών 3-1, 3-2, 2-3 και 2-1, όπως επίσης και
// το ύψος των κασών 3 και 2, και θέτουμε σε όλες το μέγιστο ύψος που
// θα προκύψει. Ακριβώς για το λόγο αυτό έχουμε δώσει ids στις στήλες
// αυτές.

function stixisi() {
	var w = window.opener;
	if (notSet(w) || notSet(w.controlPanel)) {
		window.close();
		return;
	}

	w.controlPanel.kitapiWindow = window;
	var maxh = -1;
	for (var i = 0; i < 6; i++) {
		var k = getelid('ks' + i);
		if (isSet(k) && isSet(k.clientHeight)) {
			if (k.clientHeight > maxh) {
				maxh = k.clientHeight;
			}
		}
	}

	if (maxh > 0) {
		for (i = 0; i < 4; i++) {
			k = getelid('ks' + i);
			if (isSet(k)) {
				k.style.height = maxh + 'px';
				k.innerHTML = k.innerHTML;
			}
		}
	}
};
