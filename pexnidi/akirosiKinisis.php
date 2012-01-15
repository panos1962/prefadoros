<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/dianomi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
if ($globals->trapezi->is_theatis()) {
	$globals->klise_fige("Δεν μπορείτε να ακυρώσετε κινήσεις ως θεατής");
}

Prefadoros::dianomi_check();
$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;

@mysqli_autocommit($globals->db, FALSE);
Prefadoros::klidose_trapezi();

// Ελέγχουμε πρώτα μήπως έχουμε ήδη ακύρωση σε εξέλιξη από κάποιον
// άλλον παίκτη.
$query = "SELECT `pektis` FROM `kinisi` WHERE (`dianomi` = " . $dianomi .
	") AND (`idos` = 'ΑΚΥΡΩΣΗ') LIMIT 1";
$result = @mysqli_query($globals->db, $query);
if (!$result) {
	Prefadoros::xeklidose_trapezi(FALSE);
	$globals->klise_fige("Απέτυχε έλεγχος ταυτόχρονης ακύρωσης");
}
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if ($row) {
	@mysqli_free_result($result);
	if ($row[0] != $globals->trapezi->thesi) {
		Prefadoros::xeklidose_trapezi(FALSE);
		$globals->klise_fige("Ακύρωση κινήσεων ήδη σε εξέλιξη!");
	}
}
else {
	$query = "INSERT INTO `kinisi` (`dianomi`, `pektis`, `idos`, `data`) " .
		"VALUES (" . $dianomi . ", " . $globals->trapezi->thesi . ", 'ΑΚΥΡΩΣΗ', '')";
	@mysqli_query($globals->db, $query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		Prefadoros::xeklidose_trapezi(FALSE);
		$globals->klise_fige("Απέτυχε η ακύρωση κίνησης");
	}
}

$query = "DELETE FROM `kinisi` WHERE (`dianomi` = " . $dianomi .
	") AND (`idos` NOT IN ('ΔΙΑΝΟΜΗ', 'ΑΚΥΡΩΣΗ')) ORDER BY `kodikos` DESC LIMIT 1";
@mysqli_query($globals->db, $query);
if (@mysqli_affected_rows($globals->db) != 1) {
	$query = "DELETE FROM `kinisi` WHERE (`dianomi` = " . $dianomi . ") AND (`idos` = 'ΑΚΥΡΩΣΗ')";
	@mysqli_query($globals->db, $query);
	Prefadoros::xeklidose_trapezi(TRUE);
	$globals->klise_fige('Δεν υπάχει κίνηση προς ακύρωση');
}

Prefadoros::xeklidose_trapezi(TRUE);
$globals->klise_fige();
