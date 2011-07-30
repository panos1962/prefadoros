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
global $trapezi;
$trapezi = trapezi_prosklisis();
global $trapezi;
$strapezi = $globals->asfales($trapezi);

@mysqli_autocommit($globals->db, FALSE);
Prefadoros::set_trapezi();
if ($globals->is_trapezi()) {
	if ($globals->trapezi->kodikos == $trapezi) {
		@mysqli_rollback($globals->db);
		die('Συμμετέχετε ήδη στο τραπέζι ' . $trapezi);
	}

	if (!Prefadoros::exodos()) {
		@mysqli_rollback($globals->db);
		die('Απέτυχε η έξοδος του παίκτη "' . $globals->pektis->login .
			'" από το τραπέζι ' . $globals->trapezi->kodikos);
	}
}

$query = "SELECT `τέλος`, `παίκτης1`, `παίκτης2`, `παίκτης3` " .
	"FROM `τραπέζι` WHERE `κωδικός` = " . $strapezi;
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if (!$row) {
	@mysqli_rollback($globals->db);
	die('Δεν βρέθηκε το τραπέζι ' . $trapezi);
}

@mysqli_free_result($result);
if ($row[0]) {
die('@' . $row[0] . '@');
	@mysqli_rollback($globals->db);
	die('Το τραπέζι έχει κλείσει');
}

$thesi = vres_simetoxi();
for ($i = 0; $i < 3; $i++) {
	if (!$row[$thesi]) { break; }
	$thesi++;
	if ($thesi > 3) { $thesi = 1; }
}
if ($i >= 3) {
	gine_theatis();
}
else {
	gine_pektis($thesi);
}
@mysqli_commit($globals->db);

function gine_theatis() {
	global $globals;
	global $slogin;
	global $trapezi;
	global $strapezi;

	$query = "DELETE FROM `θεατής` WHERE `παίκτης` LIKE " . $slogin;
	$globals->sql_query($query);

	$query = "INSERT INTO `θεατής` (`τραπέζι`, `θέση`, `παίκτης`) " .
		"VALUES (" . $strapezi . ", 1, " . $slogin . ")";
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		@mysqli_rollback($globals->db);
		die('Απέτυχε η ένταξη του παίκτη "' . $globals->pektis->login .
			'" στο τραπέζι ' . $trapezi . ' ως θεατή');
	}
}

function gine_pektis($thesi) {
	global $globals;
	global $slogin;
	global $trapezi;
	global $strapezi;

	$query = "UPDATE `τραπέζι` SET `παίκτης" . $thesi . "` = " .
		$slogin . " WHERE (`κωδικός` = " . $strapezi .
		") AND (`παίκτης" . $thesi . "` IS NULL)";
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		@mysqli_rollback($globals->db);
		die('Απέτυχε η ένταξη του παίκτη "' . $globals->pektis->login .
			'" στο τραπέζι ' . $trapezi);
	}
}

function trapezi_prosklisis() {
	global $globals;
	$prosklisi = Globals::perastike_check('prosklisi');
	$query = "SELECT * FROM `πρόσκληση` WHERE `κωδικός` = " .
		$globals->asfales($_REQUEST['prosklisi']);
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_ASSOC);
	if (!$row) {
		die('Δεν βρέθηκε η πρόσκληση ' . $prosklisi);
	}

	@mysqli_free_result($result);
	if ($row['ποιον'] != $globals->pektis->login) {
		die('Η πρόσκληση δεν σας αφορά');
	}

	return($row['τραπέζι']);
}

function vres_simetoxi() {
	global $globals;
	global $slogin;
	global $strapezi;

	$query = "SELECT `θέση` FROM `συμμετοχή` WHERE " .
		"(`τραπέζι` = " . $strapezi . ") AND " .
		"(`παίκτης` LIKE " . $slogin . ")";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result);
	if (!$row) { return 1; }

	@mysqli_free_result($result);
	return($row[0]);
}
?>
