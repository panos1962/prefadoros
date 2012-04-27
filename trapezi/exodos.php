<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
$trapezi = $globals->trapezi->kodikos;
if (Globals::perastike('deleteProsklisi')) {
	delete_prosklisi();
}

Prefadoros::klidose_trapezi();
Prefadoros::xeklidose_trapezi(Prefadoros::exodos());
Prefadoros::set_trapezi_dirty($trapezi);
@mysqli_commit($globals->db);
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

	$proti_exodos = FALSE;
	if ($pektes != "") {
		$query = "UPDATE IGNORE `prosklisi` SET `pios` = '" . SYSTEM_ACCOUNT .
			"' WHERE (`trapezi` = " . $globals->trapezi->kodikos .
			") AND (`pion` IN (" . $pektes . "))";
		@mysqli_query($globals->db, $query);
		$proti_exodos = (@mysqli_affected_rows($globals->db) > 0);
	}

	// Στο δεύτερο μέρος διαγράφονται όλες οι υπόλοιπες προσκλήσεις.

	$query = "DELETE FROM `prosklisi` WHERE (`trapezi` = " . $globals->trapezi->kodikos .
		") AND (`pios` <> BINARY '" . SYSTEM_ACCOUNT . "')";
	@mysqli_query($globals->db, $query);

	if ($proti_exodos) {
		$query = "INSERT INTO `sizitisi` (`pektis`, `trapezi`, `sxolio`) VALUES (" .
			$globals->pektis->slogin . ", " . $globals->trapezi->kodikos .
			", '<img src=\"images/theEnd.gif\" />')";
		@mysqli_query($globals->db, $query);
	}
}
?>
