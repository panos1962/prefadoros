<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
global $slogin;
$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

$pion = Globals::perastike_check('pion');

$filos = check_apoklismos($pion);
check_katastasi($pion, $filos);

$trapezi = vres_to_trapezi();

$query = "INSERT INTO `πρόσκληση` (`ποιος`, `ποιον`, `τραπέζι`) " .
	"VALUES (" . $slogin . ", '" . $globals->asfales($pion) .  "', " .
	$globals->asfales($trapezi) . ")";
@mysqli_query($globals->db, $query);
if (@mysqli_affected_rows($globals->db) != 1) {
	die('Μήπως έχετε ήδη στείλει πρόσκληση στον παίκτη "' .
		$_REQUEST['pion'] . '" για το τραπέζι ' . $trapezi . ';');
}

// Η function "check_katastasi" ελέγχει την κατάσταση του παίκτη που προσκαλούμε.
// Αν είναι διαθέσιμος, ή αν μας έχει στους φίλους, η πρόσκληση γίνεται δεκτή,
// αλλιώς το πρόγραμμα επιστρέφει με σχετικό μήνυμα.

function check_katastasi($pion, $filos) {
	$p = new Pektis($pion);
	switch ($p->katastasi) {
	case 'AVAILABLE': return;
	}

	if (!$filos) {
		die('Ο παίκτης "' . $pion . '" είναι απασχολημένος');
	}
}

// Η function "check_apoklismos" δέχεται το όνομα ενός παίκτης και ελέγχει αν
// ο παίκτης αυτός μας έχει αποκλείσει. Αν, όντως, είμαστε αποκλεισμένοι, τότε
// η πρόσκλησή μας δεν γίνεται δεκτή και το πρόγραμμα επιστρέφει με σχετικό
// μήνυμα. Σε άλλη περίπτωση, επιστρέφει TRUE εφόσον μας έχει στους φίλους,
// αλλιώς επιστρέφει FALSE.

function check_apoklismos($pion) {
	global $globals;
	global $slogin;
	$query = "SELECT `status` FROM `σχέση` WHERE `παίκτης` LIKE '" .
		$globals->asfales($pion) . "' AND `σχετιζόμενος` LIKE " . $slogin;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) { return(FALSE); }

	switch ($row[0]) {
	case 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ':
		die('Ο παίκτης "' . $pion . '" δεν αποδέχεται τις προσκλήσεις αυτή τη στιγμή');
	case 'ΦΙΛΟΣ':
		return(TRUE);
	default:
		return(FALSE);
	}
}

function vres_to_trapezi() {
	global $globals;

	Prefadoros::set_trapezi();
	if (!$globals->is_trapezi()) {
		die('Ακαθόριστο τραπέζι');
	}

	if ($globals->trapezi->is_pektis()) {
		return($globals->trapezi->kodikos);
	}

	if ($globals->trapezi->is_prosklisi()) {
		return($globals->trapezi->kodikos);
	}

	die('Δεν έχετε δικαίωμα πρόσκλησης παικτών σε αυτό το τραπέζι');
}

?>
