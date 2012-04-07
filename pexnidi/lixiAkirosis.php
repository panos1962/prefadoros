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
	die("Δεν μπορείτε να καταργήσετε την ακύρωση κινήσεων ως θεατής");
}

Prefadoros::dianomi_check();
$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;

@mysqli_autocommit($globals->db, FALSE);
Prefadoros::klidose_trapezi();

// Εντοπίζουμε το record ακύρωσης της διανομής. Αν παρ' ελπίδα
// υπάρχουν περισσότερα από ένα τέτοια records, εντοπίζουμε το
// πρώτο χρονολογικά.

$akirosi = NULL;
$query = "SELECT `kodikos` FROM `kinisi` WHERE (`dianomi` = " .
	$dianomi . ") AND (`idos` = 'ΑΚΥΡΩΣΗ') ORDER BY `kodikos` DESC LIMIT 1";
$result = $globals->sql_query($query);
while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
	$akirosi = $row[0];
}

if (!isset($akirosi)) {
	Prefadoros::xeklidose_trapezi(FALSE);
	$globals->klise_fige('Δεν βρέθηκε εγγραφή ακύρωσης κινήσεων');
}

// Διαγράφουμε το record ακύρωσης κίνησης και όλα τα records κίνησης
// που παρ' ελπίδα προστέθηκαν μετά από αυτό.

$query = "DELETE FROM `kinisi` WHERE (`dianomi` = " . $dianomi .
	") AND (`kodikos` >= " . $akirosi . ")";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) < 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	$globals->klise_fige('Απέτυχε η κατάργηση ακύρωσης κινήσεων');
}

Prefadoros::xeklidose_trapezi(TRUE);
$globals->klise_fige();
