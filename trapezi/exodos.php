<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
if (Globals::perastike('deleteProsklisi')) {
	delete_prosklisi();
}

Prefadoros::klidose_trapezi();

// Εξαναγκάζουμε ενημέρωση για ρέμπελους και καφενείο, ώστε να φανεί η αποχώρηση
// του θεατή από το τραπέζι, αλλιώς θα συνεχίσει να φαίνεται μέσα.

Prefadoros::set_trapezi_dirty($globals->trapezi->kodikos);

Prefadoros::xeklidose_trapezi(Prefadoros::exodos());
$globals->klise_fige();

// Κατά την έξοδο που κάνουν οι παίκτες στο τέλος του παιχνιδιού, διαγράφονται
// οι προσκλήσεις που δεν απευθύνονται στους παίκτες του τραπεζιού, ώστε να μην
// μπορούν άλλοι παίκτες που είχαν πρόσκληση να εισέλθουν στο τραπέζι μετά την
// αποχώρηση των παικτών. Οι υπάρχουσες προσκλήσεις προς τους παίκτες του τραπεζιού
// υιοθετούνται από τον system account "www.prefadoros.gr".

function delete_prosklisi() {
	global $globals;

	// Στο πρώτο μέρος επιχειρείται η υιοθεσία των προσκλήσεων που
	// απευθύνονται προς τους παίκτες του τραπεζιού από τον system
	// account "www.prefadoros.gr".

	$pektis1 = $globals->trapezi->pektis1;
	$pektis2 = $globals->trapezi->pektis2;
	$pektis3 = $globals->trapezi->pektis3;

	$pektes = "";
	$koma = "";
	for ($i = 1; $i <= 3; $i++) {
		$pektis = "pektis" . $i;
		if ($$pektis <> "") {
			$pektes .= $koma . "'" . $$pektis . "'";
			$koma = ", ";
		}
	}

	if ($pektes != "") {
		$query = "UPDATE IGNORE `prosklisi` SET `pios` = '" . SYSTEM_ACCOUNT .
			"' WHERE (`trapezi` = " . $globals->trapezi->kodikos .
			") AND (`pion` IN (" . $pektes . "))";
		mysqli_query($globals->db, $query);
	}

	// Στο δεύτερο μέρος διαγράφονται όλες οι υπόλοιπες προσκλήσεις.

	$query = "DELETE FROM `prosklisi` WHERE (`trapezi` = " . $globals->trapezi->kodikos .
		") AND (`pios` <> BINARY '" . SYSTEM_ACCOUNT . "')";
	mysqli_query($globals->db, $query);
}
?>
