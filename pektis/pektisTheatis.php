<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
global $slogin;
$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

if (!Prefadoros::set_trapezi()) {
	die('Ακαθόριστο τραπέζι');
}

@mysqli_autocommit($globals->db, FALSE);
if ($globals->trapezi->simetoxi == 'ΠΑΙΚΤΗΣ') {
	apo_pektis_theatis();
}
else {
	apo_theatis_pektis();
}
@mysqli_commit($globals->db);

function apo_pektis_theatis() {
	global $globals;
	global $slogin;

	$query = "DELETE FROM `θεατής` WHERE `παίκτης` LIKE " . $slogin;
	$globals->sql_query($query);

	$query = "DELETE FROM `συμμετοχή` WHERE (`τραπέζι` = " .
		$globals->trapezi->kodikos . ") AND (`παίκτης` LIKE " .
		$slogin . ")";
	$globals->sql_query($query);

	$query = "INSERT INTO `συμμετοχή` (`τραπέζι`, `θέση`, `παίκτης`) " .
		"VALUES (" . $globals->trapezi->kodikos . ", " .
		$globals->trapezi->thesi . ", " . $slogin . ")";
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		@mysqli_rollback($globals->db);
		die('Απέτυχε η εισαγωγή συμμετοχής');
	}

	$query = "INSERT INTO `θεατής` (`παίκτης`, `τραπέζι`, `θέση`) " .
		"VALUES (" . $slogin . ", " . $globals->trapezi->kodikos .
		", " . $globals->trapezi->thesi . ")";
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		@mysqli_rollback($globals->db);
		die('Απέτυχε η δημιουργία θεατή');
	}

	$query = "UPDATE `τραπέζι` SET `παίκτης" . $globals->trapezi->thesi .
		"` = NULL WHERE `κωδικός` = " . $globals->trapezi->kodikos;
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		@mysqli_rollback($globals->db);
		die('Απέτυχε η εκκένωση της θέσης');
	}
}

function apo_theatis_pektis() {
	global $globals;
	global $slogin;

	if (!$globals->trapezi->is_prosklisi()) {
		@mysqli_rollback($globals->db);
		die('Δεν έχετε προσκληθεί στο τραπέζι');
	}

	$query = "DELETE FROM `θεατής` WHERE `παίκτης` LIKE " . $slogin;
	$globals->sql_query($query);
	if (mysqli_affected_rows($globals->db) != 1) {
		@mysqli_rollback($globals->db);
		die('Απέτυχε η διαγραφή θεατή');
	}

	$query = "SELECT `θέση` FROM `συμμετοχή` WHERE `τραπέζι` = " .
		$globals->trapezi->kodikos . " AND `παίκτης` = " . $slogin;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if ($row) {
		@mysqli_free_result($result);
		$thesi = $row[0];
		$query = "DELETE FROM `συμμετοχή` WHERE `τραπέζι` = " .
			$globals->trapezi->kodikos . " AND `παίκτης` = " .
			$slogin . " AND `θέση` = " . $thesi;
		$globals->sql_query($query);
	}
	else {
		$thesi = 1;
	}

	$nok = TRUE;
	for ($i = 0; $i < 3; $i++) {
		$query = "UPDATE `τραπέζι` SET `παίκτης" . $thesi . "` = " .
			$slogin . " WHERE `κωδικός` = " . $globals->trapezi->kodikos .
			" AND `παίκτης" . $thesi . "` IS NULL";
		$globals->sql_query($query);
		if (@mysqli_affected_rows($globals->db) == 1) {
			$nok = FALSE;
			break;
		}

		$thesi++;
		if ($thesi > 3) { $thesi = 1; }
	}

	if ($nok) {
		@mysqli_rollback($globals->db);
		die('Δεν υπάρχει κενή θέση στο τραπέζι');
	}
}
?>
