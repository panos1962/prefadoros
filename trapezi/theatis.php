<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
require_once '../prefadoros/sizitisi.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
global $trapezi;
$trapezi = Globals::perastike_check('trapezi');
global $strapezi;
$strapezi = $globals->asfales($trapezi);

// Εαν επιτύχουμε να γίνουμε παίκτες στο επιθυμητό τραπέζι,
// τότε θα τυπωθεί το μήνυμα "partida", ώστε κατά την επιστροφή
// να μεταβούμε σε mode τραπεζιού και να εμφανιστεί απευθείας
// το επιθυμητό τραπέζι.
$partida = FALSE;

@mysqli_autocommit($globals->db, FALSE);

// Πρώτα ελέγχουμε αν ο παίκτης συμμετέχει ήδη στο επιθυμητό τραπέζι.
check_pektis();

// Εντοπίζουμε τυχόν υπάρχουσα εγγραφή του παίκτη ως θεατή.
$query = "SELECT `trapezi` FROM `theatis` WHERE `pektis` = BINARY " .
	$globals->pektis->slogin;
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if ($row) {
	@mysqli_free_result($result);

	// Αν ο παίκτης είναι ήδη θεατής στο τραπέζι, τότε απλώς παύει
	// να είναι θεατής. Αν είναι θεατής σε άλλο τραπέζι, τότε τον
	// κάνουμε θεατή στο επιθυμητό τραπέζι.

	if ($row[0] == $trapezi) {
		$query = "DELETE FROM `theatis` WHERE `pektis` = BINARY " .
			$globals->pektis->slogin;
	}
	else {
		check_prosvasi();
		$query = "UPDATE `theatis` SET `trapezi` = " . $strapezi .
			" WHERE `pektis` = BINARY " . $globals->pektis->slogin;
		$partida = TRUE;
	}
}
else {
	// Ο παίκτης δεν είναι θεατής σε κάποιο τραπέζι, οπότε απλώς
	// τον τοποθετούμε ως θεατή στο επιθυμητό τραπέζι.

	check_prosvasi();
	$query = "INSERT INTO `theatis` (`pektis`, `trapezi`, `thesi`) " .
		"VALUES (" . $globals->pektis->slogin . ", " . $strapezi . ", 1)";
	$partida = TRUE;
}
$globals->sql_query($query);
Prefadoros::set_trapezi_dirty($trapezi);
@mysqli_commit($globals->db);

if ($partida) {
	check_idio_ip();
	print 'partida';
}
$globals->klise_fige();

// Εαν ο παίκτης συμμετέχει στο τραπέζι στο οποίο ζητά να γίνει
// θεατής, τότε διαγράφουμε τυχόν άλλη συμμετοχή του παίκτη ως
// θεατή σε άλλο τραπέζι και επιστρέφουμε σε mode τραπεζιού.
// Εκεί ο παίκτης μπορεί με ασφάλεια να εναλλάσσει τη συμμετοχή
// του ως παίκτης ή θεατής χρησιμοποιώντας το σχεστικό κουμπί
// του control panel.

function check_pektis() {
	global $globals;
	global $trapezi;
	global $strapezi;

	$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` " .
		"FROM `trapezi` WHERE `kodikos` = " . $strapezi;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		$globals->klise_fige('Δεν βρέθηκε το τραπέζι');
	}

	@mysqli_free_result($result);
	for ($i = 1; $i <= 3; $i++) {
		if ($row[$i] == $globals->pektis->login) {
			$query = "DELETE FROM `theatis` WHERE `pektis` = BINARY " .
				$globals->pektis->slogin;
			$globals->sql_query($query);
			@mysqli_commit($globals->db);
			$globals->klise_fige('partida');
		}
	}
}

function check_prosvasi() {
	global $globals;
	global $trapezi;
	global $strapezi;

	$query = "SELECT * FROM `prosklisi` WHERE " .
		"(`pion` = BINARY " . $globals->pektis->slogin . ") AND " .
		"(`trapezi` = " . $strapezi . ")";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if ($row) {
		@mysqli_free_result($result);
		return;
	}

	$query = "SELECT `idiotikotita` FROM `trapezi` " .
		"WHERE `kodikos` = " . $strapezi;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		$globals->klise_fige('Δεν βρέθηκε το τραπέζι');
	}

	@mysqli_free_result($result);
	if ($row[0] != 'ΔΗΜΟΣΙΟ') {
		$globals->klise_fige("Το τραπέζι " . $trapezi . " είναι πριβέ");
	}
}

function check_idio_ip() {
	global $globals;
	global $trapezi;
	global $strapezi;

	if ($globals->pektis->login == SYSTEM_ACCOUNT) {
		return;
	}

	$query = "SELECT `ip` FROM `sinedria` WHERE `pektis` = BINARY " .
		$globals->pektis->slogin;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		return;
	}
	@mysqli_free_result($result);

	$prothema1 = "Ο θεατής <strong>" . $globals->pektis->login .
		"</strong> ίσως βρίσκεται στον ίδιο φυσικό χώρο με ";
	$pektes = NULL;
	$query = "SELECT `pektis` FROM `sinedria` WHERE `ip` = BINARY '" . $row[0] . "'";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		if ($row[0] == $globals->pektis->login) {
			continue;
		}

		if (isset($pektes)) {
			$prothema2 = "τους παίκτες ";
			$pektes .= ", <strong>" . $row[0] . "</strong>";
		}
		else {
			$prothema2 = "τον παίκτη ";
			$pektes = "<strong>" . $row[0] . "</strong>";
		}
	}

	if (!isset($pektes)) {
		return;
	}

	$query = "INSERT INTO `sizitisi` (`pektis`, `trapezi`, `sxolio`) " .
		"VALUES ('" . SYSTEM_ACCOUNT . "', " . $strapezi . ", '" .
		$globals->asfales($prothema1 . $prothema2 . $pektes) . ".')";
	@mysqli_query($globals->db, $query);
	Sizitisi::set_dirty(TRUE, $trapezi);
	@mysqli_commit($globals->db);
}

?>
