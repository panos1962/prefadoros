<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
global $trapezi;
$trapezi = Globals::perastike_check('trapezi');
global $strapezi;
$strapezi = $globals->asfales($trapezi);
check_pektis();

$query = "SELECT `τραπέζι` FROM `θεατής` WHERE `παίκτης` LIKE " .
	$globals->pektis->slogin;
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if ($row) {
	@mysqli_free_result($result);
	if ($row[0] == $trapezi) {
		$query = "DELETE FROM `θεατής` WHERE `παίκτης` LIKE " .
			$globals->pektis->slogin;
	}
	else {
		check_prosvasi();
		$query = "UPDATE `θεατής` SET `τραπέζι` = " . $strapezi .
			" WHERE `παίκτης` LIKE " . $globals->pektis->slogin;
	}
}
else {
	check_prosvasi();
	$query = "INSERT INTO `θεατής` (`παίκτης`, `τραπέζι`, `θέση`) " .
		"VALUES (" . $globals->pektis->slogin . ", " . $strapezi . ", 1)";
}
$globals->sql_query($query);

function check_pektis() {
	global $globals;
	global $trapezi;
	global $strapezi;

	$query = "SELECT `παίκτης1`, `παίκτης2`, `παίκτης3` " .
		"FROM `τραπέζι` WHERE `κωδικός` = " . $strapezi;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		die('Δεν βρέθηκε το τραπέζι');
	}

	@mysqli_free_result($result);
	for ($i = 0; $i < 3; $i++) {
		if ($row[$i] == $globals->pektis->login) {
			die('Συμμετέχετε ως παίκτης στο τραπέζι ' . $trapezi .
				'. Δοκιμάστε από το control panel.');
		}
	}
}

function check_prosvasi() {
	global $globals;
	global $trapezi;
	global $strapezi;

	$query = "SELECT * FROM `πρόσκληση` WHERE " .
		"(`ποιον` LIKE " . $globals->pektis->slogin . ") AND " .
		"(`τραπέζι` = " . $strapezi . ")";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if ($row) {
		@mysqli_free_result($result);
		return;
	}

	$query = "SELECT `ιδιωτικότητα` FROM `τραπέζι` " .
		"WHERE `κωδικός` = " . $strapezi;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		die('Δεν βρέθηκε το τραπέζι');
	}

	@mysqli_free_result($result);
	if ($row[0] != 'ΔΗΜΟΣΙΟ') {
		die("Το τραπέζι " . $trapezi . " είναι πριβέ");
	}
}
?>
