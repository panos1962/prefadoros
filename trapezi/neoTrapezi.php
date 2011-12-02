<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";
if (Prefadoros::set_trapezi()) {
	$globals->klise_fige('Πρέπει να εξέλθετε πρώτα από το τρέχον τραπέζι');
}

@mysqli_autocommit($globals->db, FALSE);

$query = "DELETE FROM `theatis` WHERE `pektis` = " . $slogin;
$globals->sql_query($query);

$query = "INSERT INTO `trapezi` (`pektis1`) VALUES (" . $slogin . ")";
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	@mysqli_rollback($globals->db);
	$globals->klise_fige('Απέτυχε η δημιουργία νέου τραπεζιού');
}

$trapezi = @mysqli_insert_id($globals->db);
$query = "INSERT INTO `prosklisi` (`pios`, `pion`, `trapezi`) " .
	"VALUES (" . $slogin . ", " . $slogin . ", " . $trapezi . ")";
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	@mysqli_rollback($globals->db);
	$globals->klise_fige('Απέτυχε η δημιουργία πρόσκλησης στο νέο τραπέζι');
}

@mysqli_commit($globals->db);
$globals->klise_fige();
?>
